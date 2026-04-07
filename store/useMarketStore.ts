import { create } from "zustand";
import { Candle } from "@/components/trading/CandleChart";
import { MOCK_ASSETS } from "@/lib/data/symbols";
import { generateTick, MarketState, updateCandle, createNewCandle, calculateTickVolume } from "@/lib/trading/marketEngine";
import { useTradingStore } from "./useTradingStore";

export type MarketRegime = "TRENDING" | "RANGING" | "BREAKOUT";

export interface AssetProfile {
  volatilityMultiplier: number;
  trendBias: number;
  resistanceLevels: number[];
  supportLevels: number[];
}

export interface EnhancedMarketState extends MarketState {
  regime: MarketRegime;
  regimeCountdown: number; // Ticks until next regime switch
  lastMove: number;
}

interface MarketStore {
  // State
  prices: Record<string, number>;
  candles: Record<string, Candle[]>; // key: `${symbol}_${timeframe}`
  states: Record<string, EnhancedMarketState>;
  isInitialized: boolean;

  // Actions
  init: () => void;
  tick: () => void;
  applyOrderImpact: (symbol: string, side: "buy" | "sell", qty: number) => void;
}

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "1D"];
const ASSET_PROFILES: Record<string, AssetProfile> = {
  AAPL: { volatilityMultiplier: 0.8, trendBias: 0.02, resistanceLevels: [185, 190], supportLevels: [175, 170] },
  BTC: { volatilityMultiplier: 2.5, trendBias: 0.05, resistanceLevels: [70000, 72000], supportLevels: [65000, 60000] },
  ETH: { volatilityMultiplier: 2.2, trendBias: 0.04, resistanceLevels: [3800, 4000], supportLevels: [3200, 3000] },
  DEFAULT: { volatilityMultiplier: 1.0, trendBias: 0.01, resistanceLevels: [], supportLevels: [] },
};

export const useMarketStore = create<MarketStore>((set, get) => ({
  prices: {},
  candles: {},
  states: {},
  isInitialized: false,

  init: () => {
    if (get().isInitialized) return;

    const initialPrices: Record<string, number> = {};
    const initialStates: Record<string, EnhancedMarketState> = {};
    const initialCandles: Record<string, Candle[]> = {};

    MOCK_ASSETS.forEach((asset) => {
      const symbol = asset.symbol;
      initialPrices[symbol] = asset.price;
      
      initialStates[symbol] = {
        currentPrice: asset.price,
        trend: 0,
        volatility: 0.0004,
        lastTickTime: Date.now(),
        regime: "RANGING",
        regimeCountdown: Math.floor(Math.random() * 50) + 50,
        lastMove: 0,
      };

      // Seed historical data for all timeframes
      TIMEFRAMES.forEach((tf) => {
        const key = `${symbol}_${tf}`;
        const tfSecs = getTimeframeSeconds(tf);
        const candleCount = 150;
        const currentPeriod = Math.floor(Date.now() / 1000 / tfSecs) * tfSecs;
        
        const history: Candle[] = [];
        let currentClose = asset.price;
        
        for (let i = 0; i < candleCount; i++) {
          const cTime = currentPeriod - (i * tfSecs);
          const volatility = currentClose * 0.003; // Smooth background history
          const open = currentClose + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, currentClose) + Math.random() * volatility * 0.5;
          const low = Math.min(open, currentClose) - Math.random() * volatility * 0.5;
          
          history.unshift({
            time: cTime,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(currentClose.toFixed(2)),
            volume: Math.floor(Math.random() * 8000) + 1000
          });
          currentClose = open;
        }
        
        initialCandles[key] = history;
      });
    });

    set({ 
      prices: initialPrices, 
      states: initialStates, 
      candles: initialCandles,
      isInitialized: true 
    });

    // Start Single Global Loop
    setInterval(() => {
      get().tick();
    }, 300);
  },

  tick: () => {
    const { states, candles, prices } = get();
    const newPrices = { ...prices };
    const newStates = { ...states };
    const newCandles = { ...candles };

    MOCK_ASSETS.forEach((asset) => {
      const symbol = asset.symbol;
      const state = states[symbol];
      const profile = ASSET_PROFILES[symbol] || ASSET_PROFILES.DEFAULT;

      // 1. ADVANCED LOGIC: Regime Switching
      let regime = state.regime;
      let countdown = state.regimeCountdown - 1;
      if (countdown <= 0) {
        const regimes: MarketRegime[] = ["TRENDING", "RANGING", "BREAKOUT"];
        regime = regimes[Math.floor(Math.random() * regimes.length)];
        countdown = Math.floor(Math.random() * 100) + 50;
      }

      // 2. TICKET GENERATION (with physics)
      let { newPrice, newTrend, delta } = generateTick(state);

      // Apply regime modifiers
      if (regime === "TRENDING") delta *= 1.5;
      if (regime === "BREAKOUT") delta *= 3.0;
      if (regime === "RANGING") delta *= 0.5;

      // Apply Profile volatility
      delta *= profile.volatilityMultiplier;

      // S/R Influence (Repulsion)
      profile.resistanceLevels.forEach(res => {
        if (newPrice > res - (res * 0.001) && delta > 0) delta *= -0.5; // Bounce off resistance
      });
      profile.supportLevels.forEach(sup => {
        if (newPrice < sup + (sup * 0.001) && delta < 0) delta *= -0.5; // Bounce off support
      });

      newPrice = parseFloat((state.currentPrice + delta).toFixed(2));

      // 3. INTERNAL VALIDATION LAYER
      if (isNaN(newPrice) || !isFinite(newPrice) || newPrice <= 0) newPrice = state.currentPrice;
      const jumpPercent = Math.abs(newPrice - state.currentPrice) / state.currentPrice;
      if (jumpPercent > 0.02) newPrice = state.currentPrice; // STRICT CLAMP 2% max per tick

      newPrices[symbol] = newPrice;
      newStates[symbol] = {
        ...state,
        currentPrice: newPrice,
        trend: newTrend,
        regime,
        regimeCountdown: countdown,
        prevDelta: delta,
        lastMove: delta,
      };

      // 4. CANDLE AGGREGATION (Multi-timeframe)
      const tickVol = calculateTickVolume(delta, newPrice);
      
      TIMEFRAMES.forEach(tf => {
        const key = `${symbol}_${tf}`;
        const timeframeSecs = getTimeframeSeconds(tf);
        const candleList = [...(newCandles[key] || [])];
        if (candleList.length === 0) return;

        const lastCandle = candleList[candleList.length - 1];
        const nowSec = Math.floor(Date.now() / 1000);
        const currentPeriod = Math.floor(nowSec / timeframeSecs) * timeframeSecs;

        if (currentPeriod > lastCandle.time) {
          // Rollover
          const nextCandle = createNewCandle(lastCandle.close, currentPeriod);
          const updated = updateCandle(nextCandle, newPrice, tickVol);
          candleList.push(updated);
          if (candleList.length > 500) candleList.shift(); // Max history
        } else {
          // Update current
          candleList[candleList.length - 1] = updateCandle(lastCandle, newPrice, tickVol);
        }
        newCandles[key] = candleList;
      });
    });

    set({ prices: newPrices, states: newStates, candles: newCandles });

    // Sync with TradingStore (Legacy sync for SL/TP and UI)
    useTradingStore.setState((s) => ({
      prices: { ...s.prices, ...newPrices }
    }));
  },

  applyOrderImpact: (symbol, side, qty) => {
    set((s) => {
      const state = s.states[symbol];
      if (!state) return s;
      
      const impact = (qty / 10000); // 0.01% impact per 100 qty approx
      const drift = side === "buy" ? impact : -impact;

      return {
        states: {
          ...s.states,
          [symbol]: {
            ...state,
            trend: state.trend + drift // Nudge the trend
          }
        }
      };
    });
  }
}));

function getTimeframeSeconds(tf: string): number {
  const map: Record<string, number> = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "1h": 3600,
    "1D": 86400,
  };
  return map[tf] || 60;
}

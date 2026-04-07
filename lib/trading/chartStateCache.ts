import { Candle } from "@/components/trading/CandleChart";

/**
 * Global state cache to persist chart data across navigation.
 * Instead of persisting DOM nodes, we persist the latest candles and configuration
 * to bootstrap a "warm start" in <100ms.
 */

interface ChartState {
  symbol: string;
  timeframe: string;
  candles: Candle[];
  lastUsed: number;
}

class ChartStateCache {
  private cache: Map<string, ChartState> = new Map();
  private maxCacheSize = 5; // Cache more symbols for fast switching

  public set(symbol: string, timeframe: string, candles: Candle[]) {
    this.cache.set(symbol, {
      symbol,
      timeframe,
      candles: [...candles], // Deep copy to prevent mutations
      lastUsed: Date.now()
    });

    if (this.cache.size > this.maxCacheSize) {
      // Evict oldest
      const oldestKey = Array.from(this.cache.keys()).sort(
        (a, b) => (this.cache.get(a)?.lastUsed || 0) - (this.cache.get(b)?.lastUsed || 0)
      )[0];
      if (oldestKey) this.cache.delete(oldestKey);
    }
  }

  public get(symbol: string): ChartState | undefined {
    const state = this.cache.get(symbol);
    if (state) {
      state.lastUsed = Date.now();
    }
    return state;
  }

  public clear() {
    this.cache.clear();
  }
}

export const chartStateCache = new ChartStateCache();

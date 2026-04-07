/**
 * marketEngine.ts
 * Core logic for realistic, tick-based price simulation.
 * Updated for Advanced Market Realism Layer.
 */

import type { Candle } from "@/components/trading/CandleChart";

export interface MarketState {
  currentPrice: number;
  trend: number; // Persistent trend bias (-1 to 1)
  volatility: number;
  lastTickTime: number;
  prevDelta?: number;
}

/**
 * Generate a single price tick.
 * Evolves currentPrice based on trend and volatility.
 * FIX #1: Delta = (Math.random() - 0.5) * price * 0.0005
 * FIX #4: Strict Clamp = price * 0.001
 * FIX #7: Smoothing = delta * 0.7 + prevDelta * 0.3
 */
export function generateTick(state: MarketState): { newPrice: number; newTrend: number; delta: number } {
  const { currentPrice, trend, prevDelta = 0 } = state;

  // 1. Evolve Trend (Slow Random Walk)
  const trendShift = (Math.random() - 0.5) * 0.04; 
  let newTrend = trend + trendShift;
  newTrend *= 0.98; // Natural decay to zero
  newTrend = Math.max(-1, Math.min(1, newTrend));

  // 2. Generate Raw Delta
  // multiplier from user: price * 0.0005
  const baseVolatility = currentPrice * 0.0005; 
  let delta = (Math.random() - 0.5) * baseVolatility;
  
  // Apply trend bias
  delta += (newTrend * baseVolatility * 0.5);

  // FIX #7: Smoothing — 70% current + 30% previous 
  delta = (delta * 0.7) + (prevDelta * 0.3);

  // Strictly limit single-tick movements to prevent unrealistic spikes
  const maxMove = currentPrice * 0.002;
  delta = Math.max(-maxMove, Math.min(maxMove, delta));

  const newPrice = Math.max(0.01, currentPrice + delta);

  return { 
    newPrice: Number.parseFloat(newPrice.toFixed(2)), 
    newTrend,
    delta 
  };
}

/**
 * Update the OHLC of the current candle based on a new price tick.
 */
export function updateCandle(candle: Candle, price: number, volume: number): Candle {
  return {
    ...candle,
    high: Math.max(candle.high, price),
    low: Math.min(candle.low, price),
    close: price,
    volume: (candle.volume || 0) + volume
  };
}

/**
 * Create a new candle starting from the close of the previous one.
 */
export function createNewCandle(prevClose: number, time: number): Candle {
  return {
    time,
    open: prevClose,
    high: prevClose,
    low: prevClose,
    close: prevClose,
    volume: 0
  };
}

/**
 * Calculate volume proportional to price delta.
 */
export function calculateTickVolume(delta: number, basePrice: number): number {
  const moveStrength = Math.abs(delta);
  const baseVolume = Math.floor(Math.random() * 20);
  
  // volume follows movement: base + abs(delta) * multiplier
  // multiplier 10000 approx means 1% move adds 10000 volume
  const volume = baseVolume + Math.floor(moveStrength * 10000);
  
  return volume;
}

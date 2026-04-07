import type { Candle } from "@/components/trading/CandleChart";

export interface CandleWithVolume extends Candle {
  volume: number;
}

/**
 * Generate realistic OHLC candlestick data with volume.
 * Uses geometric brownian motion + trend/momentum for natural-looking price action.
 */
export function generateOHLCData(basePrice: number, candles: number = 200): CandleWithVolume[] {
  const data: CandleWithVolume[] = [];
  let price = basePrice;

  const now = Math.floor(Date.now() / 1000);
  const snappedNow = Math.floor(now / 60) * 60;

  // Market parameters for realistic simulation
  const volatility = 0.003;        // Base volatility per bar
  const driftBias = 0.0001;        // Slight upward drift
  const meanReversionStrength = 0.02;
  const trendStrength = 0.6;       // How much momentum carries forward
  let momentum = 0;
  const anchorPrice = basePrice;

  // Volume profile: higher at open/close of "session", random spikes
  const baseVolume = Math.max(100, Math.round(basePrice * 10));

  for (let i = candles; i > 0; i--) {
    const time = snappedNow - i * 60;

    // Trend + Mean reversion + Noise
    const noise = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; // ~normal
    const meanReversion = (anchorPrice - price) / anchorPrice * meanReversionStrength;
    momentum = momentum * trendStrength + noise * volatility + driftBias + meanReversion;

    const open = parseFloat(price.toFixed(2));
    const close = parseFloat((price * (1 + momentum)).toFixed(2));
    price = close;

    // Intra-bar wicks: realistic high/low beyond open/close
    const barRange = Math.abs(close - open);
    const wickUp = barRange * (0.1 + Math.random() * 0.8) + price * volatility * 0.3 * Math.random();
    const wickDown = barRange * (0.1 + Math.random() * 0.8) + price * volatility * 0.3 * Math.random();

    const high = parseFloat((Math.max(open, close) + wickUp).toFixed(2));
    const low = parseFloat((Math.min(open, close) - wickDown).toFixed(2));

    // Volume: base + random spikes + higher on big moves
    const moveSize = Math.abs(close - open) / open;
    const volumeMultiplier = 1 + moveSize * 50 + (Math.random() > 0.9 ? Math.random() * 3 : 0);
    const volume = Math.round(baseVolume * (0.5 + Math.random()) * volumeMultiplier);

    data.push({ time, open, high, low, close, volume });
  }

  return data;
}

/**
 * Get current price from candle data
 */
export function getCurrentPrice(candles: Candle[]): number {
  return candles.length > 0 ? candles[candles.length - 1].close : 0;
}

/**
 * Calculate price change percentage
 */
export function calculatePriceChange(candles: Candle[]): number {
  if (candles.length < 2) return 0;
  const first = candles[0].open;
  const last = candles[candles.length - 1].close;
  return ((last - first) / first) * 100;
}

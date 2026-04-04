import type { Candle } from "@/components/trading/CandleChart";

/**
 * Generate mock OHLC candlestick data for a given price
 */
export function generateOHLCData(basePrice: number, candles: number = 100): Candle[] {
  const data: Candle[] = [];
  let price = basePrice;
  
  const now = Math.floor(Date.now() / 1000);
  
  for (let i = candles; i > 0; i--) {
    const time = now - i * 60; // 1 minute per candle
    
    // Simulate price movement (±2%)
    const randomChange = (Math.random() - 0.5) * 0.02;
    const close = price * (1 + randomChange);
    
    // Generate OHLC
    const open = price;
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    
    data.push({
      time,
      open,
      high,
      low,
      close,
    });
    
    price = close;
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

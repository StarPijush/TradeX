/**
 * Order Book Engine
 * Generates realistic mock order book data with live updates.
 * Designed to work with the existing price simulation system.
 */

export interface OrderBookLevel {
  price: number;
  volume: number;
  total: number; // cumulative volume
}

export interface TapeEntry {
  id: string;
  time: number;
  price: number;
  size: number;
  side: "buy" | "sell";
}

export interface OrderBookSnapshot {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPercent: number;
  bestBid: number;
  bestAsk: number;
  lastTrades: TapeEntry[];
}

const LEVELS = 15;
const MAX_TAPE_LENGTH = 50;

/** Generate initial order book levels around a price */
function generateLevels(
  basePrice: number,
  side: "bid" | "ask",
  count: number
): OrderBookLevel[] {
  const levels: OrderBookLevel[] = [];
  const tickSize = basePrice > 1000 ? 0.50 : basePrice > 100 ? 0.10 : basePrice > 10 ? 0.05 : 0.01;

  for (let i = 0; i < count; i++) {
    const offset = (i + 1) * tickSize;
    const price = side === "bid"
      ? parseFloat((basePrice - offset).toFixed(2))
      : parseFloat((basePrice + offset).toFixed(2));

    // Volume follows a rough distribution: denser near mid, thinner at edges
    const baseFactor = Math.max(0.3, 1 - (i / count) * 0.5);
    const randomFactor = 0.6 + Math.random() * 0.8;
    const volume = Math.round(50 + 200 * baseFactor * randomFactor);

    levels.push({ price, volume, total: 0 });
  }

  return levels;
}

/** Compute cumulative totals */
function computeTotals(levels: OrderBookLevel[]): OrderBookLevel[] {
  let cumulative = 0;
  return levels.map((level) => {
    cumulative += level.volume;
    return { ...level, total: cumulative };
  });
}

/** Create a fresh order book snapshot */
export function createOrderBook(currentPrice: number): OrderBookSnapshot {
  const tickSize = currentPrice > 1000 ? 0.50 : currentPrice > 100 ? 0.10 : currentPrice > 10 ? 0.05 : 0.01;
  const halfSpread = tickSize * (1 + Math.random() * 0.5);

  const bestBid = parseFloat((currentPrice - halfSpread / 2).toFixed(2));
  const bestAsk = parseFloat((currentPrice + halfSpread / 2).toFixed(2));

  const rawBids = generateLevels(bestBid, "bid", LEVELS);
  const rawAsks = generateLevels(bestAsk, "ask", LEVELS);

  // Insert best bid/ask as first level
  rawBids.unshift({ price: bestBid, volume: Math.round(80 + Math.random() * 120), total: 0 });
  rawAsks.unshift({ price: bestAsk, volume: Math.round(80 + Math.random() * 120), total: 0 });

  // Sort: bids DESC, asks ASC
  rawBids.sort((a, b) => b.price - a.price);
  rawAsks.sort((a, b) => a.price - b.price);

  const bids = computeTotals(rawBids);
  const asks = computeTotals(rawAsks);

  const spread = parseFloat((bestAsk - bestBid).toFixed(2));
  const spreadPercent = parseFloat(((spread / currentPrice) * 100).toFixed(3));

  return {
    bids,
    asks,
    spread,
    spreadPercent,
    bestBid,
    bestAsk,
    lastTrades: [],
  };
}

/** Smoothly update an existing order book with small mutations */
export function tickOrderBook(
  prev: OrderBookSnapshot,
  currentPrice: number
): OrderBookSnapshot {
  const tickSize = currentPrice > 1000 ? 0.50 : currentPrice > 100 ? 0.10 : currentPrice > 10 ? 0.05 : 0.01;

  // Shift prices slightly toward current price
  const priceDrift = (Math.random() - 0.5) * tickSize * 0.3;

  const mutateLevels = (levels: OrderBookLevel[], side: "bid" | "ask"): OrderBookLevel[] => {
    return levels.map((level, i) => {
      // Volume jitter: ±5-15%
      const jitter = 1 + (Math.random() - 0.5) * 0.25;
      let newVolume = Math.max(5, Math.round(level.volume * jitter));

      // Occasionally a big order appears or disappears
      if (Math.random() < 0.05) {
        newVolume = Math.random() < 0.5
          ? Math.round(newVolume * 2.5)
          : Math.max(5, Math.round(newVolume * 0.3));
      }

      // Slight price shift for top levels
      let newPrice = level.price;
      if (i < 3) {
        newPrice = parseFloat((level.price + priceDrift).toFixed(2));
      }

      return { ...level, price: newPrice, volume: newVolume, total: 0 };
    });
  };

  let newBids = mutateLevels(prev.bids, "bid");
  let newAsks = mutateLevels(prev.asks, "ask");

  // Ensure proper ordering
  newBids.sort((a, b) => b.price - a.price);
  newAsks.sort((a, b) => a.price - b.price);

  // Re-anchor best bid/ask around current price
  if (newBids.length > 0) {
    const targetBid = parseFloat((currentPrice - tickSize * (0.5 + Math.random() * 0.5)).toFixed(2));
    const bidShift = targetBid - newBids[0].price;
    if (Math.abs(bidShift) > tickSize * 3) {
      newBids = newBids.map(l => ({ ...l, price: parseFloat((l.price + bidShift).toFixed(2)) }));
    }
  }
  if (newAsks.length > 0) {
    const targetAsk = parseFloat((currentPrice + tickSize * (0.5 + Math.random() * 0.5)).toFixed(2));
    const askShift = targetAsk - newAsks[0].price;
    if (Math.abs(askShift) > tickSize * 3) {
      newAsks = newAsks.map(l => ({ ...l, price: parseFloat((l.price + askShift).toFixed(2)) }));
    }
  }

  // Recompute totals
  const bids = computeTotals(newBids);
  const asks = computeTotals(newAsks);

  const bestBid = bids[0]?.price ?? currentPrice;
  const bestAsk = asks[0]?.price ?? currentPrice;
  const spread = parseFloat((bestAsk - bestBid).toFixed(2));
  const spreadPercent = parseFloat(((spread / currentPrice) * 100).toFixed(3));

  // Generate 0-2 new tape entries
  const newTrades: TapeEntry[] = [];
  const tradeCount = Math.floor(Math.random() * 3);
  for (let i = 0; i < tradeCount; i++) {
    const isBuy = Math.random() > 0.5;
    const tradePrice = isBuy
      ? parseFloat((bestAsk + (Math.random() - 0.5) * tickSize * 0.5).toFixed(2))
      : parseFloat((bestBid + (Math.random() - 0.5) * tickSize * 0.5).toFixed(2));

    newTrades.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      time: Date.now(),
      price: tradePrice,
      size: Math.round(5 + Math.random() * 100),
      side: isBuy ? "buy" : "sell",
    });
  }

  const lastTrades = [...newTrades, ...prev.lastTrades].slice(0, MAX_TAPE_LENGTH);

  return {
    bids,
    asks,
    spread: Math.max(0, spread),
    spreadPercent: Math.max(0, spreadPercent),
    bestBid,
    bestAsk,
    lastTrades,
  };
}

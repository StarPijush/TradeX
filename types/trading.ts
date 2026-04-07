export type AssetCategory = "All" | "Equity" | "Crypto" | "Index" | "Commodity";
export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit";
export type OrderStatus = "pending" | "filled" | "cancelled";
export type PositionStatus = "open" | "closed";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  category: Exclude<AssetCategory, "All">;
  image?: string;
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  side: OrderSide;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  status: PositionStatus;
  pnl: number;
  category: Exclude<AssetCategory, "All">;
  image?: string;
  openedAt: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number; // Market price or Limit price
  quantity: number;
  stopLoss?: number;
  takeProfit?: number;
  status: OrderStatus;
  timestamp: number;
}

export interface Trade {
  id: string;
  type: "BUY" | "SELL";
  side: OrderSide;
  symbol: string;
  quantity: number;
  price: number;
  timestamp: number;
  profit?: number;
  fee: number;
}

export interface TradingState {
  balance: number;
  positions: Position[];
  orders: Order[];
  trades: Trade[];
  favorites: string[];
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  prices: Record<string, number>;
  setBalance: (balance: number) => void;
  setPositions: (positions: Position[]) => void;
  setOrders: (orders: Order[]) => void;
  setTrades: (trades: Trade[]) => void;
  setFavorites: (favorites: string[]) => void;
  setXP: (xp: number) => void;
  setLevel: (level: number) => void;
  addXP: (amount: number) => void;
  updateStreak: (win: boolean) => void;
  toggleFavorite: (symbol: string) => void;
  updatePrice: (symbol: string, price: number) => void;
}

export interface TradeResult {
  success: boolean;
  message: string;
}

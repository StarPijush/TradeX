export type AssetCategory = "All" | "Equity" | "Crypto" | "Index" | "Commodity";
export type TradeMode = "buy" | "sell";

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
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  category: Exclude<AssetCategory, "All">;
  image?: string;
}

export interface Trade {
  id: string;
  type: "BUY" | "SELL";
  symbol: string;
  quantity: number;
  price: number;
  timestamp: number;
  profit?: number;
}

export interface TradingState {
  balance: number;
  positions: Position[];
  trades: Trade[];
  favorites: string[];
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  setBalance: (balance: number) => void;
  setPositions: (positions: Position[]) => void;
  setTrades: (trades: Trade[]) => void;
  setFavorites: (favorites: string[]) => void;
  setXP: (xp: number) => void;
  setLevel: (level: number) => void;
  addXP: (amount: number) => void;
  updateStreak: (win: boolean) => void;
  toggleFavorite: (symbol: string) => void;
}

export interface TradeResult {
  success: boolean;
  message: string;
}

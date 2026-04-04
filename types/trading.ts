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

export interface TradingState {
  balance: number;
  positions: Position[];
  setBalance: (balance: number) => void;
  setPositions: (positions: Position[]) => void;
}

export interface TradeResult {
  success: boolean;
  message: string;
}

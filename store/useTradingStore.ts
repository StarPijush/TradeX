import { create } from "zustand";
import { Position, TradingState } from "@/types/trading";

interface StoreState extends TradingState {
  resetAccount: () => void;
}

export const useTradingStore = create<StoreState>((set) => ({
  balance: 100000,
  positions: [],
  setBalance: (balance: number) => set({ balance }),
  setPositions: (positions: Position[]) => set({ positions }),
  resetAccount: () => set({ balance: 100000, positions: [] }),
}));

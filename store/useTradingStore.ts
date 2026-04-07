import { create } from "zustand";
import { Position, Trade, TradingState, Order } from "@/types/trading";

interface StoreState extends TradingState {
  resetAccount: () => void;
}

export const useTradingStore = create<StoreState>((set, get) => ({
  balance: 100000,
  positions: [],
  orders: [],
  trades: [],
  favorites: [],
  xp: 0,
  level: 1,
  streak: 0,
  bestStreak: 0,
  prices: {},
  setBalance: (balance: number) => set({ balance }),
  setPositions: (positions: Position[]) => set({ positions }),
  setOrders: (orders: Order[]) => set({ orders }),
  setTrades: (trades: Trade[]) => set({ trades }),
  setFavorites: (favorites: string[]) => set({ favorites }),
  setXP: (xp: number) => set({ xp }),
  setLevel: (level: number) => set({ level }),
  addXP: (amount: number) => {
    const { xp, level } = get();
    const newXP = xp + amount;
    const xpForNextLevel = level * 100;
    
    if (newXP >= xpForNextLevel) {
      set({ xp: newXP - xpForNextLevel, level: level + 1 });
    } else {
      set({ xp: newXP });
    }
  },
  updateStreak: (win: boolean) => {
    const { streak, bestStreak } = get();
    if (win) {
      const newStreak = streak > 0 ? streak + 1 : 1;
      set({ streak: newStreak, bestStreak: Math.max(bestStreak, newStreak) });
    } else {
      const newStreak = streak < 0 ? streak - 1 : -1;
      set({ streak: newStreak });
    }
  },
  toggleFavorite: (symbol: string) => {
    const { favorites } = get();
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter((s) => s !== symbol)
      : [...favorites, symbol];
    set({ favorites: newFavorites });
  },
  updatePrice: (symbol: string, price: number) => {
    set((state) => ({
      prices: {
        ...state.prices,
        [symbol]: price,
      },
      positions: state.positions.map((p) => 
        p.symbol === symbol ? { ...p, currentPrice: price } : p
      )
    }));
  },
  resetAccount: () => set({ 
    balance: 100000, 
    positions: [], 
    orders: [],
    trades: [], 
    favorites: [],
    xp: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    prices: {}
  }),
}));

// Computed selectors
export const getAnalytics = (state: StoreState) => {
  const trades = state.trades.filter((t) => t.type === "SELL"); // Only realized pnl
  const totalPnL = trades.reduce((acc, t) => acc + (t.profit || 0), 0);
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => (t.profit || 0) > 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const sortedByProfit = [...trades].sort((a, b) => (b.profit || 0) - (a.profit || 0));
  const bestTrade = sortedByProfit[0] || null;
  const worstTrade = sortedByProfit[sortedByProfit.length - 1] || null;

  return {
    totalPnL,
    totalTrades,
    winRate,
    bestTrade,
    worstTrade,
    trades, // All realized trades
  };
};

import { create } from "zustand";
import type { Drawing } from "@/components/trading/CandleChart";

export type DrawingTool = "crosshair" | "trendline" | "horizontal" | "vertical" | "rectangle" | "fibonacci";
export type IndicatorType = "SMA" | "EMA20" | "EMA50" | "RSI" | "MACD" | "Volume";
export type Timeframe = "1m" | "5m" | "15m" | "1h" | "1D";

interface ChartState {
  // Tool state
  activeTool: DrawingTool;
  drawings: Drawing[];
  activeIndicators: IndicatorType[];
  timeframe: Timeframe;
  isFullscreen: boolean;
  isIndicatorPanelOpen: boolean;

  // Actions
  setActiveTool: (tool: DrawingTool) => void;
  addDrawing: (drawing: Drawing) => void;
  removeDrawing: (id: string) => void;
  updateDrawing: (id: string, update: Partial<Drawing>) => void;
  clearDrawings: () => void;
  setDrawings: (drawings: Drawing[]) => void;
  toggleIndicator: (ind: IndicatorType) => void;
  setTimeframe: (tf: Timeframe) => void;
  setFullscreen: (fs: boolean) => void;
  setIndicatorPanelOpen: (isOpen: boolean) => void;
}

export const useChartStore = create<ChartState>((set, get) => ({
  activeTool: "crosshair",
  drawings: [],
  activeIndicators: [],
  timeframe: "1D",
  isFullscreen: false,
  isIndicatorPanelOpen: false,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setIndicatorPanelOpen: (isOpen) => set({ isIndicatorPanelOpen: isOpen }),

  addDrawing: (drawing) =>
    set((s) => ({ drawings: [...s.drawings, drawing] })),

  removeDrawing: (id) =>
    set((s) => ({ drawings: s.drawings.filter((d) => d.id !== id) })),

  updateDrawing: (id, update) =>
    set((s) => ({
      drawings: s.drawings.map((d) => (d.id === id ? { ...d, ...update } : d)),
    })),

  clearDrawings: () => set({ drawings: [] }),

  setDrawings: (drawings) => set({ drawings }),

  toggleIndicator: (ind) =>
    set((s) => ({
      activeIndicators: s.activeIndicators.includes(ind)
        ? s.activeIndicators.filter((i) => i !== ind)
        : [...s.activeIndicators, ind],
    })),

  setTimeframe: (tf) => set({ timeframe: tf }),

  setFullscreen: (fs) => set({ isFullscreen: fs }),
}));

/** Snap a price to the nearest tick size based on the price magnitude */
export function snapToGrid(price: number): number {
  let tickSize: number;
  if (price > 1000) tickSize = 0.5;
  else if (price > 100) tickSize = 0.1;
  else if (price > 10) tickSize = 0.05;
  else if (price > 1) tickSize = 0.01;
  else tickSize = 0.001;
  return Math.round(price / tickSize) * tickSize;
}

/** Timeframe to seconds mapping */
export const TIMEFRAME_SECONDS: Record<Timeframe, number> = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  "1D": 86400,
};

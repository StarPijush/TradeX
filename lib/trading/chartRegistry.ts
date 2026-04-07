import type { IChartApi, ISeriesApi } from "lightweight-charts";

/**
 * Global registry to persist chart instances across navigation.
 * This prevents the heavy overhead of re-creating the chart engine on every page switch.
 */

interface ChartEntry {
  chart: IChartApi;
  series: ISeriesApi<"Candlestick">;
  volumeSeries: ISeriesApi<"Histogram"> | null;
  lastUsed: number;
}

class ChartRegistry {
  private cache: Map<string, ChartEntry> = new Map();
  private maxCacheSize = 3; // Keep last 3 symbols in memory for instant switching

  public register(symbol: string, entry: ChartEntry) {
    if (this.cache.size >= this.maxCacheSize) {
      // Cleanup oldest
      const oldestKey = Array.from(this.cache.keys()).sort(
        (a, b) => (this.cache.get(a)?.lastUsed || 0) - (this.cache.get(b)?.lastUsed || 0)
      )[0];
      if (oldestKey) this.cleanup(oldestKey);
    }
    this.cache.set(symbol, { ...entry, lastUsed: Date.now() });
  }

  public get(symbol: string): ChartEntry | undefined {
    const entry = this.cache.get(symbol);
    if (entry) {
      entry.lastUsed = Date.now();
    }
    return entry;
  }

  public cleanup(symbol: string) {
    const entry = this.cache.get(symbol);
    if (entry) {
      try {
        entry.chart.remove();
      } catch (e) {
        console.warn("Error cleaning up chart:", e);
      }
      this.cache.delete(symbol);
    }
  }

  public clearAll() {
    this.cache.forEach((_, symbol) => this.cleanup(symbol));
  }
}

export const chartRegistry = new ChartRegistry();

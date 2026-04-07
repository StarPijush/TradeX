import { useEffect, useRef, useState, memo, useCallback } from "react";
import type { IChartApi, ISeriesApi, MouseEventParams } from "lightweight-charts";
import { calculateSMA, calculateEMA, calculateRSI, calculateMACD } from "@/lib/trading/indicators";
import { useTradingStore } from "@/store/useTradingStore";
import { useChartStore, snapToGrid, type DrawingTool } from "@/store/useChartStore";
import { useMarketStore } from "@/store/useMarketStore";
import ChartTooltip, { type Candle } from "./chart/ChartTooltip";
import ChartDrawings from "./chart/ChartDrawings";
import ChartSkeleton from "./chart/ChartSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { chartStateCache } from "@/lib/trading/chartStateCache";
import { useTransition } from "react";

export { type Candle };

/* ─────────────────────────── Types ─────────────────────────── */


interface Point { time: number; price: number; }

export interface Drawing {
  id: string;
  type: DrawingTool;
  p1: Point;
  p2?: Point;
  color?: string;
}

interface CandleChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
}

const FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
const FIB_COLORS = ["#787B86", "#F44336", "#FF9800", "#FFEB3B", "#4CAF50", "#2196F3", "#787B86"];

const CandleChart = memo(function CandleChart({
  symbol,
  onPriceUpdate,
}: CandleChartProps) {
  const containerWrapper = useRef<HTMLDivElement>(null);
  const mainChartContainer = useRef<HTMLDivElement>(null);
  const oscChartContainer = useRef<HTMLDivElement>(null);

  // Chart & series instances
  const chart = useRef<IChartApi | null>(null);
  const oscChart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeries = useRef<ISeriesApi<"Histogram"> | null>(null);
  const initialized = useRef(false);
  const lastLoadedSymbol = useRef<string | null>(null);
  const lastLoadedTimeframe = useRef<string | null>(null);

  // Indicator refs
  const smaSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const ema20Series = useRef<ISeriesApi<"Line"> | null>(null);
  const ema50Series = useRef<ISeriesApi<"Line"> | null>(null);
  const rsiSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSignalSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const macdHistSeries = useRef<ISeriesApi<"Histogram"> | null>(null);

  // SL/TP line refs
  const slLineRef = useRef<any>(null);
  const tpLineRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [activeDrawing, setActiveDrawing] = useState<Drawing | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Store subscriptions
  const indicators = useChartStore((s) => s.activeIndicators);
  const activeTool = useChartStore((s) => s.activeTool);
  const timeframe = useChartStore((s) => s.timeframe);
  const drawings = useChartStore((s) => s.drawings);
  const addDrawing = useChartStore((s) => s.addDrawing);

  // Market data subscription
  const candleKey = `${symbol}_${timeframe}`;

  const hasOscillators = indicators.includes("RSI") || indicators.includes("MACD");
  const showVolume = indicators.includes("Volume");

  const [isPending, startTransition] = useTransition();

  // ─── CHART INITIALIZATION (Warm Start & Safe Reuse) ───
  useEffect(() => {
    if (!mainChartContainer.current) return;

    let cleanupFn: (() => void) | undefined;

    const init = async () => {
      // 1. WARM START: Get cached data for instant render
      const cached = chartStateCache.get(symbol);
      const initCandles = cached?.candles || useMarketStore.getState().candles[`${symbol}_${timeframe}`] || [];

      try {
        const { createChart, CandlestickSeries, HistogramSeries, CrosshairMode } = await import("lightweight-charts");
        
        const chartInstance = createChart(mainChartContainer.current as HTMLElement, {
          layout: {
            background: { color: "#06090F" },
            textColor: "#4E5D6C",
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
          },
          timeScale: {
            timeVisible: true,
            borderColor: "rgba(255, 255, 255, 0.04)",
            barSpacing: 12,
            minBarSpacing: 4,
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: { color: "rgba(61, 148, 255, 0.2)", width: 1, style: 2 },
            horzLine: { color: "rgba(61, 148, 255, 0.2)", width: 1, style: 2 },
          },
          grid: {
            vertLines: { color: "rgba(255, 255, 255, 0.02)" },
            horzLines: { color: "rgba(255, 255, 255, 0.02)" },
          },
          rightPriceScale: { borderColor: "rgba(255, 255, 255, 0.04)", autoScale: true },
          watermark: {
            visible: true,
            fontSize: 32,
            horzAlign: "center",
            vertAlign: "center",
            color: "rgba(255, 255, 255, 0.02)",
            text: symbol.toUpperCase(),
          },
        } as any);

        const candleSeries = chartInstance.addSeries(CandlestickSeries, {
          upColor: "#26A69A", downColor: "#EF5350", borderVisible: false,
          wickUpColor: "#26A69A", wickDownColor: "#EF5350",
        });

        const volSeries = chartInstance.addSeries(HistogramSeries, {
          priceFormat: { type: "volume" }, priceScaleId: "volume",
        });
        (chartInstance.priceScale("volume") as any).applyOptions({
          scaleMargins: { top: 0.8, bottom: 0 }, drawTicks: false,
        });

        chart.current = chartInstance;
        series.current = candleSeries;
        volumeSeries.current = volSeries as any;
        initialized.current = true;
        
        // INSTANT RENDERING of initial/cached data
        if (initCandles.length > 0) {
           series.current.setData(initCandles as any);
           if (volumeSeries.current) {
              volumeSeries.current.setData(initCandles.map(c => ({ time: c.time as any, value: c.volume || 0, color: c.close >= c.open ? "rgba(38, 166, 154, 0.25)" : "rgba(239, 83, 80, 0.25)" })));
           }
           chartInstance.timeScale().fitContent();
        }

        setIsLoading(false);

        const handleResize = () => {
          if (!mainChartContainer.current || !chart.current) return;
          chart.current.applyOptions({
            width: mainChartContainer.current.clientWidth,
            height: mainChartContainer.current.clientHeight,
          });
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(mainChartContainer.current as Element);
        cleanupFn = () => {
          resizeObserver.disconnect();
          chartInstance.remove();
          initialized.current = false;
        };
      } catch (err) {
        console.error("Chart init error:", err);
      }
    };

    init();
    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [symbol, timeframe]); // Rebuild on symbol or timeframe change

  // Update watermark on symbol change
  useEffect(() => {
    if (chart.current) {
      chart.current.applyOptions({
        watermark: { text: symbol.toUpperCase() }
      } as any);
    }
  }, [symbol]);

  // Indicator ref proxy for off-cycle updates
  const indicatorsRef = useRef(indicators);
  useEffect(() => { indicatorsRef.current = indicators; }, [indicators]);

  // ─── DATA SYNC & INDICATORS (Zero React Re-Renders on Tick) ───
  useEffect(() => {
    if (!initialized.current || !chart.current) return;

    // Helper: Sync Indicators with UI Priority (Frame-based)
    const syncIndicators = async (candles: Candle[], isMajorChange: boolean) => {
        const activeInds = indicatorsRef.current;
        if (!chart.current) return;
        
        const wantOsc = activeInds.includes("RSI") || activeInds.includes("MACD");

        // Use startTransition for heavy calculations to avoid UI blocking
        startTransition(() => {
          (async () => {
            const { LineSeries, HistogramSeries, createChart } = await import("lightweight-charts");
            if (!chart.current) return;

            if (activeInds.includes("SMA")) {
                if (!smaSeries.current) smaSeries.current = chart.current.addSeries(LineSeries, { color: "#2962FF", lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
                const vals = calculateSMA(candles, 20);
                if (isMajorChange) smaSeries.current.setData(candles.map((d, i) => ({ time: d.time as any, value: vals[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
                else smaSeries.current.update({ time: candles[candles.length - 1].time as any, value: vals[vals.length - 1] ?? NaN });
            } else if (smaSeries.current) { chart.current.removeSeries(smaSeries.current); smaSeries.current = null; }

            if (activeInds.includes("EMA20")) {
                if (!ema20Series.current) ema20Series.current = chart.current.addSeries(LineSeries, { color: "#FF6D00", lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
                const vals = calculateEMA(candles, 20);
                if (isMajorChange) ema20Series.current.setData(candles.map((d, i) => ({ time: d.time as any, value: vals[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
                else ema20Series.current.update({ time: candles[candles.length - 1].time as any, value: vals[vals.length - 1] ?? NaN });
            } else if (ema20Series.current) { chart.current.removeSeries(ema20Series.current); ema20Series.current = null; }

            if (activeInds.includes("EMA50")) {
                if (!ema50Series.current) ema50Series.current = chart.current.addSeries(LineSeries, { color: "#AB47BC", lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
                const vals = calculateEMA(candles, 50);
                if (isMajorChange) ema50Series.current.setData(candles.map((d, i) => ({ time: d.time as any, value: vals[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
                else ema50Series.current.update({ time: candles[candles.length - 1].time as any, value: vals[vals.length - 1] ?? NaN });
            } else if (ema50Series.current) { chart.current.removeSeries(ema50Series.current); ema50Series.current = null; }

            if (wantOsc) {
                if (!oscChart.current && oscChartContainer.current) {
                    oscChart.current = createChart(oscChartContainer.current, {
                        autoSize: false,
                        layout: { 
                          background: { color: "#131722" }, 
                          textColor: "#8B949E", 
                          fontSize: 10,
                          fontFamily: "'Inter', sans-serif",
                        },
                        timeScale: { visible: false },
                        rightPriceScale: { borderColor: "#2A2E39", alignLabels: true },
                        grid: { vertLines: { visible: false }, horzLines: { color: "rgba(42, 46, 57, 0.2)" } }
                    });
                    oscChart.current.applyOptions({
                        width: oscChartContainer.current.clientWidth,
                        height: oscChartContainer.current.clientHeight,
                    });
                    chart.current.timeScale().subscribeVisibleTimeRangeChange((r) => { if (r) oscChart.current?.timeScale().setVisibleRange(r); });
                }
                if (oscChart.current) {
                    if (activeInds.includes("RSI")) {
                        if (!rsiSeries.current) rsiSeries.current = oscChart.current.addSeries(LineSeries, { color: "#7B1FA2", lineWidth: 1 as any });
                        const vals = calculateRSI(candles, 14);
                        if (isMajorChange) rsiSeries.current.setData(candles.map((d, i) => ({ time: d.time as any, value: vals[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
                        else rsiSeries.current.update({ time: candles[candles.length - 1].time as any, value: vals[vals.length - 1] ?? NaN });
                    } else if (rsiSeries.current) { oscChart.current.removeSeries(rsiSeries.current); rsiSeries.current = null; }

                    if (activeInds.includes("MACD")) {
                        if (!macdSeries.current) macdSeries.current = oscChart.current.addSeries(LineSeries, { color: "#2962FF", lineWidth: 1 });
                        if (!macdSignalSeries.current) macdSignalSeries.current = oscChart.current.addSeries(LineSeries, { color: "#FF6D00", lineWidth: 1 });
                        if (!macdHistSeries.current) macdHistSeries.current = oscChart.current.addSeries(HistogramSeries, {});
                        const macd = calculateMACD(candles);
                        if (isMajorChange) {
                            macdSeries.current.setData(candles.map((d, i) => ({ time: d.time as any, value: macd.macdLine[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
                            macdSignalSeries.current.setData(candles.map((d, i) => ({ time: d.time as any, value: macd.signalLine[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
                            macdHistSeries.current.setData(candles.map((d, i) => { const v = macd.histogram[i]; return { time: d.time as any, value: v ?? NaN, color: (v ?? 0) >= 0 ? "rgba(38, 166, 154, 0.5)" : "rgba(239, 83, 80, 0.5)" }; }).filter(d => !Number.isNaN(d.value)));
                        } else {
                            const lIdx = candles.length - 1;
                            const lTime = candles[lIdx].time as any;
                            macdSeries.current.update({ time: lTime, value: macd.macdLine[lIdx] ?? NaN });
                            macdSignalSeries.current.update({ time: lTime, value: macd.signalLine[lIdx] ?? NaN });
                            const v = macd.histogram[lIdx];
                            macdHistSeries.current.update({ time: lTime, value: v ?? NaN, color: (v ?? 0) >= 0 ? "rgba(38, 166, 154, 0.5)" : "rgba(239, 83, 80, 0.5)" });
                        }
                    } else {
                        if (macdSeries.current) { oscChart.current.removeSeries(macdSeries.current); macdSeries.current = null; }
                        if (macdSignalSeries.current) { oscChart.current.removeSeries(macdSignalSeries.current); macdSignalSeries.current = null; }
                        if (macdHistSeries.current) { oscChart.current.removeSeries(macdHistSeries.current); macdHistSeries.current = null; }
                    }
                }
            } else if (oscChart.current) {
                oscChart.current.remove();
                oscChart.current = null;
            }
          })();
        });
    };

    // ─── Live Market Sync ───
    const unsub = useMarketStore.subscribe((state) => {
      const candles = state.candles[`${symbol}_${timeframe}`] || [];
      if (!candles.length || !series.current) return;

      const isMajorChange = symbol !== lastLoadedSymbol.current || timeframe !== lastLoadedTimeframe.current;
      
      // Update Cache for Next Navigation
      chartStateCache.set(symbol, timeframe, candles);

      requestAnimationFrame(() => {
        if (!series.current) return;
        if (isMajorChange) {
          series.current.setData(candles as any);
          volumeSeries.current?.setData(candles.map(c => ({ time: c.time as any, value: c.volume || 0, color: c.close >= c.open ? "rgba(38, 166, 154, 0.25)" : "rgba(239, 83, 80, 0.25)" })));
          chart.current?.timeScale().fitContent();
          lastLoadedSymbol.current = symbol;
          lastLoadedTimeframe.current = timeframe;
          syncIndicators(candles, true);
        } else {
          const last = candles[candles.length - 1];
          series.current.update(last as any);
          volumeSeries.current?.update({ time: last.time as any, value: last.volume || 0, color: last.close >= last.open ? "rgba(38, 166, 154, 0.25)" : "rgba(239, 83, 80, 0.25)" });
          syncIndicators(candles, false);
        }
      });

      if (onPriceUpdate) {
         const cp = state.prices[symbol];
         if (cp) onPriceUpdate(cp);
      }
    });

    return unsub;
  }, [symbol, timeframe, indicators, hasOscillators, onPriceUpdate]);

  // ─── Interactivity: Tooltip & Crosshair ───
  useEffect(() => {
    if (!chart.current) return;
    const c = chart.current;

    const moveHandler = (param: MouseEventParams) => {
      if (param.point) setMousePos({ x: param.point.x, y: param.point.y });
      else setMousePos(null);

      if (param.time && series.current) {
        const data = param.seriesData.get(series.current) as Candle;
        setHoveredCandle(data || null);
      } else {
        setHoveredCandle(null);
      }
    };

    const clickHandler = (param: MouseEventParams) => {
      if (!param.point || !param.time || !series.current || activeTool === "crosshair") return;
      const price = series.current.coordinateToPrice(param.point.y);
      if (price === null) return;
      const time = param.time as number;
      const snapped = snapToGrid(price);

      if (!activeDrawing) {
        const newDrawing: Drawing = {
          id: Date.now().toString(),
          type: activeTool,
          p1: { time, price: snapped },
          color: activeTool === "fibonacci" ? "#FFD700" : "#2962FF",
        };
        if (activeTool === "horizontal") {
          addDrawing(newDrawing);
          useChartStore.getState().setActiveTool("crosshair");
        } else {
          setActiveDrawing(newDrawing);
        }
      } else {
        addDrawing({ ...activeDrawing, p2: { time, price: snapped } });
        setActiveDrawing(null);
        useChartStore.getState().setActiveTool("crosshair");
      }
    };

    c.subscribeCrosshairMove(moveHandler);
    c.subscribeClick(clickHandler);
    return () => {
      c.unsubscribeCrosshairMove(moveHandler);
      c.unsubscribeClick(clickHandler);
    };
  }, [activeTool, activeDrawing, addDrawing]);

  // ─── SL/TP Lines ───
  const positions = useTradingStore((s) => s.positions);
  const activePosition = positions.find((p) => p.symbol === symbol && p.status === "open");

  useEffect(() => {
    if (!initialized.current || !series.current) return;
    const s = series.current;
    if (slLineRef.current) { try { s.removePriceLine(slLineRef.current); } catch {} slLineRef.current = null; }
    if (tpLineRef.current) { try { s.removePriceLine(tpLineRef.current); } catch {} tpLineRef.current = null; }

    if (activePosition?.stopLoss) {
      slLineRef.current = s.createPriceLine({ price: activePosition.stopLoss, color: "#EF5350", lineStyle: 2, lineWidth: 1, title: "SL" });
    }
    if (activePosition?.takeProfit) {
      tpLineRef.current = s.createPriceLine({ price: activePosition.takeProfit, color: "#26A69A", lineStyle: 2, lineWidth: 1, title: "TP" });
    }
  }, [activePosition, symbol]);

  // Helpers for drawings
  const getX = useCallback((t: number) => {
    if (!chart.current) return -9999;
    return chart.current.timeScale().timeToCoordinate(t as any) ?? -9999;
  }, []);

  const getY = useCallback((p: number) => {
    if (!series.current) return -9999;
    return series.current.priceToCoordinate(p) ?? -9999;
  }, []);

  return (
    <div ref={containerWrapper} className="relative w-full h-full flex flex-col bg-[#131722] overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[1000]"
          >
            <ChartSkeleton />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-full h-full flex flex-col"
      >
        <ChartDrawings 
          drawings={drawings}
          activeDrawing={activeDrawing}
          mousePos={mousePos}
          getX={getX}
          getY={getY}
        />

        <ChartTooltip hoveredCandle={hoveredCandle} />
        {hasOscillators && (
          <div 
            ref={oscChartContainer} 
            style={{ flex: "0 0 25%", width: "100%", borderTop: "1px solid #1E2633", minHeight: 0 }} 
          />
        )}
      </motion.div>
    </div>
  );
});

export default CandleChart;


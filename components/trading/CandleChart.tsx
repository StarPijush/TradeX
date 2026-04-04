"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { IChartApi, ISeriesApi, SeriesType, MouseEventParams } from "lightweight-charts";
import { createChart, CandlestickSeries, LineSeries, HistogramSeries, CrosshairMode } from "lightweight-charts";
import { motion, AnimatePresence } from "framer-motion";
import { calculateSMA, calculateEMA, calculateRSI, calculateMACD } from "@/lib/trading/indicators";
import type { IndicatorType } from "./IndicatorsMenu";
import type { DrawingTool } from "./DrawingToolbar";

export interface Candle {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Point {
  time: number;
  price: number;
}

export interface Drawing {
  id: string;
  type: DrawingTool;
  p1: Point;
  p2?: Point;
  color?: string;
}

interface CandleChartProps {
  symbol: string;
  data: Candle[];
  onPriceUpdate?: (price: number) => void;
  indicators?: IndicatorType[];
  activeTool?: DrawingTool;
  drawings?: Drawing[];
  onDrawingsChange?: (drawings: Drawing[]) => void;
}

export default function CandleChart({ 
  symbol, 
  data, 
  onPriceUpdate, 
  indicators = [],
  activeTool = "crosshair",
  drawings = [],
  onDrawingsChange
}: CandleChartProps) {
  const containerWrapper = useRef<HTMLDivElement>(null);
  const mainChartContainer = useRef<HTMLDivElement>(null);
  const oscChartContainer = useRef<HTMLDivElement>(null);

  const chart = useRef<IChartApi | null>(null);
  const oscChart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  // Indicator series refs
  const smaSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const emaSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const rsiSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSignalSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const macdHistSeries = useRef<ISeriesApi<"Histogram"> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  const hasOscillators = indicators.includes("RSI") || indicators.includes("MACD");

  // Format data
  const formattedData = useMemo(() => {
    return data.map((candle) => ({
      ...candle,
      time: typeof candle.time === "number" ? Math.floor(candle.time) : candle.time,
    }));
  }, [data]);

  // Handle initialization and main series update
  useEffect(() => {
    if (!mainChartContainer.current || !data.length || initialized.current) return;

    try {
      const chartInstance = createChart(mainChartContainer.current, {
        layout: {
          background: { color: "#0B0F14" },
          textColor: "#8B949E",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 11,
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: "#1E2633",
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: { color: "rgba(139, 148, 158, 0.4)", width: 1, labelBackgroundColor: "#1E2633", style: 2 },
          horzLine: { color: "rgba(139, 148, 158, 0.4)", width: 1, labelBackgroundColor: "#1E2633", style: 2 },
        },
        grid: {
          vertLines: { color: "#1E2633" },
          horzLines: { color: "#1E2633" },
        },
        rightPriceScale: {
          borderColor: "#1E2633",
          autoScale: true,
        },
      });

      const candleSeries = chartInstance.addSeries(CandlestickSeries, {
        upColor: "#22C55E",
        downColor: "#EF4444",
        borderUpColor: "#22C55E",
        borderDownColor: "#EF4444",
        wickUpColor: "#22C55E",
        wickDownColor: "#EF4444",
        priceLineVisible: true,
        priceLineColor: "#E6EDF3",
        priceLineStyle: 2,
        priceLineWidth: 1,
      });

      candleSeries.setData(formattedData as any);
      chartInstance.timeScale().fitContent();

      chart.current = chartInstance;
      series.current = candleSeries;
      initialized.current = true;
      setIsLoading(false);

      const handleResize = () => {
        if (!initialized.current) return;
        if (mainChartContainer.current && chart.current) {
          chart.current.applyOptions({
            width: mainChartContainer.current.clientWidth,
            height: mainChartContainer.current.clientHeight,
          });
        }
        if (oscChartContainer.current && oscChart.current) {
          oscChart.current.applyOptions({
            width: oscChartContainer.current.clientWidth,
            height: oscChartContainer.current.clientHeight,
          });
        }
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerWrapper.current!);

      return () => {
        resizeObserver.disconnect();
        chart.current?.remove();
        chart.current = null;
        oscChart.current?.remove();
        oscChart.current = null;
        initialized.current = false;
      };
    } catch (err) {
      console.error(err);
      setError("Failed to initialize chart");
    }
  }, [formattedData, data.length]); // Init only


  // Live data effect
  useEffect(() => {
    if (!initialized.current || !series.current || data.length === 0) return;

    const interval = setInterval(() => {
      try {
        const lastCandle = data[data.length - 1];
        const randomChange = (Math.random() - 0.5) * 0.002;
        const newClose = lastCandle.close * (1 + randomChange);

        const newTime = typeof lastCandle.time === "number" ? lastCandle.time + 60 : Math.floor(Date.now() / 1000);

        const newCandle = {
          time: newTime as any,
          open: lastCandle.close,
          high: Math.max(lastCandle.close, newClose) * 1.001,
          low: Math.min(lastCandle.close, newClose) * 0.999,
          close: newClose,
        };

        // Mutating data for persistence in this session without full re-render
        data.push(newCandle);
        if (data.length > 500) data.shift();

        series.current?.update(newCandle as any);
        onPriceUpdate?.(newClose);
      } catch (err) {
        console.error(err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data, onPriceUpdate]);

  // Indicator Overlay Sync Effect
  useEffect(() => {
    if (!initialized.current || !chart.current) return;
    
    // SMA
    if (indicators.includes("SMA")) {
      if (!smaSeries.current) {
        smaSeries.current = chart.current.addSeries(LineSeries, { color: "#3B82F6", lineWidth: 2, crosshairMarkerVisible: false });
      }
      const vals = calculateSMA(data, 20);
      smaSeries.current.setData(data.map((d, i) => ({ time: d.time as any, value: vals[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
    } else if (smaSeries.current) {
      chart.current.removeSeries(smaSeries.current);
      smaSeries.current = null;
    }

    // EMA
    if (indicators.includes("EMA")) {
      if (!emaSeries.current) {
        emaSeries.current = chart.current.addSeries(LineSeries, { color: "#F59E0B", lineWidth: 2, crosshairMarkerVisible: false });
      }
      const vals = calculateEMA(data, 20);
      emaSeries.current.setData(data.map((d, i) => ({ time: d.time as any, value: vals[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
    } else if (emaSeries.current) {
      chart.current.removeSeries(emaSeries.current);
      emaSeries.current = null;
    }
  }, [indicators, data.length]); // Dependency on data.length to rerun indicators when new candles form

  // Oscillators Container Effect
  useEffect(() => {
    if (!initialized.current || !oscChartContainer.current || !hasOscillators) {
      if (oscChart.current) {
        oscChart.current.remove();
        oscChart.current = null;
        rsiSeries.current = null;
        macdSeries.current = null;
        macdSignalSeries.current = null;
        macdHistSeries.current = null;
      }
      return;
    }

    if (!oscChart.current) {
      oscChart.current = createChart(oscChartContainer.current, {
        layout: {
          background: { color: "#0B0F14" },
          textColor: "#8B949E",
          fontSize: 11,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        },
        timeScale: { timeVisible: true, borderColor: "#1E2633" },
        rightPriceScale: { borderColor: "#1E2633", autoScale: true },
        grid: { vertLines: { color: "#1E2633" }, horzLines: { color: "#1E2633" } },
      });
      // Sync time scales
      if (chart.current) {
        chart.current.timeScale().subscribeVisibleTimeRangeChange((range) => {
          if (range && oscChart.current) {
            oscChart.current.timeScale().setVisibleRange(range);
          }
        });
        oscChart.current.timeScale().subscribeVisibleTimeRangeChange((range) => {
          if (range && chart.current) {
            chart.current.timeScale().setVisibleRange(range);
          }
        });
      }
    }

    // RSI
    if (indicators.includes("RSI")) {
      if (!rsiSeries.current) {
        rsiSeries.current = oscChart.current.addSeries(LineSeries, { color: "#8B5CF6", lineWidth: 2 });
      }
      const vals = calculateRSI(data, 14);
      rsiSeries.current.setData(data.map((d, i) => ({ time: d.time as any, value: vals[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
    } else if (rsiSeries.current) {
      oscChart.current.removeSeries(rsiSeries.current);
      rsiSeries.current = null;
    }

    // MACD
    if (indicators.includes("MACD")) {
      if (!macdSeries.current) macdSeries.current = oscChart.current.addSeries(LineSeries, { color: "#3B82F6", lineWidth: 1 });
      if (!macdSignalSeries.current) macdSignalSeries.current = oscChart.current.addSeries(LineSeries, { color: "#F59E0B", lineWidth: 1 });
      if (!macdHistSeries.current) macdHistSeries.current = oscChart.current.addSeries(HistogramSeries, {});

      const macd = calculateMACD(data);
      macdSeries.current.setData(data.map((d, i) => ({ time: d.time as any, value: macd.macdLine[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
      macdSignalSeries.current.setData(data.map((d, i) => ({ time: d.time as any, value: macd.signalLine[i] ?? NaN })).filter(d => !Number.isNaN(d.value)));
      macdHistSeries.current.setData(data.map((d, i) => {
        const val = macd.histogram[i];
        return { 
          time: d.time as any, 
          value: val ?? NaN, 
          color: (val ?? 0) >= 0 ? "#22C55E88" : "#EF444488" 
        };
      }).filter(d => !Number.isNaN(d.value)));
    } else {
      if (macdSeries.current) { oscChart.current.removeSeries(macdSeries.current); macdSeries.current = null; }
      if (macdSignalSeries.current) { oscChart.current.removeSeries(macdSignalSeries.current); macdSignalSeries.current = null; }
      if (macdHistSeries.current) { oscChart.current.removeSeries(macdHistSeries.current); macdHistSeries.current = null; }
    }

  }, [indicators, hasOscillators, data.length]);


  // Drawings Layer State
  const [drawingState, setDrawingState] = useState<{
    activeDrawing: Drawing | null;
  }>({ activeDrawing: null });

  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePos, setMousePos] = useState<{x: number; y: number} | null>(null);

  useEffect(() => {
    if (!chart.current) return;

    const mainChart = chart.current;
    
    // Disable crosshair if drawing tool is active to allow click events on SVG overlay
    // Actually, lightweight-charts traps events. Let's subscribe to it.
    const clickHandler = (param: MouseEventParams) => {
        if (!param.point || !param.time || !series.current) return;
        
        const price = series.current.coordinateToPrice(param.point.y);
        if (price === null) return;
        
        const logicalTime = param.time as number;

        if (activeTool !== "crosshair") {
          setDrawingState(prev => {
            if (!prev.activeDrawing) {
              // start drawing
              const newDraw: Drawing = {
                id: Date.now().toString(),
                type: activeTool,
                p1: { time: logicalTime, price },
                color: "#E6EDF3"
              };
              return { activeDrawing: newDraw };
            } else {
              // finish drawing
              const finished: Drawing = {
                ...prev.activeDrawing,
                p2: { time: logicalTime, price }
              };
              onDrawingsChange?.([...drawings, finished]);
              return { activeDrawing: null };
            }
          });
        }
    };

    const moveHandler = (param: MouseEventParams) => {
        if (param.point) {
            setMousePos({ x: param.point.x, y: param.point.y });
        } else {
            setMousePos(null);
        }
    };

    mainChart.subscribeCrosshairMove(moveHandler);
    mainChart.subscribeClick(clickHandler);

    return () => {
        mainChart.unsubscribeCrosshairMove(moveHandler);
        mainChart.unsubscribeClick(clickHandler);
    };
  }, [activeTool, drawings, onDrawingsChange]);

  // Convert logical drawing points to pixel coordinates
  const renderDrawings = () => {
    if (!chart.current || !series.current) return null;
    const s = series.current;
    const timeScale = chart.current.timeScale();
    const rightPrice = s.priceScale();

    const getX = (t: number) => {
        const coord = timeScale.timeToCoordinate(t as any);
        return coord !== null ? coord : -10; // offscreen if invalid
    };
    const getY = (p: number) => {
        const coord = s.priceToCoordinate(p);
        return coord !== null ? coord : -10;
    };

    const allDrawings = [...drawings, drawingState.activeDrawing].filter(Boolean) as Drawing[];

    return (
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10
        }}
      >
        {allDrawings.map(d => {
            if (d.type === "horizontal") {
                const y = getY(d.p1.price);
                return <line key={d.id} x1="0" y1={y} x2="100%" y2={y} stroke={d.color || "#3B82F6"} strokeWidth="1.5" strokeDasharray="4 4" />;
            }
            if (d.type === "vertical") {
                const x = getX(d.p1.time);
                return <line key={d.id} x1={x} y1="0" x2={x} y2="100%" stroke={d.color || "#3B82F6"} strokeWidth="1.5" strokeDasharray="4 4" />;
            }
            if (d.type === "trendline" && d.p2) {
                return (
                    <line 
                        key={d.id} 
                        x1={getX(d.p1.time)} 
                        y1={getY(d.p1.price)} 
                        x2={getX(d.p2.time)} 
                        y2={getY(d.p2.price)} 
                        stroke={d.color || "#E6EDF3"} 
                        strokeWidth="2" 
                    />
                );
            }
            // Active drawing incomplete state
            if (d.type === "trendline" && !d.p2 && mousePos) {
                 return (
                    <line 
                        key={d.id} 
                        x1={getX(d.p1.time)} 
                        y1={getY(d.p1.price)} 
                        x2={mousePos.x} 
                        y2={mousePos.y} 
                        stroke={d.color || "#E6EDF3"} 
                        strokeWidth="2" 
                    />
                );
            }
            if (d.type === "rectangle" && d.p2) {
                const x1 = getX(d.p1.time);
                const x2 = getX(d.p2.time);
                const y1 = getY(d.p1.price);
                const y2 = getY(d.p2.price);
                const minX = Math.min(x1, x2);
                const minY = Math.min(y1, y2);
                const w = Math.abs(x2 - x1);
                const h = Math.abs(y2 - y1);
                return (
                     <rect 
                        key={d.id} 
                        x={minX} y={minY} width={w} height={h} 
                        fill="rgba(59, 130, 246, 0.1)"
                        stroke={d.color || "#3B82F6"} 
                        strokeWidth="1" 
                    />
                );
            }
            // Rectangle incomplete
            if (d.type === "rectangle" && !d.p2 && mousePos) {
                const x1 = getX(d.p1.time);
                const y1 = getY(d.p1.price);
                const minX = Math.min(x1, mousePos.x);
                const minY = Math.min(y1, mousePos.y);
                const w = Math.abs(mousePos.x - x1);
                const h = Math.abs(mousePos.y - y1);
                return (
                     <rect 
                        key={d.id} 
                        x={minX} y={minY} width={w} height={h} 
                        fill="rgba(59, 130, 246, 0.1)"
                        stroke={d.color || "#3B82F6"} 
                        strokeWidth="1" 
                    />
                );
            }
            return null;
        })}
      </svg>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full text-[#EF4444] text-[13px] bg-[#0B0F14]">
        Chart error: {error}
      </div>
    );
  }

  return (
    <div ref={containerWrapper} className="relative w-full h-full flex flex-col bg-[#0B0F14]">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-[#0B0F14] overflow-hidden"
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-full h-full"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(88, 166, 255, 0.05) 50%, transparent 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tooltip Overlay Example (optional placeholder) */}
      {/* 
      <div className="absolute top-4 left-4 z-20 pointer-events-none text-[10px] text-[#8B949E]">
         O: -- H: -- L: -- C: --
      </div> 
      */}

      {/* Drawing Overlay */}
      {!isLoading && initialized.current && renderDrawings()}

      <div 
        ref={mainChartContainer} 
        style={{ flex: hasOscillators ? "0 0 70%" : "1", width: "100%" }}
      />
      {hasOscillators && (
        <div 
            ref={oscChartContainer} 
            style={{ flex: "0 0 30%", width: "100%", borderTop: "1px solid #1E2633" }}
        />
      )}
    </div>
  );
}

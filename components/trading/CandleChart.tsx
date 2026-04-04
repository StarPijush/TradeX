"use client";

import { useEffect, useRef, useState } from "react";
import type { IChartApi } from "lightweight-charts";
import { createChart, CandlestickSeries } from "lightweight-charts";

export interface Candle {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleChartProps {
  symbol: string;
  data: Candle[];
  onPriceUpdate?: (price: number) => void;
}

export default function CandleChart({ symbol, data, onPriceUpdate }: CandleChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!container.current || !data.length) return;
    if (initialized.current) return;

    try {
      const chartInstance = createChart(container.current, {
        layout: {
          background: { color: "#0B0F14" },
          textColor: "#8B949E",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 11,
        },
        width: container.current.clientWidth,
        height: container.current.clientHeight,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: "#1E2633",
        },
        rightPriceScale: {
          borderColor: "#1E2633",
          autoScale: true,
        },
        grid: {
          vertLines: { color: "#1E2633" },
          horzLines: { color: "#1E2633" },
        },
        crosshair: {
          vertLine: { color: "rgba(139, 148, 158, 0.4)", width: 1, labelBackgroundColor: "#1E2633" },
          horzLine: { color: "rgba(139, 148, 158, 0.4)", width: 1, labelBackgroundColor: "#1E2633" },
        },
      });

      // v5 API: use addSeries with CandlestickSeries
      const candleSeries = chartInstance.addSeries(CandlestickSeries, {
        upColor: "#22C55E",
        downColor: "#EF4444",
        borderUpColor: "#22C55E",
        borderDownColor: "#EF4444",
        wickUpColor: "#22C55E",
        wickDownColor: "#EF4444",
        priceLineVisible: true,
        priceLineColor: "#E6EDF3",
        priceLineStyle: 2, // Dashed
        priceLineWidth: 1,
      });

      // Format data
      const formattedData = data.map((candle) => ({
        time: typeof candle.time === "number" ? Math.floor(candle.time) : candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      candleSeries.setData(formattedData as any);
      chartInstance.timeScale().fitContent();

      chart.current = chartInstance;
      series.current = candleSeries;
      initialized.current = true;

      // Handle resize
      const handleResize = () => {
        if (container.current && chart.current) {
          chart.current.applyOptions({
            width: container.current.clientWidth,
            height: container.current.clientHeight,
          });
        }
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        chart.current?.remove();
        initialized.current = false;
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to initialize chart";
      console.error("Chart initialization error:", err);
      setError(errorMsg);
    }
  }, [data]);

  // Live candle updates
  useEffect(() => {
    if (!initialized.current || !series.current || data.length === 0) return;

    const interval = setInterval(() => {
      try {
        const lastCandle = data[data.length - 1];
        const randomChange = (Math.random() - 0.5) * 0.01;
        const newClose = lastCandle.close * (1 + randomChange);

        const newCandle = {
          time: typeof lastCandle.time === "number" ? lastCandle.time + 60 : String(Math.floor(Date.now() / 1000)),
          open: lastCandle.close,
          high: Math.max(lastCandle.close, newClose) * 1.002,
          low: Math.min(lastCandle.close, newClose) * 0.998,
          close: newClose,
        };

        data.push(newCandle);
        series.current?.update(newCandle);
        onPriceUpdate?.(newClose);
      } catch (err) {
        console.error("Chart update error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [data, onPriceUpdate]);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: 400,
          color: "var(--red)",
          fontSize: 13,
          background: "#0B0F14",
        }}
      >
        Chart error: {error}
      </div>
    );
  }

  return (
    <div
      ref={container}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        background: "#0B0F14",
      }}
    />
  );
}

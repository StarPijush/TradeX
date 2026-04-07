"use client";

import { memo } from "react";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface ChartTooltipProps {
  hoveredCandle: Candle | null;
}

const ChartTooltip = memo(function ChartTooltip({ hoveredCandle }: ChartTooltipProps) {
  if (!hoveredCandle) return null;
  
  const isUp = hoveredCandle.close >= hoveredCandle.open;
  const diff = hoveredCandle.close - hoveredCandle.open;
  const diffPct = (diff / hoveredCandle.open) * 100;

  return (
    <div 
      className="absolute top-4 left-4 z-40 flex items-center gap-5 px-4 py-2 rounded-xl border border-white/[0.05] bg-[#0D1117]/80 text-[10px] font-black tracking-wider shadow-2xl backdrop-blur-xl animate-fade-in"
    >
      <div className="flex items-center gap-2">
        <span className="text-white/20 uppercase">O</span>
        <span className="text-white/80 tabular-nums">{hoveredCandle.open.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/20 uppercase">H</span>
        <span className="text-white/80 tabular-nums font-bold">{hoveredCandle.high.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/20 uppercase">L</span>
        <span className="text-white/80 tabular-nums font-bold">{hoveredCandle.low.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/20 uppercase">C</span>
        <span className={`${isUp ? "text-green-400" : "text-red-400"} tabular-nums font-black`}>
          {hoveredCandle.close.toFixed(2)}
        </span>
      </div>
      <div className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md ${isUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
         <span className="font-black text-[9px]">
           {isUp ? "▲" : "▼"} {Math.abs(diffPct).toFixed(2)}%
         </span>
      </div>
    </div>
  );
});

export default ChartTooltip;

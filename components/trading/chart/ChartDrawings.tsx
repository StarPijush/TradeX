"use client";

import { memo } from "react";
import { type Drawing } from "../CandleChart";

interface ChartDrawingsProps {
  drawings: Drawing[];
  activeDrawing: Drawing | null;
  mousePos: { x: number; y: number } | null;
  getX: (t: number) => number;
  getY: (p: number) => number;
}

const ChartDrawings = memo(function ChartDrawings({
  drawings,
  activeDrawing,
  mousePos,
  getX,
  getY,
}: ChartDrawingsProps) {
  const all = [...drawings, activeDrawing].filter(Boolean) as Drawing[];

  return (
    <svg className="absolute inset-0 z-20 pointer-events-none w-full h-full">
      {all.map((d) => {
        const x1 = getX(d.p1.time);
        const y1 = getY(d.p1.price);
        
        if (d.type === "horizontal") {
          return (
            <line 
              key={d.id} 
              x1="0" y1={y1} 
              x2="100%" y2={y1} 
              stroke={d.color} 
              strokeWidth="1" 
              strokeDasharray="6" 
            />
          );
        }
        
        const x2 = d.p2 ? getX(d.p2.time) : (mousePos?.x ?? x1);
        const y2 = d.p2 ? getY(d.p2.price) : (mousePos?.y ?? y1);

        if (d.type === "trendline") {
          return (
            <line 
              key={d.id} 
              x1={x1} y1={y1} 
              x2={x2} y2={y2} 
              stroke={d.color} 
              strokeWidth="2" 
            />
          );
        }
        
        if (d.type === "rectangle") {
          return (
            <rect 
              key={d.id} 
              x={Math.min(x1, x2)} 
              y={Math.min(y1, y2)} 
              width={Math.abs(x2 - x1)} 
              height={Math.abs(y2 - y1)} 
              fill={`${d.color}10`} 
              stroke={d.color} 
              strokeWidth="1.5" 
            />
          );
        }
        
        return null;
      })}
    </svg>
  );
});

export default ChartDrawings;

"use client";

import { useState, useRef, useEffect } from "react";
import { Activity } from "lucide-react";

export type IndicatorType = "SMA" | "EMA" | "RSI" | "MACD";

interface IndicatorsMenuProps {
  activeIndicators: IndicatorType[];
  onToggleIndicator: (indicator: IndicatorType) => void;
}

export default function IndicatorsMenu({ activeIndicators, onToggleIndicator }: IndicatorsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const indicators: { id: IndicatorType; label: string; desc: string }[] = [
    { id: "SMA", label: "SMA", desc: "Simple Moving Average" },
    { id: "EMA", label: "EMA", desc: "Exponential Moving Average" },
    { id: "RSI", label: "RSI", desc: "Relative Strength Index" },
    { id: "MACD", label: "MACD", desc: "Moving Average Convergence Divergence" },
  ];

  return (
    <div className="relative z-50" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors text-[11px] font-bold ${
          isOpen || activeIndicators.length > 0
            ? "bg-[#1E2633] text-[#E6EDF3]"
            : "text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1E2633]/50"
        }`}
      >
        <Activity size={14} className={activeIndicators.length > 0 ? "text-[#3B82F6]" : ""} />
        INDICATORS {activeIndicators.length > 0 && `(${activeIndicators.length})`}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-[#0B0F14] border border-[#1E2633] rounded-md shadow-xl overflow-hidden py-1">
          {indicators.map((ind) => {
            const isActive = activeIndicators.includes(ind.id);
            return (
              <button
                key={ind.id}
                onClick={() => {
                  onToggleIndicator(ind.id);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#1E2633] transition-colors"
              >
                <div>
                  <div className={`text-[12px] font-bold ${isActive ? "text-[#3B82F6]" : "text-[#E6EDF3]"}`}>
                    {ind.label}
                  </div>
                  <div className="text-[9px] text-[#8B949E] uppercase tracking-wider mt-0.5">
                    {ind.desc}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

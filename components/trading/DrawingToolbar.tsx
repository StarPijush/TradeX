"use client";

import { Crosshair, Minus, TrendingUp, Square, Trash2, GitBranchPlus, X } from "lucide-react";
import { useChartStore, type DrawingTool } from "@/store/useChartStore";

export type { DrawingTool } from "@/store/useChartStore";

interface DrawingToolbarProps {
  className?: string;
}

const TOOL_GROUPS: {
  tools: { id: DrawingTool; icon: React.ElementType; label: string }[];
  separator?: boolean;
}[] = [
  { tools: [{ id: "crosshair", icon: Crosshair, label: "Crosshair" }], separator: true },
  {
    tools: [
      { id: "trendline", icon: TrendingUp, label: "Trend Line" },
      { id: "horizontal", icon: Minus, label: "Horizontal Line" },
    ],
    separator: true,
  },
  {
    tools: [
      { id: "rectangle", icon: Square, label: "Rectangle" },
      { id: "fibonacci", icon: GitBranchPlus, label: "Fibonacci Retracement" },
    ],
  },
];

export default function DrawingToolbar({ className = "" }: DrawingToolbarProps) {
  const activeTool = useChartStore((s) => s.activeTool);
  const setActiveTool = useChartStore((s) => s.setActiveTool);
  const clearDrawings = useChartStore((s) => s.clearDrawings);

  return (
    <div className={`drawing-toolbar !p-1.5 !gap-1.5 !bg-[#06090F]/80 !backdrop-blur-2xl !border-white/[0.05] !shadow-2xl ${className}`}>
      {TOOL_GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col items-center gap-1">
          {group.tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                title={tool.label}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 ${
                  isActive 
                  ? "bg-accent/20 text-accent shadow-lg shadow-accent/10 border border-accent/20" 
                  : "text-white/20 hover:text-white/50 hover:bg-white/[0.03]"
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
              </button>
            );
          })}
          {group.separator && <div className="w-4 h-px bg-white/[0.05] my-1" />}
        </div>
      ))}

      <div className="flex-1" />

      {activeTool !== "crosshair" && (
        <button
          onClick={() => setActiveTool("crosshair")}
          title="Cancel drawing (Esc)"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gold/40 hover:text-gold hover:bg-gold/10 transition-all border border-transparent hover:border-gold/20 mb-1"
        >
          <X size={16} strokeWidth={2} />
        </button>
      )}

      <div className="w-4 h-px bg-white/[0.05] mb-1" />

      <button
        onClick={clearDrawings}
        title="Clear all drawings"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
      >
        <Trash2 size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}

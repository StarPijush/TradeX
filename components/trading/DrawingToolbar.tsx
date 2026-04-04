"use client";

import { 
  Crosshair, 
  Minus, 
  MoveRight, 
  Square, 
  AlignVerticalSpaceAround, 
  Trash2,
  MousePointer2
} from "lucide-react";

export type DrawingTool = "crosshair" | "trendline" | "horizontal" | "vertical" | "rectangle" | "fibonacci";

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  onClearDrawings: () => void;
}

export default function DrawingToolbar({ activeTool, onSelectTool, onClearDrawings }: DrawingToolbarProps) {
  const tools: { id: DrawingTool; icon: React.ElementType; label: string }[] = [
    { id: "crosshair", icon: Crosshair, label: "Crosshair" },
    { id: "trendline", icon: MoveRight, label: "Trendline" },
    { id: "horizontal", icon: Minus, label: "Horizontal Line" },
    { id: "vertical", icon: AlignVerticalSpaceAround, label: "Vertical Line" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    // Fibonacci is advanced, using a placeholder icon
    { id: "fibonacci", icon: AlignVerticalSpaceAround, label: "Fibonacci" },
  ];

  return (
    <div className="flex flex-col gap-2 w-12 h-full bg-[#0B0F14] border-r border-[#1E2633] items-center py-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            title={tool.label}
            className={`p-2 rounded-md transition-colors ${
              isActive 
                ? "bg-[#1E2633] text-[#E6EDF3]" 
                : "text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1E2633]/50"
            }`}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} className={tool.id === "vertical" ? "rotate-90" : ""} />
          </button>
        );
      })}
      
      <div className="flex-1" />
      
      <button
        onClick={onClearDrawings}
        title="Clear all drawings"
        className="p-2 rounded-md text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors mb-2"
      >
        <Trash2 size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}

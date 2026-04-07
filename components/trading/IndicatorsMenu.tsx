"use client";

import { Activity } from "lucide-react";
import { useChartStore } from "@/store/useChartStore";

export default function IndicatorsMenu() {
  const activeIndicators = useChartStore((s) => s.activeIndicators);
  const isIndicatorPanelOpen = useChartStore((s) => s.isIndicatorPanelOpen);
  const setIndicatorPanelOpen = useChartStore((s) => s.setIndicatorPanelOpen);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIndicatorPanelOpen(!isIndicatorPanelOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "5px 10px",
          borderRadius: 4,
          border: "none",
          cursor: "pointer",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.5px",
          background: isIndicatorPanelOpen || activeIndicators.length > 0 ? "#1E2633" : "transparent",
          color: isIndicatorPanelOpen || activeIndicators.length > 0 ? "#E6EDF3" : "#8B949E",
          transition: "all 0.2s",
        }}
      >
        <Activity size={13} style={{ color: activeIndicators.length > 0 ? "#58A6FF" : undefined }} />
        <span className="hidden sm:inline">INDICATORS</span>
        {activeIndicators.length > 0 && (
          <span style={{
            background: "#58A6FF",
            color: "#000",
            fontSize: 8,
            fontWeight: 900,
            padding: "1px 5px",
            borderRadius: 10,
            lineHeight: "14px",
          }}>
            {activeIndicators.length}
          </span>
        )}
      </button>
    </div>
  );
}


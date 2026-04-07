"use client";

import { useChartStore, type IndicatorType } from "@/store/useChartStore";
import { X, Check, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useDragControls, AnimatePresence } from "framer-motion";

const indicators: { id: IndicatorType; label: string; desc: string; color: string }[] = [
  { id: "SMA", label: "SMA 20", desc: "Simple Moving Average (20)", color: "#2962FF" },
  { id: "EMA20", label: "EMA 20", desc: "Exponential Moving Average (20)", color: "#FF6D00" },
  { id: "EMA50", label: "EMA 50", desc: "Exponential Moving Average (50)", color: "#AB47BC" },
  { id: "RSI", label: "RSI", desc: "Relative Strength Index (14)", color: "#7B1FA2" },
  { id: "MACD", label: "MACD", desc: "Moving Average Convergence Divergence", color: "#2962FF" },
  { id: "Volume", label: "Volume", desc: "Volume Bars Overlay", color: "#26A69A" },
];

export default function IndicatorPanel() {
  const isIndicatorPanelOpen = useChartStore((s) => s.isIndicatorPanelOpen);
  const setIndicatorPanelOpen = useChartStore((s) => s.setIndicatorPanelOpen);
  const activeIndicators = useChartStore((s) => s.activeIndicators);
  const toggleIndicator = useChartStore((s) => s.toggleIndicator);
  const pathname = usePathname();
  
  const [isMobile, setIsMobile] = useState(false);
  const dragControls = useDragControls();

  // Route Safety: Auto close panel on route change
  useEffect(() => {
    setIndicatorPanelOpen(false);
  }, [pathname, setIndicatorPanelOpen]);

  // Body Scroll Lock & Setup
  useEffect(() => {
    if (isIndicatorPanelOpen) {
      document.body.classList.add("panel-open");
    } else {
      document.body.classList.remove("panel-open");
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      document.body.classList.remove("panel-open");
      window.removeEventListener("resize", checkMobile);
    };
  }, [isIndicatorPanelOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isIndicatorPanelOpen) {
        setIndicatorPanelOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isIndicatorPanelOpen, setIndicatorPanelOpen]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isIndicatorPanelOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="backdrop lg:hidden"
            style={{ zIndex: "var(--z-overlay)" }}
            onClick={() => setIndicatorPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div 
        className={`indicator-panel flex flex-col ${isIndicatorPanelOpen ? "open" : ""}`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)", zIndex: "var(--z-panel)" }}
        drag={isMobile && isIndicatorPanelOpen ? "y" : false}
        dragControls={dragControls}
        dragListener={false} 
        dragConstraints={{ top: 0, bottom: 300 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            setIndicatorPanelOpen(false);
          }
        }}
      >
        {/* Mobile Drag Handle */}
        <div 
          className="md:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing w-full"
          onPointerDown={(e) => dragControls.start(e)}
          style={{ touchAction: "none" }}
        >
          <div className="w-10 h-1 bg-[#2A2E39] rounded-full" />
        </div>

        <div style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          background: "rgba(13,17,23,0.5)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(88,166,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} style={{ color: "var(--accent)" }} />
            </div>
            <span style={{ color: "var(--text)", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Analysis Tools</span>
          </div>
          <button 
            onClick={() => setIndicatorPanelOpen(false)}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              cursor: "pointer",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <X size={18} />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
          {indicators.map((ind) => {
            const isActive = activeIndicators.includes(ind.id);
            return (
              <motion.button
                key={ind.id}
                onClick={() => toggleIndicator(ind.id)}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 4,
                    height: 28,
                    borderRadius: 2,
                    background: isActive ? ind.color : "rgba(255,255,255,0.05)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isActive ? `0 0 10px ${ind.color}40` : "none",
                  }} />
                  <div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: isActive ? "var(--text)" : "var(--text-dim)",
                      transition: "color 0.2s",
                    }}>
                      {ind.label}
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      marginTop: 2,
                      fontWeight: 500,
                    }}>
                      {ind.desc}
                    </div>
                  </div>
                </div>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `1.5px solid ${isActive ? ind.color : "var(--border-strong)"}`,
                  background: isActive ? ind.color : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isActive ? `0 4px 12px ${ind.color}30` : "none",
                }}>
                  {isActive && <Check size={14} strokeWidth={3} style={{ color: "#fff" }} />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}


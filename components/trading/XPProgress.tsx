"use client";

import { motion } from "framer-motion";
import { useTradingStore } from "@/store/useTradingStore";

export default function XPProgress() {
  const { xp, level } = useTradingStore();
  const xpForNextLevel = level * 100;
  const progress = (xp / xpForNextLevel) * 100;

  return (
    <div style={{ padding: "0 4px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#8B949E", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Rank Progress
        </span>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#58A6FF" }}>
          Level {level}
        </span>
      </div>
      
      <div style={{ 
        height: 4, 
        background: "#1E2633", 
        borderRadius: 2, 
        overflow: "hidden",
        position: "relative"
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", damping: 20, stiffness: 60 }}
          style={{ 
            height: "100%", 
            background: "linear-gradient(90deg, #22C55E 0%, #58A6FF 100%)",
            boxShadow: "0 0 8px rgba(88, 166, 255, 0.4)"
          }}
        />
      </div>
      
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: 9, color: "#8B949E", fontWeight: 600 }}>
          {xp} / {xpForNextLevel} XP
        </span>
      </div>
    </div>
  );
}

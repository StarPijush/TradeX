import { Position } from "@/types/trading";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import AnimateNumber from "@/components/ui/AnimateNumber";
import { motion } from "framer-motion";

interface PositionCardProps {
  position: Position;
  onSell: (id: string, qty: number) => void;
  engine: any;
}

export default function PositionCard({ position, onSell, engine }: PositionCardProps) {
  const { pnl, pnlPct } = engine.calcPnL(position);
  const isProfit = pnl >= 0;
  const currentValue = position.quantity * position.currentPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: "1px solid #1E2633",
        background: "transparent",
        transition: "background 0.2s"
      }}
    >
      {/* Left - Symbol & Quantity Info */}
      <div style={{ flex: 1 }}>
        <div style={{ color: "#E6EDF3", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
          {position.symbol}
        </div>
        <div style={{ color: "#8B949E", fontSize: 11, fontWeight: 600 }}>
          {position.quantity} units @ {formatCurrency(position.avgPrice, true)}
        </div>
      </div>

      {/* Right - Value & P&L Info */}
      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ color: "#E6EDF3", fontWeight: 700, fontSize: 15 }}>
          <AnimateNumber value={currentValue} format={(v) => formatCurrency(v, true)} />
        </div>
        <motion.div
          animate={isProfit ? { scale: [1, 1.02, 1] } : { x: [0, -1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            color: isProfit ? "#22C55E" : "#EF4444",
            fontSize: 11,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2
          }}
        >
          {isProfit ? "+" : ""}
          <AnimateNumber value={pnl} format={(v) => formatCurrency(v, true)} />
          <span style={{ fontSize: 10, opacity: 0.8 }}>({formatPercent(pnlPct)})</span>
        </motion.div>
      </div>
      
      {/* Quick Sell Button (Optional but high engagement) */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onSell(position.id, position.quantity)}
        style={{
          marginLeft: 16,
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          color: "#EF4444",
          fontSize: 10,
          fontWeight: 800,
          padding: "4px 10px",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        SELL
      </motion.button>
    </motion.div>
  );
}

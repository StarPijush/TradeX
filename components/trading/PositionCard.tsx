import { memo } from "react";
import { Position } from "@/types/trading";
import { formatCurrency } from "@/lib/utils/format";
import AnimateNumber from "@/components/ui/AnimateNumber";
import { motion } from "framer-motion";
import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { X } from "lucide-react";

interface PositionCardProps {
  position: Position;
  onSell: (id: string, qty: number) => void;
  engine: ReturnType<typeof createTradingEngine>;
  livePrice?: number;
}

const PositionCard = memo(function PositionCard({ position, onSell, engine, livePrice }: PositionCardProps) {
  const storePrice = useTradingStore((s) => s.prices?.[position.symbol]);
  const currentPrice = storePrice ?? livePrice ?? position.currentPrice;

  const { pnl, pnlPct } = engine.calculatePnL(position, currentPrice);
  const isProfit = pnl >= 0;
  const currentValue = position.entryPrice * position.quantity + pnl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: "1px solid var(--border)",
        background: "transparent",
        gap: 12,
      }}
    >
      {/* Left */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>
            {position.symbol}
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              padding: "2px 7px",
              borderRadius: 4,
              background:
                position.side === "buy"
                  ? "rgba(38,166,154,0.15)"
                  : "rgba(239,83,80,0.15)",
              color: position.side === "buy" ? "var(--green)" : "var(--red)",
              border: `1px solid ${position.side === "buy" ? "rgba(38,166,154,0.25)" : "rgba(239,83,80,0.25)"}`,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {position.side === "buy" ? "Long" : "Short"}
          </span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
          {position.quantity} @ {formatCurrency(position.entryPrice, true)}
        </div>
        {(position.stopLoss || position.takeProfit) && (
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {position.stopLoss && (
              <span style={{ fontSize: 9, fontWeight: 700, color: "var(--red)" }}>
                SL {formatCurrency(position.stopLoss)}
              </span>
            )}
            {position.takeProfit && (
              <span style={{ fontSize: 9, fontWeight: 700, color: "var(--green)" }}>
                TP {formatCurrency(position.takeProfit)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>
          <AnimateNumber value={currentValue} format={(v) => formatCurrency(v, true)} flashColor={true} />
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: isProfit ? "var(--green)" : "var(--red)",
            fontVariantNumeric: "tabular-nums",
            marginTop: 2,
          }}
        >
          {isProfit ? "+" : ""}
          <AnimateNumber value={pnl} format={(v) => formatCurrency(v, true)} flashColor={true} />
          {" "}
          <span style={{ fontSize: 10, opacity: 0.8 }}>({isProfit ? "+" : ""}{pnlPct.toFixed(2)}%)</span>
        </div>
      </div>

      {/* Close button */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => onSell(position.id, position.quantity)}
        style={{
          flexShrink: 0,
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "var(--red)",
          width: 32,
          height: 32,
          borderRadius: 8,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.08)";
        }}
        title="Close position"
      >
        <X size={15} strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
});

export default PositionCard;

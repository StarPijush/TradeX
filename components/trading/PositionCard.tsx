"use client";

import { Position } from "@/types/trading";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

interface PositionCardProps {
  position: Position;
  onSell: (position: Position) => void;
  engine: ReturnType<typeof createTradingEngine>;
}

export default function PositionCard({ position, onSell, engine }: PositionCardProps) {
  const { pnl, pnlPct } = engine.calcPnL(position);
  const isProfit = pnl >= 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left - Symbol info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>
            {position.symbol}
          </span>
          <span
            style={{
              color: "var(--accent)",
              fontSize: 10,
              fontWeight: 600,
              padding: "1px 6px",
              border: "1px solid var(--border)",
              borderRadius: 3,
            }}
          >
            LONG
          </span>
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 11 }}>
          {position.quantity} × {formatCurrency(position.avgPrice, true)}
        </div>
      </div>

      {/* Center - P&L */}
      <div style={{ textAlign: "right", marginRight: 12 }}>
        <div
          style={{
            color: isProfit ? "var(--green)" : "var(--red)",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {isProfit ? "+" : ""}{formatCurrency(pnl, true)}
        </div>
        <div
          style={{
            color: isProfit ? "var(--green)" : "var(--red)",
            fontSize: 11,
          }}
        >
          {formatPercent(pnlPct)}
        </div>
      </div>

      {/* Right - Sell button */}
      <button
        onClick={() => onSell(position)}
        style={{
          background: "var(--red)",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "6px 12px",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Sell
      </button>
    </div>
  );
}

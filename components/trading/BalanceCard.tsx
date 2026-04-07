"use client";

import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency } from "@/lib/utils/format";
import AnimateNumber from "@/components/ui/AnimateNumber";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

export default function BalanceCard() {
  const { balance, positions, orders, xp, level, streak, bestStreak, trades, prices } =
    useTradingStore();

  const engine = createTradingEngine(
    () => ({ balance, positions, orders, xp, level, streak, bestStreak, trades, prices }),
    () => {}
  );

  const { pnl: totalPnL } = engine.calculateTotalPnL(positions, prices);
  const invested = positions.reduce((acc, p) => acc + p.entryPrice * p.quantity, 0);
  const netWorth = balance + invested + totalPnL;
  const isPnLPositive = totalPnL >= 0;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #111722 0%, #0d1117 100%)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "24px 28px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background accent glow */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(88,166,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--text-dim)",
            marginBottom: 6,
          }}
        >
          Available Balance
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: "var(--accent)",
            letterSpacing: "-1.5px",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.1,
          }}
        >
          <AnimateNumber value={balance} format={(v) => formatCurrency(v, true)} flashColor={true} />
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          paddingTop: 16,
          borderTop: "1px solid var(--border)",
        }}
      >
        {[
          {
            label: "Invested",
            value: invested,
            icon: <BarChart3 size={13} />,
            color: "var(--text)",
            showSign: false,
          },
          {
            label: "Total P&L",
            value: totalPnL,
            icon: isPnLPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />,
            color: isPnLPositive ? "var(--green-bright)" : "var(--red-bright)",
            showSign: true,
          },
          {
            label: "Open Pos.",
            value: positions.length,
            icon: <BarChart3 size={13} />,
            color: "var(--text)",
            isCount: true,
          },
        ].map((stat) => (
          <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--text-dim)",
              }}
            >
              {stat.icon}
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: stat.color,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {stat.isCount ? (
                stat.value
              ) : (
                <>
                  {stat.showSign && stat.value > 0 ? "+" : ""}
                  <AnimateNumber
                    value={stat.value as number}
                    format={(v) => formatCurrency(v, true)}
                    flashColor={true}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

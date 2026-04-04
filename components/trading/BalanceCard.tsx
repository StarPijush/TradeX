"use client";

import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency } from "@/lib/utils/format";

export default function BalanceCard() {
  const { balance, positions } = useTradingStore();

  const engine = createTradingEngine(
    () => ({ balance, positions }),
    () => {}
  );

  const totalPnL = engine.calcTotalPnL(positions);
  const invested = positions.reduce((acc, p) => acc + p.avgPrice * p.quantity, 0);

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
          Available Balance
        </div>
        <div style={{ color: "var(--text)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
          {formatCurrency(balance, true)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Invested", value: formatCurrency(invested, true), color: "var(--text-muted)" },
          {
            label: "Total P&L",
            value: (totalPnL.pnl >= 0 ? "+" : "") + formatCurrency(totalPnL.pnl, true),
            color: totalPnL.pnl >= 0 ? "var(--green)" : "var(--red)",
          },
          { label: "Positions", value: String(positions.length), color: "var(--text)" },
        ].map((item) => (
          <div key={item.label}>
            <div style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 500, textTransform: "uppercase", marginBottom: 2 }}>
              {item.label}
            </div>
            <div style={{ color: item.color, fontSize: 14, fontWeight: 600 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

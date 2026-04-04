"use client";

import { useTradingStore } from "@/store/useTradingStore";
import { formatCurrency } from "@/lib/utils/format";
import { useToast } from "@/components/ui/use-toast";

export default function WalletCard() {
  const { toast } = useToast();
  const { balance, positions, resetAccount } = useTradingStore();
  const holdingsValue = positions.reduce((acc, p) => acc + p.currentPrice * p.quantity, 0);

  const stats = [
    { label: "Cash", value: formatCurrency(balance, true) },
    { label: "Holdings", value: formatCurrency(holdingsValue, true) },
    { label: "Net Worth", value: formatCurrency(balance + holdingsValue, true) },
    { label: "Positions", value: `${positions.length} open` },
  ];

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
      <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
        Wallet
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {stats.map((item) => (
          <div
            key={item.label}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              padding: "10px 12px",
            }}
          >
            <div style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 500, textTransform: "uppercase", marginBottom: 2 }}>
              {item.label}
            </div>
            <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          resetAccount();
          toast({ title: "Account Reset", description: "Balance restored to $100,000" });
        }}
        style={{
          width: "100%",
          padding: "8px 0",
          borderRadius: 4,
          background: "transparent",
          border: "1px solid var(--red)",
          color: "var(--red)",
          fontWeight: 600,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Reset Account ($100,000)
      </button>
    </div>
  );
}

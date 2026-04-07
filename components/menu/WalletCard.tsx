"use client";

import { useTradingStore } from "@/store/useTradingStore";
import { formatCurrency } from "@/lib/utils/format";
import { useToast } from "@/components/ui/use-toast";

export default function WalletCard() {
  const { toast } = useToast();
  const { balance, positions, resetAccount } = useTradingStore();
  const holdingsValue = positions.reduce((acc, p) => acc + p.currentPrice * p.quantity, 0);

  const stats = [
    { label: "Cash", value: balance, isCurrency: true },
    { label: "Holdings", value: holdingsValue, isCurrency: true },
    { label: "Net Value", value: balance + holdingsValue, isCurrency: true },
    { label: "Positions", value: positions.length, isCurrency: false, sub: "Active" },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #111722 0%, #0d1117 100%)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ 
        color: "var(--text-dim)", 
        fontSize: 10, 
        fontWeight: 800, 
        textTransform: "uppercase", 
        letterSpacing: "0.15em", 
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
        Wallet Overview
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {stats.map((item) => (
          <div
            key={item.label}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 16,
              padding: 16,
              transition: "all 0.2s",
            }}
          >
            <div style={{ color: "var(--text-dim)", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              {item.label}
            </div>
            <div style={{ 
              color: item.label === "Net Value" ? "var(--accent)" : "var(--text)", 
              fontSize: 18, 
              fontWeight: 900, 
              letterSpacing: "-0.5px",
              fontVariantNumeric: "tabular-nums"
            }}>
              {item.isCurrency ? formatCurrency(item.value as number, true) : item.value}
              {item.sub && <span style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 4, fontWeight: 700 }}>{item.sub}</span>}
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
          padding: "16px 0",
          borderRadius: 16,
          background: "rgba(239, 68, 68, 0.03)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
          color: "rgba(239, 68, 68, 0.8)",
          fontWeight: 800,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
          e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
          e.currentTarget.style.color = "rgba(239, 68, 68, 1)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.03)";
          e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.15)";
          e.currentTarget.style.color = "rgba(239, 68, 68, 0.8)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Reset Demo Account
      </button>
    </div>
  );
}

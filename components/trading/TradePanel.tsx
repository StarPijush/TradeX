"use client";

import { useState } from "react";
import { Asset } from "@/types/trading";
import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency } from "@/lib/utils/format";
import { useToast } from "@/components/ui/use-toast";
import type { TradeMode } from "@/types/trading";

interface TradePanelProps {
  asset: Asset | null;
  assets: Asset[];
  engine: ReturnType<typeof createTradingEngine>;
}

export default function TradePanel({ asset, assets, engine }: TradePanelProps) {
  const { toast } = useToast();
  const { balance, positions } = useTradingStore();
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<TradeMode>("buy");

  const total = asset ? asset.price * qty : 0;
  const canAfford = total <= balance;

  const handleExecute = () => {
    if (!asset) {
      toast({ title: "No asset selected", description: "Select an asset from the watchlist", variant: "destructive" });
      return;
    }
    if (qty < 1) {
      toast({ title: "Invalid quantity", description: "Enter a quantity of at least 1", variant: "destructive" });
      return;
    }

    const freshEngine = createTradingEngine(
      () => useTradingStore.getState(),
      (partial) => useTradingStore.setState(partial)
    );

    const res =
      mode === "buy"
        ? freshEngine.buy(asset.symbol, qty, assets)
        : (() => {
            const pos = positions.find((p) => p.symbol === asset.symbol);
            if (!pos) return { success: false, message: "No position to sell" };
            return freshEngine.sell(pos.id, qty, assets);
          })();

    toast({
      title: res.success ? "Trade Executed" : "Trade Failed",
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
  };

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
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
          Order
        </div>
        {asset ? (
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text)", fontWeight: 600, fontSize: 14 }}>
              {asset.symbol}
            </span>
            <span style={{ color: "var(--text)", fontWeight: 600, fontSize: 14 }}>
              {formatCurrency(asset.price, true)}
            </span>
          </div>
        ) : (
          <div style={{ color: "var(--text-dim)", fontSize: 12 }}>
            Select an asset
          </div>
        )}
      </div>

      {/* Buy / Sell toggle */}
      <div
        style={{
          display: "flex",
          gap: 1,
          marginBottom: 12,
        }}
      >
        {(["buy", "sell"] as TradeMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: "8px 0",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              textTransform: "uppercase",
              background:
                mode === m
                  ? m === "buy" ? "var(--green)" : "var(--red)"
                  : "var(--bg)",
              color: mode === m ? "#fff" : "var(--text-muted)",
              borderRadius: m === "buy" ? "4px 0 0 4px" : "0 4px 4px 0",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Quantity */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            color: "var(--text-muted)",
            fontSize: 11,
            fontWeight: 500,
            display: "block",
            marginBottom: 4,
          }}
        >
          Quantity
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: 16,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              flex: 1,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              padding: "6px 8px",
              color: "var(--text)",
              fontSize: 13,
              fontWeight: 600,
              textAlign: "center",
              outline: "none",
            }}
          />
          <button
            onClick={() => setQty(qty + 1)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: 16,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Summary */}
      {asset && (
        <div
          style={{
            background: "var(--bg)",
            borderRadius: 4,
            padding: "10px 12px",
            marginBottom: 12,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
            <span style={{ color: "var(--text-muted)" }}>Price × Qty</span>
            <span style={{ color: "var(--text)" }}>
              {formatCurrency(asset.price, true)} × {qty}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Total</span>
            <span
              style={{
                color: !canAfford && mode === "buy" ? "var(--red)" : "var(--text)",
                fontWeight: 700,
              }}
            >
              {formatCurrency(total, true)}
            </span>
          </div>
          {!canAfford && mode === "buy" && (
            <div style={{ color: "var(--red)", fontSize: 11, marginTop: 4, fontWeight: 500 }}>
              Insufficient balance
            </div>
          )}
        </div>
      )}

      {/* Execute */}
      <button
        onClick={handleExecute}
        disabled={!asset}
        style={{
          width: "100%",
          padding: "10px 0",
          borderRadius: 4,
          border: "none",
          cursor: asset ? "pointer" : "not-allowed",
          background: !asset
            ? "var(--border)"
            : mode === "buy"
            ? "var(--green)"
            : "var(--red)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 13,
          opacity: asset ? 1 : 0.5,
        }}
      >
        {mode === "buy" ? "Buy" : "Sell"} {asset?.symbol || ""}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import BalanceCard from "@/components/trading/BalanceCard";
import AssetCard from "@/components/trading/AssetCard";
import PositionCard from "@/components/trading/PositionCard";
import { usePriceSimulation } from "@/lib/trading/usePriceSimulation";
import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { Asset, AssetCategory } from "@/types/trading";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const CATEGORIES: AssetCategory[] = ["All", "Equity", "Crypto", "Index", "Commodity"];

export default function SimulatorPage() {
  const { toast } = useToast();
  const assets = usePriceSimulation();
  const { balance, positions, setBalance, setPositions } = useTradingStore();
  const [filter, setFilter] = useState<AssetCategory>("All");

  const engine = createTradingEngine(
    () => ({ balance, positions }),
    (partial) => {
      if (partial.balance !== undefined) setBalance(partial.balance);
      if (partial.positions !== undefined) setPositions(partial.positions);
    }
  );

  const filtered =
    filter === "All" ? assets : assets.filter((a) => a.category === filter);

  const handleSell = (position: import("@/types/trading").Position) => {
    const res = engine.sell(position.id, position.quantity, assets);
    toast({
      title: res.success ? "Trade Executed" : "Trade Failed",
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
  };

  return (
    <div style={{ paddingTop: 12 }}>
      <PageContainer>
        <BalanceCard />

        {/* Watchlist */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>
              Watchlist
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--green)",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 500 }}>LIVE</span>
            </div>
          </div>

          {/* Category filter */}
          <div style={{ padding: "6px 12px", borderBottom: "1px solid var(--border)", display: "flex", gap: 4 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 3,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 500,
                  background: filter === cat ? "var(--accent)" : "transparent",
                  color: filter === cat ? "#fff" : "var(--text-muted)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 12px",
              borderBottom: "1px solid var(--border)",
              fontSize: 10,
              fontWeight: 500,
              color: "var(--text-dim)",
              textTransform: "uppercase",
            }}
          >
            <div style={{ flex: 1 }}>Symbol</div>
            <div style={{ minWidth: 80, textAlign: "right", marginRight: 12 }}>Price</div>
            <div style={{ minWidth: 64, textAlign: "right" }}>Change</div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: 12 }}>
              No assets in watchlist
            </div>
          ) : (
            filtered.map((asset) => (
              <AssetCard
                key={asset.symbol}
                asset={asset}
                selected={false}
                onSelect={(a) => {
                  window.location.href = `/chart/${a.symbol}`;
                }}
              />
            ))
          )}
        </div>

        {/* Open Positions */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>
              Open Positions
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500 }}>
              {positions.length} active
            </span>
          </div>

          {positions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>
                No open positions
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: 11 }}>
                Select an asset to trade
              </div>
            </div>
          ) : (
            positions.map((pos) => (
              <PositionCard
                key={pos.id}
                position={pos}
                onSell={handleSell}
                engine={engine}
              />
            ))
          )}
        </div>
      </PageContainer>
      <Toaster />
    </div>
  );
}

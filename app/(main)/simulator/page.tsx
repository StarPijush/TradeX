"use client";

import { useState, useMemo, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import BalanceCard from "@/components/trading/BalanceCard";
import AssetCard from "@/components/trading/AssetCard";
import PositionCard from "@/components/trading/PositionCard";
import XPProgress from "@/components/trading/XPProgress";
import { usePriceSimulation } from "@/lib/trading/usePriceSimulation";
import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { AssetCategory } from "@/types/trading";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Search, History, TrendingUp, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CATEGORIES: AssetCategory[] = ["All", "Equity", "Crypto", "Index", "Commodity"];

export default function SimulatorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const assets = usePriceSimulation();
  const {
    balance, positions, setBalance, setPositions, trades, setTrades,
    favorites, xp, level, streak, bestStreak, orders, prices,
  } = useTradingStore();
  const [filter, setFilter] = useState<AssetCategory>("All");
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  const engine = createTradingEngine(
    () => ({ balance, positions, trades, xp, level, streak, bestStreak, orders, prices }),
    (partial) => {
      if (partial.balance !== undefined) setBalance(partial.balance);
      if (partial.positions !== undefined) setPositions(partial.positions);
      if (partial.trades !== undefined) setTrades(partial.trades);
      if (partial.xp !== undefined) useTradingStore.getState().setXP(partial.xp);
      if (partial.level !== undefined) useTradingStore.getState().setLevel(partial.level);
    }
  );

  const filteredAndSorted = useMemo(() => {
    return assets
      .filter((a) => {
        const matchesFilter = filter === "All" || a.category === filter;
        const matchesSearch =
          a.symbol.toLowerCase().includes(search.toLowerCase()) ||
          a.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        const aFav = favorites.includes(a.symbol);
        const bFav = favorites.includes(b.symbol);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return a.symbol.localeCompare(b.symbol);
      });
  }, [assets, filter, search, favorites]);

  const handleSell = async (id: string, qty: number) => {
    const res = await engine.closePosition(id, assets);
    toast({
      title: res.success ? "Position Closed" : "Error",
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
  };

  return (
    <div className="page-wrapper">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
        >
          {/* ─── Main Column ─── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Balance Card */}
            <BalanceCard />

            {/* Watchlist Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(13,17,23,0.5)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(88,166,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={18} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.2px" }}>
                      Market Watch
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>
                      {filteredAndSorted.length} instruments
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }}
                  />
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#22C55E", letterSpacing: "0.1em" }}>LIVE</span>
                </div>
              </div>

              {/* Search + Filter */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                {/* Search input */}
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <Search
                    size={15}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-dim)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      width: "100%",
                      height: 40,
                      background: "rgba(9,13,17,0.8)",
                      border: "1px solid var(--border-strong)",
                      borderRadius: 10,
                      padding: "0 16px 0 42px",
                      fontSize: 13,
                      color: "var(--text)",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(88,166,255,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
                  />
                </div>

                {/* Category filters */}
                <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        transition: "all 0.15s",
                        background: filter === cat ? "var(--accent)" : "rgba(30,38,51,0.6)",
                        color: filter === cat ? "#000" : "var(--text-muted)",
                        boxShadow: filter === cat ? "0 0 12px rgba(88,166,255,0.3)" : "none",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr auto auto",
                  gap: 10,
                  padding: "8px 16px",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 9,
                  fontWeight: 800,
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  background: "rgba(9,13,17,0.3)",
                }}
              >
                <div />
                <div>Asset</div>
                <div style={{ textAlign: "right" }}>Price</div>
                <div style={{ textAlign: "right" }}>24h Chg</div>
              </div>

              {/* Asset list */}
              <div style={{ minHeight: 320 }}>
                {filteredAndSorted.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: 12 }}>
                    <Zap size={36} style={{ color: "var(--border-strong)" }} />
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)" }}>No assets found</p>
                    <button
                      onClick={() => { setSearch(""); setFilter("All"); }}
                      style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div>
                    {filteredAndSorted.map((asset) => (
                      <AssetCard
                        key={asset.symbol}
                        asset={asset}
                        selected={false}
                        onSelect={(a) => router.push(`/chart/${a.symbol}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Sidebar Column ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* XP Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 4,
                boxShadow: "var(--shadow-md)",
              }}
            >
              <XPProgress />
            </div>

            {/* Positions Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(13,17,23,0.5)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(255,214,0,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Zap size={16} style={{ color: "#FFD700" }} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>
                    Active Positions
                  </span>
                </div>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    background: "var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  {positions.length}
                </span>
              </div>

              {positions.length === 0 ? (
                <div style={{ padding: "40px 24px", textAlign: "center" }}>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                      No open positions
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Pick an asset from the watchlist to trade
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/history")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: "var(--border)",
                      border: "none",
                      color: "var(--text)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <History size={14} />
                    View History
                  </button>
                </div>
              ) : (
                <div>
                  {positions.map((pos) => (
                    <PositionCard
                      key={pos.id}
                      position={pos}
                      onSell={handleSell}
                      engine={engine}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Insights card — desktop only */}
            <div
              className="hidden lg:block"
              style={{
                background: "linear-gradient(135deg, #1a2235 0%, #0b0f14 100%)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -30,
                  bottom: -30,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(88,166,255,0.08) 0%, transparent 70%)",
                }}
              />
              <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                Trade Insights
              </h4>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
                Stay updated with market trends. Your trading volume has increased this week.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 9, color: "var(--text-dim)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>
                    Weekly Volume
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 900, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
                    $42,500
                  </span>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp size={18} style={{ color: "var(--green-bright)" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </PageContainer>
      <Toaster />
    </div>
  );
}

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
  const { balance, positions, setBalance, setPositions, trades, setTrades, favorites, xp, level, streak, bestStreak } = useTradingStore();
  const [filter, setFilter] = useState<AssetCategory>("All");
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const engine = createTradingEngine(
    () => ({ balance, positions, trades, xp, level, streak, bestStreak }),
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
        const matchesSearch = a.symbol.toLowerCase().includes(search.toLowerCase()) || 
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

  const handleSell = (position: import("@/types/trading").Position) => {
    const res = engine.sell(position.id, position.quantity, assets);
    toast({
      title: res.success ? "Trade Executed" : "Trade Failed",
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
  };

  return (
    <div style={{ paddingTop: 12, paddingBottom: 100 }}>
      <PageContainer>
        <div style={{ marginBottom: 16 }}>
          <XPProgress />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
        >
          <BalanceCard />

          {/* Watchlist */}
          <div
            style={{
              background: "#0B0F14",
              border: "1px solid #1E2633",
              borderRadius: 8,
              marginBottom: 16,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}
          >
            {/* Header */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #1E2633", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={16} color="#58A6FF" />
                <span style={{ color: "#E6EDF3", fontWeight: 700, fontSize: 14 }}>
                  Market Watch
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(34, 197, 94, 0.1)", padding: "2px 8px", borderRadius: 10 }}>
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#22C55E",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: "#22C55E", fontSize: 9, fontWeight: 800 }}>LIVE</span>
                </div>
              </div>
            </div>

            {/* Category filter + Search */}
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #1E2633", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Search size={14} style={{ position: "absolute", left: 10, color: "#8B949E" }} />
                <input 
                  type="text"
                  placeholder="Search assets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#090D11",
                    border: "1px solid #2A2F36",
                    borderRadius: "6px",
                    padding: "8px 12px 8px 34px",
                    fontSize: "13px",
                    color: "#E6EDF3",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#58A6FF"}
                  onBlur={(e) => e.target.style.borderColor = "#2A2F36"}
                />
              </div>

              <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }} className="no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(cat)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      background: filter === cat ? "#58A6FF" : "transparent",
                      color: filter === cat ? "#000" : "#8B949E",
                      transition: "all 0.2s"
                    }}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Table header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                borderBottom: "1px solid #1E2633",
                fontSize: 10,
                fontWeight: 800,
                color: "#8B949E",
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}
            >
              <div style={{ flex: 1, paddingLeft: 24 }}>Symbol / Name</div>
              <div style={{ minWidth: 80, textAlign: "right", marginRight: 18 }}>Last Price</div>
              <div style={{ minWidth: 64, textAlign: "right" }}>Day Chg</div>
            </div>

            {/* Rows */}
            <div style={{ minHeight: 120 }}>
              {filteredAndSorted.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#8B949E" }}>
                   <Zap size={24} style={{ marginBottom: 12, opacity: 0.2 }} />
                   <div style={{ fontSize: 13, fontWeight: 600 }}>No results for &quot;{search}&quot;</div>
                   <button 
                    onClick={() => { setSearch(""); setFilter("All"); }}
                    style={{ background: "none", border: "none", color: "#58A6FF", fontSize: 12, marginTop: 8, cursor: "pointer", fontWeight: 700 }}
                   >
                     Reset filters
                   </button>
                </div>
              ) : (
                filteredAndSorted.map((asset) => (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    selected={false}
                    onSelect={(a) => {
                      router.push(`/chart/${a.symbol}`);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Open Positions */}
          <div
            style={{
              background: "#0B0F14",
              border: "1px solid #1E2633",
              borderRadius: 8,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #1E2633", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={16} color="#FFD700" />
                <span style={{ color: "#E6EDF3", fontWeight: 700, fontSize: 14 }}>
                  Active Positions
                </span>
              </div>
              <span style={{ color: "#8B949E", fontSize: 11, fontWeight: 800, background: "#1E2633", padding: "2px 8px", borderRadius: 4 }}>
                {positions.length}
              </span>
            </div>

            <div style={{ minHeight: 80 }}>
              {positions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ color: "#E6EDF3", fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
                    Your portfolio is quiet...
                  </div>
                  <div style={{ color: "#8B949E", fontSize: 12, marginBottom: 16 }}>
                    Select an asset above and start your trading journey! 🚀
                  </div>
                  <button 
                    onClick={() => router.push("/history")}
                    style={{ 
                      background: "#1E2633", 
                      color: "#E6EDF3", 
                      border: "none", 
                      padding: "8px 16px", 
                      borderRadius: 6, 
                      fontSize: 12, 
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      margin: "0 auto"
                    }}
                  >
                    <History size={14} />
                    View History
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
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
          </div>
        </motion.div>
      </PageContainer>
      <Toaster />
    </div>
  );
}

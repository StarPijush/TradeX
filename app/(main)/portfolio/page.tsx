"use client";

import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency } from "@/lib/utils/format";
import PositionCard from "@/components/trading/PositionCard";
import AnimateNumber from "@/components/ui/AnimateNumber";
import { TrendingUp, ShieldAlert, Zap, ArrowRight, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";

export default function PortfolioPage() {
  const router = useRouter();
  const { balance, positions, setBalance, setPositions, trades, setTrades, xp, level, streak, bestStreak } = useTradingStore();

  const engine = createTradingEngine(
    () => ({ balance, positions, trades, xp, level, streak, bestStreak }),
    (partial) => {
      if (partial.balance !== undefined) setBalance(partial.balance);
      if (partial.positions !== undefined) setPositions(partial.positions);
      if (partial.trades !== undefined) setTrades(partial.trades);
    }
  );

  const { pnl: totalPnL, pnlPct: totalPnLPct } = engine.calcTotalPnL(positions);
  const invested = positions.reduce((acc, p) => acc + p.avgPrice * p.quantity, 0);
  const netWorth = balance + invested + totalPnL;

  const handleSell = (positionId: string, quantity: number) => {
    engine.sell(positionId, quantity, []);
  };

  return (
    <div style={{ paddingTop: 16, paddingBottom: 100 }}>
      <PageContainer>
        {/* Net Worth Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 24, textAlign: "center" }}
        >
          <div style={{ color: "#8B949E", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>
            Account Net Worth
          </div>
          <div style={{ color: "#E6EDF3", fontSize: 40, fontWeight: 900, letterSpacing: "-1px" }}>
            <AnimateNumber value={netWorth} format={(v) => formatCurrency(v, true)} />
          </div>
          <div style={{ color: "#8B949E", fontSize: 13, fontWeight: 500, marginTop: 4 }}>
            Total account value including open positions
          </div>
        </motion.div>

        {/* Summary Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Invested", value: invested, icon: <Wallet size={12} /> },
            { 
              label: "P&L", 
              value: totalPnL, 
              isPnL: true, 
              pct: totalPnLPct, 
              icon: totalPnL >= 0 ? <TrendingUp size={12} /> : <ShieldAlert size={12} /> 
            },
            { label: "Available", value: balance, icon: <Zap size={12} /> },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "#0B0F14",
                border: "1px solid #1E2633",
                padding: "16px 12px",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ color: "#8B949E", fontSize: 9, fontWeight: 800, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
                {item.icon} {item.label}
              </div>
              <div style={{ 
                color: item.isPnL ? (item.value >= 0 ? "#22C55E" : "#EF4444") : "#E6EDF3", 
                fontSize: 16, 
                fontWeight: 800,
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {item.isPnL && (item.value >= 0 ? "+" : "")}
                  <AnimateNumber value={item.value} format={(v) => formatCurrency(v, true)} />
                </div>
                {item.isPnL && item.pct !== undefined && (
                  <span style={{ fontSize: 10, fontWeight: 700, marginTop: 2, opacity: 0.8 }}>
                    ({item.pct >= 0 ? "+" : ""}{item.pct.toFixed(2)}%)
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Holdings */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: "#E6EDF3", fontSize: 16, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
             Holdings
             <span style={{ fontSize: 11, background: "#1E2633", color: "#8B949E", padding: "2px 8px", borderRadius: 12 }}>{positions.length}</span>
          </div>
          
          <AnimatePresence>
            {positions.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  textAlign: "center", 
                  padding: "60px 20px", 
                  background: "linear-gradient(180deg, #0B0F14 0%, #06090D 100%)",
                  borderRadius: 16,
                  border: "1px dashed #1E2633"
                }}
              >
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: "50%", 
                  background: "rgba(88, 166, 255, 0.05)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "#58A6FF"
                }}>
                  <TrendingUp size={30} />
                </div>
                <div style={{ color: "#E6EDF3", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                  Ready to start trading?
                </div>
                <div style={{ color: "#8B949E", fontSize: 14, marginBottom: 24, padding: "0 20px" }}>
                  Your portfolio is currently empty. Start trading to see your performance! 🚀
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/simulator")}
                  style={{ 
                    background: "#E6EDF3", 
                    color: "#0D1117", 
                    border: "none", 
                    padding: "12px 24px", 
                    borderRadius: 12, 
                    fontSize: 14, 
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    margin: "0 auto",
                    boxShadow: "0 4px 20px rgba(255,255,255,0.1)"
                  }}
                >
                  Go Trade
                  <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="list" style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {positions.map((pos, i) => (
                  <motion.div
                    key={pos.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <PositionCard
                      position={pos}
                      onSell={handleSell}
                      engine={engine}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageContainer>
    </div>
  );
}

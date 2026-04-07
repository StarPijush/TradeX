"use client";

import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency } from "@/lib/utils/format";
import PositionCard from "@/components/trading/PositionCard";
import OrderCard from "@/components/trading/OrderCard";
import AnimateNumber from "@/components/ui/AnimateNumber";
import { TrendingUp, ShieldAlert, Zap, ArrowRight, Wallet, Clock, PieChart } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import { useState, useEffect } from "react";
import PortfolioSkeleton from "@/components/trading/portfolio/PortfolioSkeleton";

export default function PortfolioPage() {
  const router = useRouter();
  const { balance, positions, orders, setBalance, setPositions, setOrders, trades, setTrades, xp, level, streak, bestStreak, prices } = useTradingStore();

  const engine = createTradingEngine(
    () => ({ balance, positions, orders, trades, xp, level, streak, bestStreak, prices }),
    (partial) => {
      if (partial.balance !== undefined) setBalance(partial.balance);
      if (partial.positions !== undefined) setPositions(partial.positions);
      if (partial.orders !== undefined) setOrders(partial.orders);
      if (partial.trades !== undefined) setTrades(partial.trades);
    }
  );

  const { pnl: totalPnL, pnlPct: totalPnLPct } = engine.calculateTotalPnL(positions, prices);
  const invested = positions.reduce((acc, p) => acc + p.entryPrice * p.quantity, 0);
  const netWorth = balance + invested + totalPnL;

  const handleSell = (positionId: string, quantity: number) => {
     engine.closePosition(positionId, []); 
  };

  const handleCancelOrder = (orderId: string) => {
     setOrders(orders.filter(o => o.id !== orderId));
  };

  const pendingOrders = orders.filter(o => o.status === "pending");

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PortfolioSkeleton />;

  return (
    <div className="page-wrapper animate-fade-in">
      <PageContainer>
        {/* Net Worth Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E2633]/50 border border-[#1E2633] text-[#8B949E] text-[11px] font-black uppercase tracking-[0.15em]">
            <PieChart size={12} className="text-[#58A6FF]" />
            Portfolio Net Worth
          </div>
          <div className="text-[#E6EDF3] text-5xl md:text-7xl font-black tracking-tighter tabular-nums flex items-center justify-center gap-3">
            <AnimateNumber value={netWorth} format={(v) => formatCurrency(v, true)} flashColor={true} />
          </div>
          <p className="text-[#8B949E] text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">
            Combined liquid balance and current market value of all active holdings.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { 
              label: "Holdings", 
              value: invested, 
              icon: <Wallet size={16} />, 
              color: "text-[#E6EDF3]",
              bg: "from-[#111722] to-[#0D1117]"
            },
            { 
              label: "Unrealized P&L", 
              value: totalPnL, 
              isPnL: true, 
              pct: totalPnLPct, 
              icon: totalPnL >= 0 ? <TrendingUp size={16} /> : <ShieldAlert size={16} />,
              color: totalPnL >= 0 ? "text-[#22C55E]" : "text-[#EF4444]",
              bg: totalPnL >= 0 ? "from-[#111722] to-[#0D1C16]" : "from-[#111722] to-[#1C0D0D]"
            },
            { 
              label: "Liquid Balance", 
              value: balance, 
              icon: <Zap size={16} />, 
              color: "text-[#58A6FF]",
              bg: "from-[#111722] to-[#0D1117]" 
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${item.bg} border border-[#1E2633] p-6 rounded-2xl flex flex-col gap-4 shadow-xl hover:shadow-2xl transition-all group`}
            >
              <div className="flex items-center gap-2.5 text-[#8B949E] text-[10px] font-black uppercase tracking-widest">
                <span className="p-2 rounded-xl bg-[#1E2633]/50 group-hover:bg-[#1E2633] transition-colors">
                  {item.icon}
                </span>
                {item.label}
              </div>
              <div className={`text-2xl font-black tabular-nums ${item.color}`}>
                <div className="flex items-center gap-1.5">
                  {item.isPnL && (item.value > 0 ? "+" : "")}
                  <AnimateNumber value={item.value} format={(v) => formatCurrency(v, true)} flashColor={true} />
                </div>
                {item.isPnL && item.pct !== undefined && (
                  <div className="text-[12px] font-bold mt-1.5 opacity-80 flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded-md ${item.value >= 0 ? "bg-[#22C55E]/10" : "bg-[#EF4444]/10"}`}>
                      {item.pct >= 0 ? "+" : ""}{item.pct.toFixed(2)}%
                    </span>
                    <span>total return</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Pending Orders Section */}
          {pendingOrders.length > 0 && (
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <h3 className="text-[#E6EDF3] text-xl font-black tracking-tight">Active Orders</h3>
                  <span className="px-2.5 py-1 rounded-full bg-[#58A6FF]/10 text-[#58A6FF] text-[10px] font-black border border-[#58A6FF]/20">
                    {pendingOrders.length} PENDING
                  </span>
                  <div className="flex-1 h-px bg-[#1E2633]" />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingOrders.map((ord, i) => (
                    <motion.div
                      key={ord.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <OrderCard
                        order={ord}
                        onCancel={handleCancelOrder}
                      />
                    </motion.div>
                  ))}
               </div>
            </div>
          )}

          {/* Holdings Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <h3 className="text-[#E6EDF3] text-xl font-black tracking-tight">Market Holdings</h3>
               <span className="px-2.5 py-1 rounded-full bg-[#1E2633] text-[#8B949E] text-[10px] font-black border border-[#1E2633]">
                 {positions.length} POSITIONS
               </span>
               <div className="flex-1 h-px bg-[#1E2633]" />
            </div>
            
            <AnimatePresence mode="wait">
              {positions.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gradient-to-b from-[#0B0F14] to-[#0D1117] border border-[#1E2633] border-dashed rounded-[32px] p-16 text-center shadow-inner"
                >
                  <div className="w-20 h-20 rounded-3xl bg-[#58A6FF]/5 flex items-center justify-center mx-auto mb-8 text-[#58A6FF]">
                    <TrendingUp size={40} />
                  </div>
                  <h4 className="text-[#E6EDF3] text-2xl font-black mb-3">Your Portfolio is Empty</h4>
                  <p className="text-[#8B949E] text-base max-w-sm mx-auto mb-10 leading-relaxed">
                    You haven&apos;t opened any positions yet. Explore the marketplace to build your wealth.
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/simulator")}
                    className="bg-[#E6EDF3] text-black px-10 py-4 rounded-2xl text-base font-black flex items-center gap-3 mx-auto shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all"
                  >
                    Start Trading Now
                    <ArrowRight size={20} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  key="list" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  {positions.map((pos, i) => (
                    <motion.div
                      key={pos.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <PositionCard
                        position={pos}
                        onSell={handleSell}
                        engine={engine}
                        livePrice={prices[pos.symbol]}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}


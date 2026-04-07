"use client";

import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import { useTradingStore, getAnalytics } from "@/store/useTradingStore";
import { formatCurrency } from "@/lib/utils/format";
import { useMemo, useEffect, useRef, useState } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import XPProgress from "@/components/trading/XPProgress";
import { TrendingUp, Target, Award, Zap, ShieldAlert, Brain, BarChart3, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const trades = useTradingStore(s => s.trades);
  const streak = useTradingStore(s => s.streak);
  const analytics = useMemo(() => getAnalytics({ trades } as any), [trades]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const performanceBadges = useMemo(() => {
    const badges = [];
    if (analytics.winRate > 60) badges.push({ icon: <Brain size={12} />, label: "Smart Trader", color: "border-blue-500/30 text-blue-400 bg-blue-500/5" });
    if (analytics.totalPnL > 1000) badges.push({ icon: <Award size={12} />, label: "Profit Monster", color: "border-green-500/30 text-green-400 bg-green-500/5" });
    if (analytics.winRate < 40 && analytics.totalTrades > 5) badges.push({ icon: <ShieldAlert size={12} />, label: "High Risk", color: "border-red-500/30 text-red-400 bg-red-500/5" });
    if (streak >= 3) badges.push({ icon: <Zap size={12} />, label: "On Fire", color: "border-yellow-500/30 text-yellow-400 bg-yellow-500/5" });
    return badges;
  }, [analytics, streak]);

  const dailyGroups = useMemo(() => {
    const groups: { [key: string]: { date: string, count: number, pnl: number, timestamp: number } } = {};
    
    analytics.trades.forEach(trade => {
      const dateStr = new Date(trade.timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      if (!groups[dateStr]) {
        groups[dateStr] = { date: dateStr, count: 0, pnl: 0, timestamp: trade.timestamp };
      }
      groups[dateStr].count += 1;
      groups[dateStr].pnl += (trade.profit || 0);
    });

    return Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
  }, [analytics.trades]);

  const chartData = useMemo(() => {
    const sortedTrades = [...analytics.trades].sort((a, b) => a.timestamp - b.timestamp);
    let cumulative = 0;
    const data = sortedTrades.map(t => {
      cumulative += (t.profit || 0);
      return {
        time: Math.floor(t.timestamp / 1000) as any,
        value: Number(cumulative.toFixed(2))
      };
    });
    
    if (data.length > 0) {
      return [{ time: (data[0].time - 86400) as any, value: 0 }, ...data];
    }
    return [];
  }, [analytics.trades]);

  useEffect(() => {
    if (!hasMounted || !chartContainerRef.current || chartData.length < 2) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8B949E",
        fontSize: 10,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(42, 46, 57, 0.1)" },
        horzLines: { color: "rgba(42, 46, 57, 0.1)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 320,
      timeScale: {
        borderColor: "rgba(42, 46, 57, 0.2)",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "rgba(42, 46, 57, 0.2)",
        autoScale: true,
      },
      crosshair: {
        vertLine: { color: "#58A6FF", labelBackgroundColor: "#1E2633" },
        horzLine: { color: "#58A6FF", labelBackgroundColor: "#1E2633" },
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: "#22C55E",
      lineWidth: 2,
      priceLineVisible: false,
    });

    lineSeries.setData(chartData);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [chartData, hasMounted]);

  const StatCard = ({ label, value, subValue, icon, variant, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden p-5 rounded-2xl border border-white/[0.04] bg-[#0B0F14] shadow-lg group transition-all duration-300 hover:bg-[#11161D] ${
        variant === "success" ? "bg-gradient-to-br from-[#0B0F14] to-green-500/[0.02]" : 
        variant === "danger" ? "bg-gradient-to-br from-[#0B0F14] to-red-500/[0.02]" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[#8B949E] text-[9px] font-black uppercase tracking-[0.15em]">{label}</span>
        <div className="text-white/20 group-hover:text-white/50 transition-colors bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.05]">{icon}</div>
      </div>
      <div className="text-[#E6EDF3] text-xl font-black tabular-nums tracking-tight">{value}</div>
      {subValue && (
        <div className="mt-2 text-[10px] font-bold text-[#8B949E] flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] w-fit border border-white/[0.05]">
          {subValue}
        </div>
      )}
    </motion.div>
  );

  if (!hasMounted) return <PageContainer><div className="p-12 text-center text-[#8B949E] text-sm animate-pulse font-black uppercase tracking-widest">Analytics Terminal Loading...</div></PageContainer>;

  return (
    <div className="page-wrapper">
      <PageContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#58A6FF]/10 border border-[#58A6FF]/20 text-[#58A6FF] text-[10px] font-black uppercase tracking-widest mb-3">
              <Activity size={12} />
              Alpha Terminal v2.0
            </div>
            <h1 className="text-[#E6EDF3] text-4xl font-black tracking-tight mb-2">Performance Analytics</h1>
            <p className="text-[#8B949E] text-base font-medium max-w-lg">Advanced metrics and execution logs for your simulation history.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0B0F14] border border-[#1E2633] p-4 rounded-[20px] shadow-xl">
             <div className="flex flex-col items-end">
                <span className="text-[#8B949E] text-[9px] font-black uppercase tracking-widest leading-none mb-2">Current Momentum</span>
                <div className={`flex items-center gap-2.5 font-black text-sm tabular-nums px-3 py-1.5 rounded-xl ${streak >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {streak >= 0 ? <TrendingUp size={16} /> : <ShieldAlert size={16} />}
                  {Math.abs(streak)} Streak {streak >= 3 ? "🔥" : ""}
                </div>
             </div>
          </div>
        </div>

        <div className="mb-10">
           <XPProgress />
        </div>

        {/* Badges Section */}
        {performanceBadges.length > 0 && (
          <div className="flex gap-2.5 mb-10 flex-wrap">
            {performanceBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: i * 0.1 }}
                className={`flex items-center gap-2.5 border px-3.5 py-2 rounded-xl backdrop-blur-md ${badge.color}`}
              >
                {badge.icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="Total Realized" 
            value={formatCurrency(analytics.totalPnL, true)} 
            icon={<TrendingUp size={16} />}
            variant={analytics.totalPnL >= 0 ? "success" : "danger"}
            delay={0.1}
          />
          <StatCard 
            label="Execution Volume" 
            value={analytics.totalTrades} 
            icon={<Zap size={16} />}
            delay={0.2}
          />
          <StatCard 
            label="Accuracy Ratio" 
            value={`${analytics.winRate.toFixed(1)}%`} 
            icon={<Target size={16} />}
            delay={0.3}
          />
          <StatCard 
            label="Best Execution" 
            value={analytics.bestTrade ? formatCurrency(analytics.bestTrade.profit!, true) : "—"} 
            subValue={analytics.bestTrade?.symbol}
            icon={<Award size={16} />}
            delay={0.4}
          />
        </div>

        {/* Profit Curve */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-8 bg-[#0B0F14] border border-[#1E2633] p-8 rounded-[32px] shadow-2xl overflow-hidden relative"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-[#E6EDF3] text-sm font-black uppercase tracking-widest">Profit & Loss Curve</h3>
                <p className="text-[#8B949E] text-[11px] font-medium">Trajectory of realized gains over transaction history</p>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-1 bg-white/[0.03] rounded-full border border-white/[0.05]">
                <span className="text-[#8B949E] text-[10px] font-black tracking-widest uppercase">Performance Overview</span>
              </div>
            </div>

            {chartData.length < 2 ? (
              <div className="h-[240px] flex flex-col items-center justify-center border border-white/[0.03] rounded-[24px] bg-white/[0.01]">
                <BarChart3 size={32} className="text-white/[0.05] mb-4" />
                <p className="text-[#8B949E] text-[11px] font-black uppercase tracking-widest">Insufficient Data</p>
                <p className="text-[#4E5D6C] text-[10px] mt-1 font-medium">Execute more trades to generate performance analytics</p>
              </div>
            ) : (
              <div ref={chartContainerRef} className="w-full" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-4 bg-gradient-to-br from-[#1E2633] to-[#0B0F14] border border-[#1E2633] rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl"
          >
            <div className="z-10 relative">
               <h3 className="text-[#E6EDF3] text-sm font-black uppercase tracking-widest mb-6">Risk Profile</h3>
               <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-[#8B949E] mb-3">
                       <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Profit Factor</span>
                       <span className="text-[#E6EDF3]">1.82</span>
                    </div>
                    <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                       <div className="h-full bg-green-500/80 w-[60%] shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-[#8B949E] mb-3">
                       <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Sharpe Ratio</span>
                       <span className="text-[#E6EDF3]">2.4</span>
                    </div>
                    <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500/80 w-[75%] shadow-[0_0_8px_rgba(88,166,255,0.3)]" />
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-[#0D1117]/50 relative z-10">
               <p className="text-[#8B949E] text-[12px] leading-relaxed italic font-medium">
                 &quot;Precision and consistency are the cornerstones of market dominance. Your current risk-adjusted returns indicate superior strategy resilience.&quot;
               </p>
            </div>
            
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#58A6FF]/5 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* Daily Performance */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
           className="space-y-6"
        >
          <div className="flex items-center gap-4">
             <h3 className="text-[#E6EDF3] text-xl font-black tracking-tight">Alpha Logs</h3>
             <span className="px-2.5 py-1 rounded-full bg-[#1E2633] text-[#8B949E] text-[10px] font-black border border-[#1E2633]">
               {dailyGroups.length} ACTIVE PERIODS
             </span>
             <div className="flex-1 h-px bg-[#1E2633]" />
          </div>

          {dailyGroups.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#1E2633] rounded-[32px] bg-[#0B0F14]/30">
              <Zap size={32} className="text-[#1E2633] mx-auto mb-4" />
              <p className="text-[#8B949E] text-xs font-black uppercase tracking-widest">No historical logs encrypted</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyGroups.map((group, i: number) => (
                <motion.div 
                  key={group.date}
                  whileHover={{ y: -6, backgroundColor: "#11161D" }}
                  className="bg-[#0B0F14] border border-[#1E2633] px-6 py-5 rounded-2xl flex items-center justify-between shadow-xl group transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      group.pnl >= 0 ? "bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,83,80,0.1)]"
                    }`}>
                      {group.pnl >= 0 ? <TrendingUp size={22} /> : <ShieldAlert size={22} />}
                    </div>
                    <div>
                      <div className="text-[#E6EDF3] text-[15px] font-black tracking-tight">{group.date}</div>
                      <div className="text-[#8B949E] text-[11px] font-bold uppercase tracking-wider">{group.count} Ticks</div>
                    </div>
                  </div>
                  <div className={`text-base font-black tabular-nums ${group.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {group.pnl >= 0 ? '+' : ''}{formatCurrency(group.pnl, true)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </PageContainer>
    </div>
  );
}


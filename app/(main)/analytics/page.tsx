"use client";

import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import { useTradingStore, getAnalytics } from "@/store/useTradingStore";
import { formatCurrency } from "@/lib/utils/format";
import { useMemo, useEffect, useRef, useState } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import XPProgress from "@/components/trading/XPProgress";
import { TrendingUp, Target, Award, Zap, ShieldAlert, Brain } from "lucide-react";

export default function AnalyticsPage() {
  const store = useTradingStore();
  const analytics = useMemo(() => getAnalytics(store), [store]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const performanceBadges = useMemo(() => {
    const badges = [];
    if (analytics.winRate > 60) badges.push({ icon: <Brain size={14} />, label: "Smart Trader", color: "#58A6FF" });
    if (analytics.totalPnL > 1000) badges.push({ icon: <Award size={14} />, label: "Profit Monster", color: "#22C55E" });
    if (analytics.winRate < 40 && analytics.totalTrades > 5) badges.push({ icon: <ShieldAlert size={14} />, label: "High Risk", color: "#EF4444" });
    if (store.streak >= 3) badges.push({ icon: <Zap size={14} />, label: "On Fire", color: "#FFD700" });
    return badges;
  }, [analytics, store.streak]);

  // Group trades by day for the list
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

  // Chart data: Cumulative Profit
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
    
    // Add initial zero point if we have data
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
      },
      grid: {
        vertLines: { color: "#1E2633" },
        horzLines: { color: "#1E2633" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        borderColor: "#1E2633",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#1E2633",
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

  const StatCard = ({ label, value, subValue, icon, gradient, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ 
        background: gradient || "linear-gradient(145deg, #0B0F14 0%, #161B22 100%)", 
        border: "1px solid #1E2633", 
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#8B949E", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
        <div style={{ opacity: 0.5 }}>{icon}</div>
      </div>
      <div style={{ color: "#E6EDF3", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>{value}</div>
      {subValue && <div style={{ color: "#8B949E", fontSize: "11px", fontWeight: 600 }}>{subValue}</div>}
      
      {/* Decorative gradient blob */}
      <div style={{ 
        position: "absolute", 
        bottom: "-20%", 
        right: "-10%", 
        width: "60px", 
        height: "60px", 
        background: "rgba(88, 166, 255, 0.05)", 
        filter: "blur(30px)",
        borderRadius: "50%"
      }} />
    </motion.div>
  );

  if (!hasMounted) return <PageContainer><div>Loading Analytics...</div></PageContainer>;

  return (
    <PageContainer>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#E6EDF3", marginBottom: "4px" }}>Performance</h1>
            <p style={{ color: "#8B949E", fontSize: "13px" }}>Analyze your trading consistency and growth</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#8B949E", display: "block", marginBottom: 4 }}>CURRENT STREAK</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: store.streak >= 0 ? "#22C55E" : "#EF4444", fontWeight: 800 }}>
              {store.streak >= 0 ? <TrendingUp size={16} /> : <ShieldAlert size={16} />}
              {Math.abs(store.streak)} {store.streak >= 0 ? "Wins" : "Losses"} {store.streak >= 3 ? "🔥" : ""}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
           <XPProgress />
        </div>

        {/* Badges Section */}
        {performanceBadges.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            {performanceBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: i * 0.1 }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  background: "rgba(255,255,255,0.03)", 
                  border: `1px solid ${badge.color}44`,
                  padding: "4px 10px",
                  borderRadius: "20px"
                }}
              >
                <div style={{ color: badge.color }}>{badge.icon}</div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#E6EDF3" }}>{badge.label}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Overview Stats */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
          gap: "16px",
          marginBottom: "32px"
        }}>
          <StatCard 
            label="Net Profit" 
            value={formatCurrency(analytics.totalPnL, true)} 
            icon={<TrendingUp size={18} />}
            gradient={analytics.totalPnL >= 0 ? "linear-gradient(145deg, #0B1410 0%, #0D1C16 100%)" : "linear-gradient(145deg, #140B0B 0%, #1C0D0D 100%)"}
            delay={0.1}
          />
          <StatCard 
            label="Total Trades" 
            value={analytics.totalTrades} 
            icon={<Zap size={18} />}
            delay={0.2}
          />
          <StatCard 
            label="Win Rate" 
            value={`${analytics.winRate.toFixed(1)}%`} 
            icon={<Target size={18} />}
            delay={0.3}
          />
          <StatCard 
            label="Best Trade" 
            value={analytics.bestTrade ? formatCurrency(analytics.bestTrade.profit!, true) : "—"} 
            subValue={analytics.bestTrade?.symbol}
            icon={<Award size={18} />}
            delay={0.4}
          />
        </div>

        {/* Profit Curve */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{ 
            background: "#0B0F14", 
            border: "1px solid #1E2633", 
            padding: "20px",
            marginBottom: "32px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ color: "#8B949E", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Equity Curve</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: "10px", color: "#8B949E", fontWeight: 600 }}>Cumulative P&L</span>
            </div>
          </div>

          {chartData.length < 2 ? (
            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #1E2633", borderRadius: 8 }}>
              <div style={{ textAlign: "center" }}>
                <TrendingUp size={32} style={{ color: "#1E2633", marginBottom: 12 }} />
                <div style={{ color: "#8B949E", fontSize: "13px", fontStyle: "italic", marginBottom: "4px" }}>No Data to Plot</div>
                <div style={{ color: "#8B949E", fontSize: "11px" }}>Close your first trade to see the curve!</div>
              </div>
            </div>
          ) : (
            <div ref={chartContainerRef} style={{ width: "100%" }} />
          )}
        </motion.div>

        {/* Daily Performance */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.6 }}
        >
          <div style={{ color: "#8B949E", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Activity Log</div>
          {dailyGroups.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", border: "1px dashed #1E2633", borderRadius: 12, color: "#8B949E", fontSize: "13px" }}>
              <Zap size={32} style={{ color: "#1E2633", marginBottom: 12, margin: "0 auto" }} />
              No historical activity recorded yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dailyGroups.map((group, i: number) => (
                <motion.div 
                  key={group.date}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + (i * 0.05) }}
                  style={{ 
                    background: "#0B0F14", 
                    padding: "16px 20px", 
                    borderRadius: "10px",
                    border: "1px solid #1E2633",
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: "50%", 
                      background: group.pnl >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: group.pnl >= 0 ? "#22C55E" : "#EF4444"
                    }}>
                      {group.pnl >= 0 ? <TrendingUp size={20} /> : <ShieldAlert size={20} />}
                    </div>
                    <div>
                      <div style={{ color: "#E6EDF3", fontSize: "15px", fontWeight: 700 }}>{group.date}</div>
                      <div style={{ color: "#8B949E", fontSize: "11px", fontWeight: 600 }}>{group.count} trade{group.count !== 1 ? 's' : ''} settled</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: group.pnl >= 0 ? "#22C55E" : "#EF4444", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                      {group.pnl >= 0 ? '+' : ''}{formatCurrency(group.pnl, true)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageContainer>
  );
}

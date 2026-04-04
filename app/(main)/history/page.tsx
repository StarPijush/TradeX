"use client";

import { useMemo } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { useTradingStore } from "@/store/useTradingStore";
import { formatCurrency } from "@/lib/utils/format";

export default function HistoryPage() {
  const { trades } = useTradingStore();

  const groupedTrades = useMemo(() => {
    const groups: { [key: string]: typeof trades } = {};
    const sortedTrades = [...trades].sort((a, b) => b.timestamp - a.timestamp);

    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    sortedTrades.forEach((trade) => {
      const tradeDate = new Date(trade.timestamp);
      const dateStr = tradeDate.toDateString();
      
      let label = dateStr;
      if (dateStr === today) label = "Today";
      else if (dateStr === yesterdayStr) label = "Yesterday";
      else {
        label = tradeDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(trade);
    });

    return Object.entries(groups);
  }, [trades]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div style={{ paddingTop: 20, background: "#0B0F14", minHeight: "100vh" }}>
      <PageContainer>
        <div style={{ marginBottom: 24, padding: "0 4px" }}>
          <div style={{ color: "var(--text)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Trade History
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
            All your transaction logs
          </div>
        </div>

        {groupedTrades.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "80px 20px", 
            color: "#8B949E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{ 
              width: "48px", 
              height: "48px", 
              borderRadius: "50%", 
              background: "#1E2633", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              marginBottom: "8px"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#E6EDF3" }}>No history found</div>
            <div style={{ fontSize: "12px", opacity: 0.8, maxWidth: "240px", lineHeight: "1.5" }}>
              You haven&apos;t made any trades yet. Your transaction logs will populate here once you start executing orders.
            </div>
          </div>
        ) : (
          groupedTrades.map(([dateLabel, tradesInGroup]) => (
            <div key={dateLabel} style={{ marginBottom: 24 }}>
              <div 
                style={{ 
                  color: "var(--text-muted)", 
                  fontSize: 11, 
                  fontWeight: 600, 
                  textTransform: "uppercase", 
                  letterSpacing: "1px",
                  padding: "0 4px 8px 4px",
                  borderBottom: "1px solid #1E2633",
                  marginBottom: 8
                }}
              >
                {dateLabel}
              </div>
              
              {tradesInGroup.map((trade) => (
                <div
                  key={trade.id}
                  style={{
                    padding: "12px 4px",
                    borderBottom: "1px solid #1E2633",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Badge */}
                    <div
                      style={{
                        background: trade.type === "BUY" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: trade.type === "BUY" ? "#4ade80" : "#f87171",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: 4,
                        minWidth: 48,
                        textAlign: "center",
                      }}
                    >
                      {trade.type}
                    </div>

                    <div>
                      <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 14 }}>
                        {trade.symbol}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>
                        {trade.quantity} @ {formatCurrency(trade.price, true)}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>
                      {formatCurrency(trade.quantity * trade.price, true)}
                    </div>
                    <div style={{ color: "var(--text-dim)", fontSize: 10, marginTop: 2 }}>
                      {formatTime(trade.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </PageContainer>
    </div>
  );
}

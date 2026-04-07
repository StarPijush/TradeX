"use client";

import { memo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TapeEntry } from "@/lib/trading/orderBookEngine";

/* ─────────────────────────── Types ─────────────────────────── */

interface TradeTapeProps {
  trades: TapeEntry[];
}

/* ─────────────────── Single Trade Row ────────────────────────── */

const TradeRow = memo(function TradeRow({ trade }: { trade: TapeEntry }) {
  const isBuy = trade.side === "buy";
  const timeStr = new Date(trade.time).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: isBuy ? -10 : 10, backgroundColor: isBuy ? "rgba(38,166,154,0.3)" : "rgba(239,83,80,0.3)" }}
      animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      style={{
        display: "flex",
        alignItems: "center",
        height: 20,
        padding: "0 8px",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Trebuchet MS', 'Roboto Mono', monospace",
        cursor: "default",
      }}
    >
      <span
        style={{
          width: 60,
          color: "#787B86",
          fontSize: 10,
        }}
      >
        {timeStr}
      </span>
      <span
        style={{
          flex: 1,
          textAlign: "right",
          color: isBuy ? "#26A69A" : "#EF5350",
        }}
      >
        {trade.price.toFixed(2)}
      </span>
      <span
        style={{
          width: 50,
          textAlign: "right",
          color: "#D1D4DC",
        }}
      >
        {trade.size.toLocaleString()}
      </span>
    </motion.div>
  );
});

/* ─────────────────── Trade Tape Component ────────────────────── */

const TradeTape = memo(function TradeTape({ trades }: TradeTapeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new trades arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [trades.length]);

  return (
    <div
      id="trade-tape"
      style={{
        background: "#131722",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 200,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 8px 6px",
          borderBottom: "1px solid #1E2633",
        }}
      >
        <span
          style={{
            color: "#D1D4DC",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          TRADES
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#26A69A",
              animation: "pulse-green 1.5s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 9, color: "#787B86", fontWeight: 700 }}>LIVE</span>
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 8px",
          fontSize: 9,
          fontWeight: 700,
          color: "#787B86",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          borderBottom: "1px solid rgba(30,38,51,0.6)",
        }}
      >
        <span style={{ width: 60 }}>Time</span>
        <span style={{ flex: 1, textAlign: "right" }}>Price</span>
        <span style={{ width: 50, textAlign: "right" }}>Size</span>
      </div>

      {/* Trades list */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {trades.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 80,
              color: "#787B86",
              fontSize: 11,
              fontStyle: "italic",
            }}
          >
            Waiting for trades…
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {trades.map((trade) => (
              <TradeRow key={trade.id} trade={trade} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
});

export default TradeTape;

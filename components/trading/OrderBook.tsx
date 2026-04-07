"use client";

import { memo, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { OrderBookLevel, OrderBookSnapshot } from "@/lib/trading/orderBookEngine";
import { formatCurrency } from "@/lib/utils/format";

/* ─────────────────────────── Types ─────────────────────────── */

interface OrderBookProps {
  snapshot: OrderBookSnapshot;
  visibleLevels?: number;
}

/* ─────────────────── Single Level Row ────────────────────────── */

const OrderRow = memo(function OrderRow({
  level,
  maxVolume,
  side,
}: {
  level: OrderBookLevel;
  maxVolume: number;
  side: "bid" | "ask";
}) {
  const depthPct = maxVolume > 0 ? (level.volume / maxVolume) * 100 : 0;

  const isBid = side === "bid";
  const barColorStart = isBid ? "rgba(38, 166, 154, 0.25)" : "rgba(239, 83, 80, 0.25)";
  const barColorEnd = isBid ? "rgba(38, 166, 154, 0.05)" : "rgba(239, 83, 80, 0.05)";
  const textColor = isBid ? "#26A69A" : "#EF5350";

  const prevVol = useRef(level.volume);
  const flashColor = isBid ? "rgba(38, 166, 154, 0.2)" : "rgba(239, 83, 80, 0.2)";
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevVol.current !== level.volume) {
      if (bgRef.current) {
        bgRef.current.style.backgroundColor = flashColor;
        setTimeout(() => {
          if (bgRef.current) bgRef.current.style.backgroundColor = "transparent";
        }, 200);
      }
      prevVol.current = level.volume;
    }
  }, [level.volume, flashColor]);

  return (
    <div
      ref={bgRef}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        height: 22,
        padding: "0 8px",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Trebuchet MS', 'Roboto Mono', monospace",
        cursor: "default",
        transition: "background 0.3s ease-out",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "transparent";
      }}
    >
      {/* Depth bar */}
      <motion.div
        initial={{ width: `${depthPct}%` }}
        animate={{ width: `${depthPct}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [isBid ? "right" : "left"]: 0,
          background: `linear-gradient(to ${isBid ? "left" : "right"}, ${barColorStart}, ${barColorEnd})`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <span
        style={{
          flex: 1,
          color: textColor,
          textAlign: isBid ? "left" : "right",
          position: "relative",
          zIndex: 1,
        }}
      >
        {level.price.toFixed(2)}
      </span>
      <span
        style={{
          width: 60,
          textAlign: "right",
          color: "#D1D4DC",
          position: "relative",
          zIndex: 1,
        }}
      >
        {level.volume.toLocaleString()}
      </span>
      <span
        style={{
          width: 70,
          textAlign: "right",
          color: "#787B86",
          position: "relative",
          zIndex: 1,
        }}
      >
        {level.total.toLocaleString()}
      </span>
    </div>
  );
});

/* ─────────────────── Order Book Component ────────────────────── */

const OrderBook = memo(function OrderBook({ snapshot, visibleLevels = 12 }: OrderBookProps) {
  const { bids, asks, spread, spreadPercent, bestBid, bestAsk } = snapshot;

  // Slice to visible levels
  const visibleBids = bids.slice(0, visibleLevels);
  const visibleAsks = asks.slice(0, visibleLevels);

  // Max volume for depth bar scaling (across both sides for consistency)
  const maxVolume = useMemo(() => {
    const allVolumes = [...visibleBids, ...visibleAsks].map((l) => l.volume);
    return Math.max(...allVolumes, 1);
  }, [visibleBids, visibleAsks]);

  return (
    <div
      id="order-book"
      style={{
        background: "#131722",
        borderRadius: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 300,
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
          ORDER BOOK
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: "#787B86", fontWeight: 600 }}>DEPTH</span>
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
        <span style={{ flex: 1 }}>Price</span>
        <span style={{ width: 60, textAlign: "right" }}>Size</span>
        <span style={{ width: 70, textAlign: "right" }}>Total</span>
      </div>

      {/* Asks (reversed so lowest ask is at bottom) */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {[...visibleAsks].reverse().map((level) => (
          <OrderRow
            key={`ask-${level.price}`}
            level={level}
            maxVolume={maxVolume}
            side="ask"
          />
        ))}
      </div>

      {/* Spread bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 8px",
          background: "#0D1117",
          borderTop: "1px solid #1E2633",
          borderBottom: "1px solid #1E2633",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "#D1D4DC" }}>
          {bestAsk.toFixed(2)}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#787B86",
            background: "#1E222D",
            padding: "1px 6px",
            borderRadius: 2,
          }}
        >
          Spread: ${spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#D1D4DC" }}>
          {bestBid.toFixed(2)}
        </span>
      </div>

      {/* Bids */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {visibleBids.map((level) => (
          <OrderRow
            key={`bid-${level.price}`}
            level={level}
            maxVolume={maxVolume}
            side="bid"
          />
        ))}
      </div>
    </div>
  );
});

export default OrderBook;

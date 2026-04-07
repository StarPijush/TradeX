"use client";

import { memo, useMemo, useCallback } from "react";
import type { OrderBookSnapshot } from "@/lib/trading/orderBookEngine";
import { formatCurrency } from "@/lib/utils/format";

interface DepthChartProps {
  snapshot: OrderBookSnapshot;
  height?: number | string;
}

const DepthChart = memo(function DepthChart({ snapshot, height = 150 }: DepthChartProps) {
  const { bids, asks } = snapshot;

  const { maxVolume, minPrice, maxPrice } = useMemo(() => {
    if (bids.length === 0 || asks.length === 0) {
      return { maxVolume: 1, minPrice: 0, maxPrice: 100 };
    }
    const maxB = bids[bids.length - 1].total;
    const maxA = asks[asks.length - 1].total;
    const maxVol = Math.max(maxB, maxA, 1);
    
    // bids are sorted descending, so last bid is lowest price
    const minP = bids[bids.length - 1].price;
    // asks are sorted ascending, so last ask is highest price
    const maxP = asks[asks.length - 1].price;
    
    return { maxVolume: maxVol, minPrice: minP, maxPrice: maxP };
  }, [bids, asks]);

  // Width is 100% of container. We will use a viewBox of "0 0 1000 100" to keep relative scaling easy
  const viewBoxWidth = 1000;
  const viewBoxHeight = 100;

  const priceToX = useCallback((p: number) => {
    if (maxPrice === minPrice) return viewBoxWidth / 2;
    return ((p - minPrice) / (maxPrice - minPrice)) * viewBoxWidth;
  }, [maxPrice, minPrice, viewBoxWidth]);

  const volToY = useCallback((v: number) => {
    return viewBoxHeight - (v / maxVolume) * viewBoxHeight;
  }, [maxVolume, viewBoxHeight]);

  // Generate Bid path (from lowest price to highest price) - we reverse bids
  // Bids array is ordered highest price to lowest price.
  const bidPoints = useMemo(() => {
    if (bids.length === 0) return "";
    const pts = [];
    const reversed = [...bids].reverse(); // Now ordered lowest price to highest price
    pts.push(`0,${viewBoxHeight}`);
    pts.push(`0,${volToY(reversed[0].total)}`);
    pts.push(`${priceToX(reversed[0].price)},${volToY(reversed[0].total)}`);
    
    for (let i = 1; i < reversed.length; i++) {
        const prev = reversed[i - 1];
        const curr = reversed[i];
        pts.push(`${priceToX(curr.price)},${volToY(prev.total)}`);
        pts.push(`${priceToX(curr.price)},${volToY(curr.total)}`);
    }
    // End of bids
    const lastBid = reversed[reversed.length - 1];
    pts.push(`${priceToX(lastBid.price)},${viewBoxHeight}`);
    return pts.join(" ");
  }, [bids, priceToX, volToY]);

  // Generate Ask path (ordered lowest price to highest price)
  const askPoints = useMemo(() => {
    if (asks.length === 0) return "";
    const pts = [];
    const firstAsk = asks[0];
    pts.push(`${priceToX(firstAsk.price)},${viewBoxHeight}`);
    pts.push(`${priceToX(firstAsk.price)},${volToY(firstAsk.total)}`);
    
    for (let i = 1; i < asks.length; i++) {
        const prev = asks[i - 1];
        const curr = asks[i];
        pts.push(`${priceToX(curr.price)},${volToY(prev.total)}`);
        pts.push(`${priceToX(curr.price)},${volToY(curr.total)}`);
    }
    // End of asks
    const lastAsk = asks[asks.length - 1];
    pts.push(`${viewBoxWidth},${volToY(lastAsk.total)}`);
    pts.push(`${viewBoxWidth},${viewBoxHeight}`);
    return pts.join(" ");
  }, [asks, priceToX, volToY]);

  return (
    <div style={{ height, width: "100%", position: "relative", backgroundColor: "#131722", display: "flex", flexDirection: "column" }}>
        
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderBottom: "1px solid #1E2633" }}>
        <span style={{ color: "#D1D4DC", fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>DEPTH CHART</span>
      </div>

      {/* SVG Container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <svg
            preserveAspectRatio="none"
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        >
            <defs>
            <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(38, 166, 154, 0.4)" />
                <stop offset="100%" stopColor="rgba(38, 166, 154, 0.05)" />
            </linearGradient>
            <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(239, 83, 80, 0.4)" />
                <stop offset="100%" stopColor="rgba(239, 83, 80, 0.05)" />
            </linearGradient>
            </defs>
            
            <polygon points={bidPoints} fill="url(#bidGrad)" stroke="#26A69A" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <polygon points={askPoints} fill="url(#askGrad)" stroke="#EF5350" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Labels overlay */}
        <div style={{ position: "absolute", top: 4, left: 8, fontSize: 10, color: "rgba(38, 166, 154, 0.8)", fontWeight: 700 }}>
            Buy Vol: {bids.length > 0 ? bids[bids.length - 1].total.toLocaleString() : 0} 
        </div>
        <div style={{ position: "absolute", top: 4, right: 8, fontSize: 10, color: "rgba(239, 83, 80, 0.8)", fontWeight: 700 }}>
            Sell Vol: {asks.length > 0 ? asks[asks.length - 1].total.toLocaleString() : 0}
        </div>
      </div>

      {/* Axis */}
      <div style={{ padding: "4px 8px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#787B86" }}>
        <span>{formatCurrency(minPrice)}</span>
        <span>{formatCurrency((minPrice + maxPrice) / 2)}</span>
        <span>{formatCurrency(maxPrice)}</span>
      </div>
    </div>
  );
});

export default DepthChart;

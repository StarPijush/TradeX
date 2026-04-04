"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import CandleChart, { Candle } from "@/components/trading/CandleChart";
import { usePriceSimulation } from "@/lib/trading/usePriceSimulation";
import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { generateOHLCData, calculatePriceChange } from "@/lib/trading/ohlc";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import type { TradeMode } from "@/types/trading";

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "1D"] as const;

export default function ChartPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { toast } = useToast();
  const assets = usePriceSimulation();
  const asset = assets.find((a) => a.symbol === symbol) ?? assets[0];
  const { balance, positions, setBalance, setPositions } = useTradingStore();

  const [candles, setCandles] = useState<Candle[]>(() => generateOHLCData(asset.price, 100));
  const [currentPrice, setCurrentPrice] = useState(asset.price);
  const [timeframe, setTimeframe] = useState<(typeof TIMEFRAMES)[number]>("1D");
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<TradeMode>("buy");
  const [isExecuting, setIsExecuting] = useState(false);
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);

  // Auto-clear price flash
  useEffect(() => {
    if (priceFlash) {
      const timer = setTimeout(() => setPriceFlash(null), 300);
      return () => clearTimeout(timer);
    }
  }, [priceFlash]);

  const engine = useMemo(() => createTradingEngine(
    () => ({ balance, positions }),
    (partial) => {
      if (partial.balance !== undefined) setBalance(partial.balance);
      if (partial.positions !== undefined) setPositions(partial.positions);
    }
  ), [balance, positions, setBalance, setPositions]);

  const priceChange = calculatePriceChange(candles);
  const isUp = priceChange >= 0;
  const total = currentPrice * qty;
  const canAfford = total <= balance;

  const lastCandle = candles.at(-1) || { open: currentPrice, high: currentPrice, low: currentPrice, close: currentPrice };

  // Active position for this symbol
  const activePosition = positions.find((p) => p.symbol === asset.symbol);
  
  const pnlData = useMemo(() => {
    if (!activePosition) return { pnl: 0, pnlPct: 0, display: "" };
    const pnl = (currentPrice - activePosition.avgPrice) * activePosition.quantity;
    const pnlPct = ((currentPrice - activePosition.avgPrice) / activePosition.avgPrice) * 100;
    const sign = pnl >= 0 ? "+" : "";
    return {
      pnl,
      pnlPct,
      display: `${sign}${formatCurrency(pnl, true)} (${sign}${pnlPct.toFixed(2)}%)`
    };
  }, [activePosition, currentPrice]);

  const handleExecute = async () => {
    setIsExecuting(true);
    
    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    const res =
      mode === "buy"
        ? engine.buy(asset.symbol, qty, assets)
        : (() => {
            if (!activePosition) return { success: false, message: "No position to sell" };
            return engine.sell(activePosition.id, qty, assets);
          })();

    toast({
      title: res.success ? `Order ${mode === "buy" ? "Filled" : "Executed"}` : "Order Refused",
      description: res.success 
        ? `${mode === "buy" ? "Bought" : "Sold"} ${qty} ${asset.symbol} @ ${formatCurrency(currentPrice, true)}`
        : res.message,
      variant: res.success ? "default" : "destructive",
    });

    setIsExecuting(false);
  };

  const handlePriceUpdate = (newPrice: number) => {
    setPriceFlash(newPrice > currentPrice ? "up" : "down");
    setCurrentPrice(newPrice);
    
    // Update last candle close/high/low for realistic OHLC
    setCandles(prev => {
      const last = { ...prev.at(-1)! };
      last.close = newPrice;
      if (newPrice > last.high) last.high = newPrice;
      if (newPrice < last.low) last.low = newPrice;
      return [...prev.slice(0, -1), last];
    });
  };

  const OrderPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      style={{
        background: "#0B0F14",
        borderTop: isMobile ? "1px solid #1E2633" : "none",
        padding: isMobile ? "8px 12px 12px" : "10px",
        height: "fit-content",
      }}
    >
      {/* Position Summary / Empty State */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ color: "#8B949E", fontSize: 9, fontWeight: 700, marginBottom: 4, letterSpacing: "0.5px" }}>
          STATUS
        </div>
        {activePosition ? (
          <div style={{ padding: "6px 8px", background: "#1E2633", border: "1px solid #2A2F36" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
              <span style={{ fontSize: 11, color: "#E6EDF3", fontWeight: 700 }}>{activePosition.quantity} {activePosition.symbol}</span>
              <span style={{ fontSize: 11, color: pnlData.pnl >= 0 ? "#22C55E" : "#EF4444", fontWeight: 700 }}>
                {pnlData.display}
              </span>
            </div>
            <div style={{ fontSize: 10, color: "#8B949E" }}>
              Avg. {formatCurrency(activePosition.avgPrice, true)}
            </div>
          </div>
        ) : (
          <div style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #1E2633", color: "#8B949E", fontSize: 11, fontStyle: "italic" }}>
            No active position
          </div>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
          <span style={{ color: "#8B949E", fontSize: 9, fontWeight: 700, letterSpacing: "0.5px" }}>MARKET ORDER</span>
          {!activePosition && <span style={{ color: "#8B949E", fontSize: 10 }}>{formatCurrency(balance, true)} avbl</span>}
        </div>
        <div style={{ display: "flex", gap: 2, background: "#1E2633", padding: 2 }}>
          {(["buy", "sell"] as TradeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={isExecuting}
              className="active:scale-[0.98] transition-all"
              style={{
                flex: 1,
                height: 28,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 10,
                textTransform: "uppercase",
                background: mode === m ? (m === "buy" ? "#22C55E" : "#EF4444") : "transparent",
                color: mode === m ? "#fff" : "#8B949E",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Quick Actions */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <label style={{ color: "#8B949E", fontSize: 9, fontWeight: 700, letterSpacing: "0.5px" }}>QUANTITY</label>
          <div style={{ display: "flex", gap: 3 }}>
            {[1, 5, 10].map(v => (
              <button 
                key={v}
                onClick={() => setQty(prev => prev + v)}
                className="hover:bg-[#2A2F36] active:scale-90 transition-all"
                style={{ fontSize: 9, color: "#E6EDF3", background: "#1E2633", border: "none", padding: "1px 4px", minWidth: 24, cursor: "pointer" }}
              >
                +{v}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            disabled={isExecuting}
            className="active:scale-90 transition-all disabled:opacity-30"
            style={{ width: 34, height: 34, background: "#1E2633", border: "none", color: "#E6EDF3", fontSize: 14, cursor: "pointer" }}
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            disabled={isExecuting}
            onChange={(e) => setQty(Math.max(1, Number.parseInt(e.target.value) || 1))}
            style={{ flex: 1, height: 34, background: "transparent", border: "1px solid #1E2633", color: "#E6EDF3", fontSize: 13, fontWeight: 700, textAlign: "center", outline: "none" }}
          />
          <button
            onClick={() => setQty(qty + 1)}
            disabled={isExecuting}
            className="active:scale-90 transition-all disabled:opacity-30"
            style={{ width: 34, height: 34, background: "#1E2633", border: "none", color: "#E6EDF3", fontSize: 14, cursor: "pointer" }}
          >
            +
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: 12, padding: "6px 0", borderTop: "1px solid #1E2633" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
          <span style={{ color: "#8B949E" }}>Total Order Value</span>
          <span style={{ color: !canAfford && mode === "buy" ? "#EF4444" : "#E6EDF3", fontWeight: 700 }}>
            {formatCurrency(total, true)}
          </span>
        </div>
      </div>

      <button
        onClick={handleExecute}
        disabled={isExecuting || (!canAfford && mode === "buy") || (mode === "sell" && !activePosition)}
        className="active:scale-95 transition-all disabled:opacity-30"
        style={{
          width: "100%",
          height: 38,
          border: "none",
          cursor: "pointer",
          background: isExecuting ? "#4B5563" : (mode === "buy" ? "#166534" : "#991B1B"),
          color: "#fff",
          fontWeight: 800,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
        }}
      >
        {isExecuting ? "Executing..." : `${mode === "buy" ? "Open" : "Close"} ${asset.symbol}`}
      </button>
    </div>
  );

  return (
    <div style={{ background: "#0B0F14", minHeight: "100vh" }} className="pb-28">
      {/* Workstation Top Bar - High Density */}
      <div
        className="sticky top-12 z-40 bg-[#0B0F14] border-b border-[#1E2633] overflow-x-auto"
        style={{ height: 48, display: "flex", alignItems: "center" }}
      >
        <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ color: "#E6EDF3", fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px" }}>{asset.symbol}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span className="animate-pulse-green" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ color: "#22C55E", fontSize: 9, fontWeight: 700, letterSpacing: "0.5px" }}>LIVE</span>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", minWidth: 80 }}>
              <span 
                className="transition-colors duration-300"
                style={{ 
                  color: priceFlash === "up" ? "#22C55E" : (priceFlash === "down" ? "#EF4444" : "#E6EDF3"), 
                  fontWeight: 800, 
                  fontSize: 16,
                  lineHeight: "1.1"
                }}
              >
                {formatCurrency(currentPrice, true)}
              </span>
              <span style={{ color: isUp ? "#22C55E" : "#EF4444", fontWeight: 700, fontSize: 10 }}>
                {isUp ? "+" : ""}{formatPercent(priceChange)}
              </span>
            </div>

            {/* OHLC Mini Stats */}
            <div style={{ display: "flex", gap: 10, paddingLeft: 12, borderLeft: "1px solid #1E2633" }}>
              {[
                { l: "O", v: lastCandle.open },
                { l: "H", v: lastCandle.high },
                { l: "L", v: lastCandle.low },
                { l: "C", v: lastCandle.close },
              ].map(s => (
                <div key={s.l} style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <span style={{ color: "#8B949E", fontSize: 9, fontWeight: 600 }}>{s.l}</span>
                  <span style={{ color: "#E6EDF3", fontSize: 10, fontWeight: 700 }}>{formatCurrency(s.v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Segmented Timeframe Control */}
          <div style={{ display: "flex", gap: 0, background: "#1E2633", padding: 2, borderRadius: 2 }}>
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: "4px 10px",
                  border: "none",
                  background: timeframe === tf ? "#0B0F14" : "transparent",
                  color: timeframe === tf ? "#E6EDF3" : "#8B949E",
                  fontWeight: 700,
                  fontSize: 9,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout: Chart + Trade Panel */}
      <div style={{ maxWidth: 1400, margin: "0 auto" }} className="p-0">
        <div className="flex flex-col lg:flex-row lg:gap-0 lg:border-l lg:border-r border-[#1E2633]">
          <div className="flex-1 h-[65vh] lg:h-[520px] bg-[#0B0F14] border-b lg:border-b-0 lg:border-r border-[#1E2633] overflow-hidden">
            <CandleChart symbol={asset.symbol} data={candles} onPriceUpdate={handlePriceUpdate} />
          </div>

          <div className="w-full lg:w-[280px] bg-[#0B0F14]">
            <div className="block lg:hidden">
              <OrderPanel isMobile />
            </div>
            <div className="hidden lg:block sticky top-28">
              <OrderPanel />
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

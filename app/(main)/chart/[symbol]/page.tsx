"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import CandleChart from "@/components/trading/CandleChart";
import DrawingToolbar from "@/components/trading/DrawingToolbar";
import IndicatorsMenu from "@/components/trading/IndicatorsMenu";
import IndicatorPanel from "@/components/trading/IndicatorPanel";
import OrderBook from "@/components/trading/OrderBook";
import TradeTape from "@/components/trading/TradeTape";
import DepthChart from "@/components/trading/DepthChart";
import { usePriceSimulation } from "@/lib/trading/usePriceSimulation";
import { useTradingStore } from "@/store/useTradingStore";
import { useChartStore, type Timeframe } from "@/store/useChartStore";
import { useMarketStore } from "@/store/useMarketStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { createOrderBook, tickOrderBook, type OrderBookSnapshot } from "@/lib/trading/orderBookEngine";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Maximize2, Minimize2, Loader2, CheckCircle2, ArrowDownLeft, ArrowUpRight, Zap } from "lucide-react";
import type { OrderSide, OrderType } from "@/types/trading";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/utils/sound";
import FloatingEffect, { useFloatingEffect } from "@/components/ui/FloatingEffect";

/* ─── STANDALONE SUB-COMPONENTS ─── */

interface OrderPanelProps {
  showSuccess: boolean;
  side: OrderSide;
  setSide: (s: OrderSide) => void;
  orderType: OrderType;
  setOrderType: (t: OrderType) => void;
  currentPrice: number;
  limitPrice: number;
  setLimitPrice: (p: number) => void;
  isExecuting: boolean;
  qty: number;
  setQty: (q: number) => void;
  stopLoss: number | "";
  setStopLoss: (v: number | "") => void;
  takeProfit: number | "";
  setTakeProfit: (v: number | "") => void;
  total: number;
  balance: number;
  canAfford: boolean;
  activePosition: any;
  pnlData: any;
  handleExecute: () => void;
  buttonRef: any;
  symbol: string;
}

const OrderPanel = ({
  showSuccess, side, setSide, orderType, setOrderType, currentPrice, limitPrice, setLimitPrice,
  isExecuting, qty, setQty, stopLoss, setStopLoss, takeProfit, setTakeProfit,
  total, balance, canAfford, activePosition, pnlData, handleExecute, buttonRef, symbol
}: OrderPanelProps) => (
  <div className="order-panel-card !bg-transparent !p-0 gap-6">
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[60] bg-[#06090F]/90 flex flex-col items-center justify-center backdrop-blur-2xl rounded-2xl"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="flex flex-col items-center gap-5"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
              <CheckCircle2 size={40} />
            </div>
            <div className="text-center">
              <span className="block text-sm font-black text-white uppercase tracking-[4px] mb-1">Order Filled</span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Execution Complete</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Side Selection Toggle - Balanced Psychology */}
    <div className="flex p-1 bg-[#0D1117] rounded-xl border border-white/[0.04]">
      <button 
        onClick={() => setSide("buy")} 
        className={`flex-1 h-12 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-300 ${
          side === "buy" 
          ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
          : "text-white/20 hover:text-white/40"
        }`}
      >
        Buy
      </button>
      <button 
        onClick={() => setSide("sell")} 
        className={`flex-1 h-12 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-300 ${
          side === "sell" 
          ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
          : "text-white/20 hover:text-white/40"
        }`}
      >
        Sell
      </button>
    </div>

    {/* Execution Method Tabs */}
    <div className="pill-tab-group !bg-[#0D1117]/50">
      <button 
        onClick={() => setOrderType("market")} 
        className={`pill-tab ${orderType === "market" ? "active" : ""}`}
      >
        Market
      </button>
      <button 
        onClick={() => setOrderType("limit")} 
        className={`pill-tab ${orderType === "limit" ? "active" : ""}`}
      >
        Limit
      </button>
    </div>

    <div className="space-y-6">
      {/* Dynamic Input: Price */}
      <div className="order-p-input-group">
        <div className="flex justify-between items-center mb-2 px-1">
          <label htmlFor="price-input" className="text-[10px] font-black text-white/30 uppercase tracking-widest">Price</label>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">USD</span>
        </div>
        <div className="relative group">
          <input 
            id="price-input"
            type="number" 
            className="order-p-input !h-[60px] !bg-[#0D1117] !border-white/[0.05] !rounded-xl text-lg font-black group-hover:!border-white/10 transition-colors" 
            value={orderType === "market" ? currentPrice : limitPrice}
            onChange={(e) => setLimitPrice(Number(e.target.value))} 
            disabled={orderType === "market" || isExecuting} 
          />
          {orderType === "market" && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2.5 bg-[#06090F] py-1.5 px-3 rounded-lg border border-white/[0.03]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
              <span className="text-[10px] font-black text-green-400 tracking-widest">LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Input: Quantity */}
      <div className="order-p-input-group">
        <div className="flex justify-between items-center mb-2 px-1">
          <label htmlFor="amount-input" className="text-[10px] font-black text-white/30 uppercase tracking-widest">Amount</label>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{symbol}</span>
        </div>
        <input 
          id="amount-input"
          type="number" 
          className="order-p-input !h-[60px] !bg-[#0D1117] !border-white/[0.05] !rounded-xl text-lg font-black" 
          value={qty} 
          min={1} 
          onChange={(e) => setQty(Math.max(1, Number.parseInt(e.target.value) || 1))} 
          disabled={isExecuting} 
        />
      </div>

      {/* Risk Controls: SL/TP */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sl-input" className="block text-[9px] font-black text-white/20 uppercase tracking-widest mb-2 px-1">Stop Loss</label>
          <input 
            id="sl-input"
            type="number" 
            className="order-p-input !h-12 !bg-[#0D1117] !text-xs !font-bold !border-white/[0.04] !rounded-lg text-center" 
            placeholder="NONE" 
            value={stopLoss} 
            onChange={(e) => setStopLoss(e.target.value === "" ? "" : Number(e.target.value))} 
            disabled={isExecuting} 
          />
        </div>
        <div>
          <label htmlFor="tp-input" className="block text-[9px] font-black text-white/20 uppercase tracking-widest mb-2 px-1">Take Profit</label>
          <input 
            id="tp-input"
            type="number" 
            className="order-p-input !h-12 !bg-[#0D1117] !text-xs !font-bold !border-white/[0.04] !rounded-lg text-center" 
            placeholder="NONE" 
            value={takeProfit} 
            onChange={(e) => setTakeProfit(e.target.value === "" ? "" : Number(e.target.value))} 
            disabled={isExecuting} 
          />
        </div>
      </div>
    </div>

    {/* Transaction Summary */}
    <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Estimated Total</span>
        <span className="text-base font-black text-white tabular-nums">{formatCurrency(total, true)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Account Balance</span>
        <span className="text-[11px] font-black text-white/40 tabular-nums">{formatCurrency(balance, true)}</span>
      </div>
    </div>

    {/* PRIMARY CTA - Highest Confidence */}
    <motion.button
      ref={buttonRef} 
      onClick={handleExecute}
      disabled={isExecuting || (!canAfford && side === "buy")}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full h-[68px] rounded-2xl flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[3px] text-white shadow-2xl transition-all duration-300 ${
        side === "buy" 
        ? "bg-green-500 hover:bg-green-400 shadow-green-500/20" 
        : "bg-red-500 hover:bg-red-400 shadow-red-500/20"
      } ${(!canAfford && side === "buy") ? "opacity-30 grayscale cursor-not-allowed" : ""}`}
    >
      {isExecuting ? (
        <Loader2 className="animate-spin" size={24} />
      ) : (
        <>
          {side === "buy" ? <ArrowUpRight size={22} strokeWidth={3} /> : <ArrowDownLeft size={22} strokeWidth={3} />}
          {side === "buy" ? "Buy" : "Sell"} {symbol} {orderType === "market" ? "@ Market" : ""}
        </>
      )}
    </motion.button>

    {/* Contextual Position Intel */}
    {activePosition && (
      <div className="p-4 rounded-2xl border border-white/[0.03] bg-gradient-to-br from-white/[0.04] to-transparent">
        <div className="flex justify-between items-center mb-3">
           <div className="flex items-center gap-2.5">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[2px]">Position Active</span>
           </div>
           <div className={`text-sm font-black ${pnlData.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
             {pnlData.display}
           </div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold text-white/60">
           <span>{activePosition.quantity} {activePosition.symbol}</span>
           <span className="opacity-30">Entry: {formatCurrency(activePosition.entryPrice, true)}</span>
        </div>
      </div>
    )}
  </div>
);

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "1D"];
type MobileTab = "chart" | "orderbook" | "depth" | "trades";

export default function ChartPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { toast } = useToast();

  const assets = usePriceSimulation();
  const asset = assets.find((a) => a.symbol === symbol) ?? assets[0];
  const { balance, positions } = useTradingStore();
  const currentPrice = useMarketStore((s) => s.prices[asset.symbol]) ?? asset.price;

  const timeframe = useChartStore((s) => s.timeframe);
  const setTimeframe = useChartStore((s) => s.setTimeframe);
  const isFullscreen = useChartStore((s) => s.isFullscreen);
  const setFullscreen = useChartStore((s) => s.setFullscreen);
  const isIndicatorPanelOpen = useChartStore((s) => s.isIndicatorPanelOpen);
  const applyOrderImpact = useMarketStore((s) => s.applyOrderImpact);

  const [hasMounted, setHasMounted] = useState(false);
  const [qty, setQty] = useState(1);
  const [side, setSide] = useState<OrderSide>("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [limitPrice, setLimitPrice] = useState(asset.price);
  const [stopLoss, setStopLoss] = useState<number | "">("");
  const [takeProfit, setTakeProfit] = useState<number | "">("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { items, trigger } = useFloatingEffect();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chart");
  const [orderBook, setOrderBook] = useState<OrderBookSnapshot | null>(null);
  const orderBookRef = useRef<OrderBookSnapshot | null>(null);

  // Price flash state
  const prevPriceRef = useRef(currentPrice);
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (currentPrice > prevPriceRef.current) setPriceFlash("up");
    else if (currentPrice < prevPriceRef.current) setPriceFlash("down");
    prevPriceRef.current = currentPrice;
    const t = setTimeout(() => setPriceFlash(null), 500);
    return () => clearTimeout(t);
  }, [currentPrice]);

  useEffect(() => {
    setHasMounted(true);
    setLimitPrice(asset.price);
    const initialOB = createOrderBook(asset.price);
    setOrderBook(initialOB);
    orderBookRef.current = initialOB;
  }, [asset.symbol, asset.price]);

  useEffect(() => {
    if (!orderBookRef.current) return;
    const updated = tickOrderBook(orderBookRef.current, currentPrice);
    orderBookRef.current = updated;
    setOrderBook(updated);
  }, [currentPrice]);

  const engine = useMemo(() => createTradingEngine(
    () => useTradingStore.getState(),
    (partial) => useTradingStore.setState(partial)
  ), []);

  const total = (orderType === "market" ? currentPrice : limitPrice) * qty;
  const fee = total * 0.001;
  const canAfford = (total + fee) <= balance;
  const activePosition = positions.find((p) => p.symbol === asset.symbol);

  const pnlData = useMemo(() => {
    if (!activePosition) return { pnl: 0, pnlPct: 0, display: "" };
    const { pnl, pnlPct } = engine.calculatePnL(activePosition, currentPrice);
    const sign = pnl >= 0 ? "+" : "";
    return { pnl, pnlPct, display: `${sign}${formatCurrency(pnl, true)} (${sign}${pnlPct.toFixed(2)}%)` };
  }, [activePosition, currentPrice, engine]);

  const handleExecute = async () => {
    setIsExecuting(true);
    const sl = stopLoss === "" ? undefined : Number(stopLoss);
    const tp = takeProfit === "" ? undefined : Number(takeProfit);
    let res;
    if (orderType === "market") {
      res = await engine.executeMarketOrder(asset.symbol, side, qty, assets, sl, tp);
      applyOrderImpact(asset.symbol, side, qty);
    } else {
      res = engine.placeLimitOrder(asset.symbol, side, limitPrice, qty, sl, tp);
    }
    setIsExecuting(false);
    if (res.success) {
      if (side === "buy") sound.playBuy();
      else sound.playSell();
      if (buttonRef.current && orderType === "market") {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        trigger(`-$${fee.toFixed(2)} Fee`, x, y - 40, "#787B86");
        if (side === "buy") trigger(`-$${total.toLocaleString()}`, x, y, "#EF5350");
        else trigger(`+$${total.toLocaleString()}`, x, y, "#26A69A");
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      toast({ title: orderType === "market" ? "Order Filled" : "Order Placed", description: res.message });
    } else {
      toast({ variant: "destructive", title: "Execution Error", description: res.message });
    }
  };

  return (
    <div className={`chart-page-shell chart-page-body-scroll ${isIndicatorPanelOpen ? "panel-open" : ""} ${isFullscreen ? "fixed inset-0 z-[2000]" : ""}`}>
      <FloatingEffect items={items} />

      {/* ─── Refined Top Bar ─── */}
      <header className="h-12 bg-[#06090F] border-b border-white/[0.05] shrink-0 z-50 sticky top-0 px-4">
        <div className="grid grid-cols-[1fr,auto,1fr] w-full h-full items-center gap-4">
          
          {/* Left: Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-white font-black text-lg tracking-tighter shrink-0">{asset.symbol}</h1>
            <div className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[9px] font-black text-white/40 uppercase tracking-widest">PRO</div>
          </div>

          <div className="flex items-center justify-center px-4">
            <div className="flex items-baseline gap-3">
               <span className={`text-xl font-black tabular-nums transition-all duration-300 ${
                 priceFlash === 'up' ? 'text-green-400 scale-[1.02]' : 
                 priceFlash === 'down' ? 'text-red-400 scale-[1.02]' : 
                 'text-white'
               }`}>
                 {formatCurrency(currentPrice, true)}
               </span>
               <span className={`text-[10px] font-black tracking-wider ${asset.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"} hidden sm:block`}>
                 {asset.priceChangePercent >= 0 ? "▲" : "▼"} {formatPercent(asset.priceChangePercent)}
               </span>
            </div>
          </div>

          {/* Right: Tools & Actions */}
          <div className="flex justify-end items-center gap-3">
             <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.05] mr-2">
                {TIMEFRAMES.map((tf) => (
                  <button 
                    key={tf} 
                    onClick={() => setTimeframe(tf)} 
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                      timeframe === tf ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
             </div>
             <IndicatorsMenu />
             <div className="h-6 w-px bg-white/10 hidden sm:block mx-1" />
             <button 
                onClick={() => setFullscreen(!isFullscreen)} 
                className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
             >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile-Only Timeframe Row (Refined) */}
      <div className="lg:hidden border-b border-white/[0.03] bg-[#131722]/50 backdrop-blur-sm shrink-0">
         <div className="flex overflow-x-auto no-scrollbar px-4 py-2.5 gap-2">
            {TIMEFRAMES.map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)} className={`flex-1 min-w-[56px] py-2 rounded-lg text-[10px] font-black uppercase transition-all ${timeframe === tf ? "bg-white/10 text-white border border-white/10" : "text-white/30"}`}>
                {tf}
              </button>
            ))}
         </div>
      </div>

      <div className="chart-workspace bg-[#131722]">
        {/* Main dominance area */}
        <div className="chart-area shrink-0">
           <div className="chart-container-fixed flex flex-col h-full relative">
              <DrawingToolbar />
              <div className="flex-1 relative min-w-0 border-l border-white/[0.05]">
                 {hasMounted && <CandleChart symbol={asset.symbol} />}
              </div>
           </div>
        </div>

        {/* Desktop Pro Terminal (72/28 split via grid) */}
        {!isFullscreen && (
          <aside className="trade-panel-desktop !bg-[#06090F] sidebar-scroll border-white/[0.05]">
             <div className="flex flex-col h-full">
                <div className="h-[140px] border-b border-white/[0.05] shrink-0 p-2 opacity-90">
                   {orderBook && <DepthChart snapshot={orderBook} height="100%" />}
                </div>
                <div className="h-[280px] border-b border-white/[0.05] shrink-0 overflow-hidden">
                   {orderBook && <OrderBook snapshot={orderBook} visibleLevels={8} />}
                </div>
                <div className="flex-1 min-h-0 p-6 overflow-y-auto custom-scrollbar">
                   <OrderPanel 
                      showSuccess={showSuccess}
                      side={side}
                      setSide={setSide}
                      orderType={orderType}
                      setOrderType={setOrderType}
                      currentPrice={currentPrice}
                      limitPrice={limitPrice}
                      setLimitPrice={setLimitPrice}
                      isExecuting={isExecuting}
                      qty={qty}
                      setQty={setQty}
                      stopLoss={stopLoss}
                      setStopLoss={setStopLoss}
                      takeProfit={takeProfit}
                      setTakeProfit={setTakeProfit}
                      total={total}
                      balance={balance}
                      canAfford={canAfford}
                      activePosition={activePosition}
                      pnlData={pnlData}
                      handleExecute={handleExecute}
                      buttonRef={buttonRef}
                      symbol={asset.symbol}
                   />
                </div>
             </div>
          </aside>
        )}

        {/* Mobile Modern Workspace */}
        {!isFullscreen && (
          <div className="lg:hidden flex flex-col w-full bg-[#131722]">
             {/* MODERN PILL TABS */}
             <div className="sticky top-12 z-40 bg-[#06090F]/90 backdrop-blur-xl border-b border-white/[0.03] p-4">
                <div className="pill-tab-group w-full max-w-sm mx-auto !bg-[#0D1117]">
                   {(["chart", "orderbook", "depth", "trades"] as const).map((tab) => (
                     <button 
                       key={tab} 
                       onClick={() => setMobileTab(tab)} 
                       className={`pill-tab ${mobileTab === tab ? "active" : ""}`}
                     >
                       {tab === "orderbook" ? "Book" : tab === "depth" ? "Depth" : tab}
                     </button>
                   ))}
                </div>
             </div>

             {/* Dynamic Content Section */}
             {mobileTab !== "chart" && (
                <div className="bg-[#06090F] min-h-[50vh] border-b border-white/[0.03] animate-fade-in">
                   {mobileTab === "orderbook" && orderBook && <OrderBook snapshot={orderBook} visibleLevels={20} />}
                   {mobileTab === "depth" && orderBook && <DepthChart snapshot={orderBook} height="50vh" />}
                   {mobileTab === "trades" && orderBook && <TradeTape trades={orderBook.lastTrades} />}
                </div>
             )}

             {/* UPGRADED MOBILE EXECUTION PANEL */}
             <section className="trade-panel-mobile !bg-[#06090F] pt-8 px-6 pb-24 flex flex-col gap-8">
                <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                         <Zap size={22} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-white font-black text-sm uppercase tracking-wider leading-none">Instant Access</h2>
                        <span className="text-[10px] font-bold text-white/20 uppercase mt-1.5 tracking-tighter">Verified Node 01-XC</span>
                      </div>
                   </div>
                   <div className="badge badge-dim !bg-green-500/5 !text-green-400/80 !border-green-500/10">SECURE</div>
                </div>
                <OrderPanel 
                  showSuccess={showSuccess}
                  side={side}
                  setSide={setSide}
                  orderType={orderType}
                  setOrderType={setOrderType}
                  currentPrice={currentPrice}
                  limitPrice={limitPrice}
                  setLimitPrice={setLimitPrice}
                  isExecuting={isExecuting}
                  qty={qty}
                  setQty={setQty}
                  stopLoss={stopLoss}
                  setStopLoss={setStopLoss}
                  takeProfit={takeProfit}
                  setTakeProfit={setTakeProfit}
                  total={total}
                  balance={balance}
                  canAfford={canAfford}
                  activePosition={activePosition}
                  pnlData={pnlData}
                  handleExecute={handleExecute}
                  buttonRef={buttonRef}
                  symbol={asset.symbol}
                />
             </section>
          </div>
        )}
      </div>

      <IndicatorPanel />
      <Toaster />
    </div>
  );
}

"use client";

import { memo, useCallback, useState, useRef, useMemo } from "react";
import { Asset, OrderSide } from "@/types/trading";
import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency } from "@/lib/utils/format";
import { useToast } from "@/components/ui/use-toast";
import { sound } from "@/lib/utils/sound";
import FloatingEffect, { useFloatingEffect } from "@/components/ui/FloatingEffect";
import { Loader2 } from "lucide-react";
import OrderForm from "./panel/OrderForm";
import TradeSuccessOverlay from "./panel/TradeSuccessOverlay";
import OrderPanelSkeleton from "./panel/OrderPanelSkeleton";
import { AnimatePresence, motion } from "framer-motion";

interface TradePanelProps {
  asset: Asset | null;
  assets: Asset[];
  engine: ReturnType<typeof createTradingEngine>;
}

const TradePanel = memo(function TradePanel({ asset, assets, engine }: TradePanelProps) {
  const { toast } = useToast();
  const { balance } = useTradingStore();
  const [qty, setQty] = useState(1);
  const [side, setSide] = useState<OrderSide>("buy");
  const [sl, setSl] = useState<number | "">("");
  const [tp, setTp] = useState<number | "">("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { items, trigger } = useFloatingEffect();

  const handleExecute = useCallback(async () => {
    if (!asset) return;
    setIsLoading(true);
    
    const stopLoss = sl === "" ? undefined : Number(sl);
    const takeProfit = tp === "" ? undefined : Number(tp);

    const total = asset.price * qty;
    const fee = total * 0.001;

    const res = await engine.executeMarketOrder(
      asset.symbol, 
      side, 
      qty, 
      assets, 
      stopLoss, 
      takeProfit
    );

    setIsLoading(false);

    if (res.success) {
      if (side === "buy") sound.playBuy();
      else sound.playSell();

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        
        trigger(`-$${fee.toFixed(2)} Fee`, x, y - 40, "#787B86");
        if (side === "buy") {
          trigger(`-$${total.toLocaleString()}`, x, y, "#EF5350");
        } else {
          trigger(`+$${total.toLocaleString()}`, x, y, "#26A69A");
        }
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);

      toast({
        title: "Order Executed",
        description: res.message,
      });
    } else {
      toast({
        title: "Order Failed",
        description: res.message,
        variant: "destructive",
      });
    }
  }, [asset, side, qty, sl, tp, assets, engine, trigger, toast]);

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        position: "relative",
      }}
    >
      <FloatingEffect items={items} />
      <TradeSuccessOverlay show={showSuccess} />

      <AnimatePresence mode="wait">
        {!asset ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <OrderPanelSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <OrderForm 
              asset={asset}
              side={side}
              setSide={setSide}
              qty={qty}
              setQty={setQty}
              sl={sl}
              setSl={setSl}
              tp={tp}
              setTp={setTp}
              balance={balance}
              isLoading={isLoading}
              handleExecute={handleExecute}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default TradePanel;

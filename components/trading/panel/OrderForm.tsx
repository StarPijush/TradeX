"use client";

import { memo } from "react";
import { Asset, OrderSide } from "@/types/trading";
import { formatCurrency } from "@/lib/utils/format";
import { ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface OrderFormProps {
  asset: Asset | null;
  side: OrderSide;
  setSide: (side: OrderSide) => void;
  qty: number;
  setQty: (qty: number) => void;
  sl: number | "";
  setSl: (sl: number | "") => void;
  tp: number | "";
  setTp: (tp: number | "") => void;
  balance: number;
  isLoading: boolean;
  handleExecute: () => void;
}

const OrderForm = memo(function OrderForm({
  asset,
  side,
  setSide,
  qty,
  setQty,
  sl,
  setSl,
  tp,
  setTp,
  balance,
  isLoading,
  handleExecute,
}: OrderFormProps) {
  const total = asset ? asset.price * qty : 0;
  const fee = total * 0.001;
  const canAfford = (total + fee) <= balance;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Market Order
        </div>
        {asset ? (
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>{asset.symbol}</span>
            <span style={{ color: "var(--text)", fontWeight: 700, fontSize: 16 }}>{formatCurrency(asset.price, true)}</span>
          </div>
        ) : (
          <div style={{ color: "var(--text-dim)", fontSize: 13, fontStyle: "italic" }}>Select an asset</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "var(--bg)", padding: 3, borderRadius: 8 }}>
        {(["buy", "sell"] as OrderSide[]).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 12,
              textTransform: "uppercase",
              background: side === s ? (s === "buy" ? "var(--green)" : "var(--red)") : "transparent",
              color: side === s ? "#000" : "var(--text-muted)",
              borderRadius: 6,
              transition: "all 0.2s",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <label style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Quantity</label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ flex: 1, height: 40, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "0 12px", color: "var(--text)", fontSize: 15, fontWeight: 800, textAlign: "center", outline: "none" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div>
          <label style={{ color: "var(--text-muted)", fontSize: 9, fontWeight: 800, display: "block", marginBottom: 4 }}>STOP LOSS</label>
          <input 
            type="number" 
            placeholder="None"
            value={sl}
            onChange={(e) => setSl(e.target.value === "" ? "" : Number(e.target.value))}
            style={{ width: "100%", height: 36, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "0 10px", color: "var(--red)", fontSize: 12, fontWeight: 700, outline: "none" }}
          />
        </div>
        <div>
          <label style={{ color: "var(--text-muted)", fontSize: 9, fontWeight: 800, display: "block", marginBottom: 4 }}>TAKE PROFIT</label>
          <input 
            type="number" 
            placeholder="None"
            value={tp}
            onChange={(e) => setTp(e.target.value === "" ? "" : Number(e.target.value))}
            style={{ width: "100%", height: 36, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "0 10px", color: "var(--green)", fontSize: 12, fontWeight: 700, outline: "none" }}
          />
        </div>
      </div>

      {asset && (
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "12px", marginBottom: 20, border: "1px dashed var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
            <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Order Value</span>
            <span style={{ color: "var(--text)", fontWeight: 700 }}>{formatCurrency(total, true)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>Balance</span>
            <span style={{ color: !canAfford && side === "buy" ? "var(--red)" : "var(--text)", fontWeight: 800 }}>{formatCurrency(balance, true)}</span>
          </div>
        </div>
      )}

      <motion.button
        onClick={handleExecute}
        disabled={!asset || isLoading || (!canAfford && side === "buy")}
        whileTap={{ scale: 0.96 }}
        className={`btn-trading ${side === "buy" ? "animate-pulse-green-glow" : "animate-pulse-red-glow"}`}
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 8,
          border: "none",
          cursor: (asset && !isLoading) ? "pointer" : "not-allowed",
          background: !asset ? "var(--border)" : side === "buy" ? "var(--green)" : "var(--red)",
          color: "#000",
          fontWeight: 900,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxShadow: side === "buy" ? "0 4px 20px rgba(38, 166, 154, 0.3)" : "0 4px 20px rgba(239, 83, 80, 0.3)",
        }}
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {side === "buy" ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
            Market {side}
          </div>
        )}
      </motion.button>
    </>
  );
});

export default OrderForm;

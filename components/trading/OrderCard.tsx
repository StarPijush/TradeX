import { memo } from "react";
import { Order } from "@/types/trading";
import { formatCurrency } from "@/lib/utils/format";
import { motion } from "framer-motion";
import { Clock, X, Zap } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onCancel: (id: string) => void;
}

const OrderCard = memo(function OrderCard({ order, onCancel }: OrderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        background: "transparent",
        gap: 12,
      }}
    >
      {/* Left - Symbol Info & Side */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>
            {order.symbol}
          </span>
          <span style={{ 
            fontSize: 9, 
            fontWeight: 800, 
            padding: "2px 8px",
            borderRadius: 5,
            background: order.side === "buy" ? "rgba(38, 166, 154, 0.12)" : "rgba(239, 83, 80, 0.12)",
            color: order.side === "buy" ? "var(--green)" : "var(--red)",
            border: `1px solid ${order.side === "buy" ? "rgba(38, 166, 154, 0.2)" : "rgba(239, 83, 80, 0.2)"}`,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Limit {order.side}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}>
          <Zap size={11} className="opacity-60" />
          {order.quantity} units @ {formatCurrency(order.price, true)}
        </div>
        {(order.stopLoss || order.takeProfit) && (
          <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 9, fontWeight: 800 }}>
            {order.stopLoss && <span style={{ color: "var(--red)" }}>SL {formatCurrency(order.stopLoss)}</span>}
            {order.takeProfit && <span style={{ color: "var(--green)" }}>TP {formatCurrency(order.takeProfit)}</span>}
          </div>
        )}
      </div>

      {/* Right - Status & Cancel */}
      <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
             <Clock size={12} strokeWidth={2.5} /> Pending
           </div>
           <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
             {formatCurrency(order.price * order.quantity, true)}
           </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onCancel(order.id)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "var(--red)",
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"; }}
          title="Cancel Order"
        >
          <X size={15} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
});

export default OrderCard;


"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface TradeSuccessOverlayProps {
  show: boolean;
}

const TradeSuccessOverlay = memo(function TradeSuccessOverlay({ show }: TradeSuccessOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(13, 17, 23, 0.95)",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            backdropFilter: "blur(4px)"
          }}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            style={{ color: "var(--green)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
          >
            <CheckCircle2 size={48} />
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "1px", textTransform: "uppercase" }}>Order Filled</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default TradeSuccessOverlay;

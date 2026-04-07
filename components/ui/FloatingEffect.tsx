"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingItem {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

export function useFloatingEffect() {
  const [items, setItems] = useState<FloatingItem[]>([]);

  const trigger = (text: string, x: number, y: number, color: string = "var(--green)") => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  };

  return { items, trigger };
}

export default function FloatingEffect({ items }: { items: FloatingItem[] }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1000, overflow: "hidden" }}>
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: item.y, x: item.x, scale: 0.8 }}
            animate={{ opacity: 1, y: item.y - 120, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              color: item.color,
              fontWeight: 800,
              fontSize: "1.25rem",
              textShadow: "0 0 12px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

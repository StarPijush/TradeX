"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

interface AnimateNumberProps {
  readonly value: number;
  readonly format?: (val: number) => string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly flashColor?: boolean;
  readonly showTick?: boolean;
}

export default function AnimateNumber({ value, format, className, style, flashColor = false, showTick = true }: AnimateNumberProps) {
  const motionValue = useMotionValue(value);
  const prevValue = useRef(value);
  
  // High-performance spring physics for financial UI
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 280,
    mass: 0.5,
  });
  
  const displayValue = useTransform(springValue, (latest: number) => {
    return format ? format(latest) : Math.floor(latest).toLocaleString();
  });

  const spanRef = useRef<HTMLSpanElement>(null);
  const [tick, setTick] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    return displayValue.on("change", (latest) => {
      if (spanRef.current) {
        // Fast DOM update to avoid React re-renders for the text itself
        spanRef.current.textContent = latest;
      }
    });
  }, [displayValue]);

  useEffect(() => {
    if (value !== prevValue.current) {
      if (showTick) {
        setTick(value > prevValue.current ? "up" : "down");
        setTimeout(() => setTick(null), 300);
      }

      if (flashColor && spanRef.current) {
        const isUp = value > prevValue.current;
        spanRef.current.style.color = isUp ? "var(--green)" : "var(--red)";
        spanRef.current.style.transition = "none";
        
        // Use requestAnimationFrame for smoother timing
        requestAnimationFrame(() => {
          if (spanRef.current) {
            spanRef.current.style.transition = "color 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
            spanRef.current.style.color = "inherit";
          }
        });
      }
      
      prevValue.current = value;
      motionValue.set(value);
    }
  }, [value, motionValue, flashColor, showTick]);

  return (
    <motion.span 
      ref={spanRef} 
      className={className} 
      style={{ 
        ...style, 
        display: "inline-block",
        position: "relative"
      }}
      animate={tick ? {
        y: tick === "up" ? [0, -4, 0] : [0, 4, 0],
        scale: [1, 1.05, 1],
      } : { y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {format ? format(value) : value.toLocaleString()}
    </motion.span>
  );
}

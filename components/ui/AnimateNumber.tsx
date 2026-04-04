"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

interface AnimateNumberProps {
  readonly value: number;
  readonly format?: (val: number) => string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export default function AnimateNumber({ value, format, className, style }: AnimateNumberProps) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  
  const displayValue = useTransform(springValue, (latest: number) => {
    return format ? format(latest) : Math.floor(latest).toLocaleString();
  });

  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return displayValue.on("change", (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = latest;
      }
    });
  }, [displayValue]);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <span ref={spanRef} className={className} style={style}>
      {format ? format(value) : value.toLocaleString()}
    </span>
  );
}

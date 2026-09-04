"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScoreRing({
  value,
  size = 148,
  strokeWidth = 10,
  label,
  sublabel,
  colorClass = "stroke-violet",
  animateKey,
}: {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorClass?: string;
  /** Change this to re-trigger the reveal animation (e.g. on refresh) */
  animateKey?: string | number;
}) {
  const reduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [displayValue, setDisplayValue] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplayValue(value);
      return;
    }
    setDisplayValue(0);
    const start = performance.now();
    const durationMs = 900;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, animateKey, reduced]);

  const offset = circumference - (displayValue / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn("fill-none", colorClass)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: reduced ? undefined : "stroke-dashoffset 0.1s linear",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-semibold tabular-nums text-foreground">{displayValue}</span>
        {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
        {sublabel && <span className="mt-0.5 text-[10px] text-muted-foreground/70">{sublabel}</span>}
      </div>
    </div>
  );
}

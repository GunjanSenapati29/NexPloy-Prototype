"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Shared hover-depth wrapper around <Card>. This is the ONE place hover
 * depth is defined — reuse it instead of hand-rolling hover:-translate-y
 * classes on individual cards.
 *
 * Default: translateY -2 to -4px, scale ~1.01, brighter border, soft
 * shadow. Set `tilt` only on selected showcase cards (not tables/dense
 * forms) for a subtle pointer-driven 3D tilt, max 2-4deg.
 */
export function DepthCard({
  children,
  className,
  tilt = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  id?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rawY, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [0, 1], [3, -3]);
  const rotateY = useTransform(springX, [0, 1], [-3, 3]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt || reduced || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    rawX.set(0.5);
    rawY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      className={cn("relative", tilt && "[perspective:900px]")}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={
        reduced
          ? undefined
          : { y: -3, scale: 1.01, transition: { duration: 0.2, ease: "easeOut" } }
      }
      style={
        tilt && !reduced
          ? { rotateX, rotateY, transformStyle: "preserve-3d" }
          : undefined
      }
    >
      <Card
        className={cn(
          "transition-[border-color,box-shadow] duration-200 hover:border-violet/40 hover:shadow-glow",
          className,
        )}
      >
        {children}
      </Card>
    </motion.div>
  );
}

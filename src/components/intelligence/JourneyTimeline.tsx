"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const PLACEMENT_JOURNEY_STAGES = [
  "PROFILE",
  "READY",
  "ELIGIBLE",
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFER",
  "JOINED",
] as const;

export function JourneyTimeline({
  stages = PLACEMENT_JOURNEY_STAGES as unknown as string[],
  currentIndex,
}: {
  stages?: string[];
  /** Index of the stage the student is currently at (0-based) */
  currentIndex: number;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="flex w-full items-center overflow-x-auto pb-2">
      {stages.map((stage, i) => {
        const completed = i < currentIndex;
        const current = i === currentIndex;
        const future = i > currentIndex;
        return (
          <div key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-colors",
                  completed && "border-success bg-success/15 text-success",
                  current && "border-violet-bright bg-violet/20 text-violet-bright",
                  current && !reduced && "animate-pulse-glow",
                  future && "border-border bg-muted text-muted-foreground",
                )}
              >
                {completed ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-[10px] font-medium uppercase tracking-wide",
                  completed && "text-success",
                  current && "text-violet-bright",
                  future && "text-muted-foreground/60",
                )}
              >
                {stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={cn(
                  "mx-1.5 h-0.5 min-w-[16px] flex-1 rounded-full",
                  i < currentIndex ? "bg-success/60" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

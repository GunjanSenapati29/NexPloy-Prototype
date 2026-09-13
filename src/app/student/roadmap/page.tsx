"use client";

import { motion } from "framer-motion";
import { Map, Info, Check } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { GlowLine } from "@/components/intelligence/GlowLine";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";
import { primaryStudent } from "@/data/mock/students";

const statusTone = { COMPLETED: "success", CURRENT: "default", UPCOMING: "muted" } as const;

export default function RoadmapPage() {
  const s = primaryStudent;
  const completed = s.roadmap.filter((r) => r.status === "COMPLETED").length;
  const current = s.roadmap.find((r) => r.status === "CURRENT");
  const upcoming = s.roadmap.filter((r) => r.status === "UPCOMING").length;
  const progress = Math.round((completed / s.roadmap.length) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Growth"
        title="Preparation Roadmap"
        subtitle="A sequenced plan to close your critical skill gaps before your next drives."
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Completed" value={completed} accent="success" />
        <StatCard label="Upcoming" value={upcoming} accent="violet" />
        <StatCard label="Overall Progress" value={progress} suffix="%" accent="violet" />
        <StatCard label="Total Milestones" value={s.roadmap.length} />
      </div>

      <DepthCard className="mb-6 p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Current Milestone</CardTitle>
          <Badge variant="default">{current?.week ?? "—"}</Badge>
        </div>
        <p className="text-sm font-medium">{current?.title ?? "All milestones complete"}</p>
        <p className="mt-1 text-xs text-muted-foreground">{current?.description}</p>
        <Progress value={progress} className="mt-4" />
        <p className="mt-2 text-xs text-muted-foreground">
          {completed} of {s.roadmap.length} milestones complete.
        </p>
      </DepthCard>

      <Alert className="mb-6">
        <Info />
        <AlertDescription>
          Projected scenario estimate — impact values are prototype figures, not guaranteed outcomes.
        </AlertDescription>
      </Alert>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative pl-8">
        <div className="absolute bottom-4 left-[15px] top-2 w-px overflow-hidden rounded-full">
          <GlowLine orientation="vertical" className="h-full" />
        </div>
        {s.roadmap.map((step, i) => {
          const isCurrent = step.status === "CURRENT";
          const isDone = step.status === "COMPLETED";
          return (
            <motion.div key={step.id} variants={staggerItem} className="relative mb-6 last:mb-0">
              <div
                className={cn(
                  "absolute -left-8 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isDone && "border-success bg-success/15 text-success",
                  isCurrent && "border-violet-bright bg-violet/15 text-violet-bright shadow-glow-strong animate-pulse-glow",
                  !isDone && !isCurrent && "border-border bg-muted text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <DepthCard
                className={cn("p-4", isCurrent && "border-violet/40 shadow-glow", isDone && "opacity-80")}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Map className="h-3.5 w-3.5 text-violet-bright" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {step.week}
                    </span>
                    <Badge variant={statusTone[step.status]}>{step.status}</Badge>
                  </div>
                  <span className="text-xs font-medium text-success">{step.estimatedImpact}</span>
                </div>
                <CardTitle className="mt-1.5">{step.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </DepthCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

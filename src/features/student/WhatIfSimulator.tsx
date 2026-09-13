"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Info, Sparkles, GraduationCap, ListChecks, Gauge, TrendingUp, Target } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { IntelligencePulse } from "@/components/intelligence/IntelligencePulse";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { GlowLine } from "@/components/intelligence/GlowLine";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";
import {
  WHAT_IF_BASELINE,
  simulateWhatIfScenario,
  whatIfFactorLabels,
  type WhatIfFactor,
} from "@/lib/simulate";

const FACTORS = Object.keys(whatIfFactorLabels) as WhatIfFactor[];

function ScenarioFlow({
  selectedCount,
  readinessImpact,
  delta,
  active,
}: {
  selectedCount: number;
  readinessImpact: number;
  delta: number;
  active: boolean;
}) {
  const stages = [
    { key: "student", label: "Current Student", icon: GraduationCap, value: null as string | null, live: true },
    { key: "improvements", label: "Selected Actions", icon: ListChecks, value: `${selectedCount}`, live: selectedCount > 0 },
    { key: "readiness", label: "Readiness Change", icon: Gauge, value: `+${readinessImpact}`, live: readinessImpact > 0 },
    { key: "probability", label: "Probability Change", icon: TrendingUp, value: `${delta >= 0 ? "+" : ""}${delta}%`, live: delta !== 0 },
    { key: "outcome", label: "Recommended Outcome", icon: Target, value: null, live: selectedCount > 0 },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:gap-2">
      {stages.map((stage, i) => {
        const Icon = stage.icon;
        return (
          <div key={stage.key} className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div
              className={cn(
                "flex min-w-[92px] flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 text-center transition-colors duration-300",
                stage.live ? "border-violet/40 bg-violet/10 shadow-glow" : "border-border bg-card",
              )}
            >
              <Icon className={cn("h-4 w-4", stage.live ? "text-violet-bright" : "text-muted-foreground")} />
              <span className="text-[9.5px] leading-tight text-muted-foreground">{stage.label}</span>
              {stage.value !== null && (
                <span className={cn("text-xs font-semibold tabular-nums", stage.live ? "text-violet-bright" : "text-muted-foreground")}>
                  {stage.value}
                </span>
              )}
            </div>
            {i < stages.length - 1 && <GlowLine active={active} className="w-5 sm:w-8" />}
          </div>
        );
      })}
    </div>
  );
}

export function WhatIfSimulator() {
  const [selected, setSelected] = useState<WhatIfFactor[]>([]);
  const [pulsing, setPulsing] = useState(false);
  const pushToast = useAppStore((s) => s.pushToast);

  const result = useMemo(() => simulateWhatIfScenario(selected), [selected]);
  const delta = result.probability - WHAT_IF_BASELINE;

  const toggle = (factor: WhatIfFactor) => {
    setSelected((prev) => (prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]));
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 700);
  };

  const applyRoadmap = () => {
    pushToast("Roadmap applied", "Your What-If scenario has been added to your roadmap.");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Growth"
        title="What-If Simulator"
        subtitle={`See how specific actions change your placement probability before you commit the time. Current baseline: ${WHAT_IF_BASELINE}%.`}
      />

      <DepthCard className="mb-5 p-4">
        <ScenarioFlow selectedCount={selected.length} readinessImpact={result.readinessImpact} delta={delta} active={pulsing} />
      </DepthCard>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <IntelligencePulse active={pulsing}>
          <Card className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <FlaskConical className="h-3.5 w-3.5 text-violet-bright" /> Simulated Placement Probability
            </div>
            <ScoreRing
              value={result.probability}
              size={180}
              strokeWidth={13}
              label="Probability"
              sublabel={`baseline ${WHAT_IF_BASELINE}%`}
              animateKey={result.probability}
            />
            <motion.div
              key={delta}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5 text-sm"
            >
              <span className="text-muted-foreground">Change:</span>
              <span className={delta >= 0 ? "font-semibold text-success" : "font-semibold text-risk"}>
                {delta >= 0 ? "+" : ""}
                {delta}%
              </span>
              <span className="text-muted-foreground">· Readiness impact:</span>
              <span className="font-semibold text-violet-bright">+{result.readinessImpact}</span>
            </motion.div>

            <div className="w-full rounded-lg border border-violet/30 bg-violet/5 p-3 text-center">
              <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-violet-bright">
                <Sparkles className="h-3 w-3" /> Recommended Path
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{result.recommendedPath}</p>
            </div>

            <Button variant="glow" className="w-full" onClick={applyRoadmap} disabled={selected.length === 0}>
              Apply This Roadmap
            </Button>
          </Card>
        </IntelligencePulse>

        <Card className="p-5">
          <CardTitle className="mb-4">Scenario Factors</CardTitle>
          <div className="space-y-1">
            {FACTORS.map((factor) => (
              <div
                key={factor}
                className="flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-accent/50"
              >
                <Label htmlFor={factor} className="cursor-pointer text-sm font-normal">
                  {whatIfFactorLabels[factor]}
                </Label>
                <Switch id={factor} checked={selected.includes(factor)} onCheckedChange={() => toggle(factor)} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Alert className="mt-5">
        <Info />
        <AlertDescription>
          Projected scenario estimate — not a guaranteed placement probability, and not a real ML
          prediction.
        </AlertDescription>
      </Alert>
    </div>
  );
}

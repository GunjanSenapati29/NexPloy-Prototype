"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Fingerprint, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { StagedRunner } from "@/components/intelligence/StagedRunner";
import { IntelligencePulse, IntelligencePulseBadge } from "@/components/intelligence/IntelligencePulse";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { showcaseEntrance } from "@/lib/motion-variants";
import { primaryStudent } from "@/data/mock/students";
import { digitalTwinSteps, simulateDigitalTwinRefresh } from "@/lib/simulate";
import { cn } from "@/lib/utils";

type RunState = "idle" | "running" | "done";

export function DigitalTwinPage() {
  const s = primaryStudent;
  const [runState, setRunState] = useState<RunState>("idle");
  const [revealKey, setRevealKey] = useState(0);
  const result = simulateDigitalTwinRefresh(s.id);

  const trendData = s.readinessTrend.map((v, i) => ({ label: `W${i + 1}`, value: v }));

  const handleRefresh = () => {
    setRunState("running");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Intelligence"
        title="Placement Digital Twin"
        subtitle="A continuously updated digital representation of a student's placement readiness and trajectory."
        actions={
          <Button variant="glow" onClick={handleRefresh} disabled={runState === "running"}>
            <RefreshCw className={cn("h-4 w-4", runState === "running" && "animate-spin")} />
            Refresh Digital Twin
          </Button>
        }
      />

      <IntelligencePulse active={runState === "running"}>
        <Card className="p-6">
          {runState === "running" ? (
            <div className="flex flex-col items-center gap-6 py-6">
              <IntelligencePulseBadge label="Refreshing Digital Twin" />
              <div className="w-full max-w-sm">
                <StagedRunner
                  steps={digitalTwinSteps}
                  onDone={() => {
                    setRunState("done");
                    setRevealKey((k) => k + 1);
                    window.setTimeout(() => setRunState("idle"), 1800);
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              {runState === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm font-medium text-success"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {result.label}
                </motion.div>
              )}
              <motion.div
                key={revealKey}
                initial="hidden"
                animate="visible"
                variants={showcaseEntrance}
                className="grid gap-8 md:grid-cols-[auto_1fr]"
              >
                <div className="flex flex-col items-center gap-3">
                  <ScoreRing value={s.readiness} size={168} strokeWidth={12} label="Readiness" sublabel="out of 100" animateKey={revealKey} />
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Fingerprint className="h-3.5 w-3.5 text-violet-bright" /> Target: {s.targetRole}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Component Breakdown
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <SkillBar label="Technical" value={s.breakdown.technical} />
                      <SkillBar label="Academic" value={s.breakdown.academic} />
                      <SkillBar label="Interview" value={s.breakdown.interview} />
                      <SkillBar label="Communication" value={s.breakdown.communication} />
                      <SkillBar label="Projects" value={s.breakdown.projects} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.strengths.map((st) => (
                          <Badge key={st} variant="success">
                            {st}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-risk">
                        <AlertTriangle className="h-3.5 w-3.5" /> Critical Gaps
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.criticalGaps.map((g) => (
                          <Badge key={g} variant="risk">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </Card>
      </IntelligencePulse>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-violet-bright" />
            <CardTitle>Readiness Trend</CardTitle>
          </div>
          <TrendAreaChart data={trendData} dataKey="value" xKey="label" />
        </Card>

        <Card className="p-5">
          <CardTitle className="mb-3">Recommended Actions</CardTitle>
          <div className="space-y-2.5">
            {s.roadmap.map((step) => (
              <div key={step.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <span className="mt-0.5 shrink-0 rounded-full bg-violet/15 px-2 py-0.5 text-[10px] font-semibold text-violet-bright">
                  {step.week}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                <span className="ml-auto shrink-0 text-xs font-medium text-success">{step.estimatedImpact}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, CheckCircle2, AlertTriangle, Lightbulb, Sparkles, Tag } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/PageHeader";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { StagedRunner } from "@/components/intelligence/StagedRunner";
import { IntelligencePulse, IntelligencePulseBadge } from "@/components/intelligence/IntelligencePulse";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { showcaseEntrance } from "@/lib/motion-variants";
import { primaryStudent } from "@/data/mock/students";
import { resumeAnalysisSteps, simulateResumeIntelligence } from "@/lib/simulate";
import { useAppStore } from "@/hooks/useAppStore";

type RunState = "idle" | "running" | "done";

export default function ResumeIntelligencePage() {
  const s = primaryStudent;
  const result = simulateResumeIntelligence(s.id);
  const [runState, setRunState] = useState<RunState>("idle");
  const [revealKey, setRevealKey] = useState(0);
  const pushToast = useAppStore((st) => st.pushToast);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Growth"
        title="Resume Intelligence"
        subtitle="How your resume reads against your target role, and what to change first."
        actions={
          <Button
            variant="glow"
            onClick={() => setRunState("running")}
            disabled={runState === "running"}
          >
            <FileSearch className="h-4 w-4" /> Re-analyze Resume
          </Button>
        }
      />

      <IntelligencePulse active={runState === "running"}>
        <Card className="p-6">
          {runState === "running" ? (
            <div className="flex flex-col items-center gap-6 py-6">
              <IntelligencePulseBadge label="Analyzing Resume" />
              <div className="w-full max-w-sm">
                <StagedRunner
                  steps={resumeAnalysisSteps}
                  onDone={() => {
                    setRunState("done");
                    setRevealKey((k) => k + 1);
                  }}
                />
              </div>
            </div>
          ) : (
            <motion.div
              key={revealKey}
              initial="hidden"
              animate="visible"
              variants={showcaseEntrance}
              className="grid gap-6 md:grid-cols-[auto_1fr]"
            >
              <div className="flex flex-col items-center gap-2">
                <ScoreRing
                  value={result.score}
                  size={156}
                  strokeWidth={12}
                  label="Resume Score"
                  sublabel="out of 100"
                  animateKey={revealKey}
                />
                <DemoDataBadge />
              </div>
              <div>
                <div className="rounded-lg border border-violet/30 bg-violet/5 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-bright">
                    <Sparkles className="h-3.5 w-3.5" /> Recommendation
                  </p>
                  <p className="mt-1.5 text-sm text-foreground">{result.recommendation}</p>
                </div>
                <p className="mb-2 mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" /> Missing Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((k) => (
                    <Badge key={k} variant="risk">
                      {k}
                    </Badge>
                  ))}
                </div>
                {runState === "done" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center gap-1.5 text-xs text-success"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Resume analysis regenerated
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </Card>
      </IntelligencePulse>

      <DataReveal stagger className="mt-5 grid gap-5 md:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <CardTitle>Strengths</CardTitle>
            </div>
            <ul className="space-y-2">
              {result.strengths.map((w) => (
                <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {w}
                </li>
              ))}
            </ul>
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <CardTitle>Weaknesses</CardTitle>
            </div>
            <ul className="space-y-2">
              {result.weaknesses.map((w) => (
                <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> {w}
                </li>
              ))}
            </ul>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DepthCard className="mt-5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-violet-bright" />
          <CardTitle>Project Suggestions</CardTitle>
        </div>
        <div className="space-y-2.5">
          {result.projectSuggestions.map((p) => (
            <div
              key={p}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <p className="text-sm text-muted-foreground">{p}</p>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => pushToast("Added to roadmap", `"${p}" was added to your roadmap.`)}
              >
                Add to Roadmap
              </Button>
            </div>
          ))}
        </div>
      </DepthCard>

      <Alert className="mt-5">
        <FileSearch />
        <AlertDescription>
          Prototype analysis — no real resume file is parsed and no document is uploaded.
        </AlertDescription>
      </Alert>
    </div>
  );
}

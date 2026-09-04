"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, XCircle, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { MatchBreakdownBars } from "@/components/intelligence/MatchBreakdown";
import { StagedRunner } from "@/components/intelligence/StagedRunner";
import { IntelligencePulse, IntelligencePulseBadge } from "@/components/intelligence/IntelligencePulse";
import { showcaseEntrance } from "@/lib/motion-variants";
import { getStudentById } from "@/data/mock/students";
import { getDriveById } from "@/data/mock/drives";
import { candidateAnalysisSteps, simulateCandidateAnalysis } from "@/lib/simulate";
import { cn } from "@/lib/utils";

type RunState = "idle" | "running" | "done";

function fitLabel(pct: number) {
  if (pct >= 88) return "HIGH FIT";
  if (pct >= 75) return "GOOD FIT";
  return "MODERATE FIT";
}

export function CandidateMatchingPage({ studentId, driveId }: { studentId: string; driveId: string }) {
  const student = getStudentById(studentId)!;
  const drive = getDriveById(driveId)!;
  const match = simulateCandidateAnalysis(studentId, driveId)!;

  const [runState, setRunState] = useState<RunState>("idle");
  const [revealKey, setRevealKey] = useState(0);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow={`Candidate for ${drive.companyName} — ${drive.role}`}
        title={student.name}
        subtitle={`${student.branch} · CGPA ${student.cgpa} · Readiness ${student.readiness}/100`}
        actions={
          <Button variant="glow" onClick={() => setRunState("running")} disabled={runState === "running"}>
            <Zap className="h-4 w-4" /> Analyze Candidate
          </Button>
        }
      />

      <IntelligencePulse active={runState === "running"}>
        <Card className="p-6">
          {runState === "running" ? (
            <div className="flex flex-col items-center gap-6 py-6">
              <IntelligencePulseBadge label="Generating Match Intelligence" />
              <div className="w-full max-w-sm">
                <StagedRunner
                  steps={candidateAnalysisSteps}
                  onDone={() => {
                    setRunState("done");
                    setRevealKey((k) => k + 1);
                  }}
                />
              </div>
            </div>
          ) : (
            <motion.div key={revealKey} initial="hidden" animate="visible" variants={showcaseEntrance}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{student.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Matched against {drive.companyName} — {drive.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold text-violet-bright tabular-nums">{match.overallFit}%</p>
                  <Badge variant={match.overallFit >= 88 ? "success" : "default"}>{fitLabel(match.overallFit)}</Badge>
                </div>
              </div>

              {runState === "done" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-1.5 text-xs text-success"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Match intelligence generated
                </motion.div>
              )}

              <DemoDataBadge className="mt-4" />
              <p className="mt-1 text-[11px] text-muted-foreground/70">Mocked prototype intelligence — not a real ML pipeline.</p>

              <div className="mt-5">
                <MatchBreakdownBars breakdown={match.breakdown} />
              </div>
            </motion.div>
          )}
        </Card>
      </IntelligencePulse>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card className="p-5">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Why Selected
          </p>
          <ul className="space-y-2">
            {match.whySelected.map((w) => (
              <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {w}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-risk">
            <XCircle className="h-3.5 w-3.5" /> Weak / Missing
          </p>
          <ul className="space-y-2">
            {match.weakOrMissing.map((w) => (
              <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk" /> {w}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className={cn("mt-5 border-violet/30 bg-violet/5 p-5")}>
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-bright">Recommendation</p>
        <p className="mt-1.5 text-sm text-foreground">{match.recommendation}</p>
      </Card>
    </div>
  );
}

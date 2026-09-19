"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowLeft,
  ListChecks,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { MatchBreakdownBars } from "@/components/intelligence/MatchBreakdown";
import { EligibilityChecklist } from "@/components/intelligence/EligibilityChecklist";
import { StagedRunner } from "@/components/intelligence/StagedRunner";
import {
  IntelligencePulse,
  IntelligencePulseBadge,
} from "@/components/intelligence/IntelligencePulse";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { GlowLine } from "@/components/intelligence/GlowLine";
import { showcaseEntrance } from "@/lib/motion-variants";
import { getStudentById } from "@/data/mock/students";
import { getDriveById } from "@/data/mock/drives";
import { candidateAnalysisSteps, simulateCandidateAnalysis } from "@/lib/simulate";
import { evaluateEligibility } from "@/lib/eligibility";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

type RunState = "idle" | "running" | "done";

function fitLabel(pct: number) {
  if (pct >= 88) return "STRONG MATCH";
  if (pct >= 78) return "GOOD MATCH";
  return "MODERATE MATCH";
}

/** Left/center/right matching network — Candidate → NEXPLOY Matching
 * Intelligence → Job/Recruiter — with connection lines that pulse while
 * a match analysis is running. Lightweight CSS/SVG, not a 3D scene. */
function MatchingNetwork({
  studentName,
  studentInitials,
  companyName,
  role,
  logoInitial,
  active,
}: {
  studentName: string;
  studentInitials: string;
  companyName: string;
  role: string;
  logoInitial: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback>{studentInitials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{studentName}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Candidate</p>
        </div>
      </div>

      <GlowLine active={active} className="w-8 sm:w-16" />

      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border border-violet/40 bg-violet/10",
            active && "shadow-glow-strong",
          )}
        >
          <Zap className="h-4 w-4 text-violet-bright" />
        </div>
        <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-wide text-violet-bright">
          NEXPLOY
          <br />
          Matching Intelligence
        </span>
      </div>

      <GlowLine active={active} className="w-8 sm:w-16" />

      <div className="flex min-w-0 items-center gap-2.5">
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-semibold">{companyName}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{role}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-xs font-bold text-violet-bright">
          {logoInitial}
        </div>
      </div>
    </div>
  );
}

export function CandidateMatchingPage({
  studentId,
  driveId,
}: {
  studentId: string;
  driveId: string;
}) {
  const student = getStudentById(studentId)!;
  const drive = getDriveById(driveId)!;
  const match = simulateCandidateAnalysis(studentId, driveId)!;
  const eligibility = evaluateEligibility(student, drive);

  const shortlisted = useAppStore((s) => s.shortlisted);
  const shortlistCandidates = useAppStore((s) => s.shortlistCandidates);
  const pushToast = useAppStore((s) => s.pushToast);

  const [runState, setRunState] = useState<RunState>("idle");
  const [revealKey, setRevealKey] = useState(0);

  const isShortlisted = shortlisted.includes(student.id);

  const shortlist = () => {
    shortlistCandidates([student.id]);
    pushToast("Candidate shortlisted", `${student.name} advanced to the shortlist for ${drive.role}.`);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/recruiter/candidates">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to candidate pool
        </Link>
      </Button>

      <PageHeader
        eyebrow={`Candidate for ${drive.companyName} — ${drive.role}`}
        title={student.name}
        subtitle={`${student.branch} · CGPA ${student.cgpa.toFixed(2)} · Readiness ${student.readiness}/100 · ${student.backlogs} active backlogs`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="glow"
              onClick={() => setRunState("running")}
              disabled={runState === "running"}
            >
              <Zap className="h-4 w-4" /> Analyze Candidate
            </Button>
            <Button
              variant="outline"
              onClick={shortlist}
              disabled={isShortlisted || !eligibility.eligible}
            >
              <ListChecks className="h-4 w-4" />
              {isShortlisted ? "Shortlisted" : "Shortlist"}
            </Button>
          </div>
        }
      />

      <DepthCard className="mb-5 p-5">
        <MatchingNetwork
          studentName={student.name}
          studentInitials={student.avatarInitials}
          companyName={drive.companyName}
          role={drive.role}
          logoInitial={drive.logoInitial}
          active={runState === "running"}
        />
      </DepthCard>

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
                    <p className="text-xs text-muted-foreground">
                      Matched against {drive.companyName} — {drive.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold tabular-nums text-violet-bright">
                    {match.overallFit}%
                  </p>
                  <Badge variant={match.overallFit >= 88 ? "success" : "default"}>
                    {fitLabel(match.overallFit)}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant={eligibility.eligible ? "success" : "risk"} className="gap-1">
                  {eligibility.eligible ? (
                    <ShieldCheck className="h-3 w-3" />
                  ) : (
                    <ShieldX className="h-3 w-3" />
                  )}
                  Eligibility {eligibility.eligible ? "PASS" : "FAIL"}
                </Badge>
                {isShortlisted && (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Shortlisted
                  </Badge>
                )}
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
              <p className="mt-1 text-[11px] text-muted-foreground/70">
                Mocked prototype intelligence — not a real ML pipeline.
              </p>

              <div className="mt-5">
                <MatchBreakdownBars breakdown={match.breakdown} />
              </div>
            </motion.div>
          )}
        </Card>
      </IntelligencePulse>

      <DepthCard className="mt-5 p-5">
        <CardTitle className="mb-1">Eligibility Check</CardTitle>
        <p className="mb-3 text-xs text-muted-foreground">
          Rule check against the published criteria — independent of the match score above.
        </p>
        <EligibilityChecklist student={student} drive={drive} />
      </DepthCard>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <DepthCard className="p-5">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
          </p>
          <ul className="space-y-2">
            {match.whySelected.map((w) => (
              <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {w}
              </li>
            ))}
          </ul>
        </DepthCard>
        <DepthCard className="p-5">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-risk">
            <XCircle className="h-3.5 w-3.5" /> Gaps
          </p>
          <ul className="space-y-2">
            {match.weakOrMissing.map((w) => (
              <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk" /> {w}
              </li>
            ))}
          </ul>
        </DepthCard>
      </div>

      <DepthCard className="mt-5 border-violet/30 bg-violet/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-bright">
          Recommendation
        </p>
        <p className="mt-1.5 text-sm text-foreground">{match.recommendation}</p>
      </DepthCard>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Fingerprint,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Target,
  Briefcase,
  ClipboardList,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { StagedRunner } from "@/components/intelligence/StagedRunner";
import {
  IntelligencePulse,
  IntelligencePulseBadge,
} from "@/components/intelligence/IntelligencePulse";
import { DigitalTwinCanvas } from "@/components/three/DigitalTwinCanvas";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { showcaseEntrance } from "@/lib/motion-variants";
import { primaryStudent } from "@/data/mock/students";
import { drives } from "@/data/mock/drives";
import { getApplicationsByStudent } from "@/data/mock/applications";
import { getMatchesByStudent } from "@/data/mock/matches";
import { getDriveById } from "@/data/mock/drives";
import { evaluateEligibility } from "@/lib/eligibility";
import { digitalTwinSteps, simulateDigitalTwinRefresh } from "@/lib/simulate";
import { riskTone } from "@/lib/status";
import { cn } from "@/lib/utils";

type RunState = "idle" | "running" | "done";

/** Compact key:value tile used for the twin's headline figures. */
function TwinStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "violet" | "success" | "risk";
}) {
  const toneClass = {
    default: "text-foreground",
    violet: "text-violet-bright",
    success: "text-success",
    risk: "text-risk",
  }[tone];
  return (
    <div className="rounded-lg border border-border bg-elevated/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-lg font-semibold tabular-nums", toneClass)}>{value}</p>
    </div>
  );
}

export function DigitalTwinPage() {
  const s = primaryStudent;
  const [runState, setRunState] = useState<RunState>("idle");
  const [revealKey, setRevealKey] = useState(0);
  const result = simulateDigitalTwinRefresh(s.id);

  const trendData = s.readinessTrend.map((v, i) => ({ label: `W${i + 1}`, value: v }));
  const applications = getApplicationsByStudent(s.id).filter((a) => a.status !== "eligible");
  const eligibleDrives = drives.filter(
    (d) => d.status === "ACTIVE" && evaluateEligibility(s, d).eligible,
  );
  const topMatch = getMatchesByStudent(s.id)[0];
  const topMatchDrive = topMatch ? getDriveById(topMatch.driveId) : undefined;

  const twinModules = [
    { label: "Academics", value: s.breakdown.academic },
    { label: "Skills", value: s.breakdown.technical },
    { label: "Projects", value: s.breakdown.projects },
    { label: "Assessments", value: s.breakdown.coding },
    { label: "Interview", value: s.breakdown.interview },
    { label: "Applications", value: s.breakdown.placementActivity },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Intelligence"
        title="Placement Digital Twin"
        subtitle="A continuously updated digital representation of a student's placement readiness and trajectory."
        actions={
          <Button
            variant="glow"
            onClick={() => setRunState("running")}
            disabled={runState === "running"}
          >
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
              >
                <div className="grid gap-8 md:grid-cols-[auto_1fr]">
                  <div className="flex flex-col items-center gap-3">
                    <ScoreRing
                      value={s.readiness}
                      size={168}
                      strokeWidth={12}
                      label="Readiness"
                      sublabel="out of 100"
                      animateKey={revealKey}
                    />
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Fingerprint className="h-3.5 w-3.5 text-violet-bright" /> Target:{" "}
                      {s.targetRole}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <TwinStat
                        label="Placement Probability"
                        value={`${s.placementProbability}%`}
                        tone="success"
                      />
                      <TwinStat label="Risk" value={s.riskLevel} tone={s.riskLevel === "LOW" ? "success" : "risk"} />
                      <TwinStat
                        label="Match"
                        value={topMatch ? `${topMatch.overallFit}%` : "—"}
                        tone="violet"
                      />
                      <TwinStat label="Active Applications" value={`${applications.length}`} />
                      <TwinStat label="Eligible Drives" value={`${eligibleDrives.length}`} />
                      <TwinStat label="Resume Score" value={`${s.resumeScore}/100`} />
                    </div>

                    {topMatchDrive && (
                      <Link
                        href={`/student/drives/${topMatchDrive.id}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-violet/30 bg-violet/5 p-3 transition-colors hover:border-violet/50"
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-violet-bright">
                            Top Match
                          </p>
                          <p className="truncate text-sm font-medium">
                            {topMatchDrive.companyName} — {topMatchDrive.role}
                          </p>
                        </div>
                        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-violet-bright">
                          {topMatch.overallFit}% <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </Link>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Strong Areas
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
                          <AlertTriangle className="h-3.5 w-3.5" /> Improvement Areas
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
                </div>

                <div className="mt-6">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Signals feeding the twin
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <SkillBar label="Academics" value={s.breakdown.academic} />
                    <SkillBar label="Technical Skills" value={s.breakdown.technical} />
                    <SkillBar label="Coding" value={s.breakdown.coding} />
                    <SkillBar label="Aptitude" value={s.breakdown.aptitude} />
                    <SkillBar label="Communication" value={s.breakdown.communication} />
                    <SkillBar label="Projects" value={s.breakdown.projects} />
                    <SkillBar label="Interview Readiness" value={s.breakdown.interview} />
                    <SkillBar label="Placement Activity" value={s.breakdown.placementActivity} />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </Card>
      </IntelligencePulse>

      <Card className="relative mt-5 overflow-hidden p-5">
        <div className="mb-1 flex items-center justify-between">
          <div>
            <CardTitle>Intelligence Constellation</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Live signal feeding into the Digital Twin from every readiness input.
            </p>
          </div>
        </div>
        <div key={revealKey} className="relative h-[340px] w-full sm:h-[380px]">
          <DigitalTwinCanvas readiness={s.readiness} modules={twinModules} />
        </div>
      </Card>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-violet-bright" />
            <CardTitle>Readiness Trend</CardTitle>
          </div>
          <TrendAreaChart data={trendData} dataKey="value" xKey="label" />
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            {s.riskLevel === "LOW" ? (
              <ShieldCheck className="h-4 w-4 text-success" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-risk" />
            )}
            <CardTitle>Next Best Actions</CardTitle>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant={riskTone[s.riskLevel]}>{s.riskLevel} RISK</Badge>
            <span className="text-xs text-muted-foreground">{s.riskReason}</span>
          </div>
          <div className="space-y-2.5">
            {s.roadmap
              .filter((step) => step.status !== "COMPLETED")
              .slice(0, 3)
              .map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <span className="mt-0.5 shrink-0 rounded-full bg-violet/15 px-2 py-0.5 text-[10px] font-semibold text-violet-bright">
                    {step.week}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-xs font-medium text-success">
                    {step.estimatedImpact}
                  </span>
                </div>
              ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/student/roadmap">
                <Target className="h-3.5 w-3.5" /> Roadmap
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/student/drives">
                <Briefcase className="h-3.5 w-3.5" /> Drives
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/student/applications">
                <ClipboardList className="h-3.5 w-3.5" /> Applications
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

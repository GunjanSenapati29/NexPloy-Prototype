"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShieldAlert,
  HeartHandshake,
  Plus,
  CheckCircle2,
  Circle,
  TrendingUp,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { IntelligencePulse } from "@/components/intelligence/IntelligencePulse";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { getStudentById } from "@/data/mock/students";
import { getRiskByStudent } from "@/data/mock/risk";
import { activeMentor, RECOMMENDED_PLAN_TEMPLATE } from "@/data/mock/mentors";
import { getApplicationsByStudent } from "@/data/mock/applications";
import { getInterviewsByStudent } from "@/data/mock/interviews";
import { useAppStore } from "@/hooks/useAppStore";
import { riskTone } from "@/lib/status";

export function InterventionDetail({ studentId }: { studentId: string }) {
  const student = getStudentById(studentId);
  const risk = student ? getRiskByStudent(student.id) : undefined;
  const interventions = useAppStore((s) => s.interventions);
  const createIntervention = useAppStore((s) => s.createIntervention);
  const activateIntervention = useAppStore((s) => s.activateIntervention);
  const toggleInterventionAction = useAppStore((s) => s.toggleInterventionAction);
  const pushToast = useAppStore((s) => s.pushToast);
  const [pulsing, setPulsing] = useState(false);

  if (!student) {
    return (
      <Card className="mx-auto max-w-md p-10 text-center text-sm text-muted-foreground">
        Student not found in the prototype dataset.
      </Card>
    );
  }

  const plan = interventions.find((p) => p.studentId === student.id);
  const applications = getApplicationsByStudent(student.id).filter((a) => a.status !== "eligible");
  const interviews = getInterviewsByStudent(student.id);
  const trendData = student.readinessTrend.map((v, i) => ({ label: `W${i + 1}`, value: v }));

  /** Focus areas come from the student's own flagged gaps, so a created
   * plan always matches what Risk Radar surfaced. */
  const focusAreas = (risk?.factors.map((f) => f.label) ?? student.criticalGaps).slice(0, 4);

  const create = () => {
    createIntervention({
      id: `int_${student.id}_mentor`,
      studentId: student.id,
      mentorId: activeMentor.id,
      status: "ACTIVE",
      createdOn: "13 Sep 2026",
      focusAreas,
      actions: RECOMMENDED_PLAN_TEMPLATE.map((label, i) => ({
        id: `int_${student.id}_m${i + 1}`,
        label,
        done: false,
      })),
      progress: 0,
      notes: "Plan created by the mentor from the intervention screen.",
    });
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 900);
    pushToast("Intervention created", `An ACTIVE plan is now tracking ${student.name}.`);
  };

  const activate = () => {
    if (!plan) return;
    activateIntervention(plan.id);
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 900);
    pushToast("Intervention activated", `${student.name}'s plan is now ACTIVE.`);
  };

  const markProgress = (actionId: string, label: string) => {
    if (!plan) return;
    toggleInterventionAction(plan.id, actionId);
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 700);
    pushToast("Progress updated", `"${label}" was updated for ${student.name}.`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/mentor/students">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to assigned students
        </Link>
      </Button>

      <PageHeader
        eyebrow="Intervention"
        title={student.name}
        subtitle={`${student.rollNumber} · ${student.branch} · CGPA ${student.cgpa.toFixed(2)} · ${student.placementStatus}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={riskTone[student.riskLevel]}>{student.riskLevel} RISK</Badge>
            {!plan && (
              <Button variant="glow" onClick={create}>
                <Plus className="h-4 w-4" /> Create Intervention
              </Button>
            )}
            {plan?.status === "PROPOSED" && (
              <Button variant="glow" onClick={activate}>
                <HeartHandshake className="h-4 w-4" /> Activate Plan
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        <Card className="flex flex-col items-center justify-center gap-3 p-6">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{student.avatarInitials}</AvatarFallback>
          </Avatar>
          <ScoreRing value={student.readiness} size={140} strokeWidth={11} label="Readiness" />
          <div className="text-center text-xs text-muted-foreground">
            Placement probability{" "}
            <span className="font-semibold text-foreground">{student.placementProbability}%</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-risk" />
            <CardTitle>Issues Identified</CardTitle>
          </div>
          {risk ? (
            <div className="space-y-2">
              {risk.factors.map((f) => (
                <div key={f.label} className="rounded-lg border border-border p-2.5">
                  <p className="text-xs font-medium">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No risk factors flagged for this student.
            </p>
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SkillBar label="Coding" value={student.breakdown.coding} />
            <SkillBar label="Communication" value={student.breakdown.communication} />
            <SkillBar label="Interview" value={student.breakdown.interview} />
            <SkillBar label="Placement Activity" value={student.breakdown.placementActivity} />
          </div>
        </Card>
      </div>

      <IntelligencePulse active={pulsing} className="mt-5">
        <Card className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-violet-bright" />
              <CardTitle>Intervention Plan</CardTitle>
            </div>
            {plan && (
              <Badge
                variant={
                  plan.status === "ACTIVE"
                    ? "default"
                    : plan.status === "COMPLETED"
                      ? "success"
                      : "muted"
                }
              >
                {plan.status}
              </Badge>
            )}
          </div>

          {!plan ? (
            <div className="py-6 text-center">
              <p className="mb-1 text-sm font-medium">No plan yet</p>
              <p className="mb-4 text-xs text-muted-foreground">
                The recommended plan for {student.name} is built from the issues above.
              </p>
              <div className="mx-auto mb-4 max-w-sm space-y-1.5 text-left">
                {RECOMMENDED_PLAN_TEMPLATE.map((t, i) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-sm"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet/15 text-[10px] font-semibold text-violet-bright">
                      {i + 1}
                    </span>
                    {t}
                  </div>
                ))}
              </div>
              <Button variant="glow" onClick={create}>
                <Plus className="h-4 w-4" /> Create Intervention
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {plan.focusAreas.map((f) => (
                  <Badge key={f} variant="warning">
                    {f}
                  </Badge>
                ))}
              </div>

              <div className="mb-4 flex items-center gap-3">
                <Progress value={plan.progress} className="flex-1" />
                <motion.span
                  key={plan.progress}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="shrink-0 text-sm font-semibold tabular-nums text-violet-bright"
                >
                  {plan.progress}%
                </motion.span>
              </div>

              <div className="space-y-2">
                {plan.actions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => markProgress(a.id, a.label)}
                    className="flex w-full items-center gap-2.5 rounded-lg border border-border p-3 text-left transition-colors hover:border-violet/40 hover:bg-accent/40"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={a.done ? "done" : "todo"}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.18 }}
                        className="shrink-0"
                      >
                        {a.done ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </motion.span>
                    </AnimatePresence>
                    <span className={a.done ? "text-sm text-muted-foreground line-through" : "text-sm"}>
                      {a.label}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {a.done ? "Done" : "Mark progress"}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-4 rounded-lg border border-border bg-elevated p-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Mentor notes: </span>
                {plan.notes}
              </p>

              {plan.progress === 100 && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-1.5 text-sm font-medium text-success"
                >
                  <Sparkles className="h-4 w-4" /> Plan complete — intervention marked COMPLETED.
                </motion.p>
              )}
            </>
          )}
        </Card>
      </IntelligencePulse>

      <DataReveal stagger className="mt-5 grid gap-5 md:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-bright" />
              <CardTitle>Readiness Trend</CardTitle>
            </div>
            <TrendAreaChart data={trendData} dataKey="value" xKey="label" height={200} />
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-violet-bright" />
              <CardTitle>Placement Activity</CardTitle>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Applications:{" "}
                <span className="font-medium text-foreground">{applications.length}</span>
              </p>
              <p className="text-muted-foreground">
                Interview rounds:{" "}
                <span className="font-medium text-foreground">{interviews.length}</span>
              </p>
              <p className="text-muted-foreground">
                Rounds cleared:{" "}
                <span className="font-medium text-foreground">
                  {interviews.filter((i) => i.result === "CLEARED").length}
                </span>
              </p>
              <p className="text-muted-foreground">
                Active backlogs:{" "}
                <span
                  className={
                    student.backlogs > 0 ? "font-medium text-risk" : "font-medium text-success"
                  }
                >
                  {student.backlogs}
                </span>
              </p>
              <p className="text-muted-foreground">
                Resume score:{" "}
                <span className="font-medium text-foreground">{student.resumeScore}/100</span>
              </p>
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Skill gaps
            </p>
            <div className="flex flex-wrap gap-1.5">
              {student.criticalGaps.map((g) => (
                <Badge key={g} variant="risk">
                  {g}
                </Badge>
              ))}
            </div>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>
    </div>
  );
}

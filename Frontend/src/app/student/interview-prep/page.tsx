"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessagesSquare, Play, CheckCircle2, Users, CalendarClock } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { IntelligencePulse } from "@/components/intelligence/IntelligencePulse";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { interviewPrepPlans } from "@/data/mock/interviews";
import { getInterviewsByStudent } from "@/data/mock/interviews";
import { primaryStudent } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

/** Deterministic progress step applied each time the student marks a
 * preparation session complete — never randomised. */
const PROGRESS_STEP = 9;
const PROGRESS_CEILING = 92;

export default function InterviewPrepPage() {
  const [driveId, setDriveId] = useState(interviewPrepPlans[0].driveId);
  const plan = interviewPrepPlans.find((p) => p.driveId === driveId) ?? interviewPrepPlans[0];
  const [progressByDrive, setProgressByDrive] = useState<Record<string, number>>({});
  const [pulsing, setPulsing] = useState(false);
  const pushToast = useAppStore((s) => s.pushToast);

  const score = progressByDrive[plan.driveId] ?? plan.preparationScore;
  const nextInterview = getInterviewsByStudent(primaryStudent.id).find(
    (i) => i.driveId === plan.driveId && i.status === "SCHEDULED",
  );

  const startSession = () => {
    const next = Math.min(PROGRESS_CEILING, score + PROGRESS_STEP);
    setProgressByDrive((prev) => ({ ...prev, [plan.driveId]: next }));
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 800);
    pushToast(
      "Preparation session logged",
      `${plan.companyName} preparation score is now ${next}% (simulated).`,
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Growth"
        title="Interview Preparation"
        subtitle="A focused preparation plan for the drive you are closest to."
        actions={
          <Select value={driveId} onValueChange={setDriveId}>
            <SelectTrigger className="w-60" aria-label="Select drive to prepare for">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {interviewPrepPlans.map((p) => (
                <SelectItem key={p.driveId} value={p.driveId}>
                  {p.companyName} — {p.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <IntelligencePulse active={pulsing}>
          <Card className="flex h-full flex-col items-center justify-center gap-4 p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Preparation Score
            </p>
            <ScoreRing
              value={score}
              size={168}
              strokeWidth={12}
              label="Prepared"
              sublabel={`${plan.companyName}`}
              animateKey={score}
            />
            <Button variant="glow" className="w-full" onClick={startSession} disabled={score >= PROGRESS_CEILING}>
              <Play className="h-4 w-4" />
              {score >= PROGRESS_CEILING ? "Preparation Complete" : "Start Preparation"}
            </Button>
            {nextInterview && (
              <p className="flex items-center gap-1.5 text-center text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5 text-violet-bright" />
                {nextInterview.round} on {nextInterview.date} at {nextInterview.time}
              </p>
            )}
          </Card>
        </IntelligencePulse>

        <Card className="p-5">
          <CardTitle className="mb-1">Technical Topics</CardTitle>
          <p className="mb-4 text-xs text-muted-foreground">
            Coverage is derived from your assessment scores and skill gaps.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.technicalTopics.map((t) => (
              <SkillBar
                key={t.topic}
                label={t.topic}
                value={t.coverage}
                colorClass={
                  t.coverage >= 70 ? "bg-success" : t.coverage >= 45 ? "bg-warning" : "bg-risk"
                }
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {plan.technicalTopics
              .filter((t) => t.coverage < 45)
              .map((t) => (
                <Badge key={t.topic} variant="risk">
                  Focus: {t.topic}
                </Badge>
              ))}
          </div>
        </Card>
      </div>

      <DataReveal stagger className="mt-5 grid gap-5 md:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-bright" />
              <CardTitle>Behavioural Topics</CardTitle>
            </div>
            <ul className="space-y-2">
              {plan.behaviouralTopics.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-bright" /> {b}
                </li>
              ))}
            </ul>
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <MessagesSquare className="h-4 w-4 text-violet-bright" />
              <CardTitle>Suggested Questions</CardTitle>
            </div>
            <ol className="space-y-2.5">
              {plan.likelyQuestions.map((q, i) => (
                <motion.li
                  key={q}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-2.5 text-sm text-muted-foreground"
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet/15 text-[10px] font-semibold text-violet-bright",
                    )}
                  >
                    {i + 1}
                  </span>
                  {q}
                </motion.li>
              ))}
            </ol>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <Alert className="mt-5">
        <MessagesSquare />
        <AlertDescription>
          Prototype preparation plan — question sets are curated demo content, not generated by a
          live model.
        </AlertDescription>
      </Alert>
    </div>
  );
}

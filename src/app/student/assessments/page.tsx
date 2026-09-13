"use client";

import { CalendarClock, MapPin, Users, Video, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { getInterviewsByStudent } from "@/data/mock/interviews";
import { primaryStudent } from "@/data/mock/students";
import type { InterviewSlot } from "@/types";

const resultTone = {
  CLEARED: "success",
  "NOT CLEARED": "risk",
  AWAITED: "muted",
} as const;

function SlotCard({ slot }: { slot: InterviewSlot }) {
  const upcoming = slot.status === "SCHEDULED";
  return (
    <DepthCard className={upcoming ? "border-violet/30 p-5" : "p-5"}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {slot.companyName}{" "}
            <span className="font-normal text-muted-foreground">· {slot.round}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {slot.date} at {slot.time}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          <Badge variant={upcoming ? "default" : "muted"}>{slot.status}</Badge>
          <Badge variant={resultTone[slot.result]} className="gap-1">
            {slot.result === "CLEARED" && <CheckCircle2 className="h-3 w-3" />}
            {slot.result === "NOT CLEARED" && <XCircle className="h-3 w-3" />}
            {slot.result === "AWAITED" && <Clock className="h-3 w-3" />}
            {slot.result}
          </Badge>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          {slot.mode === "Virtual" ? (
            <Video className="h-3.5 w-3.5" />
          ) : (
            <MapPin className="h-3.5 w-3.5" />
          )}
          {slot.mode} · {slot.venue}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> {slot.panel}
        </span>
      </div>
    </DepthCard>
  );
}

export default function AssessmentsPage() {
  const s = primaryStudent;
  const slots = getInterviewsByStudent(s.id);
  const upcoming = slots.filter((i) => i.status === "SCHEDULED");
  const completed = slots.filter((i) => i.status === "COMPLETED");
  const cleared = completed.filter((i) => i.result === "CLEARED").length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Opportunities"
        title="Assessments & Interviews"
        subtitle="Every scheduled round across your active drives, with your assessment baseline."
        actions={
          <Button asChild variant="glow">
            <Link href="/student/interview-prep">
              <CalendarClock className="h-4 w-4" /> Prepare
            </Link>
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Upcoming" value={upcoming.length} icon={CalendarClock} accent="violet" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} />
        <StatCard label="Rounds Cleared" value={cleared} accent="success" />
        <StatCard
          label="Mock Interview"
          value={s.assessments.mockInterview}
          suffix="/100"
          accent="warning"
        />
      </div>

      <Card className="mb-5 p-5">
        <CardTitle className="mb-3">Assessment Baseline</CardTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <SkillBar label="Aptitude" value={s.assessments.aptitude} />
          <SkillBar label="Coding" value={s.assessments.coding} />
          <SkillBar label="Technical" value={s.assessments.technical} />
          <SkillBar label="Communication" value={s.assessments.communication} />
          <SkillBar label="Mock Interview" value={s.assessments.mockInterview} />
        </div>
      </Card>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Upcoming
      </h2>
      {upcoming.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No upcoming assessments or interviews scheduled.
        </Card>
      ) : (
        <DataReveal stagger className="space-y-3">
          {upcoming.map((slot) => (
            <DataRevealItem key={slot.id}>
              <SlotCard slot={slot} />
            </DataRevealItem>
          ))}
        </DataReveal>
      )}

      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Completed
      </h2>
      {completed.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No completed rounds yet.
        </Card>
      ) : (
        <div className="space-y-3">
          {completed.map((slot) => (
            <SlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  ShieldAlert,
  HeartHandshake,
  TrendingUp,
  ArrowUpRight,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { activeMentor } from "@/data/mock/mentors";
import { getStudentById } from "@/data/mock/students";
import { getRiskByStudent } from "@/data/mock/risk";
import { useAppStore } from "@/hooks/useAppStore";
import { readinessBand, riskOrder, riskTone } from "@/lib/status";

export function MentorDashboard() {
  const interventions = useAppStore((s) => s.interventions);
  const mentor = activeMentor;

  const mentees = mentor.assignedStudentIds
    .map((id) => getStudentById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const atRisk = mentees
    .filter((s) => s.riskLevel !== "LOW")
    .sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);

  const myPlans = interventions.filter((p) => mentor.assignedStudentIds.includes(p.studentId));
  const activePlans = myPlans.filter((p) => p.status === "ACTIVE");
  const proposedPlans = myPlans.filter((p) => p.status === "PROPOSED");

  const avgReadiness = mentees.length
    ? Math.round(mentees.reduce((n, s) => n + s.readiness, 0) / mentees.length)
    : 0;

  const readinessByMentee = [...mentees]
    .sort((a, b) => a.readiness - b.readiness)
    .map((s) => ({ label: s.name, value: s.readiness }));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="mx-auto max-w-6xl"
    >
      <motion.div variants={staggerItem}>
        <PageHeader
          eyebrow="Mentor Workspace"
          title={mentor.name}
          subtitle={`${mentor.designation} · ${mentor.department}`}
          actions={<DemoDataBadge />}
        />
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Assigned Students" value={mentees.length} icon={Users} accent="violet" />
        <StatCard
          label="At Risk"
          value={atRisk.filter((s) => s.riskLevel === "HIGH").length}
          icon={ShieldAlert}
          accent="risk"
        />
        <StatCard label="Active Plans" value={activePlans.length} icon={HeartHandshake} accent="success" />
        <StatCard label="Awaiting Activation" value={proposedPlans.length} accent="warning" />
        <StatCard label="Avg. Readiness" value={avgReadiness} suffix="/100" icon={Gauge} />
      </motion.div>

      {proposedPlans.length > 0 && (
        <motion.div variants={staggerItem} className="mt-5">
          <DepthCard className="border-warning/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  {proposedPlans.length} intervention plan
                  {proposedPlans.length === 1 ? "" : "s"} proposed by the placement office
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {proposedPlans
                    .map((p) => getStudentById(p.studentId)?.name)
                    .filter(Boolean)
                    .join(", ")}{" "}
                  — review and activate to start tracking progress.
                </p>
              </div>
              <Button asChild variant="glow" size="sm">
                <Link href="/mentor/interventions">
                  Review plans <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </DepthCard>
        </motion.div>
      )}

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-risk" />
                <CardTitle>Students Needing Attention</CardTitle>
              </div>
              <Link href="/mentor/at-risk" className="text-xs text-violet-bright hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-2.5">
              {atRisk.slice(0, 5).map((s) => {
                const risk = getRiskByStudent(s.id);
                const plan = myPlans.find((p) => p.studentId === s.id);
                return (
                  <Link
                    key={s.id}
                    href={`/mentor/students/${s.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-violet/40"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px]">{s.avatarInitials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {risk?.primaryReason ?? s.riskReason}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={riskTone[s.riskLevel]}>{s.riskLevel}</Badge>
                      {plan && (
                        <span className="text-[10px] text-muted-foreground">
                          Plan {plan.progress}%
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
              {atRisk.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  None of your students are currently flagged.
                </p>
              )}
            </div>
          </DepthCard>
        </DataRevealItem>

        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-bright" />
              <CardTitle>Mentee Readiness</CardTitle>
            </div>
            <HorizontalBarChart
              data={readinessByMentee}
              xKey="value"
              yKey="label"
              height={280}
              colorByValue={(v) => (v >= 80 ? "142 71% 45%" : v >= 65 ? "262 83% 58%" : "0 84% 60%")}
            />
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DepthCard className="mt-5 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-violet-bright" />
            <CardTitle>Intervention Progress</CardTitle>
          </div>
          <Link href="/mentor/progress" className="text-xs text-violet-bright hover:underline">
            Progress tracking →
          </Link>
        </div>
        {myPlans.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No intervention plans yet — open a student and create one.
          </p>
        ) : (
          <div className="space-y-3">
            {myPlans.map((p) => {
              const student = getStudentById(p.studentId);
              return (
                <div key={p.id} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{student?.name}</p>
                    <div className="flex items-center gap-2">
                      {student && (
                        <Badge variant={readinessBand(student.readiness).tone}>
                          {readinessBand(student.readiness).label}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          p.status === "ACTIVE"
                            ? "default"
                            : p.status === "COMPLETED"
                              ? "success"
                              : "muted"
                        }
                      >
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Focus: {p.focusAreas.join(", ")}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <Progress value={p.progress} className="flex-1" />
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {p.progress}%
                    </span>
                    {p.progress === 100 && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DepthCard>
    </motion.div>
  );
}

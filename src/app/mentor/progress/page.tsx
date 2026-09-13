"use client";

import Link from "next/link";
import { TrendingUp, HeartHandshake, Target, ArrowUpRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { activeMentor } from "@/data/mock/mentors";
import { getStudentById } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import { readinessBand, riskTone } from "@/lib/status";

export default function MentorProgressPage() {
  const interventions = useAppStore((s) => s.interventions);
  const mine = interventions.filter((p) => activeMentor.assignedStudentIds.includes(p.studentId));

  const mentees = activeMentor.assignedStudentIds
    .map((id) => getStudentById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const avgProgress = mine.length
    ? Math.round(mine.reduce((n, p) => n + p.progress, 0) / mine.length)
    : 0;
  const actionsDone = mine.reduce((n, p) => n + p.actions.filter((a) => a.done).length, 0);
  const actionsTotal = mine.reduce((n, p) => n + p.actions.length, 0);

  const progressByStudent = mine.map((p) => ({
    label: getStudentById(p.studentId)?.name ?? p.studentId,
    value: p.progress,
  }));

  /** Cohort readiness trend — the average of every mentee's weekly trend. */
  const weeks = mentees[0]?.readinessTrend.length ?? 0;
  const cohortTrend = Array.from({ length: weeks }, (_, i) => ({
    label: `W${i + 1}`,
    value: Math.round(
      mentees.reduce((sum, s) => sum + (s.readinessTrend[i] ?? 0), 0) / (mentees.length || 1),
    ),
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Intervention"
        title="Progress Tracking"
        subtitle="How your mentees are moving, and how far each intervention plan has come."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Plans Tracked" value={mine.length} icon={HeartHandshake} accent="violet" />
        <StatCard label="Average Progress" value={avgProgress} suffix="%" icon={TrendingUp} accent="success" />
        <StatCard label="Actions Completed" value={actionsDone} icon={Target} />
        <StatCard label="Actions Remaining" value={actionsTotal - actionsDone} accent="warning" />
      </div>

      <DataReveal stagger className="mb-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <CardTitle className="mb-3">Plan Progress</CardTitle>
            {progressByStudent.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No plans to chart yet.
              </p>
            ) : (
              <HorizontalBarChart data={progressByStudent} xKey="value" yKey="label" height={240} />
            )}
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <CardTitle className="mb-3">Mentee Cohort Readiness</CardTitle>
            <TrendAreaChart data={cohortTrend} dataKey="value" xKey="label" height={240} />
            <p className="mt-2 text-xs text-muted-foreground">
              Average readiness across your {mentees.length} assigned students.
            </p>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Band</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Plan Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentees.map((s) => {
              const plan = mine.find((p) => p.studentId === s.id);
              const band = readinessBand(s.readiness);
              return (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">{s.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{s.readiness}</TableCell>
                  <TableCell>
                    <Badge variant={band.tone}>{band.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={riskTone[s.riskLevel]}>{s.riskLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    {plan ? (
                      <Badge variant={plan.status === "COMPLETED" ? "success" : "muted"}>
                        {plan.status}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">No plan</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {plan ? (
                      <div className="flex w-28 items-center gap-2">
                        <Progress value={plan.progress} className="flex-1" />
                        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                          {plan.progress}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/mentor/students/${s.id}`}>
                        Open <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

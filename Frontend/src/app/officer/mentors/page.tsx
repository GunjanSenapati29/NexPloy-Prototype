"use client";

import { useState } from "react";
import { HeartHandshake, Users, ShieldAlert, UserPlus, CheckCircle2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { mentors } from "@/data/mock/mentors";
import { students, getStudentById } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import { riskTone } from "@/lib/status";

export default function OfficerMentorsPage() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const interventions = useAppStore((s) => s.interventions);
  const pushToast = useAppStore((s) => s.pushToast);
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const campusMentors = mentors.filter((m) => m.campusId === campusId);
  const campusStudents = students.filter((s) => s.campusId === campusId);

  /** Students with no mentor in the base data and none assigned this session. */
  const unassigned = campusStudents.filter((s) => !s.mentorId && !assignments[s.id]);
  const atRiskStudents = campusStudents.filter((s) => s.riskLevel === "HIGH");

  const assign = (studentId: string, mentorId: string) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    const student = getStudentById(studentId);
    setAssignments((prev) => ({ ...prev, [studentId]: mentorId }));
    pushToast(
      "Mentor assigned",
      `${mentor?.name} is now mentoring ${student?.name} (simulated).`,
    );
  };

  const mentorLoad = (mentorId: string) => {
    const base = mentors.find((m) => m.id === mentorId)?.assignedStudentIds ?? [];
    const extra = Object.entries(assignments)
      .filter(([, mid]) => mid === mentorId)
      .map(([sid]) => sid);
    return Array.from(new Set([...base, ...extra])).filter((sid) =>
      campusStudents.some((s) => s.id === sid),
    );
  };

  const activePlans = interventions.filter((p) => p.status === "ACTIVE");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Support"
        title="Mentor Assignment"
        subtitle="Mentor coverage across the cohort and the intervention plans currently running."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Mentors" value={campusMentors.length} icon={HeartHandshake} accent="violet" />
        <StatCard label="Students Covered" value={campusStudents.length - unassigned.length} icon={Users} accent="success" />
        <StatCard label="Unassigned" value={unassigned.length} icon={UserPlus} accent="warning" />
        <StatCard label="Active Plans" value={activePlans.length} icon={CheckCircle2} accent="violet" />
      </div>

      <DataReveal stagger className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campusMentors.map((m) => {
          const load = mentorLoad(m.id);
          const atRisk = load.filter((sid) => getStudentById(sid)?.riskLevel === "HIGH").length;
          const capacity = Math.min(100, Math.round((load.length / 12) * 100));
          return (
            <DataRevealItem key={m.id}>
              <DepthCard className="h-full p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{m.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="truncate">{m.name}</CardTitle>
                    <p className="truncate text-xs text-muted-foreground">{m.designation}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{m.department}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="muted">{load.length} assigned</Badge>
                  <Badge variant={atRisk > 0 ? "risk" : "success"}>{atRisk} at risk</Badge>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Mentor load</span>
                    <span>{load.length} / 12</span>
                  </div>
                  <Progress value={capacity} />
                </div>
              </DepthCard>
            </DataRevealItem>
          );
        })}
        {campusMentors.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
            No mentors assigned to this campus in the prototype dataset.
          </Card>
        )}
      </DataReveal>

      <Card className="mb-5 overflow-x-auto p-0">
        <div className="flex items-center gap-2 p-5 pb-3">
          <ShieldAlert className="h-4 w-4 text-risk" />
          <CardTitle>High-Risk Students &amp; Mentor Coverage</CardTitle>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead className="text-right">Assign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {atRiskStudents.map((s) => {
              const mentorId = assignments[s.id] ?? s.mentorId;
              const mentor = mentors.find((m) => m.id === mentorId);
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
                    <Badge variant={riskTone[s.riskLevel]}>{s.riskLevel}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.riskReason}</TableCell>
                  <TableCell>
                    {mentor ? (
                      <span className="text-sm">{mentor.name}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={mentorId ?? ""}
                      onValueChange={(value) => assign(s.id, value)}
                    >
                      <SelectTrigger className="ml-auto w-44" aria-label={`Assign mentor to ${s.name}`}>
                        <SelectValue placeholder="Assign mentor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mentors.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
            {atRiskStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No high-risk students on this campus.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <DepthCard className="p-5">
        <CardTitle className="mb-3">Running Intervention Plans</CardTitle>
        <div className="space-y-3">
          {interventions.map((p) => {
            const student = getStudentById(p.studentId);
            const mentor = mentors.find((m) => m.id === p.mentorId);
            return (
              <div key={p.id} className="rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {student?.name}{" "}
                    <span className="font-normal text-muted-foreground">· {mentor?.name}</span>
                  </p>
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
                <p className="mt-1 text-xs text-muted-foreground">
                  Focus: {p.focusAreas.join(", ")}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Progress value={p.progress} className="flex-1" />
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {p.progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <a href="/mentor">Open Mentor workspace</a>
        </Button>
      </DepthCard>
    </div>
  );
}

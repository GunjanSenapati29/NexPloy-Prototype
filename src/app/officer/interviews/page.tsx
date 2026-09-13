"use client";

import { useState } from "react";
import { CalendarClock, DoorOpen, UserCheck, Video, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { interviewSlots } from "@/data/mock/interviews";
import { getStudentById } from "@/data/mock/students";
import { panels, scheduleConflicts, scheduleEvents, venues } from "@/data/mock/schedules";
import { useAppStore } from "@/hooks/useAppStore";
import Link from "next/link";

const resultTone = { CLEARED: "success", "NOT CLEARED": "risk", AWAITED: "muted" } as const;

export default function OfficerInterviewsPage() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const [company, setCompany] = useState("all");

  const rows = interviewSlots
    .map((i) => ({ ...i, student: getStudentById(i.studentId) }))
    .filter((i) => i.student?.campusId === campusId)
    .filter((i) => (company === "all" ? true : i.companyName === company));

  const companies = Array.from(
    new Set(
      interviewSlots
        .filter((i) => getStudentById(i.studentId)?.campusId === campusId)
        .map((i) => i.companyName),
    ),
  );

  const scheduled = rows.filter((i) => i.status === "SCHEDULED").length;
  const completed = rows.filter((i) => i.status === "COMPLETED").length;
  const cleared = rows.filter((i) => i.result === "CLEARED").length;
  const conflictCount = scheduleConflicts.length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Operations"
        title="Interview Scheduling"
        subtitle="Every scheduled round, plus the venue and panel resources backing them."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Scheduled" value={scheduled} icon={CalendarClock} accent="violet" />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Rounds Cleared" value={cleared} accent="success" />
        <StatCard label="Open Conflicts" value={conflictCount} icon={AlertTriangle} accent="risk" />
      </div>

      {conflictCount > 0 && (
        <DepthCard className="mb-5 border-risk/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-risk" />
              <p className="text-sm">
                {conflictCount} scheduling conflict{conflictCount === 1 ? "" : "s"} detected this
                drive week.
              </p>
            </div>
            <Link href="/officer/orchestrator" className="text-xs text-violet-bright hover:underline">
              Resolve in Drive Orchestrator →
            </Link>
          </div>
        </DepthCard>
      )}

      <DataReveal stagger className="mb-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-violet-bright" />
              <CardTitle>Venue Utilisation</CardTitle>
            </div>
            <div className="space-y-3">
              {venues.map((v) => {
                const booked = scheduleEvents.filter((e) => e.venue === v.name).length;
                const utilisation = Math.min(100, Math.round((booked / 3) * 100));
                return (
                  <div key={v.name}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{v.name}</span>
                      <span className="text-muted-foreground">
                        {booked} slot{booked === 1 ? "" : "s"} · capacity {v.capacity}
                      </span>
                    </div>
                    <Progress value={utilisation} />
                  </div>
                );
              })}
            </div>
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-violet-bright" />
              <CardTitle>Panel Allocation</CardTitle>
            </div>
            <div className="space-y-2.5">
              {panels.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.members}</p>
                  </div>
                  <Badge variant={p.assignedDrives > 1 ? "warning" : "muted"} className="shrink-0">
                    {p.assignedDrives} drive{p.assignedDrives === 1 ? "" : "s"}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              A panel assigned to more than one drive in the same slot is what surfaces as a panel
              conflict in the Drive Orchestrator.
            </p>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={company} onValueChange={setCompany}>
          <SelectTrigger className="w-56" aria-label="Filter by company">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Mode / Venue</TableHead>
              <TableHead>Panel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px]">
                        {i.student?.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{i.student?.name}</span>
                  </div>
                </TableCell>
                <TableCell>{i.companyName}</TableCell>
                <TableCell className="text-muted-foreground">{i.round}</TableCell>
                <TableCell className="text-muted-foreground">{i.date}</TableCell>
                <TableCell className="tabular-nums">{i.time}</TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    {i.mode === "Virtual" ? (
                      <Video className="h-3.5 w-3.5" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5" />
                    )}
                    {i.venue}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{i.panel}</TableCell>
                <TableCell>
                  <Badge variant={i.status === "SCHEDULED" ? "default" : "muted"}>{i.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={resultTone[i.result]}>{i.result}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                  No interviews scheduled for this campus.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

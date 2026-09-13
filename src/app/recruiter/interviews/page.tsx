"use client";

import { useState } from "react";
import { CalendarClock, MapPin, Video, Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { getInterviewsByDrive } from "@/data/mock/interviews";
import { getStudentById } from "@/data/mock/students";
import { ACTIVE_RECRUITER_ID, activeRecruiter } from "@/data/mock/recruiters";
import { getDrivesByCompany } from "@/data/mock/drives";
import { useAppStore } from "@/hooks/useAppStore";

const resultTone = { CLEARED: "success", "NOT CLEARED": "risk", AWAITED: "muted" } as const;

export default function RecruiterInterviewsPage() {
  const companyDrives = getDrivesByCompany(ACTIVE_RECRUITER_ID);
  const [driveId, setDriveId] = useState(companyDrives[0]?.id ?? "drv_technova");
  const shortlisted = useAppStore((s) => s.shortlisted);
  const pushToast = useAppStore((s) => s.pushToast);

  const slots = getInterviewsByDrive(driveId).map((i) => ({
    ...i,
    student: getStudentById(i.studentId),
  }));

  const scheduled = slots.filter((i) => i.status === "SCHEDULED");
  const completed = slots.filter((i) => i.status === "COMPLETED");
  const cleared = slots.filter((i) => i.result === "CLEARED").length;

  /** Shortlisted candidates from this session who have no slot yet — the
   * natural next step after bulk shortlisting. */
  const awaitingSlot = shortlisted
    .map((id) => getStudentById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .filter((s) => !slots.some((i) => i.studentId === s.id));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={activeRecruiter.companyName}
        title="Interview Scheduling"
        subtitle="Rounds booked with the placement office, plus shortlisted candidates still awaiting a slot."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Select value={driveId} onValueChange={setDriveId}>
          <SelectTrigger className="w-72" aria-label="Select drive">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {companyDrives.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.companyName} — {d.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Scheduled" value={scheduled.length} icon={CalendarClock} accent="violet" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} />
        <StatCard label="Rounds Cleared" value={cleared} accent="success" />
        <StatCard label="Awaiting Slot" value={awaitingSlot.length} icon={Clock} accent="warning" />
      </div>

      {awaitingSlot.length > 0 && (
        <DepthCard className="mb-5 border-violet/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {awaitingSlot.length} shortlisted candidate
                {awaitingSlot.length === 1 ? "" : "s"} awaiting a slot
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {awaitingSlot.map((s) => (
                  <Badge key={s.id} variant="muted">
                    {s.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="glow"
              size="sm"
              onClick={() =>
                pushToast(
                  "Slot request sent",
                  `${awaitingSlot.length} slot request${awaitingSlot.length === 1 ? "" : "s"} sent to the placement office (simulated).`,
                )
              }
            >
              <CalendarClock className="h-3.5 w-3.5" /> Request Slots
            </Button>
          </div>
        </DepthCard>
      )}

      <DataReveal stagger className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scheduled.map((i) => (
          <DataRevealItem key={i.id}>
            <DepthCard className="h-full p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-[10px]">
                      {i.student?.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{i.student?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{i.round}</p>
                  </div>
                </div>
                <Badge variant="default" className="shrink-0">
                  {i.date}
                </Badge>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {i.time}
                </p>
                <p className="flex items-center gap-1.5">
                  {i.mode === "Virtual" ? (
                    <Video className="h-3.5 w-3.5" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                  {i.venue}
                </p>
                <p className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {i.panel}
                </p>
              </div>
            </DepthCard>
          </DataRevealItem>
        ))}
        {scheduled.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
            No upcoming rounds scheduled for this drive.
          </Card>
        )}
      </DataReveal>

      <Card className="overflow-x-auto p-5">
        <CardTitle className="mb-3">All Rounds</CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Mode / Venue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((i) => (
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
                <TableCell className="text-muted-foreground">{i.round}</TableCell>
                <TableCell className="text-muted-foreground">{i.date}</TableCell>
                <TableCell className="tabular-nums">{i.time}</TableCell>
                <TableCell className="text-muted-foreground">
                  {i.mode} · {i.venue}
                </TableCell>
                <TableCell>
                  <Badge variant={i.status === "SCHEDULED" ? "default" : "muted"}>{i.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={resultTone[i.result]} className="gap-1">
                    {i.result === "CLEARED" && <CheckCircle2 className="h-3 w-3" />}
                    {i.result === "NOT CLEARED" && <XCircle className="h-3 w-3" />}
                    {i.result}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {slots.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No rounds recorded for this drive.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

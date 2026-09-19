"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ShieldCheck,
  ShieldX,
  CheckCircle2,
  ArrowUpRight,
  ListChecks,
  Search,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { StagedRunner } from "@/components/intelligence/StagedRunner";
import {
  IntelligencePulse,
  IntelligencePulseBadge,
} from "@/components/intelligence/IntelligencePulse";
import { getMatchesByDrive } from "@/data/mock/matches";
import { getStudentById } from "@/data/mock/students";
import { getDrivesByCompany, getDriveById } from "@/data/mock/drives";
import { getApplication } from "@/data/mock/applications";
import { ACTIVE_RECRUITER_ID, activeRecruiter } from "@/data/mock/recruiters";
import { evaluateEligibility } from "@/lib/eligibility";
import { shortlistingSteps } from "@/lib/simulate";
import { applicationStatusLabel, applicationStatusTone } from "@/lib/status";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

type RunState = "idle" | "running";
type Filter = "all" | "eligible" | "shortlisted";

export function CandidatePool() {
  const companyDrives = getDrivesByCompany(ACTIVE_RECRUITER_ID).filter(
    (d) => getMatchesByDrive(d.id).length > 0,
  );
  const [driveId, setDriveId] = useState(companyDrives[0]?.id ?? "drv_technova");
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [runState, setRunState] = useState<RunState>("idle");

  const shortlisted = useAppStore((s) => s.shortlisted);
  const shortlistCandidates = useAppStore((s) => s.shortlistCandidates);
  const pushToast = useAppStore((s) => s.pushToast);

  const drive = getDriveById(driveId) ?? getDriveById("drv_technova")!;

  const rows = useMemo(
    () =>
      getMatchesByDrive(drive.id)
        .map((m) => {
          const student = getStudentById(m.studentId);
          return {
            match: m,
            student,
            eligible: student ? evaluateEligibility(student, drive).eligible : false,
            application: student ? getApplication(student.id, drive.id) : undefined,
          };
        })
        .filter((r) => Boolean(r.student)),
    [drive],
  );

  const visible = rows
    .filter((r) =>
      filter === "all"
        ? true
        : filter === "eligible"
          ? r.eligible
          : shortlisted.includes(r.student!.id),
    )
    .filter((r) => (query ? r.student!.name.toLowerCase().includes(query.toLowerCase()) : true));

  const toggle = (studentId: string) => {
    setSelected((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    );
  };

  const selectableIds = visible.filter((r) => r.eligible).map((r) => r.student!.id);
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.includes(id));

  const toggleAll = () => {
    setSelected(allSelected ? [] : selectableIds);
  };

  const runShortlist = () => {
    if (selected.length === 0) return;
    setRunState("running");
  };

  const completeShortlist = () => {
    shortlistCandidates(selected);
    const names = selected
      .map((id) => getStudentById(id)?.name)
      .filter(Boolean)
      .join(", ");
    pushToast("Candidates shortlisted", `${selected.length} candidates advanced: ${names}.`);
    setSelected([]);
    setRunState("idle");
  };

  const eligibleCount = rows.filter((r) => r.eligible).length;
  const shortlistedCount = rows.filter((r) => shortlisted.includes(r.student!.id)).length;
  const avgFit = rows.length
    ? Math.round(rows.reduce((n, r) => n + r.match.overallFit, 0) / rows.length)
    : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={activeRecruiter.companyName}
        title="Candidate Pool"
        subtitle="Ranked candidates with their eligibility verdict, fit score and pipeline status."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Select value={drive.id} onValueChange={setDriveId}>
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
        <StatCard label="Candidates" value={rows.length} icon={Users} accent="violet" />
        <StatCard label="Eligible" value={eligibleCount} icon={ShieldCheck} accent="success" />
        <StatCard label="Shortlisted" value={shortlistedCount} icon={CheckCircle2} accent="success" />
        <StatCard label="Average Fit" value={avgFit} suffix="%" />
      </div>

      <IntelligencePulse active={runState === "running"} className="mb-5">
        <Card className="p-4">
          {runState === "running" ? (
            <div className="flex flex-col items-center gap-5 py-4">
              <IntelligencePulseBadge label="Shortlisting candidates" />
              <div className="w-full max-w-xs">
                <StagedRunner steps={shortlistingSteps} onDone={completeShortlist} />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search candidate..."
                    className="pl-8"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search candidates"
                  />
                </div>
                <div className="flex gap-1.5">
                  {(["all", "eligible", "shortlisted"] as Filter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                        filter === f
                          ? "border-violet/50 bg-violet/10 text-violet-bright"
                          : "border-border text-muted-foreground hover:bg-accent",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {selected.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="text-xs text-muted-foreground"
                    >
                      {selected.length} selected
                    </motion.span>
                  )}
                </AnimatePresence>
                <Button variant="glow" disabled={selected.length === 0} onClick={runShortlist}>
                  <ListChecks className="h-4 w-4" /> Shortlist Selected
                </Button>
              </div>
            </div>
          )}
        </Card>
      </IntelligencePulse>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all eligible candidates"
                  className="h-4 w-4 cursor-pointer accent-violet-600"
                />
              </TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Eligibility</TableHead>
              <TableHead>Fit Score</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Interview</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => {
              const student = r.student!;
              const isShortlisted = shortlisted.includes(student.id);
              return (
                <TableRow
                  key={r.match.id}
                  className={cn(isShortlisted && "bg-success/5", !r.eligible && "opacity-70")}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.includes(student.id)}
                      onChange={() => toggle(student.id)}
                      disabled={!r.eligible}
                      aria-label={`Select ${student.name}`}
                      className="h-4 w-4 cursor-pointer accent-violet-600 disabled:cursor-not-allowed"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {student.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="block font-medium">{student.name}</span>
                        <span className="block text-[10px] text-muted-foreground">
                          {student.branchCode} · CGPA {student.cgpa.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.eligible ? "success" : "risk"} className="gap-1">
                      {r.eligible ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <ShieldX className="h-3 w-3" />
                      )}
                      {r.eligible ? "PASS" : "FAIL"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums text-violet-bright">
                    {r.match.overallFit}%
                  </TableCell>
                  <TableCell className="tabular-nums">{r.match.breakdown.skills}%</TableCell>
                  <TableCell className="tabular-nums">{r.match.breakdown.projects}%</TableCell>
                  <TableCell className="tabular-nums">{student.readiness}</TableCell>
                  <TableCell className="tabular-nums">{r.match.breakdown.interview}%</TableCell>
                  <TableCell>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={isShortlisted ? "shortlisted" : (r.application?.status ?? "none")}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isShortlisted ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> SHORTLISTED
                          </Badge>
                        ) : r.application ? (
                          <Badge variant={applicationStatusTone[r.application.status]}>
                            {applicationStatusLabel[r.application.status]}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not applied</span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/recruiter/candidates/${student.id}`}>
                        View <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">
                  No candidates match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="mt-5 p-5">
        <CardTitle className="mb-2">Eligibility is checked before ranking</CardTitle>
        <p className="text-sm text-muted-foreground">
          Candidates who fail the drive&apos;s published criteria stay visible for transparency but
          cannot be selected for shortlisting. Fit score is a prototype estimate and never overrides
          a failing eligibility rule.
        </p>
      </Card>
    </div>
  );
}

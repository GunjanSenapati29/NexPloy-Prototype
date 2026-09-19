"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, ShieldX, ListChecks, Users, Percent, Zap } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { EligibilityChecklist } from "@/components/intelligence/EligibilityChecklist";
import { StagedRunner } from "@/components/intelligence/StagedRunner";
import { IntelligencePulse, IntelligencePulseBadge } from "@/components/intelligence/IntelligencePulse";
import { drives } from "@/data/mock/drives";
import { students } from "@/data/mock/students";
import { getMatch } from "@/data/mock/matches";
import { getApplication } from "@/data/mock/applications";
import { evaluateEligibility, primaryFailureReason } from "@/lib/eligibility";
import { eligibilityCheckSteps } from "@/lib/simulate";
import { applicationStatusLabel, applicationStatusTone } from "@/lib/status";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

type Filter = "all" | "eligible" | "not-eligible";
type RunState = "idle" | "running" | "done";

export function EligibilityMatrix() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const campusDrives = drives.filter((d) => d.campusId === campusId && d.status !== "DRAFT");
  const [driveId, setDriveId] = useState(campusDrives[0]?.id ?? drives[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const [branch, setBranch] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");

  const drive = campusDrives.find((d) => d.id === driveId) ?? campusDrives[0] ?? drives[0];
  const campusStudents = useMemo(
    () => students.filter((s) => s.campusId === campusId),
    [campusId],
  );

  const branches = useMemo(
    () => Array.from(new Set(campusStudents.map((s) => s.branchCode))).sort(),
    [campusStudents],
  );

  const rows = useMemo(
    () =>
      campusStudents
        .map((student) => {
          const result = evaluateEligibility(student, drive);
          return {
            student,
            eligible: result.eligible,
            reason: primaryFailureReason(student, drive),
            match: getMatch(student.id, drive.id)?.overallFit,
            application: getApplication(student.id, drive.id),
          };
        })
        .filter((r) => (branch === "all" ? true : r.student.branchCode === branch))
        .filter((r) =>
          filter === "all" ? true : filter === "eligible" ? r.eligible : !r.eligible,
        )
        .filter((r) =>
          query ? r.student.name.toLowerCase().includes(query.toLowerCase()) : true,
        )
        .sort((a, b) => Number(b.eligible) - Number(a.eligible) || (b.match ?? 0) - (a.match ?? 0)),
    [campusStudents, drive, branch, filter, query],
  );

  const allForDrive = campusStudents.map((s) => evaluateEligibility(s, drive).eligible);
  const eligibleCount = allForDrive.filter(Boolean).length;
  const notEligibleCount = allForDrive.length - eligibleCount;
  const eligibilityRate = allForDrive.length
    ? Math.round((eligibleCount / allForDrive.length) * 100)
    : 0;

  const selected = selectedStudentId
    ? campusStudents.find((s) => s.id === selectedStudentId)
    : undefined;

  const runCheck = () => {
    setRunState("running");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Placement"
        title="Eligibility Engine"
        subtitle="Deterministic rule checks against each drive's published criteria — scored separately from the AI match."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <DemoDataBadge />
            <Button variant="glow" onClick={runCheck} disabled={runState === "running"}>
              <Zap className="h-4 w-4" /> Run Eligibility Check
            </Button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Select value={drive.id} onValueChange={setDriveId}>
          <SelectTrigger className="w-72" aria-label="Select drive">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {campusDrives.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.companyName} — {d.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="muted">
          CGPA {drive.criteria.minCgpa}+ · {drive.criteria.allowedBranches.join("/")} · max{" "}
          {drive.criteria.maxBacklogs} backlog{drive.criteria.maxBacklogs === 1 ? "" : "s"} ·{" "}
          {drive.criteria.graduationYear}
        </Badge>
      </div>

      <IntelligencePulse active={runState === "running"} className="mb-5">
        {runState === "running" ? (
          <Card className="flex flex-col items-center gap-5 p-8">
            <IntelligencePulseBadge label="Checking eligibility" />
            <div className="w-full max-w-xs">
              <StagedRunner
                steps={eligibilityCheckSteps}
                onDone={() => setRunState("done")}
              />
            </div>
          </Card>
        ) : (
          <motion.div
            initial={runState === "done" ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <StatCard label="Students Checked" value={allForDrive.length} icon={Users} />
            <StatCard label="Eligible" value={eligibleCount} icon={ShieldCheck} accent="success" />
            <StatCard label="Not Eligible" value={notEligibleCount} icon={ShieldX} accent="risk" />
            <StatCard
              label="Eligibility Rate"
              value={eligibilityRate}
              suffix="%"
              icon={Percent}
              accent="violet"
            />
          </motion.div>
        )}
      </IntelligencePulse>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search student..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search students"
          />
        </div>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-40" aria-label="Filter by branch">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1.5">
          {(["all", "eligible", "not-eligible"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f
                  ? "border-violet/50 bg-violet/10 text-violet-bright"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              {f === "all" ? "All" : f === "eligible" ? "Eligible only" : "Not eligible"}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Backlogs</TableHead>
              <TableHead>Eligibility</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow
                key={r.student.id}
                className={cn("cursor-pointer", !r.eligible && "bg-risk/5")}
                onClick={() => setSelectedStudentId(r.student.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px]">
                        {r.student.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{r.student.name}</span>
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{r.student.cgpa.toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground">{r.student.branchCode}</TableCell>
                <TableCell
                  className={cn("tabular-nums", r.student.backlogs > 0 && "text-risk")}
                >
                  {r.student.backlogs}
                </TableCell>
                <TableCell>
                  <Badge variant={r.eligible ? "success" : "risk"} className="gap-1">
                    {r.eligible ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : (
                      <ShieldX className="h-3 w-3" />
                    )}
                    {r.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold tabular-nums text-violet-bright">
                  {r.match !== undefined ? `${r.match}%` : "—"}
                </TableCell>
                <TableCell>
                  {r.application ? (
                    <Badge variant={applicationStatusTone[r.application.status]}>
                      {applicationStatusLabel[r.application.status]}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not applied</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudentId(r.student.id);
                    }}
                  >
                    <ListChecks className="h-3.5 w-3.5" /> Explain
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No students match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <DepthCard className="mt-5 p-5">
        <CardTitle className="mb-2">Why eligibility and match are separate</CardTitle>
        <p className="text-sm text-muted-foreground">
          Eligibility is a hard rule check: CGPA, branch, backlogs and batch are compared against the
          drive&apos;s published criteria, and every comparison is shown alongside its verdict. The
          match score is a prototype estimate of fit. A candidate can be a 91% match and still be
          blocked by a single failing rule — the matrix above always shows both.
        </p>
      </DepthCard>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedStudentId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  {selected.rollNumber} · {selected.branch} · CGPA {selected.cgpa.toFixed(2)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {drive.companyName} — {drive.role}
                </p>
                <EligibilityChecklist student={selected} drive={drive} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

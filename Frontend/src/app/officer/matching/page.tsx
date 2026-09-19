"use client";

import { useMemo, useState } from "react";
import { Target, ShieldCheck, ShieldX, CheckCircle2, XCircle, ThumbsUp } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { MatchBreakdownBars } from "@/components/intelligence/MatchBreakdown";
import { EligibilityChecklist } from "@/components/intelligence/EligibilityChecklist";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { matches, getMatchesByDrive } from "@/data/mock/matches";
import { getStudentById, students } from "@/data/mock/students";
import { drives, getDriveById } from "@/data/mock/drives";
import { getApplication } from "@/data/mock/applications";
import { evaluateEligibility } from "@/lib/eligibility";
import { applicationStatusLabel, applicationStatusTone } from "@/lib/status";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

export default function OfficerMatchingPage() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const shortlisted = useAppStore((s) => s.shortlisted);
  const pushToast = useAppStore((s) => s.pushToast);

  const campusDrives = drives.filter(
    (d) => d.campusId === campusId && matches.some((m) => m.driveId === d.id),
  );
  const [driveId, setDriveId] = useState(campusDrives[0]?.id ?? drives[0].id);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [approved, setApproved] = useState<string[]>([]);

  const drive = getDriveById(driveId) ?? drives[0];
  const rows = useMemo(
    () =>
      getMatchesByDrive(drive.id).map((m) => {
        const student = getStudentById(m.studentId);
        return {
          match: m,
          student,
          eligible: student ? evaluateEligibility(student, drive).eligible : false,
          application: student ? getApplication(student.id, drive.id) : undefined,
        };
      }),
    [drive],
  );

  const selected = rows.find((r) => r.match.id === selectedMatchId);

  const eligibleCount = rows.filter((r) => r.eligible).length;
  const avgFit = rows.length
    ? Math.round(rows.reduce((n, r) => n + r.match.overallFit, 0) / rows.length)
    : 0;
  const recommendedCount = rows.filter(
    (r) => r.eligible && r.match.overallFit >= 83,
  ).length;

  const approveShortlist = () => {
    const ids = rows.filter((r) => r.eligible && r.match.overallFit >= 83).map((r) => r.match.id);
    setApproved(ids);
    pushToast(
      "Shortlist approved",
      `${ids.length} candidates approved for ${drive.companyName} — ${drive.role} (simulated).`,
    );
  };

  /** Candidates the recruiter shortlisted this session, surfaced here so
   * the officer sees the recruiter's action without a backend. */
  const recruiterShortlisted = students.filter((s) => shortlisted.includes(s.id));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Placement"
        title="AI Match Review"
        subtitle="Review every candidate-drive pair — eligibility verdict alongside the explainable match score."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <DemoDataBadge />
            <Button variant="glow" onClick={approveShortlist}>
              <ThumbsUp className="h-4 w-4" /> Approve Recommended Shortlist
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
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Candidates Matched" value={rows.length} icon={Target} accent="violet" />
        <StatCard label="Eligible" value={eligibleCount} icon={ShieldCheck} accent="success" />
        <StatCard label="Average Fit" value={avgFit} suffix="%" />
        <StatCard label="Recommended" value={recommendedCount} icon={ThumbsUp} accent="success" />
      </div>

      {recruiterShortlisted.length > 0 && (
        <DepthCard className="mb-5 border-violet/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-bright">
            Shortlisted by the recruiter this session
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {recruiterShortlisted.map((s) => (
              <Badge key={s.id} variant="default">
                {s.name}
              </Badge>
            ))}
          </div>
        </DepthCard>
      )}

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Eligibility</TableHead>
              <TableHead>Fit Score</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => {
              if (!r.student) return null;
              const isApproved = approved.includes(r.match.id);
              return (
                <TableRow
                  key={r.match.id}
                  className={cn("cursor-pointer", isApproved && "bg-success/5")}
                  onClick={() => setSelectedMatchId(r.match.id)}
                >
                  <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>
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
                  <TableCell className="tabular-nums">{r.student.readiness}</TableCell>
                  <TableCell>
                    {r.application ? (
                      <Badge variant={applicationStatusTone[r.application.status]}>
                        {applicationStatusLabel[r.application.status]}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not applied</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {isApproved ? (
                      <span className="flex items-center gap-1 text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Shortlist approved
                      </span>
                    ) : (
                      r.match.recommendation
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMatchId(r.match.id);
                      }}
                    >
                      <Target className="h-3.5 w-3.5" /> Breakdown
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedMatchId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {selected?.student && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selected.student.name} → {drive.companyName}
                </DialogTitle>
                <DialogDescription>
                  {drive.role} · Overall Fit{" "}
                  <span className="font-semibold text-violet-bright">
                    {selected.match.overallFit}%
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Eligibility (rule check)
                </p>
                <EligibilityChecklist student={selected.student} drive={drive} compact />
              </div>

              <div>
                <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Match breakdown (prototype estimate)
                </p>
                <MatchBreakdownBars breakdown={selected.match.breakdown} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
                  </p>
                  <ul className="space-y-1">
                    {selected.match.whySelected.map((w) => (
                      <li key={w} className="text-xs text-muted-foreground">
                        • {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-risk">
                    <XCircle className="h-3.5 w-3.5" /> Gaps
                  </p>
                  <ul className="space-y-1">
                    {selected.match.weakOrMissing.map((w) => (
                      <li key={w} className="text-xs text-muted-foreground">
                        • {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-violet/30 bg-violet/5 p-3">
                <p className="text-xs font-semibold text-violet-bright">Recommendation</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selected.match.recommendation}
                </p>
              </div>
              <CardTitle className="sr-only">Prototype note</CardTitle>
              <Badge variant="muted" className="w-fit">
                Mocked prototype intelligence
              </Badge>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

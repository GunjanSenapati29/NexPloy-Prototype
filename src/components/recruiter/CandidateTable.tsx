"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck, ShieldX, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getMatchesByDrive } from "@/data/mock/matches";
import { getStudentById } from "@/data/mock/students";
import { getApplication } from "@/data/mock/applications";
import { getDriveById } from "@/data/mock/drives";
import { evaluateEligibility } from "@/lib/eligibility";
import { applicationStatusLabel, applicationStatusTone } from "@/lib/status";
import { useAppStore } from "@/hooks/useAppStore";

export function CandidateTable({ driveId }: { driveId: string }) {
  const matches = getMatchesByDrive(driveId);
  const drive = getDriveById(driveId);
  const shortlisted = useAppStore((s) => s.shortlisted);

  if (!drive) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Candidate</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>CGPA</TableHead>
          <TableHead>Eligibility</TableHead>
          <TableHead>Readiness</TableHead>
          <TableHead>Fit</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((m, i) => {
          const student = getStudentById(m.studentId);
          if (!student) return null;
          const app = getApplication(student.id, driveId);
          const eligible = evaluateEligibility(student, drive).eligible;
          const isShortlisted = shortlisted.includes(student.id);
          return (
            <TableRow key={m.id}>
              <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">{student.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{student.branchCode}</TableCell>
              <TableCell className="tabular-nums">{student.cgpa.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={eligible ? "success" : "risk"} className="gap-1">
                  {eligible ? <ShieldCheck className="h-3 w-3" /> : <ShieldX className="h-3 w-3" />}
                  {eligible ? "PASS" : "FAIL"}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{student.readiness}</TableCell>
              <TableCell>
                <span className="font-semibold tabular-nums text-violet-bright">
                  {m.overallFit}%
                </span>
              </TableCell>
              <TableCell>
                {isShortlisted ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> SHORTLISTED
                  </Badge>
                ) : app ? (
                  <Badge variant={applicationStatusTone[app.status]}>
                    {applicationStatusLabel[app.status]}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Not applied</span>
                )}
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
      </TableBody>
    </Table>
  );
}

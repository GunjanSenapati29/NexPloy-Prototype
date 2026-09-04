"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getMatchesByDrive } from "@/data/mock/matches";
import { getStudentById } from "@/data/mock/students";
import { getApplicationsByDrive } from "@/data/mock/applications";

export function CandidateTable({ driveId }: { driveId: string }) {
  const matches = getMatchesByDrive(driveId);
  const applications = getApplicationsByDrive(driveId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Candidate</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>CGPA</TableHead>
          <TableHead>Readiness</TableHead>
          <TableHead>Match</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((m) => {
          const student = getStudentById(m.studentId);
          if (!student) return null;
          const app = applications.find((a) => a.studentId === m.studentId);
          return (
            <TableRow key={m.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">{student.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{student.branch}</TableCell>
              <TableCell className="tabular-nums">{student.cgpa}</TableCell>
              <TableCell className="tabular-nums">{student.readiness}</TableCell>
              <TableCell>
                <span className="font-semibold text-violet-bright tabular-nums">{m.overallFit}%</span>
              </TableCell>
              <TableCell>
                <Badge variant={app?.status === "shortlisted" ? "success" : "muted"}>
                  {(app?.status ?? "eligible").toUpperCase()}
                </Badge>
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

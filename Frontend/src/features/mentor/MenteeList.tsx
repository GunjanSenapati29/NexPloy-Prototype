"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, Users, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { activeMentor } from "@/data/mock/mentors";
import { getStudentById } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import { readinessBand, riskOrder, riskTone } from "@/lib/status";

/** Shared mentee table — `onlyAtRisk` switches between the Assigned
 * Students and At-Risk Students screens so both stay consistent. */
export function MenteeList({ onlyAtRisk = false }: { onlyAtRisk?: boolean }) {
  const interventions = useAppStore((s) => s.interventions);
  const [query, setQuery] = useState("");
  const mentor = activeMentor;

  const all = mentor.assignedStudentIds
    .map((id) => getStudentById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const scoped = onlyAtRisk ? all.filter((s) => s.riskLevel !== "LOW") : all;

  const rows = scoped
    .filter((s) => (query ? s.name.toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel] || a.readiness - b.readiness);

  const highRisk = all.filter((s) => s.riskLevel === "HIGH").length;
  const withPlans = all.filter((s) => interventions.some((p) => p.studentId === s.id)).length;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Mentees"
        title={onlyAtRisk ? "At-Risk Students" : "Assigned Students"}
        subtitle={
          onlyAtRisk
            ? "Students flagged MEDIUM or HIGH risk from your mentee group."
            : `Every student assigned to ${mentor.name}.`
        }
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Assigned" value={all.length} icon={Users} accent="violet" />
        <StatCard label="High Risk" value={highRisk} icon={ShieldAlert} accent="risk" />
        <StatCard label="With Plans" value={withPlans} accent="success" />
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search student..."
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search students"
        />
      </div>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Band</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => {
              const plan = interventions.find((p) => p.studentId === s.id);
              const band = readinessBand(s.readiness);
              return (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">{s.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="block font-medium">{s.name}</span>
                        <span className="block text-[10px] text-muted-foreground">
                          {s.riskReason}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.branchCode}</TableCell>
                  <TableCell className="tabular-nums">{s.readiness}</TableCell>
                  <TableCell>
                    <Badge variant={band.tone}>{band.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={riskTone[s.riskLevel]}>{s.riskLevel}</Badge>
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
                      <span className="text-xs text-muted-foreground">None</span>
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
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  {onlyAtRisk
                    ? "None of your students are currently flagged at risk."
                    : "No students match this search."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

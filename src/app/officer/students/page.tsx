"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { students } from "@/data/mock/students";
import type { RiskLevel } from "@/types";

const levelVariant: Record<RiskLevel, "risk" | "warning" | "success"> = {
  HIGH: "risk",
  MEDIUM: "warning",
  LOW: "success",
};

export default function OfficerStudentsPage() {
  const [query, setQuery] = useState("");

  const filtered = students.filter((s) =>
    query ? `${s.name} ${s.branch}`.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Talent" title="Students" subtitle="Full roster with readiness and risk signals." actions={<DemoDataBadge />} />

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search name or branch..." className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Applications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px]">{s.avatarInitials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{s.branch}</TableCell>
                <TableCell className="tabular-nums">{s.cgpa}</TableCell>
                <TableCell className="tabular-nums">{s.readiness}</TableCell>
                <TableCell className="tabular-nums">{s.placementProbability}%</TableCell>
                <TableCell>
                  <Badge variant={levelVariant[s.riskLevel]}>{s.riskLevel}</Badge>
                </TableCell>
                <TableCell className="tabular-nums">{s.applicationsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

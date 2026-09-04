"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { MatchBreakdownBars } from "@/components/intelligence/MatchBreakdown";
import { matches } from "@/data/mock/matches";
import { getStudentById } from "@/data/mock/students";
import { getDriveById } from "@/data/mock/drives";

export default function OfficerMatchingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = matches.find((m) => m.id === selectedId);
  const student = selected ? getStudentById(selected.studentId) : undefined;
  const drive = selected ? getDriveById(selected.driveId) : undefined;

  const sorted = [...matches].sort((a, b) => b.overallFit - a.overallFit);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Drives"
        title="Candidate Matching"
        subtitle="Explainable match intelligence across every candidate-drive pair."
        actions={<DemoDataBadge />}
      />

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Drive</TableHead>
              <TableHead>Overall Fit</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((m) => {
              const s = getStudentById(m.studentId);
              const d = getDriveById(m.driveId);
              if (!s || !d) return null;
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">{s.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {d.companyName} · {d.role}
                  </TableCell>
                  <TableCell className="font-semibold text-violet-bright tabular-nums">{m.overallFit}%</TableCell>
                  <TableCell className="text-muted-foreground">{m.recommendation}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedId(m.id)}>
                      <Target className="h-3.5 w-3.5" /> Breakdown
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent>
          {selected && student && drive && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {student.name} → {drive.companyName}
                </DialogTitle>
                <DialogDescription>
                  {drive.role} · Overall Fit <span className="font-semibold text-violet-bright">{selected.overallFit}%</span>
                </DialogDescription>
              </DialogHeader>
              <MatchBreakdownBars breakdown={selected.breakdown} />
              <div className="rounded-lg border border-violet/30 bg-violet/5 p-3">
                <p className="text-xs font-semibold text-violet-bright">Recommendation</p>
                <p className="mt-1 text-xs text-muted-foreground">{selected.recommendation}</p>
              </div>
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

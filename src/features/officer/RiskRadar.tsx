"use client";

import { useState } from "react";
import { ShieldAlert, UserPlus, MessageSquareText, Map, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PageHeader } from "@/components/layout/PageHeader";
import { riskEntries } from "@/data/mock/risk";
import { getStudentById } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import type { RiskLevel } from "@/types";

const levelVariant: Record<RiskLevel, "risk" | "warning" | "success"> = {
  HIGH: "risk",
  MEDIUM: "warning",
  LOW: "success",
};

const actionMeta: Record<string, typeof UserPlus> = {
  "Assign Mentor": UserPlus,
  "Schedule Mock Interview": MessageSquareText,
  "Update Roadmap": Map,
  "Recommend Relevant Drives": Briefcase,
};

const order: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export function RiskRadar() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pushToast = useAppStore((s) => s.pushToast);

  const sorted = [...riskEntries].sort((a, b) => order[a.level] - order[b.level]);
  const selected = riskEntries.find((r) => r.studentId === selectedId);
  const selectedStudent = selected ? getStudentById(selected.studentId) : undefined;

  const runAction = (action: string) => {
    pushToast(action, `${action} has been triggered for ${selectedStudent?.name} (simulated).`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Talent"
        title="Risk Radar"
        subtitle="Students flagged by placement risk, with recommended interventions."
      />

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => {
              const student = getStudentById(r.studentId);
              if (!student) return null;
              return (
                <TableRow
                  key={r.studentId}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(r.studentId)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">{student.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{student.readiness}</TableCell>
                  <TableCell className="tabular-nums">{student.placementProbability}%</TableCell>
                  <TableCell>
                    <Badge variant={levelVariant[r.level]}>{r.level}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.primaryReason}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedId(r.studentId)}>
                      {r.level === "LOW" ? "View" : "Review"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && selectedStudent && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-risk" /> {selectedStudent.name}
                </SheetTitle>
                <SheetDescription>
                  <Badge variant={levelVariant[selected.level]} className="mr-2">
                    {selected.level} RISK
                  </Badge>
                  {selected.primaryReason}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk Factors</p>
                <div className="space-y-2">
                  {selected.factors.map((f) => (
                    <div key={f.label} className="rounded-lg border border-border p-2.5">
                      <p className="text-xs font-medium text-foreground">{f.label}</p>
                      <p className="text-xs text-muted-foreground">{f.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selected.level !== "LOW" && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.recommendedActions.map((action) => {
                      const Icon = actionMeta[action] ?? UserPlus;
                      return (
                        <Button key={action} variant="outline" size="sm" className="justify-start" onClick={() => runAction(action)}>
                          <Icon className="h-3.5 w-3.5" /> {action}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

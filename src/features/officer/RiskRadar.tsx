"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, UserPlus, MessageSquareText, Map, Briefcase, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PageHeader } from "@/components/layout/PageHeader";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { AnimatedMetric } from "@/components/intelligence/AnimatedMetric";
import { DonutChart } from "@/components/charts/DonutChart";
import { riskEntries } from "@/data/mock/risk";
import { getStudentById } from "@/data/mock/students";
import { getMentorForStudent, RECOMMENDED_PLAN_TEMPLATE } from "@/data/mock/mentors";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";
import { riskOrder, riskTone } from "@/lib/status";
import type { RiskLevel } from "@/types";

const actionMeta: Record<string, typeof UserPlus> = {
  "Assign Mentor": UserPlus,
  "Schedule Mock Interview": MessageSquareText,
  "Update Roadmap": Map,
  "Recommend Relevant Drives": Briefcase,
};

export function RiskRadar() {
  const router = useRouter();
  const campusId = useAppStore((s) => s.activeCampusId);
  const pushToast = useAppStore((s) => s.pushToast);
  const interventions = useAppStore((s) => s.interventions);
  const createIntervention = useAppStore((s) => s.createIntervention);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const campusRisk = useMemo(
    () => riskEntries.filter((r) => getStudentById(r.studentId)?.campusId === campusId),
    [campusId],
  );

  const sorted = [...campusRisk].sort((a, b) => riskOrder[a.level] - riskOrder[b.level]);
  const selected = campusRisk.find((r) => r.studentId === selectedId);
  const selectedStudent = selected ? getStudentById(selected.studentId) : undefined;
  const selectedPlan = interventions.find((p) => p.studentId === selectedId);

  const counts: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const r of campusRisk) counts[r.level]++;

  const runAction = (action: string) => {
    if (!selectedStudent) return;

    if (action === "Assign Mentor") {
      const mentor = getMentorForStudent(selectedStudent.id);
      if (selectedPlan) {
        pushToast(
          "Intervention already open",
          `${selectedStudent.name} already has a ${selectedPlan.status.toLowerCase()} plan with ${mentor?.name ?? "their mentor"}.`,
        );
        return;
      }
      createIntervention({
        id: `int_${selectedStudent.id}_officer`,
        studentId: selectedStudent.id,
        mentorId: mentor?.id ?? "men_anita",
        status: "PROPOSED",
        createdOn: "13 Sep 2026",
        focusAreas: selectedStudent.criticalGaps.slice(0, 3),
        actions: RECOMMENDED_PLAN_TEMPLATE.map((label, i) => ({
          id: `int_${selectedStudent.id}_a${i + 1}`,
          label,
          done: false,
        })),
        progress: 0,
        notes: "Proposed by the placement office from Risk Radar — awaiting mentor activation.",
      });
      pushToast(
        "Mentor assigned",
        `${mentor?.name ?? "A mentor"} has been assigned to ${selectedStudent.name}. A draft intervention plan is now waiting in the Mentor workspace.`,
      );
      return;
    }

    pushToast(action, `${action} has been triggered for ${selectedStudent.name} (simulated).`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Students"
        title="Risk Radar"
        subtitle="Students flagged by placement risk, with recommended interventions."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid gap-5 sm:grid-cols-[auto_1fr]">
        <DataReveal>
          <DepthCard className="flex items-center justify-center p-5">
            <DonutChart
              data={[
                { name: "High", value: counts.HIGH },
                { name: "Medium", value: counts.MEDIUM },
                { name: "Low", value: counts.LOW },
              ]}
              colors={["--risk", "--warning", "--success"]}
              size={140}
              centerValue={campusRisk.length}
              centerLabel="flagged"
            />
          </DepthCard>
        </DataReveal>
        <DataReveal stagger className="grid grid-cols-3 gap-3">
          {(["HIGH", "MEDIUM", "LOW"] as RiskLevel[]).map((level) => (
            <DataRevealItem key={level}>
              <DepthCard className={cn("h-full p-4", level === "HIGH" && "border-risk/30")}>
                <p className="text-2xl font-semibold tabular-nums">
                  <AnimatedMetric value={counts[level]} />
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Badge variant={riskTone[level]}>{level}</Badge>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Driven by readiness, applications, interview performance &amp; skill gap signals.
                </p>
              </DepthCard>
            </DataRevealItem>
          ))}
        </DataReveal>
      </div>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Primary Reason</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => {
              const student = getStudentById(r.studentId);
              if (!student) return null;
              const mentor = getMentorForStudent(student.id);
              return (
                <TableRow
                  key={r.studentId}
                  className={cn(
                    "cursor-pointer",
                    r.level === "HIGH" && "border-l-2 border-l-risk/50",
                  )}
                  onClick={() => setSelectedId(r.studentId)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {student.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{student.readiness}</TableCell>
                  <TableCell className="tabular-nums">{student.placementProbability}%</TableCell>
                  <TableCell>
                    <Badge variant={riskTone[r.level]}>{r.level}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.primaryReason}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {mentor?.name ?? "Unassigned"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(r.studentId);
                      }}
                    >
                      {r.level === "LOW" ? "View" : "Review"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No risk entries tracked for this campus.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && selectedStudent && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShieldAlert
                    className={cn(
                      "h-4 w-4",
                      selected.level === "LOW" ? "text-success" : "text-risk",
                    )}
                  />{" "}
                  {selectedStudent.name}
                </SheetTitle>
                <SheetDescription>
                  <Badge variant={riskTone[selected.level]} className="mr-2">
                    {selected.level} RISK
                  </Badge>
                  {selected.primaryReason}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Risk Factors
                </p>
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
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recommended Interventions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.recommendedActions.map((action) => {
                      const Icon = actionMeta[action] ?? UserPlus;
                      return (
                        <Button
                          key={action}
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => runAction(action)}
                        >
                          <Icon className="h-3.5 w-3.5" /> {action}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedPlan && (
                <div className="mt-5 rounded-lg border border-violet/30 bg-violet/5 p-3">
                  <p className="text-xs font-semibold text-violet-bright">Intervention Plan</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Status {selectedPlan.status} · {selectedPlan.progress}% complete · Focus:{" "}
                    {selectedPlan.focusAreas.join(", ")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => router.push("/mentor")}
                  >
                    Open in Mentor workspace <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

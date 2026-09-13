"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartHandshake, ArrowUpRight, CheckCircle2, Circle, Play } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { activeMentor } from "@/data/mock/mentors";
import { getStudentById } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import type { InterventionPlan, InterventionStatus } from "@/types";

const statusTone: Record<InterventionStatus, "default" | "success" | "muted"> = {
  PROPOSED: "muted",
  ACTIVE: "default",
  COMPLETED: "success",
};

function PlanCard({ plan }: { plan: InterventionPlan }) {
  const student = getStudentById(plan.studentId);
  const activateIntervention = useAppStore((s) => s.activateIntervention);
  const toggleInterventionAction = useAppStore((s) => s.toggleInterventionAction);
  const pushToast = useAppStore((s) => s.pushToast);

  if (!student) return null;

  return (
    <DepthCard className="h-full p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-[11px]">{student.avatarInitials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate">{student.name}</CardTitle>
            <p className="truncate text-xs text-muted-foreground">
              Created {plan.createdOn} · {student.branchCode}
            </p>
          </div>
        </div>
        <Badge variant={statusTone[plan.status]}>{plan.status}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {plan.focusAreas.map((f) => (
          <Badge key={f} variant="warning">
            {f}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Progress value={plan.progress} className="flex-1" />
        <motion.span
          key={plan.progress}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 text-sm font-semibold tabular-nums text-violet-bright"
        >
          {plan.progress}%
        </motion.span>
      </div>

      <div className="mt-3 space-y-1.5">
        {plan.actions.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              toggleInterventionAction(plan.id, a.id);
              pushToast("Progress updated", `"${a.label}" was updated for ${student.name}.`);
            }}
            className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs transition-colors hover:bg-accent/40"
          >
            {a.done ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <span className={a.done ? "text-muted-foreground line-through" : undefined}>
              {a.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {plan.status === "PROPOSED" && (
          <Button
            variant="glow"
            size="sm"
            onClick={() => {
              activateIntervention(plan.id);
              pushToast("Intervention activated", `${student.name}'s plan is now ACTIVE.`);
            }}
          >
            <Play className="h-3.5 w-3.5" /> Activate
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href={`/mentor/students/${student.id}`}>
            Open case <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </DepthCard>
  );
}

export default function MentorInterventionsPage() {
  const interventions = useAppStore((s) => s.interventions);
  const mine = interventions.filter((p) => activeMentor.assignedStudentIds.includes(p.studentId));

  const proposed = mine.filter((p) => p.status === "PROPOSED");
  const active = mine.filter((p) => p.status === "ACTIVE");
  const completed = mine.filter((p) => p.status === "COMPLETED");

  const renderGrid = (list: InterventionPlan[], emptyText: string) =>
    list.length === 0 ? (
      <Card className="p-10 text-center text-sm text-muted-foreground">{emptyText}</Card>
    ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Intervention"
        title="Intervention Plans"
        subtitle="Plans you own, plus drafts proposed by the placement office awaiting activation."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Proposed" value={proposed.length} accent="warning" />
        <StatCard label="Active" value={active.length} icon={HeartHandshake} accent="violet" />
        <StatCard label="Completed" value={completed.length} accent="success" />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="proposed">Proposed ({proposed.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {renderGrid(active, "No active plans — activate a proposed plan or create one from a student case.")}
        </TabsContent>
        <TabsContent value="proposed">
          {renderGrid(proposed, "Nothing awaiting activation right now.")}
        </TabsContent>
        <TabsContent value="completed">
          {renderGrid(completed, "No completed plans yet — tick every action on a plan to complete it.")}
        </TabsContent>
      </Tabs>
    </div>
  );
}

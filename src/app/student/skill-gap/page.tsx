"use client";

import { Target, CheckCircle2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { primaryStudent } from "@/data/mock/students";

export default function SkillGapPage() {
  const s = primaryStudent;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Growth"
        title="Skill Gap Analysis"
        subtitle={`Target role: ${s.targetRole}`}
      />

      <Card className="mb-5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <CardTitle>Your Strengths</CardTitle>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {s.strengths.map((st) => (
            <Badge key={st} variant="success">
              {st}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-bright" />
          <CardTitle>Skill Gaps for {s.targetRole}</CardTitle>
        </div>
        <div className="space-y-5">
          {s.skillGaps.map((g) => (
            <div key={g.skill} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">{g.skill}</span>
                <Badge variant={g.priority === "HIGH" ? "risk" : "warning"}>{g.priority} PRIORITY</Badge>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SkillBar label="Current Level" value={g.currentLevel} colorClass="bg-muted-foreground/60" />
                <SkillBar label="Target Level" value={g.targetLevel} colorClass="bg-violet" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Why it matters: </span>
                {g.whyItMatters}
              </p>
              <p className="mt-1.5 text-xs text-violet-bright">
                <span className="font-medium">Recommended action: </span>
                {g.recommendedAction}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

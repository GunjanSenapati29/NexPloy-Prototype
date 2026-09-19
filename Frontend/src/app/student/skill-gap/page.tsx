"use client";

import { Target, CheckCircle2, ArrowRight } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { GlowLine } from "@/components/intelligence/GlowLine";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { primaryStudent } from "@/data/mock/students";
import { skillDemand } from "@/data/mock/analytics";
import type { SkillGap } from "@/types";

const priorityTone = { HIGH: "risk", MEDIUM: "warning", LOW: "muted" } as const;

function GapRow({ gap }: { gap: SkillGap }) {
  return (
    <div className="rounded-lg border border-border p-4 transition-colors hover:border-violet/30">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">{gap.skill}</span>
        <Badge
          variant={priorityTone[gap.priority]}
          className={
            gap.priority === "HIGH"
              ? "shadow-[0_0_0_1px_hsl(var(--risk)/0.3),0_0_16px_-4px_hsl(var(--risk)/0.6)]"
              : undefined
          }
        >
          {gap.priority} PRIORITY
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-muted px-2 py-1">
          <span className="text-muted-foreground">Current: </span>
          <span className="font-medium">{gap.currentLabel}</span>
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="rounded-md bg-violet/10 px-2 py-1 text-violet-bright">
          <span className="opacity-80">Required: </span>
          <span className="font-medium">{gap.targetLabel}</span>
        </span>
        <span className="text-muted-foreground">
          Gap: <span className="font-medium text-foreground">{gap.targetLevel - gap.currentLevel}</span> points
        </span>
      </div>

      <div className="mt-3 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <SkillBar label="Current Level" value={gap.currentLevel} colorClass="bg-muted-foreground/60" />
        <GlowLine
          orientation="vertical"
          tone={gap.priority === "HIGH" ? "risk" : "warning"}
          className="hidden h-10 sm:block"
        />
        <SkillBar label="Required Level" value={gap.targetLevel} colorClass="bg-violet" />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Why it matters: </span>
        {gap.whyItMatters}
      </p>
      <p className="mt-1.5 text-xs text-violet-bright">
        <span className="font-medium">Recommended action: </span>
        {gap.recommendedAction}
      </p>
    </div>
  );
}

export default function SkillGapPage() {
  const s = primaryStudent;
  const highPriority = s.skillGaps.filter((g) => g.priority === "HIGH");
  const rest = s.skillGaps.filter((g) => g.priority !== "HIGH");

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Intelligence"
        title="Skill Gap Analysis"
        subtitle={`Target role: ${s.targetRole}`}
      />

      <DepthCard className="mb-5 p-5">
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
      </DepthCard>

      <DepthCard className="p-5">
        <div className="mb-1 flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-bright" />
          <CardTitle>Skill Gaps for {s.targetRole}</CardTitle>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Ranked by priority — high-priority gaps appear as required skills across your active drives.
        </p>
        <DataReveal stagger className="space-y-4">
          {highPriority.map((g) => (
            <DataRevealItem key={g.skill}>
              <GapRow gap={g} />
            </DataRevealItem>
          ))}
          {rest.map((g) => (
            <DataRevealItem key={g.skill}>
              <GapRow gap={g} />
            </DataRevealItem>
          ))}
        </DataReveal>
      </DepthCard>

      <DepthCard className="mt-5 p-5">
        <CardTitle className="mb-1">Market Demand for Your Gaps</CardTitle>
        <p className="mb-3 text-xs text-muted-foreground">
          How strongly recruiters this cycle are asking for the skills you are missing.{" "}
          <span className="demo-data-label">Demo Data</span>
        </p>
        <div className="space-y-3">
          {skillDemand
            .filter((d) => s.criticalGaps.some((g) => d.skill.toLowerCase().includes(g.toLowerCase())))
            .map((d) => (
              <SkillBar key={d.skill} label={d.skill} value={d.demandScore} colorClass="bg-violet" />
            ))}
        </div>
      </DepthCard>
    </div>
  );
}

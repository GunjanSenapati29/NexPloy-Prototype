"use client";

import { Gauge, Trophy } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { primaryStudent } from "@/data/mock/students";
import { branchStats } from "@/data/mock/analytics";

export default function ReadinessPage() {
  const s = primaryStudent;
  const trendData = s.readinessTrend.map((v, i) => ({ label: `W${i + 1}`, value: v }));
  const branch = branchStats.find((b) => b.branch === s.branch);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="Intelligence" title="Placement Readiness" subtitle="How ready you are, tracked over time and benchmarked against your branch." />

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6 md:col-span-1">
          <ScoreRing value={s.readiness} size={160} strokeWidth={12} label="Readiness" sublabel="out of 100" />
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-violet-bright" /> Top {100 - s.readiness < 25 ? 20 : 35}% of cohort
          </div>
        </Card>

        <Card className="p-5 md:col-span-2">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-violet-bright" />
            <CardTitle>Readiness Over Time</CardTitle>
          </div>
          <div className="mt-3">
            <TrendAreaChart data={trendData} dataKey="value" xKey="label" height={200} />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card className="p-5">
          <CardTitle className="mb-3">Component Breakdown</CardTitle>
          <div className="space-y-3">
            <SkillBar label="Technical" value={s.breakdown.technical} />
            <SkillBar label="Academic" value={s.breakdown.academic} />
            <SkillBar label="Interview" value={s.breakdown.interview} />
            <SkillBar label="Communication" value={s.breakdown.communication} />
            <SkillBar label="Projects" value={s.breakdown.projects} />
          </div>
        </Card>

        <Card className="p-5">
          <CardTitle className="mb-3">Branch Benchmark — {s.branch}</CardTitle>
          {branch && (
            <div className="space-y-3">
              <SkillBar label="Your readiness" value={s.readiness} colorClass="bg-violet" />
              <SkillBar label={`${s.branch} placement rate`} value={branch.placementRate} colorClass="bg-success" />
              <p className="pt-1 text-xs text-muted-foreground">
                {branch.studentsPlaced} of {branch.totalStudents} students placed this cycle in {s.branch}.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

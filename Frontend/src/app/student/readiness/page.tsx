"use client";

import Link from "next/link";
import { Gauge, Trophy, Target, ShieldCheck, ShieldAlert, ArrowUpRight, Info } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal } from "@/components/intelligence/DataReveal";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { primaryStudent } from "@/data/mock/students";
import { getCampusAnalytics } from "@/data/mock/analytics";
import { getRiskByStudent } from "@/data/mock/risk";
import { readinessBand, riskTone } from "@/lib/status";

/** The eight employability dimensions, in the order they are presented
 * everywhere in the app. */
const DIMENSIONS = [
  { key: "academic", label: "Academics" },
  { key: "technical", label: "Technical Skills" },
  { key: "coding", label: "Coding" },
  { key: "aptitude", label: "Aptitude" },
  { key: "communication", label: "Communication" },
  { key: "projects", label: "Projects" },
  { key: "interview", label: "Interview Readiness" },
  { key: "placementActivity", label: "Placement Activity" },
] as const;

export default function ReadinessPage() {
  const s = primaryStudent;
  const trendData = s.readinessTrend.map((v, i) => ({ label: `W${i + 1}`, value: v }));
  const branch = getCampusAnalytics(s.campusId).branchStats.find((b) => b.branchCode === s.branchCode);
  const band = readinessBand(s.readiness);
  const risk = getRiskByStudent(s.id);

  const weakest = [...DIMENSIONS]
    .map((d) => ({ ...d, value: s.breakdown[d.key] }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Intelligence"
        title="Placement Readiness"
        subtitle="Eight employability dimensions, tracked over time and benchmarked against your branch."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-3 p-6 md:col-span-1">
          <ScoreRing
            value={s.readiness}
            size={160}
            strokeWidth={12}
            label="Readiness"
            sublabel="out of 100"
          />
          <Badge variant={band.tone}>{band.label}</Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-violet-bright" /> Top{" "}
            {100 - s.readiness < 25 ? 20 : 35}% of cohort
          </div>
        </Card>

        <Card className="p-5 md:col-span-2">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-violet-bright" />
            <CardTitle>Readiness Over Time</CardTitle>
          </div>
          <div className="mt-3">
            <DataReveal>
              <TrendAreaChart data={trendData} dataKey="value" xKey="label" height={200} />
            </DataReveal>
          </div>
        </Card>
      </div>

      <Card className="mt-5 p-5">
        <CardTitle className="mb-1">Employability Dimensions</CardTitle>
        <p className="mb-4 text-xs text-muted-foreground">
          The overall readiness score is the average of these eight dimensions.
        </p>
        <DataReveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {DIMENSIONS.map((d) => {
              const value = s.breakdown[d.key];
              return (
                <SkillBar
                  key={d.key}
                  label={d.label}
                  value={value}
                  colorClass={value >= 80 ? "bg-success" : value >= 65 ? "bg-violet" : "bg-warning"}
                />
              );
            })}
          </div>
        </DataReveal>
      </Card>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <DepthCard className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-bright" />
            <CardTitle>Placement Probability</CardTitle>
          </div>
          <div className="flex items-center gap-5">
            <ScoreRing
              value={s.placementProbability}
              size={110}
              strokeWidth={9}
              label="Probability"
              colorClass="stroke-success"
            />
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                Prototype estimate based on current readiness indicators.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/student/what-if">
                  Run a What-If scenario <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
          <Alert className="mt-4">
            <Info />
            <AlertDescription>
              Not a real ML prediction — this is a fixed demo estimate, not a model output.
            </AlertDescription>
          </Alert>
        </DepthCard>

        <DepthCard className="p-5">
          <div className="mb-3 flex items-center gap-2">
            {s.riskLevel === "LOW" ? (
              <ShieldCheck className="h-4 w-4 text-success" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-risk" />
            )}
            <CardTitle>Risk Assessment</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={riskTone[s.riskLevel]}>{s.riskLevel} RISK</Badge>
            <span className="text-sm text-muted-foreground">{s.riskReason}</span>
          </div>
          {risk && (
            <div className="mt-3 space-y-2">
              {risk.factors.map((f) => (
                <div key={f.label} className="rounded-lg border border-border p-2.5">
                  <p className="text-xs font-medium">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.detail}</p>
                </div>
              ))}
            </div>
          )}
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Biggest levers right now
          </p>
          <div className="flex flex-wrap gap-1.5">
            {weakest.map((w) => (
              <Badge key={w.key} variant="warning">
                {w.label} · {w.value}
              </Badge>
            ))}
          </div>
        </DepthCard>
      </div>

      {branch && (
        <Card className="mt-5 p-5">
          <CardTitle className="mb-3">Branch Benchmark — {s.branch}</CardTitle>
          <div className="space-y-3">
            <SkillBar label="Your readiness" value={s.readiness} colorClass="bg-violet" />
            <SkillBar
              label={`${s.branch} placement rate`}
              value={branch.placementRate}
              colorClass="bg-success"
            />
            <p className="pt-1 text-xs text-muted-foreground">
              {branch.studentsPlaced} of {branch.totalStudents} students placed this cycle in{" "}
              {s.branch}. <span className="demo-data-label">Demo Data</span>
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

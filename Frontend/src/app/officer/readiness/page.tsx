"use client";

import { useMemo, useState } from "react";
import { Gauge, Users, ShieldCheck, ShieldAlert, Search } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { students } from "@/data/mock/students";
import { getCampusAnalytics } from "@/data/mock/analytics";
import { getCampusById } from "@/data/mock/campuses";
import { useAppStore } from "@/hooks/useAppStore";
import { readinessBand, riskTone } from "@/lib/status";

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

export default function OfficerReadinessPage() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const campus = getCampusById(campusId);
  const analytics = getCampusAnalytics(campusId);
  const [query, setQuery] = useState("");
  const [band, setBand] = useState("all");

  const roster = useMemo(() => students.filter((s) => s.campusId === campusId), [campusId]);

  /** Cohort dimension averages come from the visible roster, so the chart
   * can never disagree with the table below it. */
  const cohortAverages = DIMENSIONS.map((d) => ({
    label: d.label,
    value: roster.length
      ? Math.round(roster.reduce((sum, s) => sum + s.breakdown[d.key], 0) / roster.length)
      : 0,
  }));

  const filtered = roster
    .filter((s) => (query ? s.name.toLowerCase().includes(query.toLowerCase()) : true))
    .filter((s) => (band === "all" ? true : readinessBand(s.readiness).label === band))
    .sort((a, b) => b.readiness - a.readiness);

  const ready = roster.filter((s) => s.readiness >= 80).length;
  const needsWork = roster.filter((s) => s.readiness < 65).length;
  const avgReadiness = roster.length
    ? Math.round(roster.reduce((n, s) => n + s.readiness, 0) / roster.length)
    : 0;

  const bands = Array.from(new Set(roster.map((s) => readinessBand(s.readiness).label)));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Students"
        title="Student Readiness Overview"
        subtitle={`Employability across the ${campus?.name ?? "campus"} cohort, dimension by dimension.`}
        actions={<DemoDataBadge />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students Tracked" value={roster.length} icon={Users} />
        <StatCard label="Placement Ready" value={ready} icon={ShieldCheck} accent="success" />
        <StatCard label="Needs Support" value={needsWork} icon={ShieldAlert} accent="risk" />
        <StatCard label="Average Readiness" value={avgReadiness} suffix="/100" icon={Gauge} accent="violet" />
      </div>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Cohort Dimension Averages</CardTitle>
              <DemoDataBadge />
            </div>
            <HorizontalBarChart data={cohortAverages} xKey="value" yKey="label" height={280} />
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Readiness Distribution</CardTitle>
              <DemoDataBadge />
            </div>
            <VerticalBarChart
              data={analytics.readinessDistribution}
              xKey="band"
              yKey="count"
              height={280}
            />
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <Card className="mt-5 p-5">
        <CardTitle className="mb-3">Branch Readiness Benchmarks</CardTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {analytics.branchStats.map((b) => (
            <SkillBar
              key={b.branchCode}
              label={`${b.branch} (${b.placementRate}% placed)`}
              value={b.placementRate}
              colorClass={
                b.placementRate >= 80 ? "bg-success" : b.placementRate >= 65 ? "bg-violet" : "bg-warning"
              }
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Aggregate campus figures — <span className="demo-data-label">Demo Data</span>
        </p>
      </Card>

      <div className="mb-4 mt-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search student..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search students"
          />
        </div>
        <Select value={band} onValueChange={setBand}>
          <SelectTrigger className="w-48" aria-label="Filter by readiness band">
            <SelectValue placeholder="Readiness band" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All bands</SelectItem>
            {bands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Band</TableHead>
              <TableHead>Coding</TableHead>
              <TableHead>Communication</TableHead>
              <TableHead>Interview</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => {
              const b = readinessBand(s.readiness);
              return (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">{s.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums">{s.readiness}</TableCell>
                  <TableCell>
                    <Badge variant={b.tone}>{b.label}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{s.breakdown.coding}</TableCell>
                  <TableCell className="tabular-nums">{s.breakdown.communication}</TableCell>
                  <TableCell className="tabular-nums">{s.breakdown.interview}</TableCell>
                  <TableCell className="tabular-nums">{s.breakdown.placementActivity}</TableCell>
                  <TableCell>
                    <Badge variant={riskTone[s.riskLevel]}>{s.riskLevel}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No students match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

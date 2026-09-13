"use client";

import { BarChart3, TrendingUp, Users, Award, IndianRupee } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { campuses, instituteTotals } from "@/data/mock/campuses";
import { crossCampusComparison, getCampusAnalytics } from "@/data/mock/analytics";

export default function CrossCampusAnalyticsPage() {
  /** Institute-wide funnel is the sum of every campus funnel, so the chart
   * always reconciles with the per-campus views. */
  const stageNames = getCampusAnalytics(campuses[0].id).funnel.map((f) => f.stage);
  const instituteFunnel = stageNames.map((stage) => ({
    stage,
    count: campuses.reduce(
      (sum, c) =>
        sum + (getCampusAnalytics(c.id).funnel.find((f) => f.stage === stage)?.count ?? 0),
      0,
    ),
  }));

  const offersByMonth = getCampusAnalytics(campuses[0].id).offerPipeline.map((p) => ({
    month: p.month,
    offers: campuses.reduce(
      (sum, c) =>
        sum + (getCampusAnalytics(c.id).offerPipeline.find((o) => o.month === p.month)?.offers ?? 0),
      0,
    ),
  }));

  const atRiskByCampus = campuses.map((c) => ({ label: c.name, value: c.atRisk }));

  const bestCampus = [...campuses].sort((a, b) => b.placementRate - a.placementRate)[0];
  const weakestCampus = [...campuses].sort((a, b) => a.placementRate - b.placementRate)[0];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Campuses"
        title="Cross-Campus Analytics"
        subtitle="Institute-wide placement performance, compared campus by campus."
        actions={<DemoDataBadge />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Students" value={instituteTotals.totalStudents} icon={Users} />
        <StatCard label="Placed" value={instituteTotals.placed} icon={Award} accent="success" />
        <StatCard label="Offers" value={instituteTotals.offers} accent="success" />
        <StatCard
          label="Institute Rate"
          value={instituteTotals.placementRate}
          suffix="%"
          icon={TrendingUp}
          accent="violet"
        />
        <StatCard label="At Risk" value={instituteTotals.atRisk} accent="risk" />
      </div>

      <Card className="mt-5 overflow-x-auto p-5">
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Campus Comparison</CardTitle>
          <DemoDataBadge />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campus</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Ready</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead>Placement Rate</TableHead>
              <TableHead>Average CTC</TableHead>
              <TableHead>Standing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crossCampusComparison.map((c) => (
              <TableRow key={c.campus}>
                <TableCell className="font-medium">{c.campus}</TableCell>
                <TableCell className="tabular-nums">{c.students.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums">{c.ready.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums">{c.placed.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums text-violet-bright">{c.placementRate}%</TableCell>
                <TableCell className="tabular-nums">{c.averageCtc}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      c.placementRate >= 80 ? "success" : c.placementRate >= 74 ? "warning" : "risk"
                    }
                  >
                    {c.placementRate >= 80
                      ? "Leading"
                      : c.placementRate >= 74
                        ? "On track"
                        : "Needs attention"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-violet-bright" />
                <CardTitle>Institute Placement Funnel</CardTitle>
              </div>
              <DemoDataBadge />
            </div>
            <VerticalBarChart data={instituteFunnel} xKey="stage" yKey="count" height={260} />
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Offers by Month (All Campuses)</CardTitle>
              <DemoDataBadge />
            </div>
            <VerticalBarChart
              data={offersByMonth}
              xKey="month"
              yKey="offers"
              height={260}
              colorVar="--success"
            />
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>At-Risk Students by Campus</CardTitle>
              <DemoDataBadge />
            </div>
            <HorizontalBarChart
              data={atRiskByCampus}
              xKey="value"
              yKey="label"
              height={200}
              colorVar="--risk"
            />
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-violet-bright" />
              <CardTitle>Salary Comparison</CardTitle>
            </div>
            <div className="space-y-4">
              {campuses.map((c) => {
                const avg = Number(c.averageCtc.replace(/[^\d.]/g, ""));
                const high = Number(c.highestCtc.replace(/[^\d.]/g, ""));
                return (
                  <div key={c.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground">
                        avg {c.averageCtc} · high {c.highestCtc}
                      </span>
                    </div>
                    <SkillBar
                      label="Average CTC (of ₹15 LPA scale)"
                      value={Math.round((avg / 15) * 100)}
                      colorClass="bg-violet"
                    />
                    <div className="mt-1.5">
                      <SkillBar
                        label="Highest CTC (of ₹15 LPA scale)"
                        value={Math.round((high / 15) * 100)}
                        colorClass="bg-success"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DepthCard className="mt-5 p-5">
        <CardTitle className="mb-2">Institute Read</CardTitle>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{bestCampus.name}</span> leads at{" "}
          {bestCampus.placementRate}% placement with an average of {bestCampus.averageCtc}.{" "}
          <span className="font-medium text-foreground">{weakestCampus.name}</span> trails at{" "}
          {weakestCampus.placementRate}% — the widest gap between placement-ready students and
          students actually placed sits there, which is where mentor capacity and drive coverage are
          worth reviewing first. All figures on this page are demo data.
        </p>
      </DepthCard>
    </div>
  );
}

"use client";

import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  ShieldAlert,
  Users,
  Award,
  Percent,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { getCampusAnalytics, skillSupply } from "@/data/mock/analytics";
import { getCampusById } from "@/data/mock/campuses";
import { useAppStore } from "@/hooks/useAppStore";

export default function OfficerAnalyticsPage() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const campus = getCampusById(campusId);
  const analytics = getCampusAnalytics(campusId);
  const a = analytics.snapshot;

  const applicationConversion = Math.round((a.offersCount / a.applications) * 100);
  const joinedStage = analytics.funnel.find((f) => f.stage === "Joined")?.count ?? 0;
  const offeredStage = analytics.funnel.find((f) => f.stage === "Offered")?.count ?? 1;
  const joiningRate = Math.round((joinedStage / offeredStage) * 100);
  const interviewedStage = analytics.funnel.find((f) => f.stage === "Interviewed")?.count ?? 1;
  const offerConversion = Math.round((offeredStage / interviewedStage) * 100);

  const salaryTrend = analytics.salaryTrend.map((s) => ({
    label: s.month,
    average: s.averageLpa,
    highest: s.highestLpa,
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Intelligence"
        title="Placement Analytics"
        subtitle={`Deeper cuts of placement performance across ${campus?.name ?? "the campus"}.`}
        actions={<DemoDataBadge />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Placement Rate" value={a.placementRate} suffix="%" icon={TrendingUp} accent="violet" />
        <StatCard label="Average CTC" value={a.averageCtc} icon={IndianRupee} accent="success" />
        <StatCard label="Highest CTC" value={a.highestCtc} icon={Award} accent="success" />
        <StatCard label="At Risk" value={a.atRisk} icon={ShieldAlert} accent="risk" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Applications" value={a.applications} icon={Users} />
        <StatCard label="Offers" value={a.offersCount} icon={Award} accent="success" />
        <StatCard label="Application → Offer" value={applicationConversion} suffix="%" icon={Percent} accent="violet" />
        <StatCard label="Offer → Joining" value={joiningRate} suffix="%" icon={Percent} accent="violet" />
      </div>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-violet-bright" />
                <CardTitle>Offer Pipeline (Monthly)</CardTitle>
              </div>
              <DemoDataBadge />
            </div>
            <VerticalBarChart
              data={analytics.offerPipeline}
              xKey="month"
              yKey="offers"
              colorVar="--success"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Interview → offer conversion:{" "}
              <span className="font-medium text-foreground">{offerConversion}%</span>
            </p>
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Salary Trend (LPA)</CardTitle>
              <DemoDataBadge />
            </div>
            <TrendAreaChart data={salaryTrend} dataKey="average" xKey="label" height={220} />
            <p className="mt-2 text-xs text-muted-foreground">
              Average rose from{" "}
              <span className="font-medium text-foreground">
                ₹{salaryTrend[0].average} LPA
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                ₹{salaryTrend[salaryTrend.length - 1].average} LPA
              </span>{" "}
              this cycle; highest reached ₹
              {Math.max(...salaryTrend.map((s) => s.highest))} LPA.
            </p>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Recruiter Engagement</CardTitle>
              <DemoDataBadge />
            </div>
            <HorizontalBarChart
              data={analytics.recruiterEngagement.map((r) => ({ label: r.company, value: r.offers }))}
              xKey="value"
              yKey="label"
              height={260}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Offers made per recruiter across all drives this cycle.
            </p>
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>At-Risk Distribution</CardTitle>
              <DemoDataBadge />
            </div>
            <VerticalBarChart
              data={analytics.riskDistribution}
              xKey="level"
              yKey="count"
              height={260}
              colorVar="--risk"
            />
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <Card className="mt-5 p-5">
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Skill Analytics — Demand vs. Cohort Coverage</CardTitle>
          <DemoDataBadge />
        </div>
        <div className="space-y-4">
          {skillSupply.map((s) => (
            <div key={s.skill}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium">{s.skill}</span>
                <span
                  className={
                    s.demand - s.cohortCoverage > 40 ? "text-risk" : "text-muted-foreground"
                  }
                >
                  gap {s.demand - s.cohortCoverage}
                </span>
              </div>
              <SkillBar label="Recruiter demand" value={s.demand} colorClass="bg-violet" />
              <div className="mt-1.5">
                <SkillBar
                  label="Cohort coverage"
                  value={s.cohortCoverage}
                  colorClass={s.cohortCoverage >= 65 ? "bg-success" : "bg-warning"}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-5 overflow-x-auto p-5">
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Branch Analytics</CardTitle>
          <DemoDataBadge />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch</TableHead>
              <TableHead>Placement Rate</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Standing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.branchStats.map((b) => (
              <TableRow key={b.branchCode}>
                <TableCell className="font-medium">{b.branch}</TableCell>
                <TableCell className="tabular-nums text-violet-bright">{b.placementRate}%</TableCell>
                <TableCell className="tabular-nums">{b.studentsPlaced}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {b.totalStudents}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      b.placementRate >= a.placementRate
                        ? "success"
                        : b.placementRate >= a.placementRate - 12
                          ? "warning"
                          : "risk"
                    }
                  >
                    {b.placementRate >= a.placementRate ? "At or above average" : "Below average"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-3 text-xs text-muted-foreground">
          Campus placement rate: <span className="font-medium text-foreground">{a.placementRate}%</span>{" "}
          across {a.totalStudents.toLocaleString()} students this cycle. All institutional figures on
          this page are demo data.
        </p>
      </Card>
    </div>
  );
}

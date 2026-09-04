"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Briefcase,
  Award,
  TrendingUp,
  AlertTriangle,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { staggerContainer, staggerItem, showcaseEntrance } from "@/lib/motion-variants";
import {
  analyticsSnapshot,
  branchStats,
  commandCenterAlerts,
  offerPipeline,
  placementFunnel,
  readinessDistribution,
  riskDistribution,
  skillDemand,
} from "@/data/mock/analytics";
import { scheduleConflicts } from "@/data/mock/schedules";

const severityVariant = { HIGH: "risk", MEDIUM: "warning", LOW: "success" } as const;

function branchColor(value: number) {
  if (value >= 80) return "142 71% 45%";
  if (value >= 65) return "38 92% 50%";
  return "0 84% 60%";
}

export function CommandCenter() {
  const a = analyticsSnapshot;

  return (
    <motion.div initial="hidden" animate="visible" variants={showcaseEntrance} className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Live Campus Intelligence · 2026 Placement Cycle"
        title="Placement Command Center"
        actions={<DemoDataBadge />}
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <motion.div variants={staggerItem}>
          <StatCard label="Students" value={a.totalStudents.toLocaleString()} icon={Users} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Placement Ready" value={a.placementReady.toLocaleString()} icon={ShieldCheck} accent="success" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="At Risk" value={a.atRisk} icon={ShieldAlert} accent="risk" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Active Drives" value={a.activeDrives} icon={Briefcase} accent="violet" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Offers" value={a.offersCount} icon={Award} accent="success" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Placement Rate" value={`${a.placementRate}%`} icon={TrendingUp} accent="violet" />
        </motion.div>
      </motion.div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <CardTitle className="mb-3">Placement Funnel</CardTitle>
          <VerticalBarChart data={placementFunnel} xKey="stage" yKey="count" height={260} />
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-risk" />
            <CardTitle>Alerts</CardTitle>
          </div>
          <div className="space-y-2.5">
            {commandCenterAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-2.5 rounded-lg border border-border p-2.5">
                <Badge variant={severityVariant[alert.severity]} className="mt-0.5 shrink-0">
                  {alert.severity}
                </Badge>
                <p className="text-xs text-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/officer/risk" className="text-xs text-violet-bright hover:underline">
              View Risk Radar →
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <CardTitle className="mb-3">Branch-wise Placement Rate</CardTitle>
          <HorizontalBarChart
            data={branchStats.map((b) => ({ label: b.branch, value: b.placementRate }))}
            xKey="value"
            yKey="label"
            colorByValue={branchColor}
            height={260}
          />
        </Card>
        <Card className="p-5">
          <CardTitle className="mb-3">Skill Demand</CardTitle>
          <HorizontalBarChart
            data={skillDemand.map((s) => ({ label: s.skill, value: s.demandScore }))}
            xKey="value"
            yKey="label"
            height={260}
          />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <CardTitle className="mb-3">Readiness Distribution</CardTitle>
          <VerticalBarChart data={readinessDistribution} xKey="band" yKey="count" height={220} />
        </Card>
        <Card className="flex flex-col items-center p-5">
          <CardTitle className="mb-3 self-start">Risk Distribution</CardTitle>
          <DonutChart
            data={riskDistribution.map((r) => ({ name: r.level, value: r.count }))}
            colors={["--success", "--warning", "--risk"]}
            centerValue={a.atRisk}
            centerLabel="At Risk"
          />
          <div className="mt-3 flex gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-success" /> Low</span>
            <span className="flex items-center gap-1 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-warning" /> Medium</span>
            <span className="flex items-center gap-1 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-risk" /> High</span>
          </div>
        </Card>
        <Card className="p-5">
          <CardTitle className="mb-3">Offer Pipeline</CardTitle>
          <VerticalBarChart data={offerPipeline} xKey="month" yKey="offers" height={220} colorVar="--success" />
        </Card>
      </div>

      <Card className="mt-5 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-risk" />
            <CardTitle>Drive Conflicts</CardTitle>
          </div>
          <Link href="/officer/orchestrator" className="flex items-center gap-1 text-xs text-violet-bright hover:underline">
            Open Orchestrator <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {scheduleConflicts.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-risk/30 bg-risk/5 p-3">
            <div>
              <p className="text-sm font-medium">CloudSphere · Tuesday 11:00 AM</p>
              <p className="text-xs text-muted-foreground">
                {c.studentOverlap} student overlap · {c.venueIssue} · {c.panelIssue}
              </p>
            </div>
            <Badge variant="risk">{c.severity} SEVERITY</Badge>
          </div>
        ))}
      </Card>
    </motion.div>
  );
}

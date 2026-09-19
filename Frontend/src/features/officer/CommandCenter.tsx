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
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { GlowLine } from "@/components/intelligence/GlowLine";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { staggerContainer, staggerItem, showcaseEntrance } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";
import { getCampusAnalytics, skillDemand } from "@/data/mock/analytics";
import { getCampusById } from "@/data/mock/campuses";
import { scheduleConflicts, scheduleEvents } from "@/data/mock/schedules";
import { drives } from "@/data/mock/drives";
import { riskEntries } from "@/data/mock/risk";
import { getStudentById } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import { riskTone } from "@/lib/status";

function branchColor(value: number) {
  if (value >= 80) return "142 71% 45%";
  if (value >= 65) return "38 92% 50%";
  return "0 84% 60%";
}

export function CommandCenter() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const campus = getCampusById(campusId);
  const analytics = getCampusAnalytics(campusId);
  const a = analytics.snapshot;

  const campusDrives = drives.filter((d) => d.campusId === campusId && d.status === "ACTIVE");
  const highRisk = riskEntries.filter((r) => {
    const student = getStudentById(r.studentId);
    return r.level === "HIGH" && student?.campusId === campusId;
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={showcaseEntrance}
      className="mx-auto max-w-7xl"
    >
      <PageHeader
        eyebrow={`${campus?.name ?? "Campus"} · 2026 Placement Cycle`}
        title="Placement Command Center"
        subtitle="Live institutional intelligence across readiness, drives, outcomes and risk."
        actions={<DemoDataBadge />}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-8"
      >
        <motion.div variants={staggerItem}>
          <StatCard label="Total Students" value={a.totalStudents} icon={Users} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Placement Ready" value={a.placementReady} icon={ShieldCheck} accent="success" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="At Risk" value={a.atRisk} icon={ShieldAlert} accent="risk" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Active Drives" value={a.activeDrives} icon={Briefcase} accent="violet" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Applications" value={a.applications} icon={ClipboardList} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Offers" value={a.offersCount} icon={Award} accent="success" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Students Placed" value={a.studentsPlaced} icon={GraduationCap} accent="success" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            label="Placement Rate"
            value={a.placementRate}
            suffix="%"
            icon={TrendingUp}
            accent="violet"
          />
        </motion.div>
      </motion.div>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-3">
        <DataRevealItem className="lg:col-span-2">
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Placement Funnel</CardTitle>
              <DemoDataBadge />
            </div>
            <VerticalBarChart data={analytics.funnel} xKey="stage" yKey="count" height={260} />
          </DepthCard>
        </DataRevealItem>

        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-risk" />
              <CardTitle>Recent Alerts</CardTitle>
            </div>
            <div className="space-y-2.5">
              {analytics.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg border border-border p-2.5",
                    alert.severity === "HIGH" &&
                      "border-risk/30 shadow-[0_0_16px_-6px_hsl(var(--risk)/0.5)]",
                  )}
                >
                  <Badge variant={riskTone[alert.severity]} className="mt-0.5 shrink-0">
                    {alert.severity}
                  </Badge>
                  <p className="text-xs text-foreground">{alert.message}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/officer/risk" className="text-xs text-violet-bright hover:underline">
                View Risk Radar →
              </Link>
              <Link
                href="/officer/notifications"
                className="text-xs text-violet-bright hover:underline"
              >
                All notifications →
              </Link>
            </div>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Branch Readiness &amp; Placement Rate</CardTitle>
              <DemoDataBadge />
            </div>
            <HorizontalBarChart
              data={analytics.branchStats.map((b) => ({ label: b.branch, value: b.placementRate }))}
              xKey="value"
              yKey="label"
              colorByValue={branchColor}
              height={260}
            />
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Skill Demand</CardTitle>
              <DemoDataBadge />
            </div>
            <HorizontalBarChart
              data={skillDemand.map((s) => ({ label: s.skill, value: s.demandScore }))}
              xKey="value"
              yKey="label"
              height={260}
            />
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-3">
        <DataRevealItem>
          <DepthCard className="p-5">
            <CardTitle className="mb-3">Readiness Distribution</CardTitle>
            <VerticalBarChart
              data={analytics.readinessDistribution}
              xKey="band"
              yKey="count"
              height={220}
            />
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="flex h-full flex-col items-center p-5">
            <CardTitle className="mb-3 self-start">Risk Overview</CardTitle>
            <DonutChart
              data={analytics.riskDistribution.map((r) => ({ name: r.level, value: r.count }))}
              colors={["--success", "--warning", "--risk"]}
              centerValue={a.atRisk}
              centerLabel="At Risk"
            />
            <div className="mt-3 flex gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success" /> Low
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-warning" /> Medium
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-risk" /> High
              </span>
            </div>
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="p-5">
            <CardTitle className="mb-3">Offer Conversion</CardTitle>
            <VerticalBarChart
              data={analytics.offerPipeline}
              xKey="month"
              yKey="offers"
              height={220}
              colorVar="--success"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Average CTC <span className="font-medium text-foreground">{a.averageCtc}</span> ·
              Highest <span className="font-medium text-foreground">{a.highestCtc}</span>
            </p>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-violet-bright" />
                <CardTitle>Active Drives</CardTitle>
              </div>
              <Link
                href="/officer/drives"
                className="flex items-center gap-1 text-xs text-violet-bright hover:underline"
              >
                All drives <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {campusDrives.slice(0, 5).map((d) => (
                <Link
                  key={d.id}
                  href="/officer/drives"
                  className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5 transition-colors hover:border-violet/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.companyName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.role} · closes {d.deadline}
                    </p>
                  </div>
                  <Badge variant="muted" className="shrink-0">
                    {d.expectedHiring} hires
                  </Badge>
                </Link>
              ))}
              {campusDrives.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No active drives on this campus yet.
                </p>
              )}
            </div>
          </DepthCard>
        </DataRevealItem>

        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-risk" />
                <CardTitle>Highest-Risk Students</CardTitle>
              </div>
              <Link
                href="/officer/risk"
                className="flex items-center gap-1 text-xs text-violet-bright hover:underline"
              >
                Risk Radar <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {highRisk.slice(0, 5).map((r) => {
                const student = getStudentById(r.studentId);
                if (!student) return null;
                return (
                  <div
                    key={r.studentId}
                    className="flex items-center justify-between gap-2 rounded-lg border border-risk/30 bg-risk/5 p-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{student.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{r.primaryReason}</p>
                    </div>
                    <Badge variant="risk" className="shrink-0">
                      {student.readiness}
                    </Badge>
                  </div>
                );
              })}
              {highRisk.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No high-risk students tracked on this campus in the prototype dataset.
                </p>
              )}
            </div>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DataReveal>
        <DepthCard className="mt-5 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-risk" />
              <CardTitle>Upcoming Conflicts</CardTitle>
            </div>
            <Link
              href="/officer/orchestrator"
              className="flex items-center gap-1 text-xs text-violet-bright hover:underline"
            >
              Open Orchestrator <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <GlowLine tone="risk" className="mb-3" />
          {scheduleConflicts.map((c) => {
            const event = scheduleEvents.find((e) => e.id === c.eventId);
            return (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-risk/30 bg-risk/5 p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {event?.companyName} · {event?.date} {event?.time} · {event?.venue}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.studentOverlap} student overlaps · {c.venueIssue} · {c.panelIssue}
                  </p>
                </div>
                <Badge variant="risk">{c.severity} SEVERITY</Badge>
              </div>
            );
          })}
        </DepthCard>
      </DataReveal>
    </motion.div>
  );
}

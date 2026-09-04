"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fingerprint, Target, ListChecks, Briefcase, ClipboardList, ArrowUpRight, Gauge } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { primaryStudent } from "@/data/mock/students";
import { drives } from "@/data/mock/drives";
import { getApplicationsByStudent } from "@/data/mock/applications";
import { getMatch } from "@/data/mock/matches";

export function StudentDashboard() {
  const s = primaryStudent;
  const applications = getApplicationsByStudent(s.id);
  const trendData = s.readinessTrend.map((v, i) => ({ label: `W${i + 1}`, value: v }));

  const upcomingDrives = drives.slice(0, 3);

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mx-auto max-w-6xl">
      <motion.div variants={staggerItem}>
        <PageHeader
          eyebrow="Student Workspace"
          title="Good morning, Rahul."
          subtitle="Here's how your placement journey is progressing."
        />
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Placement Readiness" value={`${s.readiness}/100`} icon={Gauge} accent="violet" trend="+4 this week" />
        <StatCard label="Placement Probability" value={`${s.placementProbability}%`} icon={Target} accent="success" trend="+6 this week" />
        <StatCard label="Active Drives" value={s.activeDrives} icon={Briefcase} accent="violet" />
        <StatCard label="Applications" value={s.applicationsCount} icon={ClipboardList} accent="violet" />
      </motion.div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Digital twin summary */}
        <motion.div variants={staggerItem} className="lg:col-span-1">
          <Card className="h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-violet-bright" />
                <CardTitle>Placement Digital Twin</CardTitle>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <ScoreRing value={s.readiness} size={128} label="Readiness" sublabel="out of 100" />
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(s.breakdown).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-xs">
                  <span className="capitalize text-muted-foreground">{k}</span>
                  <span className="font-medium tabular-nums">{v}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link href="/student/digital-twin">
                View Digital Twin <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </Card>
        </motion.div>

        {/* Skill gaps + recommended actions */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card className="h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-violet-bright" />
                <CardTitle>Skill Gaps &amp; Recommended Actions</CardTitle>
              </div>
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href="/student/skill-gap">View all</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {s.skillGaps.slice(0, 4).map((g) => (
                <div key={g.skill} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{g.skill}</span>
                    <Badge variant={g.priority === "HIGH" ? "risk" : "warning"}>{g.priority}</Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{g.recommendedAction}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Readiness trend */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card className="p-5">
            <CardHeader className="p-0 pb-3">
              <CardTitle>Readiness Trend</CardTitle>
            </CardHeader>
            <TrendAreaChart data={trendData} dataKey="value" xKey="label" />
          </Card>
        </motion.div>

        {/* Upcoming drives */}
        <motion.div variants={staggerItem}>
          <Card className="h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-violet-bright" />
                <CardTitle>Upcoming Drives</CardTitle>
              </div>
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href="/student/drives">View all</Link>
              </Button>
            </div>
            <div className="mt-3 space-y-2.5">
              {upcomingDrives.map((d) => {
                const match = getMatch(s.id, d.id);
                return (
                  <Link
                    key={d.id}
                    href={`/student/drives/${d.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-2.5 transition-colors hover:border-violet/40 hover:bg-accent"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.companyName}</p>
                      <p className="truncate text-xs text-muted-foreground">{d.role}</p>
                    </div>
                    {match && <span className="shrink-0 text-xs font-semibold text-violet-bright">{match.overallFit}%</span>}
                  </Link>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Application progress */}
      <motion.div variants={staggerItem} className="mt-5">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-violet-bright" />
            <CardTitle>Application Progress</CardTitle>
          </div>
          <div className="mt-3 divide-y divide-border">
            {applications.map((a) => {
              const drive = drives.find((d) => d.id === a.driveId);
              if (!drive) return null;
              return (
                <div key={a.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium">{drive.companyName}</p>
                    <p className="text-xs text-muted-foreground">{drive.role}</p>
                  </div>
                  <Badge variant={a.status === "shortlisted" ? "success" : a.status === "applied" ? "default" : "muted"}>
                    {a.status.toUpperCase()}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

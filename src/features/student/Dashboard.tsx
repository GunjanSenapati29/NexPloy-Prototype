"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Fingerprint,
  Target,
  ListChecks,
  Briefcase,
  ClipboardList,
  ArrowUpRight,
  Gauge,
  CalendarClock,
  Award,
  ShieldCheck,
} from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { GlowLine } from "@/components/intelligence/GlowLine";
import { DataReveal } from "@/components/intelligence/DataReveal";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { primaryStudent } from "@/data/mock/students";
import { drives } from "@/data/mock/drives";
import { getApplicationsByStudent } from "@/data/mock/applications";
import { getMatch } from "@/data/mock/matches";
import { getInterviewsByStudent } from "@/data/mock/interviews";
import { getOffersByStudent } from "@/data/mock/offers";
import { evaluateEligibility } from "@/lib/eligibility";
import { applicationStatusLabel, applicationStatusTone, readinessBand } from "@/lib/status";

const DIMENSION_LABELS: Record<string, string> = {
  academic: "Academics",
  technical: "Technical",
  coding: "Coding",
  aptitude: "Aptitude",
  communication: "Communication",
  projects: "Projects",
  interview: "Interview",
  placementActivity: "Placement Activity",
};

export function StudentDashboard() {
  const s = primaryStudent;
  const applications = getApplicationsByStudent(s.id).filter((a) => a.status !== "eligible");
  const trendData = s.readinessTrend.map((v, i) => ({ label: `W${i + 1}`, value: v }));
  const band = readinessBand(s.readiness);

  const activeDrives = drives.filter((d) => d.status === "ACTIVE");
  const eligibleDrives = activeDrives.filter((d) => evaluateEligibility(s, d).eligible);
  const nextInterview = getInterviewsByStudent(s.id).find((i) => i.status === "SCHEDULED");
  const offers = getOffersByStudent(s.id);

  const topMatches = eligibleDrives
    .map((d) => ({ drive: d, match: getMatch(s.id, d.id)?.overallFit ?? 0 }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="mx-auto max-w-6xl"
    >
      <motion.div variants={staggerItem}>
        <PageHeader
          eyebrow="Student Workspace"
          title={`Good morning, ${s.name.split(" ")[0]}.`}
          subtitle="Here's how your placement journey is progressing."
          actions={<Badge variant={band.tone}>{band.label}</Badge>}
        />
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatCard
          label="Readiness"
          value={s.readiness}
          suffix="/100"
          icon={Gauge}
          accent="violet"
          trend="+4 this week"
        />
        <StatCard
          label="Placement Probability"
          value={s.placementProbability}
          suffix="%"
          icon={Target}
          accent="success"
          trend="+6 this week"
        />
        <StatCard label="Eligible Drives" value={eligibleDrives.length} icon={ShieldCheck} accent="violet" />
        <StatCard label="Applications" value={applications.length} icon={ClipboardList} />
        <StatCard label="Offers" value={offers.length} icon={Award} accent="success" />
        <StatCard label="Risk Level" value={s.riskLevel} accent={s.riskLevel === "LOW" ? "success" : "risk"} />
      </motion.div>

      {nextInterview && (
        <motion.div variants={staggerItem} className="mt-4">
          <DepthCard className="flex flex-wrap items-center justify-between gap-3 border-violet/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet/10">
                <CalendarClock className="h-4 w-4 text-violet-bright" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Next up: {nextInterview.companyName} — {nextInterview.round}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextInterview.date} at {nextInterview.time} · {nextInterview.venue}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/student/interview-prep">
                Prepare <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </DepthCard>
        </motion.div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Digital twin summary */}
        <motion.div variants={staggerItem} className="lg:col-span-1">
          <DepthCard className="h-full p-5">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-violet-bright" />
              <CardTitle>Placement Digital Twin</CardTitle>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <ScoreRing value={s.readiness} size={128} label="Readiness" sublabel="out of 100" />
            </div>
            <div className="mt-4 space-y-1.5">
              {Object.entries(s.breakdown).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{DIMENSION_LABELS[k] ?? k}</span>
                  <span className="font-medium tabular-nums">{v}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link href="/student/digital-twin">
                View Digital Twin <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </DepthCard>
        </motion.div>

        {/* Skill gaps + recommended actions */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <DepthCard className="h-full p-5">
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{g.skill}</span>
                    <Badge variant={g.priority === "HIGH" ? "risk" : "warning"}>{g.priority}</Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {g.currentLabel} → {g.targetLabel}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">{g.recommendedAction}</p>
                </div>
              ))}
            </div>
          </DepthCard>
        </motion.div>
      </div>

      {/* Readiness → Skill Gap → Opportunity signal line */}
      <motion.div variants={staggerItem} className="mt-4 flex items-center gap-3 px-1">
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Readiness
        </span>
        <GlowLine className="w-8" />
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Skill Gap
        </span>
        <GlowLine className="flex-1" />
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Opportunity
        </span>
      </motion.div>

      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        {/* Readiness trend */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <DepthCard className="p-5">
            <CardHeader className="p-0 pb-3">
              <CardTitle>Readiness Trend</CardTitle>
            </CardHeader>
            <DataReveal>
              <TrendAreaChart data={trendData} dataKey="value" xKey="label" />
            </DataReveal>
          </DepthCard>
        </motion.div>

        {/* Top matched drives */}
        <motion.div variants={staggerItem}>
          <DepthCard className="h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-violet-bright" />
                <CardTitle>Top Matches</CardTitle>
              </div>
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href="/student/drives">View all</Link>
              </Button>
            </div>
            <div className="mt-3 space-y-2.5">
              {topMatches.map(({ drive, match }) => (
                <Link
                  key={drive.id}
                  href={`/student/drives/${drive.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5 transition-colors hover:border-violet/40 hover:bg-accent"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{drive.companyName}</p>
                    <p className="truncate text-xs text-muted-foreground">{drive.role}</p>
                  </div>
                  {match > 0 && (
                    <span className="shrink-0 text-xs font-semibold text-violet-bright">
                      {match}%
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </DepthCard>
        </motion.div>
      </div>

      {/* Application progress */}
      <motion.div variants={staggerItem} className="mt-5">
        <DepthCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-violet-bright" />
              <CardTitle>Application Progress</CardTitle>
            </div>
            <Button asChild variant="link" size="sm" className="px-0">
              <Link href="/student/applications">View all</Link>
            </Button>
          </div>
          <div className="mt-3 divide-y divide-border">
            {applications.map((a) => {
              const drive = drives.find((d) => d.id === a.driveId);
              if (!drive) return null;
              return (
                <div key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{drive.companyName}</p>
                    <p className="truncate text-xs text-muted-foreground">{drive.role}</p>
                  </div>
                  <Badge variant={applicationStatusTone[a.status]}>
                    {applicationStatusLabel[a.status]}
                  </Badge>
                </div>
              );
            })}
          </div>
        </DepthCard>
      </motion.div>
    </motion.div>
  );
}

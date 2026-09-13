"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Landmark,
  Users,
  ShieldCheck,
  ShieldAlert,
  Award,
  Briefcase,
  Building2,
  TrendingUp,
  ArrowUpRight,
  Network,
} from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { staggerContainer, staggerItem, showcaseEntrance } from "@/lib/motion-variants";
import { campuses, instituteTotals, INSTITUTE_NAME } from "@/data/mock/campuses";
import { getCampusAnalytics } from "@/data/mock/analytics";
import { useAppStore } from "@/hooks/useAppStore";

export default function InstituteOverviewPage() {
  const activeCampusId = useAppStore((s) => s.activeCampusId);
  const setActiveCampusId = useAppStore((s) => s.setActiveCampusId);
  const activeCampus = campuses.find((c) => c.id === activeCampusId) ?? campuses[0];
  const activeAnalytics = getCampusAnalytics(activeCampus.id);

  const rateByCampus = campuses.map((c) => ({ label: c.name, value: c.placementRate }));
  const offersByCampus = campuses.map((c) => ({ campus: c.name, offers: c.offers }));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={showcaseEntrance}
      className="mx-auto max-w-7xl"
    >
      <PageHeader
        eyebrow="Super Admin"
        title="Institute Overview"
        subtitle={`${INSTITUTE_NAME} · ${campuses.length} campuses · 2026 placement cycle`}
        actions={<DemoDataBadge />}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7"
      >
        <motion.div variants={staggerItem}>
          <StatCard label="Campuses" value={campuses.length} icon={Network} accent="violet" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Total Students" value={instituteTotals.totalStudents} icon={Users} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            label="Placement Ready"
            value={instituteTotals.placementReady}
            icon={ShieldCheck}
            accent="success"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="At Risk" value={instituteTotals.atRisk} icon={ShieldAlert} accent="risk" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Offers" value={instituteTotals.offers} icon={Award} accent="success" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Active Drives" value={instituteTotals.activeDrives} icon={Briefcase} accent="violet" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Recruiters" value={instituteTotals.recruiters} icon={Building2} />
        </motion.div>
      </motion.div>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Placement Rate by Campus</CardTitle>
              <DemoDataBadge />
            </div>
            <HorizontalBarChart
              data={rateByCampus}
              xKey="value"
              yKey="label"
              height={220}
              colorByValue={(v) => (v >= 80 ? "142 71% 45%" : v >= 70 ? "262 83% 58%" : "38 92% 50%")}
            />
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Offers by Campus</CardTitle>
              <DemoDataBadge />
            </div>
            <VerticalBarChart
              data={offersByCampus}
              xKey="campus"
              yKey="offers"
              height={220}
              colorVar="--success"
            />
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <DataReveal stagger className="mt-5 grid gap-4 md:grid-cols-3">
        {campuses.map((c) => {
          const isActive = c.id === activeCampusId;
          return (
            <DataRevealItem key={c.id}>
              <DepthCard className={isActive ? "h-full border-violet/40 p-5 shadow-glow" : "h-full p-5"}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="truncate">{c.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{c.city}</p>
                  </div>
                  {isActive && <Badge variant="default">Active scope</Badge>}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Students</p>
                    <p className="text-sm font-semibold tabular-nums">
                      {c.totalStudents.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Placement Rate</p>
                    <p className="text-sm font-semibold tabular-nums text-violet-bright">
                      {c.placementRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Placed</p>
                    <p className="text-sm font-semibold tabular-nums">{c.placed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average CTC</p>
                    <p className="text-sm font-semibold tabular-nums">{c.averageCtc}</p>
                  </div>
                </div>
                <Button
                  variant={isActive ? "outline" : "glow"}
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => setActiveCampusId(c.id)}
                  disabled={isActive}
                >
                  {isActive ? "Currently selected" : `Switch to ${c.name}`}
                </Button>
              </DepthCard>
            </DataRevealItem>
          );
        })}
      </DataReveal>

      <DepthCard className="mt-5 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-violet-bright" />
            <CardTitle>{activeCampus.name} — Current Scope</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/analytics">
                Cross-campus analytics <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/officer">
                Open command center <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Students" value={activeAnalytics.snapshot.totalStudents} icon={Users} />
          <StatCard
            label="Placement Rate"
            value={activeAnalytics.snapshot.placementRate}
            suffix="%"
            icon={TrendingUp}
            accent="violet"
          />
          <StatCard label="Offers" value={activeAnalytics.snapshot.offersCount} icon={Award} accent="success" />
          <StatCard label="At Risk" value={activeAnalytics.snapshot.atRisk} icon={ShieldAlert} accent="risk" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Switching campus here — or from the campus selector in the top bar — changes every
          institutional metric across the Officer and Admin workspaces.
        </p>
      </DepthCard>
    </motion.div>
  );
}

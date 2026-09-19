"use client";

import Link from "next/link";
import { Network, Users, Award, ArrowUpRight, Building2, ShieldAlert } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { campuses, instituteTotals, INSTITUTE_NAME } from "@/data/mock/campuses";
import { students } from "@/data/mock/students";
import { drives } from "@/data/mock/drives";
import { mentors } from "@/data/mock/mentors";
import { useAppStore } from "@/hooks/useAppStore";

export default function CampusManagementPage() {
  const activeCampusId = useAppStore((s) => s.activeCampusId);
  const setActiveCampusId = useAppStore((s) => s.setActiveCampusId);
  const pushToast = useAppStore((s) => s.pushToast);

  const switchTo = (id: string, name: string) => {
    setActiveCampusId(id);
    pushToast("Campus scope changed", `Now showing ${name} demo metrics.`);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Campuses"
        title="Campus Management"
        subtitle={`${INSTITUTE_NAME} — every campus, its cohort and its placement operations.`}
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Campuses" value={campuses.length} icon={Network} accent="violet" />
        <StatCard label="Students" value={instituteTotals.totalStudents} icon={Users} />
        <StatCard label="Offers" value={instituteTotals.offers} icon={Award} accent="success" />
        <StatCard label="At Risk" value={instituteTotals.atRisk} icon={ShieldAlert} accent="risk" />
      </div>

      <DataReveal stagger className="mb-5 grid gap-4 md:grid-cols-3">
        {campuses.map((c) => {
          const isActive = c.id === activeCampusId;
          const tracked = students.filter((s) => s.campusId === c.id).length;
          const campusDrives = drives.filter((d) => d.campusId === c.id).length;
          const campusMentors = mentors.filter((m) => m.campusId === c.id).length;
          const readyPct = Math.round((c.placementReady / c.totalStudents) * 100);
          return (
            <DataRevealItem key={c.id}>
              <DepthCard className={isActive ? "h-full border-violet/40 p-5 shadow-glow" : "h-full p-5"}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="truncate">{c.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{c.city}</p>
                  </div>
                  {isActive && <Badge variant="default">Active</Badge>}
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Placement ready</span>
                    <span>{readyPct}%</span>
                  </div>
                  <Progress value={readyPct} />
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {c.totalStudents.toLocaleString()} students ·{" "}
                    {tracked} tracked in prototype
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> {campusDrives} drives · {c.recruiters}{" "}
                    recruiters
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" /> {c.offers} offers · avg {c.averageCtc}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Network className="h-3.5 w-3.5" /> {campusMentors} mentor
                    {campusMentors === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant={isActive ? "outline" : "glow"}
                    size="sm"
                    onClick={() => switchTo(c.id, c.name)}
                    disabled={isActive}
                  >
                    {isActive ? "Current scope" : "Switch campus"}
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/officer">
                      Operations <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </DepthCard>
            </DataRevealItem>
          );
        })}
      </DataReveal>

      <Card className="overflow-x-auto p-5">
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Campus Comparison</CardTitle>
          <DemoDataBadge />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campus</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Ready</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead>Placement Rate</TableHead>
              <TableHead>Average CTC</TableHead>
              <TableHead>Highest CTC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campuses.map((c) => (
              <TableRow key={c.id} className={c.id === activeCampusId ? "bg-violet/5" : undefined}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.city}</TableCell>
                <TableCell className="tabular-nums">{c.totalStudents.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums">{c.placementReady.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums">{c.placed.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums text-violet-bright">{c.placementRate}%</TableCell>
                <TableCell className="tabular-nums">{c.averageCtc}</TableCell>
                <TableCell className="tabular-nums">{c.highestCtc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

"use client";

import { BarChart3, Users, Target, Award, Percent } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { ACTIVE_RECRUITER_ID, activeRecruiter } from "@/data/mock/recruiters";
import { getDrivesByCompany } from "@/data/mock/drives";
import { getApplicationsByDrive } from "@/data/mock/applications";
import { getMatchesByDrive } from "@/data/mock/matches";
import { getInterviewsByDrive } from "@/data/mock/interviews";
import { getOffersByDrive } from "@/data/mock/offers";
import { students } from "@/data/mock/students";
import { evaluateEligibility } from "@/lib/eligibility";

export default function RecruiterAnalyticsPage() {
  const companyDrives = getDrivesByCompany(ACTIVE_RECRUITER_ID);

  const perDrive = companyDrives.map((d) => {
    const applications = getApplicationsByDrive(d.id);
    const matches = getMatchesByDrive(d.id);
    const interviews = getInterviewsByDrive(d.id);
    const offers = getOffersByDrive(d.id);
    const eligible = students.filter((s) => evaluateEligibility(s, d).eligible).length;
    return { drive: d, applications, matches, interviews, offers, eligible };
  });

  const totals = perDrive.reduce(
    (acc, p) => ({
      applications: acc.applications + p.applications.length,
      matches: acc.matches + p.matches.length,
      interviews: acc.interviews + p.interviews.length,
      offers: acc.offers + p.offers.length,
    }),
    { applications: 0, matches: 0, interviews: 0, offers: 0 },
  );

  const funnel = [
    { stage: "Eligible", count: perDrive.reduce((n, p) => n + p.eligible, 0) },
    { stage: "Applied", count: totals.applications },
    { stage: "Ranked", count: totals.matches },
    { stage: "Interviewed", count: totals.interviews },
    { stage: "Offered", count: totals.offers },
  ];

  const offerRate = totals.applications
    ? Math.round((totals.offers / totals.applications) * 100)
    : 0;

  /** Average fit per drive, so weak pools are visible at a glance. */
  const fitByDrive = perDrive
    .filter((p) => p.matches.length > 0)
    .map((p) => ({
      label: p.drive.role,
      value: Math.round(p.matches.reduce((n, m) => n + m.overallFit, 0) / p.matches.length),
    }));

  /** Which required skills the ranked pool actually covers. */
  const requiredSkills = Array.from(new Set(companyDrives.flatMap((d) => d.requiredSkills)));
  const rankedStudents = Array.from(
    new Set(perDrive.flatMap((p) => p.matches.map((m) => m.studentId))),
  )
    .map((id) => students.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const skillCoverage = requiredSkills.map((skill) => ({
    skill,
    coverage: rankedStudents.length
      ? Math.round(
          (rankedStudents.filter((s) =>
            s.strengths.some((st) => st.toLowerCase().includes(skill.toLowerCase())),
          ).length /
            rankedStudents.length) *
            100,
        )
      : 0,
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Intelligence"
        title="Recruiter Analytics"
        subtitle={`How ${activeRecruiter.companyName}'s hiring is converting at this institute.`}
        actions={<DemoDataBadge />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Applicants" value={totals.applications} icon={Users} />
        <StatCard label="Ranked" value={totals.matches} icon={Target} accent="violet" />
        <StatCard label="Interviews" value={totals.interviews} accent="warning" />
        <StatCard label="Offers" value={totals.offers} icon={Award} accent="success" />
        <StatCard label="Offer Rate" value={offerRate} suffix="%" icon={Percent} accent="success" />
      </div>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-violet-bright" />
                <CardTitle>Hiring Funnel</CardTitle>
              </div>
              <DemoDataBadge />
            </div>
            <VerticalBarChart data={funnel} xKey="stage" yKey="count" height={260} />
          </DepthCard>
        </DataRevealItem>
        <DataRevealItem>
          <DepthCard className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Average Fit by Role</CardTitle>
              <DemoDataBadge />
            </div>
            {fitByDrive.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No ranked pools yet.
              </p>
            ) : (
              <HorizontalBarChart data={fitByDrive} xKey="value" yKey="label" height={260} />
            )}
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <Card className="mt-5 p-5">
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>Skill Coverage in Your Ranked Pool</CardTitle>
          <DemoDataBadge />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {skillCoverage.map((s) => (
            <SkillBar
              key={s.skill}
              label={s.skill}
              value={s.coverage}
              colorClass={
                s.coverage >= 60 ? "bg-success" : s.coverage >= 30 ? "bg-warning" : "bg-risk"
              }
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Percentage of your ranked candidates who list each required skill as a strength. Low
          coverage is the signal to widen the eligibility criteria or brief the placement office.
        </p>
      </Card>

      <Card className="mt-5 overflow-x-auto p-5">
        <CardTitle className="mb-3">Drive Performance</CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Eligible</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Ranked</TableHead>
              <TableHead>Interviews</TableHead>
              <TableHead>Offers</TableHead>
              <TableHead>Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perDrive.map((p) => (
              <TableRow key={p.drive.id}>
                <TableCell className="font-medium">{p.drive.role}</TableCell>
                <TableCell>
                  <Badge variant={p.drive.status === "ACTIVE" ? "success" : "muted"}>
                    {p.drive.status}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">{p.eligible}</TableCell>
                <TableCell className="tabular-nums">{p.applications.length}</TableCell>
                <TableCell className="tabular-nums">{p.matches.length}</TableCell>
                <TableCell className="tabular-nums">{p.interviews.length}</TableCell>
                <TableCell className="tabular-nums text-success">{p.offers.length}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {p.drive.expectedHiring}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

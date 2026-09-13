"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  ListChecks,
  Award,
  CalendarCheck,
  Trophy,
  ArrowUpRight,
  Briefcase,
  Target,
} from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { ACTIVE_RECRUITER_ID, activeRecruiter } from "@/data/mock/recruiters";
import { getDrivesByCompany, FEATURED_DRIVE_ID, getDriveById } from "@/data/mock/drives";
import { getApplicationsByDrive } from "@/data/mock/applications";
import { getMatchesByDrive } from "@/data/mock/matches";
import { getStudentById } from "@/data/mock/students";
import { getInterviewsByDrive } from "@/data/mock/interviews";
import { getOffersByDrive } from "@/data/mock/offers";
import { useAppStore } from "@/hooks/useAppStore";
import { driveStatusTone } from "@/lib/status";

export default function RecruiterDashboard() {
  const shortlisted = useAppStore((s) => s.shortlisted);
  const drive = getDriveById(FEATURED_DRIVE_ID)!;
  const companyDrives = getDrivesByCompany(ACTIVE_RECRUITER_ID);
  const applications = getApplicationsByDrive(drive.id);
  const matches = getMatchesByDrive(drive.id);
  const interviews = getInterviewsByDrive(drive.id);
  const offers = getOffersByDrive(drive.id);

  const shortlistedCount =
    applications.filter((a) =>
      ["shortlisted", "assessment", "interview", "selected", "offer", "joined"].includes(a.status),
    ).length + shortlisted.filter((id) => !applications.some((a) => a.studentId === id)).length;

  const selected = applications.filter((a) =>
    ["selected", "offer", "joined"].includes(a.status),
  ).length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="mx-auto max-w-6xl"
    >
      <motion.div variants={staggerItem}>
        <PageHeader
          eyebrow={`${activeRecruiter.companyName} · ${activeRecruiter.industry}`}
          title="Recruiter Dashboard"
          subtitle={`${drive.role} · ${drive.location} · ${drive.package} · ${drive.expectedHiring} expected hires`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <DemoDataBadge />
              <Button asChild variant="glow">
                <Link href="/recruiter/candidates">
                  Open Candidate Pool <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatCard label="Applicants" value={applications.length} icon={Users} />
        <StatCard label="Ranked Candidates" value={matches.length} icon={Target} accent="violet" />
        <StatCard label="Shortlisted" value={shortlistedCount} icon={ListChecks} accent="success" />
        <StatCard label="Interviews" value={interviews.length} icon={CalendarCheck} accent="warning" />
        <StatCard label="Selected" value={selected} icon={Trophy} accent="success" />
        <StatCard label="Offers" value={offers.length} icon={Award} accent="success" />
      </motion.div>

      <DataReveal stagger className="mt-5 grid gap-5 lg:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-violet-bright" />
                <CardTitle>Top Ranked Candidates</CardTitle>
              </div>
              <Link href="/recruiter/candidates" className="text-xs text-violet-bright hover:underline">
                View pool →
              </Link>
            </div>
            <div className="space-y-2.5">
              {matches.slice(0, 5).map((m, i) => {
                const student = getStudentById(m.studentId);
                if (!student) return null;
                return (
                  <Link
                    key={m.id}
                    href={`/recruiter/candidates/${student.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-2.5 transition-colors hover:border-violet/40"
                  >
                    <span className="w-4 shrink-0 text-xs tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px]">
                        {student.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{student.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {student.branchCode} · CGPA {student.cgpa.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {shortlisted.includes(student.id) && (
                        <Badge variant="success">Shortlisted</Badge>
                      )}
                      <span className="text-sm font-semibold text-violet-bright">
                        {m.overallFit}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </DepthCard>
        </DataRevealItem>

        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-violet-bright" />
                <CardTitle>Your Drives</CardTitle>
              </div>
              <Link href="/recruiter/drives" className="text-xs text-violet-bright hover:underline">
                All drives →
              </Link>
            </div>
            <div className="space-y-2.5">
              {companyDrives.map((d) => (
                <Link
                  key={d.id}
                  href="/recruiter/drives"
                  className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5 transition-colors hover:border-violet/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.role}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.location} · {d.package} · closes {d.deadline}
                    </p>
                  </div>
                  <Badge variant={driveStatusTone[d.status]} className="shrink-0">
                    {d.status}
                  </Badge>
                </Link>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-violet/30 bg-violet/5 p-3 text-xs text-muted-foreground">
              <span className="font-medium text-violet-bright">
                {activeRecruiter.studentsHired} students hired
              </span>{" "}
              from this institute since {activeRecruiter.hiringSince}.
            </div>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>
    </motion.div>
  );
}

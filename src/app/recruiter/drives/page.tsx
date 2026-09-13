import Link from "next/link";
import {
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { CandidateTable } from "@/components/recruiter/CandidateTable";
import { ACTIVE_RECRUITER_ID, activeRecruiter } from "@/data/mock/recruiters";
import { getDrivesByCompany, FEATURED_DRIVE_ID, getDriveById } from "@/data/mock/drives";
import { getApplicationsByDrive } from "@/data/mock/applications";
import { getMatchesByDrive } from "@/data/mock/matches";
import { students } from "@/data/mock/students";
import { evaluateEligibility } from "@/lib/eligibility";
import { driveStatusTone } from "@/lib/status";

export default function RecruiterDrivesPage() {
  const companyDrives = getDrivesByCompany(ACTIVE_RECRUITER_ID);
  const featured = getDriveById(FEATURED_DRIVE_ID)!;
  const featuredApplications = getApplicationsByDrive(featured.id);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Hiring"
        title="Placement Drives"
        subtitle={`${activeRecruiter.companyName} drives at this institute, with their published eligibility criteria.`}
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Drives" value={companyDrives.length} icon={Building2} accent="violet" />
        <StatCard
          label="Active"
          value={companyDrives.filter((d) => d.status === "ACTIVE").length}
          accent="success"
        />
        <StatCard
          label="Expected Hires"
          value={companyDrives
            .filter((d) => d.status === "ACTIVE")
            .reduce((n, d) => n + d.expectedHiring, 0)}
          icon={Users}
        />
        <StatCard
          label="Ranked Candidates"
          value={companyDrives.reduce((n, d) => n + getMatchesByDrive(d.id).length, 0)}
          icon={Target}
          accent="violet"
        />
      </div>

      <DataReveal stagger className="mb-5 grid gap-4 md:grid-cols-2">
        {companyDrives.map((d) => {
          const applications = getApplicationsByDrive(d.id);
          const eligible = students.filter((s) => evaluateEligibility(s, d).eligible).length;
          return (
            <DataRevealItem key={d.id}>
              <DepthCard className="h-full p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-base font-bold text-violet-bright">
                      {d.logoInitial}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="truncate">{d.role}</CardTitle>
                      <p className="truncate text-xs text-muted-foreground">{d.driveType}</p>
                    </div>
                  </div>
                  <Badge variant={driveStatusTone[d.status]}>{d.status}</Badge>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">{d.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {d.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5" /> {d.package}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {d.driveDate}, {d.driveTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {applications.length} applicants
                  </span>
                </div>

                <div className="mt-3 rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Eligibility Criteria
                    </p>
                    <Badge variant="muted" className="gap-1">
                      <ShieldCheck className="h-3 w-3" /> {eligible} qualify
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Minimum CGPA{" "}
                    <span className="font-medium text-foreground">{d.criteria.minCgpa}</span> ·
                    Branches{" "}
                    <span className="font-medium text-foreground">
                      {d.criteria.allowedBranches.join(", ")}
                    </span>{" "}
                    · Max backlogs{" "}
                    <span className="font-medium text-foreground">{d.criteria.maxBacklogs}</span> ·
                    Batch{" "}
                    <span className="font-medium text-foreground">{d.criteria.graduationYear}</span>
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.requiredSkills.map((s) => (
                    <Badge key={s} variant="muted">
                      {s}
                    </Badge>
                  ))}
                </div>

                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/recruiter/candidates">
                    View candidate pool <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </DepthCard>
            </DataRevealItem>
          );
        })}
      </DataReveal>

      <Card className="overflow-x-auto p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-violet-bright" />
            <CardTitle>
              {featured.role} — Ranked Candidates ({featuredApplications.length} applicants)
            </CardTitle>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/recruiter/candidates">
              Bulk shortlist <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <CandidateTable driveId={featured.id} />
      </Card>
    </div>
  );
}

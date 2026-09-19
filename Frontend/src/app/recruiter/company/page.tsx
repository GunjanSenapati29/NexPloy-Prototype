import {
  Building2,
  Globe,
  MapPin,
  Users,
  CalendarRange,
  Trophy,
  Briefcase,
  Target,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { activeRecruiter, ACTIVE_RECRUITER_ID } from "@/data/mock/recruiters";
import { getDrivesByCompany } from "@/data/mock/drives";
import { getApplicationsByDrive } from "@/data/mock/applications";
import { getOffersByDrive } from "@/data/mock/offers";
import { getCampusById } from "@/data/mock/campuses";
import { driveStatusTone } from "@/lib/status";

export default function CompanyProfilePage() {
  const company = activeRecruiter;
  const companyDrives = getDrivesByCompany(ACTIVE_RECRUITER_ID);
  const totalApplicants = companyDrives.reduce(
    (n, d) => n + getApplicationsByDrive(d.id).length,
    0,
  );
  const totalOffers = companyDrives.reduce((n, d) => n + getOffersByDrive(d.id).length, 0);
  const expectedHires = companyDrives
    .filter((d) => d.status === "ACTIVE")
    .reduce((n, d) => n + d.expectedHiring, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Company"
        title="Company Profile"
        subtitle="How your organisation appears to students and the placement office."
        actions={<DemoDataBadge />}
      />

      <DepthCard className="mb-5 p-5" tilt>
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-2xl font-bold text-violet-bright">
            {company.logoInitial}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{company.companyName}</h2>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{company.aboutText}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {company.hqLocation}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> {company.employees} employees
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> {company.website}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarRange className="h-3.5 w-3.5" /> Hiring since {company.hiringSince}
              </span>
            </div>
          </div>
        </div>
      </DepthCard>

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Drives" value={companyDrives.length} icon={Briefcase} accent="violet" />
        <StatCard label="Applicants" value={totalApplicants} icon={Users} />
        <StatCard label="Offers Made" value={totalOffers} icon={Trophy} accent="success" />
        <StatCard label="Students Hired" value={company.studentsHired} accent="success" />
      </div>

      <DataReveal stagger className="grid gap-5 md:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-violet-bright" />
              <CardTitle>Drives &amp; Eligibility</CardTitle>
            </div>
            <div className="space-y-3">
              {companyDrives.map((d) => {
                const campus = getCampusById(d.campusId);
                return (
                  <div key={d.id} className="rounded-lg border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{d.role}</p>
                      <Badge variant={driveStatusTone[d.status]}>{d.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {d.driveType} · {campus?.name} · {d.package}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      CGPA {d.criteria.minCgpa}+ · {d.criteria.allowedBranches.join("/")} · max{" "}
                      {d.criteria.maxBacklogs} backlog{d.criteria.maxBacklogs === 1 ? "" : "s"} ·{" "}
                      {d.criteria.graduationYear} batch
                    </p>
                  </div>
                );
              })}
            </div>
          </DepthCard>
        </DataRevealItem>

        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-bright" />
              <CardTitle>What You Hire For</CardTitle>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Skills across your open roles
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set(companyDrives.flatMap((d) => d.requiredSkills))).map((s) => (
                <Badge key={s} variant="muted">
                  {s}
                </Badge>
              ))}
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selection process
            </p>
            <div className="space-y-2">
              {companyDrives[0]?.rounds.map((r, i) => (
                <div key={r.name} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet/15 text-[10px] font-semibold text-violet-bright">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-violet/30 bg-violet/5 p-3 text-xs text-muted-foreground">
              <span className="font-medium text-violet-bright">{expectedHires} hires</span> planned
              across your active drives this cycle.
            </div>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>

      <Card className="mt-5 p-5">
        <CardTitle className="mb-2">Prototype note</CardTitle>
        <p className="text-sm text-muted-foreground">
          <Building2 className="mr-1 inline h-3.5 w-3.5" />
          Company details are demo data. In production this profile would be maintained by the
          recruiter and reviewed by the placement office before drives are published.
        </p>
      </Card>
    </div>
  );
}

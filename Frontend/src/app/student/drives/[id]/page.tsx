import { notFound } from "next/navigation";
import {
  MapPin,
  IndianRupee,
  Calendar,
  ListChecks,
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { MatchBreakdownBars } from "@/components/intelligence/MatchBreakdown";
import { JourneyTimeline } from "@/components/intelligence/JourneyTimeline";
import { EligibilityChecklist } from "@/components/intelligence/EligibilityChecklist";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { AnimatedMetric } from "@/components/intelligence/AnimatedMetric";
import { drives, getDriveById } from "@/data/mock/drives";
import { getApplication } from "@/data/mock/applications";
import { getMatch } from "@/data/mock/matches";
import { primaryStudent } from "@/data/mock/students";
import { evaluateEligibility } from "@/lib/eligibility";
import { applicationStageIndex, applicationStatusLabel, driveStatusTone } from "@/lib/status";

export function generateStaticParams() {
  return drives.map((d) => ({ id: d.id }));
}

export default function DriveDetailPage({ params }: { params: { id: string } }) {
  const drive = getDriveById(params.id);
  if (!drive) notFound();

  const student = primaryStudent;
  const app = getApplication(student.id, drive.id);
  const journeyIndex = app ? applicationStageIndex[app.status] : -1;
  const match = getMatch(student.id, drive.id);
  const eligibility = evaluateEligibility(student, drive);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow={`${drive.companyName} · ${drive.driveType}`}
        title={drive.role}
        subtitle={drive.description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={driveStatusTone[drive.status]}>{drive.status}</Badge>
            <Badge variant={eligibility.eligible ? "success" : "risk"} className="gap-1">
              {eligibility.eligible ? (
                <ShieldCheck className="h-3 w-3" />
              ) : (
                <ShieldX className="h-3 w-3" />
              )}
              {eligibility.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
            </Badge>
          </div>
        }
      />

      <DepthCard className="mb-5 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Placement Journey</CardTitle>
          {app && <Badge variant="muted">{applicationStatusLabel[app.status]}</Badge>}
        </div>
        <JourneyTimeline currentIndex={journeyIndex} halted={app?.status === "rejected"} />
      </DepthCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <DepthCard className="p-5">
            <CardTitle className="mb-3">Drive Details</CardTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" /> {drive.driveType} · {drive.venue}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> {drive.location}
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-3.5 w-3.5" /> {drive.package}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> {drive.expectedHiring} expected hires
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Drive on {drive.driveDate} at {drive.driveTime}{" "}
                · Apply by {drive.deadline}
              </div>
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Required Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {drive.requiredSkills.map((s) => (
                <Badge key={s} variant="muted">
                  {s}
                </Badge>
              ))}
            </div>
          </DepthCard>

          <DepthCard className="p-5">
            <div className="mb-1 flex items-center justify-between">
              <CardTitle>Eligibility Check</CardTitle>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Minimum CGPA {drive.criteria.minCgpa} · Branches{" "}
              {drive.criteria.allowedBranches.join(", ")} · Max {drive.criteria.maxBacklogs} active
              backlog{drive.criteria.maxBacklogs === 1 ? "" : "s"} · {drive.criteria.graduationYear}{" "}
              batch
            </p>
            <EligibilityChecklist student={student} drive={drive} />
          </DepthCard>

          <DepthCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-violet-bright" />
              <CardTitle>Selection Rounds</CardTitle>
            </div>
            <div className="space-y-2.5">
              {drive.rounds.map((r, i) => (
                <div key={r.name} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/15 text-[11px] font-semibold text-violet-bright">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </DepthCard>
        </div>

        {match ? (
          <div className="space-y-5">
            <DepthCard className="p-5">
              <div className="flex items-center justify-between">
                <CardTitle>Matching Breakdown</CardTitle>
                <span className="text-2xl font-semibold tabular-nums text-violet-bright">
                  <AnimatedMetric value={match.overallFit} suffix="%" />
                </span>
              </div>
              <p className="demo-data-label mb-4 mt-1">Mocked prototype intelligence</p>
              <MatchBreakdownBars breakdown={match.breakdown} />
            </DepthCard>

            <DepthCard className="p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">
                Why You Match
              </p>
              <ul className="mb-4 space-y-1.5">
                {match.whySelected.map((w) => (
                  <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {w}
                  </li>
                ))}
              </ul>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-risk">
                Missing Skills
              </p>
              <ul className="mb-4 space-y-1.5">
                {match.weakOrMissing.map((w) => (
                  <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk" /> {w}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg border border-violet/30 bg-violet/5 p-3">
                <p className="text-xs font-semibold text-violet-bright">Recommendation</p>
                <p className="mt-1 text-xs text-muted-foreground">{match.recommendation}</p>
              </div>
            </DepthCard>
          </div>
        ) : (
          <DepthCard className="flex h-fit flex-col items-center justify-center p-8 text-center">
            <p className="text-sm font-medium">No match analysis yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              A match breakdown is generated once you apply to this drive.
            </p>
          </DepthCard>
        )}
      </div>
    </div>
  );
}

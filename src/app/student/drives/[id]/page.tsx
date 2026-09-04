import { notFound } from "next/navigation";
import { MapPin, IndianRupee, Calendar, ListChecks, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { MatchBreakdownBars } from "@/components/intelligence/MatchBreakdown";
import { JourneyTimeline } from "@/components/intelligence/JourneyTimeline";
import { drives, getDriveById } from "@/data/mock/drives";
import { getApplicationsByStudent } from "@/data/mock/applications";
import { getMatch } from "@/data/mock/matches";
import { primaryStudent } from "@/data/mock/students";
import type { ApplicationStatus } from "@/types";

const statusToIndex: Record<ApplicationStatus, number> = {
  eligible: 2,
  applied: 3,
  shortlisted: 4,
  interview: 5,
  offer: 6,
  joined: 7,
  rejected: 2,
};

export function generateStaticParams() {
  return drives.map((d) => ({ id: d.id }));
}

export default function DriveDetailPage({ params }: { params: { id: string } }) {
  const drive = getDriveById(params.id);
  if (!drive) notFound();

  const applications = getApplicationsByStudent(primaryStudent.id);
  const app = applications.find((a) => a.driveId === drive.id);
  const journeyIndex = app ? statusToIndex[app.status] : 2;
  const match = getMatch(primaryStudent.id, drive.id);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow={drive.companyName}
        title={drive.role}
        subtitle={drive.description}
        actions={<Badge variant={drive.eligibilityResult === "ELIGIBLE" ? "success" : "risk"}>{drive.eligibilityResult}</Badge>}
      />

      <Card className="mb-5 p-5">
        <CardTitle className="mb-3">Placement Journey</CardTitle>
        <JourneyTimeline currentIndex={journeyIndex} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Card className="p-5">
            <CardTitle className="mb-3">Role Details</CardTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> {drive.location}
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-3.5 w-3.5" /> {drive.package}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Drive on {drive.driveDate} at {drive.driveTime} · Apply by {drive.deadline}
              </div>
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {drive.requiredSkills.map((s) => (
                <Badge key={s} variant="muted">
                  {s}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <CardTitle className="mb-3">Eligibility Checklist</CardTitle>
            <div className="space-y-2">
              {drive.eligibility.map((e) => (
                <div key={e.label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{e.label}</p>
                    <p className="text-xs text-muted-foreground">{e.detail}</p>
                  </div>
                  {e.passed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-risk" />}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-elevated px-3 py-2.5">
              <span className="text-sm font-medium">Overall Result</span>
              <Badge variant={drive.eligibilityResult === "ELIGIBLE" ? "success" : "risk"}>{drive.eligibilityResult}</Badge>
            </div>
          </Card>

          <Card className="p-5">
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
          </Card>
        </div>

        {match && (
          <div className="space-y-5">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <CardTitle>Matching Breakdown</CardTitle>
                <span className="text-2xl font-semibold text-violet-bright tabular-nums">{match.overallFit}%</span>
              </div>
              <p className="mb-4 mt-1 demo-data-label">Mocked prototype intelligence</p>
              <MatchBreakdownBars breakdown={match.breakdown} />
            </Card>

            <Card className="p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">Why You Match</p>
              <ul className="mb-4 space-y-1.5">
                {match.whySelected.map((w) => (
                  <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {w}
                  </li>
                ))}
              </ul>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-risk">Missing Skills</p>
              <ul className="mb-4 space-y-1.5">
                {match.weakOrMissing.map((w) => (
                  <li key={w} className="flex gap-2 text-sm text-muted-foreground">
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk" /> {w}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg border border-violet/30 bg-violet/5 p-3">
                <p className="text-xs font-semibold text-violet-bright">Recommended Action</p>
                <p className="mt-1 text-xs text-muted-foreground">{match.recommendation}</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

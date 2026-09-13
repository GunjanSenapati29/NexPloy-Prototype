import Link from "next/link";
import { ArrowUpRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { JourneyTimeline } from "@/components/intelligence/JourneyTimeline";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { getApplicationsByStudent } from "@/data/mock/applications";
import { getDriveById } from "@/data/mock/drives";
import { primaryStudent } from "@/data/mock/students";
import { applicationStageIndex, applicationStatusLabel, applicationStatusTone } from "@/lib/status";

export default function ApplicationsPage() {
  const applications = getApplicationsByStudent(primaryStudent.id).filter(
    (a) => a.status !== "eligible",
  );

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Opportunities"
        title="Applications"
        subtitle="Track where each application stands across the full placement lifecycle."
      />

      {applications.length === 0 ? (
        <Card className="flex flex-col items-center p-12 text-center">
          <Inbox className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No applications yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Apply to an eligible drive and it will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((a) => {
            const drive = getDriveById(a.driveId);
            if (!drive) return null;
            return (
              <DepthCard key={a.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {drive.companyName}{" "}
                      <span className="font-normal text-muted-foreground">· {drive.role}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.appliedOn ? `Applied on ${a.appliedOn}` : "Not yet applied"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={applicationStatusTone[a.status]}>
                      {applicationStatusLabel[a.status]}
                    </Badge>
                    <Link
                      href={`/student/drives/${drive.id}`}
                      className="text-violet-bright"
                      aria-label={`Open ${drive.companyName} drive`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <JourneyTimeline
                    currentIndex={applicationStageIndex[a.status]}
                    halted={a.status === "rejected"}
                  />
                </div>
              </DepthCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { JourneyTimeline } from "@/components/intelligence/JourneyTimeline";
import { getApplicationsByStudent } from "@/data/mock/applications";
import { getDriveById } from "@/data/mock/drives";
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

export default function ApplicationsPage() {
  const applications = getApplicationsByStudent(primaryStudent.id);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Opportunities" title="Applications" subtitle="Track where each application stands in the placement journey." />

      <div className="space-y-4">
        {applications.map((a) => {
          const drive = getDriveById(a.driveId);
          if (!drive) return null;
          return (
            <Card key={a.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">
                    {drive.companyName} <span className="font-normal text-muted-foreground">· {drive.role}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.appliedOn ? `Applied on ${a.appliedOn}` : "Not yet applied"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{a.status.toUpperCase()}</Badge>
                  <Link href={`/student/drives/${drive.id}`} className="text-violet-bright">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="mt-4">
                <JourneyTimeline currentIndex={statusToIndex[a.status]} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

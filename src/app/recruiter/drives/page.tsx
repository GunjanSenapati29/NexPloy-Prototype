import { Building2, MapPin, IndianRupee, Calendar, Users } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { CandidateTable } from "@/components/recruiter/CandidateTable";
import { getDriveById } from "@/data/mock/drives";
import { getApplicationsByDrive } from "@/data/mock/applications";

const DRIVE_ID = "drv_technova";

export default function RecruiterDrivesPage() {
  const drive = getDriveById(DRIVE_ID)!;
  const applications = getApplicationsByDrive(DRIVE_ID);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Hiring" title="Placement Drives" subtitle="Your active drive and its full candidate pipeline." />

      <Card className="mb-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet/10 text-base font-bold text-violet-bright">
              {drive.logoInitial}
            </div>
            <div>
              <CardTitle className="text-base">
                {drive.companyName} — {drive.role}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{drive.description}</p>
            </div>
          </div>
          <Badge variant="default">
            <Users className="mr-1 h-3 w-3" /> {applications.length} Applicants
          </Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {drive.location}
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5" /> {drive.package}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Drive on {drive.driveDate}, {drive.driveTime}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {drive.requiredSkills.map((s) => (
            <Badge key={s} variant="muted">
              {s}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-violet-bright" />
          <CardTitle>Ranked Candidates</CardTitle>
        </div>
        <CandidateTable driveId={DRIVE_ID} />
      </Card>
    </div>
  );
}

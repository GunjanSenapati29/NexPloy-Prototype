import Link from "next/link";
import { Users, ListChecks, Award, CalendarCheck, Trophy } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { CandidateTable } from "@/components/recruiter/CandidateTable";
import { getDriveById } from "@/data/mock/drives";
import { getApplicationsByDrive } from "@/data/mock/applications";

const DRIVE_ID = "drv_technova";

export default function RecruiterDashboard() {
  const drive = getDriveById(DRIVE_ID)!;
  const applications = getApplicationsByDrive(DRIVE_ID);

  const applicants = applications.length;
  const eligible = applications.length;
  const shortlisted = applications.filter((a) => ["shortlisted", "interview", "offer", "joined"].includes(a.status)).length;
  const interviewed = applications.filter((a) => ["interview", "offer", "joined"].includes(a.status)).length;
  const selected = applications.filter((a) => ["offer", "joined"].includes(a.status)).length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow={drive.companyName}
        title="Recruiter Dashboard"
        subtitle={`${drive.role} · ${drive.location} · ${drive.package}`}
        actions={
          <Button asChild variant="glow">
            <Link href="/recruiter/drives">View Full Drive</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Applicants" value={applicants} icon={Users} />
        <StatCard label="Eligible" value={eligible} icon={ListChecks} accent="success" />
        <StatCard label="Shortlisted" value={shortlisted} icon={CalendarCheck} accent="violet" />
        <StatCard label="Interviewed" value={interviewed} icon={CalendarCheck} accent="warning" />
        <StatCard label="Selected" value={selected} icon={Trophy} accent="success" />
      </div>

      <Card className="mt-5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-violet-bright" />
          <CardTitle>Top Ranked Candidates</CardTitle>
        </div>
        <CandidateTable driveId={DRIVE_ID} />
      </Card>
    </div>
  );
}

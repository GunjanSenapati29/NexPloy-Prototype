import { MapPin, IndianRupee, Calendar, Users } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { drives } from "@/data/mock/drives";
import { getApplicationsByDrive } from "@/data/mock/applications";
import { getConflictByEvent, scheduleEvents } from "@/data/mock/schedules";

export default function OfficerDrivesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Drives" title="Placement Drives" subtitle="Every active drive this cycle, across all recruiters." actions={<DemoDataBadge />} />

      <div className="grid gap-4 sm:grid-cols-2">
        {drives.map((d) => {
          const applications = getApplicationsByDrive(d.id);
          const event = scheduleEvents.find((e) => e.driveId === d.id);
          const conflict = event ? getConflictByEvent(event.id) : undefined;
          return (
            <Card key={d.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-sm font-bold text-violet-bright">
                    {d.logoInitial}
                  </div>
                  <div>
                    <CardTitle>{d.companyName}</CardTitle>
                    <p className="text-xs text-muted-foreground">{d.role}</p>
                  </div>
                </div>
                {conflict && <Badge variant="risk">Conflict</Badge>}
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {d.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5" /> {d.package}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {d.driveDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {applications.length} applicants
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.requiredSkills.slice(0, 5).map((s) => (
                  <Badge key={s} variant="muted">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

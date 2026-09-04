import Link from "next/link";
import { Building2, MapPin, IndianRupee, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Drive, ApplicationStatus } from "@/types";

const statusVariant: Record<ApplicationStatus, "success" | "default" | "warning" | "muted" | "risk"> = {
  eligible: "success",
  applied: "default",
  shortlisted: "default",
  interview: "warning",
  offer: "success",
  joined: "success",
  rejected: "risk",
};

export function DriveCard({ drive, matchPct, status }: { drive: Drive; matchPct?: number; status?: ApplicationStatus }) {
  return (
    <Link href={`/student/drives/${drive.id}`}>
      <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-violet/40 hover:shadow-glow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-sm font-bold text-violet-bright">
              {drive.logoInitial}
            </div>
            <div>
              <p className="text-sm font-semibold">{drive.companyName}</p>
              <p className="text-xs text-muted-foreground">{drive.role}</p>
            </div>
          </div>
          {matchPct !== undefined && <span className="text-lg font-semibold text-violet-bright tabular-nums">{matchPct}%</span>}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {drive.requiredSkills.slice(0, 4).map((s) => (
            <Badge key={s} variant="muted">
              {s}
            </Badge>
          ))}
        </div>

        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> {drive.location}
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-3 w-3" /> {drive.package}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> Deadline {drive.deadline}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {status ? (
            <Badge variant={statusVariant[status]}>{status.toUpperCase()}</Badge>
          ) : (
            <Badge variant={drive.eligibilityResult === "ELIGIBLE" ? "success" : "risk"}>{drive.eligibilityResult}</Badge>
          )}
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </Card>
    </Link>
  );
}

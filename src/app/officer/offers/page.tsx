import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { offers } from "@/data/mock/offers";
import { getStudentById } from "@/data/mock/students";
import { analyticsSnapshot } from "@/data/mock/analytics";

export default function OfficerOffersPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="Outcomes" title="Offers" subtitle="Every offer generated across this placement cycle." actions={<DemoDataBadge />} />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Offers" value={analyticsSnapshot.offersCount} icon={Award} accent="success" />
        <StatCard label="Placement Rate" value={`${analyticsSnapshot.placementRate}%`} accent="violet" />
        <StatCard label="Recorded in Prototype" value={offers.length} accent="violet" />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((o) => {
              const s = getStudentById(o.studentId);
              return (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">{s?.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{s?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{o.companyName}</TableCell>
                  <TableCell className="text-muted-foreground">{o.role}</TableCell>
                  <TableCell className="tabular-nums">{o.package}</TableCell>
                  <TableCell className="text-muted-foreground">{o.location}</TableCell>
                  <TableCell>
                    <Badge variant="success">{o.status}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      <p className="mt-3 text-xs text-muted-foreground">
        The campus-wide {analyticsSnapshot.offersCount} figure above is aggregate demo data; this table shows the
        individual offer records tracked in this prototype.
      </p>
    </div>
  );
}

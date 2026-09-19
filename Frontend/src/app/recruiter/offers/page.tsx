"use client";

import { Award, IndianRupee, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { offers as baseOffers } from "@/data/mock/offers";
import { getStudentById } from "@/data/mock/students";
import { ACTIVE_RECRUITER_ID, activeRecruiter } from "@/data/mock/recruiters";
import { getDrivesByCompany } from "@/data/mock/drives";
import { useAppStore } from "@/hooks/useAppStore";
import { offerStatusTone } from "@/lib/status";

export default function RecruiterOffersPage() {
  const offerDecisions = useAppStore((s) => s.offerDecisions);
  const companyDriveIds = getDrivesByCompany(ACTIVE_RECRUITER_ID).map((d) => d.id);

  const rows = baseOffers
    .filter((o) => companyDriveIds.includes(o.driveId))
    .map((o) => ({
      ...o,
      status: offerDecisions[o.id] ?? o.status,
      student: getStudentById(o.studentId),
    }));

  const accepted = rows.filter((o) => o.status === "ACCEPTED");
  const pending = rows.filter(
    (o) => o.status === "OFFER RECEIVED" || o.status === "PENDING ACCEPTANCE",
  );
  const declined = rows.filter((o) => o.status === "DECLINED");
  const ppo = rows.filter((o) => o.offerType === "PPO");
  const acceptanceRate = rows.length ? Math.round((accepted.length / rows.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow={activeRecruiter.companyName}
        title="Offers"
        subtitle="Offers extended from your drives and where each candidate stands."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Offers Extended" value={rows.length} icon={Award} accent="violet" />
        <StatCard label="Accepted" value={accepted.length} icon={CheckCircle2} accent="success" />
        <StatCard label="Awaiting Decision" value={pending.length} icon={Clock} accent="warning" />
        <StatCard label="Acceptance Rate" value={acceptanceRate} suffix="%" accent="success" />
      </div>

      {ppo.length > 0 && (
        <DepthCard className="mb-5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-warning" />
            <CardTitle>Pre-Placement Offers</CardTitle>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {ppo.map((o) => (
              <div key={o.id} className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{o.student?.name}</p>
                  <Badge variant={offerStatusTone[o.status]}>{o.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{o.fromInternship}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <IndianRupee className="h-3 w-3" /> {o.package} · accept by{" "}
                  {o.acceptanceDeadline}
                </p>
              </div>
            ))}
          </div>
        </DepthCard>
      )}

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>CTC</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Offered</TableHead>
              <TableHead>Accept By</TableHead>
              <TableHead>Joining</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px]">
                        {o.student?.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{o.student?.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{o.role}</TableCell>
                <TableCell className="tabular-nums">{o.package}</TableCell>
                <TableCell>
                  <Badge variant={o.offerType === "PPO" ? "warning" : "muted"}>{o.offerType}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{o.offerDate}</TableCell>
                <TableCell className="text-muted-foreground">{o.acceptanceDeadline}</TableCell>
                <TableCell className="text-muted-foreground">{o.joiningDate}</TableCell>
                <TableCell>
                  <Badge variant={offerStatusTone[o.status]}>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No offers extended from your drives yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {declined.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {declined.length} offer{declined.length === 1 ? " was" : "s were"} declined — worth
          reviewing against competing CTC in the analytics view.
        </p>
      )}
    </div>
  );
}

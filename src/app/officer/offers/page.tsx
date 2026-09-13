"use client";

import { Award, Sparkles, IndianRupee, CheckCircle2, Clock } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { offers as baseOffers } from "@/data/mock/offers";
import { getStudentById } from "@/data/mock/students";
import { getCampusAnalytics } from "@/data/mock/analytics";
import { useAppStore } from "@/hooks/useAppStore";
import { offerStatusTone } from "@/lib/status";

export default function OfficerOffersPage() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const offerDecisions = useAppStore((s) => s.offerDecisions);
  const analytics = getCampusAnalytics(campusId);

  const rows = baseOffers
    .map((o) => ({ ...o, status: offerDecisions[o.id] ?? o.status, student: getStudentById(o.studentId) }))
    .filter((o) => o.student?.campusId === campusId);

  const ppo = rows.filter((o) => o.offerType === "PPO");
  const accepted = rows.filter((o) => o.status === "ACCEPTED");
  const joined = rows.filter((o) => o.joined);
  const pending = rows.filter(
    (o) => o.status === "OFFER RECEIVED" || o.status === "PENDING ACCEPTANCE",
  );

  const acceptanceRate = rows.length ? Math.round((accepted.length / rows.length) * 100) : 0;

  const renderTable = (list: typeof rows) => (
    <Card className="overflow-x-auto p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>CTC</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Offered</TableHead>
            <TableHead>Accept By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Docs</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((o) => (
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
              <TableCell>{o.companyName}</TableCell>
              <TableCell className="text-muted-foreground">{o.role}</TableCell>
              <TableCell className="tabular-nums">{o.package}</TableCell>
              <TableCell>
                <Badge variant={o.offerType === "PPO" ? "warning" : "muted"}>{o.offerType}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{o.offerDate}</TableCell>
              <TableCell className="text-muted-foreground">{o.acceptanceDeadline}</TableCell>
              <TableCell>
                <Badge variant={offerStatusTone[o.status]}>{o.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={o.documentsVerified ? "success" : "muted"}>
                  {o.documentsVerified ? "Verified" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={o.joined ? "success" : "muted"}>{o.joined ? "Yes" : "No"}</Badge>
              </TableCell>
            </TableRow>
          ))}
          {list.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">
                No offers in this view.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Operations"
        title="Offers"
        subtitle="Offer, PPO, acceptance, document verification and joining status across the cycle."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Campus Offers" value={analytics.snapshot.offersCount} icon={Award} accent="success" />
        <StatCard label="Tracked Records" value={rows.length} />
        <StatCard label="Accepted" value={accepted.length} icon={CheckCircle2} accent="success" />
        <StatCard label="Awaiting Decision" value={pending.length} icon={Clock} accent="warning" />
        <StatCard label="Acceptance Rate" value={acceptanceRate} suffix="%" accent="violet" />
      </div>

      <DepthCard className="mb-5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-warning" />
          <CardTitle>PPO Tracking</CardTitle>
        </div>
        {ppo.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pre-placement offers tracked for this campus yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {ppo.map((o) => (
              <div key={o.id} className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{o.student?.name}</p>
                  <Badge variant={offerStatusTone[o.status]}>{o.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Internship: {o.fromInternship ?? o.companyName}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>
                    PPO Offered: <span className="font-medium text-success">YES</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" /> {o.package}
                  </span>
                  <span>Accept by {o.acceptanceDeadline}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DepthCard>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({rows.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
          <TabsTrigger value="joined">Joined ({joined.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderTable(rows)}</TabsContent>
        <TabsContent value="pending">{renderTable(pending)}</TabsContent>
        <TabsContent value="accepted">{renderTable(accepted)}</TabsContent>
        <TabsContent value="joined">{renderTable(joined)}</TabsContent>
      </Tabs>

      <p className="mt-3 text-xs text-muted-foreground">
        The campus-wide {analytics.snapshot.offersCount} figure is aggregate demo data; the table
        shows the individual offer records tracked in this prototype.
      </p>
    </div>
  );
}

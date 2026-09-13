"use client";

import { KeyRound, Check, Minus, Users } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import {
  navByRole,
  roleDescription,
  roleHome,
  roleIcon,
  roleLabel,
  roleOrder,
  roleRouteAccess,
} from "@/components/layout/nav-config";
import { students } from "@/data/mock/students";
import { mentors } from "@/data/mock/mentors";
import { recruiters } from "@/data/mock/recruiters";
import { campuses } from "@/data/mock/campuses";
import type { Role } from "@/types";

/** Capability matrix shown to the institute admin. Mirrors what the
 * prototype's route scoping actually permits — see roleRouteAccess. */
const CAPABILITIES: { label: string; allowed: Role[] }[] = [
  { label: "View own placement profile & readiness", allowed: ["student"] },
  { label: "Apply to drives and manage offers", allowed: ["student"] },
  { label: "View ranked candidate pool", allowed: ["recruiter", "officer", "admin"] },
  { label: "Shortlist candidates", allowed: ["recruiter", "officer"] },
  { label: "Create and configure drives", allowed: ["officer", "admin"] },
  { label: "Configure eligibility criteria", allowed: ["officer", "admin"] },
  { label: "Resolve scheduling conflicts", allowed: ["officer", "admin"] },
  { label: "Verify documents", allowed: ["officer", "admin"] },
  { label: "Assign mentors", allowed: ["officer", "admin"] },
  { label: "Create intervention plans", allowed: ["mentor", "officer"] },
  { label: "Track mentee progress", allowed: ["mentor", "officer", "admin"] },
  { label: "View campus analytics", allowed: ["officer", "admin"] },
  { label: "Switch campus scope", allowed: ["officer", "admin"] },
  { label: "View cross-campus analytics", allowed: ["admin"] },
];

export default function RoleAccessPage() {
  const accountCounts: Record<Role, number> = {
    student: students.length,
    recruiter: recruiters.length,
    officer: campuses.length,
    mentor: mentors.length,
    admin: 1,
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Governance"
        title="Role &amp; Access Overview"
        subtitle="What each role can reach in the prototype, and the routes that back it."
        actions={<DemoDataBadge />}
      />

      <Alert className="mb-5">
        <KeyRound />
        <AlertDescription>
          Prototype route scoping only. There is no authentication server, token, or backend
          authorization — role switching is demo authentication and every restriction here is
          enforced client-side for presentation.
        </AlertDescription>
      </Alert>

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {roleOrder.map((role) => (
          <StatCard
            key={role}
            label={roleLabel[role]}
            value={accountCounts[role]}
            icon={roleIcon[role]}
            accent={role === "admin" ? "violet" : "success"}
          />
        ))}
      </div>

      <DataReveal stagger className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roleOrder.map((role) => {
          const Icon = roleIcon[role];
          const sections = navByRole[role];
          const screenCount = sections.reduce((n, s) => n + s.items.length, 0);
          return (
            <DataRevealItem key={role}>
              <DepthCard className="h-full p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet/10">
                    <Icon className="h-4 w-4 text-violet-bright" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="truncate">{roleLabel[role]}</CardTitle>
                    <p className="truncate text-xs text-muted-foreground">
                      {roleDescription[role]}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p>
                    Home route:{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                      {roleHome[role]}
                    </code>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {accountCounts[role]} demo account
                    {accountCounts[role] === 1 ? "" : "s"} · {screenCount} screens
                  </p>
                </div>
                <p className="mb-1.5 mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Accessible route prefixes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {roleRouteAccess[role].map((prefix) => (
                    <Badge key={prefix} variant="muted">
                      {prefix}
                    </Badge>
                  ))}
                </div>
              </DepthCard>
            </DataRevealItem>
          );
        })}
      </DataReveal>

      <Card className="overflow-x-auto p-5">
        <CardTitle className="mb-3">Capability Matrix</CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[240px]">Capability</TableHead>
              {roleOrder.map((role) => (
                <TableHead key={role} className="text-center">
                  {roleLabel[role]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {CAPABILITIES.map((cap) => (
              <TableRow key={cap.label}>
                <TableCell className="font-medium">{cap.label}</TableCell>
                {roleOrder.map((role) => {
                  const allowed = cap.allowed.includes(role);
                  return (
                    <TableCell key={role} className="text-center">
                      <span className="sr-only">{allowed ? "Allowed" : "Not allowed"}</span>
                      {allowed ? (
                        <Check className="mx-auto h-4 w-4 text-success" aria-hidden />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-hidden />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

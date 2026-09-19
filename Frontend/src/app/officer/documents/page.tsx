"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, CheckCircle2, Clock, AlertCircle, RefreshCw, Search, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { IntelligencePulse } from "@/components/intelligence/IntelligencePulse";
import { documents } from "@/data/mock/documents";
import { getStudentById } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import { documentStatusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/types";

const statusIcon: Record<DocumentStatus, typeof CheckCircle2> = {
  VERIFIED: CheckCircle2,
  "UNDER REVIEW": Clock,
  PENDING: AlertCircle,
  UPLOADED: FileText,
  "NEEDS UPDATE": RefreshCw,
};

/** Short, presentation-friendly verification delay. */
const VERIFY_MS = 700;

export default function OfficerDocumentsPage() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const documentDecisions = useAppStore((s) => s.documentDecisions);
  const setDocumentStatus = useAppStore((s) => s.setDocumentStatus);
  const pushToast = useAppStore((s) => s.pushToast);
  const [query, setQuery] = useState("");
  const [verifying, setVerifying] = useState<string | null>(null);

  const rows = documents
    .map((d) => ({
      ...d,
      status: documentDecisions[d.id] ?? d.status,
      student: getStudentById(d.studentId),
    }))
    .filter((d) => d.student?.campusId === campusId)
    .filter((d) =>
      query ? `${d.student?.name} ${d.name}`.toLowerCase().includes(query.toLowerCase()) : true,
    );

  const verified = rows.filter((d) => d.status === "VERIFIED").length;
  const underReview = rows.filter(
    (d) => d.status === "UNDER REVIEW" || d.status === "UPLOADED",
  ).length;
  const pending = rows.filter(
    (d) => d.status === "PENDING" || d.status === "NEEDS UPDATE",
  ).length;
  const complianceRate = rows.length ? Math.round((verified / rows.length) * 100) : 0;

  const verify = (id: string, name: string, studentName?: string) => {
    setVerifying(id);
    window.setTimeout(() => {
      setDocumentStatus(id, "VERIFIED");
      setVerifying((v) => (v === id ? null : v));
      pushToast("Document verified", `${studentName}'s ${name} is now marked VERIFIED (simulated).`);
    }, VERIFY_MS);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Operations"
        title="Document Tracking"
        subtitle="Verification compliance across the roster — verify a submitted document to advance it."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Verified" value={verified} icon={CheckCircle2} accent="success" />
        <StatCard label="Awaiting Review" value={underReview} icon={Clock} accent="warning" />
        <StatCard label="Action Needed" value={pending} icon={AlertCircle} accent="risk" />
        <StatCard label="Compliance" value={complianceRate} suffix="%" icon={BadgeCheck} accent="violet" />
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search student or document..."
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search documents"
        />
      </div>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((d) => {
              const Icon = statusIcon[d.status];
              const canVerify = d.status !== "VERIFIED" && d.status !== "PENDING";
              const isVerifying = verifying === d.id;
              return (
                <TableRow key={d.id} className={cn(d.status === "NEEDS UPDATE" && "bg-risk/5")}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {d.student?.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{d.student?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" /> {d.name}
                    </span>
                    {d.note && <p className="mt-0.5 text-[11px] text-risk">{d.note}</p>}
                  </TableCell>
                  <TableCell>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={d.status}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge variant={documentStatusTone[d.status]}>{d.status}</Badge>
                      </motion.div>
                    </AnimatePresence>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.updatedOn}</TableCell>
                  <TableCell className="text-right">
                    {canVerify ? (
                      <IntelligencePulse active={isVerifying} className="inline-block">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isVerifying}
                          onClick={() => verify(d.id, d.name, d.student?.name)}
                        >
                          {isVerifying ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Verifying...
                            </>
                          ) : (
                            <>
                              <BadgeCheck className="h-3.5 w-3.5" /> Verify
                            </>
                          )}
                        </Button>
                      </IntelligencePulse>
                    ) : d.status === "VERIFIED" ? (
                      <span className="text-xs text-success">Verified</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Awaiting upload</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No documents tracked for this campus.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <p className="mt-3 text-xs text-muted-foreground">
        Verification is simulated — no file is stored or inspected. The status change is shared with
        the student&apos;s own Documents page for the rest of this session.
      </p>
    </div>
  );
}

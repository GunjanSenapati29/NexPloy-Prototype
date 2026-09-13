"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, CheckCircle2, Clock, AlertCircle, Upload, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { IntelligencePulse } from "@/components/intelligence/IntelligencePulse";
import { getDocumentsByStudent } from "@/data/mock/documents";
import { primaryStudent } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import { documentStatusTone } from "@/lib/status";
import type { DocumentStatus } from "@/types";

const statusIcon: Record<DocumentStatus, typeof CheckCircle2> = {
  VERIFIED: CheckCircle2,
  "UNDER REVIEW": Clock,
  PENDING: AlertCircle,
  UPLOADED: FileText,
  "NEEDS UPDATE": RefreshCw,
};

export default function DocumentsPage() {
  const documents = getDocumentsByStudent(primaryStudent.id);
  const pushToast = useAppStore((s) => s.pushToast);
  const documentDecisions = useAppStore((s) => s.documentDecisions);
  const setDocumentStatus = useAppStore((s) => s.setDocumentStatus);
  const [pulsing, setPulsing] = useState<string | null>(null);

  const resolved = documents.map((d) => ({
    ...d,
    status: documentDecisions[d.id] ?? d.status,
  }));

  const verified = resolved.filter((d) => d.status === "VERIFIED").length;
  const awaiting = resolved.filter(
    (d) => d.status === "UNDER REVIEW" || d.status === "UPLOADED",
  ).length;
  const actionNeeded = resolved.filter(
    (d) => d.status === "PENDING" || d.status === "NEEDS UPDATE",
  ).length;

  const handleUpload = (id: string, name: string) => {
    setPulsing(id);
    setDocumentStatus(id, "UNDER REVIEW");
    pushToast(
      "Document upload simulated",
      `${name} was submitted for verification (simulated — no real file storage).`,
    );
    window.setTimeout(() => setPulsing((p) => (p === id ? null : p)), 900);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Profile"
        title="Documents"
        subtitle="Verification status for every document in your placement file."
      />

      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Verified" value={verified} icon={CheckCircle2} accent="success" />
        <StatCard label="Awaiting Review" value={awaiting} icon={Clock} accent="warning" />
        <StatCard label="Action Needed" value={actionNeeded} icon={AlertCircle} accent="risk" />
      </div>

      <Card className="divide-y divide-border p-0">
        {resolved.map((d) => {
          const Icon = statusIcon[d.status];
          const needsAction = d.status === "PENDING" || d.status === "NEEDS UPDATE";
          return (
            <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <IntelligencePulse active={pulsing === d.id}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={d.status}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon
                          className={
                            d.status === "VERIFIED"
                              ? "h-4 w-4 text-success"
                              : "h-4 w-4 text-muted-foreground"
                          }
                        />
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </IntelligencePulse>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.note ?? `Updated ${d.updatedOn}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                {needsAction && (
                  <Button size="sm" variant="outline" onClick={() => handleUpload(d.id, d.name)}>
                    <Upload className="h-3.5 w-3.5" />
                    {d.status === "NEEDS UPDATE" ? "Re-upload" : "Upload"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      <p className="mt-3 text-xs text-muted-foreground">
        Final verification is performed by the placement office — switch to the Placement Officer
        role to verify a submitted document and watch the status update here.
      </p>
    </div>
  );
}

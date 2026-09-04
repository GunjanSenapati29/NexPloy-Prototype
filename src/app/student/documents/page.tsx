"use client";

import { FileText, CheckCircle2, Clock, AlertCircle, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDocumentsByStudent } from "@/data/mock/documents";
import { primaryStudent } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import type { DocumentStatus } from "@/types";

const statusMeta: Record<DocumentStatus, { icon: typeof CheckCircle2; variant: "success" | "warning" | "muted" | "default" }> = {
  VERIFIED: { icon: CheckCircle2, variant: "success" },
  "UNDER REVIEW": { icon: Clock, variant: "warning" },
  PENDING: { icon: AlertCircle, variant: "muted" },
  UPLOADED: { icon: FileText, variant: "default" },
};

export default function DocumentsPage() {
  const documents = getDocumentsByStudent(primaryStudent.id);
  const pushToast = useAppStore((s) => s.pushToast);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Activity" title="Documents" subtitle="Verification status for every document in your placement file." />

      <Card className="divide-y divide-border p-0">
        {documents.map((d) => {
          const meta = statusMeta[d.status];
          const Icon = meta.icon;
          return (
            <div key={d.id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">Updated {d.updatedOn}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={meta.variant}>{d.status}</Badge>
                {d.status === "PENDING" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => pushToast("Document upload simulated", `${d.name} was marked as uploaded (simulated — no real file storage).`)}
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

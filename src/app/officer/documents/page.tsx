import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { documents } from "@/data/mock/documents";
import { getStudentById } from "@/data/mock/students";
import type { DocumentStatus } from "@/types";

const statusVariant: Record<DocumentStatus, "success" | "warning" | "muted" | "default"> = {
  VERIFIED: "success",
  "UNDER REVIEW": "warning",
  PENDING: "muted",
  UPLOADED: "default",
};

export default function OfficerDocumentsPage() {
  const verified = documents.filter((d) => d.status === "VERIFIED").length;
  const underReview = documents.filter((d) => d.status === "UNDER REVIEW").length;
  const pending = documents.filter((d) => d.status === "PENDING").length;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="Outcomes" title="Documents" subtitle="Document verification compliance across the roster." actions={<DemoDataBadge />} />

      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Verified" value={verified} icon={CheckCircle2} accent="success" />
        <StatCard label="Under Review" value={underReview} icon={Clock} accent="warning" />
        <StatCard label="Pending" value={pending} icon={AlertCircle} accent="risk" />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((d) => {
              const s = getStudentById(d.studentId);
              return (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">{s?.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{s?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" /> {d.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[d.status]}>{d.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.updatedOn}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

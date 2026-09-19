"use client";

import { useMemo, useState } from "react";
import { Search, Users, ShieldAlert, Award, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { students } from "@/data/mock/students";
import { getMentorForStudent } from "@/data/mock/mentors";
import { getApplicationsByStudent } from "@/data/mock/applications";
import { getOffersByStudent } from "@/data/mock/offers";
import { getCampusById } from "@/data/mock/campuses";
import { useAppStore } from "@/hooks/useAppStore";
import { readinessBand, riskTone } from "@/lib/status";

export default function OfficerStudentsPage() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const campus = getCampusById(campusId);
  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const roster = useMemo(() => students.filter((s) => s.campusId === campusId), [campusId]);
  const branches = useMemo(
    () => Array.from(new Set(roster.map((s) => s.branchCode))).sort(),
    [roster],
  );

  const filtered = roster
    .filter((s) =>
      query ? `${s.name} ${s.branch} ${s.rollNumber}`.toLowerCase().includes(query.toLowerCase()) : true,
    )
    .filter((s) => (branch === "all" ? true : s.branchCode === branch))
    .filter((s) => (status === "all" ? true : s.placementStatus === status));

  const selected = selectedId ? roster.find((s) => s.id === selectedId) : undefined;
  const selectedMentor = selected ? getMentorForStudent(selected.id) : undefined;
  const selectedApps = selected ? getApplicationsByStudent(selected.id) : [];
  const selectedOffers = selected ? getOffersByStudent(selected.id) : [];

  const atRisk = roster.filter((s) => s.riskLevel === "HIGH").length;
  const placed = roster.filter(
    (s) => s.placementStatus === "PLACED" || s.placementStatus === "OFFERED",
  ).length;
  const avgReadiness = roster.length
    ? Math.round(roster.reduce((n, s) => n + s.readiness, 0) / roster.length)
    : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Students"
        title="Student Directory"
        subtitle={`Full ${campus?.name ?? "campus"} roster with readiness, eligibility inputs and risk signals.`}
        actions={<DemoDataBadge />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students" value={roster.length} icon={Users} />
        <StatCard label="Offered / Placed" value={placed} icon={Award} accent="success" />
        <StatCard label="High Risk" value={atRisk} icon={ShieldAlert} accent="risk" />
        <StatCard label="Avg. Readiness" value={avgReadiness} suffix="/100" icon={Gauge} accent="violet" />
      </div>

      <div className="mb-4 mt-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, roll number or branch..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search students"
          />
        </div>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-40" aria-label="Filter by branch">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44" aria-label="Filter by placement status">
            <SelectValue placeholder="Placement status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="UNPLACED">Unplaced</SelectItem>
            <SelectItem value="IN PROCESS">In Process</SelectItem>
            <SelectItem value="OFFERED">Offered</SelectItem>
            <SelectItem value="PLACED">Placed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Backlogs</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelectedId(s.id)}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px]">{s.avatarInitials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-[10px] text-muted-foreground">{s.rollNumber}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{s.branchCode}</TableCell>
                <TableCell className="tabular-nums">{s.cgpa.toFixed(2)}</TableCell>
                <TableCell className={s.backlogs > 0 ? "tabular-nums text-risk" : "tabular-nums"}>
                  {s.backlogs}
                </TableCell>
                <TableCell className="tabular-nums">{s.readiness}</TableCell>
                <TableCell className="tabular-nums">{s.placementProbability}%</TableCell>
                <TableCell>
                  <Badge variant={riskTone[s.riskLevel]}>{s.riskLevel}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="muted">{s.placementStatus}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(s.id);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                  No students match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  {selected.rollNumber} · {selected.branch} · Batch {selected.batch}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 flex items-center gap-5">
                <ScoreRing value={selected.readiness} size={110} strokeWidth={9} label="Readiness" />
                <div className="space-y-1.5 text-sm">
                  <p className="text-muted-foreground">
                    CGPA <span className="font-medium text-foreground">{selected.cgpa.toFixed(2)}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Backlogs <span className="font-medium text-foreground">{selected.backlogs}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Probability{" "}
                    <span className="font-medium text-foreground">
                      {selected.placementProbability}%
                    </span>
                  </p>
                  <Badge variant={readinessBand(selected.readiness).tone}>
                    {readinessBand(selected.readiness).label}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <SkillBar label="Academics" value={selected.breakdown.academic} />
                <SkillBar label="Technical" value={selected.breakdown.technical} />
                <SkillBar label="Coding" value={selected.breakdown.coding} />
                <SkillBar label="Communication" value={selected.breakdown.communication} />
                <SkillBar label="Interview" value={selected.breakdown.interview} />
                <SkillBar label="Placement Activity" value={selected.breakdown.placementActivity} />
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Mentor:{" "}
                  <span className="font-medium text-foreground">
                    {selectedMentor?.name ?? "Not assigned"}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Applications:{" "}
                  <span className="font-medium text-foreground">
                    {selectedApps.filter((a) => a.status !== "eligible").length}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Offers: <span className="font-medium text-foreground">{selectedOffers.length}</span>
                </p>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.strengths.map((sk) => (
                    <Badge key={sk} variant="success">
                      {sk}
                    </Badge>
                  ))}
                  {selected.criticalGaps.map((sk) => (
                    <Badge key={sk} variant="risk">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  IndianRupee,
  Calendar,
  Users,
  Plus,
  Settings2,
  AlertTriangle,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { drives as baseDrives } from "@/data/mock/drives";
import { getApplicationsByDrive } from "@/data/mock/applications";
import { getConflictByEvent, scheduleEvents } from "@/data/mock/schedules";
import { students } from "@/data/mock/students";
import { evaluateEligibility } from "@/lib/eligibility";
import { driveStatusTone } from "@/lib/status";
import { useAppStore } from "@/hooks/useAppStore";
import type { Drive, EligibilityCriteria } from "@/types";

const BRANCH_OPTIONS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];

/** Editable copy of a drive's criteria — the officer-facing eligibility
 * configuration. Changes live in component state only (prototype). */
function CriteriaEditor({
  criteria,
  onChange,
}: {
  criteria: EligibilityCriteria;
  onChange: (next: EligibilityCriteria) => void;
}) {
  const toggleBranch = (code: string) => {
    const next = criteria.allowedBranches.includes(code)
      ? criteria.allowedBranches.filter((b) => b !== code)
      : [...criteria.allowedBranches, code];
    onChange({ ...criteria, allowedBranches: next });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="minCgpa">Minimum CGPA</Label>
          <Input
            id="minCgpa"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={criteria.minCgpa}
            onChange={(e) => onChange({ ...criteria, minCgpa: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="maxBacklogs">Max Active Backlogs</Label>
          <Input
            id="maxBacklogs"
            type="number"
            min="0"
            max="10"
            value={criteria.maxBacklogs}
            onChange={(e) => onChange({ ...criteria, maxBacklogs: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gradYear">Graduation Year</Label>
          <Input
            id="gradYear"
            type="number"
            value={criteria.graduationYear}
            onChange={(e) => onChange({ ...criteria, graduationYear: Number(e.target.value) })}
          />
        </div>
      </div>
      <div>
        <Label className="mb-2 block">Allowed Branches</Label>
        <div className="flex flex-wrap gap-1.5">
          {BRANCH_OPTIONS.map((b) => {
            const on = criteria.allowedBranches.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggleBranch(b)}
                aria-pressed={on}
                className={
                  on
                    ? "rounded-full border border-violet/50 bg-violet/10 px-3 py-1 text-xs font-medium text-violet-bright"
                    : "rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent"
                }
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DriveManagement() {
  const campusId = useAppStore((s) => s.activeCampusId);
  const pushToast = useAppStore((s) => s.pushToast);
  const [extraDrives, setExtraDrives] = useState<Drive[]>([]);
  const [configuring, setConfiguring] = useState<Drive | null>(null);
  const [draftCriteria, setDraftCriteria] = useState<EligibilityCriteria | null>(null);
  const [creating, setCreating] = useState(false);

  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPackage, setNewPackage] = useState("₹7.0 LPA");
  const [newHiring, setNewHiring] = useState(10);
  const [newCriteria, setNewCriteria] = useState<EligibilityCriteria>({
    minCgpa: 7.0,
    allowedBranches: ["CSE", "IT"],
    maxBacklogs: 1,
    graduationYear: 2027,
  });

  const allDrives = useMemo(() => [...extraDrives, ...baseDrives], [extraDrives]);
  const campusDrives = allDrives.filter((d) => d.campusId === campusId);
  const campusStudents = useMemo(
    () => students.filter((s) => s.campusId === campusId),
    [campusId],
  );

  const active = campusDrives.filter((d) => d.status === "ACTIVE");
  const draft = campusDrives.filter((d) => d.status === "DRAFT");
  const completed = campusDrives.filter((d) => d.status === "COMPLETED" || d.status === "CLOSED");

  const openConfig = (drive: Drive) => {
    setConfiguring(drive);
    setDraftCriteria({ ...drive.criteria });
  };

  const saveConfig = () => {
    if (!configuring || !draftCriteria) return;
    const eligible = campusStudents.filter(
      (s) => evaluateEligibility(s, { ...configuring, criteria: draftCriteria }).eligible,
    ).length;
    pushToast(
      "Eligibility criteria updated",
      `${configuring.companyName}: ${eligible} of ${campusStudents.length} tracked students now qualify (simulated).`,
    );
    setConfiguring(null);
  };

  const createDrive = () => {
    const id = `drv_custom_${extraDrives.length + 1}`;
    const drive: Drive = {
      id,
      companyId: "rec_custom",
      companyName: newCompany.trim() || "New Recruiter",
      role: newRole.trim() || "Software Engineer",
      driveType: "On-Campus",
      campusId,
      status: "DRAFT",
      description: "Drive created in the prototype — criteria are editable before publishing.",
      requiredSkills: ["Problem Solving"],
      criteria: newCriteria,
      rounds: [
        { name: "Online Assessment", description: "Fundamentals screening." },
        { name: "Technical Interview", description: "Role-specific technical round." },
      ],
      location: "Bengaluru",
      package: newPackage,
      expectedHiring: newHiring,
      deadline: "15 Oct 2026",
      driveDate: "22 Oct 2026",
      driveTime: "10:00 AM",
      venue: "Lab 1",
      logoInitial: (newCompany.trim() || "N")[0].toUpperCase(),
    };
    setExtraDrives((prev) => [drive, ...prev]);
    setCreating(false);
    setNewCompany("");
    setNewRole("");
    pushToast("Drive created", `${drive.companyName} — ${drive.role} saved as a DRAFT (simulated).`);
  };

  const renderDrive = (d: Drive) => {
    const applications = getApplicationsByDrive(d.id);
    const event = scheduleEvents.find((e) => e.driveId === d.id);
    const conflict = event ? getConflictByEvent(event.id) : undefined;
    const eligibleCount = campusStudents.filter((s) => evaluateEligibility(s, d).eligible).length;

    return (
      <DataRevealItem key={d.id}>
        <DepthCard className={conflict ? "h-full border-risk/30 p-5" : "h-full p-5"}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-sm font-bold text-violet-bright">
                {d.logoInitial}
              </div>
              <div className="min-w-0">
                <CardTitle className="truncate">{d.companyName}</CardTitle>
                <p className="truncate text-xs text-muted-foreground">{d.role}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Badge variant={driveStatusTone[d.status]}>{d.status}</Badge>
              {conflict && (
                <Badge variant="risk" className="gap-1">
                  <AlertTriangle className="h-3 w-3" /> Conflict
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> {d.driveType}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {d.location}
            </span>
            <span className="flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5" /> {d.package}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {d.driveDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {applications.length} applicants ·{" "}
              {d.expectedHiring} expected hires
            </span>
          </div>

          <div className="mt-3 rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Eligibility Criteria
              </p>
              <Badge variant="muted" className="gap-1">
                <ShieldCheck className="h-3 w-3" /> {eligibleCount} eligible
              </Badge>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>
                Minimum CGPA <span className="font-medium text-foreground">{d.criteria.minCgpa}</span>
              </span>
              <span>
                Max Backlogs{" "}
                <span className="font-medium text-foreground">{d.criteria.maxBacklogs}</span>
              </span>
              <span>
                Branches{" "}
                <span className="font-medium text-foreground">
                  {d.criteria.allowedBranches.join(", ")}
                </span>
              </span>
              <span>
                Batch{" "}
                <span className="font-medium text-foreground">{d.criteria.graduationYear}</span>
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.requiredSkills.slice(0, 5).map((s) => (
              <Badge key={s} variant="muted">
                {s}
              </Badge>
            ))}
          </div>

          <Button variant="outline" size="sm" className="mt-4" onClick={() => openConfig(d)}>
            <Settings2 className="h-3.5 w-3.5" /> Configure Eligibility
          </Button>
        </DepthCard>
      </DataRevealItem>
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Placement"
        title="Placement Drives"
        subtitle="Every drive this cycle, with its eligibility configuration and lifecycle status."
        actions={
          <div className="flex items-center gap-2">
            <DemoDataBadge />
            <Button variant="glow" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> Create Drive
            </Button>
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active" value={active.length} accent="success" />
        <StatCard label="Draft" value={draft.length} accent="warning" />
        <StatCard label="Completed" value={completed.length} />
        <StatCard
          label="Expected Hires"
          value={active.reduce((n, d) => n + d.expectedHiring, 0)}
          accent="violet"
        />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draft.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        {[
          { value: "active", list: active },
          { value: "draft", list: draft },
          { value: "completed", list: completed },
        ].map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.list.length === 0 ? (
              <Card className="p-10 text-center text-sm text-muted-foreground">
                No drives in this state for the selected campus.
              </Card>
            ) : (
              <DataReveal stagger className="grid gap-4 sm:grid-cols-2">
                {tab.list.map(renderDrive)}
              </DataReveal>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Eligibility configuration */}
      <Dialog open={!!configuring} onOpenChange={(open) => !open && setConfiguring(null)}>
        <DialogContent className="max-w-lg">
          {configuring && draftCriteria && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {configuring.companyName} — Eligibility Configuration
                </DialogTitle>
                <DialogDescription>
                  Criteria are evaluated deterministically against every student record.
                </DialogDescription>
              </DialogHeader>
              <CriteriaEditor criteria={draftCriteria} onChange={setDraftCriteria} />
              <motion.div
                key={JSON.stringify(draftCriteria)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-violet/30 bg-violet/5 p-3 text-sm"
              >
                <span className="font-semibold text-violet-bright">
                  {
                    campusStudents.filter(
                      (s) => evaluateEligibility(s, { ...configuring, criteria: draftCriteria }).eligible,
                    ).length
                  }
                </span>{" "}
                <span className="text-muted-foreground">
                  of {campusStudents.length} tracked students would be eligible under these criteria.
                </span>
              </motion.div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfiguring(null)}>
                  Cancel
                </Button>
                <Button variant="glow" onClick={saveConfig}>
                  Save Criteria
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create drive */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Placement Drive</DialogTitle>
            <DialogDescription>
              Saved as a DRAFT in this prototype session — nothing is published to a backend.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. NorthPeak Systems"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Backend Developer"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ctc">Package</Label>
                <Input id="ctc" value={newPackage} onChange={(e) => setNewPackage(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hiring">Expected Hiring</Label>
                <Input
                  id="hiring"
                  type="number"
                  min="1"
                  value={newHiring}
                  onChange={(e) => setNewHiring(Number(e.target.value))}
                />
              </div>
            </div>
            <CriteriaEditor criteria={newCriteria} onChange={setNewCriteria} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button variant="glow" onClick={createDrive}>
              Create Drive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Users,
  DoorOpen,
  UserCheck,
  MapPin,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { StagedRunner } from "@/components/intelligence/StagedRunner";
import {
  IntelligencePulse,
  IntelligencePulseBadge,
} from "@/components/intelligence/IntelligencePulse";
import { scheduleDays, scheduleEvents, getConflictByEvent, venues } from "@/data/mock/schedules";
import { scheduleOptimizationSteps, simulateScheduleOptimization } from "@/lib/simulate";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

type RunState = "idle" | "running" | "resolved";

export function DriveOrchestrator() {
  const [events, setEvents] = useState(scheduleEvents);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const pushToast = useAppStore((s) => s.pushToast);

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const conflict = selectedEventId ? getConflictByEvent(selectedEventId) : undefined;
  const openConflicts = events.filter((e) => e.hasConflict).length;
  const bookedVenues = new Set(events.map((e) => e.venue)).size;

  const optimize = () => {
    if (!conflict) return;
    setRunState("running");
  };

  const handleOptimizationDone = () => {
    if (!conflict || !selectedEvent) return;
    const resolved = simulateScheduleOptimization(conflict.id);
    if (!resolved) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === selectedEvent.id
          ? {
              ...e,
              time: "2:30 PM",
              endTime: "4:30 PM",
              venue: resolved.recommendedVenue,
              hasConflict: false,
            }
          : e,
      ),
    );
    setRunState("resolved");
    pushToast(
      "Conflict Resolved",
      `${selectedEvent.companyName} moved to ${resolved.recommendedTo} in ${resolved.recommendedVenue}.`,
    );
  };

  const closeDialog = () => {
    setSelectedEventId(null);
    setRunState("idle");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Placement"
        title="Drive Orchestrator"
        subtitle="Scheduling intelligence across every drive, venue and interview panel this week."
        actions={<DemoDataBadge />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Scheduled Events" value={events.length} icon={CalendarClock} accent="violet" />
        <StatCard
          label="Open Conflicts"
          value={openConflicts}
          icon={AlertTriangle}
          accent={openConflicts > 0 ? "risk" : "success"}
        />
        <StatCard label="Venues In Use" value={bookedVenues} icon={DoorOpen} />
        <StatCard label="Venues Available" value={venues.length - bookedVenues} accent="success" />
      </div>

      <Card className="overflow-x-auto p-5">
        <div className="grid min-w-[720px] grid-cols-5 gap-3">
          {scheduleDays.map(({ day, date }) => {
            const dayEvents = events.filter((e) => e.day === day);
            return (
              <div key={day}>
                <p className="mb-0.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {day}
                </p>
                <p className="mb-2 text-center text-[10px] text-muted-foreground/70">{date}</p>
                <div className="min-h-[160px] space-y-2 rounded-lg border border-dashed border-border/70 p-2">
                  {dayEvents.map((e) => (
                    <div key={e.id} className="relative">
                      <AnimatePresence>
                        {e.hasConflict && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.35, 0.6, 0.35] }}
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                            transition={{
                              opacity: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                            }}
                            className="pointer-events-none absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg border border-dashed border-risk/50"
                            aria-hidden
                          />
                        )}
                      </AnimatePresence>
                      <motion.button
                        layout
                        layoutId={`event-${e.id}`}
                        transition={{ type: "spring", stiffness: 340, damping: 32 }}
                        onClick={() => setSelectedEventId(e.id)}
                        className={cn(
                          "relative w-full rounded-lg border p-2.5 text-left transition-colors hover:-translate-y-0.5",
                          e.hasConflict
                            ? "border-risk/50 bg-risk/10 hover:shadow-glow"
                            : "border-border bg-card hover:border-violet/40 hover:shadow-glow",
                          runState === "running" &&
                            selectedEventId === e.id &&
                            "shadow-glow-strong ring-1 ring-violet/50",
                        )}
                      >
                        <p className="truncate text-xs font-semibold">{e.companyName}</p>
                        <p className="truncate text-[10px] text-muted-foreground">{e.title}</p>
                        <p className="mt-1 text-[10px] font-medium text-violet-bright">
                          {e.time} – {e.endTime}
                        </p>
                        <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" /> {e.venue}
                        </p>
                        {e.hasConflict && (
                          <Badge variant="risk" className="mt-1.5">
                            <AlertTriangle className="mr-1 h-2.5 w-2.5" /> Conflict
                          </Badge>
                        )}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mt-5 p-5">
        <CardTitle className="mb-3">How this works</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select a drive in the calendar to inspect its conflicts. The optimizer is a deterministic
          prototype simulation — it replays a fixed analysis over the known conflict and applies the
          pre-computed recommended slot. No real constraint solver is running.
        </p>
      </Card>

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-violet-bright" />
                  {selectedEvent.companyName} — {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedEvent.day} {selectedEvent.date} · {selectedEvent.time} –{" "}
                  {selectedEvent.endTime} · {selectedEvent.venue}
                </DialogDescription>
              </DialogHeader>

              {conflict ? (
                <IntelligencePulse active={runState === "running"}>
                  <div className="rounded-lg border border-border p-4">
                    {runState === "running" ? (
                      <div className="flex flex-col items-center gap-5 py-4">
                        <IntelligencePulseBadge label="Optimizing Schedule" />
                        <div className="w-full max-w-xs">
                          <StagedRunner
                            steps={scheduleOptimizationSteps}
                            onDone={handleOptimizationDone}
                          />
                        </div>
                      </div>
                    ) : runState === "resolved" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-2 text-center"
                      >
                        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" />
                        <p className="text-sm font-semibold text-success">CONFLICT RESOLVED ✓</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {selectedEvent.companyName} moved to {selectedEvent.date} ·{" "}
                          {selectedEvent.time} – {selectedEvent.endTime} · {selectedEvent.venue}.
                        </p>
                      </motion.div>
                    ) : (
                      <>
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-risk">
                          <AlertTriangle className="h-4 w-4" /> CONFLICT DETECTED
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-lg bg-elevated p-2.5">
                            <Users className="mx-auto mb-1 h-4 w-4 text-risk" />
                            <p className="text-sm font-semibold tabular-nums">
                              {conflict.studentOverlap}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Student Overlaps</p>
                          </div>
                          <div className="rounded-lg bg-elevated p-2.5">
                            <DoorOpen className="mx-auto mb-1 h-4 w-4 text-risk" />
                            <p className="text-[10px] leading-tight text-muted-foreground">
                              {conflict.venueIssue}
                            </p>
                          </div>
                          <div className="rounded-lg bg-elevated p-2.5">
                            <UserCheck className="mx-auto mb-1 h-4 w-4 text-risk" />
                            <p className="text-[10px] leading-tight text-muted-foreground">
                              {conflict.panelIssue}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-elevated px-3 py-2">
                          <span className="text-xs text-muted-foreground">Severity</span>
                          <Badge variant="risk">{conflict.severity}</Badge>
                        </div>
                        <div className="mt-3 rounded-lg border border-violet/30 bg-violet/5 p-3">
                          <p className="text-xs font-semibold text-violet-bright">
                            Recommended Move
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            FROM{" "}
                            <span className="font-medium text-foreground">
                              {conflict.recommendedFrom}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            TO{" "}
                            <span className="font-medium text-foreground">
                              {conflict.recommendedTo} · {conflict.recommendedVenue}
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-success">
                            Estimated conflict reduction: {conflict.estimatedConflictReduction}%
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="glow" className="flex-1" onClick={optimize}>
                            <Zap className="h-4 w-4" /> Optimize Schedule
                          </Button>
                          <Button variant="outline" className="flex-1" onClick={optimize}>
                            Apply Recommended Slot
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </IntelligencePulse>
              ) : (
                <div className="rounded-lg border border-border p-4">
                  <p className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4" /> No scheduling conflicts detected for this
                    drive.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Panel: {selectedEvent.panel} · Venue: {selectedEvent.venue}
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

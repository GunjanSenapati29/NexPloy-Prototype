// ============================================================
// SCHEDULES API — wraps src/data/mock/schedules.ts and the schedule
// optimization simulation in src/lib/simulate.ts.
// ============================================================

import {
  scheduleDays,
  scheduleEvents,
  scheduleConflicts,
  getConflictByEvent,
  venues,
  panels,
} from "@/data/mock/schedules";
import { simulateScheduleOptimization, scheduleOptimizationSteps } from "@/lib/simulate";
import type { ScheduleConflict, ScheduleEvent } from "@/types";

/** GET /api/schedule/days */
export async function listScheduleDays() {
  return scheduleDays;
}

/** GET /api/schedule/events */
export async function listScheduleEvents(): Promise<ScheduleEvent[]> {
  return scheduleEvents;
}

/** GET /api/schedule/conflicts */
export async function listScheduleConflicts(): Promise<ScheduleConflict[]> {
  return scheduleConflicts;
}

/** GET /api/schedule/events/:eventId/conflict */
export async function getConflictForEvent(eventId: string): Promise<ScheduleConflict | undefined> {
  return getConflictByEvent(eventId);
}

/** POST /api/schedule/conflicts/:conflictId/optimize */
export async function optimizeSchedule(conflictId: string): Promise<ScheduleConflict | undefined> {
  return simulateScheduleOptimization(conflictId);
}

/** GET /api/schedule/venues */
export async function listVenues() {
  return venues;
}

/** GET /api/schedule/panels */
export async function listPanels() {
  return panels;
}

export { scheduleOptimizationSteps };

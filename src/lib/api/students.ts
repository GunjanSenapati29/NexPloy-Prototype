// ============================================================
// STUDENTS API — wraps src/data/mock/students.ts and the student-facing
// functions in src/lib/simulate.ts. Every function returns a resolved
// Promise so call sites already read like real network calls; nothing
// here reimplements the underlying data or scoring logic.
// ============================================================

import {
  students,
  getStudentById,
  getStudentsByCampus,
  PRIMARY_STUDENT_ID,
  primaryStudent,
} from "@/data/mock/students";
import {
  simulateDigitalTwinRefresh,
  simulateWhatIfScenario,
  simulateResumeIntelligence,
  whatIfFactorLabels,
  WHAT_IF_BASELINE,
} from "@/lib/simulate";
import type { DigitalTwinResult, ResumeIntelligence, WhatIfFactor } from "@/lib/simulate";
import type { Student } from "@/types";

/** GET /api/students */
export async function listStudents(): Promise<Student[]> {
  return students;
}

/** GET /api/students/:id */
export async function getStudent(id: string): Promise<Student | undefined> {
  return getStudentById(id);
}

/** GET /api/campuses/:campusId/students */
export async function listStudentsByCampus(campusId: string): Promise<Student[]> {
  return getStudentsByCampus(campusId);
}

/** GET /api/students/me — the signed-in demo student's own profile. */
export async function getPrimaryStudent(): Promise<Student> {
  return primaryStudent;
}

export { PRIMARY_STUDENT_ID };

/** POST /api/students/:id/digital-twin/refresh */
export async function refreshDigitalTwin(studentId: string): Promise<DigitalTwinResult> {
  return simulateDigitalTwinRefresh(studentId);
}

/** POST /api/students/:id/what-if */
export async function runWhatIfScenario(selectedFactors: WhatIfFactor[]): Promise<{
  probability: number;
  readinessImpact: number;
  recommendedPath: string;
}> {
  return simulateWhatIfScenario(selectedFactors);
}

export { whatIfFactorLabels, WHAT_IF_BASELINE };
export type { WhatIfFactor };

/** GET /api/students/:id/resume-intelligence */
export async function getResumeIntelligence(studentId: string): Promise<ResumeIntelligence> {
  return simulateResumeIntelligence(studentId);
}

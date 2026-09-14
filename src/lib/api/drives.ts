// ============================================================
// DRIVES API — wraps src/data/mock/drives.ts and the deterministic
// eligibility engine in src/lib/eligibility.ts.
// ============================================================

import {
  drives,
  getDriveById,
  activeDrives,
  getDrivesByCampus,
  getDrivesByCompany,
  FEATURED_DRIVE_ID,
} from "@/data/mock/drives";
import { getStudentById } from "@/data/mock/students";
import { evaluateEligibility, describeCriteria } from "@/lib/eligibility";
import type { Drive, EligibilityResult } from "@/types";

/** GET /api/drives */
export async function listDrives(): Promise<Drive[]> {
  return drives;
}

/** GET /api/drives/:id */
export async function getDrive(id: string): Promise<Drive | undefined> {
  return getDriveById(id);
}

/** GET /api/drives?status=ACTIVE */
export async function listActiveDrives(): Promise<Drive[]> {
  return activeDrives;
}

/** GET /api/campuses/:campusId/drives */
export async function listDrivesByCampus(campusId: string): Promise<Drive[]> {
  return getDrivesByCampus(campusId);
}

/** GET /api/recruiters/:companyId/drives */
export async function listDrivesByCompany(companyId: string): Promise<Drive[]> {
  return getDrivesByCompany(companyId);
}

export { FEATURED_DRIVE_ID };

/** GET /api/drives/:driveId/eligibility/:studentId */
export async function checkEligibility(
  studentId: string,
  driveId: string,
): Promise<EligibilityResult | undefined> {
  const student = getStudentById(studentId);
  const drive = getDriveById(driveId);
  if (!student || !drive) return undefined;
  return evaluateEligibility(student, drive);
}

/** GET /api/drives/:id/criteria-summary */
export async function getCriteriaSummary(driveId: string): Promise<string | undefined> {
  const drive = getDriveById(driveId);
  return drive ? describeCriteria(drive) : undefined;
}

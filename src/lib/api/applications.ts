// ============================================================
// APPLICATIONS API — wraps src/data/mock/applications.ts.
// ============================================================

import {
  applications,
  getApplicationsByStudent,
  getApplicationsByDrive,
  getApplication,
  APPLICATION_FLOW,
} from "@/data/mock/applications";
import type { Application } from "@/types";

/** GET /api/applications */
export async function listApplications(): Promise<Application[]> {
  return applications;
}

/** GET /api/students/:studentId/applications */
export async function listApplicationsByStudent(studentId: string): Promise<Application[]> {
  return getApplicationsByStudent(studentId);
}

/** GET /api/drives/:driveId/applications */
export async function listApplicationsByDrive(driveId: string): Promise<Application[]> {
  return getApplicationsByDrive(driveId);
}

/** GET /api/students/:studentId/applications/:driveId */
export async function getApplicationForDrive(
  studentId: string,
  driveId: string,
): Promise<Application | undefined> {
  return getApplication(studentId, driveId);
}

export { APPLICATION_FLOW };

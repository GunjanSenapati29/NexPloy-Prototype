// ============================================================
// CAMPUSES API — wraps src/data/mock/campuses.ts.
// ============================================================

import {
  campuses,
  INSTITUTE_NAME,
  DEFAULT_CAMPUS_ID,
  getCampusById,
  instituteTotals,
} from "@/data/mock/campuses";
import type { Campus } from "@/types";

/** GET /api/campuses */
export async function listCampuses(): Promise<Campus[]> {
  return campuses;
}

/** GET /api/campuses/:id */
export async function getCampus(id: string): Promise<Campus | undefined> {
  return getCampusById(id);
}

/** GET /api/campuses/totals — institute-wide sums across every campus. */
export async function getInstituteTotals() {
  return instituteTotals;
}

export { INSTITUTE_NAME, DEFAULT_CAMPUS_ID };

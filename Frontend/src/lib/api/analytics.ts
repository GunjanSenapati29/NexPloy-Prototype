// ============================================================
// ANALYTICS API — wraps src/data/mock/analytics.ts. Every figure
// returned here is labeled "Demo Data" in the UI, never presented as a
// real institutional statistic.
// ============================================================

import {
  analyticsByCampus,
  getCampusAnalytics,
  skillDemand,
  skillSupply,
  landingMetrics,
  crossCampusComparison,
  DEFAULT_ANALYTICS_CAMPUS_ID,
} from "@/data/mock/analytics";
import type { CampusAnalytics } from "@/data/mock/analytics";

/** GET /api/campuses/:campusId/analytics */
export async function getAnalyticsForCampus(campusId: string): Promise<CampusAnalytics> {
  return getCampusAnalytics(campusId);
}

/** GET /api/analytics — every campus's analytics snapshot, keyed by campus id. */
export async function listAllCampusAnalytics(): Promise<Record<string, CampusAnalytics>> {
  return analyticsByCampus;
}

/** GET /api/analytics/skill-demand */
export async function getSkillDemand() {
  return skillDemand;
}

/** GET /api/analytics/skill-supply */
export async function getSkillSupply() {
  return skillSupply;
}

/** GET /api/analytics/landing-metrics — public landing-page counters. */
export async function getLandingMetrics() {
  return landingMetrics;
}

/** GET /api/analytics/cross-campus-comparison */
export async function getCrossCampusComparison() {
  return crossCampusComparison;
}

export { DEFAULT_ANALYTICS_CAMPUS_ID };
export type { CampusAnalytics };

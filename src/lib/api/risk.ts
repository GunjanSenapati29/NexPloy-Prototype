// ============================================================
// RISK API — wraps src/data/mock/risk.ts.
// ============================================================

import { riskEntries, getRiskByStudent, RISK_ORDER } from "@/data/mock/risk";
import type { RiskEntry } from "@/types";

/** GET /api/risk */
export async function listRiskEntries(): Promise<RiskEntry[]> {
  return riskEntries;
}

/** GET /api/students/:studentId/risk */
export async function getStudentRisk(studentId: string): Promise<RiskEntry | undefined> {
  return getRiskByStudent(studentId);
}

export { RISK_ORDER };

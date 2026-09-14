// ============================================================
// MATCHES API — wraps src/data/mock/matches.ts and the candidate
// analysis simulation in src/lib/simulate.ts.
// ============================================================

import {
  matches,
  getMatch,
  getMatchesByDrive,
  getMatchesByStudent,
} from "@/data/mock/matches";
import { simulateCandidateAnalysis, candidateAnalysisSteps } from "@/lib/simulate";
import type { CandidateMatch } from "@/types";

/** GET /api/matches */
export async function listMatches(): Promise<CandidateMatch[]> {
  return matches;
}

/** GET /api/students/:studentId/matches/:driveId */
export async function getCandidateMatch(
  studentId: string,
  driveId: string,
): Promise<CandidateMatch | undefined> {
  return getMatch(studentId, driveId);
}

/** GET /api/drives/:driveId/matches */
export async function listMatchesForDrive(driveId: string): Promise<CandidateMatch[]> {
  return getMatchesByDrive(driveId);
}

/** GET /api/students/:studentId/matches */
export async function listMatchesForStudent(studentId: string): Promise<CandidateMatch[]> {
  return getMatchesByStudent(studentId);
}

/** POST /api/drives/:driveId/candidates/:studentId/analyze */
export async function analyzeCandidate(
  studentId: string,
  driveId: string,
): Promise<CandidateMatch | undefined> {
  return simulateCandidateAnalysis(studentId, driveId);
}

export { candidateAnalysisSteps };

import { recruiters, getRecruiterById, activeRecruiter } from "@/data/mock/recruiters";
import type { Recruiter } from "@/types";

/** GET /api/recruiters */
export async function listRecruiters(): Promise<Recruiter[]> {
  return recruiters;
}

/** GET /api/recruiters/:id */
export async function getRecruiter(id: string): Promise<Recruiter | undefined> {
  return getRecruiterById(id);
}

/** GET /api/recruiters/active — the recruiter account the demo Recruiter role signs into. */
export async function getActiveRecruiter(): Promise<Recruiter> {
  return activeRecruiter;
}

// ============================================================
// MENTORS API — wraps src/data/mock/mentors.ts. Intervention-plan
// mutations (create/activate/toggle action) are demo interaction state
// owned by useAppStore, not fetched data, so only reads are wrapped here.
// ============================================================

import {
  mentors,
  ACTIVE_MENTOR_ID,
  activeMentor,
  getMentorById,
  getMentorForStudent,
  interventionPlans,
  getInterventionByStudent,
  getInterventionsByMentor,
  RECOMMENDED_PLAN_TEMPLATE,
} from "@/data/mock/mentors";
import type { InterventionPlan, Mentor } from "@/types";

/** GET /api/mentors */
export async function listMentors(): Promise<Mentor[]> {
  return mentors;
}

/** GET /api/mentors/:id */
export async function getMentor(id: string): Promise<Mentor | undefined> {
  return getMentorById(id);
}

/** GET /api/students/:studentId/mentor */
export async function getStudentMentor(studentId: string): Promise<Mentor | undefined> {
  return getMentorForStudent(studentId);
}

/** GET /api/mentors/me — the signed-in demo mentor's own profile. */
export async function getActiveMentor(): Promise<Mentor> {
  return activeMentor;
}

export { ACTIVE_MENTOR_ID };

/** GET /api/interventions */
export async function listInterventionPlans(): Promise<InterventionPlan[]> {
  return interventionPlans;
}

/** GET /api/students/:studentId/intervention */
export async function getStudentIntervention(studentId: string): Promise<InterventionPlan | undefined> {
  return getInterventionByStudent(studentId);
}

/** GET /api/mentors/:mentorId/interventions */
export async function listInterventionsByMentor(mentorId: string): Promise<InterventionPlan[]> {
  return getInterventionsByMentor(mentorId);
}

export { RECOMMENDED_PLAN_TEMPLATE };

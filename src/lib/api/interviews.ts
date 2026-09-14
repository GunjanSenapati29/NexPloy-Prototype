import {
  interviewSlots,
  getInterviewsByStudent,
  getInterviewsByDrive,
  upcomingInterviews,
  interviewPrepPlans,
  getPrepPlan,
  type InterviewPrepPlan,
} from "@/data/mock/interviews";
import type { InterviewSlot } from "@/types";

/** GET /api/interviews */
export async function listInterviews(): Promise<InterviewSlot[]> {
  return interviewSlots;
}

/** GET /api/interviews?studentId=:studentId */
export async function listInterviewsByStudent(studentId: string): Promise<InterviewSlot[]> {
  return getInterviewsByStudent(studentId);
}

/** GET /api/interviews?driveId=:driveId */
export async function listInterviewsByDrive(driveId: string): Promise<InterviewSlot[]> {
  return getInterviewsByDrive(driveId);
}

/** GET /api/interviews?status=scheduled */
export async function listUpcomingInterviews(): Promise<InterviewSlot[]> {
  return upcomingInterviews;
}

/** GET /api/interviews/prep-plans */
export async function listInterviewPrepPlans(): Promise<InterviewPrepPlan[]> {
  return interviewPrepPlans;
}

/** GET /api/interviews/prep-plans/:driveId */
export async function getInterviewPrepPlan(driveId: string): Promise<InterviewPrepPlan | undefined> {
  return getPrepPlan(driveId);
}

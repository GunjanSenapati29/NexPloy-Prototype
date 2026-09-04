// ============================================================
// SIMULATED INTELLIGENCE LAYER
// Every function here is deterministic (no Math.random) so a demo run
// always produces the same result. Production will later swap this file
// for real API/ML calls — src/app and src/features must never import
// mock intelligence logic from anywhere else, so that swap never touches
// presentation components.
// ============================================================

import { getMatch } from "@/data/mock/matches";
import { getStudentById } from "@/data/mock/students";
import { scheduleConflicts } from "@/data/mock/schedules";
import type { CandidateMatch } from "@/types";

export interface StagedStep {
  label: string;
  durationMs: number;
}

export const digitalTwinSteps: StagedStep[] = [
  { label: "Analyzing profile...", durationMs: 280 },
  { label: "Skills connected", durationMs: 260 },
  { label: "Academics connected", durationMs: 260 },
  { label: "Assessments connected", durationMs: 260 },
  { label: "Placement activity connected", durationMs: 260 },
];

export interface DigitalTwinResult {
  finalScore: number;
  label: string;
}

export function simulateDigitalTwinRefresh(studentId: string): DigitalTwinResult {
  const student = getStudentById(studentId);
  const finalScore = student?.readiness ?? 0;
  return { finalScore, label: `PLACEMENT DIGITAL TWIN READY — ${finalScore}/100` };
}

// ---- What-If Simulator ----------------------------------------------

export type WhatIfFactor =
  | "aws"
  | "docker"
  | "dsa"
  | "mockInterviews"
  | "newProject"
  | "communication";

export const whatIfFactorLabels: Record<WhatIfFactor, string> = {
  aws: "Learn AWS",
  docker: "Learn Docker",
  dsa: "Improve DSA",
  mockInterviews: "Take 2 Mock Interviews",
  newProject: "Build 1 New Project",
  communication: "Improve Communication",
};

export const WHAT_IF_BASELINE = 52;

// Fixed lookup table keyed by a sorted, joined factor signature so results
// are 100% deterministic regardless of toggle order.
const WHAT_IF_TABLE: Record<string, number> = {
  "": 52,
  aws: 61,
  "aws,dsa": 69,
  "aws,dsa,mockInterviews": 78,
  "aws,communication,docker,dsa,mockInterviews,newProject": 84,
};

const ALL_FACTORS: WhatIfFactor[] = [
  "aws",
  "docker",
  "dsa",
  "mockInterviews",
  "newProject",
  "communication",
];

export function simulateWhatIfScenario(selected: WhatIfFactor[]): {
  probability: number;
  readinessImpact: number;
  recommendedPath: string;
} {
  const key = [...selected].sort().join(",");
  const exact = WHAT_IF_TABLE[key];

  if (exact !== undefined) {
    return {
      probability: exact,
      readinessImpact: Math.round((exact - WHAT_IF_BASELINE) * 0.6),
      recommendedPath:
        selected.length === 0
          ? "Start with AWS — it has the single largest impact on your placement probability."
          : selected.length >= ALL_FACTORS.length
            ? "You've built the best-case roadmap. Apply it to lock in these gains."
            : "Add DSA and 2 mock interviews next for the fastest additional gain.",
    };
  }

  // Deterministic fallback for any other combination: baseline + a fixed
  // per-factor weight, capped at the best-case value.
  const weights: Record<WhatIfFactor, number> = {
    aws: 9,
    docker: 6,
    dsa: 8,
    mockInterviews: 9,
    newProject: 5,
    communication: 5,
  };
  const gain = selected.reduce((sum, f) => sum + weights[f], 0);
  const probability = Math.min(84, WHAT_IF_BASELINE + gain);
  return {
    probability,
    readinessImpact: Math.round((probability - WHAT_IF_BASELINE) * 0.6),
    recommendedPath:
      selected.length === 0
        ? "Start with AWS — it has the single largest impact on your placement probability."
        : "Keep stacking factors — AWS, DSA, and Mock Interviews compound the fastest.",
  };
}

// ---- Candidate Analysis (recruiter side) -----------------------------

export const candidateAnalysisSteps: StagedStep[] = [
  { label: "Checking eligibility...", durationMs: 260 },
  { label: "Comparing skills...", durationMs: 260 },
  { label: "Analyzing resume relevance...", durationMs: 260 },
  { label: "Evaluating readiness...", durationMs: 260 },
  { label: "Generating match intelligence...", durationMs: 300 },
];

export function simulateCandidateAnalysis(
  studentId: string,
  driveId: string,
): CandidateMatch | undefined {
  return getMatch(studentId, driveId);
}

// ---- Schedule Optimization (officer side) -----------------------------

export const scheduleOptimizationSteps: StagedStep[] = [
  { label: "Analyzing student overlap...", durationMs: 280 },
  { label: "Checking venue availability...", durationMs: 260 },
  { label: "Checking panel availability...", durationMs: 260 },
  { label: "Evaluating alternative slots...", durationMs: 280 },
];

export function simulateScheduleOptimization(conflictId: string) {
  return scheduleConflicts.find((c) => c.id === conflictId);
}

// ---- Nexploy Copilot ----------------------------------------------

export type CopilotRoleContext = "student" | "recruiter" | "officer";

interface CannedAnswer {
  keywords: string[];
  answer: string;
}

const STUDENT_ANSWERS: CannedAnswer[] = [
  {
    keywords: ["shortlist", "why wasn't i", "not shortlisted", "rejected"],
    answer:
      "For drives where you weren't shortlisted, the most common gap is missing cloud/deployment skills (Docker, AWS). Your core Java/Spring Boot skills are strong — closing the Docker and AWS gaps is likely to raise your shortlist rate the most.",
  },
  {
    keywords: ["which skill", "improve", "skill gap", "what should i learn"],
    answer:
      "Based on your Digital Twin, prioritize AWS and Docker — both are HIGH priority gaps for your target role (Backend / Cloud Engineer) and appear as required skills in most of your active drives.",
  },
  {
    keywords: ["which drive", "apply to", "should i apply"],
    answer:
      "TechNova (Backend Developer) is your strongest match at 91% — eligibility, skills, and academics all align well. CloudSphere is a close second at 84%, but AWS/Docker gaps will lower your interview performance there.",
  },
];

const RECRUITER_ANSWERS: CannedAnswer[] = [
  {
    keywords: ["why is rahul", "ranked first", "rahul ranked"],
    answer:
      "Rahul Sharma ranks first for TechNova at 91% overall fit — driven by 100% eligibility match, 92% skills match (strong Java/Spring Boot alignment), and an 88% academic score. His main gap is Docker and cloud deployment experience.",
  },
  {
    keywords: ["strongest backend", "backend profile", "who has the strongest"],
    answer:
      "Rahul Sharma and Priya Das have the strongest backend profiles in this pool — both score above 88% skills match, with strong Java/Spring Boot and system design fundamentals respectively.",
  },
];

const OFFICER_ANSWERS: CannedAnswer[] = [
  {
    keywords: ["intervention", "need intervention", "which students need"],
    answer:
      "42 students currently need intervention. The highest-priority cases are Amit Kumar (HIGH risk — no recent applications) and Sneha Das (HIGH risk — repeated interview failures). Both are flagged in Risk Radar with recommended actions.",
  },
  {
    keywords: ["conflict", "which drive has a conflict", "scheduling conflict"],
    answer:
      "CloudSphere's Tuesday 11:00 AM slot has a HIGH severity conflict — 38 student overlap, Lab 2 double-booked, and 2 faculty members unavailable. The Drive Orchestrator recommends moving it to Tuesday 2:30 PM (100% estimated conflict reduction).",
  },
  {
    keywords: ["lowest placement rate", "which branch", "branch has the lowest"],
    answer:
      "Civil Engineering currently has the lowest placement rate among branches at 58%, followed by Mechanical Engineering at 62%. Both are below the campus average of 81%.",
  },
];

const ANSWER_TABLE: Record<CopilotRoleContext, CannedAnswer[]> = {
  student: STUDENT_ANSWERS,
  recruiter: RECRUITER_ANSWERS,
  officer: OFFICER_ANSWERS,
};

const FALLBACK_ANSWER: Record<CopilotRoleContext, string> = {
  student:
    "I can help with readiness, skill gaps, and drive recommendations. Try asking \"Which skill should I improve?\" or \"Which drive should I apply to?\"",
  recruiter:
    "I can help explain candidate rankings and matches. Try asking \"Why is Rahul ranked first?\"",
  officer:
    "I can help surface risk, conflicts, and analytics. Try asking \"Which students need intervention?\" or \"Which drive has a conflict?\"",
};

export function simulateCopilotResponse(question: string, roleContext: CopilotRoleContext): string {
  const q = question.toLowerCase();
  const table = ANSWER_TABLE[roleContext];
  const match = table.find((entry) => entry.keywords.some((k) => q.includes(k)));
  return match?.answer ?? FALLBACK_ANSWER[roleContext];
}

export function getSuggestedQuestions(roleContext: CopilotRoleContext): string[] {
  if (roleContext === "student") {
    return ["Why wasn't I shortlisted?", "Which skill should I improve?", "Which drive should I apply to?"];
  }
  if (roleContext === "recruiter") {
    return ["Why is Rahul ranked first?", "Who has the strongest backend profile?"];
  }
  return [
    "Which students need intervention?",
    "Which drive has a conflict?",
    "Which branch has the lowest placement rate?",
  ];
}

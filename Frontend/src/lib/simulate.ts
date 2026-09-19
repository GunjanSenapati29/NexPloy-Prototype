// ============================================================
// SIMULATED INTELLIGENCE LAYER
// Every function here is deterministic (no Math.random) so a demo run
// always produces the same result. Production will later swap this file
// for real API/ML calls — src/app and src/features must never import
// mock intelligence logic from anywhere else, so that swap never touches
// presentation components.
//
// Nothing here is a real model. The UI labels every output as a
// prototype estimate.
// ============================================================

import { getMatch } from "@/data/mock/matches";
import { getStudentById, primaryStudent } from "@/data/mock/students";
import { scheduleConflicts } from "@/data/mock/schedules";
import type { CandidateMatch, Role } from "@/types";

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
  docker: "Complete Docker",
  dsa: "Improve DSA",
  mockInterviews: "3 Mock Interviews",
  newProject: "Build 1 New Project",
  communication: "Improve Communication",
};

/** Baseline is the primary student's current placement probability, so
 * the simulator never contradicts the Dashboard or Digital Twin. */
export const WHAT_IF_BASELINE = primaryStudent.placementProbability; // 68

// Fixed lookup table keyed by a sorted, joined factor signature so
// results are 100% deterministic regardless of toggle order.
const WHAT_IF_TABLE: Record<string, number> = {
  "": 68,
  aws: 72,
  "aws,dsa": 76,
  "aws,dsa,mockInterviews": 81,
  "aws,communication,docker,dsa,mockInterviews,newProject": 86,
};

const WHAT_IF_CEILING = 86;

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

  const describePath = () => {
    if (selected.length === 0)
      return "Start with AWS — it has the single largest impact on your placement probability.";
    if (selected.length >= ALL_FACTORS.length)
      return "You've built the best-case roadmap. Apply it to lock in these gains.";
    return "Add DSA and 3 mock interviews next for the fastest additional gain.";
  };

  if (exact !== undefined) {
    return {
      probability: exact,
      readinessImpact: Math.round((exact - WHAT_IF_BASELINE) * 0.6),
      recommendedPath: describePath(),
    };
  }

  // Deterministic fallback for any other combination: baseline + a fixed
  // per-factor weight, capped at the best-case value.
  const weights: Record<WhatIfFactor, number> = {
    aws: 4,
    docker: 3,
    dsa: 4,
    mockInterviews: 5,
    newProject: 3,
    communication: 3,
  };
  const gain = selected.reduce((sum, f) => sum + weights[f], 0);
  const probability = Math.min(WHAT_IF_CEILING, WHAT_IF_BASELINE + gain);
  return {
    probability,
    readinessImpact: Math.round((probability - WHAT_IF_BASELINE) * 0.6),
    recommendedPath: describePath(),
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

export const shortlistingSteps: StagedStep[] = [
  { label: "Re-checking eligibility...", durationMs: 240 },
  { label: "Confirming match thresholds...", durationMs: 240 },
  { label: "Updating candidate pipeline...", durationMs: 260 },
];

// ---- Eligibility & document checks -----------------------------------

export const eligibilityCheckSteps: StagedStep[] = [
  { label: "Reading drive criteria...", durationMs: 240 },
  { label: "Checking CGPA and branch...", durationMs: 240 },
  { label: "Checking backlogs and batch...", durationMs: 240 },
  { label: "Producing eligibility verdict...", durationMs: 260 },
];

export const documentVerificationSteps: StagedStep[] = [
  { label: "Opening submitted document...", durationMs: 240 },
  { label: "Matching against student record...", durationMs: 260 },
  { label: "Recording verification...", durationMs: 240 },
];

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

// ---- Resume intelligence ---------------------------------------------

export const resumeAnalysisSteps: StagedStep[] = [
  { label: "Reading resume sections...", durationMs: 260 },
  { label: "Matching against target role...", durationMs: 260 },
  { label: "Scoring impact statements...", durationMs: 260 },
  { label: "Generating recommendations...", durationMs: 280 },
];

export interface ResumeIntelligence {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  projectSuggestions: string[];
  recommendation: string;
}

export function simulateResumeIntelligence(studentId: string): ResumeIntelligence {
  const student = getStudentById(studentId) ?? primaryStudent;
  return {
    score: student.resumeScore,
    strengths: student.strengths.slice(0, 4),
    weaknesses: [
      "Projects describe scope but not measurable impact",
      "No deployment or infrastructure experience listed",
      "Testing and code quality practices are not mentioned",
    ],
    missingKeywords: [...student.criticalGaps, "Testing", "CI/CD"],
    projectSuggestions: [
      "Containerize the Campus Payments API and publish the Docker setup",
      "Deploy one project to AWS and document the architecture",
      "Add request-throughput and latency numbers to your API project",
    ],
    recommendation:
      "Add measurable project impact and deployment experience — both are the highest-signal additions for your target role.",
  };
}

// ---- NEXPLOY Copilot --------------------------------------------------

export type CopilotRoleContext = Role;

interface CannedAnswer {
  keywords: string[];
  answer: string;
}

const STUDENT_ANSWERS: CannedAnswer[] = [
  {
    keywords: ["readiness score", "why is my readiness", "readiness 78"],
    answer:
      "Your technical skills (82) and projects (88) are strong, but communication (69) and interview readiness (72) are pulling the overall score down to 78. Improving those two areas would have the largest effect on your readiness.",
  },
  {
    keywords: ["placement probability", "improve my placement", "improve my probability"],
    answer:
      "Your placement probability is 68%. The What-If Simulator shows AWS alone takes it to 72%, AWS + DSA to 76%, and adding 3 mock interviews to 81%. Those three actions are the highest-leverage path available to you right now.",
  },
  {
    keywords: ["prepare me for technova", "technova prep", "prepare for technova"],
    answer:
      "For TechNova — Backend Developer, your preparation score is 64%. Java, OOP and SQL are well covered; DSA (61%), Docker (25%) and AWS (12%) are not. Start with the DSA set, then containerize one project before the 22 Sep Technical Interview 1.",
  },
  {
    keywords: ["resume", "improve my resume"],
    answer:
      "Your resume scores 76/100. Java, Spring Boot and REST APIs come through clearly. It is missing Docker, AWS and testing keywords, and your projects describe scope rather than measurable impact. Add throughput or latency numbers and one deployed project.",
  },
  {
    keywords: ["skills am i missing", "what skills", "skill gap", "which skill"],
    answer:
      "Your HIGH priority gaps are Docker (Beginner → Intermediate) and AWS (None → Beginner). Communication (69 → 80) is MEDIUM priority. All three appear as required skills across your active drives.",
  },
  {
    keywords: ["top match", "explain my match", "best match", "which drive should i apply"],
    answer:
      "TechNova — Backend Developer is your top match at 91%. It is driven by a 92% skill match on Java/Spring Boot, 88% academics (8.59 CGPA) and 86% project relevance. Docker and cloud deployment experience are the gaps holding it back from higher.",
  },
  {
    keywords: ["shortlist", "not shortlisted", "rejected"],
    answer:
      "Where you weren't shortlisted, the recurring gap is missing cloud/deployment skills (Docker, AWS). Your core Java and Spring Boot signals are strong — closing those two gaps is the fastest way to raise your shortlist rate.",
  },
  {
    keywords: ["eligible", "eligibility"],
    answer:
      "You are ELIGIBLE for TechNova: CGPA 8.59 ≥ 7.0, CSE is in the allowed branch list, 0 backlogs ≤ maximum 1, and your 2027 graduation year matches. Eligibility is a rule check and is scored separately from your 91% match.",
  },
];

const RECRUITER_ANSWERS: CannedAnswer[] = [
  {
    keywords: ["why is rahul", "ranked first", "rahul ranked", "top candidate"],
    answer:
      "Rahul Sharma ranks first for TechNova at 91% overall fit — 100% eligibility, 92% skills match (strong Java/Spring Boot alignment), 89% resume relevance and 88% academics. His main gaps are Docker and cloud deployment experience.",
  },
  {
    keywords: ["strongest backend", "backend profile", "who has the strongest"],
    answer:
      "Rahul Sharma (91%) and Priya Das (87%) have the strongest backend profiles in this pool. Kavya Menon scores higher on raw engineering signal but works primarily in C++/Go, so her stack match against Java/Spring Boot is lower.",
  },
  {
    keywords: ["shortlist", "who should i shortlist"],
    answer:
      "The top four by fit are Rahul Sharma (91%), Priya Das (87%), Kavya Menon (85%) and Arjun Patel (83%) — all four pass every eligibility rule. Select them in the candidate pool and use Shortlist Selected to advance them together.",
  },
  {
    keywords: ["schedule", "interview", "slots"],
    answer:
      "Technical Interview 1 slots for 22 Sep are held in Lab 2 with Panel A. CloudSphere previously clashed with that slot; the placement office moved it to 2:30 PM in Lab 3, so your morning block is now clear.",
  },
];

const OFFICER_ANSWERS: CannedAnswer[] = [
  {
    keywords: ["intervention", "need intervention", "which students need"],
    answer:
      "4 students are flagged HIGH risk and need intervention. The highest priority are Aman Kumar (coding 41, no applications in 30 days, 3 active backlogs) and Sneha Das (3 unsuccessful interviews). Both have recommended actions in Risk Radar.",
  },
  {
    keywords: ["conflict", "which drive has a conflict", "scheduling conflict"],
    answer:
      "CloudSphere's 22 Sep 11:00 AM slot has a HIGH severity conflict — 38 student overlaps, Lab 2 double-booked with TechNova, and 2 faculty panel members assigned to both. The Drive Orchestrator recommends 2:30 PM in Lab 3.",
  },
  {
    keywords: ["lowest placement rate", "which branch", "branch has the lowest"],
    answer:
      "On Main Campus, Civil Engineering has the lowest placement rate at 58%, followed by Mechanical Engineering at 62%. Both sit well below the campus average of 81%.",
  },
  {
    keywords: ["not eligible", "eligibility", "who is not eligible"],
    answer:
      "For TechNova, Aman Kumar fails on active backlogs — 3 against a maximum of 1. Eligibility is evaluated as a deterministic rule check, so the failing criterion is always shown alongside the verdict in the Eligibility Matrix.",
  },
  {
    keywords: ["document", "pending verification"],
    answer:
      "Document tracking shows pending or needs-update items for 6 students. Rahul Sharma's semester mark sheets are pending verification, and Arjun Patel's 12th certificate needs a clearer re-upload.",
  },
];

const MENTOR_ANSWERS: CannedAnswer[] = [
  {
    keywords: ["which students", "at risk", "at-risk", "who needs"],
    answer:
      "You have 8 assigned students; 2 are HIGH risk. Aman Kumar is the most urgent — coding 41, communication 54, and no applications in 30 days. Sneha Das is next, with 3 unsuccessful interviews in the last month.",
  },
  {
    keywords: ["aman", "plan for aman", "intervention plan"],
    answer:
      "For Aman Kumar the recommended plan is: a daily DSA practice track, weekly communication sessions, a resume review, and a structured mock interview. Creating the plan moves it to ACTIVE, and progress is derived from the actions you tick off.",
  },
  {
    keywords: ["progress", "how are my students"],
    answer:
      "Across your active plans, Sneha Das is at 45% and improving on structured answers. Aman Kumar's plan has not been updated in 7 days — that is the one to touch first this week.",
  },
];

const ADMIN_ANSWERS: CannedAnswer[] = [
  {
    keywords: ["campus", "which campus", "compare campus", "cross-campus"],
    answer:
      "Main Campus leads at 81% placement with ₹6.8 LPA average, City Campus is at 76% with ₹6.2 LPA, and Engineering Campus at 73% with ₹5.9 LPA. Engineering Campus has the widest gap between placement-ready and placed students.",
  },
  {
    keywords: ["institute", "overall", "total"],
    answer:
      "Across all three campuses the institute tracks 3,614 students, 2,443 placement-ready, 706 offers and 267 at-risk cases. The blended placement rate is 53% of total enrolment and 81% of the final-year cohort on Main Campus.",
  },
  {
    keywords: ["role", "access", "permission"],
    answer:
      "The prototype defines five roles — Student, Recruiter, Placement Officer, Mentor and Super Admin. Each is scoped to its own route prefix; Super Admin additionally inspects campus operations. Role and Access shows the full matrix.",
  },
];

const ANSWER_TABLE: Record<CopilotRoleContext, CannedAnswer[]> = {
  student: STUDENT_ANSWERS,
  recruiter: RECRUITER_ANSWERS,
  officer: OFFICER_ANSWERS,
  mentor: MENTOR_ANSWERS,
  admin: ADMIN_ANSWERS,
};

const FALLBACK_ANSWER: Record<CopilotRoleContext, string> = {
  student:
    'I can help with readiness, skill gaps, drives and interview prep. Try "Why is my readiness score 78?" or "What skills am I missing?"',
  recruiter:
    'I can explain candidate rankings and matches. Try "Why is Rahul ranked first?" or "Who should I shortlist?"',
  officer:
    'I can surface risk, conflicts and analytics. Try "Which students need intervention?" or "Which drive has a conflict?"',
  mentor:
    'I can help with your mentees and their plans. Try "Which students are at risk?" or "What plan should I create for Aman?"',
  admin:
    'I can compare campuses and institute-level metrics. Try "Compare campus placement rates" or "Who can access what?"',
};

export function simulateCopilotResponse(question: string, roleContext: CopilotRoleContext): string {
  const q = question.toLowerCase();
  const table = ANSWER_TABLE[roleContext];
  const match = table.find((entry) => entry.keywords.some((k) => q.includes(k)));
  return match?.answer ?? FALLBACK_ANSWER[roleContext];
}

const SUGGESTED: Record<CopilotRoleContext, string[]> = {
  student: [
    "Why is my readiness score 78?",
    "How can I improve my placement probability?",
    "Prepare me for TechNova.",
    "What skills am I missing?",
    "Explain my top match.",
    "Improve my resume.",
  ],
  recruiter: [
    "Why is Rahul ranked first?",
    "Who has the strongest backend profile?",
    "Who should I shortlist?",
  ],
  officer: [
    "Which students need intervention?",
    "Which drive has a conflict?",
    "Which branch has the lowest placement rate?",
    "Who is not eligible for TechNova?",
  ],
  mentor: [
    "Which students are at risk?",
    "What plan should I create for Aman?",
    "How is my mentees' progress?",
  ],
  admin: [
    "Compare campus placement rates.",
    "How is the institute performing overall?",
    "Who can access what?",
  ],
};

export function getSuggestedQuestions(roleContext: CopilotRoleContext): string[] {
  return SUGGESTED[roleContext];
}

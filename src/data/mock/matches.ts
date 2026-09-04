import type { CandidateMatch } from "@/types";

// Explainable match breakdowns. Labeled everywhere in the UI as mocked
// prototype intelligence — production will replace this with a real
// matching pipeline over the same MatchBreakdown shape.
export const matches: CandidateMatch[] = [
  {
    id: "match_rahul_technova",
    studentId: "stu_rahul",
    driveId: "drv_technova",
    overallFit: 91,
    breakdown: {
      eligibility: 100,
      skills: 92,
      semanticMatch: 89,
      projects: 86,
      interview: 78,
      readiness: 82,
      academics: 88,
    },
    whySelected: [
      "Strong Java / Spring Boot alignment with the role's core stack",
      "Strong academic record (8.4 CGPA)",
      "Relevant backend projects demonstrating REST API design",
    ],
    weakOrMissing: ["Docker", "Cloud deployment experience"],
    recommendation: "Strong shortlist candidate.",
  },
  {
    id: "match_priya_technova",
    studentId: "stu_priya",
    driveId: "drv_technova",
    overallFit: 88,
    breakdown: {
      eligibility: 100,
      skills: 86,
      semanticMatch: 84,
      projects: 88,
      interview: 82,
      readiness: 85,
      academics: 92,
    },
    whySelected: [
      "Excellent academic record (8.9 CGPA)",
      "Strong system design fundamentals",
      "Consistent interview performance history",
    ],
    weakOrMissing: ["Java depth slightly behind Spring specialists"],
    recommendation: "Strong shortlist candidate.",
  },
  {
    id: "match_ankit_technova",
    studentId: "stu_ankit",
    driveId: "drv_technova",
    overallFit: 84,
    breakdown: {
      eligibility: 100,
      skills: 83,
      semanticMatch: 80,
      projects: 79,
      interview: 74,
      readiness: 79,
      academics: 76,
    },
    whySelected: ["Solid Java + Microservices exposure", "Good SQL fundamentals"],
    weakOrMissing: ["AWS", "System design depth"],
    recommendation: "Consider for shortlist.",
  },
  {
    id: "match_neha_technova",
    studentId: "stu_neha",
    driveId: "drv_technova",
    overallFit: 82,
    breakdown: {
      eligibility: 100,
      skills: 80,
      semanticMatch: 78,
      projects: 77,
      interview: 69,
      readiness: 76,
      academics: 82,
    },
    whySelected: ["Relevant Spring Boot + REST API project experience"],
    weakOrMissing: ["Docker", "System design", "Interview conversion"],
    recommendation: "Consider for shortlist.",
  },
];

export const getMatch = (studentId: string, driveId: string): CandidateMatch | undefined =>
  matches.find((m) => m.studentId === studentId && m.driveId === driveId);

export const getMatchesByDrive = (driveId: string): CandidateMatch[] =>
  matches.filter((m) => m.driveId === driveId).sort((a, b) => b.overallFit - a.overallFit);

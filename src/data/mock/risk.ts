import type { RiskEntry } from "@/types";

export const riskEntries: RiskEntry[] = [
  {
    studentId: "stu_amit",
    level: "HIGH",
    primaryReason: "No recent applications",
    factors: [
      { label: "Readiness dropped", detail: "Readiness dropped 5 points over the last 3 weeks" },
      { label: "No applications", detail: "No applications submitted in the last 21 days" },
      { label: "Low aptitude score", detail: "Aptitude assessment scored below cohort benchmark" },
      { label: "Communication gap", detail: "Communication score below placement benchmark" },
    ],
    recommendedActions: ["Assign Mentor", "Schedule Mock Interview", "Update Roadmap", "Recommend Relevant Drives"],
  },
  {
    studentId: "stu_sneha",
    level: "HIGH",
    primaryReason: "Repeated interview failures",
    factors: [
      { label: "Interview failures", detail: "3 unsuccessful interviews in the last month" },
      { label: "Readiness stagnant", detail: "Readiness score has plateaued for 4 weeks" },
      { label: "No applications", detail: "No new applications for 21 days" },
      { label: "Communication below benchmark", detail: "Communication score below placement benchmark" },
    ],
    recommendedActions: ["Assign Mentor", "Schedule Mock Interview", "Update Roadmap", "Recommend Relevant Drives"],
  },
  {
    studentId: "stu_neha",
    level: "MEDIUM",
    primaryReason: "Interview conversion below benchmark",
    factors: [
      { label: "Interview conversion", detail: "Shortlist-to-offer conversion below cohort average" },
      { label: "Skill gap", detail: "Docker and system design gaps flagged by recent drives" },
    ],
    recommendedActions: ["Schedule Mock Interview", "Update Roadmap"],
  },
  {
    studentId: "stu_rahul",
    level: "LOW",
    primaryReason: "On Track",
    factors: [{ label: "Steady growth", detail: "Readiness improved 20 points over 8 weeks" }],
    recommendedActions: ["View"],
  },
  {
    studentId: "stu_priya",
    level: "LOW",
    primaryReason: "On Track",
    factors: [{ label: "Strong trajectory", detail: "Consistently high readiness and interview conversion" }],
    recommendedActions: ["View"],
  },
  {
    studentId: "stu_ankit",
    level: "LOW",
    primaryReason: "On Track",
    factors: [{ label: "Steady growth", detail: "Readiness improved 24 points over 8 weeks" }],
    recommendedActions: ["View"],
  },
];

export const getRiskByStudent = (studentId: string): RiskEntry | undefined =>
  riskEntries.find((r) => r.studentId === studentId);

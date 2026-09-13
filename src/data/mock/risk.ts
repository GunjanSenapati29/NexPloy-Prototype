import type { RiskEntry } from "@/types";

export const riskEntries: RiskEntry[] = [
  {
    studentId: "stu_aman",
    level: "HIGH",
    primaryReason: "No applications in 30 days",
    factors: [
      { label: "Low coding score", detail: "Coding assessment scored 41 — placement benchmark is 65" },
      { label: "Communication gap", detail: "Communication scored 54 — below the 65 benchmark" },
      { label: "No applications", detail: "No applications submitted in the last 30 days" },
      { label: "Active backlogs", detail: "3 active backlogs block eligibility for most drives" },
    ],
    recommendedActions: ["Assign Mentor", "Schedule Mock Interview", "Update Roadmap", "Recommend Relevant Drives"],
  },
  {
    studentId: "stu_sneha",
    level: "HIGH",
    primaryReason: "Repeated interview failures",
    factors: [
      { label: "Poor interview performance", detail: "3 unsuccessful interviews in the last month" },
      { label: "Readiness stagnant", detail: "Readiness score has plateaued for 4 weeks" },
      { label: "Communication below benchmark", detail: "Communication scored 50 — below the 65 benchmark" },
    ],
    recommendedActions: ["Assign Mentor", "Schedule Mock Interview", "Update Roadmap", "Recommend Relevant Drives"],
  },
  {
    studentId: "stu_vikram",
    level: "HIGH",
    primaryReason: "Readiness declining with 2 active backlogs",
    factors: [
      { label: "Readiness dropped", detail: "Readiness fell 6 points over the last 5 weeks" },
      { label: "Active backlogs", detail: "2 active backlogs restrict eligibility" },
      { label: "Low programming score", detail: "Coding assessment scored 34" },
    ],
    recommendedActions: ["Assign Mentor", "Update Roadmap", "Recommend Relevant Drives"],
  },
  {
    studentId: "stu_amit",
    level: "HIGH",
    primaryReason: "No recent applications",
    factors: [
      { label: "Readiness dropped", detail: "Readiness dropped 5 points over the last 3 weeks" },
      { label: "No applications", detail: "Only 1 application submitted this cycle" },
      { label: "Low aptitude score", detail: "Aptitude scored 42 — below cohort benchmark" },
      { label: "Communication gap", detail: "Communication scored 45 — below the 65 benchmark" },
    ],
    recommendedActions: ["Assign Mentor", "Schedule Mock Interview", "Update Roadmap", "Recommend Relevant Drives"],
  },
  {
    studentId: "stu_farhan",
    level: "MEDIUM",
    primaryReason: "Low aptitude score for core drives",
    factors: [
      { label: "Aptitude below benchmark", detail: "Aptitude scored 58 against a 65 benchmark for core drives" },
      { label: "Thin project portfolio", detail: "No validated design project on the profile yet" },
    ],
    recommendedActions: ["Update Roadmap", "Recommend Relevant Drives"],
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
    studentId: "stu_rohit",
    level: "MEDIUM",
    primaryReason: "Active backlog limits drive eligibility",
    factors: [
      { label: "Active backlog", detail: "1 active backlog rules out zero-backlog drives" },
      { label: "DSA gap", detail: "Coding assessment scored 58" },
    ],
    recommendedActions: ["Update Roadmap", "Recommend Relevant Drives"],
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
    studentId: "stu_kavya",
    level: "LOW",
    primaryReason: "On Track",
    factors: [{ label: "Offer secured", detail: "QuantFlow offer accepted; documents verified" }],
    recommendedActions: ["View"],
  },
  {
    studentId: "stu_arjun",
    level: "LOW",
    primaryReason: "On Track",
    factors: [{ label: "Steady growth", detail: "Readiness improved 22 points over 8 weeks" }],
    recommendedActions: ["View"],
  },
  {
    studentId: "stu_ankit",
    level: "LOW",
    primaryReason: "On Track",
    factors: [{ label: "Steady growth", detail: "Readiness improved 24 points over 8 weeks" }],
    recommendedActions: ["View"],
  },
  {
    studentId: "stu_isha",
    level: "LOW",
    primaryReason: "On Track",
    factors: [{ label: "Offer in hand", detail: "FinEdge offer received and awaiting decision" }],
    recommendedActions: ["View"],
  },
  {
    studentId: "stu_meera",
    level: "LOW",
    primaryReason: "On Track",
    factors: [{ label: "Steady growth", detail: "Readiness improved 18 points over 8 weeks" }],
    recommendedActions: ["View"],
  },
];

export const getRiskByStudent = (studentId: string): RiskEntry | undefined =>
  riskEntries.find((r) => r.studentId === studentId);

export const RISK_ORDER: Record<RiskEntry["level"], number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

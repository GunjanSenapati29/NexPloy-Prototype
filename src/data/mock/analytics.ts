import type { Alert, AnalyticsSnapshot, BranchStat, FunnelStage, SkillDemand } from "@/types";

// All numbers here are labeled "Demo Data" / "Prototype Data" in the UI —
// never presented as real institutional statistics.
export const analyticsSnapshot: AnalyticsSnapshot = {
  totalStudents: 2148,
  placementReady: 1489,
  atRisk: 137,
  activeDrives: 18,
  offersCount: 426,
  placementRate: 81,
  recruitersCount: 60,
};

export const landingMetrics = {
  students: 2148,
  placementRate: 81,
  offers: 426,
  recruiters: 60,
};

export const branchStats: BranchStat[] = [
  { branch: "Computer Science", placementRate: 91, studentsPlaced: 402, totalStudents: 442 },
  { branch: "Information Technology", placementRate: 87, studentsPlaced: 298, totalStudents: 342 },
  { branch: "Electronics & Communication", placementRate: 76, studentsPlaced: 251, totalStudents: 330 },
  { branch: "Mechanical Engineering", placementRate: 62, studentsPlaced: 178, totalStudents: 287 },
  { branch: "Civil Engineering", placementRate: 58, studentsPlaced: 121, totalStudents: 209 },
  { branch: "Electrical Engineering", placementRate: 71, studentsPlaced: 165, totalStudents: 232 },
];

export const skillDemand: SkillDemand[] = [
  { skill: "Cloud (AWS/Azure)", demandScore: 96 },
  { skill: "Docker / Kubernetes", demandScore: 89 },
  { skill: "SQL", demandScore: 84 },
  { skill: "Java / Spring Boot", demandScore: 81 },
  { skill: "Python", demandScore: 78 },
  { skill: "System Design", demandScore: 74 },
  { skill: "React / Frontend", demandScore: 69 },
];

export const placementFunnel: FunnelStage[] = [
  { stage: "Registered", count: 2148 },
  { stage: "Placement Ready", count: 1489 },
  { stage: "Applied", count: 1204 },
  { stage: "Shortlisted", count: 812 },
  { stage: "Interviewed", count: 610 },
  { stage: "Offered", count: 426 },
];

export const readinessDistribution = [
  { band: "0-40", count: 118 },
  { band: "41-60", count: 342 },
  { band: "61-80", count: 981 },
  { band: "81-100", count: 707 },
];

export const riskDistribution = [
  { level: "LOW", count: 1642 },
  { level: "MEDIUM", count: 369 },
  { level: "HIGH", count: 137 },
];

export const offerPipeline = [
  { month: "Apr", offers: 38 },
  { month: "May", offers: 61 },
  { month: "Jun", offers: 74 },
  { month: "Jul", offers: 96 },
  { month: "Aug", offers: 88 },
  { month: "Sep", offers: 69 },
];

export const commandCenterAlerts: Alert[] = [
  { id: "alert_1", severity: "HIGH", message: "42 students require intervention." },
  { id: "alert_2", severity: "HIGH", message: "Drive scheduling conflict detected." },
  { id: "alert_3", severity: "MEDIUM", message: "27 students have not applied recently." },
  { id: "alert_4", severity: "LOW", message: "Cloud skills demand increased." },
];

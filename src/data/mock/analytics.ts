import type { Alert, AnalyticsSnapshot, BranchStat, FunnelStage, SkillDemand } from "@/types";
import { campuses, DEFAULT_CAMPUS_ID, instituteTotals } from "@/data/mock/campuses";

// ============================================================
// All numbers here are labeled "Demo Data" in the UI — never presented
// as real institutional statistics. Every figure is keyed by campus so
// the Campus Switcher changes metrics consistently across the app.
// ============================================================

export interface CampusAnalytics {
  snapshot: AnalyticsSnapshot;
  branchStats: BranchStat[];
  funnel: FunnelStage[];
  offerPipeline: { month: string; offers: number }[];
  salaryTrend: { month: string; averageLpa: number; highestLpa: number }[];
  readinessDistribution: { band: string; count: number }[];
  riskDistribution: { level: string; count: number }[];
  recruiterEngagement: { company: string; drives: number; offers: number }[];
  alerts: Alert[];
}

const mainCampus: CampusAnalytics = {
  snapshot: {
    totalStudents: 2148,
    placementReady: 1489,
    atRisk: 137,
    activeDrives: 18,
    applications: 1204,
    offersCount: 426,
    studentsPlaced: 1210,
    placementRate: 81,
    recruitersCount: 60,
    averageCtc: "₹6.8 LPA",
    highestCtc: "₹14.0 LPA",
  },
  branchStats: [
    { branch: "Computer Science", branchCode: "CSE", placementRate: 86, studentsPlaced: 402, totalStudents: 468 },
    { branch: "Information Technology", branchCode: "IT", placementRate: 82, studentsPlaced: 298, totalStudents: 363 },
    { branch: "Electronics & Communication", branchCode: "ECE", placementRate: 74, studentsPlaced: 251, totalStudents: 339 },
    { branch: "Electrical Engineering", branchCode: "EEE", placementRate: 69, studentsPlaced: 165, totalStudents: 239 },
    { branch: "Mechanical Engineering", branchCode: "MECH", placementRate: 62, studentsPlaced: 178, totalStudents: 287 },
    { branch: "Civil Engineering", branchCode: "CIVIL", placementRate: 58, studentsPlaced: 121, totalStudents: 209 },
  ],
  funnel: [
    { stage: "Registered", count: 2148 },
    { stage: "Placement Ready", count: 1489 },
    { stage: "Applied", count: 1204 },
    { stage: "Shortlisted", count: 812 },
    { stage: "Interviewed", count: 610 },
    { stage: "Offered", count: 426 },
    { stage: "Joined", count: 312 },
  ],
  offerPipeline: [
    { month: "Apr", offers: 38 },
    { month: "May", offers: 61 },
    { month: "Jun", offers: 74 },
    { month: "Jul", offers: 96 },
    { month: "Aug", offers: 88 },
    { month: "Sep", offers: 69 },
  ],
  salaryTrend: [
    { month: "Apr", averageLpa: 6.1, highestLpa: 10.5 },
    { month: "May", averageLpa: 6.3, highestLpa: 11.2 },
    { month: "Jun", averageLpa: 6.4, highestLpa: 12.0 },
    { month: "Jul", averageLpa: 6.6, highestLpa: 13.5 },
    { month: "Aug", averageLpa: 6.7, highestLpa: 14.0 },
    { month: "Sep", averageLpa: 6.8, highestLpa: 14.0 },
  ],
  readinessDistribution: [
    { band: "0-40", count: 118 },
    { band: "41-60", count: 342 },
    { band: "61-80", count: 981 },
    { band: "81-100", count: 707 },
  ],
  riskDistribution: [
    { level: "LOW", count: 1642 },
    { level: "MEDIUM", count: 369 },
    { level: "HIGH", count: 137 },
  ],
  recruiterEngagement: [
    { company: "InnoSoft", drives: 4, offers: 112 },
    { company: "TechNova", drives: 3, offers: 86 },
    { company: "AeroBuild", drives: 3, offers: 78 },
    { company: "CloudSphere", drives: 3, offers: 41 },
    { company: "DataVision", drives: 2, offers: 33 },
    { company: "MediSys", drives: 2, offers: 24 },
  ],
  alerts: [
    { id: "alert_1", severity: "HIGH", message: "42 students require intervention." },
    { id: "alert_2", severity: "HIGH", message: "TechNova / CloudSphere drive scheduling conflict on 22 Sep." },
    { id: "alert_3", severity: "MEDIUM", message: "27 students have not applied to any drive in 30 days." },
    { id: "alert_4", severity: "MEDIUM", message: "18 documents are pending verification." },
    { id: "alert_5", severity: "LOW", message: "Cloud skills demand increased 9% this cycle." },
  ],
};

const cityCampus: CampusAnalytics = {
  snapshot: {
    totalStudents: 846,
    placementReady: 564,
    atRisk: 72,
    activeDrives: 11,
    applications: 498,
    offersCount: 168,
    studentsPlaced: 430,
    placementRate: 76,
    recruitersCount: 34,
    averageCtc: "₹6.2 LPA",
    highestCtc: "₹11.5 LPA",
  },
  branchStats: [
    { branch: "Computer Science", branchCode: "CSE", placementRate: 83, studentsPlaced: 154, totalStudents: 186 },
    { branch: "Information Technology", branchCode: "IT", placementRate: 79, studentsPlaced: 112, totalStudents: 142 },
    { branch: "Electronics & Communication", branchCode: "ECE", placementRate: 72, studentsPlaced: 89, totalStudents: 124 },
    { branch: "Electrical Engineering", branchCode: "EEE", placementRate: 66, studentsPlaced: 48, totalStudents: 73 },
    { branch: "Mechanical Engineering", branchCode: "MECH", placementRate: 61, studentsPlaced: 27, totalStudents: 44 },
  ],
  funnel: [
    { stage: "Registered", count: 846 },
    { stage: "Placement Ready", count: 564 },
    { stage: "Applied", count: 498 },
    { stage: "Shortlisted", count: 321 },
    { stage: "Interviewed", count: 238 },
    { stage: "Offered", count: 168 },
    { stage: "Joined", count: 121 },
  ],
  offerPipeline: [
    { month: "Apr", offers: 14 },
    { month: "May", offers: 22 },
    { month: "Jun", offers: 29 },
    { month: "Jul", offers: 38 },
    { month: "Aug", offers: 36 },
    { month: "Sep", offers: 29 },
  ],
  salaryTrend: [
    { month: "Apr", averageLpa: 5.6, highestLpa: 9.0 },
    { month: "May", averageLpa: 5.8, highestLpa: 9.6 },
    { month: "Jun", averageLpa: 5.9, highestLpa: 10.2 },
    { month: "Jul", averageLpa: 6.0, highestLpa: 11.0 },
    { month: "Aug", averageLpa: 6.1, highestLpa: 11.5 },
    { month: "Sep", averageLpa: 6.2, highestLpa: 11.5 },
  ],
  readinessDistribution: [
    { band: "0-40", count: 62 },
    { band: "41-60", count: 168 },
    { band: "61-80", count: 388 },
    { band: "81-100", count: 228 },
  ],
  riskDistribution: [
    { level: "LOW", count: 613 },
    { level: "MEDIUM", count: 161 },
    { level: "HIGH", count: 72 },
  ],
  recruiterEngagement: [
    { company: "FinEdge", drives: 3, offers: 42 },
    { company: "InnoSoft", drives: 2, offers: 38 },
    { company: "DataVision", drives: 2, offers: 31 },
    { company: "AeroBuild", drives: 2, offers: 29 },
    { company: "BrightLearn", drives: 1, offers: 18 },
  ],
  alerts: [
    { id: "alert_c1", severity: "HIGH", message: "19 students require intervention." },
    { id: "alert_c2", severity: "MEDIUM", message: "Backlog clearance is blocking 34 eligibility checks." },
    { id: "alert_c3", severity: "LOW", message: "FinEdge virtual drive registration is ahead of target." },
  ],
};

const enggCampus: CampusAnalytics = {
  snapshot: {
    totalStudents: 620,
    placementReady: 390,
    atRisk: 58,
    activeDrives: 8,
    applications: 352,
    offersCount: 112,
    studentsPlaced: 285,
    placementRate: 73,
    recruitersCount: 27,
    averageCtc: "₹5.9 LPA",
    highestCtc: "₹10.2 LPA",
  },
  branchStats: [
    { branch: "Computer Science", branchCode: "CSE", placementRate: 80, studentsPlaced: 96, totalStudents: 120 },
    { branch: "Information Technology", branchCode: "IT", placementRate: 76, studentsPlaced: 68, totalStudents: 89 },
    { branch: "Electronics & Communication", branchCode: "ECE", placementRate: 70, studentsPlaced: 54, totalStudents: 77 },
    { branch: "Mechanical Engineering", branchCode: "MECH", placementRate: 64, studentsPlaced: 44, totalStudents: 69 },
    { branch: "Civil Engineering", branchCode: "CIVIL", placementRate: 57, studentsPlaced: 23, totalStudents: 40 },
  ],
  funnel: [
    { stage: "Registered", count: 620 },
    { stage: "Placement Ready", count: 390 },
    { stage: "Applied", count: 352 },
    { stage: "Shortlisted", count: 224 },
    { stage: "Interviewed", count: 162 },
    { stage: "Offered", count: 112 },
    { stage: "Joined", count: 78 },
  ],
  offerPipeline: [
    { month: "Apr", offers: 9 },
    { month: "May", offers: 15 },
    { month: "Jun", offers: 19 },
    { month: "Jul", offers: 26 },
    { month: "Aug", offers: 24 },
    { month: "Sep", offers: 19 },
  ],
  salaryTrend: [
    { month: "Apr", averageLpa: 5.3, highestLpa: 8.4 },
    { month: "May", averageLpa: 5.5, highestLpa: 8.9 },
    { month: "Jun", averageLpa: 5.6, highestLpa: 9.4 },
    { month: "Jul", averageLpa: 5.7, highestLpa: 9.8 },
    { month: "Aug", averageLpa: 5.8, highestLpa: 10.2 },
    { month: "Sep", averageLpa: 5.9, highestLpa: 10.2 },
  ],
  readinessDistribution: [
    { band: "0-40", count: 48 },
    { band: "41-60", count: 142 },
    { band: "61-80", count: 274 },
    { band: "81-100", count: 156 },
  ],
  riskDistribution: [
    { level: "LOW", count: 436 },
    { level: "MEDIUM", count: 126 },
    { level: "HIGH", count: 58 },
  ],
  recruiterEngagement: [
    { company: "BrightLearn", drives: 3, offers: 31 },
    { company: "InnoSoft", drives: 2, offers: 26 },
    { company: "AeroBuild", drives: 2, offers: 24 },
    { company: "DataVision", drives: 1, offers: 18 },
  ],
  alerts: [
    { id: "alert_e1", severity: "HIGH", message: "14 students require intervention." },
    { id: "alert_e2", severity: "MEDIUM", message: "Mechanical placement rate trails the institute average." },
    { id: "alert_e3", severity: "LOW", message: "BrightLearn pooled drive capacity increased to 22." },
  ],
};

export const analyticsByCampus: Record<string, CampusAnalytics> = {
  cmp_main: mainCampus,
  cmp_city: cityCampus,
  cmp_engg: enggCampus,
};

export const getCampusAnalytics = (campusId: string): CampusAnalytics =>
  analyticsByCampus[campusId] ?? mainCampus;

/** Default campus view, kept as a named export for convenience. */
export const analyticsSnapshot = mainCampus.snapshot;
export const branchStats = mainCampus.branchStats;
export const placementFunnel = mainCampus.funnel;
export const offerPipeline = mainCampus.offerPipeline;
export const readinessDistribution = mainCampus.readinessDistribution;
export const riskDistribution = mainCampus.riskDistribution;
export const commandCenterAlerts = mainCampus.alerts;

export const DEFAULT_ANALYTICS_CAMPUS_ID = DEFAULT_CAMPUS_ID;

export const skillDemand: SkillDemand[] = [
  { skill: "Cloud (AWS/Azure)", demandScore: 96 },
  { skill: "Docker / Kubernetes", demandScore: 89 },
  { skill: "SQL", demandScore: 84 },
  { skill: "Java / Spring Boot", demandScore: 81 },
  { skill: "Python", demandScore: 78 },
  { skill: "System Design", demandScore: 74 },
  { skill: "React / Frontend", demandScore: 69 },
];

/** Cohort coverage of the same skills — the gap against demand is the
 * institutional skill-gap story on the Analytics page. */
export const skillSupply: { skill: string; demand: number; cohortCoverage: number }[] = [
  { skill: "Cloud (AWS/Azure)", demand: 96, cohortCoverage: 41 },
  { skill: "Docker / Kubernetes", demand: 89, cohortCoverage: 38 },
  { skill: "SQL", demand: 84, cohortCoverage: 76 },
  { skill: "Java / Spring Boot", demand: 81, cohortCoverage: 68 },
  { skill: "Python", demand: 78, cohortCoverage: 72 },
  { skill: "System Design", demand: 74, cohortCoverage: 34 },
  { skill: "React / Frontend", demand: 69, cohortCoverage: 58 },
];

export const landingMetrics = {
  students: instituteTotals.totalStudents,
  placementRate: mainCampus.snapshot.placementRate,
  offers: instituteTotals.offers,
  recruiters: instituteTotals.recruiters,
};

/** Cross-campus comparison table used by the Super Admin views. */
export const crossCampusComparison = campuses.map((c) => ({
  campus: c.name,
  city: c.city,
  students: c.totalStudents,
  ready: c.placementReady,
  placed: c.placed,
  placementRate: c.placementRate,
  averageCtc: c.averageCtc,
}));

// ============================================================
// NEXPLOY PROTOTYPE — SHARED TYPES
// These interfaces define the shape of every mock entity. Production
// will later populate these same shapes from real APIs/DB — component
// code should never need to change when that swap happens.
// ============================================================

export type Role = "student" | "recruiter" | "officer";

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type ApplicationStatus =
  | "eligible"
  | "applied"
  | "shortlisted"
  | "interview"
  | "offer"
  | "joined"
  | "rejected";

export type DocumentStatus = "VERIFIED" | "UNDER REVIEW" | "PENDING" | "UPLOADED";

export interface ReadinessBreakdown {
  technical: number;
  academic: number;
  interview: number;
  communication: number;
  projects: number;
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  priority: "HIGH" | "MEDIUM" | "LOW";
  whyItMatters: string;
  recommendedAction: string;
}

export interface RoadmapStep {
  id: string;
  week: string;
  title: string;
  description: string;
  estimatedImpact: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  branch: string;
  cgpa: number;
  year: string;
  avatarInitials: string;
  readiness: number; // 0-100
  placementProbability: number; // 0-100
  readinessTrend: number[];
  breakdown: ReadinessBreakdown;
  strengths: string[];
  criticalGaps: string[];
  targetRole: string;
  skillGaps: SkillGap[];
  roadmap: RoadmapStep[];
  riskLevel: RiskLevel;
  riskReason: string;
  activeDrives: number;
  applicationsCount: number;
  backlogs: number;
}

export interface EligibilityRule {
  label: string;
  passed: boolean;
  detail: string;
}

export interface SelectionRound {
  name: string;
  description: string;
}

export interface Drive {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  description: string;
  requiredSkills: string[];
  eligibility: EligibilityRule[];
  eligibilityResult: "ELIGIBLE" | "NOT ELIGIBLE";
  rounds: SelectionRound[];
  location: string;
  package: string;
  deadline: string;
  driveDate: string;
  driveTime: string;
  logoInitial: string;
}

export interface Recruiter {
  id: string;
  companyName: string;
  logoInitial: string;
  industry: string;
  aboutText: string;
  activeDrives: string[]; // drive ids
  website: string;
}

export interface Application {
  id: string;
  studentId: string;
  driveId: string;
  status: ApplicationStatus;
  appliedOn: string;
}

export interface MatchBreakdown {
  eligibility: number;
  skills: number;
  semanticMatch: number;
  projects: number;
  interview: number;
  readiness: number;
  academics: number;
}

export interface CandidateMatch {
  id: string;
  studentId: string;
  driveId: string;
  overallFit: number;
  breakdown: MatchBreakdown;
  whySelected: string[];
  weakOrMissing: string[];
  recommendation: string;
}

export interface Offer {
  id: string;
  studentId: string;
  driveId: string;
  companyName: string;
  role: string;
  package: string;
  location: string;
  joiningDate: string;
  status: "OFFER RECEIVED" | "ACCEPTED" | "DECLINED";
}

export interface DocumentItem {
  id: string;
  studentId: string;
  name: string;
  status: DocumentStatus;
  updatedOn: string;
}

export type NotificationType =
  | "eligibility"
  | "shortlist"
  | "interview"
  | "reschedule"
  | "document"
  | "offer";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface RiskFactor {
  label: string;
  detail: string;
}

export interface RiskEntry {
  studentId: string;
  level: RiskLevel;
  primaryReason: string;
  factors: RiskFactor[];
  recommendedActions: string[];
}

export interface ScheduleEvent {
  id: string;
  driveId: string;
  companyName: string;
  title: string;
  day: string;
  time: string;
  durationMins: number;
  hasConflict: boolean;
}

export interface ScheduleConflict {
  id: string;
  eventId: string;
  studentOverlap: number;
  venueIssue: string;
  panelIssue: string;
  severity: RiskLevel;
  recommendedFrom: string;
  recommendedTo: string;
  estimatedConflictReduction: number;
}

export interface AnalyticsSnapshot {
  totalStudents: number;
  placementReady: number;
  atRisk: number;
  activeDrives: number;
  offersCount: number;
  placementRate: number;
  recruitersCount: number;
}

export interface BranchStat {
  branch: string;
  placementRate: number;
  studentsPlaced: number;
  totalStudents: number;
}

export interface SkillDemand {
  skill: string;
  demandScore: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface Alert {
  id: string;
  severity: RiskLevel;
  message: string;
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

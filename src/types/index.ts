// ============================================================
// NEXPLOY PROTOTYPE — SHARED TYPES
// These interfaces define the shape of every mock entity. Production
// will later populate these same shapes from real APIs/DB — component
// code should never need to change when that swap happens.
// ============================================================

export type Role = "student" | "recruiter" | "officer" | "mentor" | "admin";

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type ApplicationStatus =
  | "eligible"
  | "applied"
  | "shortlisted"
  | "assessment"
  | "interview"
  | "selected"
  | "offer"
  | "joined"
  | "rejected";

export type DocumentStatus = "VERIFIED" | "UNDER REVIEW" | "PENDING" | "UPLOADED" | "NEEDS UPDATE";

export type PlacementStatus = "UNPLACED" | "IN PROCESS" | "OFFERED" | "PLACED";

// ---- Campus ----------------------------------------------------------

export interface Campus {
  id: string;
  name: string;
  city: string;
  totalStudents: number;
  placementReady: number;
  placed: number;
  atRisk: number;
  placementRate: number;
  averageCtc: string;
  highestCtc: string;
  activeDrives: number;
  offers: number;
  recruiters: number;
}

// ---- Student ---------------------------------------------------------

/** The eight employability dimensions shown on Readiness + Digital Twin. */
export interface ReadinessBreakdown {
  academic: number;
  technical: number;
  coding: number;
  aptitude: number;
  communication: number;
  projects: number;
  interview: number;
  placementActivity: number;
}

export interface AssessmentScores {
  aptitude: number;
  coding: number;
  technical: number;
  communication: number;
  mockInterview: number;
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  /** Human-readable level, e.g. "Beginner", "None", or a raw score. */
  currentLabel: string;
  targetLabel: string;
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
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
}

export interface StudentProject {
  name: string;
  stack: string[];
  summary: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  avatarInitials: string;

  // Academic
  campusId: string;
  department: string;
  branch: string;
  branchCode: string;
  batch: string;
  semester: number;
  graduationYear: number;
  year: string;
  cgpa: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  backlogs: number;
  backlogHistory: number;

  // Professional
  strengths: string[];
  criticalGaps: string[];
  projects: StudentProject[];
  certifications: string[];
  resumeScore: number;

  // Assessment
  assessments: AssessmentScores;

  // Preferences
  preferredRoles: string[];
  preferredDomains: string[];
  preferredLocations: string[];

  // Intelligence
  readiness: number; // 0-100
  placementProbability: number; // 0-100
  readinessTrend: number[];
  breakdown: ReadinessBreakdown;
  targetRole: string;
  skillGaps: SkillGap[];
  roadmap: RoadmapStep[];
  riskLevel: RiskLevel;
  riskReason: string;

  // Placement
  placementStatus: PlacementStatus;
  mentorId?: string;
  activeDrives: number;
  applicationsCount: number;
}

// ---- Drives & eligibility -------------------------------------------

export type DriveStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "COMPLETED";
export type DriveType = "On-Campus" | "Off-Campus" | "Virtual" | "Pooled";

/** Structured, machine-checkable criteria. src/lib/eligibility.ts
 * evaluates these against any Student — deterministic, explainable, and
 * deliberately kept separate from the Match Score. */
export interface EligibilityCriteria {
  minCgpa: number;
  allowedBranches: string[]; // branch codes, e.g. ["CSE", "IT"]
  maxBacklogs: number;
  graduationYear: number;
  minTenthPercentage?: number;
  minTwelfthPercentage?: number;
}

export interface EligibilityCheck {
  label: string;
  passed: boolean;
  /** Deterministic, human-readable proof, e.g. "8.59 >= 7.0". */
  detail: string;
}

export interface EligibilityResult {
  eligible: boolean;
  checks: EligibilityCheck[];
  failureReasons: string[];
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
  driveType: DriveType;
  campusId: string;
  status: DriveStatus;
  description: string;
  requiredSkills: string[];
  criteria: EligibilityCriteria;
  rounds: SelectionRound[];
  location: string;
  package: string;
  expectedHiring: number;
  deadline: string;
  driveDate: string;
  driveTime: string;
  venue: string;
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
  hqLocation: string;
  employees: string;
  hiringSince: number;
  studentsHired: number;
}

export interface Application {
  id: string;
  studentId: string;
  driveId: string;
  status: ApplicationStatus;
  appliedOn: string;
}

// ---- Matching --------------------------------------------------------

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

// ---- Interviews & assessments ---------------------------------------

export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface InterviewSlot {
  id: string;
  studentId: string;
  driveId: string;
  companyName: string;
  round: string;
  date: string;
  time: string;
  mode: "In-Person" | "Virtual";
  venue: string;
  panel: string;
  status: InterviewStatus;
  result: "CLEARED" | "NOT CLEARED" | "AWAITED";
}

// ---- Offers & documents ---------------------------------------------

export type OfferStatus = "OFFER RECEIVED" | "ACCEPTED" | "DECLINED" | "PENDING ACCEPTANCE";

export type OfferType = "Full-Time" | "Internship" | "PPO" | "Internship + PPO";

export interface Offer {
  id: string;
  studentId: string;
  driveId: string;
  companyName: string;
  role: string;
  package: string;
  offerType: OfferType;
  location: string;
  offerDate: string;
  acceptanceDeadline: string;
  joiningDate: string;
  status: OfferStatus;
  /** PPO tracking — set when the offer originated from an internship. */
  fromInternship?: string;
  documentsVerified: boolean;
  joined: boolean;
}

export interface DocumentItem {
  id: string;
  studentId: string;
  name: string;
  status: DocumentStatus;
  updatedOn: string;
  note?: string;
}

// ---- Notifications ---------------------------------------------------

export type NotificationType =
  | "drive"
  | "deadline"
  | "interview"
  | "offer"
  | "document"
  | "mentor"
  | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  audience: Role[];
}

// ---- Risk & mentoring ------------------------------------------------

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

export interface Mentor {
  id: string;
  name: string;
  avatarInitials: string;
  department: string;
  designation: string;
  email: string;
  campusId: string;
  assignedStudentIds: string[];
}

export type InterventionStatus = "PROPOSED" | "ACTIVE" | "COMPLETED";

export interface InterventionAction {
  id: string;
  label: string;
  done: boolean;
}

export interface InterventionPlan {
  id: string;
  studentId: string;
  mentorId: string;
  status: InterventionStatus;
  createdOn: string;
  focusAreas: string[];
  actions: InterventionAction[];
  progress: number; // 0-100
  notes: string;
}

// ---- Scheduling ------------------------------------------------------

export interface ScheduleEvent {
  id: string;
  driveId: string;
  companyName: string;
  title: string;
  day: string;
  date: string;
  time: string;
  endTime: string;
  venue: string;
  panel: string;
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
  recommendedVenue: string;
  estimatedConflictReduction: number;
}

// ---- Analytics -------------------------------------------------------

export interface AnalyticsSnapshot {
  totalStudents: number;
  placementReady: number;
  atRisk: number;
  activeDrives: number;
  applications: number;
  offersCount: number;
  studentsPlaced: number;
  placementRate: number;
  recruitersCount: number;
  averageCtc: string;
  highestCtc: string;
}

export interface BranchStat {
  branch: string;
  branchCode: string;
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

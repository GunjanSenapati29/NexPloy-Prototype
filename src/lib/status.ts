import type {
  ApplicationStatus,
  DocumentStatus,
  DriveStatus,
  OfferStatus,
  RiskLevel,
} from "@/types";

// ============================================================
// One place that maps every status enum to its badge variant, label and
// timeline position. Components import from here instead of declaring a
// competing Record<Status, ...> map per page — that is what caused the
// same status to render three different colours before.
// ============================================================

export type BadgeTone = "default" | "success" | "warning" | "risk" | "muted" | "outline";

// ---- Placement lifecycle --------------------------------------------

/** The full lifecycle a student moves through, as shown on the Placement
 * Journey timeline. Index positions are what `applicationStageIndex`
 * resolves to. */
export const PLACEMENT_JOURNEY_STAGES = [
  "APPLIED",
  "SHORTLISTED",
  "ASSESSMENT",
  "INTERVIEW",
  "SELECTED",
  "OFFER",
  "ACCEPTED",
  "DOCS",
  "JOINED",
] as const;

export const PLACEMENT_JOURNEY_FULL_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  ASSESSMENT: "Assessment",
  INTERVIEW: "Interview",
  SELECTED: "Selected",
  OFFER: "Offer Received",
  ACCEPTED: "Offer Accepted",
  DOCS: "Document Verification",
  JOINED: "Joined",
};

export const applicationStageIndex: Record<ApplicationStatus, number> = {
  eligible: -1,
  applied: 0,
  shortlisted: 1,
  assessment: 2,
  interview: 3,
  selected: 4,
  offer: 5,
  joined: 8,
  rejected: 0,
};

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  eligible: "ELIGIBLE",
  applied: "APPLIED",
  shortlisted: "SHORTLISTED",
  assessment: "ASSESSMENT",
  interview: "INTERVIEW",
  selected: "SELECTED",
  offer: "OFFER",
  joined: "JOINED",
  rejected: "NOT SELECTED",
};

export const applicationStatusTone: Record<ApplicationStatus, BadgeTone> = {
  eligible: "muted",
  applied: "default",
  shortlisted: "default",
  assessment: "warning",
  interview: "warning",
  selected: "success",
  offer: "success",
  joined: "success",
  rejected: "risk",
};

// ---- Documents -------------------------------------------------------

export const documentStatusTone: Record<DocumentStatus, BadgeTone> = {
  VERIFIED: "success",
  "UNDER REVIEW": "warning",
  PENDING: "muted",
  UPLOADED: "default",
  "NEEDS UPDATE": "risk",
};

// ---- Offers ----------------------------------------------------------

export const offerStatusTone: Record<OfferStatus, BadgeTone> = {
  "OFFER RECEIVED": "default",
  "PENDING ACCEPTANCE": "warning",
  ACCEPTED: "success",
  DECLINED: "risk",
};

// ---- Drives ----------------------------------------------------------

export const driveStatusTone: Record<DriveStatus, BadgeTone> = {
  DRAFT: "muted",
  ACTIVE: "success",
  CLOSED: "warning",
  COMPLETED: "default",
};

// ---- Risk ------------------------------------------------------------

export const riskTone: Record<RiskLevel, BadgeTone> = {
  HIGH: "risk",
  MEDIUM: "warning",
  LOW: "success",
};

export const riskOrder: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

/** Readiness bands used for colour coding and cohort grouping. */
export function readinessBand(value: number): { label: string; tone: BadgeTone } {
  if (value >= 80) return { label: "Placement Ready", tone: "success" };
  if (value >= 65) return { label: "Nearly Ready", tone: "default" };
  if (value >= 50) return { label: "Developing", tone: "warning" };
  return { label: "Needs Intervention", tone: "risk" };
}

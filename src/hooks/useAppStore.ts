"use client";

import { create } from "zustand";
import type {
  DocumentStatus,
  InterventionPlan,
  NotificationItem,
  OfferStatus,
  Role,
} from "@/types";
import { notifications as initialNotifications } from "@/data/mock/notifications";
import { interventionPlans as initialInterventions } from "@/data/mock/mentors";
import { DEFAULT_CAMPUS_ID } from "@/data/mock/campuses";

// ============================================================
// Single lightweight store for every demo interaction that must survive
// navigation: role, campus, notifications, shortlisting, offer decisions,
// document verification and mentor interventions.
//
// Deliberately NOT Redux — the prototype has no server state to
// normalize, and the existing zustand store already covers it.
// ============================================================

interface AppState {
  role: Role;
  /** True once the user has explicitly picked a role (topbar switcher or
   * demo login) — until then, the URL segment decides the role. */
  roleExplicit: boolean;
  setRole: (role: Role) => void;
  /** Used by RoleGuard to keep the store in sync with the URL segment
   * without marking the role as explicitly chosen. */
  adoptRole: (role: Role) => void;

  activeCampusId: string;
  setActiveCampusId: (id: string) => void;

  activeStudentId: string;
  setActiveStudentId: (id: string) => void;

  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  toggleCopilot: () => void;

  notifications: NotificationItem[];
  markRead: (id: string) => void;
  markAllRead: () => void;

  /** Candidate ids shortlisted through the recruiter bulk action. */
  shortlisted: string[];
  shortlistCandidates: (studentIds: string[]) => void;

  /** Offer decisions made during the demo, keyed by offer id. */
  offerDecisions: Record<string, OfferStatus>;
  decideOffer: (offerId: string, status: OfferStatus) => void;

  /** Document verifications made during the demo, keyed by document id. */
  documentDecisions: Record<string, DocumentStatus>;
  setDocumentStatus: (documentId: string, status: DocumentStatus) => void;

  interventions: InterventionPlan[];
  createIntervention: (plan: InterventionPlan) => void;
  activateIntervention: (planId: string) => void;
  toggleInterventionAction: (planId: string, actionId: string) => void;
  setInterventionProgress: (planId: string, progress: number) => void;

  toasts: { id: string; title: string; message: string }[];
  pushToast: (title: string, message: string) => void;
  dismissToast: (id: string) => void;
}

/** Progress is always derived from completed actions, so the number the
 * mentor sees can never drift from the checklist below it. */
function progressFromActions(plan: InterventionPlan): number {
  if (plan.actions.length === 0) return plan.progress;
  const done = plan.actions.filter((a) => a.done).length;
  return Math.round((done / plan.actions.length) * 100);
}

let toastCounter = 0;

export const useAppStore = create<AppState>((set) => ({
  role: "student",
  roleExplicit: false,
  setRole: (role) => set({ role, roleExplicit: true }),
  adoptRole: (role) => set({ role }),

  activeCampusId: DEFAULT_CAMPUS_ID,
  setActiveCampusId: (id) => set({ activeCampusId: id }),

  activeStudentId: "stu_rahul",
  setActiveStudentId: (id) => set({ activeStudentId: id }),

  copilotOpen: false,
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),

  notifications: initialNotifications,
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

  shortlisted: [],
  shortlistCandidates: (studentIds) =>
    set((s) => ({ shortlisted: Array.from(new Set([...s.shortlisted, ...studentIds])) })),

  offerDecisions: {},
  decideOffer: (offerId, status) =>
    set((s) => ({ offerDecisions: { ...s.offerDecisions, [offerId]: status } })),

  documentDecisions: {},
  setDocumentStatus: (documentId, status) =>
    set((s) => ({ documentDecisions: { ...s.documentDecisions, [documentId]: status } })),

  interventions: initialInterventions,
  createIntervention: (plan) => set((s) => ({ interventions: [...s.interventions, plan] })),
  activateIntervention: (planId) =>
    set((s) => ({
      interventions: s.interventions.map((p) =>
        p.id === planId ? { ...p, status: "ACTIVE" } : p,
      ),
    })),
  toggleInterventionAction: (planId, actionId) =>
    set((s) => ({
      interventions: s.interventions.map((p) => {
        if (p.id !== planId) return p;
        const next = {
          ...p,
          actions: p.actions.map((a) => (a.id === actionId ? { ...a, done: !a.done } : a)),
        };
        const progress = progressFromActions(next);
        return {
          ...next,
          progress,
          status: progress === 100 ? ("COMPLETED" as const) : next.status,
        };
      }),
    })),
  setInterventionProgress: (planId, progress) =>
    set((s) => ({
      interventions: s.interventions.map((p) => (p.id === planId ? { ...p, progress } : p)),
    })),

  toasts: [],
  pushToast: (title, message) =>
    set((s) => ({
      toasts: [...s.toasts, { id: `toast_${++toastCounter}`, title, message }],
    })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

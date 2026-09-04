"use client";

import { create } from "zustand";
import type { Role } from "@/types";
import { notifications as initialNotifications } from "@/data/mock/notifications";
import type { NotificationItem } from "@/types";

interface AppState {
  role: Role;
  setRole: (role: Role) => void;

  activeStudentId: string;
  setActiveStudentId: (id: string) => void;

  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  toggleCopilot: () => void;

  notifPanelOpen: boolean;
  setNotifPanelOpen: (open: boolean) => void;

  notifications: NotificationItem[];
  markAllRead: () => void;
  toasts: { id: string; title: string; message: string }[];
  pushToast: (title: string, message: string) => void;
  dismissToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: "student",
  setRole: (role) => set({ role }),

  activeStudentId: "stu_rahul",
  setActiveStudentId: (id) => set({ activeStudentId: id }),

  copilotOpen: false,
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),

  notifPanelOpen: false,
  setNotifPanelOpen: (open) => set({ notifPanelOpen: open }),

  notifications: initialNotifications,
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

  toasts: [],
  pushToast: (title, message) =>
    set((s) => ({
      toasts: [...s.toasts, { id: `toast_${Date.now()}_${Math.floor(performance.now())}`, title, message }],
    })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

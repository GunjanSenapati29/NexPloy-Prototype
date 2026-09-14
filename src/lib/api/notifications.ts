// ============================================================
// NOTIFICATIONS API — wraps src/data/mock/notifications.ts. Read-only:
// mark-as-read is demo interaction state owned by useAppStore, not
// fetched data, so it is not wrapped here.
// ============================================================

import {
  notifications,
  getNotificationsForRole,
  NOTIFICATION_CATEGORIES,
} from "@/data/mock/notifications";
import type { NotificationItem, Role } from "@/types";

/** GET /api/notifications */
export async function listNotifications(): Promise<NotificationItem[]> {
  return notifications;
}

/** GET /api/notifications?role=:role */
export async function listNotificationsForRole(role: Role): Promise<NotificationItem[]> {
  return getNotificationsForRole(role);
}

export { NOTIFICATION_CATEGORIES };

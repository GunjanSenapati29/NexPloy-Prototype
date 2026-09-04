"use client";

import { useAppStore } from "@/hooks/useAppStore";
import type { Role } from "@/types";

// Thin convenience wrapper — the "Switch Demo Role" control in the topbar
// writes here. This is NOT real auth/RBAC; it only changes which nav and
// screens are shown, exactly like production RBAC will later gate routes.
export function useRole(): { role: Role; setRole: (role: Role) => void } {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  return { role, setRole };
}

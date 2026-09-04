"use client";

import { useEffect } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import type { Role } from "@/types";

/** Keeps the zustand role in sync with the route segment the user is on
 * (e.g. landing directly on /recruiter/drives via a shared link, refresh,
 * or back/forward navigation) so the topbar/sidebar always match the URL. */
export function RoleSync({ role }: { role: Role }) {
  const setRole = useAppStore((s) => s.setRole);
  useEffect(() => {
    setRole(role);
  }, [role, setRole]);
  return null;
}

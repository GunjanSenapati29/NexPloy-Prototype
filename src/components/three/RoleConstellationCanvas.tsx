"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { roleDescription } from "@/components/layout/nav-config";
import type { ConstellationRole } from "@/components/three/RoleConstellation";

const RoleConstellation = dynamic(() => import("@/components/three/RoleConstellation"), {
  ssr: false,
  loading: () => null,
});

/** Static stand-in for mobile / reduced-motion / while the R3F chunk
 * loads — the same clickable avatar-card grid the hub used before going
 * 3D, so the page is never a blank gap and stays fully usable without
 * WebGL. */
function ConstellationFallback({ roles }: { roles: ConstellationRole[] }) {
  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {roles.map((r) => {
        const Icon = r.icon;
        return (
          <Link
            key={r.role}
            href={`/login/${r.role}`}
            className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card/60 px-4 py-6 text-center shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet/50 hover:bg-card hover:shadow-glow-strong focus-visible:-translate-y-1 focus-visible:border-violet/50 focus-visible:shadow-glow-strong focus-visible:outline-none active:translate-y-0 active:scale-[0.98]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-violet/30 bg-violet/10 text-violet-bright transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-sm font-semibold text-foreground">{r.label}</span>
            <span className="text-[11px] leading-snug text-muted-foreground">{roleDescription[r.role]}</span>
            <span className="mt-auto flex items-center gap-1 pt-1 text-[11px] font-medium text-violet-bright opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Continue <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Gated mount point for the login hub's 3D role picker — mirrors
 * NetworkCanvas.tsx's pattern: only mounts the R3F canvas on capable,
 * motion-enabled desktop viewports; everywhere else (mobile, reduced
 * motion, or while the chunk is still loading) it renders the same
 * choice as a static, fully clickable 2D grid.
 */
export function RoleConstellationCanvas({ roles }: { roles: ConstellationRole[] }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  if (reduced || isMobile) {
    return <ConstellationFallback roles={roles} />;
  }

  return (
    <div className="relative h-[480px] w-full">
      <RoleConstellation roles={roles} />
    </div>
  );
}

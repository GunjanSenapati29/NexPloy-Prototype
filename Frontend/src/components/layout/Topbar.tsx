"use client";

import { useRouter } from "next/navigation";
import { Menu, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { CampusSwitcher } from "@/components/layout/CampusSwitcher";
import { NotificationsPanel } from "@/components/layout/NotificationsPanel";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SidebarNav } from "@/components/layout/Sidebar";
import { useAppStore } from "@/hooks/useAppStore";
import { useRole } from "@/hooks/useRole";
import { roleLabel } from "@/components/layout/nav-config";
import { primaryStudent } from "@/data/mock/students";
import { activeRecruiter } from "@/data/mock/recruiters";
import { activeMentor } from "@/data/mock/mentors";
import { INSTITUTE_NAME } from "@/data/mock/campuses";
import type { Role } from "@/types";

/** Who the demo is "signed in" as for each role. */
function identityForRole(role: Role): { name: string; email: string; initials: string } {
  switch (role) {
    case "student":
      return {
        name: primaryStudent.name,
        email: primaryStudent.email,
        initials: primaryStudent.avatarInitials,
      };
    case "recruiter":
      return {
        name: `${activeRecruiter.companyName} Talent Team`,
        email: `talent@${activeRecruiter.website}`,
        initials: activeRecruiter.logoInitial,
      };
    case "mentor":
      return {
        name: activeMentor.name,
        email: activeMentor.email,
        initials: activeMentor.avatarInitials,
      };
    case "admin":
      return { name: INSTITUTE_NAME, email: "admin@nexploy.demo", initials: "NX" };
    case "officer":
    default:
      return { name: "Placement Office", email: "placements@nexploy.demo", initials: "PO" };
  }
}

export function Topbar() {
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const { role } = useRole();
  const router = useRouter();
  const identity = identityForRole(role);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <button
        onClick={() => setCopilotOpen(true)}
        className="flex max-w-md flex-1 items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-violet/40 hover:text-foreground"
      >
        <Sparkles className="h-3.5 w-3.5 text-violet-bright" />
        <span className="hidden sm:inline">Ask NEXPLOY anything...</span>
        <span className="sm:hidden">Ask NEXPLOY</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] sm:inline">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <CampusSwitcher />
        <RoleSwitcher />
        <ThemeToggle />
        <NotificationsPanel />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="ml-1 rounded-full ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Account menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{identity.initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{identity.name}</div>
              <div className="text-xs font-normal text-muted-foreground">{identity.email}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-violet-bright">
                {roleLabel[role]}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/login")} className="gap-2 text-risk">
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

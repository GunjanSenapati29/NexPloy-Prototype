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
import { NotificationsPanel } from "@/components/layout/NotificationsPanel";
import { SidebarNav } from "@/components/layout/Sidebar";
import { useAppStore } from "@/hooks/useAppStore";
import { getStudentById } from "@/data/mock/students";

export function Topbar() {
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const activeStudentId = useAppStore((s) => s.activeStudentId);
  const router = useRouter();
  const student = getStudentById(activeStudentId);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <button
        onClick={() => setCopilotOpen(true)}
        className="flex flex-1 max-w-md items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-violet/40 hover:text-foreground"
      >
        <Sparkles className="h-3.5 w-3.5 text-violet-bright" />
        <span className="hidden sm:inline">Ask Nexploy anything...</span>
        <span className="sm:hidden">Ask Nexploy</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] sm:inline">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <RoleSwitcher />
        <NotificationsPanel />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 rounded-full ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{student?.avatarInitials ?? "NX"}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{student?.name ?? "Demo User"}</div>
              <div className="text-xs font-normal text-muted-foreground">{student?.email ?? "demo@nexploy.demo"}</div>
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

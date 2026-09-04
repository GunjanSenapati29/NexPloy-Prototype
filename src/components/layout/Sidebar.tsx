"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";
import { navByRole } from "@/components/layout/nav-config";
import { Logo } from "@/components/layout/Logo";
import { useAppStore } from "@/hooks/useAppStore";
import { MessageSquareText } from "lucide-react";

export function SidebarNav() {
  const { role } = useRole();
  const pathname = usePathname();
  const sections = navByRole[role];
  const toggleCopilot = useAppStore((s) => s.toggleCopilot);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section, si) => (
          <div key={si} className="mb-5">
            {section.title && (
              <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/15 text-violet-bright"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <button
          onClick={toggleCopilot}
          className="flex w-full items-center gap-2.5 rounded-md border border-violet/30 bg-violet/10 px-2.5 py-2 text-sm font-medium text-violet-bright transition-colors hover:bg-violet/20"
        >
          <MessageSquareText className="h-4 w-4" />
          Nexploy Copilot
          <kbd className="ml-auto rounded border border-violet/30 bg-background/40 px-1.5 py-0.5 text-[10px] text-violet-bright">
            Ctrl K
          </kbd>
        </button>
      </div>
    </div>
  );
}

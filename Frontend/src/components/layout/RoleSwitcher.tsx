"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/useRole";
import { roleHome, roleIcon, roleLabel, roleOrder, roleDescription } from "@/components/layout/nav-config";
import type { Role } from "@/types";

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const router = useRouter();
  const Icon = roleIcon[role];

  const handleSwitch = (r: Role) => {
    setRole(r);
    router.push(roleHome[r]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-violet/30 bg-violet/5 text-foreground hover:bg-violet/15"
          aria-label={`Switch demo role — currently ${roleLabel[role]}`}
        >
          <Icon className="h-3.5 w-3.5 text-violet-bright" />
          <span className="hidden sm:inline">{roleLabel[role]}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">
          Switch Demo Role
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roleOrder.map((r) => {
          const RIcon = roleIcon[r];
          return (
            <DropdownMenuItem key={r} onClick={() => handleSwitch(r)} className="gap-2.5 py-2">
              <RIcon className="h-4 w-4 shrink-0 text-violet-bright" />
              <span className="min-w-0">
                <span className="block text-sm">{roleLabel[r]}</span>
                <span className="block text-[10px] text-muted-foreground">{roleDescription[r]}</span>
              </span>
              {role === r && (
                <span className="ml-auto shrink-0 text-[10px] text-violet-bright">Active</span>
              )}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <p className="px-2 py-1.5 text-[10px] leading-snug text-muted-foreground/70">
          Demo authentication — no real sign-in or backend authorization.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

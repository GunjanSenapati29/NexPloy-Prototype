"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, GraduationCap, Building2, ShieldCheck } from "lucide-react";
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
import { roleHome, roleLabel } from "@/components/layout/nav-config";
import type { Role } from "@/types";

const roleIcons: Record<Role, typeof GraduationCap> = {
  student: GraduationCap,
  recruiter: Building2,
  officer: ShieldCheck,
};

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const router = useRouter();
  const Icon = roleIcons[role];

  const handleSwitch = (r: Role) => {
    setRole(r);
    router.push(roleHome[r]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-violet/30 bg-violet/5 text-foreground hover:bg-violet/15">
          <Icon className="h-3.5 w-3.5 text-violet-bright" />
          <span className="hidden sm:inline">{roleLabel[role]}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">Switch Demo Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(roleLabel) as Role[]).map((r) => {
          const RIcon = roleIcons[r];
          return (
            <DropdownMenuItem key={r} onClick={() => handleSwitch(r)} className="gap-2">
              <RIcon className="h-4 w-4 text-violet-bright" />
              {roleLabel[r]}
              {role === r && <span className="ml-auto text-[10px] text-violet-bright">Active</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

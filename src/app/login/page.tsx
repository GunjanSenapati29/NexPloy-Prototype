"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/hooks/useAppStore";
import type { Role } from "@/types";
import { roleHome, roleIcon, roleLabel, roleOrder, roleDescription } from "@/components/layout/nav-config";
import { fadeUp } from "@/lib/motion-variants";

const demoEmail: Record<Role, string> = {
  student: "rahul.sharma@nexploy.demo",
  recruiter: "talent@technova.demo",
  officer: "placements@nexploy.demo",
  mentor: "anita.mishra@nexploy.demo",
  admin: "admin@nexploy.demo",
};

export default function LoginPage() {
  const router = useRouter();
  const setRole = useAppStore((s) => s.setRole);
  const [selected, setSelected] = useState<Role>("student");
  const [email, setEmail] = useState(demoEmail.student);
  const [password, setPassword] = useState("••••••••");

  const pickRole = (role: Role) => {
    setSelected(role);
    setEmail(demoEmail[role]);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selected);
    router.push(roleHome[selected]);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="relative hidden overflow-hidden bg-elevated lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(70% 60% at 20% 20%, hsl(var(--violet) / 0.22), transparent 70%)",
          }}
        />
        <Link href="/">
          <Logo />
        </Link>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            From Potential <span className="text-violet-bright">to Placement.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            One platform for students building readiness, recruiters finding the right fit, mentors
            closing the gaps, and placement teams running the entire cycle — powered by explainable
            placement intelligence.
          </p>
        </motion.div>
        <p className="text-xs text-muted-foreground/60">
          NEXPLOY Prototype — simulated data, no real authentication.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h2 className="text-xl font-semibold">Sign in to NEXPLOY</h2>
          <p className="mt-1 text-sm text-muted-foreground">Select a demo role to continue.</p>

          <div className="mt-6 grid grid-cols-5 gap-1.5">
            {roleOrder.map((role) => {
              const Icon = roleIcon[role];
              const active = selected === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => pickRole(role)}
                  aria-pressed={active}
                  title={roleDescription[role]}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border px-1 py-3 text-center transition-colors",
                    active
                      ? "border-violet/50 bg-violet/10 text-violet-bright"
                      : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-tight">
                    {roleLabel[role].split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {roleLabel[selected]} — {roleDescription[selected]}
          </p>

          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" variant="glow" className="w-full">
              Sign In as {roleLabel[selected]} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground/60">
              or continue with
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" type="button" disabled className="opacity-70">
              Google
            </Button>
            <Button variant="outline" type="button" disabled className="opacity-70">
              Microsoft
            </Button>
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground/60">
            Visual only — this prototype uses simulated sign-in.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Fingerprint,
  Target,
  ShieldCheck,
  CalendarClock,
  GraduationCap,
  Building2,
  Sparkles,
  ArrowUpRight,
  Gauge,
  HeartHandshake,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShaderBackground } from "@/components/ui/mesh-gradient";
import { Logo } from "@/components/layout/Logo";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { ScoreRing } from "@/components/intelligence/ScoreRing";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { NetworkCanvas } from "@/components/three/NetworkCanvas";
import { fadeUp, staggerContainer, staggerItem, showcaseEntrance } from "@/lib/motion-variants";
import { primaryStudent } from "@/data/mock/students";
import { landingMetrics } from "@/data/mock/analytics";
import { drives } from "@/data/mock/drives";
import { evaluateEligibility } from "@/lib/eligibility";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Students", href: "#students" },
  { label: "Recruiters", href: "#recruiters" },
  { label: "Placement Teams", href: "#officers" },
  { label: "Placement Intelligence", href: "#intelligence" },
];

const flowSteps = [
  { label: "Student", icon: GraduationCap },
  { label: "Skills", icon: Target },
  { label: "Readiness", icon: Gauge },
  { label: "Opportunity", icon: Sparkles },
  { label: "Recruiter", icon: Building2 },
  { label: "Offer", icon: ShieldCheck },
];

const demoStoryScript = [
  "Rahul opens his Placement Profile and Digital Twin — 78/100 readiness, refreshed live.",
  "Skill Gap flags Docker, AWS and Communication; the What-If Simulator stacks them to lift placement probability from 68% to 81%.",
  "He opens the TechNova drive — deterministic eligibility passes on every rule, and the match breakdown explains 91% line by line.",
  "Switch to Recruiter — the ranked candidate pool surfaces Rahul first; select and bulk shortlist.",
  "Switch to Placement Officer — the Command Center flags an at-risk student and a drive conflict; assign a mentor, then optimize the schedule.",
  "Switch to Mentor — activate the intervention plan and mark progress.",
  "Back as the student, accept the TechNova offer; verify the pending document as the officer.",
  "Finish as Super Admin — switch campus and watch every institutional metric change.",
];

const audienceCards = [
  {
    anchor: "students",
    icon: GraduationCap,
    title: "For Students",
    description:
      "See exactly where you stand, close the right skill gaps, and simulate how each action changes your placement probability before you commit the time.",
    cta: "Explore Student Experience",
  },
  {
    anchor: "recruiters",
    icon: Building2,
    title: "For Recruiters",
    description:
      "Rank candidates with a fully explainable match score — every point traced back to eligibility, skills, projects and readiness signals.",
    cta: "Explore Recruiter Experience",
  },
  {
    anchor: "officers",
    icon: ShieldCheck,
    title: "For Placement Officers",
    description:
      "Run the whole cycle from one command center — eligibility rules, candidate review, drive scheduling, offers, documents and analytics.",
    cta: "Explore Officer Experience",
  },
  {
    anchor: "mentors",
    icon: HeartHandshake,
    title: "For Mentors",
    description:
      "Get the at-risk students who need you most, with the issues already identified and an intervention plan ready to activate and track.",
    cta: "Explore Mentor Experience",
  },
  {
    anchor: "admin",
    icon: Landmark,
    title: "For Institutes",
    description:
      "Compare every campus on one screen — placement rate, readiness, offers and average CTC — and drill into any campus operations.",
    cta: "Explore Institute Experience",
  },
];

const platformPillars = [
  {
    icon: Fingerprint,
    title: "Placement Digital Twin",
    description:
      "A continuously updated digital representation of every student's placement readiness and trajectory.",
  },
  {
    icon: Target,
    title: "Explainable Matching",
    description:
      "Every candidate ranking comes with a transparent, component-level breakdown — never a black box score.",
  },
  {
    icon: CalendarClock,
    title: "Drive Orchestrator",
    description: "Detects scheduling conflicts across drives and recommends optimal resolutions instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Radar",
    description: "Surfaces at-risk students early with clear factors and recommended interventions.",
  },
];

export function LandingPage() {
  const [watchOpen, setWatchOpen] = useState(false);

  // Derived from the same eligibility engine the app uses, so the hero
  // card can never drift from the student Drives screen.
  const eligibleDriveCount = drives.filter(
    (d) => d.status === "ACTIVE" && evaluateEligibility(primaryStudent, d).eligible,
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm" variant="glow">
              <Link href="/login">
                Explore Platform <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="platform" className="relative overflow-hidden">
        <div className="relative min-h-[640px] overflow-hidden">
          <ShaderBackground className="absolute inset-0" />
          <div className="relative z-10">
            <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
              <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                <motion.div variants={staggerItem}>
                  <Badge className="mb-5 border border-violet/30 bg-violet/10 text-violet-bright" variant="default">
                    <Sparkles className="mr-1 h-3 w-3" /> INTELLIGENCE BEFORE OPPORTUNITY
                  </Badge>
                </motion.div>
                <motion.h1 variants={staggerItem} className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  From Potential to <span className="text-violet-bright">Placement.</span>
                </motion.h1>
                <motion.p variants={staggerItem} className="mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
                  NEXPLOY is an AI-powered placement intelligence platform that helps students understand and
                  improve their placement readiness, intelligently connects candidates with opportunities, and
                  enables placement teams to optimize the complete campus placement lifecycle.
                </motion.p>
                <motion.div variants={staggerItem} className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" variant="glow">
                    <Link href="/login">
                      Explore NEXPLOY <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setWatchOpen(true)}>
                    <PlayCircle className="h-4 w-4" /> Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Digital Twin preview */}
              <motion.div initial="hidden" animate="visible" variants={showcaseEntrance}>
                <Card className="glass-panel relative overflow-hidden p-6 shadow-glow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Placement Digital Twin
                      </p>
                      <p className="text-sm font-semibold text-foreground">{primaryStudent.name}</p>
                    </div>
                    <DemoDataBadge />
                  </div>

                  <div className="mt-5 flex items-center gap-6">
                    <ScoreRing value={primaryStudent.readiness} size={116} strokeWidth={9} label="Readiness" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                        <span className="text-xs text-muted-foreground">Placement Probability</span>
                        <span className="text-sm font-semibold text-violet-bright tabular-nums">
                          {primaryStudent.placementProbability}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                        <span className="text-xs text-muted-foreground">Eligible Drives</span>
                        <span className="text-sm font-semibold tabular-nums">{eligibleDriveCount}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                        <span className="text-xs text-muted-foreground">Risk</span>
                        <Badge variant="success">{primaryStudent.riskLevel}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg border border-violet/30 bg-violet/5 px-3 py-2.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Top Opportunity</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Backend Developer · TechNova</span>
                      <span className="text-sm font-semibold text-violet-bright">91% match</span>
                    </div>
                  </div>

                  {/* flow strip */}
                  <div className="mt-6 flex items-center justify-between">
                    {flowSteps.map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.label} className="flex flex-1 items-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet/30 bg-violet/10">
                              <Icon className="h-4 w-4 text-violet-bright" />
                            </div>
                            <span className="text-[9px] text-muted-foreground">{step.label}</span>
                          </div>
                          {i < flowSteps.length - 1 && <div className="mx-1 h-px flex-1 bg-border" />}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="border-y border-border/60 bg-elevated/40">
          <div className="container grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
            {[
              { label: "Students", value: landingMetrics.students.toLocaleString() },
              { label: "Placement Rate", value: `${landingMetrics.placementRate}%` },
              { label: "Offers", value: landingMetrics.offers.toLocaleString() },
              { label: "Recruiters", value: `${landingMetrics.recruiters}+` },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="container pb-4 text-center">
            <DemoDataBadge />
          </div>
        </div>
      </section>

      {/* Placement Intelligence Network — high-intensity 3D showcase */}
      <section id="intelligence" className="relative overflow-hidden border-y border-border/60 bg-elevated/30">
        <div className="container py-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-violet-bright">
              Placement Intelligence Network
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">Every placement is a connected signal</h2>
            <p className="mt-3 text-muted-foreground">
              Readiness, opportunity, and hiring intent flow through one live network — not six disconnected
              spreadsheets.
            </p>
          </motion.div>

          <div className="relative mt-10 h-[420px] w-full sm:h-[480px]">
            <NetworkCanvas />
            <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 sm:left-4 sm:top-4 sm:translate-x-0">
              <div className="glass-panel flex items-center gap-3 rounded-xl px-3.5 py-2.5 shadow-glow">
                <ScoreRing value={primaryStudent.readiness} size={40} strokeWidth={4} />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Digital Twin</p>
                  <p className="text-xs font-semibold text-foreground">{primaryStudent.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform pillars */}
      <section className="container py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Placement Intelligence, end to end</h2>
          <p className="mt-3 text-muted-foreground">
            Four systems working together — readiness, matching, scheduling, and risk — so nothing about a
            placement cycle is a surprise.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {platformPillars.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.title} variants={staggerItem}>
                <DepthCard className="h-full p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet/10">
                    <Icon className="h-4 w-4 text-violet-bright" />
                  </div>
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                </DepthCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Who NEXPLOY is for */}
      <section className="container pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-violet-bright">
            One platform, five workspaces
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">Built for everyone in the cycle</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {audienceCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={staggerItem} id={card.anchor}>
                <DepthCard className="h-full p-7">
                  <Icon className="h-6 w-6 text-violet-bright" />
                  <h3 className="mt-3 text-lg font-semibold">{card.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                  <Button asChild variant="link" className="mt-3 px-0">
                    <Link href="/login">
                      {card.cta} <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </DepthCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 sm:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">
            NEXPLOY Prototype — interactive product demo. Simulated data throughout.
          </p>
        </div>
      </footer>

      <Dialog open={watchOpen} onOpenChange={setWatchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-violet-bright" /> Demo Walkthrough
            </DialogTitle>
            <DialogDescription>The interactive story this prototype is built to walk through.</DialogDescription>
          </DialogHeader>
          <ol className="space-y-3">
            {demoStoryScript.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/15 text-xs font-semibold text-violet-bright">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-foreground">{step}</span>
              </li>
            ))}
          </ol>
          <Button asChild variant="glow" className="mt-2">
            <Link href="/login">
              Start the walkthrough <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

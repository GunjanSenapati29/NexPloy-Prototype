# NEXPLOY Prototype

An interactive, frontend-only demo of **NEXPLOY** — an AI-powered Placement Intelligence & Career
Success Platform. This exists to show the product vision, UI/UX, navigation, role experiences, and
demo story before real development begins.

> **This repository contains the interactive NEXPLOY product prototype. It uses simulated data and
> does not contain the production backend, ML models, optimization engine, or Groq integration.**

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + a hand-built shadcn/ui-style component layer (dark "Placement Intelligence" theme)
- framer-motion for motion, recharts for charts, lucide-react for icons
- zustand for small cross-page app state (demo role, active student, copilot, notifications)
- No backend, no database, no auth provider, no external AI calls

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Demo Roles

Use the role selector on `/login`, or the "Switch Demo Role" control in the topbar once inside the
app, to move between:

- **Student** — Rahul Sharma's placement journey (Digital Twin, Skill Gap, Roadmap, What-If
  Simulator, Drives, Applications, Offers, Documents).
- **Recruiter** — TechNova's Backend Developer drive, ranked candidates, and explainable matching.
- **Placement Officer** — Command Center, Risk Radar, Drive Orchestrator, Analytics.

Switching roles is a UI-only convenience — it is not real authentication or authorization.

## Demo Flow

The primary walkthrough this prototype is built around:

1. **Landing** → *Explore NEXPLOY* → **Student Login**
2. **Student Dashboard** → **Digital Twin** (refresh it) → **Skill Gap** → **What-If Simulator**
   (stack AWS + DSA + Mock Interviews and watch probability climb)
3. **Placement Drives** → **TechNova** (eligibility + explainable match breakdown)
4. **Switch Role → Recruiter** → **Candidate Ranking** → **Rahul Sharma** → *Analyze Candidate* →
   91% explainable match
5. **Switch Role → Placement Officer** → **Command Center** → **Risk Radar** → **Drive
   Orchestrator** → open the CloudSphere conflict → *Optimize Schedule* → Conflict Resolved

Every button on this path is fully wired. Ctrl+K (or the "Ask Nexploy anything..." button) opens the
Nexploy Copilot from anywhere in the app — a role-aware canned-response palette, not a real LLM call.

## Architecture Notes

All mock data lives in `src/data/mock/*.ts`, typed and cross-referenced by id — the same entity's
numbers stay identical everywhere it appears. All simulated "intelligence" (Digital Twin refresh,
What-If scenarios, candidate matching, schedule optimization, Copilot answers) lives in
`src/lib/simulate.ts` as deterministic functions with no `Math.random`. This separation is
deliberate: production can swap mock data → real APIs, simulated auth → real auth/RBAC, simulated
readiness → a real readiness engine, mock matching → a real matching pipeline, mock prediction → ML,
mock scheduling → OR-Tools, and mock Copilot → a Groq-backed Copilot, without touching presentation
components.

## Deployment

This is a standard Next.js app — import the repository on [Vercel](https://vercel.com/new); it
auto-detects the framework and needs no environment variables.

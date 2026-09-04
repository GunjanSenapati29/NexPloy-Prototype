import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Fingerprint,
  Gauge,
  Target,
  Map,
  FlaskConical,
  Briefcase,
  ClipboardList,
  Award,
  FileText,
  Users,
  Building2,
  Sparkles,
  ShieldAlert,
  CalendarClock,
  BarChart3,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navByRole: Record<Role, NavSection[]> = {
  student: [
    { items: [{ label: "Overview", href: "/student", icon: LayoutDashboard }] },
    {
      title: "Intelligence",
      items: [
        { label: "Digital Twin", href: "/student/digital-twin", icon: Fingerprint },
        { label: "Readiness", href: "/student/readiness", icon: Gauge },
      ],
    },
    {
      title: "Opportunities",
      items: [
        { label: "Placement Drives", href: "/student/drives", icon: Briefcase },
        { label: "Applications", href: "/student/applications", icon: ClipboardList },
      ],
    },
    {
      title: "Growth",
      items: [
        { label: "Skill Gap", href: "/student/skill-gap", icon: Target },
        { label: "Roadmap", href: "/student/roadmap", icon: Map },
        { label: "What-If Simulator", href: "/student/what-if", icon: FlaskConical },
      ],
    },
    {
      title: "Activity",
      items: [
        { label: "Offers", href: "/student/offers", icon: Award },
        { label: "Documents", href: "/student/documents", icon: FileText },
      ],
    },
  ],
  recruiter: [
    { items: [{ label: "Dashboard", href: "/recruiter", icon: LayoutDashboard }] },
    {
      title: "Hiring",
      items: [{ label: "Placement Drives", href: "/recruiter/drives", icon: Briefcase }],
    },
  ],
  officer: [
    { items: [{ label: "Command Center", href: "/officer", icon: Sparkles }] },
    {
      title: "Talent",
      items: [
        { label: "Students", href: "/officer/students", icon: Users },
        { label: "Risk Radar", href: "/officer/risk", icon: ShieldAlert },
      ],
    },
    {
      title: "Drives",
      items: [
        { label: "Drives", href: "/officer/drives", icon: Building2 },
        { label: "Candidate Matching", href: "/officer/matching", icon: Target },
        { label: "Drive Orchestrator", href: "/officer/orchestrator", icon: CalendarClock },
      ],
    },
    {
      title: "Outcomes",
      items: [
        { label: "Offers", href: "/officer/offers", icon: Award },
        { label: "Documents", href: "/officer/documents", icon: FileText },
        { label: "Analytics", href: "/officer/analytics", icon: BarChart3 },
      ],
    },
  ],
};

export const roleHome: Record<Role, string> = {
  student: "/student",
  recruiter: "/recruiter",
  officer: "/officer",
};

export const roleLabel: Record<Role, string> = {
  student: "Student",
  recruiter: "Recruiter",
  officer: "Placement Officer",
};

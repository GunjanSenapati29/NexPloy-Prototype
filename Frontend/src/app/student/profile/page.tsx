import {
  UserSquare2,
  GraduationCap,
  Briefcase,
  ClipboardCheck,
  Heart,
  Mail,
  Phone,
  Award,
  FolderGit2,
  BadgeCheck,
} from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { SkillBar } from "@/components/intelligence/SkillBar";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import { primaryStudent } from "@/data/mock/students";
import { getCampusById } from "@/data/mock/campuses";
import { getMentorForStudent } from "@/data/mock/mentors";
import { drives } from "@/data/mock/drives";
import { evaluateEligibility } from "@/lib/eligibility";
import { readinessBand } from "@/lib/status";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

export default function PlacementProfilePage() {
  const s = primaryStudent;
  const campus = getCampusById(s.campusId);
  const mentor = getMentorForStudent(s.id);
  const band = readinessBand(s.readiness);

  const eligibleCount = drives.filter(
    (d) => d.status === "ACTIVE" && evaluateEligibility(s, d).eligible,
  ).length;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Profile"
        title="Placement Profile"
        subtitle="The single record every eligibility check, match score and readiness calculation reads from."
      />

      <DepthCard className="mb-5 p-5" tilt>
        <div className="flex flex-wrap items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{s.avatarInitials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="text-sm text-muted-foreground">
              {s.rollNumber} · {s.branch} · Batch {s.batch}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {s.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {s.phone}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={band.tone}>{band.label}</Badge>
            <Badge variant="default">{s.placementStatus}</Badge>
            <Badge variant="muted">{eligibleCount} eligible drives</Badge>
          </div>
        </div>
      </DepthCard>

      <DataReveal stagger className="grid gap-5 md:grid-cols-2">
        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-violet-bright" />
              <CardTitle>Academic Details</CardTitle>
            </div>
            <Field label="Campus" value={campus?.name ?? "—"} />
            <Field label="Department" value={s.department} />
            <Field label="Branch" value={`${s.branch} (${s.branchCode})`} />
            <Field label="Batch" value={s.batch} />
            <Field label="Semester" value={s.semester} />
            <Field label="Graduation Year" value={s.graduationYear} />
            <Field label="CGPA" value={s.cgpa.toFixed(2)} />
            <Field label="10th Percentage" value={`${s.tenthPercentage}%`} />
            <Field label="12th Percentage" value={`${s.twelfthPercentage}%`} />
            <Field
              label="Active Backlogs"
              value={
                <span className={s.backlogs > 0 ? "text-risk" : "text-success"}>{s.backlogs}</span>
              }
            />
            <Field label="Backlog History" value={s.backlogHistory} />
          </DepthCard>
        </DataRevealItem>

        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-violet-bright" />
              <CardTitle>Assessment Scores</CardTitle>
            </div>
            <div className="space-y-3">
              <SkillBar label="Aptitude" value={s.assessments.aptitude} />
              <SkillBar label="Coding" value={s.assessments.coding} />
              <SkillBar label="Technical" value={s.assessments.technical} />
              <SkillBar label="Communication" value={s.assessments.communication} />
              <SkillBar label="Mock Interview" value={s.assessments.mockInterview} />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Heart className="h-4 w-4 text-violet-bright" />
              <CardTitle>Placement Status</CardTitle>
            </div>
            <div className="mt-2">
              <Field label="Placement Status" value={s.placementStatus} />
              <Field label="Readiness" value={`${s.readiness} / 100`} />
              <Field label="Placement Probability" value={`${s.placementProbability}%`} />
              <Field label="Risk Level" value={s.riskLevel} />
              <Field label="Assigned Mentor" value={mentor?.name ?? "Not assigned"} />
            </div>
          </DepthCard>
        </DataRevealItem>

        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-violet-bright" />
              <CardTitle>Skills &amp; Certifications</CardTitle>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {s.strengths.map((skill) => (
                <Badge key={skill} variant="success">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Skills In Progress
            </p>
            <div className="flex flex-wrap gap-1.5">
              {s.criticalGaps.map((skill) => (
                <Badge key={skill} variant="risk">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="mb-2 mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5" /> Certifications
            </p>
            <ul className="space-y-1.5">
              {s.certifications.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-3.5 w-3.5 shrink-0 text-violet-bright" /> {c}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Resume score:{" "}
              <span className="font-semibold text-foreground">{s.resumeScore}/100</span> — see Resume
              Intelligence for the full breakdown.
            </p>
          </DepthCard>
        </DataRevealItem>

        <DataRevealItem>
          <DepthCard className="h-full p-5">
            <div className="mb-3 flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-violet-bright" />
              <CardTitle>Projects</CardTitle>
            </div>
            <div className="space-y-3">
              {s.projects.map((p) => (
                <div key={p.name} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.stack.map((t) => (
                      <Badge key={t} variant="muted">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2">
              <UserSquare2 className="h-4 w-4 text-violet-bright" />
              <CardTitle>Preferences</CardTitle>
            </div>
            <div className="mt-2 space-y-2.5">
              <div>
                <p className="text-xs text-muted-foreground">Preferred Roles</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {s.preferredRoles.map((r) => (
                    <Badge key={r} variant="default">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Preferred Domains</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {s.preferredDomains.map((r) => (
                    <Badge key={r} variant="muted">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Preferred Locations</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {s.preferredLocations.map((r) => (
                    <Badge key={r} variant="muted">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DepthCard>
        </DataRevealItem>
      </DataReveal>
    </div>
  );
}

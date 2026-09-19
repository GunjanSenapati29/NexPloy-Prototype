"use client";

import { CheckCircle2, XCircle, ShieldCheck, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { evaluateEligibility } from "@/lib/eligibility";
import { DataReveal, DataRevealItem } from "@/components/intelligence/DataReveal";
import type { Drive, Student } from "@/types";

/**
 * Renders the deterministic rule check from src/lib/eligibility.ts.
 * This is the ONE place eligibility is presented — reuse it on the
 * student drive page, the officer Eligibility Matrix drawer and the
 * recruiter candidate view rather than re-deriving verdicts per screen.
 */
export function EligibilityChecklist({
  student,
  drive,
  compact = false,
}: {
  student: Student;
  drive: Drive;
  compact?: boolean;
}) {
  const result = evaluateEligibility(student, drive);

  return (
    <div>
      <DataReveal stagger className={cn("space-y-2", compact && "space-y-1.5")}>
        {result.checks.map((check) => (
          <DataRevealItem key={check.label}>
            <div
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2",
                check.passed ? "border-border" : "border-risk/40 bg-risk/5",
              )}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{check.label}</p>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>
              <span
                className={cn(
                  "flex shrink-0 items-center gap-1 text-[11px] font-semibold uppercase tracking-wide",
                  check.passed ? "text-success" : "text-risk",
                )}
              >
                {check.passed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {check.passed ? "Pass" : "Fail"}
              </span>
            </div>
          </DataRevealItem>
        ))}
      </DataReveal>

      <div
        className={cn(
          "mt-3 flex items-center justify-between rounded-lg px-3 py-2.5",
          result.eligible ? "bg-success/10" : "bg-risk/10",
        )}
      >
        <span className="text-sm font-medium">Final Result</span>
        <Badge variant={result.eligible ? "success" : "risk"} className="gap-1">
          {result.eligible ? <ShieldCheck className="h-3 w-3" /> : <ShieldX className="h-3 w-3" />}
          {result.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
        </Badge>
      </div>

      {!result.eligible && (
        <p className="mt-2 text-xs text-risk">
          Blocked by: {result.failureReasons.join(" · ")}
        </p>
      )}

      <p className="mt-2 text-[11px] text-muted-foreground/70">
        Eligibility is a deterministic rule check against the drive&apos;s published criteria — it is
        scored separately from the AI match score.
      </p>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
  accent = "violet",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  accent?: "violet" | "success" | "warning" | "risk";
}) {
  const accentClass = {
    violet: "bg-violet/10 text-violet-bright",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    risk: "bg-risk/10 text-risk",
  }[accent];

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
        </div>
        {Icon && (
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", accentClass)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      {trend && (
        <p className={cn("mt-2 text-xs", trendPositive ? "text-success" : "text-risk")}>{trend}</p>
      )}
    </Card>
  );
}

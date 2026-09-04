import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-bright to-violet-soft shadow-glow">
        <span className="text-sm font-bold text-white">N</span>
      </div>
      {!iconOnly && <span className="text-[15px] font-semibold tracking-tight text-foreground">NEXPLOY</span>}
    </div>
  );
}

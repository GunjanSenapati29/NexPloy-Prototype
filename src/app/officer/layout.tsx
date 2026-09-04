import { AppShell } from "@/components/layout/AppShell";
import { RoleSync } from "@/components/layout/RoleSync";

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoleSync role="officer" />
      <AppShell>{children}</AppShell>
    </>
  );
}

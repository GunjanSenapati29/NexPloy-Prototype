import { AppShell } from "@/components/layout/AppShell";
import { RoleSync } from "@/components/layout/RoleSync";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoleSync role="student" />
      <AppShell>{children}</AppShell>
    </>
  );
}

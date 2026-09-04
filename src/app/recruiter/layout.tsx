import { AppShell } from "@/components/layout/AppShell";
import { RoleSync } from "@/components/layout/RoleSync";

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoleSync role="recruiter" />
      <AppShell>{children}</AppShell>
    </>
  );
}

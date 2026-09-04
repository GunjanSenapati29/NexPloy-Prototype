import { BarChart3 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { DemoDataBadge } from "@/components/layout/DemoDataBadge";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { VerticalBarChart } from "@/components/charts/VerticalBarChart";
import { branchStats, offerPipeline, skillDemand, analyticsSnapshot } from "@/data/mock/analytics";

export default function OfficerAnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Outcomes"
        title="Analytics"
        subtitle="Deeper cuts of placement performance across the campus."
        actions={<DemoDataBadge />}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-violet-bright" />
            <CardTitle>Offer Pipeline (Monthly)</CardTitle>
          </div>
          <VerticalBarChart data={offerPipeline} xKey="month" yKey="offers" colorVar="--success" />
        </Card>
        <Card className="p-5">
          <CardTitle className="mb-3">Skill Demand vs. Cohort Readiness</CardTitle>
          <HorizontalBarChart data={skillDemand.map((s) => ({ label: s.skill, value: s.demandScore }))} xKey="value" yKey="label" />
        </Card>
      </div>

      <Card className="mt-5 p-5">
        <CardTitle className="mb-3">Branch Performance</CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch</TableHead>
              <TableHead>Placement Rate</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead>Total Students</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branchStats.map((b) => (
              <TableRow key={b.branch}>
                <TableCell className="font-medium">{b.branch}</TableCell>
                <TableCell className="tabular-nums text-violet-bright">{b.placementRate}%</TableCell>
                <TableCell className="tabular-nums">{b.studentsPlaced}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{b.totalStudents}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Campus placement rate: <span className="font-medium text-foreground">{analyticsSnapshot.placementRate}%</span> across{" "}
        {analyticsSnapshot.totalStudents.toLocaleString()} students this cycle.
      </p>
    </div>
  );
}

import { InterventionDetail } from "@/features/mentor/InterventionDetail";
import { activeMentor } from "@/data/mock/mentors";

export function generateStaticParams() {
  return activeMentor.assignedStudentIds.map((id) => ({ id }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <InterventionDetail studentId={params.id} />;
}

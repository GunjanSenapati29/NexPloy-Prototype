import { notFound } from "next/navigation";
import { CandidateMatchingPage } from "@/features/recruiter/CandidateMatching";
import { students } from "@/data/mock/students";
import { getMatch } from "@/data/mock/matches";

const DRIVE_ID = "drv_technova";

export function generateStaticParams() {
  return students.map((s) => ({ id: s.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  const match = getMatch(params.id, DRIVE_ID);
  if (!match) notFound();
  return <CandidateMatchingPage studentId={params.id} driveId={DRIVE_ID} />;
}

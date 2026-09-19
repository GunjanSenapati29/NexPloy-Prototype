import { notFound } from "next/navigation";
import { CandidateMatchingPage } from "@/features/recruiter/CandidateMatching";
import { matches, getMatch } from "@/data/mock/matches";
import { FEATURED_DRIVE_ID } from "@/data/mock/drives";

/** Every student who has a match against the featured drive gets a page. */
export function generateStaticParams() {
  return matches
    .filter((m) => m.driveId === FEATURED_DRIVE_ID)
    .map((m) => ({ id: m.studentId }));
}

export default function Page({ params }: { params: { id: string } }) {
  const match = getMatch(params.id, FEATURED_DRIVE_ID);
  if (!match) notFound();
  return <CandidateMatchingPage studentId={params.id} driveId={FEATURED_DRIVE_ID} />;
}

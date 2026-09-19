import { primaryStudent } from "@/data/mock/students";
import { drives } from "@/data/mock/drives";
import { getMatchesByStudent } from "@/data/mock/matches";

// Single read-model for the Student sign-in visual. Everything that exists
// in the centralized mock data is read from it (Rahul, matches, drives);
// only the three headline counts below are not modelled there.
const top = getMatchesByStudent(primaryStudent.id)[0];
const topDrive = drives.find((d) => d.id === top?.driveId);

export const studentTwin = {
  name: primaryStudent.name,
  branchCode: primaryStudent.branchCode,
  graduationYear: primaryStudent.graduationYear,
  cgpa: primaryStudent.cgpa,
  backlogs: primaryStudent.backlogs,
  // Headline profile counts (not itemised in mock data — canonical demo values).
  skills: "15+",
  projects: 5,
  certifications: 7,
  readiness: primaryStudent.readiness,
  probability: primaryStudent.placementProbability,
  topMatchRole: topDrive?.role ?? primaryStudent.targetRole,
  topMatchScore: top?.overallFit ?? 91,
  topMatchCompany: topDrive?.companyName,
  gaps: primaryStudent.criticalGaps,
};

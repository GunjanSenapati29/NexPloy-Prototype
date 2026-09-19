import type { DocumentItem } from "@/types";

export const documents: DocumentItem[] = [
  // Rahul Sharma — includes the Pending → Verified demo interaction
  { id: "doc_1", studentId: "stu_rahul", name: "Resume", status: "VERIFIED", updatedOn: "2 Aug 2026" },
  { id: "doc_2", studentId: "stu_rahul", name: "Government ID", status: "VERIFIED", updatedOn: "2 Aug 2026" },
  { id: "doc_3", studentId: "stu_rahul", name: "10th Certificate", status: "VERIFIED", updatedOn: "2 Aug 2026" },
  { id: "doc_4", studentId: "stu_rahul", name: "12th Certificate", status: "VERIFIED", updatedOn: "2 Aug 2026" },
  {
    id: "doc_5",
    studentId: "stu_rahul",
    name: "Semester Mark Sheets",
    status: "PENDING",
    updatedOn: "29 Aug 2026",
    note: "Semester 6 mark sheet awaiting officer verification.",
  },
  {
    id: "doc_6",
    studentId: "stu_rahul",
    name: "Offer Letter — TechNova",
    status: "UPLOADED",
    updatedOn: "11 Sep 2026",
  },

  // Priya Das — fully compliant
  { id: "doc_7", studentId: "stu_priya", name: "Resume", status: "VERIFIED", updatedOn: "30 Jul 2026" },
  { id: "doc_8", studentId: "stu_priya", name: "Government ID", status: "VERIFIED", updatedOn: "30 Jul 2026" },
  { id: "doc_9", studentId: "stu_priya", name: "Semester Mark Sheets", status: "VERIFIED", updatedOn: "30 Jul 2026" },
  { id: "doc_10", studentId: "stu_priya", name: "Offer Letter — CloudSphere", status: "VERIFIED", updatedOn: "3 Sep 2026" },

  // Kavya Menon
  { id: "doc_11", studentId: "stu_kavya", name: "Resume", status: "VERIFIED", updatedOn: "28 Jul 2026" },
  { id: "doc_12", studentId: "stu_kavya", name: "Government ID", status: "VERIFIED", updatedOn: "28 Jul 2026" },
  { id: "doc_13", studentId: "stu_kavya", name: "Offer Letter — QuantFlow", status: "UNDER REVIEW", updatedOn: "6 Sep 2026" },

  // Arjun Patel
  { id: "doc_14", studentId: "stu_arjun", name: "Resume", status: "VERIFIED", updatedOn: "1 Aug 2026" },
  {
    id: "doc_15",
    studentId: "stu_arjun",
    name: "12th Certificate",
    status: "NEEDS UPDATE",
    updatedOn: "4 Sep 2026",
    note: "Scan is unreadable — re-upload a clearer copy.",
  },
  { id: "doc_16", studentId: "stu_arjun", name: "Semester Mark Sheets", status: "UNDER REVIEW", updatedOn: "5 Sep 2026" },

  // Ankit Rao
  { id: "doc_17", studentId: "stu_ankit", name: "Resume", status: "VERIFIED", updatedOn: "3 Aug 2026" },
  { id: "doc_18", studentId: "stu_ankit", name: "Government ID", status: "PENDING", updatedOn: "—" },

  // Neha Singh
  { id: "doc_19", studentId: "stu_neha", name: "Resume", status: "VERIFIED", updatedOn: "5 Aug 2026" },
  { id: "doc_20", studentId: "stu_neha", name: "Semester Mark Sheets", status: "PENDING", updatedOn: "—" },

  // Sneha Das
  { id: "doc_21", studentId: "stu_sneha", name: "Resume", status: "UNDER REVIEW", updatedOn: "1 Sep 2026" },
  { id: "doc_22", studentId: "stu_sneha", name: "10th Certificate", status: "VERIFIED", updatedOn: "20 Jul 2026" },

  // Aman Kumar
  {
    id: "doc_23",
    studentId: "stu_aman",
    name: "Resume",
    status: "NEEDS UPDATE",
    updatedOn: "12 Aug 2026",
    note: "No projects or measurable impact listed — mentor review requested.",
  },
  { id: "doc_24", studentId: "stu_aman", name: "Government ID", status: "VERIFIED", updatedOn: "12 Aug 2026" },

  // Isha Kulkarni
  { id: "doc_25", studentId: "stu_isha", name: "Resume", status: "VERIFIED", updatedOn: "7 Aug 2026" },
  { id: "doc_26", studentId: "stu_isha", name: "Offer Letter — FinEdge", status: "UPLOADED", updatedOn: "9 Sep 2026" },

  // Meera Iyer
  { id: "doc_27", studentId: "stu_meera", name: "Resume", status: "VERIFIED", updatedOn: "6 Aug 2026" },
  { id: "doc_28", studentId: "stu_meera", name: "Semester Mark Sheets", status: "VERIFIED", updatedOn: "6 Aug 2026" },
];

export const getDocumentsByStudent = (studentId: string): DocumentItem[] =>
  documents.filter((d) => d.studentId === studentId);

/** Documents every student is expected to file, shown as the checklist. */
export const REQUIRED_DOCUMENTS = [
  "Resume",
  "10th Certificate",
  "12th Certificate",
  "Semester Mark Sheets",
  "Government ID",
  "Offer Letter",
];

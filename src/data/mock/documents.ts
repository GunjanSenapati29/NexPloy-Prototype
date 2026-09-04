import type { DocumentItem } from "@/types";

export const documents: DocumentItem[] = [
  { id: "doc_1", studentId: "stu_rahul", name: "Resume", status: "VERIFIED", updatedOn: "2026-08-02" },
  { id: "doc_2", studentId: "stu_rahul", name: "Government ID", status: "VERIFIED", updatedOn: "2026-08-02" },
  { id: "doc_3", studentId: "stu_rahul", name: "10th Marksheet", status: "VERIFIED", updatedOn: "2026-08-02" },
  { id: "doc_4", studentId: "stu_rahul", name: "12th Marksheet", status: "VERIFIED", updatedOn: "2026-08-02" },
  { id: "doc_5", studentId: "stu_rahul", name: "Semester Marksheets", status: "UNDER REVIEW", updatedOn: "2026-08-29" },
  { id: "doc_6", studentId: "stu_rahul", name: "Degree Certificate", status: "PENDING", updatedOn: "—" },
  { id: "doc_7", studentId: "stu_rahul", name: "Offer Letter", status: "UPLOADED", updatedOn: "2026-08-31" },
];

export const getDocumentsByStudent = (studentId: string): DocumentItem[] =>
  documents.filter((d) => d.studentId === studentId);

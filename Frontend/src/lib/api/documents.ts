// ============================================================
// DOCUMENTS API — wraps src/data/mock/documents.ts.
// ============================================================

import { documents, getDocumentsByStudent, REQUIRED_DOCUMENTS } from "@/data/mock/documents";
import { documentVerificationSteps } from "@/lib/simulate";
import type { DocumentItem } from "@/types";

/** GET /api/documents */
export async function listDocuments(): Promise<DocumentItem[]> {
  return documents;
}

/** GET /api/students/:studentId/documents */
export async function listDocumentsByStudent(studentId: string): Promise<DocumentItem[]> {
  return getDocumentsByStudent(studentId);
}

export { REQUIRED_DOCUMENTS, documentVerificationSteps };

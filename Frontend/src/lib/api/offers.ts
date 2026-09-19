// ============================================================
// OFFERS API — wraps src/data/mock/offers.ts.
// ============================================================

import { offers, getOffersByStudent, getOffersByDrive, ppoOffers } from "@/data/mock/offers";
import type { Offer } from "@/types";

/** GET /api/offers */
export async function listOffers(): Promise<Offer[]> {
  return offers;
}

/** GET /api/students/:studentId/offers */
export async function listOffersByStudent(studentId: string): Promise<Offer[]> {
  return getOffersByStudent(studentId);
}

/** GET /api/drives/:driveId/offers */
export async function listOffersByDrive(driveId: string): Promise<Offer[]> {
  return getOffersByDrive(driveId);
}

/** GET /api/offers?type=PPO */
export async function listPpoOffers(): Promise<Offer[]> {
  return ppoOffers;
}

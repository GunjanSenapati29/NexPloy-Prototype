import type { Campus } from "@/types";

// Multi-campus demo dataset. Every institutional number in the app is
// derived from this list (see analytics.ts) so switching campus in the
// topbar changes metrics consistently everywhere.
export const campuses: Campus[] = [
  {
    id: "cmp_main",
    name: "Main Campus",
    city: "Bengaluru",
    totalStudents: 2148,
    placementReady: 1489,
    placed: 1210,
    atRisk: 137,
    placementRate: 81,
    averageCtc: "₹6.8 LPA",
    highestCtc: "₹14.0 LPA",
    activeDrives: 18,
    offers: 426,
    recruiters: 60,
  },
  {
    id: "cmp_city",
    name: "City Campus",
    city: "Pune",
    totalStudents: 846,
    placementReady: 564,
    placed: 430,
    atRisk: 72,
    placementRate: 76,
    averageCtc: "₹6.2 LPA",
    highestCtc: "₹11.5 LPA",
    activeDrives: 11,
    offers: 168,
    recruiters: 34,
  },
  {
    id: "cmp_engg",
    name: "Engineering Campus",
    city: "Hyderabad",
    totalStudents: 620,
    placementReady: 390,
    placed: 285,
    atRisk: 58,
    placementRate: 73,
    averageCtc: "₹5.9 LPA",
    highestCtc: "₹10.2 LPA",
    activeDrives: 8,
    offers: 112,
    recruiters: 27,
  },
];

export const INSTITUTE_NAME = "NEXPLOY Institute of Technology";

export const DEFAULT_CAMPUS_ID = "cmp_main";

export const getCampusById = (id: string): Campus | undefined =>
  campuses.find((c) => c.id === id);

/** Institute-wide totals — the Super Admin view sums every campus. */
export const instituteTotals = {
  totalStudents: campuses.reduce((n, c) => n + c.totalStudents, 0),
  placementReady: campuses.reduce((n, c) => n + c.placementReady, 0),
  placed: campuses.reduce((n, c) => n + c.placed, 0),
  atRisk: campuses.reduce((n, c) => n + c.atRisk, 0),
  offers: campuses.reduce((n, c) => n + c.offers, 0),
  activeDrives: campuses.reduce((n, c) => n + c.activeDrives, 0),
  recruiters: campuses.reduce((n, c) => n + c.recruiters, 0),
  placementRate: Math.round(
    (campuses.reduce((n, c) => n + c.placed, 0) /
      campuses.reduce((n, c) => n + c.totalStudents, 0)) *
      100,
  ),
};

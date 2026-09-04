import type { Offer } from "@/types";

export const offers: Offer[] = [
  {
    id: "off_rahul_technova",
    studentId: "stu_rahul",
    driveId: "drv_technova",
    companyName: "TechNova",
    role: "Backend Developer",
    package: "₹8.5 LPA",
    location: "Bengaluru",
    joiningDate: "2027-07-15",
    status: "OFFER RECEIVED",
  },
];

export const getOffersByStudent = (studentId: string): Offer[] =>
  offers.filter((o) => o.studentId === studentId);

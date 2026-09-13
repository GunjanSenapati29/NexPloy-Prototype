import type { Application } from "@/types";

export const applications: Application[] = [
  // Rahul Sharma — the primary demo journey
  { id: "app_1", studentId: "stu_rahul", driveId: "drv_technova", status: "offer", appliedOn: "20 Aug 2026" },
  { id: "app_2", studentId: "stu_rahul", driveId: "drv_cloudsphere", status: "interview", appliedOn: "22 Aug 2026" },
  { id: "app_3", studentId: "stu_rahul", driveId: "drv_innosoft", status: "shortlisted", appliedOn: "26 Aug 2026" },
  { id: "app_4", studentId: "stu_rahul", driveId: "drv_datavision", status: "applied", appliedOn: "1 Sep 2026" },
  { id: "app_5", studentId: "stu_rahul", driveId: "drv_quantflow", status: "eligible", appliedOn: "" },
  { id: "app_6", studentId: "stu_rahul", driveId: "drv_technova_intern", status: "joined", appliedOn: "10 Mar 2026" },

  // TechNova candidate pool
  { id: "app_7", studentId: "stu_priya", driveId: "drv_technova", status: "shortlisted", appliedOn: "19 Aug 2026" },
  { id: "app_8", studentId: "stu_arjun", driveId: "drv_technova", status: "assessment", appliedOn: "20 Aug 2026" },
  { id: "app_9", studentId: "stu_ankit", driveId: "drv_technova", status: "applied", appliedOn: "21 Aug 2026" },
  { id: "app_10", studentId: "stu_neha", driveId: "drv_technova", status: "applied", appliedOn: "23 Aug 2026" },
  { id: "app_11", studentId: "stu_kavya", driveId: "drv_technova", status: "selected", appliedOn: "18 Aug 2026" },

  // Other drives
  { id: "app_12", studentId: "stu_priya", driveId: "drv_cloudsphere", status: "interview", appliedOn: "21 Aug 2026" },
  { id: "app_13", studentId: "stu_kavya", driveId: "drv_quantflow", status: "offer", appliedOn: "24 Aug 2026" },
  { id: "app_14", studentId: "stu_arjun", driveId: "drv_innosoft", status: "shortlisted", appliedOn: "27 Aug 2026" },
  { id: "app_15", studentId: "stu_ankit", driveId: "drv_innosoft", status: "applied", appliedOn: "28 Aug 2026" },
  { id: "app_16", studentId: "stu_neha", driveId: "drv_datavision", status: "applied", appliedOn: "2 Sep 2026" },
  { id: "app_17", studentId: "stu_sneha", driveId: "drv_medisys", status: "interview", appliedOn: "10 Aug 2026" },
  { id: "app_18", studentId: "stu_sneha", driveId: "drv_datavision", status: "rejected", appliedOn: "5 Aug 2026" },
  { id: "app_19", studentId: "stu_amit", driveId: "drv_aerobuild", status: "applied", appliedOn: "29 Aug 2026" },
  { id: "app_20", studentId: "stu_isha", driveId: "drv_finedge", status: "shortlisted", appliedOn: "25 Aug 2026" },
  { id: "app_21", studentId: "stu_isha", driveId: "drv_datavision", status: "applied", appliedOn: "30 Aug 2026" },
  { id: "app_22", studentId: "stu_rohit", driveId: "drv_brightlearn", status: "applied", appliedOn: "1 Sep 2026" },
  { id: "app_23", studentId: "stu_meera", driveId: "drv_brightlearn", status: "shortlisted", appliedOn: "31 Aug 2026" },
  { id: "app_24", studentId: "stu_meera", driveId: "drv_datavision", status: "assessment", appliedOn: "2 Sep 2026" },
  { id: "app_25", studentId: "stu_farhan", driveId: "drv_aerobuild", status: "applied", appliedOn: "3 Sep 2026" },
  { id: "app_26", studentId: "stu_priya", driveId: "drv_cloudsphere_intern", status: "joined", appliedOn: "12 Mar 2026" },
];

export const getApplicationsByStudent = (studentId: string): Application[] =>
  applications.filter((a) => a.studentId === studentId);

export const getApplicationsByDrive = (driveId: string): Application[] =>
  applications.filter((a) => a.driveId === driveId);

export const getApplication = (studentId: string, driveId: string): Application | undefined =>
  applications.find((a) => a.studentId === studentId && a.driveId === driveId);

/** Ordered lifecycle used by the Placement Journey timeline. */
export const APPLICATION_FLOW: Application["status"][] = [
  "eligible",
  "applied",
  "shortlisted",
  "assessment",
  "interview",
  "selected",
  "offer",
  "joined",
];

import type { Application } from "@/types";

export const applications: Application[] = [
  { id: "app_1", studentId: "stu_rahul", driveId: "drv_technova", status: "shortlisted", appliedOn: "2026-08-20" },
  { id: "app_2", studentId: "stu_rahul", driveId: "drv_cloudsphere", status: "applied", appliedOn: "2026-08-22" },
  { id: "app_3", studentId: "stu_rahul", driveId: "drv_datavision", status: "eligible", appliedOn: "" },
  { id: "app_4", studentId: "stu_rahul", driveId: "drv_innosoft", status: "eligible", appliedOn: "" },

  { id: "app_5", studentId: "stu_priya", driveId: "drv_technova", status: "shortlisted", appliedOn: "2026-08-19" },
  { id: "app_6", studentId: "stu_ankit", driveId: "drv_technova", status: "applied", appliedOn: "2026-08-21" },
  { id: "app_7", studentId: "stu_neha", driveId: "drv_technova", status: "applied", appliedOn: "2026-08-23" },

  { id: "app_8", studentId: "stu_amit", driveId: "drv_innosoft", status: "eligible", appliedOn: "" },
  { id: "app_9", studentId: "stu_sneha", driveId: "drv_datavision", status: "interview", appliedOn: "2026-08-10" },
];

export const getApplicationsByStudent = (studentId: string): Application[] =>
  applications.filter((a) => a.studentId === studentId);

export const getApplicationsByDrive = (driveId: string): Application[] =>
  applications.filter((a) => a.driveId === driveId);

import type { ScheduleConflict, ScheduleEvent } from "@/types";

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "evt_technova",
    driveId: "drv_technova",
    companyName: "TechNova",
    title: "Backend Hiring Drive",
    day: "Monday",
    time: "10:00 AM",
    durationMins: 120,
    hasConflict: false,
  },
  {
    id: "evt_cloudsphere",
    driveId: "drv_cloudsphere",
    companyName: "CloudSphere",
    title: "Cloud Engineer Drive",
    day: "Tuesday",
    time: "11:00 AM",
    durationMins: 90,
    hasConflict: true,
  },
  {
    id: "evt_datavision",
    driveId: "drv_datavision",
    companyName: "DataVision",
    title: "Analyst Drive",
    day: "Wednesday",
    time: "10:30 AM",
    durationMins: 90,
    hasConflict: false,
  },
  {
    id: "evt_innosoft",
    driveId: "drv_innosoft",
    companyName: "InnoSoft",
    title: "Software Engineer Drive",
    day: "Friday",
    time: "9:30 AM",
    durationMins: 120,
    hasConflict: false,
  },
];

export const scheduleConflicts: ScheduleConflict[] = [
  {
    id: "conf_cloudsphere",
    eventId: "evt_cloudsphere",
    studentOverlap: 38,
    venueIssue: "Lab 2 double-booked",
    panelIssue: "2 faculty members unavailable",
    severity: "HIGH",
    recommendedFrom: "Tuesday 11:00 AM",
    recommendedTo: "Tuesday 2:30 PM",
    estimatedConflictReduction: 100,
  },
];

export const getConflictByEvent = (eventId: string): ScheduleConflict | undefined =>
  scheduleConflicts.find((c) => c.eventId === eventId);

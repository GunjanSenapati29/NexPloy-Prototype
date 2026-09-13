import type { ScheduleConflict, ScheduleEvent } from "@/types";

/** Columns of the Drive Orchestrator calendar — the 2026 drive week. */
export const scheduleDays = [
  { day: "Monday", date: "21 Sep" },
  { day: "Tuesday", date: "22 Sep" },
  { day: "Wednesday", date: "23 Sep" },
  { day: "Thursday", date: "24 Sep" },
  { day: "Friday", date: "25 Sep" },
];

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "evt_innosoft",
    driveId: "drv_innosoft",
    companyName: "InnoSoft",
    title: "Pre-Placement Talk",
    day: "Monday",
    date: "21 Sep",
    time: "2:00 PM",
    endTime: "3:30 PM",
    venue: "Auditorium",
    panel: "InnoSoft Engineering",
    durationMins: 90,
    hasConflict: false,
  },
  {
    id: "evt_technova",
    driveId: "drv_technova",
    companyName: "TechNova",
    title: "Backend Hiring Drive",
    day: "Tuesday",
    date: "22 Sep",
    time: "10:00 AM",
    endTime: "12:00 PM",
    venue: "Lab 2",
    panel: "Panel A — Dr. Anita Mishra, R. Iyer",
    durationMins: 120,
    hasConflict: false,
  },
  {
    id: "evt_cloudsphere",
    driveId: "drv_cloudsphere",
    companyName: "CloudSphere",
    title: "Cloud Engineer Drive",
    day: "Tuesday",
    date: "22 Sep",
    time: "11:00 AM",
    endTime: "1:00 PM",
    venue: "Lab 2",
    panel: "Panel A — Dr. Anita Mishra, R. Iyer",
    durationMins: 120,
    hasConflict: true,
  },
  {
    id: "evt_quantflow",
    driveId: "drv_quantflow",
    companyName: "QuantFlow",
    title: "Online Assessment",
    day: "Wednesday",
    date: "23 Sep",
    time: "9:00 AM",
    endTime: "11:00 AM",
    venue: "Lab 1",
    panel: "Automated",
    durationMins: 120,
    hasConflict: false,
  },
  {
    id: "evt_medisys",
    driveId: "drv_medisys",
    companyName: "MediSys",
    title: "Technical Screening",
    day: "Thursday",
    date: "24 Sep",
    time: "11:00 AM",
    endTime: "1:00 PM",
    venue: "Lab 3",
    panel: "Panel D — MediSys Firmware",
    durationMins: 120,
    hasConflict: false,
  },
  {
    id: "evt_datavision",
    driveId: "drv_datavision",
    companyName: "DataVision",
    title: "Analyst Briefing",
    day: "Friday",
    date: "25 Sep",
    time: "10:30 AM",
    endTime: "12:00 PM",
    venue: "Seminar Hall A",
    panel: "Panel B — DataVision Analytics",
    durationMins: 90,
    hasConflict: false,
  },
];

export const scheduleConflicts: ScheduleConflict[] = [
  {
    id: "conf_cloudsphere",
    eventId: "evt_cloudsphere",
    studentOverlap: 38,
    venueIssue: "Lab 2 double-booked with TechNova",
    panelIssue: "2 faculty panel members assigned to both drives",
    severity: "HIGH",
    recommendedFrom: "22 Sep · 11:00 AM – 1:00 PM · Lab 2",
    recommendedTo: "22 Sep · 2:30 PM – 4:30 PM",
    recommendedVenue: "Lab 3",
    estimatedConflictReduction: 100,
  },
];

export const getConflictByEvent = (eventId: string): ScheduleConflict | undefined =>
  scheduleConflicts.find((c) => c.eventId === eventId);

/** Venues and panels the officer manages, shown on the resource panel. */
export const venues = [
  { name: "Lab 1", capacity: 60, bookedSlots: 2 },
  { name: "Lab 2", capacity: 80, bookedSlots: 2 },
  { name: "Lab 3", capacity: 60, bookedSlots: 1 },
  { name: "Seminar Hall A", capacity: 120, bookedSlots: 1 },
  { name: "Seminar Hall B", capacity: 120, bookedSlots: 0 },
  { name: "Auditorium", capacity: 400, bookedSlots: 1 },
];

export const panels = [
  { name: "Panel A", members: "Dr. Anita Mishra, R. Iyer", assignedDrives: 2 },
  { name: "Panel B", members: "DataVision Analytics", assignedDrives: 1 },
  { name: "Panel C", members: "Prof. Rajesh Nair", assignedDrives: 1 },
  { name: "Panel D", members: "MediSys Firmware", assignedDrives: 1 },
];

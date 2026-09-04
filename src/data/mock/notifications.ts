import type { NotificationItem } from "@/types";

export const notifications: NotificationItem[] = [
  {
    id: "notif_1",
    type: "eligibility",
    title: "You're eligible for TechNova",
    message: "Backend Developer role — 91% match. Applications close Sep 18.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "notif_2",
    type: "shortlist",
    title: "You have been shortlisted",
    message: "TechNova moved you to the Technical Interview 1 round.",
    timestamp: "5 hours ago",
    read: false,
  },
  {
    id: "notif_3",
    type: "interview",
    title: "Interview scheduled tomorrow",
    message: "TechNova Technical Interview 1 at 10:30 AM. Be ready 10 minutes early.",
    timestamp: "1 day ago",
    read: false,
  },
  {
    id: "notif_4",
    type: "reschedule",
    title: "CloudSphere has been rescheduled",
    message: "Drive moved from Tue 11:00 AM to Tue 2:30 PM to resolve a scheduling conflict.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "notif_5",
    type: "document",
    title: "Document verification pending",
    message: "Your Degree Certificate is still pending upload.",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "notif_6",
    type: "offer",
    title: "Offer received from TechNova",
    message: "₹8.5 LPA · Bengaluru · Joining July 15, 2027.",
    timestamp: "3 days ago",
    read: true,
  },
];

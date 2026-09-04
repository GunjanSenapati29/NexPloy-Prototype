import type { Drive } from "@/types";

export const drives: Drive[] = [
  {
    id: "drv_technova",
    companyId: "rec_technova",
    companyName: "TechNova",
    role: "Backend Developer",
    description:
      "TechNova is hiring Backend Developers to build high-scale distributed services powering its fintech platform. You'll work with Java, Spring Boot, and cloud-native infrastructure.",
    requiredSkills: ["Java", "Spring Boot", "SQL", "REST APIs", "Docker", "AWS"],
    eligibility: [
      { label: "CGPA", passed: true, detail: "Requires 7.0+ — you have 8.4" },
      { label: "Branch", passed: true, detail: "CSE / IT eligible — you are CSE" },
      { label: "Backlogs", passed: true, detail: "Requires 0 active backlogs — you have 0" },
      { label: "Year", passed: true, detail: "Final year eligible" },
    ],
    eligibilityResult: "ELIGIBLE",
    rounds: [
      { name: "Online Assessment", description: "DSA + Java fundamentals, 90 minutes." },
      { name: "Technical Interview 1", description: "Core CS + Spring Boot deep dive." },
      { name: "Technical Interview 2", description: "System design + coding round." },
      { name: "HR Interview", description: "Culture fit and offer discussion." },
    ],
    location: "Bengaluru",
    package: "₹8.5 LPA",
    deadline: "2026-09-18",
    driveDate: "2026-09-22",
    driveTime: "10:00 AM",
    logoInitial: "T",
  },
  {
    id: "drv_cloudsphere",
    companyId: "rec_cloudsphere",
    companyName: "CloudSphere",
    role: "Cloud Engineer",
    description:
      "CloudSphere builds managed cloud infrastructure tooling. This role focuses on automation, deployment pipelines, and cloud-native architecture.",
    requiredSkills: ["AWS", "Docker", "Kubernetes", "Linux", "Python"],
    eligibility: [
      { label: "CGPA", passed: true, detail: "Requires 7.5+ — you have 8.4" },
      { label: "Branch", passed: true, detail: "CSE / IT / ECE eligible — you are CSE" },
      { label: "Backlogs", passed: true, detail: "Requires 0 active backlogs — you have 0" },
      { label: "Year", passed: true, detail: "Final year eligible" },
    ],
    eligibilityResult: "ELIGIBLE",
    rounds: [
      { name: "Online Assessment", description: "Cloud fundamentals + scripting, 60 minutes." },
      { name: "Technical Interview", description: "AWS + containerization scenarios." },
      { name: "Managerial Round", description: "Ownership and collaboration signals." },
    ],
    location: "Hyderabad",
    package: "₹9.2 LPA",
    deadline: "2026-09-15",
    driveDate: "2026-09-19",
    driveTime: "11:00 AM",
    logoInitial: "C",
  },
  {
    id: "drv_datavision",
    companyId: "rec_datavision",
    companyName: "DataVision",
    role: "Data Analyst",
    description:
      "DataVision helps enterprises turn raw data into decisions. Analysts here work across SQL pipelines, dashboards, and stakeholder reporting.",
    requiredSkills: ["SQL", "Python", "Excel", "Data Visualization", "Statistics"],
    eligibility: [
      { label: "CGPA", passed: true, detail: "Requires 7.0+ — you have 8.4" },
      { label: "Branch", passed: true, detail: "Any branch eligible" },
      { label: "Backlogs", passed: true, detail: "Requires 0 active backlogs — you have 0" },
      { label: "Year", passed: true, detail: "Final year eligible" },
    ],
    eligibilityResult: "ELIGIBLE",
    rounds: [
      { name: "Online Assessment", description: "SQL + analytical reasoning, 60 minutes." },
      { name: "Case Study Round", description: "Live data interpretation exercise." },
      { name: "HR Interview", description: "Culture fit and offer discussion." },
    ],
    location: "Pune",
    package: "₹7.2 LPA",
    deadline: "2026-09-25",
    driveDate: "2026-09-29",
    driveTime: "10:30 AM",
    logoInitial: "D",
  },
  {
    id: "drv_innosoft",
    companyId: "rec_innosoft",
    companyName: "InnoSoft",
    role: "Software Engineer",
    description:
      "InnoSoft builds enterprise SaaS products. This role spans full-stack feature development across a modern web + cloud stack.",
    requiredSkills: ["JavaScript", "React", "Node.js", "SQL", "Git"],
    eligibility: [
      { label: "CGPA", passed: true, detail: "Requires 7.0+ — you have 8.4" },
      { label: "Branch", passed: true, detail: "CSE / IT eligible — you are CSE" },
      { label: "Backlogs", passed: true, detail: "Requires 0 active backlogs — you have 0" },
      { label: "Year", passed: true, detail: "Final year eligible" },
    ],
    eligibilityResult: "ELIGIBLE",
    rounds: [
      { name: "Online Assessment", description: "Full-stack fundamentals, 75 minutes." },
      { name: "Technical Interview", description: "Live coding + architecture discussion." },
      { name: "HR Interview", description: "Culture fit and offer discussion." },
    ],
    location: "Chennai",
    package: "₹6.8 LPA",
    deadline: "2026-09-30",
    driveDate: "2026-10-03",
    driveTime: "9:30 AM",
    logoInitial: "I",
  },
];

export const getDriveById = (id: string): Drive | undefined =>
  drives.find((d) => d.id === id);

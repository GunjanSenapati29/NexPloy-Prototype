import type { Recruiter } from "@/types";

export const recruiters: Recruiter[] = [
  {
    id: "rec_technova",
    companyName: "TechNova",
    logoInitial: "T",
    industry: "Fintech / Enterprise Software",
    aboutText:
      "TechNova builds distributed backend platforms for financial institutions across Asia-Pacific.",
    activeDrives: ["drv_technova"],
    website: "technova.demo",
  },
  {
    id: "rec_cloudsphere",
    companyName: "CloudSphere",
    logoInitial: "C",
    industry: "Cloud Infrastructure",
    aboutText: "CloudSphere provides managed cloud automation and deployment tooling.",
    activeDrives: ["drv_cloudsphere"],
    website: "cloudsphere.demo",
  },
  {
    id: "rec_datavision",
    companyName: "DataVision",
    logoInitial: "D",
    industry: "Data & Analytics",
    aboutText: "DataVision converts enterprise data into actionable business intelligence.",
    activeDrives: ["drv_datavision"],
    website: "datavision.demo",
  },
  {
    id: "rec_innosoft",
    companyName: "InnoSoft",
    logoInitial: "I",
    industry: "Enterprise SaaS",
    aboutText: "InnoSoft builds SaaS products used by mid-market enterprises worldwide.",
    activeDrives: ["drv_innosoft"],
    website: "innosoft.demo",
  },
];

export const getRecruiterById = (id: string): Recruiter | undefined =>
  recruiters.find((r) => r.id === id);

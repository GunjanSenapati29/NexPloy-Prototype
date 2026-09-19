import type { InterventionPlan, Mentor } from "@/types";

export const mentors: Mentor[] = [
  {
    id: "men_anita",
    name: "Dr. Anita Mishra",
    avatarInitials: "AM",
    department: "Computer Science & Engineering",
    designation: "Associate Professor · Placement Mentor",
    email: "anita.mishra@nexploy.demo",
    campusId: "cmp_main",
    assignedStudentIds: [
      "stu_rahul",
      "stu_priya",
      "stu_arjun",
      "stu_ankit",
      "stu_neha",
      "stu_kavya",
      "stu_sneha",
      "stu_aman",
    ],
  },
  {
    id: "men_rajesh",
    name: "Prof. Rajesh Nair",
    avatarInitials: "RN",
    department: "Electrical & Mechanical Engineering",
    designation: "Assistant Professor · Placement Mentor",
    email: "rajesh.nair@nexploy.demo",
    campusId: "cmp_city",
    assignedStudentIds: ["stu_amit", "stu_rohit", "stu_isha", "stu_vikram"],
  },
  {
    id: "men_shweta",
    name: "Dr. Shweta Kulkarni",
    avatarInitials: "SK",
    department: "School of Engineering",
    designation: "Professor · Placement Mentor",
    email: "shweta.kulkarni@nexploy.demo",
    campusId: "cmp_engg",
    assignedStudentIds: ["stu_meera", "stu_farhan"],
  },
];

/** The mentor whose account the demo Mentor role signs into. */
export const ACTIVE_MENTOR_ID = "men_anita";

export const activeMentor = mentors[0]; // Dr. Anita Mishra

export const getMentorById = (id: string): Mentor | undefined => mentors.find((m) => m.id === id);

export const getMentorForStudent = (studentId: string): Mentor | undefined =>
  mentors.find((m) => m.assignedStudentIds.includes(studentId));

// ---- Intervention plans ---------------------------------------------

export const interventionPlans: InterventionPlan[] = [
  {
    id: "int_sneha",
    studentId: "stu_sneha",
    mentorId: "men_anita",
    status: "ACTIVE",
    createdOn: "22 Aug 2026",
    focusAreas: ["Interview Performance", "Communication"],
    actions: [
      { id: "int_sneha_a1", label: "Weekly structured mock interview", done: true },
      { id: "int_sneha_a2", label: "Communication coaching session", done: true },
      { id: "int_sneha_a3", label: "Rebuild resume around the IoT project", done: false },
      { id: "int_sneha_a4", label: "Apply to 3 embedded-systems drives", done: false },
    ],
    progress: 45,
    notes:
      "Improving on structured answers. Still hesitant in system-level questions — continue panel practice.",
  },
  {
    id: "int_amit",
    studentId: "stu_amit",
    mentorId: "men_rajesh",
    status: "ACTIVE",
    createdOn: "18 Aug 2026",
    focusAreas: ["Aptitude", "Domain Projects", "Placement Activity"],
    actions: [
      { id: "int_amit_a1", label: "Daily aptitude practice set", done: true },
      { id: "int_amit_a2", label: "Start one CAD portfolio project", done: false },
      { id: "int_amit_a3", label: "Apply to 2 core engineering drives", done: false },
    ],
    progress: 30,
    notes: "Aptitude trending up slowly. Needs a concrete project to show at interviews.",
  },
  {
    id: "int_vikram",
    studentId: "stu_vikram",
    mentorId: "men_rajesh",
    status: "PROPOSED",
    createdOn: "8 Sep 2026",
    focusAreas: ["Active Backlogs", "Programming", "Aptitude"],
    actions: [
      { id: "int_vikram_a1", label: "Clear 2 active backlogs in the supplementary window", done: false },
      { id: "int_vikram_a2", label: "Complete programming fundamentals track", done: false },
      { id: "int_vikram_a3", label: "Weekly aptitude drill", done: false },
    ],
    progress: 0,
    notes: "Plan drafted by the placement office — awaiting mentor activation.",
  },
];

export const getInterventionByStudent = (studentId: string): InterventionPlan | undefined =>
  interventionPlans.find((p) => p.studentId === studentId);

export const getInterventionsByMentor = (mentorId: string): InterventionPlan[] =>
  interventionPlans.filter((p) => p.mentorId === mentorId);

/** Recommended plan template the mentor sees before creating a plan.
 * Deterministic — derived from the student's own flagged focus areas. */
export const RECOMMENDED_PLAN_TEMPLATE = [
  "DSA practice plan",
  "Communication sessions",
  "Resume review",
  "Mock interview",
];

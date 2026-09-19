# NEXPLOY API Contract

This is the contract between the NEXPLOY frontend (this repo) and the backend
that will eventually replace `src/data/mock/*.ts`. Every function below
already exists in `src/lib/api/*.ts`, wrapping the current mock data and
`src/lib/simulate.ts` scenario logic behind an async, typed signature. When a
real backend exists, only the *body* of each function changes (swap the mock
read for a call through `src/lib/api/client.ts`) — signatures and call sites
should not need to change.

**Auth approach:** not yet agreed. `src/lib/api/client.ts` has no
auth-header wiring yet — fill this section in once the frontend and backend
owners have agreed on JWT-in-header vs. session cookies vs. something else.

---

## Students — `src/lib/api/students.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listStudents()` | `GET /api/students` | — | `Promise<Student[]>` |
| `getStudent(id)` | `GET /api/students/:id` | `id: string` | `Promise<Student \| undefined>` |
| `listStudentsByCampus(campusId)` | `GET /api/campuses/:campusId/students` | `campusId: string` | `Promise<Student[]>` |
| `getPrimaryStudent()` | `GET /api/students/me` | — | `Promise<Student>` |
| `refreshDigitalTwin(studentId)` | `POST /api/students/:id/digital-twin/refresh` | `studentId: string` | `Promise<DigitalTwinResult>` |
| `runWhatIfScenario(selectedFactors)` | `POST /api/students/:id/what-if` | `selectedFactors: WhatIfFactor[]` | `Promise<{ probability: number; readinessImpact: number; recommendedPath: string }>` |
| `getResumeIntelligence(studentId)` | `GET /api/students/:id/resume-intelligence` | `studentId: string` | `Promise<ResumeIntelligence>` |

## Drives — `src/lib/api/drives.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listDrives()` | `GET /api/drives` | — | `Promise<Drive[]>` |
| `getDrive(id)` | `GET /api/drives/:id` | `id: string` | `Promise<Drive \| undefined>` |
| `listActiveDrives()` | `GET /api/drives?status=ACTIVE` | — | `Promise<Drive[]>` |
| `listDrivesByCampus(campusId)` | `GET /api/campuses/:campusId/drives` | `campusId: string` | `Promise<Drive[]>` |
| `listDrivesByCompany(companyId)` | `GET /api/recruiters/:companyId/drives` | `companyId: string` | `Promise<Drive[]>` |
| `checkEligibility(studentId, driveId)` | `GET /api/drives/:driveId/eligibility/:studentId` | `studentId: string, driveId: string` | `Promise<EligibilityResult \| undefined>` |
| `getCriteriaSummary(driveId)` | `GET /api/drives/:id/criteria-summary` | `driveId: string` | `Promise<string \| undefined>` |

## Applications — `src/lib/api/applications.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listApplications()` | `GET /api/applications` | — | `Promise<Application[]>` |
| `listApplicationsByStudent(studentId)` | `GET /api/students/:studentId/applications` | `studentId: string` | `Promise<Application[]>` |
| `listApplicationsByDrive(driveId)` | `GET /api/drives/:driveId/applications` | `driveId: string` | `Promise<Application[]>` |
| `getApplicationForDrive(studentId, driveId)` | `GET /api/students/:studentId/applications/:driveId` | `studentId: string, driveId: string` | `Promise<Application \| undefined>` |

## Matches — `src/lib/api/matches.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listMatches()` | `GET /api/matches` | — | `Promise<CandidateMatch[]>` |
| `getCandidateMatch(studentId, driveId)` | `GET /api/students/:studentId/matches/:driveId` | `studentId: string, driveId: string` | `Promise<CandidateMatch \| undefined>` |
| `listMatchesForDrive(driveId)` | `GET /api/drives/:driveId/matches` | `driveId: string` | `Promise<CandidateMatch[]>` |
| `listMatchesForStudent(studentId)` | `GET /api/students/:studentId/matches` | `studentId: string` | `Promise<CandidateMatch[]>` |
| `analyzeCandidate(studentId, driveId)` | `POST /api/drives/:driveId/candidates/:studentId/analyze` | `studentId: string, driveId: string` | `Promise<CandidateMatch \| undefined>` |

## Offers — `src/lib/api/offers.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listOffers()` | `GET /api/offers` | — | `Promise<Offer[]>` |
| `listOffersByStudent(studentId)` | `GET /api/students/:studentId/offers` | `studentId: string` | `Promise<Offer[]>` |
| `listOffersByDrive(driveId)` | `GET /api/drives/:driveId/offers` | `driveId: string` | `Promise<Offer[]>` |
| `listPpoOffers()` | `GET /api/offers?type=PPO` | — | `Promise<Offer[]>` |

## Documents — `src/lib/api/documents.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listDocuments()` | `GET /api/documents` | — | `Promise<DocumentItem[]>` |
| `listDocumentsByStudent(studentId)` | `GET /api/students/:studentId/documents` | `studentId: string` | `Promise<DocumentItem[]>` |

## Notifications — `src/lib/api/notifications.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listNotifications()` | `GET /api/notifications` | — | `Promise<NotificationItem[]>` |
| `listNotificationsForRole(role)` | `GET /api/notifications?role=:role` | `role: Role` | `Promise<NotificationItem[]>` |

## Risk — `src/lib/api/risk.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listRiskEntries()` | `GET /api/risk` | — | `Promise<RiskEntry[]>` |
| `getStudentRisk(studentId)` | `GET /api/students/:studentId/risk` | `studentId: string` | `Promise<RiskEntry \| undefined>` |

## Schedules — `src/lib/api/schedules.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listScheduleDays()` | `GET /api/schedule/days` | — | `Promise<{ day: string; date: string }[]>` |
| `listScheduleEvents()` | `GET /api/schedule/events` | — | `Promise<ScheduleEvent[]>` |
| `listScheduleConflicts()` | `GET /api/schedule/conflicts` | — | `Promise<ScheduleConflict[]>` |
| `getConflictForEvent(eventId)` | `GET /api/schedule/events/:eventId/conflict` | `eventId: string` | `Promise<ScheduleConflict \| undefined>` |
| `optimizeSchedule(conflictId)` | `POST /api/schedule/conflicts/:conflictId/optimize` | `conflictId: string` | `Promise<ScheduleConflict \| undefined>` |
| `listVenues()` | `GET /api/schedule/venues` | — | `Promise<{ name: string; capacity: number; bookedSlots: number }[]>` |
| `listPanels()` | `GET /api/schedule/panels` | — | `Promise<{ name: string; members: string; assignedDrives: number }[]>` |

## Mentors — `src/lib/api/mentors.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listMentors()` | `GET /api/mentors` | — | `Promise<Mentor[]>` |
| `getMentor(id)` | `GET /api/mentors/:id` | `id: string` | `Promise<Mentor \| undefined>` |
| `getStudentMentor(studentId)` | `GET /api/students/:studentId/mentor` | `studentId: string` | `Promise<Mentor \| undefined>` |
| `getActiveMentor()` | `GET /api/mentors/me` | — | `Promise<Mentor>` |
| `listInterventionPlans()` | `GET /api/interventions` | — | `Promise<InterventionPlan[]>` |
| `getStudentIntervention(studentId)` | `GET /api/students/:studentId/intervention` | `studentId: string` | `Promise<InterventionPlan \| undefined>` |
| `listInterventionsByMentor(mentorId)` | `GET /api/mentors/:mentorId/interventions` | `mentorId: string` | `Promise<InterventionPlan[]>` |

## Campuses — `src/lib/api/campuses.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listCampuses()` | `GET /api/campuses` | — | `Promise<Campus[]>` |
| `getCampus(id)` | `GET /api/campuses/:id` | `id: string` | `Promise<Campus \| undefined>` |
| `getInstituteTotals()` | `GET /api/campuses/totals` | — | `Promise<InstituteTotals>` (sum of every campus) |

## Analytics — `src/lib/api/analytics.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `getAnalyticsForCampus(campusId)` | `GET /api/campuses/:campusId/analytics` | `campusId: string` | `Promise<CampusAnalytics>` |
| `listAllCampusAnalytics()` | `GET /api/analytics` | — | `Promise<Record<string, CampusAnalytics>>` |
| `getSkillDemand()` | `GET /api/analytics/skill-demand` | — | `Promise<SkillDemand[]>` |
| `getSkillSupply()` | `GET /api/analytics/skill-supply` | — | `Promise<{ skill: string; demand: number; cohortCoverage: number }[]>` |
| `getLandingMetrics()` | `GET /api/analytics/landing-metrics` | — | `Promise<{ students: number; placementRate: number; offers: number; recruiters: number }>` |
| `getCrossCampusComparison()` | `GET /api/analytics/cross-campus-comparison` | — | `Promise<{ campus: string; city: string; students: number; ready: number; placed: number; placementRate: number; averageCtc: string }[]>` |

## Recruiters — `src/lib/api/recruiters.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listRecruiters()` | `GET /api/recruiters` | — | `Promise<Recruiter[]>` |
| `getRecruiter(id)` | `GET /api/recruiters/:id` | `id: string` | `Promise<Recruiter \| undefined>` |
| `getActiveRecruiter()` | `GET /api/recruiters/active` | — | `Promise<Recruiter>` |

## Interviews — `src/lib/api/interviews.ts`

| Function | Suggested REST endpoint | Request params | Response type |
|---|---|---|---|
| `listInterviews()` | `GET /api/interviews` | — | `Promise<InterviewSlot[]>` |
| `listInterviewsByStudent(studentId)` | `GET /api/interviews?studentId=:studentId` | `studentId: string` | `Promise<InterviewSlot[]>` |
| `listInterviewsByDrive(driveId)` | `GET /api/interviews?driveId=:driveId` | `driveId: string` | `Promise<InterviewSlot[]>` |
| `listUpcomingInterviews()` | `GET /api/interviews?status=scheduled` | — | `Promise<InterviewSlot[]>` |
| `listInterviewPrepPlans()` | `GET /api/interviews/prep-plans` | — | `Promise<InterviewPrepPlan[]>` |
| `getInterviewPrepPlan(driveId)` | `GET /api/interviews/prep-plans/:driveId` | `driveId: string` | `Promise<InterviewPrepPlan \| undefined>` |

---

## Not covered here

Zustand-owned demo interaction state (`useAppStore.ts`) — role switching,
notification read/unread, shortlist selections, offer decisions, document
verification decisions, and intervention-plan mutations — is client-only
state in this prototype and is **not** wrapped by the API layer above. A
real backend will eventually need write endpoints for these (e.g.
`PATCH /api/offers/:id/decision`, `PATCH /api/documents/:id/status`,
`POST /api/interventions`), but those didn't exist as mock-data read
functions to wrap, so they're intentionally out of scope for this pass —
flag them to whoever scopes the next backend milestone.

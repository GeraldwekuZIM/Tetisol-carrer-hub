# Tetisol Career Hub Project Documentation

## Overview

Tetisol Career Hub is a Next.js MVP for learners moving from practical technology learning into internship readiness. The app combines:

- Public landing and course discovery.
- Student onboarding and profile personalization.
- Course enrollment, lessons, notes, quizzes, and certificates.
- Internship matching, saved roles, and application tracking.
- CV building with learning imports and scoring.
- Admin content management for courses and internships.
- Admin analytics for learner risk, readiness, and course performance.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, shadcn, Base UI, lucide-react |
| Forms | React Hook Form, Zod |
| Drag and drop | dnd-kit |
| Notifications | Sonner |
| Auth-ready backend | Supabase via `@supabase/ssr` and `@supabase/supabase-js` |
| Demo persistence | Browser `localStorage` |

## App Architecture

The app uses the Next.js App Router. The local Next.js 16 docs confirm that:

- `app/page.tsx` exposes a route.
- `app/layout.tsx` is the required root layout.
- Route groups such as `(app)`, `(auth)`, and `(admin)` organize routes without changing the URL.
- Dynamic route params are async in this project, for example `params: Promise<{ slug: string }>`.

### Route Groups

| Folder | URL impact | Purpose |
| --- | --- | --- |
| `app/` | Root | Public landing, public courses, root layout, loading, not-found |
| `app/(auth)/auth` | `/auth` | Sign in and sign up |
| `app/(app)` | No `(app)` in URL | Authenticated student workspace |
| `app/(admin)/admin` | `/admin` | Admin workspace |

### Main Routes

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `LandingPage` | Public marketing page |
| `/auth` | `AuthPanel` | Sign in and sign up |
| `/courses` | `CourseCatalog` | Public/student course catalog |
| `/courses/[slug]` | `CourseDetail` | Course overview and enrollment |
| `/onboarding` | `ProfileEditor` | Initial learner profile setup |
| `/dashboard` | `DashboardHome` | Student command center |
| `/learning` | `MyLearningOverview` | Enrolled course overview |
| `/learning/[slug]` | `CoursePlayer` | Lesson, notes, progress, and quiz player |
| `/certificates` | `CertificatesHome` | Certificate library |
| `/certificates/[certificateId]` | `CertificatePreview` | Certificate preview |
| `/internships` | `InternshipFinder` | Internship discovery |
| `/internships/[slug]` | `InternshipDetail` | Internship details |
| `/saved` | `InternshipFinder mode="saved"` | Saved internships |
| `/applications` | `KanbanBoard` | Application pipeline |
| `/cv-builder` | `CVEditor` | CV scoring and editing |
| `/profile` | `ProfileEditor` | Learner profile editing |
| `/admin` | `AdminDashboardHome` | Admin overview |
| `/admin/courses` | `CourseAdminList` | Course list and status management |
| `/admin/courses/new` | `CourseAdminEditor` | New course draft |
| `/admin/courses/[courseId]` | `CourseAdminEditor` | Edit course |
| `/admin/courses/[courseId]/analytics` | `CourseAnalyticsView` | Course performance analytics |
| `/admin/analytics` | `AdminAnalyticsHome` | Platform analytics |
| `/admin/students/[studentId]` | `StudentAnalyticsDetail` | Individual learner analytics |
| `/admin/internships` | `InternshipAdminList` | Internship list and status management |
| `/admin/internships/new` | `InternshipAdminEditor` | New internship draft |
| `/admin/internships/[internshipId]` | `InternshipAdminEditor` | Edit internship |

## Key Source Areas

| Path | Responsibility |
| --- | --- |
| `app/` | Route entry points and layouts |
| `components/providers/` | Global providers and career hub context |
| `components/navigation/` | Student app shell and route protection behavior |
| `components/admin/` | Admin shell, course CMS, internship CMS |
| `components/analytics/` | Admin analytics dashboards and details |
| `components/learning/` | Course catalog, player, certificates, quizzes |
| `components/internships/` | Internship discovery and detail views |
| `components/applications/` | Application Kanban board |
| `components/cv/` | CV editor |
| `components/copilot/` | Floating route-aware copilot |
| `components/ui/` | Shared UI primitives |
| `lib/demo-data.ts` | Seeded users, courses, quizzes, internships, workspaces |
| `lib/learning.ts` | Learning progress, certificates, CV import helpers |
| `lib/recommendations.ts` | Internship recommendation scoring |
| `lib/opportunity-intelligence.ts` | Readiness score and next-best-action logic |
| `lib/analytics.ts` | Platform, course, and learner analytics calculations |
| `lib/content.ts` | Content status and admin normalization helpers |
| `lib/supabase.ts` | Browser Supabase client and user mapping |
| `services/career-hub-service.ts` | State mutations for auth, learning, admin, CV, and internships |
| `services/storage.ts` | LocalStorage load/save wrapper |
| `supabase/schema.sql` | Database tables, policies, indexes, and storage buckets |
| `scripts/seed-supabase.js` | Service-role local Supabase seed script for supervisor test data |
| `types/index.ts` | Shared domain types |

## State And Data Flow

The central client state lives in `CareerHubProvider`.

Flow:

1. `CareerHubProvider` loads state from `localStorage`.
2. If no local state exists, it creates state from `defaultCareerHubState`.
3. `hydrateCareerHubState` merges seeded demo users and normalizes course/internship content.
4. State is saved back to `localStorage` after hydration.
5. If Supabase variables exist, the provider checks the current Supabase user and syncs that account into local state.
6. Page components consume derived state and actions through `useCareerHub()`.

Important derived data in the provider:

- Published courses and internships.
- Recommended courses and internships.
- Enrolled, in-progress, and completed courses.
- Earned certificates.
- Saved and tracked internships.
- Upcoming deadlines and dashboard reminders.
- Opportunity intelligence and readiness scoring.
- Admin access flag.

## Authentication

The app supports two auth modes.

### Demo Mode

Used when Supabase environment variables are missing.

- Credentials are checked against seeded users in `lib/demo-data.ts`.
- Session state is represented by `activeUserId`.
- Data persists in `localStorage`.

### Supabase Auth Mode

Used when both variables exist:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Sign in and sign up call Supabase Auth. The authenticated Supabase user is mapped into the local `CareerHubState` so the app experience remains available.

## Domain Model

The core domain types are defined in `types/index.ts`.

Important records:

- `UserAccount`
- `StudentProfile`
- `UserPreferences`
- `CareerHubState`
- `UserWorkspace`
- `Course`
- `CourseModule`
- `CourseLesson`
- `Quiz`
- `CourseEnrollment`
- `Certificate`
- `Internship`
- `ApplicationRecord`
- `CVDocument`
- `OpportunityIntelligence`

## Learning Features

Learning logic is split between `lib/learning.ts` and `services/career-hub-service.ts`.

Implemented:

- Course discovery and detail pages.
- Enrollment.
- In-progress and completed course views.
- Lesson progress.
- Lesson notes.
- Quiz submission and scoring.
- Certificate awarding after eligible completion.
- Learning-to-CV import for skills, projects, achievements, and certifications.
- Related/recommended courses.

## Career Features

Implemented:

- Internship discovery.
- Personalized ranking with match scores and reasons.
- Saved internships.
- Internship detail pages.
- Application tracking across five statuses.
- Application notes and deadlines.
- CV editor with score and suggestions.

## Admin Features

Implemented:

- Admin-only shell based on seeded user role.
- Course list, creation, editing, archiving, and deletion.
- Module, lesson, and quiz authoring structure.
- Internship list, creation, editing, archiving, and deletion.
- Platform analytics.
- Course analytics.
- Student analytics detail pages.

Admin changes currently update the local demo state. The Supabase schema is prepared for persistent storage, but the UI does not yet sync all admin writes to Supabase.

## Analytics Logic

`lib/analytics.ts` computes:

- Active and inactive learners.
- Engagement state.
- Course progress and completion rates.
- Quiz average and pass rate.
- Certificates issued.
- Learner readiness.
- Learner risk.
- Suggested instructor actions.
- Most difficult course/module signals.
- Ready-to-apply learner lists.

## Copilot

The floating copilot is implemented in:

- `components/copilot/floating-copilot.tsx`
- `lib/copilot.ts`

It is route-aware and produces page-specific:

- Scope.
- Title.
- Summary.
- Status badge.
- Signals.
- Suggested prompts.
- Navigation actions.

It is currently deterministic product guidance, not connected to a live LLM API.

## Supabase Schema

`supabase/schema.sql` includes:

- Profiles and preferences.
- Courses, modules, lessons.
- Enrollments and lesson progress.
- Quizzes, questions, attempts.
- Certificates.
- Internships.
- Saved internships.
- Tracked applications.
- CVs and CV sections.
- Reminders.
- Indexes.
- Row-level security policies.
- Private storage buckets for `cv-assets` and `certificate-assets`.

## Implemented Versus Scaffolded

Implemented:

- Full demo experience with seeded data.
- Local auth fallback.
- Student learning and career flows.
- Admin content flows.
- Analytics calculations.
- Supabase Auth entry points.
- Supabase schema and seed scripts.

Scaffolded:

- Full Supabase persistence for all domain records.
- Server-side route protection.
- Certificate file generation, download, sharing, and verification.
- Storage-backed asset uploads.
- Real AI/LLM-backed copilot responses.

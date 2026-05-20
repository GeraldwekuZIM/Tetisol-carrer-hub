# Tetisol Career Hub

Tetisol Career Hub is a demo-ready MVP that connects practical technology learning with employability workflows. Learners can discover courses, complete lessons and quizzes, earn certificate proof, find internships, track applications, and build a stronger CV from one workspace.

Start with these docs:

- [Demo guide](./docs/DEMO_GUIDE.md)
- [Project documentation](./docs/PROJECT_DOCUMENTATION.md)
- [Setup and runbook](./docs/SETUP_AND_RUNBOOK.md)
- [Deployment and testing guide](./docs/DEPLOYMENT_AND_TESTING_GUIDE.md)
- [Supervisor testing and deployment report](./SUPERVISOR_TESTING_AND_DEPLOYMENT_REPORT.md)

## Product Scope

The app connects:

- Course discovery and enrollment.
- Modules, lessons, notes, quizzes, and progress tracking.
- Certificates from completed learning paths.
- Learner dashboards and profile personalization.
- Internship discovery, saved roles, and match reasons.
- Application tracking with deadlines and notes.
- CV building tied to certificates, projects, skills, and achievements.
- Admin course, internship, and analytics workflows.

## Tech Stack

- Next.js 16 App Router.
- React 19 and TypeScript.
- Tailwind CSS v4.
- shadcn, Base UI, and lucide-react.
- React Hook Form and Zod.
- dnd-kit for application board drag and drop.
- Sonner for notifications.
- Supabase auth-ready client integration via `@supabase/ssr`.
- Local demo persistence via `localStorage`.

## Local Run

1. Install dependencies:

```bash
npm install --prefer-offline --no-audit --progress=false
```

2. Start the development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

If Supabase environment variables are not configured, the app runs in local demo mode using seeded state in `localStorage`.

## Demo Credentials

All seeded users use password `careerhub`.

| Email | Role/state |
| --- | --- |
| `new@tetisol.com` | New learner |
| `demo@tetisol.com` | Active learner |
| `stalled@tetisol.com` | Stalled learner |
| `almost@tetisol.com` | Almost-certified learner |
| `ready@tetisol.com` | Career-ready learner |
| `admin@tetisol.com` | Admin |

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Supabase Auth mode requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

If both values are present, sign in and sign up use Supabase Auth. If either value is absent, auth falls back to the local demo workspace.

## Supabase Setup

1. Use the official Supabase project: `https://copxovwoureigdtjbhgq.supabase.co`.
2. Copy your project URL and publishable key into `.env.local`.
3. Run [`supabase/schema.sql`](./supabase/schema.sql).
4. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` locally only.
5. Run `npm run seed:supabase` for the 50-student supervisor test data.
6. Enable email auth in Supabase if you want real signup/login.

The schema includes profiles, roles, courses, lessons, enrollments, lesson progress, attendance, assignments, submissions, opportunities, saved opportunities, announcements, notifications, CV profiles, indexes, RLS policies, and admin summary reporting.

## Testing For Supervisor Review

Run the production readiness check:

```bash
npm run test:build
```

With the app running, execute route smoke tests:

```bash
npm run test:e2e
```

Run the 50-user load-style test:

```bash
npm run test:load
```

Optional Artillery scenario:

```bash
npm run test:load:artillery
```

The load script reports success rate and response-time percentiles. Use `TEST_BASE_URL` to test a deployed site:

```bash
TEST_BASE_URL=https://your-site.example npm run test:load
```

## Main Routes

Public:

- `/`
- `/courses`
- `/courses/[slug]`
- `/auth`

Student:

- `/onboarding`
- `/dashboard`
- `/learning`
- `/learning/[slug]`
- `/certificates`
- `/certificates/[certificateId]`
- `/internships`
- `/internships/[slug]`
- `/saved`
- `/applications`
- `/cv-builder`
- `/profile`

Admin:

- `/admin`
- `/admin/courses`
- `/admin/courses/new`
- `/admin/courses/[courseId]`
- `/admin/courses/[courseId]/analytics`
- `/admin/analytics`
- `/admin/students/[studentId]`
- `/admin/internships`
- `/admin/internships/new`
- `/admin/internships/[internshipId]`

## Project Structure

```text
app/
components/
docs/
lib/
services/
supabase/
types/
```

## Current Status

Implemented:

- Full local demo experience with realistic seeded users, courses, quizzes, certificates, internships, applications, and reminders.
- Student learning, internship, application, CV, and certificate flows.
- Admin course, internship, and analytics flows.
- Route-aware floating copilot guidance.
- Supabase Auth entry points and database schema.

Future-ready:

- Full Supabase persistence for all domain records.
- Server-side session protection.
- Certificate file generation, download, public sharing, and verification.
- Storage-backed CV and certificate assets.
- Live LLM-backed copilot responses.

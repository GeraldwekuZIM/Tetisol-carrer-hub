# Tetisol Career Hub Demo Guide

This guide is for presenting the Tetisol Career Hub MVP. It focuses on the story to tell, the routes to visit, the demo accounts to use, and the parts of the product that are implemented versus scaffolded.

## Demo Positioning

Tetisol Career Hub connects learning, proof, and employability in one student workspace.

The product story is:

1. A learner creates a profile.
2. Tetisol recommends courses and internships from that profile.
3. The learner enrolls, completes lessons, saves notes, and passes quizzes.
4. Course completion unlocks certificates.
5. Certificates, skills, projects, and achievements can be imported into the CV builder.
6. Internship matches can be saved or moved into an application tracker.
7. Admin users can manage courses, internships, and analytics from an internal workspace.

## Recommended Demo Flow

### 1. Landing Page

Route: `/`

Show:

- Public marketing page.
- Learning-to-employment positioning.
- Course categories and dashboard preview.
- Floating copilot entry point.

Message:

"Tetisol is not just a course catalog. It is a connected workflow from skill building to internship readiness."

### 2. Sign In

Route: `/auth`

Use:

- Email: `demo@tetisol.com`
- Password: `careerhub`

Show:

- Local demo mode works without Supabase environment variables.
- If Supabase variables are configured, auth uses Supabase Auth.

Message:

"For the demo, the app can run fully offline against seeded local state, but it is already auth-ready."

### 3. Student Dashboard

Route: `/dashboard`

Show:

- Readiness score and AI coach panel.
- Next best action.
- Learning momentum.
- Certificates, applications, reminders, and internship signals.

Message:

"This is the learner command center. It combines progress, deadlines, CV quality, and opportunity fit."

### 4. Course Catalog And Course Detail

Routes:

- `/courses`
- `/courses/[slug]`

Show:

- Search and category filtering.
- Personalized recommendations.
- Course metadata, modules, skills, outcomes, and certificate availability.
- Enrollment action.

Message:

"Courses are structured as employability tracks. Each course is tied to skills, certificates, and internship focus areas."

### 5. My Learning And Course Player

Routes:

- `/learning`
- `/learning/[slug]`

Show:

- Enrolled, in-progress, and completed courses.
- Lesson sidebar.
- Lesson content.
- Notes.
- Mark-complete flow.
- Quiz flow.
- Progress bar.

Message:

"Learning activity is not isolated. It feeds reminders, CV imports, certificates, and recommendations."

### 6. Certificates

Routes:

- `/certificates`
- `/certificates/[certificateId]`

Show:

- Earned certificate cards.
- Certificate preview.
- Certificate IDs and issue dates.

Message:

"Certificates are currently generated from completed demo learning paths. Download/share verification is scaffolded for future backend work."

### 7. Internship Discovery

Routes:

- `/internships`
- `/internships/[slug]`
- `/saved`

Show:

- Ranked internship recommendations.
- Match reasons.
- Saved internships.
- Add-to-tracker action.
- Internship detail page.

Message:

"Recommendations use profile skills, interests, course history, certificates, saved roles, and preferences."

### 8. Application Tracker

Route: `/applications`

Show:

- Kanban-style pipeline.
- Statuses: Interested, Applied, Interview, Offer, Rejected.
- Drag and drop.
- Deadline and notes editing.

Message:

"This gives learners a single place to manage internship movement instead of losing details across messages and spreadsheets."

### 9. CV Builder

Route: `/cv-builder`

Show:

- Headline, summary, education, skills, experience, projects, certifications, and achievements.
- CV score.
- Suggestions.
- Import learning into CV.

Message:

"Tetisol turns learning proof into a stronger employability story. The CV builder is connected to certificates and completed courses."

### 10. Admin Workspace

Route: `/admin`

Use:

- Email: `admin@tetisol.com`
- Password: `careerhub`

Show:

- Admin dashboard.
- Course management.
- Internship management.
- Analytics.
- Student analytics.
- Course analytics.

Message:

"Admin users can update the content that students see and inspect learner readiness and risk signals."

## Demo Accounts

All demo users use password `careerhub`.

| Email | Name | State | Best use |
| --- | --- | --- | --- |
| `new@tetisol.com` | Aisha Ncube | New learner | Show onboarding, first recommendations, and empty-state growth |
| `demo@tetisol.com` | Lerato Moyo | Active learner | Default student demo with healthy activity |
| `stalled@tetisol.com` | Tawanda Dube | Stalled learner | Show risk, reminders, and resume-learning guidance |
| `almost@tetisol.com` | Nomsa Sibanda | Almost-certified learner | Show near-certificate progress |
| `ready@tetisol.com` | Musa Chari | Career-ready learner | Show certificates, strong CV, and active applications |
| `admin@tetisol.com` | Tetisol Admin | Admin | Show CMS and analytics |

## Features To Highlight

- Next.js 16 App Router with route groups for public, student, auth, and admin areas.
- Demo-first persistence through `localStorage`.
- Supabase Auth integration when environment variables are present.
- Supabase schema and seed files for future database persistence.
- shadcn/Base UI component layer with Tailwind CSS v4.
- Floating copilot that changes context by route.
- Course player with notes, quizzes, progress, and certificate logic.
- Admin CMS for course and internship content.
- Analytics for platform, course, and student monitoring.

## Known Demo Caveats

- Most product data currently lives in seeded local state from `lib/demo-data.ts`.
- Supabase is auth-ready, but most application records are not yet synced to Supabase from the UI.
- Certificate download, public sharing, and verification URLs are scaffolded.
- Admin writes update the local demo state, not the Supabase database.
- Server-side route protection is simulated client-side through the app shells.

## Quick Reset

If local demo state gets messy during practice:

1. Open browser dev tools.
2. Go to Application or Storage.
3. Clear `localStorage` for the site.
4. Refresh the app.

The app will rehydrate from seeded demo data.


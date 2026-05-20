# Supervisor Testing And Deployment Report

## 1. System Overview

Tetisol Hub is a Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 application for student learning and employability workflows. It includes course browsing, lessons, quiz/progress tracking, certificates, opportunities, saved roles, application tracking, CV building, and admin/lecturer content management.

The current app remains presentation-ready because the existing UI and demo workflows were preserved.

## 2. Database Selected And Why

Selected database/backend: Supabase PostgreSQL.

Official project:

```text
https://copxovwoureigdtjbhgq.supabase.co
```

Supabase is the best fit because Tetisol Hub needs relational data and role-aware access:

- Students belong to courses through enrollments.
- Lessons belong to modules and courses.
- Progress belongs to students and lessons.
- Lecturers manage selected courses and enrolled students.
- Admins need platform-wide visibility.
- Auth, Row Level Security, and storage are available in the same free-tier-friendly platform.

## 3. Database Schema Summary

Official schema coverage:

- `profiles`
- `courses`
- `lessons`
- `enrollments`
- `lesson_progress`
- `attendance_records`
- `assignments`
- `assignment_submissions`
- `opportunities`
- `saved_opportunities`
- `announcements`
- `notifications`
- `cv_profiles`
- `admin_platform_summary` view
- RLS helper functions: `is_admin()`, `is_lecturer()`, `is_student()`, `manages_course()`
- Performance indexes for roles, course ownership, status, enrollments, progress, attendance, opportunities, saved opportunities, and notifications

RLS policies now support:

- Students reading and updating their own private records.
- Lecturers reading course participation and enrolled student data for courses they manage.
- Admin users managing platform-wide records.

SQL and seed files:

- `supabase/schema.sql`
- `scripts/seed-supabase.js`

## 4. Free Hosting Option Selected And Why

Recommended:

- Frontend: Netlify first choice, Vercel acceptable.
- Backend/Auth/Storage: Supabase.

Netlify is a good academic-demo target because it has GitHub integration, a free tier, and simple environment variable setup. The project includes `netlify.toml`. Vercel remains a fallback if Netlify's Next.js runtime creates deployment friction.

## 5. 50-User Test Scenario

The test target is:

- 50 students
- 5 lecturers/instructors
- 1 to 3 admins
- 10 to 20 courses
- Multiple lessons per course
- Student enrollments and progress
- Participation records
- Opportunity browsing/saving/application tracking
- Lecturer participation checks
- Admin analytics checks

Seed script test data:

- 50 student auth/profile records
- 5 lecturer auth/profile records
- 2 admin auth/profile records
- 15 courses
- 5 to 8 lessons per course
- Enrollments across courses
- Lesson progress records
- Attendance records
- Assignments and submissions
- 20 opportunities
- Saved opportunities
- CV records
- Announcements and notifications

## 6. Load Test Results

Load test tooling:

- Default reliable runner: `scripts/load-test.mjs`
- Artillery scenario template: `tests/load/tetisol-load.yml`

Run locally:

```bash
$env:TEST_BASE_URL="http://localhost:3000"; $env:LOAD_TEST_USERS="50"; npm run test:load
```

Run against deployment:

```bash
$env:TEST_BASE_URL="https://your-deployed-site.example"; $env:LOAD_TEST_USERS="50"; npm run test:load
```

The script reports:

- Total requests
- Success rate
- Failed requests
- p50 response time
- p90 response time
- p95 response time
- Max response time

Measured local production-build result after Supabase SSR proxy wiring:

```text
Base URL: http://localhost:3008
Scenario: mixed
Virtual users: 50
Duration: 10 seconds
Total requests: 3,834
Success rate: 100.00%
Failed requests: 0
p50: 102 ms
p90: 233 ms
p95: 326 ms
Max: 1,241 ms
```

Supporting smoke-test result against `http://localhost:3008`:

```text
Routes checked: 12
Failed routes: 0
Slowest route: 189 ms
```

These numbers prove the built frontend can handle the requested 50-user mixed browsing/progress-update simulation locally. The same load test should be repeated against the final deployed URL after Supabase is configured.

Artillery result against local production server:

```text
Base URL: http://localhost:3010
Scenario: 50 student and lecturer mixed usage
Duration: 60 second ramp plus drain time
HTTP 200 responses: 21,420
Virtual users created: 1,530
Virtual users completed: 1,530
Virtual users failed: 0
Mean response time: 629.8 ms
p95 response time: 2,101.1 ms
p99 response time: 3,197.8 ms
Max response time: 4,234 ms
```

## 7. Bugs Found

Audit findings:

- Runtime UI still preserves the local demo fallback.
- Full Supabase persistence was not wired through every screen.
- The backend needed an official schema matching student, lecturer, admin, course, lesson, enrollment, progress, attendance, opportunity, and CV records.
- The project needed a service-role seed script.
- The project needed Netlify deployment configuration.

## 8. Bugs Fixed

Changes made:

- Added official Supabase SSR helpers under `utils/supabase`.
- Added official Supabase schema with RLS and indexes.
- Added realistic 50-student service-role seed script.
- Added typed Supabase service modules.
- Added health endpoint.
- Added progress-update test endpoint.
- Added smoke test and load test scripts.
- Added Artillery load scenario template.
- Added Netlify deployment config.
- Added deployment/testing documentation.
- Expanded environment variable example.
- Added package scripts for build, e2e, load, and performance checks.

## 9. Performance Improvements Made

- Added indexes for important relational paths:
  - enrollments by student and course
  - lesson progress by lesson/enrollment and completion time
  - courses by instructor and status
  - saved opportunities by student
  - participation by student/course
  - assignment submissions by student/assignment
  - notifications by user
- Added an `admin_platform_summary` view for admin dashboard aggregation.
- Added a service layer to support moving expensive client-side reads into database-backed queries.
- Added test scripts to catch route failures and slow responses before presentation.

## 10. Remaining Limitations

- The UI still keeps the local demo fallback. This is intentional for presentation safety, but it means full production persistence is not finished on every screen.
- Full server-side route protection is still a future hardening step.
- The load test is practical and repeatable, but it is not a full browser-based real-user test with screenshots.
- Supabase Auth email behavior depends on project settings.
- Certificate file generation and public verification remain scaffolded rather than fully productionized.
- Artillery is installed and the committed scenario runs successfully locally. The default Node load runner is still kept because it is faster for quick pre-demo checks.

## 11. Deployment Steps

1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Create `.env.local` from `.env.example`.
4. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and local-only `SUPABASE_SERVICE_ROLE_KEY`.
5. Run `npm run seed:supabase`.
6. Run `npm run test:build`.
7. Run the app locally and execute `npm run test:e2e`.
8. Execute `npm run test:load`.
9. Push to GitHub.
10. Import into Netlify.
11. Add the public Supabase env vars in Netlify settings.
12. Deploy.
13. Run `npm run test:load` against the deployed URL.

## 12. Final Conclusion

The project is now prepared for supervisor review as a professional MVP test package. It has a correct Supabase PostgreSQL direction, role-aware schema hardening, realistic 50-student seed data, repeatable smoke/load testing scripts, deployment documentation, and a clear report of remaining production limitations.

For the 50-user academic demo scenario, the app handled the local production-build browsing and lightweight progress-update simulation successfully: 3,834 requests, 100.00% success, 0 failures, and 326 ms p95 response time. It is ready for supervisor review as an MVP test package. Full production readiness still requires completing the remaining feature-by-feature migration from local state to Supabase-backed persistence and repeating the load test against the final deployed URL.

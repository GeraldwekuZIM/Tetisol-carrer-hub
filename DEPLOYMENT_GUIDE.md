# Tetisol Hub Deployment Guide

## 1. Create Supabase Project

Use the official Supabase project:

```text
https://copxovwoureigdtjbhgq.supabase.co
```

## 2. Run Database Schema

Open Supabase SQL Editor and run:

```text
supabase/schema.sql
```

This creates:

- Profiles and roles: `student`, `lecturer`, `admin`
- Courses and lessons
- Enrollments and lesson progress
- Attendance records
- Assignments and submissions
- Opportunities and saved opportunities
- Announcements and notifications
- CV profiles
- RLS policies and performance indexes

## 3. Configure Local Environment

Create `.env.local` from `.env.example`.

```powershell
Copy-Item .env.example .env.local
```

Set:

```text
NEXT_PUBLIC_SUPABASE_URL=https://copxovwoureigdtjbhgq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
SUPABASE_SERVICE_ROLE_KEY=<local only, for seed script>
```

Never commit `.env.local`.

## 4. Install Dependencies

```powershell
npm install
```

## 5. Seed Supabase

The seed script uses the service role key locally only:

```powershell
npm run seed:supabase
```

Seeded data:

- 50 students
- 5 lecturers
- 2 admins
- 15 courses
- 5 to 8 lessons per course
- Enrollments
- Lesson progress
- Attendance records
- Assignments and submissions
- 20 opportunities
- Saved opportunities
- Announcements
- Notifications
- CV profiles

Seeded users use:

```text
careerhub
```

## 6. Build Locally

```powershell
npm run test:build
```

## 7. Push To GitHub

```powershell
git add .
git commit -m "Wire Tetisol Hub to Supabase backend"
git push
```

If the shell path has not refreshed:

```powershell
& "C:\Program Files\Git\cmd\git.exe" push
```

## 8. Deploy On Netlify

1. Open Netlify.
2. Connect the GitHub repository.
3. Select this project.
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
7. Deploy.

The project includes `netlify.toml` with the Netlify Next.js plugin configuration.

## 9. Vercel Alternative

If Netlify gives a Next.js runtime issue:

1. Import the GitHub repo into Vercel.
2. Framework: Next.js.
3. Build command: `npm run build`.
4. Add the same Supabase public env vars.
5. Deploy.

## 10. Test Production URL

After deployment:

```powershell
$env:TEST_BASE_URL="https://your-production-url"; npm run test:e2e
$env:TEST_BASE_URL="https://your-production-url"; $env:LOAD_TEST_USERS="50"; npm run test:load
```

Optional Artillery scenario after installing Artillery:

```powershell
npx artillery run --target "https://your-production-url" tests/load/tetisol-load.yml
```

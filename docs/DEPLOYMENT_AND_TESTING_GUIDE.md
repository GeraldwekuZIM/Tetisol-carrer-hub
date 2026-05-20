# Tetisol Hub Deployment And Testing Guide

## Recommended Free Stack

- Frontend hosting: Vercel or Netlify.
- Database, Auth, and Storage: Supabase PostgreSQL.
- Reason: this project needs relational student, lecturer, course, enrollment, progress, CV, and opportunity data. Supabase also gives Auth and RLS policies, which are necessary for role-based access.

## Local Verification

Install dependencies:

```bash
npm install --prefer-offline --no-audit --progress=false
```

Run the app:

```bash
npm run dev
```

Build readiness:

```bash
npm run test:build
```

Smoke routes:

```bash
$env:TEST_BASE_URL="http://localhost:3000"; npm run test:e2e
```

50-user load-style test:

```bash
$env:TEST_BASE_URL="http://localhost:3000"; $env:LOAD_TEST_USERS="50"; npm run test:load
```

Performance scenario:

```bash
$env:TEST_BASE_URL="http://localhost:3000"; npm run test:performance
```

## Supabase Setup

1. Create a new Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. Run `supabase/supervisor_readiness_schema.sql`.
4. Run `supabase/seed_load_test.sql` for the 50-student supervisor data set.
5. Copy the project URL and publishable anon key into `.env.local`.
6. Keep the service role key out of browser code and hosting logs.

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-public-anon-key
NEXT_PUBLIC_APP_URL=https://your-deployed-site.example
TEST_BASE_URL=http://localhost:3000
LOAD_TEST_USERS=50
LOAD_TEST_DURATION_SECONDS=60
```

Optional local-only variable:

```text
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Framework preset: Next.js.
4. Build command: `npm run build`.
5. Output directory: leave blank for Next.js.
6. Add the Supabase environment variables in Project Settings.
7. Deploy.

## Netlify Deployment

1. Push the project to GitHub.
2. Import the repository in Netlify.
3. Build command: `npm run build`.
4. Publish directory: `.next`.
5. Add Supabase environment variables in Site configuration.
6. Deploy.

For Netlify, use the official Next.js runtime integration if Netlify does not detect the Next.js app automatically.

## Test Accounts

The load-test SQL creates:

- `student01@tetisol.test` through `student50@tetisol.test`
- `lecturer1@tetisol.test` through `lecturer5@tetisol.test`
- `admin1@tetisol.test` through `admin3@tetisol.test`

Password:

```text
careerhub
```

## What The Load Test Proves

The included load script checks whether the deployed or local frontend can handle 50 simultaneous virtual users browsing:

- Landing/auth/dashboard routes.
- Course catalog and course detail.
- Learning pages.
- Internship, saved, application, and CV routes.
- Admin and lecturer-style dashboard routes.
- Progress-update style POST traffic through `/api/load-test/progress`.

For a real Supabase production sign-off, repeat the same test against the deployed URL after applying the SQL migrations and seed data.

## Current Limitation

The app still preserves demo-mode `localStorage` as a fallback. The new database service layer and SQL prepare the backend path, but a full UI migration of every mutation to Supabase should be completed feature-by-feature after supervisor review.

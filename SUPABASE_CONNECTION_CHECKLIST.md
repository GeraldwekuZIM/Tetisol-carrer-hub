# Supabase Connection Checklist

Use this checklist before presenting or redeploying Tetisol Hub.

## Required Netlify Environment Variables

Set these in Netlify site settings under **Environment variables**:

```text
NEXT_PUBLIC_SUPABASE_URL=https://copxovwoureigdtjbhgq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<official publishable key>
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
```

Do not add `SUPABASE_SERVICE_ROLE_KEY` to Netlify. It is only for the local seed script.

## Required Supabase Setup

1. Open Supabase SQL Editor.
2. Run `supabase/schema.sql`.
3. Confirm these tables exist:
   - `profiles`
   - `courses`
   - `lessons`
   - `enrollments`
   - `lesson_progress`
   - `opportunities`
   - `saved_opportunities`
   - `cv_profiles`
4. Add `SUPABASE_SERVICE_ROLE_KEY` to local `.env.local`.
5. Run:

```powershell
npm run seed:supabase
```

## Verification Routes

Local development:

```text
http://localhost:3000/debug/backend
```

Production:

```text
https://your-netlify-site/debug/backend
```

In production, this route only renders for an authenticated admin profile. Otherwise it returns 404.

## What The Debug Page Must Show

- Supabase URL detected: `Yes`
- Current auth user: your signed-in account
- Profile row status: profile name and role
- Courses count: greater than `0` after seeding
- Opportunities count: greater than `0` after seeding
- Enrollments count: greater than `0` after seeding

## Current Official Backend Status

The public key reached the Supabase project, but the current project returned:

```text
Could not find the table 'public.courses' in the schema cache
Could not find the table 'public.opportunities' in the schema cache
Could not find the table 'public.profiles' in the schema cache
```

That means the application is now wired to query Supabase, but the official Supabase project still needs `supabase/schema.sql` applied and then seeded before real data can appear.

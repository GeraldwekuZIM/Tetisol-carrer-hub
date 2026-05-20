# Setup And Runbook

## Prerequisites

- Node.js compatible with Next.js 16.
- npm.
- Optional: Supabase project if you want real auth.

## Install

```bash
npm install
```

The existing README uses a more cache-friendly command:

```bash
npm install --prefer-offline --no-audit --progress=false
```

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Environment Variables

Create `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

Required for Supabase Auth mode:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-public-anon-key
```

If these are not set, the project runs in local demo mode.

## Demo Mode

Demo mode uses:

- Seeded data from `lib/demo-data.ts`.
- Browser `localStorage` persistence.
- Local credential checking in `services/career-hub-service.ts`.

The localStorage key is:

```text
tetisol-learning-platform-state-v3
```

To reset a demo, clear localStorage and refresh.

## Supabase Setup

1. Create a Supabase project.
2. Add the public URL and publishable key to `.env.local`.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Run `supabase/seed.sql`.
5. Enable email auth if you want real sign in and sign up.

Current Supabase coverage:

- Schema, indexes, RLS policies, and storage buckets exist.
- Browser auth is wired.
- Full UI persistence for learning, CV, applications, and admin content is not yet wired end to end.

## Demo Credentials

All seeded users use password:

```text
careerhub
```

Student accounts:

```text
new@tetisol.com
demo@tetisol.com
stalled@tetisol.com
almost@tetisol.com
ready@tetisol.com
```

Admin account:

```text
admin@tetisol.com
```

## Useful Demo URLs

```text
/
/auth
/dashboard
/courses
/learning
/certificates
/internships
/saved
/applications
/cv-builder
/profile
/admin
/admin/courses
/admin/analytics
/admin/internships
```

## Troubleshooting

### App Keeps Old Demo Data

Clear browser localStorage for `localhost:3000`, then refresh.

### Admin Link Does Not Show

Sign in as:

```text
admin@tetisol.com
```

with password:

```text
careerhub
```

The admin link is shown only when the active user role is `admin`.

### Supabase Auth Is Not Used

Check that both public Supabase environment variables exist. If either one is missing, the app intentionally uses local demo mode.

### Dynamic Routes And Next.js 16

This project uses the Next.js 16 App Router pattern where dynamic route params are awaited:

```ts
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}
```

This matches the local framework docs in `node_modules/next/dist/docs/`.

## Suggested Pre-Demo Checklist

1. Run `npm install` if dependencies are not installed.
2. Run `npm run dev`.
3. Clear localStorage.
4. Sign in as `demo@tetisol.com`.
5. Visit dashboard, learning, internships, applications, and CV builder.
6. Sign out.
7. Sign in as `admin@tetisol.com`.
8. Visit admin courses, internships, analytics, and one student detail page.
9. Keep `docs/DEMO_GUIDE.md` open as the talk track.


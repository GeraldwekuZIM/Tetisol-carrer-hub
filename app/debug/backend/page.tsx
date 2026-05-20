import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { hasSupabasePublicEnv } from "@/utils/supabase/env"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

type Check = {
  label: string
  value: string
}

export default async function BackendDebugPage() {
  const isProduction = process.env.NODE_ENV === "production"
  const envAvailable = hasSupabasePublicEnv()
  const checks: Check[] = [
    {
      label: "Supabase URL detected",
      value: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Yes" : "No",
    },
  ]

  if (!envAvailable) {
    if (isProduction) {
      notFound()
    }

    checks.push({
      label: "Backend status",
      value: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    })

    return <DebugLayout checks={checks} />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("id, email, role, full_name")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null }

  if (isProduction && profile?.role !== "admin") {
    notFound()
  }

  const [courses, opportunities, enrollments] = await Promise.all([
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("opportunities").select("id", { count: "exact", head: true }),
    supabase.from("enrollments").select("id", { count: "exact", head: true }),
  ])

  checks.push(
    {
      label: "Current auth user",
      value: user?.email ?? user?.id ?? "No active Supabase session",
    },
    {
      label: "Profile row status",
      value: profile
        ? `${profile.full_name || profile.email} (${profile.role})`
        : "No profile row for current session",
    },
    {
      label: "Courses count",
      value: courses.error ? `Error: ${courses.error.message}` : String(courses.count ?? 0),
    },
    {
      label: "Opportunities count",
      value: opportunities.error
        ? `Error: ${opportunities.error.message}`
        : String(opportunities.count ?? 0),
    },
    {
      label: "Enrollments count",
      value: enrollments.error
        ? `Error: ${enrollments.error.message}`
        : String(enrollments.count ?? 0),
    }
  )

  return <DebugLayout checks={checks} />
}

function DebugLayout({ checks }: { checks: Check[] }) {
  return (
    <main className="section-shell min-h-screen py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Backend Health Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((check) => (
            <div
              className="flex flex-col gap-1 rounded-lg border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              key={check.label}
            >
              <span className="font-medium text-slate-700">{check.label}</span>
              <span className="text-sm text-slate-600">{check.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}

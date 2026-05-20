"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BrainCircuitIcon,
  BookOpenCheckIcon,
  BriefcaseBusinessIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, LoadingCard } from "@/components/shared/app-primitives"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getContentStatus } from "@/lib/content"

const adminNavigation = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: BookOpenCheckIcon,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: LineChartIcon,
  },
  {
    label: "Internships",
    href: "/admin/internships",
    icon: BriefcaseBusinessIcon,
  },
]

export function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { activeUser, hydrated, isAdmin, state } = useCareerHub()
  const publishedCourses = state.courses.filter(
    (course) => getContentStatus(course.status) === "Published"
  ).length
  const publishedInternships = state.internships.filter(
    (internship) => getContentStatus(internship.status) === "Published"
  ).length

  if (!hydrated) {
    return (
      <div className="section-shell py-16">
        <div className="grid gap-4 lg:grid-cols-3">
          <LoadingCard className="rounded-[2rem]" />
          <LoadingCard className="rounded-[2rem]" />
          <LoadingCard className="rounded-[2rem]" />
        </div>
      </div>
    )
  }

  if (!activeUser) {
    return (
      <div className="section-shell py-12">
        <EmptyState
          action={
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/auth"
            >
              Sign in
            </Link>
          }
          className="rounded-[1.9rem]"
          description="The Tetisol content workspace is only available to signed-in internal users."
          eyebrow="Protected area"
          icon={ShieldCheckIcon}
          title="Admin sign-in required"
        />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="section-shell py-12">
        <EmptyState
          action={
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/dashboard"
            >
              Back to dashboard
            </Link>
          }
          className="rounded-[1.9rem]"
          description="Your current account does not have Tetisol internal privileges. Admins and instructors can use this workspace to collaborate on course content."
          eyebrow="Access denied"
          icon={ShieldCheckIcon}
          title="Internal permission required"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="section-shell grid gap-5 py-5 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[1.9rem] border border-slate-800/80 bg-slate-950 p-5 text-white shadow-[0_28px_80px_-42px_rgba(15,23,42,0.9)] lg:sticky lg:top-5 lg:self-start">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                Tetisol internal
              </p>
              <h1 className="mt-2 font-heading text-2xl font-semibold">
                Content workspace
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Manage learning and career content without touching code.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-medium text-slate-200">
                  {activeUser.role ?? "admin"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-medium text-slate-200">
                  <BrainCircuitIcon className="size-3.5 text-sky-200" />
                  Copilot active
                </span>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Current learning catalog
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[1rem] border border-white/10 bg-white/8 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Courses
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold">
                    {state.courses.length}
                  </p>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-white/8 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Internships
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold">
                    {state.internships.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sky-200">
                  <SparklesIcon className="size-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Learner-facing now
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-200">
                    {publishedCourses} courses and {publishedInternships} internships are live across the student experience.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <Link
                  className={buttonVariants({
                    variant: "secondary",
                    className:
                      "h-10 justify-between rounded-full border-0 bg-white text-slate-950 hover:bg-white/92",
                  })}
                  href="/courses"
                >
                  View live courses
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "h-10 justify-between rounded-full border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white",
                  })}
                  href="/internships"
                >
                  View live internships
                </Link>
              </div>
            </div>

            <nav className="space-y-2">
              {adminNavigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))

                return (
                  <Link
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition",
                      isActive
                        ? "bg-white text-slate-950"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4 text-sm leading-7 text-slate-300">
              Signed in as <span className="font-semibold text-white">{activeUser.fullName}</span>.
              Use the learner dashboard for student flows and this workspace for publishing and operational updates.
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <header className="premium-panel px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Internal CMS
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                  Content operations
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Draft, publish, and maintain Tetisol learning and opportunity content.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
                    <BrainCircuitIcon className="size-3.5" />
                    AI copilot available on every admin page
                  </div>
                  <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600">
                    Student + admin content flow linked
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "rounded-full px-4",
                  })}
                  href="/admin/analytics"
                >
                  Analytics
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "rounded-full px-4",
                  })}
                  href="/dashboard"
                >
                  Learner dashboard
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "default",
                    className: "rounded-full px-4",
                  })}
                  href="/admin/courses/new"
                >
                  New course
                </Link>
              </div>
            </div>
          </header>

          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

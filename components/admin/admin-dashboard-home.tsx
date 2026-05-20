"use client"

import Link from "next/link"
import { ArrowRightIcon, BriefcaseBusinessIcon, FileStackIcon, PlusIcon } from "lucide-react"

import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { PageIntro, StatCard } from "@/components/shared/app-primitives"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getActiveInternships, getContentStatus } from "@/lib/content"
import { cn } from "@/lib/utils"

export function AdminDashboardHome() {
  const { state } = useCareerHub()
  const publishedCourses = state.courses.filter(
    (course) => getContentStatus(course.status) === "Published"
  )
  const draftCourses = state.courses.filter(
    (course) => getContentStatus(course.status) === "Draft"
  )
  const activeInternships = getActiveInternships(state.internships)
  const recentCourses = [...state.courses]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 4)
  const recentInternships = [...state.internships]
    .sort((left, right) => right.postedAt.localeCompare(left.postedAt))
    .slice(0, 4)

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Admin dashboard"
        title="Operate Tetisol content from one internal workspace"
        description="This internal CMS keeps learning and internship content organized, editable, and publishable without touching the codebase."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/admin/courses/new"
            >
              <PlusIcon className="size-4" />
              Create course
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/admin/internships/new"
            >
              Create internship
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/dashboard"
            >
              Open student side
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          helper="All course records in the platform"
          icon={FileStackIcon}
          label="Total courses"
          value={`${state.courses.length}`}
        />
        <StatCard
          helper="All internship listings in the platform"
          icon={BriefcaseBusinessIcon}
          label="Total internships"
          value={`${state.internships.length}`}
        />
        <StatCard
          helper="Content visible in the public course catalog"
          icon={FileStackIcon}
          label="Published courses"
          value={`${publishedCourses.length}`}
        />
        <StatCard
          helper="Course content still waiting for review"
          icon={FileStackIcon}
          label="Draft courses"
          value={`${draftCourses.length}`}
        />
        <StatCard
          helper="Live internships still within deadline"
          icon={BriefcaseBusinessIcon}
          label="Active internships"
          value={`${activeInternships.length}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="premium-panel">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-slate-950">
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              {
                href: "/admin/courses/new",
                title: "Create a new course",
                description: "Start a new learning track with modules, lessons, and quizzes.",
              },
              {
                href: "/admin/internships/new",
                title: "Create a new internship",
                description: "Publish a fresh opportunity with requirements and application link.",
              },
              {
                href: "/admin/courses",
                title: "Manage all content",
                description: "Review status, update drafts, and keep published content current.",
              },
              {
                href: "/admin/analytics",
                title: "Open learner analytics",
                description: "Monitor participation, progress, risk, and internship readiness across the platform.",
              },
            ].map((item) => (
              <Link
                className="hover-lift rounded-[1.4rem] border border-border bg-white/80 p-4 transition"
                href={item.href}
                key={item.href}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRightIcon className="mt-1 size-4 text-slate-400" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="premium-panel">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-slate-950">
              Content attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              `${draftCourses.length} course drafts are still private and need review before publishing.`,
              `${activeInternships.length} internships are currently active in the public platform.`,
              `${state.internships.length - activeInternships.length} internships may need archival or deadline refresh.`,
            ].map((item) => (
              <div
                className="rounded-[1.2rem] border border-border bg-white/80 px-4 py-3 text-sm leading-6 text-slate-600"
                key={item}
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="premium-panel panel-shimmer">
        <CardContent className="grid gap-4 p-6 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Learner-side impact
            </p>
            <h2 className="font-heading text-2xl font-semibold text-slate-950">
              Published content is already shaping the student journey
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              Courses created here appear in the public catalog and learner routes.
              Internship records created here drive discovery, saved roles, and tracker flows on the student side.
            </p>
          </div>
          <div className="grid gap-3">
            <Link
              className="hover-lift rounded-[1.4rem] border border-border bg-white/80 p-4 transition"
              href="/courses"
            >
              <p className="font-semibold text-slate-950">Preview learner catalog</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review the currently published course experience as a learner would see it.
              </p>
            </Link>
            <Link
              className="hover-lift rounded-[1.4rem] border border-border bg-white/80 p-4 transition"
              href="/internships"
            >
              <p className="font-semibold text-slate-950">Preview internship discovery</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Confirm that live listings read clearly and feel trustworthy before you keep scaling content.
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="premium-panel">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-heading text-2xl text-slate-950">
                Recent courses
              </CardTitle>
              <Link
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "rounded-full text-primary hover:text-primary",
                  })
                )}
                href="/admin/courses"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCourses.map((course) => (
              <Link
                className="block rounded-[1.2rem] border border-border bg-white/80 p-4 transition hover:border-primary/20"
                href={`/admin/courses/${course.id}`}
                key={course.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{course.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {course.category} | Updated {course.updatedAt}
                    </p>
                  </div>
                  <AdminStatusBadge status={course.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="premium-panel">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-heading text-2xl text-slate-950">
                Recent internships
              </CardTitle>
              <Link
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "rounded-full text-primary hover:text-primary",
                  })
                )}
                href="/admin/internships"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInternships.map((internship) => (
              <Link
                className="block rounded-[1.2rem] border border-border bg-white/80 p-4 transition hover:border-primary/20"
                href={`/admin/internships/${internship.id}`}
                key={internship.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{internship.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {internship.company} | Deadline {internship.deadline}
                    </p>
                  </div>
                  <AdminStatusBadge status={internship.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  BookOpenCheckIcon,
  BriefcaseBusinessIcon,
  PlayCircleIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react"

import { CourseCard } from "@/components/learning/course-card"
import { ModuleAccordion } from "@/components/learning/module-accordion"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro } from "@/components/shared/app-primitives"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  getCourseBySlug,
  getCourseProgress,
  getEnrollment,
  getRelatedCourses,
} from "@/lib/learning"
import { getCourseOpportunityPreview } from "@/lib/opportunity-intelligence"

export function CourseDetail({
  slug,
}: {
  slug: string
}) {
  const router = useRouter()
  const { activeUser, activeWorkspace, publishedCourses, state, enrollInCourse } = useCareerHub()
  const course = getCourseBySlug(publishedCourses, slug)

  if (!course) {
    return (
      <div className="section-shell py-10">
        <EmptyState
          action={
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/courses"
            >
              Back to courses
            </Link>
          }
          className="rounded-[1.75rem]"
          description="This course may have moved or the link might be out of date."
          icon={BookOpenCheckIcon}
          title="Course not found"
        />
      </div>
    )
  }

  const enrollment = getEnrollment(activeWorkspace, course.id)
  const progress = getCourseProgress(course, enrollment)
  const relatedCourses = getRelatedCourses(publishedCourses, course, 3)
  const opportunityPreview = getCourseOpportunityPreview({
    course,
    internships: state.internships,
    workspace: activeWorkspace,
  })

  function handleEnroll() {
    if (!course) {
      return
    }

    if (!activeUser) {
      router.push("/auth")
      return
    }

    enrollInCourse(course.id)
    toast.success("Course added to your learning plan.")
    router.push(`/learning/${course.slug}`)
  }

  return (
    <div className="section-shell space-y-8 py-10 md:py-14">
      <PageIntro
        eyebrow={course.category}
        title={course.title}
        description={course.shortDescription}
        action={
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full px-5",
            })}
            href="/courses"
          >
            <ArrowLeftIcon className="size-4" />
            Back to courses
          </Link>
        }
      />

      <Card className="futuristic-shell panel-shimmer overflow-hidden rounded-[2rem] border-white/80 bg-white/90 shadow-[0_26px_80px_-40px_rgba(79,70,229,0.45)]">
        <div className="ambient-grid absolute inset-0 opacity-15" />
        <CardContent className="grid gap-8 p-0 xl:grid-cols-[1.1fr_0.9fr]">
          <div className={`relative overflow-hidden bg-linear-to-br ${course.heroGradient} p-8 text-white`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.18),transparent_24%)]" />
            <div className="relative max-w-2xl space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-white/18 text-white hover:bg-white/18">
                  {course.level}
                </Badge>
                <Badge className="rounded-full bg-slate-950/18 text-white hover:bg-slate-950/18">
                  {course.duration}
                </Badge>
                {course.certificateAvailable ? (
                  <Badge className="rounded-full bg-white/18 text-white hover:bg-white/18">
                    Certificate included
                  </Badge>
                ) : null}
                <Badge className="rounded-full bg-white/18 text-white hover:bg-white/18">
                  {opportunityPreview.statusLabel}
                </Badge>
              </div>
              <div>
                <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
                  {course.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
                  {course.description}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/12 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">
                    Rating
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 text-xl font-semibold">
                    <StarIcon className="size-4 fill-current" />
                    {course.rating.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/12 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">
                    Modules
                  </p>
                  <p className="mt-2 text-xl font-semibold">{course.modules.length}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/12 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">
                    Role pathways
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {opportunityPreview.matchingRoleCount}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">
                    What Tetisol sees
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/85">
                    This course strengthens signals that match {opportunityPreview.matchingRoleCount} internship pathways in the current catalog.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">
                    Suggested signal tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {opportunityPreview.suggestedSignals.slice(0, 4).map((signal) => (
                      <span
                        className="rounded-full border border-white/10 bg-white/12 px-3 py-1.5 text-xs text-white"
                        key={signal}
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-8">
            <div className="rounded-[1.5rem] border border-border bg-secondary/60 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Instructor
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-slate-950">
                {course.instructor.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {course.instructor.role} | {course.instructor.company}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {course.instructor.bio}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Your course state
                  </p>
                  <p className="mt-2 font-semibold text-slate-950">
                    {enrollment
                      ? progress.isCompleted
                        ? "Completed"
                        : "In progress"
                      : "Not enrolled yet"}
                  </p>
                </div>
                {progress.totalLessons ? (
                  <div className="rounded-[1.25rem] bg-primary/10 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-primary">
                      Progress
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">
                      {progress.progressPercent}%
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-95"
                  onClick={handleEnroll}
                  type="button"
                >
                  <PlayCircleIcon className="size-4" />
                  {enrollment ? "Continue learning" : "Enroll for free"}
                </button>
                {!activeUser ? (
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-slate-600 transition hover:border-primary/25 hover:text-primary"
                    href="/auth"
                  >
                    Create an account
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="futuristic-shell overflow-hidden rounded-[1.5rem] border border-slate-800/80 bg-slate-950 p-5 text-white">
              <div className="ambient-grid absolute inset-0 opacity-20" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sky-200">
                    <BriefcaseBusinessIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Career outcome preview
                    </p>
                    <h2 className="mt-1 font-heading text-2xl font-semibold text-white">
                      This course maps to real roles
                    </h2>
                  </div>
                </div>
                <p className="text-sm leading-7 text-slate-300">
                  Tetisol sees this course strengthening signals for {opportunityPreview.matchingRoleCount} internships in the current catalog.
                </p>
                <div className="flex flex-wrap gap-2">
                  {course.internshipFocus.map((item) => (
                    <Badge
                      key={item}
                      className="rounded-full border border-white/10 bg-white/10 text-slate-100"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-3">
                  {opportunityPreview.topInternships.slice(0, 3).map((internship) => (
                    <Link
                      className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-white/10 bg-white/8 px-4 py-3 text-sm transition hover:bg-white/12"
                      href={`/internships/${internship.slug}`}
                      key={internship.id}
                    >
                      <div>
                        <p className="font-semibold text-white">{internship.title}</p>
                        <p className="text-slate-300">{internship.company}</p>
                      </div>
                      <ArrowRightIcon className="size-4 text-slate-300" />
                    </Link>
                  ))}
                </div>
                <Link
                  className={buttonVariants({
                    variant: "secondary",
                    className: "w-full rounded-full border-0 bg-white text-slate-950 hover:bg-white/92",
                  })}
                  href="/internships"
                >
                  Explore matching internships
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="glass-card panel-shimmer rounded-[1.75rem] border-white/80">
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  What you will learn
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {course.outcomes.map((outcome) => (
                    <div
                      key={outcome}
                      className="rounded-[1.25rem] border border-border bg-white/85 px-4 py-4 text-sm leading-7 text-slate-600"
                    >
                      {outcome}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Prerequisites
                </p>
                <div className="mt-4 space-y-3">
                  {course.prerequisites.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.25rem] border border-border bg-white/85 px-4 py-4 text-sm leading-7 text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card panel-shimmer rounded-[1.75rem] border-white/80">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <BookOpenCheckIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    Course modules
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold text-slate-950">
                    Structured lessons and checkpoints
                  </h2>
                </div>
              </div>
              <ModuleAccordion
                completedLessonIds={enrollment?.completedLessonIds ?? []}
                modules={course.modules}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card panel-shimmer rounded-[1.75rem] border-white/80">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <AwardIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    Certification
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold text-slate-950">
                    {course.certificateAvailable
                      ? "Earn a Tetisol certificate"
                      : "Certificate coming later"}
                  </h2>
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                Complete the lessons and pass the quizzes to unlock a certificate that can feed directly into your Tetisol profile and CV builder.
              </p>
              {course.certificateAvailable ? (
                <div className="rounded-[1.25rem] border border-primary/12 bg-primary/8 p-4 text-sm leading-7 text-slate-600">
                  Finishing this path upgrades both your learner profile and your visible proof inside the CV builder.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="glass-card panel-shimmer rounded-[1.75rem] border-white/80">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <SparklesIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    Skills you will build
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold text-slate-950">
                    High-signal outcomes
                  </h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <Badge key={skill} className="skill-chip">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Related courses
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950">
            Keep building toward employability
          </h2>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          {relatedCourses.map((relatedCourse) => (
            <CourseCard
              key={relatedCourse.id}
              course={relatedCourse}
              ctaLabel="View course"
              href={`/courses/${relatedCourse.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

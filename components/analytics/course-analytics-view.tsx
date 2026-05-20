"use client"

import Link from "next/link"
import { useMemo } from "react"
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  AwardIcon,
  BookOpenCheckIcon,
  GraduationCapIcon,
  LineChartIcon,
  Users2Icon,
} from "lucide-react"

import {
  EngagementBadge,
  ReadinessBadge,
  RiskBadge,
} from "@/components/analytics/analytics-badges"
import { MetricBarChart } from "@/components/analytics/metric-bar-chart"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro, StatCard } from "@/components/shared/app-primitives"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatAnalyticsDate, getCourseAnalyticsById } from "@/lib/analytics"

export function CourseAnalyticsView({
  courseId,
}: {
  courseId: string
}) {
  const { state } = useCareerHub()
  const analytics = useMemo(() => getCourseAnalyticsById(state, courseId), [courseId, state])

  if (!analytics) {
    return (
      <EmptyState
        action={
          <Link
            className={buttonVariants({
              variant: "default",
              className: "rounded-full px-5",
            })}
            href="/admin/courses"
          >
            Back to courses
          </Link>
        }
        className="rounded-[1.8rem]"
        description="This course may have been removed or the analytics link is out of date."
        eyebrow="Course analytics"
        icon={BookOpenCheckIcon}
        title="Course not found"
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Course analytics"
        title={analytics.course.title}
        description="Review enrollments, progress quality, certificate movement, module performance, and which learners may need support."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/admin/courses"
            >
              <ArrowLeftIcon className="size-4" />
              Back to courses
            </Link>
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href={`/admin/courses/${analytics.course.id}`}
            >
              Edit course
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href={`/courses/${analytics.course.slug}`}
            >
              Preview learner page
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard
          helper="Learners enrolled in this course"
          icon={Users2Icon}
          label="Enrollments"
          value={`${analytics.totalEnrollments}`}
        />
        <StatCard
          helper="Active today or recently active"
          icon={LineChartIcon}
          label="Active learners"
          value={`${analytics.activeStudents}`}
        />
        <StatCard
          helper="Learners with course completion"
          icon={BookOpenCheckIcon}
          label="Completed"
          value={`${analytics.completedStudents}`}
        />
        <StatCard
          helper="Average progress across all enrollments"
          icon={GraduationCapIcon}
          label="Avg progress"
          value={`${analytics.averageProgress}%`}
        />
        <StatCard
          helper="Pass performance across attached quizzes"
          icon={GraduationCapIcon}
          label="Quiz pass rate"
          value={`${analytics.quizPassRate}%`}
        />
        <StatCard
          helper="Issued certificates linked to this course"
          icon={AwardIcon}
          label="Certificates"
          value={`${analytics.certificatesIssued}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <MetricBarChart
          description="See which modules learners finish smoothly and where engagement drops."
          items={analytics.moduleBreakdown.map((module) => ({
            label: module.title,
            value: module.averageCompletionPercent,
          }))}
          title="Module completion breakdown"
        />

        <Card className="premium-panel panel-shimmer">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-slate-950">
              Teaching signal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.3rem] border border-border bg-white/80 p-4 text-sm leading-7 text-slate-600">
              {analytics.strugglingModuleTitle
                ? `Most learners are slowing down around ${analytics.strugglingModuleTitle}. That is the best place to review clarity, pacing, or assessment difficulty.`
                : "More learner activity is needed before a clear struggle point emerges."}
            </div>
            <div className="grid gap-3">
              <div className="rounded-[1.25rem] border border-border bg-white/80 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Completion rate</p>
                <p className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                  {analytics.completionRate}%
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/80 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">At-risk learners</p>
                <p className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                  {analytics.atRiskStudents}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/80 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Eligible certificates</p>
                <p className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                  {analytics.certificateEligibleCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-panel panel-shimmer">
        <CardHeader>
          <CardTitle className="font-heading text-2xl text-slate-950">
            Module detail
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-2">
          {analytics.moduleBreakdown.map((module) => (
            <div
              className="rounded-[1.35rem] border border-border bg-white/80 p-4"
              key={module.moduleId}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{module.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {module.lessonCount} lessons
                  </p>
                </div>
                <div className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {module.completedStudents} completed
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Average module completion</span>
                    <span>{module.averageCompletionPercent}%</span>
                  </div>
                  <Progress value={module.averageCompletionPercent} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] border border-border bg-white px-4 py-3 text-sm text-slate-600">
                    Quiz pass rate <span className="font-semibold text-slate-950">{module.quizPassRate}%</span>
                  </div>
                  <div className="rounded-[1rem] border border-border bg-white px-4 py-3 text-sm text-slate-600">
                    At-risk learners <span className="font-semibold text-slate-950">{module.atRiskStudents}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="premium-panel panel-shimmer">
        <CardHeader>
          <CardTitle className="font-heading text-2xl text-slate-950">
            Learner roster
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analytics.learners.length ? (
            analytics.learners.map((learner) => {
              const courseSnapshot = learner.courses.find(
                (course) => course.courseId === analytics.course.id
              )

              return courseSnapshot ? (
                <Link
                  className="block rounded-[1.35rem] border border-border bg-white/80 p-4 transition hover:border-primary/20 hover:bg-white"
                  href={`/admin/students/${learner.userId}`}
                  key={learner.userId}
                >
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_repeat(6,minmax(0,1fr))]">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">{learner.fullName}</p>
                        <RiskBadge level={learner.riskLevel} />
                      </div>
                      <p className="text-sm text-slate-500">{learner.email}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
                      <p className="mt-2 font-semibold text-slate-950">{courseSnapshot.status}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Progress</p>
                      <p className="mt-2 font-semibold text-slate-950">{courseSnapshot.progressPercent}%</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Activity</p>
                      <div className="mt-2">
                        <EngagementBadge state={learner.engagementState} />
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quiz avg</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {courseSnapshot.averageQuizScore ?? "N/A"}
                      </p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Readiness</p>
                      <div className="mt-2">
                        <ReadinessBadge state={learner.readinessState} />
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last active</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {formatAnalyticsDate(courseSnapshot.lastActivityAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : null
            })
          ) : (
            <EmptyState
              className="rounded-[1.7rem]"
              description="No learners are enrolled in this course yet, so analytics will appear once participation begins."
              eyebrow="No activity"
              icon={Users2Icon}
              title="No enrollments yet"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

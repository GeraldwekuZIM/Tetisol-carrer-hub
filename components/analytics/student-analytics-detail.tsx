"use client"

import Link from "next/link"
import { useMemo } from "react"
import {
  ArrowLeftIcon,
  AwardIcon,
  BookOpenCheckIcon,
  BriefcaseBusinessIcon,
  GraduationCapIcon,
  LineChartIcon,
  StickyNoteIcon,
  Users2Icon,
} from "lucide-react"

import {
  EngagementBadge,
  ReadinessBadge,
  RiskBadge,
} from "@/components/analytics/analytics-badges"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro, StatCard } from "@/components/shared/app-primitives"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatAnalyticsDate, getStudentAnalyticsById } from "@/lib/analytics"

export function StudentAnalyticsDetail({
  studentId,
}: {
  studentId: string
}) {
  const { state } = useCareerHub()
  const analytics = useMemo(() => getStudentAnalyticsById(state, studentId), [state, studentId])

  if (!analytics) {
    return (
      <EmptyState
        action={
          <Link
            className={buttonVariants({
              variant: "default",
              className: "rounded-full px-5",
            })}
            href="/admin/analytics"
          >
            Back to analytics
          </Link>
        }
        className="rounded-[1.8rem]"
        description="This learner record may have been removed or the link is out of date."
        eyebrow="Student analytics"
        icon={Users2Icon}
        title="Learner not found"
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Student analytics"
        title={analytics.fullName}
        description="Review this learner's participation, progress, quiz performance, certificate movement, and internship readiness from one instructor-facing profile."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/admin/analytics"
            >
              <ArrowLeftIcon className="size-4" />
              Back to analytics
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/admin/courses"
            >
              Review courses
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <StatCard
          helper="Courses the learner has enrolled in"
          icon={GraduationCapIcon}
          label="Enrolled"
          value={`${analytics.enrolledCourseCount}`}
        />
        <StatCard
          helper="Total progress across all enrolled learning"
          icon={LineChartIcon}
          label="Progress"
          value={`${analytics.totalProgressPercent}%`}
        />
        <StatCard
          helper="Completed lessons across enrolled courses"
          icon={BookOpenCheckIcon}
          label="Lessons done"
          value={`${analytics.totalLessonsCompleted}`}
        />
        <StatCard
          helper="Approximate engagement sessions from activity data"
          icon={Users2Icon}
          label="Sessions"
          value={`${analytics.sessionCount}`}
        />
        <StatCard
          helper="Average quiz score across attempts"
          icon={GraduationCapIcon}
          label="Quiz avg"
          value={`${analytics.averageQuizScore ?? 0}%`}
        />
        <StatCard
          helper="Issued certificates linked to completed courses"
          icon={AwardIcon}
          label="Certificates"
          value={`${analytics.certificatesIssued}`}
        />
        <StatCard
          helper="Strong internship matches based on current signal"
          icon={BriefcaseBusinessIcon}
          label="Ready matches"
          value={`${analytics.readyInternshipCount}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="premium-panel panel-shimmer">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-slate-950">
              Participation and risk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <EngagementBadge state={analytics.engagementState} />
              <RiskBadge level={analytics.riskLevel} />
              <ReadinessBadge state={analytics.readinessState} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-border bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Last active</p>
                <p className="mt-2 font-semibold text-slate-950">
                  {formatAnalyticsDate(analytics.lastActiveAt)}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {analytics.engagementLabel}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Consistency</p>
                <p className="mt-2 font-semibold text-slate-950">{analytics.consistencyLabel}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {analytics.failedQuizAttempts} failed quiz attempt
                  {analytics.failedQuizAttempts === 1 ? "" : "s"} so far.
                </p>
              </div>
            </div>
            <div className="rounded-[1.3rem] border border-border bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Suggested action</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{analytics.suggestedAction}</p>
            </div>
            {analytics.riskReasons.length ? (
              <div className="space-y-2">
                {analytics.riskReasons.map((reason) => (
                  <div
                    className="rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800"
                    key={reason}
                  >
                    {reason}
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="premium-panel panel-shimmer">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-slate-950">
              Career readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>CV readiness</span>
                <span>{analytics.cvScore}%</span>
              </div>
              <Progress value={analytics.cvScore} />
            </div>
            <div className="rounded-[1.25rem] border border-border bg-white/80 p-4 text-sm leading-7 text-slate-600">
              {analytics.readinessSummary}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1rem] border border-border bg-white/80 px-4 py-3 text-sm text-slate-600">
                Completed courses{" "}
                <span className="font-semibold text-slate-950">
                  {analytics.completedCourseCount}
                </span>
              </div>
              <div className="rounded-[1rem] border border-border bg-white/80 px-4 py-3 text-sm text-slate-600">
                Eligible certificates{" "}
                <span className="font-semibold text-slate-950">
                  {analytics.certificateEligibleCount}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Skills gained</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {analytics.skillsGained.length ? (
                  analytics.skillsGained.slice(0, 10).map((skill) => (
                    <Badge key={skill} className="skill-chip">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No course-derived skills yet.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="premium-panel panel-shimmer">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-slate-950">
              Course participation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.courses.length ? (
              analytics.courses.map((course) => (
                <div
                  className="rounded-[1.35rem] border border-border bg-white/80 p-4"
                  key={course.courseId}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-950">{course.courseTitle}</p>
                      <p className="text-sm text-slate-500">{course.category}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      <p>{course.status}</p>
                      <p className="mt-1">Last active {formatAnalyticsDate(course.lastActivityAt)}</p>
                      {course.completionAt ? (
                        <p className="mt-1">Completed {formatAnalyticsDate(course.completionAt)}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>Progress</span>
                        <span>{course.progressPercent}%</span>
                      </div>
                      <Progress value={course.progressPercent} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1rem] border border-border bg-white px-4 py-3 text-sm text-slate-600">
                        Lessons{" "}
                        <span className="font-semibold text-slate-950">
                          {course.completedLessons}/{course.totalLessons}
                        </span>
                      </div>
                      <div className="rounded-[1rem] border border-border bg-white px-4 py-3 text-sm text-slate-600">
                        Quiz avg{" "}
                        <span className="font-semibold text-slate-950">
                          {course.averageQuizScore ?? "N/A"}
                        </span>
                      </div>
                      <div className="rounded-[1rem] border border-border bg-white px-4 py-3 text-sm text-slate-600">
                        Pass rate{" "}
                        <span className="font-semibold text-slate-950">
                          {course.quizPassRate}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        className={buttonVariants({
                          variant: "outline",
                          className: "rounded-full px-4",
                        })}
                        href={`/admin/courses/${course.courseId}/analytics`}
                      >
                        View course analytics
                      </Link>
                      <Link
                        className={buttonVariants({
                          variant: "outline",
                          className: "rounded-full px-4",
                        })}
                        href={`/courses/${course.courseSlug}`}
                      >
                        Open course page
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                className="rounded-[1.7rem]"
                description="This learner has not enrolled in any courses yet."
                eyebrow="No participation"
                icon={GraduationCapIcon}
                title="No course activity yet"
              />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="premium-panel panel-shimmer">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-slate-950">
                Internship match insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.matchingInternships.length ? (
                analytics.matchingInternships.slice(0, 4).map((internship) => (
                  <div
                    className="rounded-[1.25rem] border border-border bg-white/80 p-4"
                    key={internship.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{internship.title}</p>
                        <p className="text-sm text-slate-500">
                          {internship.company} | {internship.location}
                        </p>
                      </div>
                      <div className="rounded-full border border-primary/12 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                        {internship.matchScore}% match
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {internship.matchReasons.join(". ")}.
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState
                  className="rounded-[1.6rem]"
                  description="More learning and profile clarity are needed before internship readiness becomes clear."
                  eyebrow="No role fit yet"
                  icon={BriefcaseBusinessIcon}
                  title="No strong internship matches"
                />
              )}
            </CardContent>
          </Card>

          <Card className="premium-panel panel-shimmer">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-slate-950">
                Learner profile signal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.25rem] border border-border bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Education</p>
                <p className="mt-2 font-semibold text-slate-950">{analytics.degree}</p>
                <p className="mt-1 text-sm text-slate-600">{analytics.school}</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Location</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{analytics.profileLocation}</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">CV guidance</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This learner currently has a {analytics.cvScore}% CV score and a readiness state of{" "}
                  {analytics.readinessState.toLowerCase()}.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/80 p-4">
                <div className="flex items-center gap-2">
                  <StickyNoteIcon className="size-4 text-primary" />
                  <p className="font-semibold text-slate-950">Instructor takeaway</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {analytics.suggestedAction}
                </p>
              </div>
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full rounded-full",
                })}
                href="/admin/internships"
              >
                Review internship listings
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

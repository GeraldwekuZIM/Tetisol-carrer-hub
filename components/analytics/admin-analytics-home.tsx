"use client"

import Link from "next/link"
import { useMemo } from "react"
import {
  AlertTriangleIcon,
  ArrowRightIcon,
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
import { formatAnalyticsDate, getPlatformAnalytics } from "@/lib/analytics"
import { cn } from "@/lib/utils"

export function AdminAnalyticsHome() {
  const { state } = useCareerHub()
  const analytics = useMemo(() => getPlatformAnalytics(state), [state])

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Instructor analytics"
        title="Monitor participation, performance, and career readiness"
        description="This dashboard translates learner activity into a usable teaching view: who is active, who is stuck, which courses are lagging, and who is ready to move toward internships."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/admin/courses"
            >
              Review courses
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/dashboard"
            >
              Open learner dashboard
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <StatCard
          helper="Learners with recorded workspace activity"
          icon={Users2Icon}
          label="Students"
          value={`${analytics.totalStudents}`}
        />
        <StatCard
          helper="Active today or recently active"
          icon={LineChartIcon}
          label="Active learners"
          value={`${analytics.activeLearners}`}
        />
        <StatCard
          helper="No meaningful activity in the last 5 days"
          icon={AlertTriangleIcon}
          label="Inactive"
          value={`${analytics.inactiveLearners}`}
        />
        <StatCard
          helper="Average progress across all enrolled learning"
          icon={BookOpenCheckIcon}
          label="Avg progress"
          value={`${analytics.averageProgress}%`}
        />
        <StatCard
          helper="Completed enrollments across the platform"
          icon={GraduationCapIcon}
          label="Completion rate"
          value={`${analytics.completionRate}%`}
        />
        <StatCard
          helper="Average pass performance across all attempts"
          icon={GraduationCapIcon}
          label="Quiz pass rate"
          value={`${analytics.quizPassRate}%`}
        />
        <StatCard
          helper="Total certificates issued to date"
          icon={AwardIcon}
          label="Certificates"
          value={`${analytics.certificatesIssued}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <MetricBarChart
          description="See how many learners are just starting, in motion, close to completion, or fully done."
          items={analytics.progressDistribution.map((item) => ({
            label: item.label,
            value: item.count,
          }))}
          title="Progress distribution"
        />
        <MetricBarChart
          description="Attendance is engagement-based in Tetisol, so these buckets reflect recency of learner activity."
          items={analytics.engagementDistribution.map((item) => ({
            label: item.label,
            value: item.count,
          }))}
          title="Engagement distribution"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="premium-panel panel-shimmer">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-heading text-2xl text-slate-950">
                At-risk learners
              </CardTitle>
              <div className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700">
                {analytics.atRiskStudents} flagged
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.atRiskLearners.length ? (
              analytics.atRiskLearners.map((student) => (
                <Link
                  className="block rounded-[1.35rem] border border-border bg-white/80 p-4 transition hover:border-primary/20 hover:bg-white"
                  href={`/admin/students/${student.userId}`}
                  key={student.userId}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">{student.fullName}</p>
                        <RiskBadge level={student.riskLevel} />
                        <EngagementBadge state={student.engagementState} />
                      </div>
                      <p className="text-sm text-slate-500">
                        {student.degree} | {student.school}
                      </p>
                      <p className="text-sm leading-6 text-slate-600">
                        {student.riskReasons[0] ?? student.suggestedAction}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">
                      <p>Last active {formatAnalyticsDate(student.lastActiveAt)}</p>
                      <p className="mt-1">{student.totalProgressPercent}% total progress</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                className="rounded-[1.6rem]"
                description="No learners currently match the at-risk rules."
                eyebrow="Healthy cohort"
                icon={BookOpenCheckIcon}
                title="No at-risk learners right now"
              />
            )}
          </CardContent>
        </Card>

        <Card className="premium-panel panel-shimmer">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-heading text-2xl text-slate-950">
                Internship-ready learners
              </CardTitle>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                {analytics.readyToApplyStudents} ready
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.readyLearners.length ? (
              analytics.readyLearners.map((student) => (
                <Link
                  className="block rounded-[1.35rem] border border-border bg-white/80 p-4 transition hover:border-primary/20 hover:bg-white"
                  href={`/admin/students/${student.userId}`}
                  key={student.userId}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">{student.fullName}</p>
                        <ReadinessBadge state={student.readinessState} />
                      </div>
                      <p className="text-sm leading-6 text-slate-600">
                        {student.readinessSummary}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">
                      <p>{student.readyInternshipCount} internship matches</p>
                      <p className="mt-1">CV score {student.cvScore}%</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                className="rounded-[1.6rem]"
                description="Learners will appear here once they have stronger proof, CV quality, and opportunity fit."
                eyebrow="Not yet"
                icon={AwardIcon}
                title="No internship-ready learners yet"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="premium-panel panel-shimmer">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="font-heading text-2xl text-slate-950">
              Course analytics snapshot
            </CardTitle>
            <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600">
              Hardest course: {analytics.mostDifficultCourse ?? "No data yet"}
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Use this overview to see where engagement, completion, and risk are concentrating.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {analytics.courseSnapshots.map((course) => (
            <div
              className="grid gap-3 rounded-[1.3rem] border border-border bg-white/80 px-4 py-4 md:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))_auto]"
              key={course.courseId}
            >
              <div>
                <p className="font-semibold text-slate-950">{course.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {course.enrollments} enrollments
                </p>
              </div>
              <div className="text-sm text-slate-600">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Completion</p>
                <p className="mt-1 font-semibold text-slate-950">{course.completionRate}%</p>
              </div>
              <div className="text-sm text-slate-600">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg progress</p>
                <p className="mt-1 font-semibold text-slate-950">{course.averageProgress}%</p>
              </div>
              <div className="text-sm text-slate-600">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">At risk</p>
                <p className="mt-1 font-semibold text-slate-950">{course.atRiskStudents}</p>
              </div>
              <div className="text-sm text-slate-600">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Learners</p>
                <p className="mt-1 font-semibold text-slate-950">{course.enrollments}</p>
              </div>
              <Link
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    className: "rounded-full px-4",
                  }),
                  "justify-self-start md:justify-self-end"
                )}
                href={`/admin/courses/${course.courseId}/analytics`}
              >
                View analytics
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="premium-panel panel-shimmer">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="font-heading text-2xl text-slate-950">
              Learner participation roster
            </CardTitle>
            <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600">
              Weakest module: {analytics.mostDifficultModule ?? "No data yet"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {analytics.studentSummaries.map((student) => (
            <Link
              className="block rounded-[1.35rem] border border-border bg-white/80 p-4 transition hover:border-primary/20 hover:bg-white"
              href={`/admin/students/${student.userId}`}
              key={student.userId}
            >
              <div className="grid gap-4 xl:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))]">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{student.fullName}</p>
                    <RiskBadge level={student.riskLevel} />
                  </div>
                  <p className="text-sm text-slate-500">{student.email}</p>
                  <p className="text-sm text-slate-600">{student.degree}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Engagement</p>
                  <div className="mt-2">
                    <EngagementBadge state={student.engagementState} />
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Progress</p>
                  <p className="mt-2 font-semibold text-slate-950">{student.totalProgressPercent}%</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Courses</p>
                  <p className="mt-2 font-semibold text-slate-950">{student.enrolledCourseCount}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quiz avg</p>
                  <p className="mt-2 font-semibold text-slate-950">
                    {student.averageQuizScore ?? "N/A"}
                  </p>
                </div>
                <div className="text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Readiness</p>
                  <div className="mt-2">
                    <ReadinessBadge state={student.readinessState} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

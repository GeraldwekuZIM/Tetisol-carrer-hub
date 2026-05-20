"use client"

import Link from "next/link"
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  AwardIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CompassIcon,
  FileCheck2Icon,
  PlayCircleIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react"

import { AICoachPanel } from "@/components/intelligence/ai-coach-panel"
import { IntelligenceCard } from "@/components/intelligence/intelligence-card"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import {
  EmptyState,
  PageIntro,
  StatCard,
} from "@/components/shared/app-primitives"
import { TrajectoryPanel } from "@/components/shared/trajectory-panel"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCourseProgress, getEnrollment } from "@/lib/learning"
import { cn } from "@/lib/utils"

export function DashboardHome() {
  const {
    activeUser,
    activeWorkspace,
    recommendedInternships,
    recommendedCourses,
    inProgressCourses,
    completedCourses,
    earnedCertificates,
    dashboardReminders,
    savedInternships,
    opportunityIntelligence,
  } = useCareerHub()

  if (!activeWorkspace) {
    return null
  }

  const applicationCount = activeWorkspace.applications.length
  const resumeCourse = inProgressCourses[0]
  const resumeCourseProgress = resumeCourse
    ? getCourseProgress(resumeCourse, getEnrollment(activeWorkspace, resumeCourse.id))
    : null
  const recommendedCourse = recommendedCourses[0]
  const recommendedInternship = recommendedInternships[0]

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Tetisol mission control"
        title={`Welcome back, ${activeWorkspace.profile.name || "learner"}`}
        description="This workspace now behaves like a living guidance system. It reads your learning momentum, proof strength, opportunity quality, and CV health to surface the fastest move toward employability."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={cn(
                buttonVariants({
                  variant: "default",
                  className: "rounded-full px-5",
                }),
                "gap-2"
              )}
              href={resumeCourse ? `/learning/${resumeCourse.slug}` : "/courses"}
            >
              {resumeCourse ? "Resume course" : "Explore courses"}
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/internships"
            >
              Explore internships
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper="Courses actively shaping your skill graph"
          icon={PlayCircleIcon}
          label="In progress"
          value={`${inProgressCourses.length}`}
        />
        <StatCard
          helper="Validated learning proof ready for your profile"
          icon={AwardIcon}
          label="Certificates"
          value={`${earnedCertificates.length}`}
        />
        <StatCard
          helper="Saved and tracked opportunities in motion"
          icon={BriefcaseBusinessIcon}
          label="Opportunity flow"
          value={`${savedInternships.length + applicationCount}`}
        />
        <StatCard
          helper="Your strongest employability signal right now"
          icon={FileCheck2Icon}
          label="CV score"
          value={`${activeWorkspace.cv.score}%`}
        />
      </div>

      {opportunityIntelligence ? (
        <AICoachPanel
          activePersona={activeUser?.demoPersonaState}
          applicationCount={applicationCount}
          cvScore={activeWorkspace.cv.score}
          intelligence={opportunityIntelligence}
          learningCount={inProgressCourses.length + completedCourses.length}
        />
      ) : null}

      <TrajectoryPanel
        applicationCount={applicationCount}
        certificateCount={earnedCertificates.length}
        cvScore={activeWorkspace.cv.score}
        learningCount={inProgressCourses.length + completedCourses.length}
        savedCount={savedInternships.length}
      />

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <Card className="premium-panel panel-shimmer overflow-hidden">
            <CardContent className="grid gap-6 p-6 md:grid-cols-[1.08fr_0.92fr]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <PlayCircleIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                      Resume lane
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-slate-950">
                      {resumeCourse ? resumeCourse.title : "Start your first learning path"}
                    </h2>
                  </div>
                </div>

                {resumeCourse && resumeCourseProgress ? (
                  <>
                    <p className="text-sm leading-7 text-slate-600">
                      {resumeCourseProgress.nextLesson
                        ? `Next lesson: ${resumeCourseProgress.nextLesson.title}`
                        : "You are almost at the finish line on this course."}
                    </p>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>
                          {resumeCourseProgress.completedLessons}/{resumeCourseProgress.totalLessons} lessons complete
                        </span>
                        <span>{resumeCourseProgress.progressPercent}%</span>
                      </div>
                      <Progress value={resumeCourseProgress.progressPercent} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeCourse.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} className="skill-chip">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      className={buttonVariants({
                        variant: "default",
                        className: "rounded-full px-5",
                      })}
                      href={`/learning/${resumeCourse.slug}`}
                    >
                      Continue learning
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm leading-7 text-slate-600">
                      Tetisol becomes much more powerful once you have active learning in the system. Courses feed certificates, CV skills, and internship matching automatically.
                    </p>
                    <Link
                      className={buttonVariants({
                        variant: "default",
                        className: "rounded-full px-5",
                      })}
                      href="/courses"
                    >
                      Browse courses
                    </Link>
                  </>
                )}
              </div>

              <div className="futuristic-shell overflow-hidden rounded-[1.7rem] border border-slate-800/80 bg-slate-950 p-5 text-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.75)]">
                <div className="ambient-grid absolute inset-0 opacity-20" />
                <div className="ambient-nodes absolute inset-0 opacity-70" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                    Momentum state
                  </p>
                  <h3 className="mt-3 font-heading text-2xl font-semibold">
                    {opportunityIntelligence?.momentumLabel ?? "Signal still forming"}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {opportunityIntelligence?.alerts[0]?.description ??
                      "Each finished lesson, note, and assessment improves what Tetisol can recommend next."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                      Completed courses {completedCourses.length}
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                      Saved roles {savedInternships.length}
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                      Certificates {earnedCertificates.length}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Opportunity insights
                </p>
                <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950">
                  Guidance generated from your current signal
                </h2>
              </div>
              {opportunityIntelligence ? (
                <Badge className="rounded-full border border-primary/12 bg-primary/8 text-primary">
                  {opportunityIntelligence.matchingInternshipCount} strong matches
                </Badge>
              ) : null}
            </div>
            {opportunityIntelligence?.insights.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {opportunityIntelligence.insights.map((insight) => (
                  <IntelligenceCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <EmptyState
                className="rounded-[1.75rem]"
                description="Tetisol will surface intelligence here as your learning path, CV, and opportunities become more specific."
                eyebrow="No insights yet"
                icon={SparklesIcon}
                title="Signal still warming up"
              />
            )}
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="premium-panel panel-shimmer hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                      Recommended course
                    </p>
                    <CardTitle className="mt-2 font-heading text-2xl text-slate-950">
                      Keep compounding your skill stack
                    </CardTitle>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <CompassIcon className="size-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedCourse ? (
                  <>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-slate-950">
                        {recommendedCourse.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {recommendedCourse.shortDescription}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recommendedCourse.matchReasons.map((reason) => (
                        <Badge
                          key={reason}
                          className="rounded-full border border-primary/12 bg-primary/8 text-primary"
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      className={buttonVariants({
                        variant: "default",
                        className: "w-full rounded-full",
                      })}
                      href={`/courses/${recommendedCourse.slug}`}
                    >
                      Review course
                    </Link>
                  </>
                ) : (
                  <EmptyState
                    className="rounded-[1.5rem]"
                    description="Complete onboarding and add more interests to unlock smarter learning recommendations."
                    eyebrow="No recommendation yet"
                    icon={CompassIcon}
                    title="Tetisol is still learning your direction"
                  />
                )}
              </CardContent>
            </Card>

            <Card className="premium-panel panel-shimmer hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                      Opportunity radar
                    </p>
                    <CardTitle className="mt-2 font-heading text-2xl text-slate-950">
                      Internships that fit your recent signals
                    </CardTitle>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <TargetIcon className="size-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedInternship ? (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-slate-950">
                          {recommendedInternship.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {recommendedInternship.company} | {recommendedInternship.location}
                        </p>
                      </div>
                      <Badge className="rounded-full bg-primary/10 text-primary">
                        {recommendedInternship.matchScore}% match
                      </Badge>
                    </div>
                    <p className="text-sm leading-7 text-slate-600">
                      Recommended because you studied or signaled interest in{" "}
                      {recommendedInternship.matchReasons.join(", ").toLowerCase()}.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recommendedInternship.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} className="skill-chip">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      className={buttonVariants({
                        variant: "default",
                        className: "w-full rounded-full",
                      })}
                      href={`/internships/${recommendedInternship.slug}`}
                    >
                      View internship
                    </Link>
                  </>
                ) : (
                  <EmptyState
                    className="rounded-[1.5rem]"
                    description="As your profile, courses, and skills grow, Tetisol will map that signal into better internship suggestions."
                    eyebrow="No match yet"
                    icon={BriefcaseBusinessIcon}
                    title="Opportunity matching is still warming up"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="premium-panel panel-shimmer">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="font-heading text-2xl text-slate-950">
                  Career readiness alerts
                </CardTitle>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <AlertTriangleIcon className="size-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {opportunityIntelligence?.alerts.length ? (
                opportunityIntelligence.alerts.map((alert) => (
                  <IntelligenceCard key={alert.id} insight={alert} />
                ))
              ) : (
                <EmptyState
                  className="rounded-[1.5rem]"
                  description="When Tetisol detects risk or urgency, it will surface it here."
                  eyebrow="Quiet system"
                  icon={CheckCircle2Icon}
                  title="No alerts right now"
                />
              )}
            </CardContent>
          </Card>

          <Card className="premium-panel panel-shimmer">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-slate-950">
                Reminders and deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardReminders.length ? (
                dashboardReminders.map((reminder) => (
                  <Link
                    key={reminder.id}
                    className="block rounded-[1.25rem] border border-border bg-white/80 p-4 transition hover:border-primary/20 hover:bg-white"
                    href={reminder.href}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{reminder.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {reminder.description}
                        </p>
                      </div>
                      <Badge className="rounded-full border border-border bg-secondary text-slate-600">
                        {reminder.date}
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState
                  className="rounded-[1.5rem]"
                  description="When you resume courses, take assessments, or track more roles, Tetisol will surface the next important thing here."
                  eyebrow="Clear for now"
                  icon={CheckCircle2Icon}
                  title="No urgent reminders"
                />
              )}
            </CardContent>
          </Card>

          <Card className="premium-panel panel-shimmer">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-slate-950">
                CV momentum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Current employability signal</span>
                  <span>{activeWorkspace.cv.score}%</span>
                </div>
                <Progress value={activeWorkspace.cv.score} />
              </div>
              <div className="grid gap-3">
                {activeWorkspace.cv.suggestions.slice(0, 3).map((suggestion) => (
                  <div
                    key={suggestion}
                    className="rounded-[1.25rem] border border-border bg-white/75 px-4 py-3 text-sm leading-6 text-slate-600"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
              <Link
                className={buttonVariants({
                  variant: "default",
                  className: "w-full rounded-full",
                })}
                href="/cv-builder"
              >
                Improve CV
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

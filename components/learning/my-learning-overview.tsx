"use client"

import Link from "next/link"
import {
  AwardIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  PlayCircleIcon,
  StickyNoteIcon,
} from "lucide-react"

import { CertificateCard } from "@/components/learning/certificate-card"
import { CourseCard } from "@/components/learning/course-card"
import { getCourseProgress, getEnrollment } from "@/lib/learning"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro, StatCard } from "@/components/shared/app-primitives"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function EmptyLearningState() {
  return (
    <EmptyState
      action={
        <Link
          className={buttonVariants({
            variant: "default",
            className: "rounded-full px-5",
          })}
          href="/courses"
        >
          Explore courses
        </Link>
      }
      className="rounded-[1.75rem]"
      description="Enroll in a course to start building skills, tracking progress, and earning certificates that strengthen your career profile."
      eyebrow="Learning area"
      icon={BookOpenIcon}
      title="Your learning area is still empty"
    />
  )
}

export function MyLearningOverview() {
  const {
    activeWorkspace,
    enrolledCourses,
    inProgressCourses,
    completedCourses,
    earnedCertificates,
    state,
  } = useCareerHub()

  if (!activeWorkspace) {
    return null
  }

  const resumeCourse = inProgressCourses[0]
  const resumeProgress = resumeCourse
    ? getCourseProgress(resumeCourse, getEnrollment(activeWorkspace, resumeCourse.id))
    : null

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="My learning"
        title="Track momentum, revisit notes, and convert progress into proof"
        description="This space keeps your enrolled courses, course notes, completed learning, and certificates aligned with the rest of your Tetisol journey."
        action={
          <Link
            className={buttonVariants({
              variant: "default",
              className: "rounded-full px-5",
            })}
            href={resumeCourse ? `/learning/${resumeCourse.slug}` : "/courses"}
          >
            {resumeCourse ? "Resume course" : "Find a course"}
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper="Courses added to your learning plan"
          icon={BookOpenIcon}
          label="Enrolled"
          value={`${enrolledCourses.length}`}
        />
        <StatCard
          helper="Courses with active momentum"
          icon={PlayCircleIcon}
          label="In progress"
          value={`${inProgressCourses.length}`}
        />
        <StatCard
          helper="Learning paths you have completed"
          icon={CheckCircle2Icon}
          label="Completed"
          value={`${completedCourses.length}`}
        />
        <StatCard
          helper="Notes captured from active lessons"
          icon={StickyNoteIcon}
          label="Notes"
          value={`${activeWorkspace.learningNotes.length}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="premium-panel">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Resume path
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                  {resumeCourse ? resumeCourse.title : "Start building your first skill lane"}
                </h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                {resumeCourse && resumeProgress
                  ? `You are ${resumeProgress.progressPercent}% through this course. The next lesson is ${resumeProgress.nextLesson?.title ?? "ready for review"}.`
                  : "Once you enroll in a course, Tetisol will keep your next lesson, notes, and assessment path right here."}
              </p>
              <div className="flex flex-wrap gap-2">
                {(resumeCourse?.skills ?? completedCourses[0]?.skills ?? []).slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-sm text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Link
                className={buttonVariants({
                  variant: "default",
                  className: "rounded-full px-5",
                })}
                href={resumeCourse ? `/learning/${resumeCourse.slug}` : "/courses"}
              >
                {resumeCourse ? "Continue learning" : "Explore courses"}
              </Link>
            </div>

            <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                Learning proof
              </p>
              <p className="mt-3 font-heading text-4xl font-semibold">
                {earnedCertificates.length}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Certificates earned so far. Every finished course gives you stronger proof for internships, CV improvements, and profile credibility.
              </p>
              <div className="mt-5 grid gap-2 text-sm text-slate-200">
                <div className="rounded-full bg-white/10 px-3 py-2">
                  Completed courses: {completedCourses.length}
                </div>
                <div className="rounded-full bg-white/10 px-3 py-2">
                  Notes captured: {activeWorkspace.learningNotes.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-panel">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <AwardIcon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Certificate value
                </p>
                <h2 className="font-heading text-2xl font-semibold text-slate-950">
                  Learning that becomes visible
                </h2>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              Tetisol certificates are not isolated badges. They reinforce your profile, feed the CV builder, and make internship recommendations more credible.
            </p>
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "w-full rounded-full",
              })}
              href="/certificates"
            >
              View certificates
            </Link>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress">
        <TabsList className="rounded-full border border-white/80 bg-white/80 p-1">
          <TabsTrigger className="rounded-full px-5" value="in-progress">
            In progress
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-5" value="completed">
            Completed
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-5" value="certificates">
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-5 pt-4" value="in-progress">
          {inProgressCourses.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {inProgressCourses.map((course) => {
                const enrollment = getEnrollment(activeWorkspace, course.id)
                const progress = getCourseProgress(course, enrollment)
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    ctaLabel="Resume course"
                    href={`/learning/${course.slug}`}
                    progress={progress}
                  />
                )
              })}
            </div>
          ) : (
            <EmptyLearningState />
          )}
        </TabsContent>

        <TabsContent className="space-y-5 pt-4" value="completed">
          {completedCourses.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {completedCourses.map((course) => {
                const enrollment = getEnrollment(activeWorkspace, course.id)
                const progress = getCourseProgress(course, enrollment)
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    ctaLabel="Review course"
                    href={`/learning/${course.slug}`}
                    progress={progress}
                  />
                )
              })}
            </div>
          ) : (
            <EmptyLearningState />
          )}
        </TabsContent>

        <TabsContent className="space-y-5 pt-4" value="certificates">
          {earnedCertificates.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {earnedCertificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  course={state.courses.find((course) => course.id === certificate.courseId)}
                />
              ))}
            </div>
          ) : (
            <EmptyLearningState />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

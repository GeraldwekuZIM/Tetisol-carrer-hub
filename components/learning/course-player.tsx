"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  FileTextIcon,
  PlayCircleIcon,
  StickyNoteIcon,
} from "lucide-react"

import { LearningProgressBar } from "@/components/learning/learning-progress-bar"
import { LessonSidebarItem } from "@/components/learning/lesson-sidebar-item"
import { QuizCard } from "@/components/learning/quiz-card"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro } from "@/components/shared/app-primitives"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  getAllLessons,
  getAttemptForQuiz,
  getCourseBySlug,
  getCourseProgress,
  getEnrollment,
  getLessonNote,
  getLessonTypeLabel,
  getModuleByLessonId,
  getQuizById,
} from "@/lib/learning"
import { getCourseOpportunityPreview } from "@/lib/opportunity-intelligence"

function LessonNoteEditor({
  initialValue,
  onSave,
}: {
  initialValue: string
  onSave: (value: string) => void
}) {
  const [noteDraft, setNoteDraft] = useState(initialValue)

  return (
    <>
      <Textarea
        className="min-h-40 rounded-[1.25rem] bg-white/90"
        onChange={(event) => setNoteDraft(event.target.value)}
        placeholder="Capture portfolio-ready insights, implementation ideas, or interview talking points from this lesson."
        value={noteDraft}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          onClick={() => onSave(noteDraft)}
          type="button"
        >
          Save note
        </button>
        <p className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-slate-600">
          Notes help Tetisol turn learning into stronger CV and interview material later.
        </p>
      </div>
    </>
  )
}

export function CoursePlayer({
  slug,
}: {
  slug: string
}) {
  const {
    activeWorkspace,
    state,
    enrollInCourse,
    markLessonComplete,
    saveLearningNote,
    submitQuiz,
  } = useCareerHub()
  const course = getCourseBySlug(state.courses, slug)
  const enrollment = course ? getEnrollment(activeWorkspace, course.id) : null
  const lessons = course ? getAllLessons(course) : []
  const [selectedLessonId, setSelectedLessonId] = useState<string>("")
  const progress = course ? getCourseProgress(course, enrollment) : null
  const fallbackLessonId =
    enrollment?.lastLessonId ??
    progress?.nextLesson?.id ??
    lessons[0]?.id ??
    ""
  const activeLessonId = lessons.some((lesson) => lesson.id === selectedLessonId)
    ? selectedLessonId
    : fallbackLessonId
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0]
  const activeLessonIndex = lessons.findIndex((lesson) => lesson.id === activeLesson?.id)
  const activeModule = course && activeLesson ? getModuleByLessonId(course, activeLesson.id) : null
  const previousLesson = activeLessonIndex > 0 ? lessons[activeLessonIndex - 1] : null
  const nextLesson =
    activeLessonIndex >= 0 && activeLessonIndex < lessons.length - 1
      ? lessons[activeLessonIndex + 1]
      : null
  const quiz = activeLesson?.quizId ? getQuizById(state.quizzes, activeLesson.quizId) : null
  const lastAttempt = quiz ? getAttemptForQuiz(activeWorkspace, quiz.id) : undefined
  const note = getLessonNote(activeWorkspace, activeLesson?.id ?? "")
  const canAdvanceFromCurrentLesson = !activeLesson?.quizId || Boolean(lastAttempt?.passed)
  const opportunityPreview =
    course && activeWorkspace
      ? getCourseOpportunityPreview({
          course,
          internships: state.internships,
          workspace: activeWorkspace,
        })
      : null

  if (!course || !activeWorkspace) {
    return (
      <EmptyState
        action={
          <Link
            className={buttonVariants({
              variant: "default",
              className: "rounded-full px-5",
            })}
            href="/learning"
          >
            Back to learning
          </Link>
        }
        className="rounded-[1.75rem]"
        description="The course could not be found in your workspace."
        eyebrow="Course player"
        icon={PlayCircleIcon}
        title="Course not found"
      />
    )
  }

  if (!enrollment || !progress) {
    return (
      <div className="space-y-8">
        <PageIntro
          eyebrow="Course player"
          title={course.title}
          description="Enroll to unlock lessons, progress tracking, notes, and assessments."
          action={
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/courses"
            >
              <ArrowLeftIcon className="size-4" />
              Back to catalog
            </Link>
          }
        />

        <Card className="premium-panel">
          <CardContent className="space-y-4 p-8">
            <p className="text-base leading-8 text-slate-600">
              This learning experience includes structured lesson navigation, progress
              tracking, notes, quizzes, and certificate pathways. Enroll now to
              open the full player.
            </p>
            <button
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
              onClick={() => {
                enrollInCourse(course.id)
                toast.success("Course added to your learning plan.")
              }}
              type="button"
            >
              Enroll for free
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  function handleCompleteLesson() {
    if (!course || !activeLesson || activeLesson.quizId) {
      return
    }

    markLessonComplete(course.id, activeLesson.id)
    toast.success("Lesson marked complete.")

    if (nextLesson) {
      setSelectedLessonId(nextLesson.id)
    }
  }

  function handleSaveNote(content: string) {
    if (!course || !activeLesson) {
      return
    }

    saveLearningNote(course.id, activeLesson.id, content)
    toast.success(content.trim() ? "Lesson note saved." : "Lesson note cleared.")
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Course player"
        title={course.title}
        description="Stay in flow while Tetisol keeps your notes, lesson progress, assessments, and next steps connected."
        action={
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full px-5",
            })}
            href="/learning"
          >
            <ArrowLeftIcon className="size-4" />
            Back to my learning
          </Link>
        }
      />

      <Card className="futuristic-shell panel-shimmer overflow-hidden rounded-[1.9rem] border border-slate-800/80 bg-slate-950 shadow-[0_34px_100px_-46px_rgba(15,23,42,0.78)]">
        <div className="ambient-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_24%)]" />
        <CardContent className="relative grid gap-5 p-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-white/10 text-white">
                {course.category}
              </Badge>
              <Badge className="rounded-full border border-white/10 bg-white/8 text-slate-200">
                {course.level}
              </Badge>
              <Badge className="rounded-full border border-white/10 bg-white/8 text-slate-200">
                {course.modules.length} modules
              </Badge>
              {opportunityPreview ? (
                <Badge className="rounded-full border border-sky-400/18 bg-sky-400/10 text-sky-100">
                  {opportunityPreview.statusLabel}
                </Badge>
              ) : null}
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-white">
                {progress.nextLesson
                  ? `Next up: ${progress.nextLesson.title}`
                  : "You are at the finish line"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {activeModule
                  ? `You are currently inside ${activeModule.title}.`
                  : "Use the lesson rail to move through this course with less friction."}
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <LearningProgressBar
              completedLessons={progress.completedLessons}
              totalLessons={progress.totalLessons}
              value={progress.progressPercent}
            />
            {opportunityPreview ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 text-white backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sky-200">
                    <BriefcaseBusinessIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Opportunity signal
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {opportunityPreview.matchingRoleCount} internships overlap with this path
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {opportunityPreview.suggestedSignals.slice(0, 4).map((signal) => (
                    <span
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-slate-200"
                      key={signal}
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card className="premium-panel panel-shimmer overflow-hidden">
          <CardContent className="space-y-5 p-5">
            <div className="futuristic-shell overflow-hidden rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="ambient-grid absolute inset-0 opacity-20" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                  Course map
                </p>
                <h3 className="mt-3 font-heading text-xl font-semibold">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {course.shortDescription}
                </p>
              </div>
            </div>

            <ScrollArea className="subtle-scrollbar h-[640px] rounded-[1.5rem]">
              <div className="space-y-5 pr-4">
                {course.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="rounded-[1.5rem] border border-border bg-white/72 p-4"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        Module {index + 1}
                      </p>
                      <h3 className="mt-1 font-heading text-lg font-semibold text-slate-950">
                        {module.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {module.summary}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                        {module.estimatedTime}
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      {module.lessons.map((lesson) => (
                        <LessonSidebarItem
                          key={lesson.id}
                          active={activeLesson?.id === lesson.id}
                          completed={enrollment.completedLessonIds.includes(lesson.id)}
                          lesson={lesson}
                          onSelect={() => setSelectedLessonId(lesson.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="premium-panel panel-shimmer lesson-hero">
            <CardContent className="space-y-6 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full bg-primary/10 text-primary">
                      {getLessonTypeLabel(activeLesson)}
                    </Badge>
                    <Badge className="rounded-full border border-border bg-white text-slate-600">
                      {activeLesson.duration}
                    </Badge>
                    <Badge className="rounded-full border border-border bg-white text-slate-600">
                      Lesson {activeLessonIndex + 1} of {lessons.length}
                    </Badge>
                    {enrollment.completedLessonIds.includes(activeLesson.id) ? (
                      <Badge className="rounded-full bg-emerald-100 text-emerald-700">
                        Completed
                      </Badge>
                    ) : null}
                  </div>
                  <div>
                    <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-950">
                      {activeLesson.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                      {activeLesson.objective}
                    </p>
                  </div>
                </div>
                <div className="rounded-[1.25rem] bg-primary/8 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.24em] text-primary">
                    Module
                  </p>
                  <p className="mt-1 max-w-48 text-sm font-semibold text-slate-950">
                    {activeModule?.title ?? "Course lesson"}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border bg-white/75 p-5 text-sm leading-7 text-slate-600">
                <p className="font-semibold text-slate-950">Lesson summary</p>
                <p className="mt-2">{activeLesson.summary}</p>
              </div>

              <div className="space-y-4 text-base leading-8 text-slate-600">
                {activeLesson.content.map((paragraph) => (
                  <p key={paragraph} className="max-w-3xl">
                    {paragraph}
                  </p>
                ))}
              </div>

              {activeLesson.resources?.length ? (
                <div className="rounded-[1.5rem] border border-border bg-white/85 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FileTextIcon className="size-4 text-primary" />
                    <p className="font-semibold text-slate-950">Lesson resources</p>
                  </div>
                  <div className="space-y-3">
                    {activeLesson.resources.map((resource) => (
                      <div
                        key={resource.label}
                        className="flex items-center justify-between gap-3 rounded-[1rem] border border-border px-4 py-3 text-sm"
                      >
                        <span className="text-slate-700">{resource.label}</span>
                        <Badge className="rounded-full bg-secondary text-slate-600">
                          {resource.kind}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {quiz ? (
                <QuizCard
                  lastAttempt={lastAttempt}
                  onSubmit={(answers) => {
                    const feedback = submitQuiz(course.id, quiz.id, answers)
                    if (feedback.success) {
                      toast.success(feedback.message)
                      if (nextLesson) {
                        setSelectedLessonId(nextLesson.id)
                      }
                    } else {
                      toast.error(feedback.message)
                    }
                  }}
                  quiz={quiz}
                />
              ) : null}

              {!activeLesson.quizId ? (
                <Button
                  className="rounded-full"
                  onClick={handleCompleteLesson}
                  type="button"
                >
                  <CheckCircle2Icon className="size-4" />
                  Mark lesson complete
                </Button>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {previousLesson ? (
                    <Button
                      className="rounded-full"
                      onClick={() => setSelectedLessonId(previousLesson.id)}
                      type="button"
                      variant="outline"
                    >
                      <ArrowLeftIcon className="size-4" />
                      Previous lesson
                    </Button>
                  ) : null}
                  {nextLesson ? (
                    <Button
                      className="rounded-full"
                      disabled={!canAdvanceFromCurrentLesson}
                      onClick={() => setSelectedLessonId(nextLesson.id)}
                      type="button"
                      variant={canAdvanceFromCurrentLesson ? "secondary" : "outline"}
                    >
                      Next lesson
                      <ArrowRightIcon className="size-4" />
                    </Button>
                  ) : null}
                </div>
                {!canAdvanceFromCurrentLesson ? (
                  <p className="text-sm text-slate-500">
                    Pass the assessment to unlock the next lesson.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="premium-panel panel-shimmer">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <StickyNoteIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    Notes
                  </p>
                  <h3 className="font-heading text-2xl font-semibold text-slate-950">
                    Capture what should survive the lesson
                  </h3>
                </div>
              </div>
              <LessonNoteEditor
                initialValue={note?.content ?? ""}
                key={activeLesson.id}
                onSave={handleSaveNote}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

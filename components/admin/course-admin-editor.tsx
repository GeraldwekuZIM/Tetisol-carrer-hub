"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react"

import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { PageIntro } from "@/components/shared/app-primitives"
import { TagInput } from "@/components/shared/tag-input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createEmptyAdminCourse,
  getContentStatus,
  getCourseQuizzes,
  slugify,
} from "@/lib/content"
import {
  courseLevels,
  learningCategories,
  lessonTypes,
} from "@/types"
import type { Quiz } from "@/types"

const questionSchema = z.object({
  id: z.string().optional(),
  prompt: z.string().min(2),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(2),
})

const collaboratorRoles = [
  "Admin",
  "Lecturer",
  "Teaching Assistant",
  "Reviewer",
] as const

const collaboratorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(collaboratorRoles),
  canEditContent: z.boolean(),
  canManageAssessments: z.boolean(),
  canPublish: z.boolean(),
})

const quizSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  description: z.string().min(2),
  passingScore: z.coerce.number().min(0).max(100),
  questions: z.array(questionSchema).min(1),
})

const lessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(1),
  type: z.enum(lessonTypes),
  duration: z.string().min(2),
  objective: z.string().min(2),
  summary: z.string().min(2),
  contentText: z.string().min(2),
  resourceLink: z.string().optional().default(""),
  published: z.boolean(),
  quiz: quizSchema.optional().nullable(),
})

const moduleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  summary: z.string().min(2),
  estimatedTime: z.string().min(2),
  lessons: z.array(lessonSchema).min(1),
})

const courseEditorSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  slug: z.string().min(1),
  category: z.enum(learningCategories),
  level: z.enum(courseLevels),
  duration: z.string().min(2),
  durationHours: z.coerce.number().min(1),
  shortDescription: z.string().min(12),
  description: z.string().min(30),
  thumbnail: z.string().optional().default(""),
  skills: z.array(z.string()).min(2),
  outcomes: z.array(z.string()).min(2),
  prerequisites: z.array(z.string()).min(1),
  internshipFocus: z.array(z.string()).min(1),
  certificateAvailable: z.boolean(),
  featured: z.boolean(),
  popular: z.boolean(),
  isNew: z.boolean(),
  status: z.enum(["Draft", "Published", "Archived"]),
  heroGradient: z.string().min(5),
  instructorName: z.string().min(2),
  instructorRole: z.string().min(2),
  instructorCompany: z.string().min(2),
  instructorBio: z.string().min(10),
  collaborators: z.array(collaboratorSchema),
  modules: z.array(moduleSchema).min(1),
})

type CourseEditorValues = z.output<typeof courseEditorSchema>

function createBlankQuestion() {
  return {
    id: "",
    prompt: "",
    options: ["", ""],
    correctAnswer: "",
    explanation: "",
  }
}

function createBlankQuiz() {
  return {
    id: "",
    title: "",
    description: "",
    passingScore: 70,
    questions: [createBlankQuestion()],
  }
}

function createBlankLesson(type: (typeof lessonTypes)[number] = "Text") {
  return {
    id: "",
    title: "",
    slug: "",
    type,
    duration: "15 min",
    objective: "",
    summary: "",
    contentText: "",
    resourceLink: "",
    published: true,
    quiz: type === "Quiz" ? createBlankQuiz() : null,
  }
}

function createBlankModule() {
  return {
    id: "",
    title: "",
    summary: "",
    estimatedTime: "1h 00m",
    lessons: [createBlankLesson()],
  }
}

function createBlankCollaborator() {
  return {
    id: "",
    name: "",
    email: "",
    role: "Lecturer" as const,
    canEditContent: true,
    canManageAssessments: false,
    canPublish: false,
  }
}

function splitContent(value: string) {
  return value
    .split(/\n\s*\n/)
    .flatMap((chunk) => chunk.split("\n"))
    .map((line) => line.trim())
    .filter(Boolean)
}

function toFormValues(course: ReturnType<typeof createEmptyAdminCourse>, quizzes: Quiz[]): CourseEditorValues {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    category: course.category,
    level: course.level,
    duration: course.duration,
    durationHours: course.durationHours,
    shortDescription: course.shortDescription,
    description: course.description,
    thumbnail: course.thumbnail ?? "",
    skills: course.skills,
    outcomes: course.outcomes,
    prerequisites: course.prerequisites,
    internshipFocus: course.internshipFocus,
    certificateAvailable: course.certificateAvailable,
    featured: course.featured,
    popular: course.popular,
    isNew: course.isNew,
    status: course.status ?? "Draft",
    heroGradient: course.heroGradient,
    instructorName: course.instructor.name,
    instructorRole: course.instructor.role,
    instructorCompany: course.instructor.company,
    instructorBio: course.instructor.bio,
    collaborators: (course.collaborators ?? []).map((collaborator) => ({
      id: collaborator.id,
      name: collaborator.name,
      email: collaborator.email,
      role: collaborator.role,
      canEditContent: collaborator.canEditContent,
      canManageAssessments: collaborator.canManageAssessments,
      canPublish: collaborator.canPublish,
    })),
    modules: course.modules.length
      ? course.modules.map((module) => ({
          id: module.id,
          title: module.title,
          summary: module.summary,
          estimatedTime: module.estimatedTime,
          lessons: module.lessons.map((lesson) => {
            const quiz = quizzes.find((item) => item.id === lesson.quizId)
            return {
              id: lesson.id,
              title: lesson.title,
              slug: lesson.slug,
              type: lesson.type,
              duration: lesson.duration,
              objective: lesson.objective,
              summary: lesson.summary,
              contentText: lesson.content.join("\n\n"),
              resourceLink: lesson.resourceLink ?? lesson.resources?.[0]?.url ?? "",
              published: lesson.published ?? true,
              quiz: quiz
                ? {
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description,
                    passingScore: quiz.passingScore,
                    questions: quiz.questions.map((question) => ({
                      id: question.id,
                      prompt: question.prompt,
                      options: question.options,
                      correctAnswer: question.correctAnswer,
                      explanation: question.explanation,
                    })),
                  }
                : lesson.type === "Quiz"
                  ? createBlankQuiz()
                  : null,
            }
          }),
        }))
      : [createBlankModule()],
  }
}

function QuestionEditor({
  control,
  moduleIndex,
  lessonIndex,
  quizQuestionIndex,
  register,
  removeQuestion,
  moveQuestion,
  questionCount,
}: {
  control: ReturnType<typeof useForm<CourseEditorValues>>["control"]
  moduleIndex: number
  lessonIndex: number
  quizQuestionIndex: number
  register: ReturnType<typeof useForm<CourseEditorValues>>["register"]
  removeQuestion: (index: number) => void
  moveQuestion: (from: number, to: number) => void
  questionCount: number
}) {
  const basePath =
    `modules.${moduleIndex}.lessons.${lessonIndex}.quiz.questions.${quizQuestionIndex}` as const

  return (
    <Card className="rounded-[1.2rem] border-border/80 bg-white/80">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-slate-950">
            Question {quizQuestionIndex + 1}
          </p>
          <div className="flex gap-2">
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-slate-500"
              disabled={quizQuestionIndex === 0}
              onClick={() => moveQuestion(quizQuestionIndex, quizQuestionIndex - 1)}
              type="button"
            >
              <ChevronUpIcon className="size-4" />
            </button>
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-slate-500"
              disabled={quizQuestionIndex === questionCount - 1}
              onClick={() => moveQuestion(quizQuestionIndex, quizQuestionIndex + 1)}
              type="button"
            >
              <ChevronDownIcon className="size-4" />
            </button>
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700"
              onClick={() => removeQuestion(quizQuestionIndex)}
              type="button"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Prompt</Label>
          <Textarea {...register(`${basePath}.prompt`)} className="min-h-24" />
        </div>

        <div className="space-y-2">
          <Label>Options</Label>
          <Controller
            control={control}
            name={`${basePath}.options`}
            render={({ field }) => (
              <TagInput
                onChange={field.onChange}
                placeholder="Add answer options"
                value={field.value ?? []}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Correct answer</Label>
          <Input {...register(`${basePath}.correctAnswer`)} />
        </div>

        <div className="space-y-2">
          <Label>Explanation</Label>
          <Textarea {...register(`${basePath}.explanation`)} className="min-h-20" />
        </div>
      </CardContent>
    </Card>
  )
}

function QuizEditor({
  control,
  moduleIndex,
  lessonIndex,
  register,
}: {
  control: ReturnType<typeof useForm<CourseEditorValues>>["control"]
  moduleIndex: number
  lessonIndex: number
  register: ReturnType<typeof useForm<CourseEditorValues>>["register"]
}) {
  const questionArray = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons.${lessonIndex}.quiz.questions` as const,
  })
  const basePath = `modules.${moduleIndex}.lessons.${lessonIndex}.quiz` as const

  return (
    <div className="space-y-4 rounded-[1.3rem] border border-primary/12 bg-primary/6 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Quiz title</Label>
          <Input {...register(`${basePath}.title`)} />
        </div>
        <div className="space-y-2">
          <Label>Passing score</Label>
          <Input type="number" {...register(`${basePath}.passingScore`)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea {...register(`${basePath}.description`)} className="min-h-24" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Questions
          </p>
          <Button
            onClick={() => questionArray.append(createBlankQuestion())}
            size="sm"
            type="button"
            variant="outline"
          >
            <PlusIcon className="size-4" />
            Add question
          </Button>
        </div>
        <div className="space-y-3">
          {questionArray.fields.map((question, questionIndex) => (
            <QuestionEditor
              control={control}
              key={question.id}
              lessonIndex={lessonIndex}
              moduleIndex={moduleIndex}
              moveQuestion={questionArray.move}
              questionCount={questionArray.fields.length}
              quizQuestionIndex={questionIndex}
              register={register}
              removeQuestion={questionArray.remove}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function LessonEditor({
  control,
  moduleIndex,
  lessonIndex,
  moveLesson,
  lessonCount,
  register,
  removeLesson,
  setValue,
}: {
  control: ReturnType<typeof useForm<CourseEditorValues>>["control"]
  moduleIndex: number
  lessonIndex: number
  moveLesson: (from: number, to: number) => void
  lessonCount: number
  register: ReturnType<typeof useForm<CourseEditorValues>>["register"]
  removeLesson: (index: number) => void
  setValue: ReturnType<typeof useForm<CourseEditorValues>>["setValue"]
}) {
  const basePath = `modules.${moduleIndex}.lessons.${lessonIndex}` as const
  const lessonType = useWatch({ control, name: `${basePath}.type` })
  const lessonTitle = useWatch({ control, name: `${basePath}.title` })
  const quizValue = useWatch({ control, name: `${basePath}.quiz` })

  return (
    <Card className="rounded-[1.3rem] border-border/80 bg-white/80">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Lesson {lessonIndex + 1}
            </p>
            <p className="mt-1 font-heading text-xl font-semibold text-slate-950">
              {lessonTitle || "Untitled lesson"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-slate-500"
              disabled={lessonIndex === 0}
              onClick={() => moveLesson(lessonIndex, lessonIndex - 1)}
              type="button"
            >
              <ChevronUpIcon className="size-4" />
            </button>
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-slate-500"
              disabled={lessonIndex === lessonCount - 1}
              onClick={() => moveLesson(lessonIndex, lessonIndex + 1)}
              type="button"
            >
              <ChevronDownIcon className="size-4" />
            </button>
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700"
              onClick={() => removeLesson(lessonIndex)}
              type="button"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register(`${basePath}.title`)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input {...register(`${basePath}.slug`)} />
          </div>
          <div className="space-y-2">
            <Label>Lesson type</Label>
            <select
              className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
              {...register(`${basePath}.type`)}
            >
              {lessonTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input {...register(`${basePath}.duration`)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Objective</Label>
            <Input {...register(`${basePath}.objective`)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Summary</Label>
            <Textarea {...register(`${basePath}.summary`)} className="min-h-24" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Lesson body</Label>
            <Textarea
              {...register(`${basePath}.contentText`)}
              className="min-h-36"
              placeholder="Write lesson content in clear sections. Separate paragraphs with blank lines."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Resource link placeholder</Label>
            <Input {...register(`${basePath}.resourceLink`)} />
          </div>
        </div>

        <label className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-4 py-2 text-sm text-slate-600">
          <input type="checkbox" {...register(`${basePath}.published`)} />
          Lesson published
        </label>

        {lessonType === "Quiz" ? (
          quizValue ? (
            <QuizEditor
              control={control}
              lessonIndex={lessonIndex}
              moduleIndex={moduleIndex}
              register={register}
            />
          ) : (
            <button
              className="inline-flex h-10 items-center justify-center rounded-full border border-primary/15 bg-primary/8 px-4 text-sm font-medium text-primary"
              onClick={() =>
                setValue(`${basePath}.quiz`, createBlankQuiz(), {
                  shouldDirty: true,
                })
              }
              type="button"
            >
              Initialize quiz configuration
            </button>
          )
        ) : null}
      </CardContent>
    </Card>
  )
}

function ModuleEditor({
  control,
  moduleIndex,
  moveModule,
  moduleCount,
  register,
  removeModule,
  setValue,
}: {
  control: ReturnType<typeof useForm<CourseEditorValues>>["control"]
  moduleIndex: number
  moveModule: (from: number, to: number) => void
  moduleCount: number
  register: ReturnType<typeof useForm<CourseEditorValues>>["register"]
  removeModule: (index: number) => void
  setValue: ReturnType<typeof useForm<CourseEditorValues>>["setValue"]
}) {
  const lessonArray = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons` as const,
  })
  const moduleTitle = useWatch({ control, name: `modules.${moduleIndex}.title` as const })

  return (
    <Card className="premium-panel">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-primary">
              Module {moduleIndex + 1}
            </p>
            <h3 className="mt-1 font-heading text-2xl font-semibold text-slate-950">
              {moduleTitle || "Untitled module"}
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-slate-500"
              disabled={moduleIndex === 0}
              onClick={() => moveModule(moduleIndex, moduleIndex - 1)}
              type="button"
            >
              <ChevronUpIcon className="size-4" />
            </button>
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-slate-500"
              disabled={moduleIndex === moduleCount - 1}
              onClick={() => moveModule(moduleIndex, moduleIndex + 1)}
              type="button"
            >
              <ChevronDownIcon className="size-4" />
            </button>
            <button
              className="inline-flex size-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700"
              onClick={() => removeModule(moduleIndex)}
              type="button"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Module title</Label>
            <Input {...register(`modules.${moduleIndex}.title` as const)} />
          </div>
          <div className="space-y-2">
            <Label>Estimated time</Label>
            <Input {...register(`modules.${moduleIndex}.estimatedTime` as const)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Summary</Label>
            <Textarea
              {...register(`modules.${moduleIndex}.summary` as const)}
              className="min-h-24"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Lessons
              </p>
              <p className="text-sm text-slate-600">
                Build lesson flow, resources, and optional quizzes inside the module.
              </p>
            </div>
            <Button
              onClick={() => lessonArray.append(createBlankLesson())}
              type="button"
              variant="outline"
            >
              <PlusIcon className="size-4" />
              Add lesson
            </Button>
          </div>
          <div className="space-y-4">
            {lessonArray.fields.map((lesson, lessonIndex) => (
              <LessonEditor
                control={control}
                key={lesson.id}
                lessonCount={lessonArray.fields.length}
                lessonIndex={lessonIndex}
                moduleIndex={moduleIndex}
                moveLesson={lessonArray.move}
                register={register}
                removeLesson={lessonArray.remove}
                setValue={setValue}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CourseAdminEditor({
  courseId,
}: {
  courseId?: string
}) {
  const router = useRouter()
  const {
    state,
    saveAdminCourseContent,
    archiveAdminCourseContent,
    deleteAdminCourseContent,
  } = useCareerHub()
  const existingCourse = courseId
    ? state.courses.find((course) => course.id === courseId)
    : undefined
  const existingQuizzes = existingCourse
    ? getCourseQuizzes(state.quizzes, existingCourse.id)
    : []
  const defaultCourse = existingCourse ?? createEmptyAdminCourse()

  const form = useForm<CourseEditorValues>({
    resolver: zodResolver(courseEditorSchema) as never,
    defaultValues: toFormValues(defaultCourse, existingQuizzes),
  })

  const moduleArray = useFieldArray({
    control: form.control,
    name: "modules",
  })
  const collaboratorArray = useFieldArray({
    control: form.control,
    name: "collaborators",
  })
  const internalUsers = state.users.filter(
    (user) => user.role === "admin" || user.role === "instructor"
  )

  const watchedTitle = useWatch({ control: form.control, name: "title" })
  const watchedSlug = useWatch({ control: form.control, name: "slug" })
  const watchedStatus = useWatch({ control: form.control, name: "status" })
  const watchedModules = useWatch({ control: form.control, name: "modules" }) ?? []
  const totalLessonCount = watchedModules.reduce(
    (total, module) => total + module.lessons.length,
    0
  )
  const publishedLessonCount = watchedModules
    .reduce(
      (total, module) => total + module.lessons.filter((lesson) => lesson.published).length,
      0
    )

  function onSubmit(values: CourseEditorValues) {
    const missingQuizLesson = values.modules
      .flatMap((module) => module.lessons)
      .find((lesson) => lesson.type === "Quiz" && !lesson.quiz)

    if (missingQuizLesson) {
      toast.error(`Initialize quiz settings for "${missingQuizLesson.title}".`)
      return
    }

    const baseCourseId =
      existingCourse?.id ||
      values.id ||
      `course-${slugify(values.slug || values.title || "course")}`
    const quizRecords: Quiz[] = []
    const normalizedModules = values.modules.map((module, moduleIndex) => {
      const moduleId =
        module.id || `module-${slugify(module.title || `module-${moduleIndex + 1}`)}`

      const normalizedLessons = module.lessons.map((lesson, lessonIndex) => {
        const lessonId =
          lesson.id ||
          `lesson-${slugify(lesson.title || `lesson-${lessonIndex + 1}`)}`

        let quizId: string | undefined
        if (lesson.type === "Quiz" && lesson.quiz) {
          quizId =
            lesson.quiz.id ||
            `quiz-${baseCourseId}-${moduleIndex + 1}-${lessonIndex + 1}`
          quizRecords.push({
            id: quizId,
            courseId: baseCourseId,
            moduleId,
            lessonId,
            title: lesson.quiz.title,
            description: lesson.quiz.description,
            passingScore: lesson.quiz.passingScore,
            questions: lesson.quiz.questions.map((question, questionIndex) => ({
              id:
                question.id ||
                `${quizId}-question-${questionIndex + 1}`,
              prompt: question.prompt,
              options: question.options.filter(Boolean),
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
            })),
          })
        }

        return {
          id: lessonId,
          slug: slugify(lesson.slug || lesson.title),
          title: lesson.title,
          type: lesson.type,
          duration: lesson.duration,
          objective: lesson.objective,
          summary: lesson.summary,
          content: splitContent(lesson.contentText),
          quizId,
          resources: lesson.resourceLink
            ? [
                {
                  label: "Lesson resource",
                  kind: "Guide" as const,
                  url: lesson.resourceLink,
                },
              ]
            : undefined,
          resourceLink: lesson.resourceLink,
          orderIndex: lessonIndex,
          published: lesson.published,
        }
      })

      return {
        id: moduleId,
        title: module.title,
        summary: module.summary,
        estimatedTime: module.estimatedTime,
        orderIndex: moduleIndex,
        lessons: normalizedLessons,
      }
    })

    saveAdminCourseContent({
      course: {
        ...(existingCourse ?? createEmptyAdminCourse()),
        id: baseCourseId,
        slug: slugify(values.slug || values.title),
        title: values.title,
        category: values.category,
        level: values.level,
        duration: values.duration,
        durationHours: values.durationHours,
        shortDescription: values.shortDescription,
        description: values.description,
        thumbnail: values.thumbnail,
        skills: values.skills,
        outcomes: values.outcomes,
        prerequisites: values.prerequisites,
        internshipFocus: values.internshipFocus,
        certificateAvailable: values.certificateAvailable,
        featured: values.featured,
        popular: values.popular,
        isNew: values.isNew,
        status: values.status,
        heroGradient: values.heroGradient,
        updatedAt: new Date().toISOString().slice(0, 10),
        modules: normalizedModules,
        collaborators: values.collaborators.map((collaborator, index) => ({
          id:
            collaborator.id ||
            `collaborator-${slugify(collaborator.email || collaborator.name || `member-${index + 1}`)}`,
          name: collaborator.name,
          email: collaborator.email.trim().toLowerCase(),
          role: collaborator.role,
          canEditContent: collaborator.canEditContent,
          canManageAssessments: collaborator.canManageAssessments,
          canPublish: collaborator.canPublish,
        })),
        instructor: {
          name: values.instructorName,
          role: values.instructorRole,
          company: values.instructorCompany,
          bio: values.instructorBio,
        },
      },
      quizzes: quizRecords,
    })

    toast.success(existingCourse ? "Course updated." : "Course created.")
    router.push("/admin/courses")
  }

  if (courseId && !existingCourse) {
    return (
      <div className="section-shell py-10">
        <Card className="premium-panel">
          <CardContent className="space-y-4 p-8">
            <h2 className="font-heading text-2xl font-semibold text-slate-950">
              Course not found
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              This course may have been removed or the link is out of date.
            </p>
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/admin/courses"
            >
              Back to courses
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Course editor"
        title={existingCourse ? `Edit ${existingCourse.title}` : "Create course"}
        description="Manage course metadata, modules, lessons, and quizzes in one structured editor."
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
            {existingCourse && getContentStatus(existingCourse.status) === "Published" ? (
              <Link
                className={buttonVariants({
                  variant: "default",
                  className: "rounded-full px-5",
                })}
                href={`/courses/${existingCourse.slug}`}
                >
                  Preview learner page
                  <ArrowUpRightIcon className="size-4" />
                </Link>
            ) : null}
            {existingCourse ? (
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "rounded-full px-5",
                })}
                href={`/admin/courses/${existingCourse.id}/analytics`}
              >
                View analytics
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="premium-panel">
          <CardContent className="space-y-3 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Learner visibility
            </p>
            <h2 className="font-heading text-2xl font-semibold text-slate-950">
              {watchedStatus === "Published"
                ? "This course is live in the learner experience"
                : watchedStatus === "Draft"
                  ? "This course is still private to the admin workspace"
                  : "This course is archived and hidden from learners"}
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              Publishing makes this course available in the catalog, the detail page,
              learner recommendations, and the course player.
            </p>
          </CardContent>
        </Card>

        <Card className="premium-panel">
          <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
            <div className="rounded-[1.2rem] border border-border bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Modules</p>
              <p className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                {watchedModules.length}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-border bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Lessons</p>
              <p className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                {totalLessonCount}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-border bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Published lessons
              </p>
              <p className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                {publishedLessonCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="premium-panel">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="font-heading text-2xl text-slate-950">
                  Course settings
                </CardTitle>
                <p className="mt-2 text-sm text-slate-600">
                  Title, positioning, metadata, and publishing controls.
                </p>
              </div>
              <AdminStatusBadge status={watchedStatus} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 p-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Title</Label>
              <Input {...form.register("title")} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                {...form.register("slug")}
                onBlur={(event) => {
                  if (!event.target.value.trim() && watchedTitle) {
                    form.setValue("slug", slugify(watchedTitle), { shouldDirty: true })
                  }
                }}
                placeholder={watchedTitle ? slugify(watchedTitle) : "course-slug"}
                value={watchedSlug}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                {...form.register("status")}
              >
                {["Draft", "Published", "Archived"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                {...form.register("category")}
              >
                {learningCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                {...form.register("level")}
              >
                {courseLevels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Duration label</Label>
              <Input {...form.register("duration")} />
            </div>
            <div className="space-y-2">
              <Label>Duration hours</Label>
              <Input type="number" {...form.register("durationHours")} />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail placeholder</Label>
              <Input {...form.register("thumbnail")} />
            </div>
            <div className="space-y-2">
              <Label>Hero gradient classes</Label>
              <Input {...form.register("heroGradient")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Short description</Label>
              <Textarea {...form.register("shortDescription")} className="min-h-24" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Full description</Label>
              <Textarea {...form.register("description")} className="min-h-32" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Skills</Label>
              <Controller
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add course skills"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Learning outcomes</Label>
              <Controller
                control={form.control}
                name="outcomes"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add learning outcomes"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Prerequisites</Label>
              <Controller
                control={form.control}
                name="prerequisites"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add prerequisites"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Internship focus</Label>
              <Controller
                control={form.control}
                name="internshipFocus"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add related role pathways"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>

            <div className="grid gap-3 md:col-span-2 md:grid-cols-4">
              {[
                ["certificateAvailable", "Certificate available"],
                ["featured", "Featured"],
                ["popular", "Popular"],
                ["isNew", "Mark as new"],
              ].map(([fieldName, label]) => (
                <label
                  className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-4 py-2 text-sm text-slate-600"
                  key={fieldName}
                >
                  <input
                    type="checkbox"
                    {...form.register(
                      fieldName as
                        | "certificateAvailable"
                        | "featured"
                        | "popular"
                        | "isNew"
                    )}
                  />
                  {label}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="premium-panel">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-slate-950">
              Instructor placeholder
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("instructorName")} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input {...form.register("instructorRole")} />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input {...form.register("instructorCompany")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Bio</Label>
              <Textarea {...form.register("instructorBio")} className="min-h-24" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-panel">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="font-heading text-2xl text-slate-950">
                  Course collaborators
                </CardTitle>
                <p className="mt-2 text-sm text-slate-600">
                  Add admins and lecturers who can help build, review, assess, or publish this course.
                </p>
              </div>
              <Button
                onClick={() => collaboratorArray.append(createBlankCollaborator())}
                type="button"
                variant="outline"
              >
                <UsersIcon className="size-4" />
                Add collaborator
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <datalist id="internal-course-users">
              {internalUsers.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.fullName}
                </option>
              ))}
            </datalist>

            {collaboratorArray.fields.length ? (
              collaboratorArray.fields.map((collaborator, collaboratorIndex) => {
                const basePath = `collaborators.${collaboratorIndex}` as const

                return (
                  <div
                    className="rounded-[1.3rem] border border-border bg-white/80 p-4"
                    key={collaborator.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          Collaborator {collaboratorIndex + 1}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Assign responsibility without changing the public instructor profile.
                        </p>
                      </div>
                      <button
                        className="inline-flex size-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700"
                        onClick={() => collaboratorArray.remove(collaboratorIndex)}
                        type="button"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input {...form.register(`${basePath}.name`)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          list="internal-course-users"
                          placeholder="lecturer@tetisol.com"
                          type="email"
                          {...form.register(`${basePath}.email`)}
                          onBlur={(event) => {
                            const user = internalUsers.find(
                              (item) =>
                                item.email.toLowerCase() ===
                                event.target.value.trim().toLowerCase()
                            )
                            if (user) {
                              form.setValue(`${basePath}.name`, user.fullName, {
                                shouldDirty: true,
                              })
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Team role</Label>
                        <select
                          className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                          {...form.register(`${basePath}.role`)}
                        >
                          {collaboratorRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {[
                        ["canEditContent", "Edit content"],
                        ["canManageAssessments", "Manage assessments"],
                        ["canPublish", "Publish changes"],
                      ].map(([fieldName, label]) => (
                        <label
                          className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-4 py-2 text-sm text-slate-600"
                          key={fieldName}
                        >
                          <input
                            type="checkbox"
                            {...form.register(
                              `${basePath}.${fieldName}` as
                                | `collaborators.${number}.canEditContent`
                                | `collaborators.${number}.canManageAssessments`
                                | `collaborators.${number}.canPublish`
                            )}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="rounded-[1.3rem] border border-dashed border-border bg-white/70 px-5 py-6 text-sm leading-7 text-slate-600">
                No collaborators yet. Add lecturers, teaching assistants, reviewers, or admins to share course ownership.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="premium-panel">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="font-heading text-2xl text-slate-950">
                  Modules and lessons
                </CardTitle>
                <p className="mt-2 text-sm text-slate-600">
                  Reorder content, edit lesson flow, and configure quiz checkpoints.
                </p>
              </div>
              <Button
                onClick={() => moduleArray.append(createBlankModule())}
                type="button"
                variant="outline"
              >
                <PlusIcon className="size-4" />
                Add module
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            {moduleArray.fields.map((module, moduleIndex) => (
              <ModuleEditor
                control={form.control}
                key={module.id}
                moduleCount={moduleArray.fields.length}
                moduleIndex={moduleIndex}
                moveModule={moduleArray.move}
                register={form.register}
                removeModule={moduleArray.remove}
                setValue={form.setValue}
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {existingCourse ? (
              <>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-slate-600"
                  onClick={() => {
                    archiveAdminCourseContent(existingCourse.id)
                    toast.success("Course archived.")
                    router.push("/admin/courses")
                  }}
                  type="button"
                >
                  Archive
                </button>
                {(existingCourse.status ?? "Published") !== "Published" ? (
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-medium text-rose-700"
                    onClick={() => {
                      if (!window.confirm(`Delete "${existingCourse.title}"?`)) {
                        return
                      }
                      deleteAdminCourseContent(existingCourse.id)
                      toast.success("Course deleted.")
                      router.push("/admin/courses")
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
          <Button className="rounded-full px-5" type="submit">
            {existingCourse ? "Save changes" : "Create course"}
          </Button>
        </div>
      </form>
    </div>
  )
}

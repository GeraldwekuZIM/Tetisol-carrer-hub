"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PlusIcon, SearchIcon } from "lucide-react"

import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro } from "@/components/shared/app-primitives"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getContentStatus, getCourseQuizzes } from "@/lib/content"

const statusFilters = ["All", "Published", "Draft", "Archived"] as const

export function CourseAdminList() {
  const {
    state,
    saveAdminCourseContent,
    archiveAdminCourseContent,
    deleteAdminCourseContent,
  } = useCareerHub()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All")

  const filteredCourses = useMemo(() => {
    return [...state.courses]
      .filter((course) => {
        const searchable = `${course.title} ${course.category} ${course.shortDescription}`.toLowerCase()
        const matchesQuery =
          !query.trim() || searchable.includes(query.trim().toLowerCase())
        const matchesStatus =
          status === "All" || getContentStatus(course.status) === status

        return matchesQuery && matchesStatus
      })
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  }, [query, state.courses, status])

  function handleTogglePublish(courseId: string) {
    const course = state.courses.find((item) => item.id === courseId)
    if (!course) {
      return
    }

    const nextStatus =
      getContentStatus(course.status) === "Published" ? "Draft" : "Published"
    saveAdminCourseContent({
      course: {
        ...course,
        status: nextStatus,
      },
      quizzes: getCourseQuizzes(state.quizzes, course.id),
    })
    toast.success(
      nextStatus === "Published"
        ? "Course published to the public catalog."
        : "Course moved back to draft."
    )
  }

  function handleArchive(courseId: string) {
    archiveAdminCourseContent(courseId)
    toast.success("Course archived.")
  }

  function handleDelete(courseId: string) {
    const course = state.courses.find((item) => item.id === courseId)
    if (!course) {
      return
    }

    if (!window.confirm(`Delete "${course.title}" permanently?`)) {
      return
    }

    deleteAdminCourseContent(courseId)
    toast.success("Course deleted.")
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Admin courses"
        title="Manage Tetisol course content"
        description="Create, edit, publish, archive, and review course content across learning paths, modules, lessons, and quizzes."
        action={
          <Link
            className={buttonVariants({
              variant: "default",
              className: "rounded-full px-5",
            })}
            href="/admin/courses/new"
          >
            <PlusIcon className="size-4" />
            New course
          </Link>
        }
      />

      <Card className="premium-panel">
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-11 rounded-full pl-11"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search course title or category"
              value={query}
            />
          </div>
          <select
            className="h-11 rounded-full border border-input bg-white px-4 text-sm text-slate-700"
            onChange={(event) =>
              setStatus(event.target.value as (typeof statusFilters)[number])
            }
            value={status}
          >
            {statusFilters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {filteredCourses.length ? (
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const lessonCount = course.modules.reduce(
              (total, module) => total + module.lessons.length,
              0
            )
            const courseStatus = getContentStatus(course.status)

            return (
              <Card className="premium-panel" key={course.id}>
                <CardContent className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminStatusBadge status={course.status} />
                      <span className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                        {course.category}
                      </span>
                      <span className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                        {course.level}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-semibold text-slate-950">
                        {course.title}
                      </h2>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                        {course.shortDescription}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                      <span>{course.modules.length} modules</span>
                      <span>{lessonCount} lessons</span>
                      <span>{getCourseQuizzes(state.quizzes, course.id).length} quizzes</span>
                      <span>{course.collaborators?.length ?? 0} collaborators</span>
                      <span>Updated {course.updatedAt}</span>
                    </div>
                    {course.collaborators?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {course.collaborators.slice(0, 4).map((collaborator) => (
                          <span
                            className="rounded-full border border-primary/10 bg-primary/8 px-3 py-1 text-xs font-medium text-primary"
                            key={collaborator.id}
                          >
                            {collaborator.name} - {collaborator.role}
                          </span>
                        ))}
                        {course.collaborators.length > 4 ? (
                          <span className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                            +{course.collaborators.length - 4} more
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="rounded-[1rem] border border-border bg-white/75 px-4 py-3 text-sm leading-6 text-slate-600">
                      {courseStatus === "Published"
                        ? "Visible to learners in the public catalog, course detail page, and recommendation flows."
                        : courseStatus === "Draft"
                          ? "Private to the internal team until you publish it."
                          : "Archived content is hidden from learners but retained for internal reference."}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      className={buttonVariants({
                        variant: "outline",
                        className: "rounded-full px-4",
                      })}
                      href={`/admin/courses/${course.id}`}
                    >
                      Edit
                    </Link>
                    <Link
                      className={buttonVariants({
                        variant: "outline",
                        className: "rounded-full px-4",
                      })}
                      href={`/admin/courses/${course.id}/analytics`}
                    >
                      Analytics
                    </Link>
                    {courseStatus === "Published" ? (
                      <Link
                        className={buttonVariants({
                          variant: "outline",
                          className: "rounded-full px-4",
                        })}
                        href={`/courses/${course.slug}`}
                      >
                        Preview live
                      </Link>
                    ) : null}
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                      onClick={() => handleTogglePublish(course.id)}
                      type="button"
                    >
                      {courseStatus === "Published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-slate-600"
                      onClick={() => handleArchive(course.id)}
                      type="button"
                    >
                      Archive
                    </button>
                    {courseStatus !== "Published" ? (
                      <button
                        className="inline-flex h-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700"
                        onClick={() => handleDelete(course.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          action={
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/admin/courses/new"
            >
              Create course
            </Link>
          }
          className="rounded-[1.8rem]"
          description="Try a broader search or create a new course draft."
          eyebrow="No course results"
          icon={SearchIcon}
          title="No courses match those filters"
        />
      )}
    </div>
  )
}

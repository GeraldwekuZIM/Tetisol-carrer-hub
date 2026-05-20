"use client"

import { ChevronDownIcon, Clock3Icon, PlayCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CourseModule } from "@/types"

export function ModuleAccordion({
  modules,
  completedLessonIds = [],
}: {
  modules: CourseModule[]
  completedLessonIds?: string[]
}) {
  return (
    <div className="space-y-3">
      {modules.map((module, index) => {
        const completedCount = module.lessons.filter((lesson) =>
          completedLessonIds.includes(lesson.id)
        ).length
        const progressPercent = module.lessons.length
          ? Math.round((completedCount / module.lessons.length) * 100)
          : 0

        return (
          <details
            key={module.id}
            className="group panel-shimmer rounded-[1.5rem] border border-border bg-white/82 p-5 shadow-[0_16px_48px_-36px_rgba(79,70,229,0.22)] open:bg-white"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-primary/10 text-primary">
                    Module {index + 1}
                  </Badge>
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <Clock3Icon className="size-4" />
                    {module.estimatedTime}
                  </span>
                  <span className="rounded-full border border-primary/10 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                    {progressPercent}% complete
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-slate-950">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {module.summary}
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <div className="h-1.5 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-primary/75 to-sky-400/80 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-sm text-slate-500">
                  <p>
                    {completedCount}/{module.lessons.length} complete
                  </p>
                </div>
                <div className="rounded-full bg-secondary p-2 text-slate-500 transition group-open:rotate-180">
                  <ChevronDownIcon className="size-4" />
                </div>
              </div>
            </summary>

            <div className="mt-5 space-y-3">
              {module.lessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id)
                return (
                  <div
                    key={lesson.id}
                    className={cn(
                      "hover-lift flex items-start justify-between gap-3 rounded-[1.25rem] border px-4 py-3",
                      isCompleted
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-border bg-white"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 rounded-full p-2",
                          isCompleted
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <PlayCircleIcon className="size-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-950">{lesson.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {lesson.summary}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <p>{lesson.type}</p>
                      <p className="mt-1">{lesson.duration}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </details>
        )
      })}
    </div>
  )
}

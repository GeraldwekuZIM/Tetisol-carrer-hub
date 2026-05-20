"use client"

import { CheckCircle2Icon, PlayCircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { CourseLesson } from "@/types"

export function LessonSidebarItem({
  lesson,
  active,
  completed,
  onSelect,
}: {
  lesson: CourseLesson
  active: boolean
  completed: boolean
  onSelect: () => void
}) {
  return (
    <button
      className={cn(
        "w-full rounded-[1.35rem] border px-4 py-3 text-left transition duration-300",
        active
          ? "border-primary/25 bg-primary/8 shadow-[0_22px_60px_-42px_rgba(79,70,229,0.45)]"
          : "border-border bg-white/70 hover:border-primary/25 hover:bg-white"
      )}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 rounded-full p-2",
            completed
              ? "bg-emerald-100 text-emerald-600"
              : active
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-slate-500"
          )}
        >
          {completed ? (
            <CheckCircle2Icon className="size-4" />
          ) : (
            <PlayCircleIcon className="size-4" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-slate-950">{lesson.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {lesson.summary}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {lesson.type} | {lesson.duration}
          </p>
        </div>
      </div>
    </button>
  )
}

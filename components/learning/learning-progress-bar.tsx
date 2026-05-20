"use client"

import { Progress } from "@/components/ui/progress"

export function LearningProgressBar({
  value,
  completedLessons,
  totalLessons,
}: {
  value: number
  completedLessons: number
  totalLessons: number
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
        <span className="font-medium">Progress</span>
        <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {completedLessons}/{totalLessons} lessons
        </span>
      </div>
      <Progress value={value} />
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {value}% complete
      </p>
    </div>
  )
}

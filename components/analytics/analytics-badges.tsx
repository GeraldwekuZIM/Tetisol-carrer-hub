"use client"

import { AlertTriangleIcon, CheckCircle2Icon, Clock3Icon, SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type {
  LearnerEngagementState,
  LearnerReadinessState,
  LearnerRiskLevel,
} from "@/lib/analytics"

export function EngagementBadge({
  state,
}: {
  state: LearnerEngagementState
}) {
  return (
    <Badge
      className={cn(
        "rounded-full border",
        state === "Active today" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        state === "Recently active" && "border-sky-200 bg-sky-50 text-sky-700",
        state === "Inactive" && "border-slate-200 bg-slate-100 text-slate-700"
      )}
    >
      <Clock3Icon className="mr-1 size-3.5" />
      {state}
    </Badge>
  )
}

export function RiskBadge({
  level,
}: {
  level: LearnerRiskLevel
}) {
  if (level === "none") {
    return (
      <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
        <CheckCircle2Icon className="mr-1 size-3.5" />
        Stable
      </Badge>
    )
  }

  return (
    <Badge
      className={cn(
        "rounded-full border",
        level === "warning" && "border-amber-200 bg-amber-50 text-amber-700",
        level === "high" && "border-rose-200 bg-rose-50 text-rose-700"
      )}
    >
      <AlertTriangleIcon className="mr-1 size-3.5" />
      {level === "high" ? "At risk" : "Needs attention"}
    </Badge>
  )
}

export function ReadinessBadge({
  state,
}: {
  state: LearnerReadinessState
}) {
  return (
    <Badge
      className={cn(
        "rounded-full border",
        state === "Ready to apply" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        state === "Needs CV improvement" && "border-amber-200 bg-amber-50 text-amber-700",
        state === "Needs more skills" && "border-slate-200 bg-slate-100 text-slate-700",
        state === "Building momentum" && "border-primary/15 bg-primary/8 text-primary"
      )}
    >
      <SparklesIcon className="mr-1 size-3.5" />
      {state}
    </Badge>
  )
}

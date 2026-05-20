"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ContentStatus } from "@/types"

export function AdminStatusBadge({
  status,
  className,
}: {
  status?: ContentStatus
  className?: string
}) {
  const resolvedStatus = status ?? "Published"

  return (
    <Badge
      className={cn(
        "rounded-full border",
        resolvedStatus === "Published" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        resolvedStatus === "Draft" &&
          "border-amber-200 bg-amber-50 text-amber-700",
        resolvedStatus === "Archived" &&
          "border-slate-200 bg-slate-100 text-slate-600",
        className
      )}
    >
      {resolvedStatus}
    </Badge>
  )
}

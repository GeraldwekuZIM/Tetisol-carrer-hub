"use client"

import Link from "next/link"
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  BrainCircuitIcon,
  BriefcaseBusinessIcon,
  FlameIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { IntelligenceInsight } from "@/types"

const toneStyles = {
  positive: {
    accent: "text-emerald-700",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    panel: "border-emerald-200/70 bg-[linear-gradient(180deg,rgba(236,253,245,0.9),rgba(255,255,255,0.92))]",
    icon: BadgeCheckIcon,
  },
  warning: {
    accent: "text-amber-700",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    panel: "border-amber-200/70 bg-[linear-gradient(180deg,rgba(255,251,235,0.92),rgba(255,255,255,0.94))]",
    icon: AlertTriangleIcon,
  },
  urgent: {
    accent: "text-rose-700",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    panel: "border-rose-200/70 bg-[linear-gradient(180deg,rgba(255,241,242,0.92),rgba(255,255,255,0.94))]",
    icon: FlameIcon,
  },
  opportunity: {
    accent: "text-primary",
    badge: "border-primary/15 bg-primary/8 text-primary",
    panel: "border-primary/12 bg-[linear-gradient(180deg,rgba(238,242,255,0.9),rgba(255,255,255,0.94))]",
    icon: BriefcaseBusinessIcon,
  },
  neutral: {
    accent: "text-slate-700",
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    panel: "border-border bg-white/88",
    icon: BrainCircuitIcon,
  },
} as const

export function IntelligenceCard({
  insight,
  className,
}: {
  insight: IntelligenceInsight
  className?: string
}) {
  const tone = toneStyles[insight.tone]
  const Icon = tone.icon

  return (
    <div
      className={cn(
        "hover-lift panel-shimmer relative overflow-hidden rounded-[1.6rem] border p-5 shadow-[0_24px_70px_-44px_rgba(79,70,229,0.25)]",
        tone.panel,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
                  tone.accent
                )}
              >
                <Icon className="size-3.5" />
                {insight.kind}
              </span>
              {insight.badge ? (
                <Badge className={cn("rounded-full border", tone.badge)}>
                  {insight.badge}
                </Badge>
              ) : null}
            </div>
            <h3 className="font-heading text-xl font-semibold text-slate-950">
              {insight.title}
            </h3>
          </div>
        </div>
        <p className="text-sm leading-7 text-slate-600">{insight.description}</p>
        {insight.href ? (
          <Link
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "h-auto w-fit rounded-full px-0 text-sm font-semibold text-slate-700 hover:bg-transparent hover:text-primary",
              }),
              "gap-2"
            )}
            href={insight.href}
          >
            Open insight
            <ArrowRightIcon className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  )
}

import type { LucideIcon } from "lucide-react"
import { SparklesIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="premium-panel panel-shimmer relative overflow-hidden px-5 py-6 sm:px-6 lg:px-7">
      <div className="pointer-events-none absolute inset-0 mesh-surface opacity-90" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-linear-to-r from-transparent via-sky-300/45 to-transparent" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          {eyebrow ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.26em] text-primary">
              <SparklesIcon className="size-3.5" />
              {eyebrow}
            </div>
          ) : null}
          <div className="space-y-2.5">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              {description}
            </p>
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  eyebrow,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
  eyebrow?: string
}) {
  return (
    <Card
      className={cn(
        "panel-shimmer relative overflow-hidden border-dashed border-white/80 bg-white/78 shadow-[0_24px_80px_-44px_rgba(79,70,229,0.26)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_25%)]" />
      <CardContent className="relative flex flex-col items-center gap-5 px-6 py-12 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/12 blur-2xl" />
          <div className="relative rounded-[1.6rem] border border-primary/12 bg-primary/10 p-4 text-primary">
            <Icon className="size-7" />
          </div>
        </div>
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="font-heading text-xl font-semibold text-slate-950">
            {title}
          </h3>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}

export function StatCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: LucideIcon
  label: string
  value: string
  helper: string
}) {
  return (
    <Card className="group relative overflow-hidden border-white/80 bg-white/85 shadow-[0_18px_60px_-38px_rgba(79,70,229,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-42px_rgba(79,70,229,0.34)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute -right-10 top-2 size-28 rounded-full bg-primary/10 blur-3xl transition duration-500 group-hover:bg-primary/16" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600">
            {label}
          </CardTitle>
          <div className="rounded-2xl border border-primary/10 bg-primary/10 p-2 text-primary transition duration-300 group-hover:scale-105">
            <Icon className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-heading text-3xl font-semibold tracking-tight text-slate-950">
          {value}
        </p>
        <p className="text-sm text-slate-500">{helper}</p>
        <div className="h-1.5 rounded-full bg-slate-100">
          <div className="h-full w-2/3 rounded-full bg-linear-to-r from-primary/65 to-sky-400/70" />
        </div>
      </CardContent>
    </Card>
  )
}

export function LoadingCard({
  className,
}: {
  className?: string
}) {
  return (
    <Card className={cn("border-white/80 bg-white/75 shadow-[0_18px_60px_-40px_rgba(79,70,229,0.2)]", className)}>
      <CardContent className="space-y-4 p-6">
        <div className="h-4 w-28 animate-pulse rounded-full bg-primary/14" />
        <div className="h-8 w-3/4 animate-pulse rounded-2xl bg-slate-200/70" />
        <div className="space-y-2">
          <div className="h-3.5 w-full animate-pulse rounded-full bg-slate-200/60" />
          <div className="h-3.5 w-5/6 animate-pulse rounded-full bg-slate-200/55" />
          <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-slate-200/50" />
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import Link from "next/link"
import { ArrowRightIcon, BrainCircuitIcon, SparklesIcon, ZapIcon } from "lucide-react"

import { SignalRing } from "@/components/intelligence/signal-ring"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { OpportunityIntelligence } from "@/types"

function MetricChip({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-300">{label}</p>
      <p className="mt-2 font-heading text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

export function AICoachPanel({
  intelligence,
  cvScore,
  learningCount,
  applicationCount,
  activePersona,
}: {
  intelligence: OpportunityIntelligence
  cvScore: number
  learningCount: number
  applicationCount: number
  activePersona?: string
}) {
  return (
    <section className="futuristic-shell panel-shimmer relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950 shadow-[0_36px_120px_-50px_rgba(30,41,59,0.85)]">
      <div className="ambient-grid absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.22),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-24 top-8 size-52 rounded-full bg-indigo-500/24 blur-3xl" />
      <div className="pointer-events-none absolute bottom-4 right-8 size-44 rounded-full bg-sky-400/18 blur-3xl" />

      <div className="relative grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-7">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
              <BrainCircuitIcon className="size-3.5 text-sky-300" />
              Opportunity intelligence
            </span>
            <Badge className="rounded-full border border-white/12 bg-white/10 text-slate-200">
              {intelligence.learnerState}
            </Badge>
            <Badge className="rounded-full border border-sky-400/18 bg-sky-400/10 text-sky-100">
              {intelligence.momentumLabel}
            </Badge>
            {activePersona ? (
              <Badge className="rounded-full border border-white/12 bg-white/6 text-slate-300">
                Demo persona: {activePersona}
              </Badge>
            ) : null}
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {intelligence.coachTitle}
            </h2>
            <p className="max-w-3xl text-sm leading-8 text-slate-300">
              {intelligence.coachSummary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricChip label="Learning signal" value={`${learningCount} courses`} />
            <MetricChip
              label="Opportunity fit"
              value={`${intelligence.matchingInternshipCount} matches`}
            />
            <MetricChip label="CV readiness" value={`${cvScore}% score`} />
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                  <SparklesIcon className="size-3.5" />
                  Next best action
                </p>
                <h3 className="font-heading text-2xl font-semibold text-white">
                  {intelligence.nextBestAction.title}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-slate-300">
                  {intelligence.nextBestAction.description}
                </p>
              </div>
              {intelligence.nextBestAction.badge ? (
                <Badge className="rounded-full border border-white/12 bg-white/10 text-white">
                  {intelligence.nextBestAction.badge}
                </Badge>
              ) : null}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                className={cn(
                  buttonVariants({
                    variant: "default",
                    className:
                      "rounded-full bg-white px-5 text-slate-950 hover:bg-white/90",
                  }),
                  "gap-2"
                )}
                href={intelligence.nextBestAction.href}
              >
                {intelligence.nextBestAction.ctaLabel}
                <ArrowRightIcon className="size-4" />
              </Link>
              <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-slate-300">
                {applicationCount} active opportunity steps already in motion
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 content-start">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
            <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
              <SignalRing
                caption="A blended score based on certificates, active applications, CV quality, and recommendation strength."
                label="Readiness"
                value={intelligence.readinessScore}
              />
              <div className="space-y-4">
                <div className="rounded-[1.3rem] border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Mission posture
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {intelligence.momentumLabel}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Tetisol is watching for the fastest move that converts learning activity into visible career proof.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricChip
                    label="Certificate pressure"
                    value={`${intelligence.certificateOpportunityCount} near`}
                  />
                  <MetricChip label="Application flow" value={`${applicationCount} active`} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-3 text-sky-200">
                <ZapIcon className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Adaptive summary
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  The platform is prioritizing guidance that shortens the path between what you already know, what you can prove, and which internships you can realistically convert next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

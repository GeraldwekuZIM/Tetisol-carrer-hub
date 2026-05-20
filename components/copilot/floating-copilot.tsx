"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import {
  ArrowUpRightIcon,
  BrainCircuitIcon,
  CircleHelpIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { getCopilotExperience, shouldShowCopilot } from "@/lib/copilot"
import { cn } from "@/lib/utils"

export function FloatingCopilot() {
  const pathname = usePathname()
  const {
    activeUser,
    activeWorkspace,
    dashboardReminders,
    completedCourses,
    earnedCertificates,
    hydrated,
    inProgressCourses,
    isAdmin,
    opportunityIntelligence,
    publishedCourses,
    publishedInternships,
    recommendedCourses,
    recommendedInternships,
    savedInternships,
    state,
    trackedInternships,
  } = useCareerHub()
  const [open, setOpen] = useState(false)
  const [introVisible, setIntroVisible] = useState(true)
  const [selectedPromptId, setSelectedPromptId] = useState("")

  const experience = useMemo(
    () =>
      getCopilotExperience({
        pathname,
        activeUser,
        activeWorkspace,
        state,
        publishedCourses,
        publishedInternships,
        recommendedCourses,
        recommendedInternships,
        inProgressCourses,
        completedCourses,
        earnedCertificates,
        savedInternships,
        trackedInternships,
        dashboardReminders,
        opportunityIntelligence,
        isAdmin,
      }),
    [
      activeUser,
      activeWorkspace,
      completedCourses,
      dashboardReminders,
      earnedCertificates,
      inProgressCourses,
      isAdmin,
      opportunityIntelligence,
      pathname,
      publishedCourses,
      publishedInternships,
      recommendedCourses,
      recommendedInternships,
      savedInternships,
      state,
      trackedInternships,
    ]
  )

  if (!hydrated || !shouldShowCopilot(pathname)) {
    return null
  }

  const selectedPrompt =
    experience.prompts.find((prompt) => prompt.id === selectedPromptId) ??
    experience.prompts[0]

  function dismissIntro() {
    setIntroVisible(false)
  }

  function handleToggle() {
    if (!open) {
      dismissIntro()
    }

    setOpen((currentValue) => !currentValue)
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {introVisible && !open ? (
        <div className="pointer-events-auto max-w-[18rem] rounded-[1.4rem] border border-white/80 bg-white/92 px-4 py-3 shadow-[0_24px_70px_-36px_rgba(79,70,229,0.32)] backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Tetisol Copilot is live</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Ask what this page does, what to do next, or how this view connects to the rest of the platform.
              </p>
            </div>
            <button
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-white text-slate-500 transition hover:text-slate-950"
              onClick={dismissIntro}
              type="button"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Dismiss copilot tip</span>
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "pointer-events-auto w-[min(24rem,calc(100vw-2rem))] transition duration-300 md:w-[24rem]",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <div className="copilot-panel premium-panel relative overflow-hidden p-0">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)]" />
          <div className="relative max-h-[min(72vh,44rem)] overflow-y-auto subtle-scrollbar p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                    <BrainCircuitIcon className="size-3.5" />
                    Tetisol Copilot
                  </span>
                  <Badge className="rounded-full border border-border bg-white/80 text-slate-600">
                    {experience.scope}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {experience.pageLabel}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                    {experience.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {experience.summary}
                  </p>
                </div>
              </div>
              <button
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white/80 text-slate-500 transition hover:text-slate-950"
                onClick={() => setOpen(false)}
                type="button"
              >
                <XIcon className="size-4" />
                <span className="sr-only">Close copilot</span>
              </button>
            </div>

            {experience.statusBadge ? (
              <div className="mt-4">
                <Badge className="rounded-full border border-primary/12 bg-primary/8 text-primary">
                  {experience.statusBadge}
                </Badge>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {experience.signals.map((signal) => (
                <span
                  className="rounded-full border border-border bg-white/78 px-3 py-1.5 text-xs font-medium text-slate-600"
                  key={signal}
                >
                  {signal}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                <CircleHelpIcon className="size-3.5" />
                Suggested prompts
              </div>
              <div className="flex flex-wrap gap-2">
                {experience.prompts.map((prompt) => {
                  const isActive = prompt.id === selectedPrompt?.id

                  return (
                    <button
                      className={cn(
                        "rounded-full border px-3 py-2 text-sm transition",
                        isActive
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-white/78 text-slate-600 hover:border-primary/12 hover:text-primary"
                      )}
                      key={prompt.id}
                      onClick={() => setSelectedPromptId(prompt.id)}
                      type="button"
                    >
                      {prompt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedPrompt ? (
              <div className="mt-6 rounded-[1.5rem] border border-slate-800/80 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.72)]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                  <SparklesIcon className="size-3.5" />
                  {selectedPrompt.label}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {selectedPrompt.answer}
                </p>
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Quick actions
              </p>
              <div className="grid gap-3">
                {experience.actions.map((action) => (
                  <Link
                    className={cn(
                      buttonVariants({
                        variant:
                          action.emphasis === "primary" ? "default" : "outline",
                        className: "justify-between rounded-full px-4",
                      }),
                      action.emphasis === "primary" && "shadow-[0_18px_45px_-24px_rgba(79,70,229,0.4)]"
                    )}
                    href={action.href}
                    key={`${action.href}-${action.label}`}
                    onClick={() => setOpen(false)}
                  >
                    {action.label}
                    <ArrowUpRightIcon className="size-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-border bg-white/80 px-4 py-3 text-xs leading-6 text-slate-500">
              Route-aware assistant panel. It can be connected to a real LLM later without changing the learning workspace.
            </div>
          </div>
        </div>
      </div>

      <button
        className={cn(
          "copilot-orb signal-ring pointer-events-auto relative inline-flex size-16 items-center justify-center rounded-full border border-white/20 bg-slate-950 text-white shadow-[0_28px_80px_-30px_rgba(15,23,42,0.8)] transition duration-300 hover:-translate-y-1",
          open && "scale-95"
        )}
        onClick={handleToggle}
        type="button"
      >
        <span className="pointer-events-none absolute inset-1 rounded-full bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.35),transparent_55%)]" />
        <span className="relative flex items-center gap-2">
          <BrainCircuitIcon className="size-5" />
          <span className="sr-only">Toggle Tetisol Copilot</span>
        </span>
      </button>
    </div>
  )
}

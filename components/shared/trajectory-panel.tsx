"use client"

import type { ComponentType } from "react"
import {
  AwardIcon,
  BookOpenCheckIcon,
  BriefcaseBusinessIcon,
  FileCheck2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type JourneyStage = "complete" | "active" | "next"

export function TrajectoryPanel({
  learningCount,
  certificateCount,
  cvScore,
  applicationCount,
  savedCount,
}: {
  learningCount: number
  certificateCount: number
  cvScore: number
  applicationCount: number
  savedCount: number
}) {
  const currentStage =
    learningCount === 0
      ? 0
      : certificateCount === 0
        ? 1
        : cvScore < 85
          ? 2
          : 3

  const stages: Array<{
    label: string
    title: string
    detail: string
    value: string
    icon: ComponentType<{ className?: string }>
    state: JourneyStage
  }> = [
    {
      label: "Learn",
      title: "Courses in motion",
      detail:
        learningCount > 0
          ? "You are building active skill momentum."
          : "Enroll in a course to start the pipeline.",
      value: `${learningCount}`,
      icon: BookOpenCheckIcon,
      state: currentStage > 0 ? "complete" : "active",
    },
    {
      label: "Validate",
      title: "Proof of skill",
      detail:
        certificateCount > 0
          ? "Certificates now reinforce your profile."
          : "Assessments and completions unlock stronger proof.",
      value: `${certificateCount}`,
      icon: AwardIcon,
      state:
        currentStage > 1
          ? "complete"
          : currentStage === 1
            ? "active"
            : "next",
    },
    {
      label: "Signal",
      title: "CV readiness",
      detail:
        cvScore >= 85
          ? "Your CV is presenting a strong story."
          : "Import more learning evidence into your CV.",
      value: `${cvScore}%`,
      icon: FileCheck2Icon,
      state:
        currentStage > 2
          ? "complete"
          : currentStage === 2
            ? "active"
            : "next",
    },
    {
      label: "Land",
      title: "Opportunity motion",
      detail:
        applicationCount > 0
          ? "Applications are moving through the tracker."
          : `You have ${savedCount} saved roles ready to convert into action.`,
      value: `${applicationCount}`,
      icon: BriefcaseBusinessIcon,
      state: currentStage === 3 ? "active" : "next",
    },
  ]

  return (
    <Card className="premium-panel overflow-hidden">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
              Tetisol trajectory
            </Badge>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-slate-950">
                From learning to employment, one connected system
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                This is your live signal chain. Courses generate skills, certificates
                create proof, the CV turns proof into a story, and internships convert
                that story into real opportunities.
              </p>
            </div>
          </div>
          <div className="rounded-[1.4rem] border border-primary/10 bg-primary/8 px-4 py-3 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Current focus
            </p>
            <p className="mt-1 font-heading text-xl font-semibold text-slate-950">
              {stages[currentStage]?.title ?? "Build momentum"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {stages.map((stage, index) => (
            <div key={stage.label} className="relative">
              {index < stages.length - 1 ? (
                <div className="pointer-events-none absolute top-8 right-0 left-[62%] hidden h-px bg-linear-to-r from-primary/35 via-sky-300/55 to-transparent xl:block" />
              ) : null}
              <div
                className={cn(
                  "relative h-full rounded-[1.5rem] border p-5 transition duration-300",
                  stage.state === "complete" &&
                    "border-emerald-200 bg-emerald-50/75 shadow-[0_16px_50px_-34px_rgba(16,185,129,0.34)]",
                  stage.state === "active" &&
                    "border-primary/25 bg-primary/8 shadow-[0_24px_70px_-38px_rgba(79,70,229,0.34)]",
                  stage.state === "next" &&
                    "border-border bg-white/75"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={cn(
                      "rounded-2xl p-3",
                      stage.state === "complete" && "bg-emerald-100 text-emerald-700",
                      stage.state === "active" && "bg-primary text-primary-foreground",
                      stage.state === "next" && "bg-secondary text-slate-600"
                    )}
                  >
                    <stage.icon className="size-4.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {stage.label}
                  </span>
                </div>
                <p className="mt-5 font-heading text-3xl font-semibold tracking-tight text-slate-950">
                  {stage.value}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {stage.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

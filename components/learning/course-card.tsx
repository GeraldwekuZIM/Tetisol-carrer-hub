"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  Clock3Icon,
  SparklesIcon,
  StarIcon,
} from "lucide-react"

import { LearningProgressBar } from "@/components/learning/learning-progress-bar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Course, CourseMatch } from "@/types"

type CourseCardCourse = Course | CourseMatch

function hasMatchData(course: CourseCardCourse): course is CourseMatch {
  return typeof (course as CourseMatch).matchScore === "number"
}

export function CourseCard({
  course,
  href,
  ctaLabel,
  onCta,
  secondaryAction,
  progress,
}: {
  course: CourseCardCourse
  href: string
  ctaLabel: string
  onCta?: () => void
  secondaryAction?: React.ReactNode
  progress?: {
    progressPercent: number
    completedLessons: number
    totalLessons: number
  }
}) {
  return (
    <Card className="glass-card panel-shimmer group rounded-[1.75rem] border-white/80 transition hover:-translate-y-1 hover:shadow-[0_28px_70px_-36px_rgba(79,70,229,0.45)]">
      <CardContent className="space-y-5 p-6">
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.5rem] bg-linear-to-r p-5 text-white",
            course.heroGradient
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.15),transparent_22%)]" />
          <div className="relative flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-white/18 text-white hover:bg-white/18">
                  {course.category}
                </Badge>
                <Badge className="rounded-full bg-slate-950/18 text-white hover:bg-slate-950/18">
                  {course.level}
                </Badge>
                {course.featured ? (
                  <Badge className="rounded-full bg-white/18 text-white hover:bg-white/18">
                    Featured
                  </Badge>
                ) : null}
                {course.isNew ? (
                  <Badge className="rounded-full bg-white/18 text-white hover:bg-white/18">
                    New
                  </Badge>
                ) : null}
              </div>
              <div>
                <h3 className="font-heading text-2xl font-semibold tracking-tight">
                  {course.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-white/85">
                  {course.shortDescription}
                </p>
              </div>
            </div>
            {hasMatchData(course) ? (
              <div className="rounded-2xl border border-white/10 bg-white/15 px-3 py-2 text-right backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-white/80">
                  Match
                </p>
                <p className="mt-1 text-xl font-semibold">{course.matchScore}%</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
            <Clock3Icon className="size-4" />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
            <StarIcon className="size-4 fill-current text-amber-400" />
            {course.rating.toFixed(1)} rating
          </span>
          <span>{course.reviewCount.toLocaleString()} learners</span>
          <span>{course.modules.length} modules</span>
        </div>

        <div>
          <p className="text-sm leading-7 text-slate-600">{course.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {course.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} className="skill-chip">
              {skill}
            </Badge>
          ))}
        </div>

        {hasMatchData(course) && course.matchReasons.length ? (
          <div className="rounded-[1.25rem] border border-primary/15 bg-primary/8 p-4 text-sm leading-7 text-slate-600">
            <div className="mb-2 inline-flex items-center gap-2 font-semibold text-slate-950">
              <SparklesIcon className="size-4 text-primary" />
              Why this fits
            </div>
            <div className="flex flex-wrap gap-2">
              {course.matchReasons.map((reason) => (
                <Badge
                  key={reason}
                  className="rounded-full border border-primary/12 bg-white/75 text-primary"
                >
                  {reason}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        {progress ? (
          <LearningProgressBar
            completedLessons={progress.completedLessons}
            totalLessons={progress.totalLessons}
            value={progress.progressPercent}
          />
        ) : null}

        <div className="glow-divider" />

        <div className="flex flex-col gap-3 sm:flex-row">
          {onCta ? (
            <Button className="flex-1 rounded-full" onClick={onCta} type="button">
              {ctaLabel}
            </Button>
          ) : (
            <Link
              className={cn(
                buttonVariants({
                  variant: "default",
                  className: "flex-1 rounded-full",
                }),
                "gap-2"
              )}
              href={href}
            >
              {ctaLabel}
              <ArrowRightIcon className="size-4" />
            </Link>
          )}
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full",
            })}
            href={href}
          >
            View course
          </Link>
          {secondaryAction}
        </div>
      </CardContent>
    </Card>
  )
}

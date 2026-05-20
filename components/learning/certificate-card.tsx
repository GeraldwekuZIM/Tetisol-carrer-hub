"use client"

import Link from "next/link"
import { AwardIcon, CalendarIcon, Share2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Certificate, Course } from "@/types"

export function CertificateCard({
  certificate,
  course,
}: {
  certificate: Certificate
  course?: Course
}) {
  return (
    <Card className="glass-card rounded-[1.75rem] border-white/80">
      <CardContent className="space-y-5 p-6">
        <div className="rounded-[1.5rem] bg-linear-to-br from-indigo-600 via-indigo-500 to-sky-400 p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/80">
                Tetisol Certificate
              </p>
              <h3 className="mt-3 font-heading text-2xl font-semibold">
                {course?.title ?? "Course Completion"}
              </h3>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <AwardIcon className="size-5" />
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm leading-7 text-slate-600">
          <p className="font-semibold text-slate-950">{certificate.learnerName}</p>
          <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
            <CalendarIcon className="size-4" />
            Issued {certificate.issuedAt}
          </p>
          <p>Certificate ID: {certificate.certificateNumber}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {course?.skills.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              className="rounded-full border border-border bg-white/80 text-slate-600"
            >
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className={buttonVariants({
              variant: "default",
              className: "flex-1 rounded-full",
            })}
            href={`/certificates/${certificate.id}`}
          >
            View certificate
          </Link>
          <button
            className={cn(
              buttonVariants({
                variant: "outline",
                className: "rounded-full",
              })
            )}
            type="button"
          >
            <Share2Icon className="size-4" />
            Share soon
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

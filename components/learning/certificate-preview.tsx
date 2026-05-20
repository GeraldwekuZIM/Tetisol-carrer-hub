"use client"

import Link from "next/link"
import { AwardIcon, DownloadIcon, Share2Icon } from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro } from "@/components/shared/app-primitives"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CertificatePreview({
  certificateId,
}: {
  certificateId: string
}) {
  const { activeWorkspace, state } = useCareerHub()
  const certificate = activeWorkspace?.certificates.find(
    (item) => item.id === certificateId
  )
  const course = state.courses.find((item) => item.id === certificate?.courseId)

  if (!certificate || !course) {
    return (
      <EmptyState
        action={
          <Link
            className={buttonVariants({
              variant: "default",
              className: "rounded-full px-5",
            })}
            href="/certificates"
          >
            Back to certificates
          </Link>
        }
        className="rounded-[1.75rem]"
        description="The certificate could not be found in your workspace."
        icon={AwardIcon}
        title="Certificate not found"
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Certificate preview"
        title={course.title}
        description="This preview shows the certificate structure that can later support downloads and sharing."
        action={
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full px-5",
            })}
            href="/certificates"
          >
            Back to library
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-white shadow-[0_28px_90px_-40px_rgba(79,70,229,0.45)]">
          <CardContent className="space-y-8 p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  Tetisol
                </p>
                <h2 className="mt-4 font-heading text-5xl font-semibold tracking-tight text-slate-950">
                  Certificate of Completion
                </h2>
              </div>
              <div className="rounded-[1.5rem] bg-primary/10 p-4 text-primary">
                <AwardIcon className="size-7" />
              </div>
            </div>

            <div className="space-y-4 rounded-[1.75rem] border border-border bg-linear-to-br from-slate-50 to-indigo-50 p-8 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Presented to
              </p>
              <p className="font-heading text-4xl font-semibold text-slate-950">
                {certificate.learnerName}
              </p>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                For successfully completing
              </p>
              <p className="font-heading text-3xl font-semibold text-primary">
                {course.title}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.25rem] border border-border bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Issued
                </p>
                <p className="mt-2 font-semibold text-slate-950">{certificate.issuedAt}</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Certificate ID
                </p>
                <p className="mt-2 font-semibold text-slate-950">
                  {certificate.certificateNumber}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Issuer
                </p>
                <p className="mt-2 font-semibold text-slate-950">Tetisol</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card rounded-[1.75rem] border-white/80">
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="rounded-full border border-border bg-white/80 text-slate-600"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm leading-7 text-slate-600">
                This certificate reflects course completion, assessment success, and progress that can be connected to your profile and CV.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-[1.75rem] border-white/80">
            <CardContent className="space-y-3 p-6">
              <button
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
                type="button"
              >
                <DownloadIcon className="size-4" />
                Download coming soon
              </button>
              <button
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-slate-600"
                type="button"
              >
                <Share2Icon className="size-4" />
                Share link coming soon
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

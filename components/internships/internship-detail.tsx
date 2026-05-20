"use client"

import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeftIcon, BookmarkIcon } from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro } from "@/components/shared/app-primitives"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Internship, InternshipMatch } from "@/types"

function hasMatchMetadata(
  internship: Internship | InternshipMatch
): internship is InternshipMatch {
  return typeof (internship as InternshipMatch).matchScore === "number"
}

export function InternshipDetail({
  slug,
}: {
  slug: string
}) {
  const {
    activeWorkspace,
    publishedInternships,
    recommendedInternships,
    toggleSavedInternship,
    addInternshipToTracker,
  } = useCareerHub()

  const internship =
    recommendedInternships.find((item) => item.slug === slug) ??
    publishedInternships.find((item) => item.slug === slug)

  if (!internship || !activeWorkspace) {
    return (
      <EmptyState
        action={
          <Link
            className={buttonVariants({
              variant: "default",
              className: "rounded-full px-5",
            })}
            href="/internships"
          >
            Back to internships
          </Link>
        }
        description="The opportunity may have been removed or the link might be out of date."
        icon={ArrowLeftIcon}
        title="Internship not found"
      />
    )
  }

  const isSaved = activeWorkspace.savedInternshipIds.includes(internship.id)

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Internship details"
        title={internship.title}
        description={`${internship.company} | ${internship.location} | ${internship.mode} | Deadline ${internship.deadline}`}
        action={
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full px-5",
            })}
            href="/internships"
          >
            <ArrowLeftIcon className="size-4" />
            Back to finder
          </Link>
        }
      />

      <Card className="glass-card rounded-[1.75rem] border-white/80">
        <CardContent className="grid gap-8 p-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-primary/10 text-primary">
                {internship.category}
              </Badge>
              <Badge className="rounded-full border border-border bg-secondary text-slate-600">
                {internship.level}
              </Badge>
              {hasMatchMetadata(internship) ? (
                <Badge className="rounded-full border border-border bg-secondary text-slate-600">
                  {internship.matchScore}% match
                </Badge>
              ) : null}
            </div>
            <p className="text-base leading-8 text-slate-600">
              {internship.fullDescription ?? internship.description}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-white/75 p-5">
                <h2 className="font-heading text-xl font-semibold text-slate-950">
                  Responsibilities
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  {internship.responsibilities.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-white/75 p-5">
                <h2 className="font-heading text-xl font-semibold text-slate-950">
                  Requirements
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  {internship.requirements.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              {internship.preferredQualifications?.length ? (
                <div className="rounded-[1.5rem] border border-border bg-white/75 p-5 md:col-span-2">
                  <h2 className="font-heading text-xl font-semibold text-slate-950">
                    Preferred qualifications
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                    {internship.preferredQualifications.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-primary/15 bg-primary/8 p-5">
              <h2 className="font-heading text-2xl font-semibold text-slate-950">
                Opportunity snapshot
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>Company: {internship.company}</p>
                <p>Mode: {internship.mode}</p>
                <p>Duration: {internship.duration}</p>
                <p>Stipend: {internship.stipend}</p>
                <p>Deadline: {internship.deadline}</p>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-white/75 p-5">
              <h2 className="font-heading text-xl font-semibold text-slate-950">
                Skill and learning fit
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {internship.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="rounded-full border border-border bg-white text-slate-600"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {hasMatchMetadata(internship) && internship.matchReasons.length ? (
                <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
                  <p className="font-medium text-slate-950">
                    Matched from your profile, skills, and learning signals
                  </p>
                  {internship.matchReasons.map((reason) => (
                    <p key={reason}>- {reason}</p>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-3">
              {internship.applicationLink ? (
                <Link
                  className={buttonVariants({
                    variant: "secondary",
                    className: "rounded-full",
                  })}
                  href={internship.applicationLink}
                  target="_blank"
                >
                  Open application link
                </Link>
              ) : null}
              <Button
                className="rounded-full"
                onClick={() => {
                  addInternshipToTracker(internship.id)
                  toast.success("Internship added to your tracker.")
                }}
                type="button"
              >
                Add to tracker
              </Button>
              <Button
                className="rounded-full"
                onClick={() => {
                  toggleSavedInternship(internship.id)
                  toast.success(
                    isSaved ? "Removed from saved internships." : "Internship saved."
                  )
                }}
                type="button"
                variant="outline"
              >
                <BookmarkIcon className="size-4" />
                {isSaved ? "Unsave internship" : "Save internship"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

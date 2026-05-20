"use client"

import Link from "next/link"
import { useDeferredValue, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  BookmarkIcon,
  BriefcaseBusinessIcon,
  CompassIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro, StatCard } from "@/components/shared/app-primitives"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Internship, InternshipMatch } from "@/types"

function hasMatchMetadata(
  internship: Internship | InternshipMatch
): internship is InternshipMatch {
  return typeof (internship as InternshipMatch).matchScore === "number"
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

export function InternshipFinder({
  mode,
}: {
  mode: "all" | "saved"
}) {
  const {
    activeWorkspace,
    publishedInternships,
    recommendedInternships,
    savedInternships,
    completedCourses,
    inProgressCourses,
    toggleSavedInternship,
    addInternshipToTracker,
  } = useCareerHub()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [locationFilter, setLocationFilter] = useState("All")

  const deferredQuery = useDeferredValue(query)
  const internships = mode === "saved" ? savedInternships : recommendedInternships

  const filteredInternships = internships.filter((internship) => {
    const matchesQuery =
      !deferredQuery ||
      `${internship.title} ${internship.company} ${internship.description}`
        .toLowerCase()
        .includes(deferredQuery.toLowerCase())
    const matchesCategory =
      category === "All" || internship.category === category
    const matchesLocation =
      locationFilter === "All" ||
      internship.mode === locationFilter ||
      internship.location === locationFilter

    return matchesQuery && matchesCategory && matchesLocation
  })

  const catalogInternships = mode === "saved" ? savedInternships : publishedInternships
  const categories = ["All", ...new Set(catalogInternships.map((item) => item.category))]
  const locations = [
    "All",
    ...new Set(catalogInternships.flatMap((item) => [item.location, item.mode])),
  ]

  const learningSignals = useMemo(
    () =>
      unique(
        [...completedCourses, ...inProgressCourses]
          .flatMap((course) => [course.title, ...course.skills])
          .slice(0, 10)
      ),
    [completedCourses, inProgressCourses]
  )

  function handleSave(internshipId: string, isSaved: boolean) {
    toggleSavedInternship(internshipId)
    toast.success(isSaved ? "Removed from saved internships." : "Internship saved.")
  }

  function handleTrack(internshipId: string) {
    addInternshipToTracker(internshipId)
    toast.success("Internship added to your tracker.")
  }

  if (!activeWorkspace) {
    return null
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={mode === "saved" ? "Saved opportunities" : "Internship finder"}
        title={
          mode === "saved"
            ? "Your opportunity shortlist"
            : "Discover internships that respond to your actual learning signal"
        }
        description={
          mode === "saved"
            ? "Keep promising roles close, compare them against your current skill proof, and move them into the application tracker when you are ready."
            : "Tetisol links course progress, skills, certificates, and career interests so internship discovery feels personalized instead of random."
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper="Matched opportunities in your current view"
          icon={BriefcaseBusinessIcon}
          label="Visible roles"
          value={`${filteredInternships.length}`}
        />
        <StatCard
          helper="Saved opportunities waiting for action"
          icon={BookmarkIcon}
          label="Saved"
          value={`${activeWorkspace.savedInternshipIds.length}`}
        />
        <StatCard
          helper="Applications already moving in your tracker"
          icon={CompassIcon}
          label="Tracked"
          value={`${activeWorkspace.applications.length}`}
        />
        <StatCard
          helper="Courses currently influencing recommendations"
          icon={SparklesIcon}
          label="Learning signals"
          value={`${completedCourses.length + inProgressCourses.length}`}
        />
      </div>

      <Card className="premium-panel overflow-hidden">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Opportunity compass
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                {mode === "saved"
                  ? "Your shortlist is strongest when it matches your latest learning"
                  : "Recommendations respond to what you are learning now"}
              </h2>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              {mode === "saved"
                ? "Use this view to decide which saved roles deserve immediate application effort based on your current CV strength and course momentum."
                : "Tetisol is prioritizing roles that overlap with your current course path, your profile skills, and your preferred internship fields."}
            </p>
            <div className="flex flex-wrap gap-2">
              {learningSignals.length ? (
                learningSignals.map((signal) => (
                  <Badge
                    key={signal}
                    className="rounded-full border border-primary/12 bg-primary/8 text-primary"
                  >
                    {signal}
                  </Badge>
                ))
              ) : (
                <Badge className="rounded-full border border-border bg-white/85 text-slate-600">
                  Complete onboarding and enroll in a course to sharpen matching
                </Badge>
              )}
            </div>
          </div>

          <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
              Why Tetisol feels different
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Most internship boards only surface jobs. Tetisol surfaces roles and
              explains why they fit, using the learning evidence you are building in
              the same learning workspace.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card rounded-[1.75rem] border-white/80">
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-11 rounded-full pl-11"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, company, or keyword"
              value={query}
            />
          </div>
          <select
            className="h-11 rounded-full border border-input bg-white px-4 text-sm text-slate-700"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="h-11 rounded-full border border-input bg-white px-4 text-sm text-slate-700"
            onChange={(event) => setLocationFilter(event.target.value)}
            value={locationFilter}
          >
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {filteredInternships.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredInternships.map((internship) => {
            const isSaved = activeWorkspace.savedInternshipIds.includes(internship.id)
            const isTracked = activeWorkspace.applications.some(
              (application) => application.internshipId === internship.id
            )

            return (
              <Card key={internship.id} className="premium-panel hover-lift">
                <CardContent className="space-y-5 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full bg-primary/10 text-primary">
                          {internship.category}
                        </Badge>
                        {hasMatchMetadata(internship) ? (
                          <Badge className="rounded-full border border-border bg-secondary text-slate-600">
                            {internship.matchScore}% match
                          </Badge>
                        ) : null}
                      </div>
                      <div>
                        <h2 className="font-heading text-2xl font-semibold text-slate-950">
                          {internship.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {internship.company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <p>{internship.stipend}</p>
                      <p className="mt-1">{internship.duration}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
                      <MapPinIcon className="size-4" />
                      {internship.location}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
                      <BriefcaseBusinessIcon className="size-4" />
                      {internship.mode}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
                      Deadline {internship.deadline}
                    </span>
                  </div>

                  <p className="text-sm leading-7 text-slate-600">
                    {internship.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="rounded-full border border-border bg-white/75 text-slate-600"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {hasMatchMetadata(internship) && internship.matchReasons.length ? (
                    <div className="rounded-[1.25rem] border border-primary/15 bg-primary/8 p-4 text-sm leading-7 text-slate-600">
                      <div className="mb-2 inline-flex items-center gap-2 font-semibold text-slate-950">
                        <SparklesIcon className="size-4 text-primary" />
                        Recommended because you studied or signaled
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {internship.matchReasons.map((reason) => (
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

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      className={buttonVariants({
                        variant: "default",
                        className: "flex-1 rounded-full",
                      })}
                      href={`/internships/${internship.slug}`}
                    >
                      View details
                    </Link>
                    <Button
                      className="rounded-full"
                      onClick={() => handleSave(internship.id, isSaved)}
                      type="button"
                      variant="outline"
                    >
                      <BookmarkIcon className="size-4" />
                      {isSaved ? "Unsave" : "Save"}
                    </Button>
                    <Button
                      className={cn("rounded-full", isTracked && "opacity-80")}
                      onClick={() => handleTrack(internship.id)}
                      type="button"
                      variant="secondary"
                    >
                      {isTracked ? "Update tracker" : "Add to tracker"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          action={
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/internships"
            >
              Browse all internships
            </Link>
          }
          className="rounded-[1.75rem]"
          description="Try broadening your filters or keep building learning proof so the matching engine has more signal to work with."
          eyebrow={mode === "saved" ? "Shortlist empty" : "No filtered results"}
          icon={SearchIcon}
          title={
            mode === "saved"
              ? "No saved internships yet"
              : "No internships match those filters"
          }
        />
      )}
    </div>
  )
}

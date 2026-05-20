"use client"

import Link from "next/link"
import { useDeferredValue, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BookOpenIcon, SearchIcon } from "lucide-react"

import { CategoryPills } from "@/components/learning/category-pills"
import { CourseCard } from "@/components/learning/course-card"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro, StatCard } from "@/components/shared/app-primitives"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { learningCategories } from "@/types"

const durationFilters = ["All", "Short", "Medium", "Deep"]
const visibilityFilters = ["All", "Featured", "Popular", "New"]

export function CourseCatalog() {
  const router = useRouter()
  const {
    activeUser,
    activeWorkspace,
    publishedCourses,
    recommendedCourses,
    enrollInCourse,
  } = useCareerHub()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [level, setLevel] = useState("All")
  const [duration, setDuration] = useState("All")
  const [visibility, setVisibility] = useState("All")
  const deferredQuery = useDeferredValue(query)

  const recommendedMap = useMemo(
    () =>
      new Map(recommendedCourses.map((course) => [course.id, course])),
    [recommendedCourses]
  )

  const filteredCourses = publishedCourses.filter((course) => {
    const searchable = [
      course.title,
      course.category,
      course.shortDescription,
      course.description,
      ...course.skills,
      ...course.outcomes,
    ]
      .join(" ")
      .toLowerCase()

    const matchesQuery =
      !deferredQuery || searchable.includes(deferredQuery.toLowerCase())
    const matchesCategory = category === "All" || course.category === category
    const matchesLevel = level === "All" || course.level === level
    const matchesDuration =
      duration === "All" ||
      (duration === "Short" && course.durationHours <= 3) ||
      (duration === "Medium" && course.durationHours > 3 && course.durationHours <= 5) ||
      (duration === "Deep" && course.durationHours > 5)
    const matchesVisibility =
      visibility === "All" ||
      (visibility === "Featured" && course.featured) ||
      (visibility === "Popular" && course.popular) ||
      (visibility === "New" && course.isNew)

    return matchesQuery && matchesCategory && matchesLevel && matchesDuration && matchesVisibility
  })

  function handleEnroll(courseId: string, slug: string) {
    if (!activeUser) {
      router.push("/auth")
      return
    }

    enrollInCourse(courseId)
    toast.success("Course added to your learning plan.")
    router.push(`/learning/${slug}`)
  }

  const enrolledCourseIds = new Set(
    (activeWorkspace?.enrollments ?? []).map((enrollment) => enrollment.courseId)
  )

  return (
    <div className="section-shell space-y-8 py-10 md:py-14">
      <PageIntro
        eyebrow="Course catalog"
        title="Learn practical tech skills with career outcomes in mind"
        description="Browse Tetisol courses across AI, software, cybersecurity, analytics, design, and employability. Enroll, track progress, earn certificates, and connect your learning to real internship momentum."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper="Free, structured courses ready to start"
          icon={BookOpenIcon}
          label="Courses"
          value={`${publishedCourses.length}`}
        />
        <StatCard
          helper="High-demand tracks across AI and tech"
          icon={BookOpenIcon}
          label="Categories"
          value={`${learningCategories.length}`}
        />
        <StatCard
          helper="Portfolio, certification, and internship alignment"
          icon={BookOpenIcon}
          label="Outcomes"
          value="Career-ready"
        />
        <StatCard
          helper="Modern learning experience with progress tracking"
          icon={BookOpenIcon}
          label="Experience"
          value="Connected"
        />
      </div>

      {recommendedCourses[0] ? (
        <Card className="premium-panel overflow-hidden">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Best next fit
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                  {recommendedCourses[0].title}
                </h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                {recommendedCourses[0].shortDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendedCourses[0].matchReasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full border border-primary/12 bg-primary/8 px-3 py-1.5 text-sm text-primary"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                Why this appears first
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Tetisol ranks courses using your learning focus, career interests, role preferences, and existing skill base so the catalog feels more like guidance than a list.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="glass-card rounded-[1.75rem] border-white/80">
        <CardContent className="space-y-5 p-5">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-12 rounded-full pl-11"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, skills, or outcomes"
              value={query}
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Category
            </p>
            <CategoryPills
              items={["All", ...learningCategories]}
              onChange={setCategory}
              value={category}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Level
              </p>
              <CategoryPills
                items={["All", "Beginner", "Intermediate", "Advanced"]}
                onChange={setLevel}
                value={level}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Duration
              </p>
              <CategoryPills
                items={durationFilters}
                onChange={setDuration}
                value={duration}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Surface
              </p>
              <CategoryPills
                items={visibilityFilters}
                onChange={setVisibility}
                value={visibility}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredCourses.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredCourses.map((course) => {
            const recommendedCourse = recommendedMap.get(course.id) ?? course
            const isEnrolled = enrolledCourseIds.has(course.id)

            return (
              <CourseCard
                key={course.id}
                course={recommendedCourse}
                ctaLabel={isEnrolled ? "Continue learning" : "Enroll now"}
                href={isEnrolled ? `/learning/${course.slug}` : `/courses/${course.slug}`}
                onCta={
                  isEnrolled
                    ? undefined
                    : () => handleEnroll(course.id, course.slug)
                }
                secondaryAction={
                  !activeUser ? (
                    <Link
                      className="rounded-full border border-border bg-white/85 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/25 hover:text-primary"
                      href="/auth"
                    >
                      Sign in to save progress
                    </Link>
                  ) : undefined
                }
              />
            )
          })}
        </div>
      ) : (
        <EmptyState
          action={
            <Link
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              href="/courses"
            >
              Reset filters
            </Link>
          }
          className="rounded-[1.75rem]"
          description="Try broadening your search, adjusting the difficulty level, or switching to a different category."
          icon={SearchIcon}
          title="No courses match those filters"
        />
      )}
    </div>
  )
}

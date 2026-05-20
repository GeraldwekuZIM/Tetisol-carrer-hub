"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  AwardIcon,
  BookOpenIcon,
  BookmarkIcon,
  BriefcaseBusinessIcon,
  BrainCircuitIcon,
  CircleUserRoundIcon,
  CompassIcon,
  FileTextIcon,
  HomeIcon,
  KanbanSquareIcon,
  LogOutIcon,
  MenuIcon,
  Settings2Icon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { LoadingCard } from "@/components/shared/app-primitives"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigationSections = [
  {
    label: "Core",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
      { href: "/courses", label: "Courses", icon: CompassIcon },
      { href: "/learning", label: "My Learning", icon: BookOpenIcon },
      { href: "/certificates", label: "Certificates", icon: AwardIcon },
    ],
  },
  {
    label: "Career",
    items: [
      { href: "/internships", label: "Internships", icon: BriefcaseBusinessIcon },
      { href: "/saved", label: "Saved", icon: BookmarkIcon },
      { href: "/applications", label: "Applications", icon: KanbanSquareIcon },
      { href: "/cv-builder", label: "CV Builder", icon: FileTextIcon },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/profile", label: "Profile", icon: Settings2Icon }],
  },
] as const

function getPageMeta(pathname: string) {
  if (pathname === "/dashboard") {
    return {
      title: "Dashboard",
      description: "Your live command center for learning momentum, employability signals, and opportunity movement.",
    }
  }

  if (pathname === "/courses") {
    return {
      title: "Courses",
      description: "Browse practical learning tracks built to translate into proof, projects, and employability.",
    }
  }

  if (pathname.startsWith("/courses/")) {
    return {
      title: "Course details",
      description: "Review outcomes, module depth, and career value before you commit your time.",
    }
  }

  if (pathname === "/learning") {
    return {
      title: "My Learning",
      description: "Resume what matters, revisit notes, and keep your learning evidence moving toward real outcomes.",
    }
  }

  if (pathname.startsWith("/learning/")) {
    return {
      title: "Course player",
      description: "Stay focused inside the lesson while Tetisol keeps progress, notes, and assessments connected.",
    }
  }

  if (pathname === "/certificates" || pathname.startsWith("/certificates/")) {
    return {
      title: "Certificates",
      description: "Collect verified proof of learning that can flow directly into your profile and CV.",
    }
  }

  if (pathname === "/internships") {
    return {
      title: "Internships",
      description: "Discover internship roles mapped to the skills and learning signals you have already built.",
    }
  }

  if (pathname === "/saved") {
    return {
      title: "Saved",
      description: "Hold onto promising roles, then convert them into action when your profile is strongest.",
    }
  }

  if (pathname === "/applications") {
    return {
      title: "Applications",
      description: "Track every role, deadline, interview note, and follow-up without losing the bigger picture.",
    }
  }

  if (pathname === "/cv-builder") {
    return {
      title: "CV Builder",
      description: "Turn courses, certificates, and project work into a stronger story for internships and hiring teams.",
    }
  }

  if (pathname === "/profile") {
    return {
      title: "Profile",
      description: "Keep your learning goals, interests, and internship direction aligned with the platform.",
    }
  }

  if (pathname === "/onboarding") {
    return {
      title: "Onboarding",
      description: "Shape the learner profile that powers Tetisol's personalization, recommendations, and next steps.",
    }
  }

  return {
    title: "Tetisol",
    description: "An AI learning and career platform designed to move learners from skill building into real opportunities.",
  }
}

function NavLinks({
  pathname,
  showAdmin,
  onNavigate,
}: {
  pathname: string
  showAdmin?: boolean
  onNavigate?: () => void
}) {
  const sections = showAdmin
    ? [
        ...navigationSections,
        {
          label: "Internal",
          items: [{ href: "/admin", label: "Admin CMS", icon: ShieldCheckIcon }],
        },
      ]
    : navigationSections

  return (
    <nav className="space-y-5">
      {sections.map((section) => (
        <div className="space-y-2" key={section.label}>
          <p className="px-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {section.label}
          </p>
          <div className="space-y-2">
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-medium transition",
                    isActive
                      ? "bg-white text-slate-950 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.65)]"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  )}
                  href={item.href}
                  onClick={onNavigate}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    activeUser,
    activeWorkspace,
    dashboardReminders,
    earnedCertificates,
    hydrated,
    inProgressCourses,
    isAdmin,
    completedCourses,
    savedInternships,
    signOut,
    upcomingDeadlines,
  } = useCareerHub()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pageMeta = getPageMeta(pathname)

  useEffect(() => {
    if (!hydrated) {
      return
    }

    if (!activeUser) {
      router.replace("/auth")
      return
    }

    if (!activeWorkspace?.onboardingCompleted && pathname !== "/onboarding") {
      router.replace("/onboarding")
    }
  }, [activeUser, activeWorkspace?.onboardingCompleted, hydrated, pathname, router])

  if (!hydrated || !activeUser) {
    return (
      <div className="section-shell flex min-h-screen items-center justify-center py-16">
        <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
          <LoadingCard className="rounded-[2rem]" />
          <LoadingCard className="rounded-[2rem]" />
        </div>
      </div>
    )
  }

  const nextReminder = dashboardReminders[0]
  const nextDeadline = upcomingDeadlines[0]
  const quickFocus =
    nextReminder?.title ??
    nextDeadline?.internship?.title ??
    inProgressCourses[0]?.title ??
    "Shape your next learning step"

  return (
    <div className="min-h-screen">
      <div className="section-shell grid gap-5 py-5 lg:grid-cols-[304px_1fr]">
        <aside className="relative hidden h-fit overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.88)] lg:sticky lg:top-5 lg:block lg:self-start">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.34),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.24),transparent_30%)]" />
          <div className="relative flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_18px_45px_-28px_rgba(99,102,241,0.85)]">
              <BookOpenIcon className="size-5" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-white">
                Tetisol
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                Learning to employment
              </p>
            </div>
          </div>

          <div className="relative mt-7 rounded-[1.6rem] border border-white/10 bg-white/8 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                  Platform focus
                </p>
                <p className="mt-2 font-heading text-xl font-semibold text-white">
                  {quickFocus}
                </p>
              </div>
              <div className="rounded-2xl bg-white/12 p-3 text-white">
                <SparklesIcon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              Tetisol is designed as one connected loop: learn, validate skill,
              strengthen your CV, then move into internships with clearer evidence.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                Role {activeUser.role ?? "student"}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                AI copilot live
              </span>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                In progress
              </p>
              <p className="mt-2 font-heading text-2xl font-semibold text-white">
                {inProgressCourses.length}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                Completed
              </p>
              <p className="mt-2 font-heading text-2xl font-semibold text-white">
                {completedCourses.length}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                Certificates
              </p>
              <p className="mt-2 font-heading text-2xl font-semibold text-white">
                {earnedCertificates.length}
              </p>
            </div>
          </div>

          <div className="relative mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              Navigation
            </p>
            <NavLinks pathname={pathname} showAdmin={isAdmin} />
          </div>

          <div className="relative mt-8 rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
              Signed in as
            </p>
            <p className="mt-2 font-heading text-xl font-semibold text-white">
              {activeUser.fullName}
            </p>
            <p className="mt-1 text-sm text-slate-300">{activeUser.email}</p>
            <div className="mt-4 grid gap-2 text-xs text-slate-300">
              <div className="rounded-full bg-white/8 px-3 py-2">
                Weekly goal: {activeWorkspace?.preferences.weeklyLearningGoalHours ?? 0}h
              </div>
              <div className="rounded-full bg-white/8 px-3 py-2">
                Saved opportunities: {savedInternships.length}
              </div>
            </div>
            <Button
              className="mt-4 w-full rounded-full"
              onClick={() => void signOut()}
              variant="secondary"
            >
              <LogOutIcon className="size-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <div className="space-y-5">
          <header className="premium-panel overflow-hidden px-5 py-4">
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Tetisol platform
                </p>
                <h1 className="mt-1 truncate font-heading text-2xl font-semibold text-slate-950">
                  {pageMeta.title}
                </h1>
                <p className="mt-1 max-w-3xl text-sm text-slate-600">
                  {pageMeta.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
                    <BrainCircuitIcon className="size-3.5" />
                    Copilot active
                  </div>
                  <div className="rounded-full border border-primary/10 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
                    Weekly goal {activeWorkspace?.preferences.weeklyLearningGoalHours ?? 0}h
                  </div>
                  <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {nextReminder
                      ? `Next focus: ${nextReminder.title}`
                      : "No urgent reminders right now"}
                  </div>
                  <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {nextDeadline?.deadline
                      ? `Nearest deadline ${nextDeadline.deadline}`
                      : "Deadlines under control"}
                  </div>
                  {isAdmin ? (
                    <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600">
                      Internal access enabled
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      className: "hidden rounded-full px-4 md:inline-flex",
                    })
                  )}
                  href="/"
                >
                  View landing page
                </Link>
                <button
                  className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:hidden"
                  onClick={() => setMobileNavOpen(true)}
                  type="button"
                >
                  <MenuIcon className="size-5" />
                  <span className="sr-only">Open navigation</span>
                </button>
                <div className="hidden items-center gap-3 rounded-full border border-white/80 bg-white/85 px-3 py-2 md:flex">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CircleUserRoundIcon className="size-5" />
                  </div>
                  <div className="pr-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {activeUser.fullName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {activeWorkspace?.profile.degree || "Learner profile in progress"}{" "}
                      • {activeUser.role ?? "student"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="space-y-6">{children}</main>
        </div>
      </div>

      <Sheet onOpenChange={setMobileNavOpen} open={mobileNavOpen}>
        <SheetContent className="bg-slate-950 text-white" side="left">
          <SheetHeader>
            <SheetTitle>Tetisol</SheetTitle>
            <SheetDescription className="text-slate-300">
              Learning, proof, internships, applications, and CV momentum in one workspace.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5 px-4 pb-6">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4 text-sm leading-7 text-slate-200">
              {nextReminder?.title ??
                "Your next best step appears here as your learning and career activity grows."}
            </div>
            <NavLinks
              onNavigate={() => setMobileNavOpen(false)}
              pathname={pathname}
              showAdmin={isAdmin}
            />
            <Button
              className="w-full rounded-full"
              onClick={() => void signOut()}
              variant="secondary"
            >
              <LogOutIcon className="size-4" />
              Sign out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenCheckIcon,
  CalendarClockIcon,
  CircleDotDashedIcon,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const recommendedCourses = [
  {
    title: "Practical Prompt Engineering",
    company: "Tetisol",
    match: "94% fit",
    meta: "Certificate | Beginner | 4h 25m",
  },
  {
    title: "Data Analytics with Python",
    company: "Tetisol",
    match: "89% fit",
    meta: "In progress | Analytics | 4h 30m",
  },
]

const learningFlow = [
  { label: "Enrolled", count: "4" },
  { label: "In Progress", count: "2" },
  { label: "Completed", count: "2" },
  { label: "Certificates", count: "2 ready" },
]

const deadlines = [
  { role: "BlueOrbit interview follow-up", time: "Apr 28" },
  { role: "Resume Data Analytics lesson", time: "Apr 23" },
]

export function DashboardPreviewPanel({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 text-white shadow-[0_30px_80px_-38px_rgba(15,23,42,0.9)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_30%)]" />
      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-indigo-200/85">
              Dashboard preview
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold">
              Learning, certificates, and career momentum in one workspace
            </h3>
          </div>
          <div className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-sm text-indigo-50/90">
            CV Score 92
          </div>
        </div>

        <div className={cn("mt-6 grid gap-4", compact ? "lg:grid-cols-1" : "lg:grid-cols-[1.1fr_0.9fr]")}>
          <Card className="border-white/10 bg-white/7 text-white transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm text-indigo-100/85">
                  Recommended courses
                </CardTitle>
                <BookOpenCheckIcon className="size-4 text-indigo-200" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {recommendedCourses.map((course) => (
                <div
                  key={course.title}
                  className="rounded-[1.1rem] border border-white/8 bg-white/8 p-3 transition-transform duration-300 hover:translate-x-1 hover:bg-white/12"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="mt-1 text-indigo-100/70">{course.company}</p>
                    </div>
                    <span className="rounded-full bg-white/12 px-2.5 py-1 text-xs text-indigo-50/90">
                      {course.match}
                    </span>
                  </div>
                  <p className="mt-2 text-indigo-100/70">{course.meta}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/7 text-white transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm text-indigo-100/85">
                    Learning tracker
                  </CardTitle>
                  <CircleDotDashedIcon className="size-4 text-indigo-200" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm">
                {learningFlow.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-[1rem] bg-white/8 px-3 py-2"
                  >
                    <span>{item.label}</span>
                    <span className="text-indigo-100/75">{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-[0.95fr_1.05fr]")}>
              <Card className="border-white/10 bg-white/7 text-white transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm text-indigo-100/85">
                      Certificate progress
                    </CardTitle>
                    <AwardIcon className="size-4 text-indigo-200" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-3xl font-semibold">2 issued</p>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[78%] rounded-full bg-linear-to-r from-cyan-400 to-indigo-400" />
                  </div>
                  <p className="text-sm text-indigo-100/75">
                    Course completion flows into certification and profile proof automatically.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/7 text-white transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm text-indigo-100/85">
                      Next actions
                    </CardTitle>
                    <CalendarClockIcon className="size-4 text-indigo-200" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {deadlines.map((deadline) => (
                    <div
                      key={deadline.role}
                      className="flex items-center justify-between rounded-[1rem] bg-white/8 px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">{deadline.role}</p>
                        <p className="text-indigo-100/70">Next step ready</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-indigo-100/80">
                        {deadline.time}
                        <ArrowRightIcon className="size-3.5" />
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[1.25rem] border border-white/8 bg-white/7 px-4 py-3 text-sm text-indigo-100/75">
          Recommended internships, application tracking, and CV guidance remain connected to the same learning data.
        </div>
      </div>
    </div>
  )
}

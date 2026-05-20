import Link from "next/link"

import { DashboardPreviewPanel } from "@/components/marketing/dashboard-preview-panel"
import {
  dashboardPreviewHighlights,
  proofPoints,
} from "@/components/marketing/marketing-data"
import { SectionHeading } from "@/components/marketing/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardPreviewSection() {
  return (
    <section className="section-shell mt-24 scroll-mt-28" id="dashboard-preview">
      <div className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
        <div className="space-y-8">
          <SectionHeading
            description="The workspace is where learning and career activity come together: course progress, certificates, internships, deadlines, and CV strength all stay visible in one place."
            eyebrow="Dashboard Preview"
            title="A premium workspace built around learning and employability momentum"
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {dashboardPreviewHighlights.map((item) => (
              <Card
                key={item.title}
                className="glass-card rounded-[1.55rem] border-white/80 transition-transform duration-300 hover:-translate-y-1"
              >
                <CardContent className="space-y-3 p-5">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {proofPoints.map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-sm font-medium text-primary"
              >
                {item}
              </span>
            ))}
          </div>

          <Link
            className={buttonVariants({
              variant: "default",
              className: "h-12 rounded-full px-6 text-base",
            })}
            href="/auth"
          >
            Create your profile
          </Link>
        </div>

        <DashboardPreviewPanel />
      </div>
    </section>
  )
}

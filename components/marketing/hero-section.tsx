import Link from "next/link"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { DashboardPreviewPanel } from "@/components/marketing/dashboard-preview-panel"
import { heroStats } from "@/components/marketing/marketing-data"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="section-shell relative pt-8 sm:pt-10">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-[0_12px_30px_-18px_rgba(79,70,229,0.6)]">
            <SparklesIcon className="size-4" />
            AI learning, certification, internships, and CV momentum in one premium platform
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl font-heading text-5xl leading-[1] font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              From Learning <span className="text-primary">to Earning</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Learn in-demand tech skills, earn certificates, discover internships, track applications, and build a stronger CV in one place. Tetisol turns scattered effort into structured employability.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              className={cn(
                buttonVariants({
                  variant: "default",
                  className:
                    "h-12 rounded-full px-6 text-base shadow-[0_18px_42px_-20px_rgba(79,70,229,0.9)] transition-transform duration-300 hover:-translate-y-0.5",
                }),
                "gap-2"
              )}
              href="/auth"
            >
              Start learning
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                className:
                  "h-12 rounded-full px-6 text-base transition-transform duration-300 hover:-translate-y-0.5",
              })}
              href="#dashboard-preview"
            >
              See the platform
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {heroStats.map((item) => (
              <Card
                key={item.label}
                className="glass-card rounded-[1.5rem] border-white/80 transition-transform duration-300 hover:-translate-y-1"
              >
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                    {item.label}
                  </p>
                  <p className="font-heading text-2xl font-semibold text-slate-950">
                    {item.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-4 left-8 hidden rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-3 shadow-[0_20px_40px_-30px_rgba(79,70,229,0.8)] backdrop-blur md:block">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Certificates earned
            </p>
            <p className="mt-1 font-heading text-2xl font-semibold text-slate-950">
              2 verified
            </p>
          </div>
          <div className="absolute -right-3 bottom-10 hidden rounded-[1.25rem] border border-white/80 bg-slate-950 px-4 py-3 text-white shadow-[0_24px_48px_-30px_rgba(15,23,42,0.9)] md:block">
            <p className="text-xs uppercase tracking-[0.22em] text-indigo-100/70">
              Next lesson
            </p>
            <p className="mt-1 font-heading text-xl font-semibold">
              Resume today
            </p>
          </div>
          <DashboardPreviewPanel compact className="translate-y-0 transition-transform duration-500 hover:-translate-y-1" />
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { ArrowRightIcon, BookOpenIcon } from "lucide-react"

import { footerLinkGroups } from "@/components/marketing/marketing-data"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LandingFooter() {
  return (
    <footer className="section-shell mt-24 pb-14">
      <div className="glass-card overflow-hidden rounded-[2.25rem] border-white/80">
        <div className="grid gap-10 px-6 py-8 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:px-10 lg:py-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_18px_36px_-26px_rgba(79,70,229,0.9)]">
                <BookOpenIcon className="size-5" />
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-slate-950">
                  Tetisol
                </p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  AI learning + career platform
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-heading text-3xl font-semibold text-slate-950">
                A bridge between learning, certification, and employment
              </h3>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                Tetisol helps students and professionals build practical tech skills, earn proof of growth, and move toward internships and work with more confidence.
              </p>
            </div>

            <Link
              className={cn(
                buttonVariants({
                  variant: "default",
                  className: "h-12 rounded-full px-6 text-base",
                }),
                "gap-2"
              )}
              href="/auth"
            >
              Open Tetisol
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinkGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {group.title}
                </p>
                <div className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href + link.label}
                      className="block text-sm text-slate-600 transition-colors hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/80 px-6 py-4 text-sm text-slate-500 md:px-8 lg:px-10">
          Copyright 2026 Tetisol. Built to help learners gain skills, earn certificates, and move toward employability with more confidence.
        </div>
      </div>
    </footer>
  )
}

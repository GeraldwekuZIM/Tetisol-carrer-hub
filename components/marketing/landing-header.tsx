"use client"

import Link from "next/link"
import { useState } from "react"
import { BookOpenIcon, MenuIcon } from "lucide-react"

import { landingNavLinks } from "@/components/marketing/marketing-data"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function LandingHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="section-shell sticky top-4 z-50 py-6">
        <div className="glass-card flex items-center justify-between rounded-full px-4 py-3 shadow-[0_24px_60px_-36px_rgba(79,70,229,0.5)] md:px-5">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_32px_-18px_rgba(79,70,229,0.9)]">
              <BookOpenIcon className="size-5" />
            </div>
            <div>
              <p className="font-heading text-base font-semibold text-slate-950">
                Tetisol
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                AI learning + career platform
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            {landingNavLinks.map((item) => (
              <a
                key={item.href}
                className="transition-colors hover:text-primary"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: "hidden rounded-full px-4 lg:inline-flex",
                })
              )}
              href="/dashboard"
            >
              Open workspace
            </Link>
            <Link
              className={buttonVariants({
                variant: "default",
                className: "hidden rounded-full px-5 sm:inline-flex",
              })}
              href="/auth"
            >
              Start learning
            </Link>
            <Button
              className="rounded-full sm:hidden"
              onClick={() => setOpen(true)}
              size="icon"
              type="button"
              variant="outline"
            >
              <MenuIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      <Sheet onOpenChange={setOpen} open={open}>
        <SheetContent className="bg-white text-slate-950" side="right">
          <SheetHeader>
            <SheetTitle>Tetisol</SheetTitle>
            <SheetDescription>
              Learn in-demand tech skills, earn certificates, and move toward employment.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6 pt-2">
            <div className="space-y-2">
              {landingNavLinks.map((item) => (
                <a
                  key={item.href}
                  className={buttonVariants({
                    variant: "ghost",
                    className: "h-11 w-full justify-start rounded-2xl px-4",
                  })}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <Link
                className={buttonVariants({
                  variant: "default",
                  className: "h-11 w-full rounded-full",
                })}
                href="/auth"
                onClick={() => setOpen(false)}
              >
                Start learning
              </Link>
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "h-11 w-full rounded-full",
                })}
                href="/dashboard"
                onClick={() => setOpen(false)}
              >
                Open workspace
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

import Link from "next/link"
import { SearchXIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-16">
      <div className="glass-card max-w-xl rounded-[2rem] p-10 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <SearchXIcon className="size-8" />
        </div>
        <h1 className="mt-6 font-heading text-3xl font-semibold text-slate-950">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Try heading back to the dashboard or browse open internships again.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className={buttonVariants({
              variant: "default",
              className: "h-10 justify-center rounded-full px-6",
            })}
            href="/dashboard"
          >
            Open dashboard
          </Link>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "h-10 justify-center rounded-full px-6",
            })}
            href="/internships"
          >
            Browse internships
          </Link>
        </div>
      </div>
    </div>
  )
}

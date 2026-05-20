"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PlusIcon, SearchIcon } from "lucide-react"

import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro } from "@/components/shared/app-primitives"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getContentStatus } from "@/lib/content"

const statusFilters = ["All", "Published", "Draft", "Archived"] as const

export function InternshipAdminList() {
  const {
    state,
    saveAdminInternshipContent,
    archiveAdminInternshipContent,
    deleteAdminInternshipContent,
  } = useCareerHub()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All")

  const filteredInternships = useMemo(() => {
    return [...state.internships]
      .filter((internship) => {
        const searchable =
          `${internship.title} ${internship.company} ${internship.location} ${internship.category}`.toLowerCase()
        const matchesQuery =
          !query.trim() || searchable.includes(query.trim().toLowerCase())
        const matchesStatus =
          status === "All" || getContentStatus(internship.status) === status

        return matchesQuery && matchesStatus
      })
      .sort((left, right) => right.deadline.localeCompare(left.deadline))
  }, [query, state.internships, status])

  function handleTogglePublish(internshipId: string) {
    const internship = state.internships.find((item) => item.id === internshipId)
    if (!internship) {
      return
    }

    const nextStatus =
      getContentStatus(internship.status) === "Published" ? "Draft" : "Published"
    saveAdminInternshipContent({
      ...internship,
      status: nextStatus,
    })
    toast.success(
      nextStatus === "Published"
        ? "Internship published."
        : "Internship moved to draft."
    )
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Admin internships"
        title="Manage Tetisol internship listings"
        description="Create, edit, publish, archive, and clean up internship listings from one internal board."
        action={
          <Link
            className={buttonVariants({
              variant: "default",
              className: "rounded-full px-5",
            })}
            href="/admin/internships/new"
          >
            <PlusIcon className="size-4" />
            New internship
          </Link>
        }
      />

      <Card className="premium-panel">
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-11 rounded-full pl-11"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, company, location, or category"
              value={query}
            />
          </div>
          <select
            className="h-11 rounded-full border border-input bg-white px-4 text-sm text-slate-700"
            onChange={(event) =>
              setStatus(event.target.value as (typeof statusFilters)[number])
            }
            value={status}
          >
            {statusFilters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {filteredInternships.length ? (
        <div className="space-y-4">
          {filteredInternships.map((internship) => {
            const resolvedStatus = getContentStatus(internship.status)

            return (
              <Card className="premium-panel" key={internship.id}>
                <CardContent className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminStatusBadge status={internship.status} />
                      <span className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                        {internship.category}
                      </span>
                      <span className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                        {internship.mode}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-semibold text-slate-950">
                        {internship.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {internship.company} | {internship.location} | Deadline {internship.deadline}
                      </p>
                    </div>
                    <div className="rounded-[1rem] border border-border bg-white/75 px-4 py-3 text-sm leading-6 text-slate-600">
                      {resolvedStatus === "Published"
                        ? "Visible in learner internship discovery, saved roles, and tracker flows."
                        : resolvedStatus === "Draft"
                          ? "Private to the admin workspace until you publish it."
                          : "Archived listings are hidden from discovery but kept for internal records."}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      className={buttonVariants({
                        variant: "outline",
                        className: "rounded-full px-4",
                      })}
                      href={`/admin/internships/${internship.id}`}
                    >
                      Edit
                    </Link>
                    {resolvedStatus === "Published" ? (
                      <Link
                        className={buttonVariants({
                          variant: "outline",
                          className: "rounded-full px-4",
                        })}
                        href={`/internships/${internship.slug}`}
                      >
                        Preview live
                      </Link>
                    ) : null}
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                      onClick={() => handleTogglePublish(internship.id)}
                      type="button"
                    >
                      {resolvedStatus === "Published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-slate-600"
                      onClick={() => {
                        archiveAdminInternshipContent(internship.id)
                        toast.success("Internship archived.")
                      }}
                      type="button"
                    >
                      Archive
                    </button>
                    {resolvedStatus !== "Published" ? (
                      <button
                        className="inline-flex h-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700"
                        onClick={() => {
                          if (
                            !window.confirm(`Delete "${internship.title}" permanently?`)
                          ) {
                            return
                          }
                          deleteAdminInternshipContent(internship.id)
                          toast.success("Internship deleted.")
                        }}
                        type="button"
                      >
                        Delete
                      </button>
                    ) : null}
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
              href="/admin/internships/new"
            >
              Create internship
            </Link>
          }
          className="rounded-[1.8rem]"
          description="Try a broader search or create a new listing."
          eyebrow="No internship results"
          icon={SearchIcon}
          title="No internships match those filters"
        />
      )}
    </div>
  )
}

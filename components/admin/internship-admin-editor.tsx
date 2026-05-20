"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react"

import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { PageIntro } from "@/components/shared/app-primitives"
import { TagInput } from "@/components/shared/tag-input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createEmptyInternship, getContentStatus, slugify } from "@/lib/content"
import {
  courseLevels,
  internshipCategories,
  internshipListingTypes,
  internshipModes,
} from "@/types"

const internshipEditorSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  slug: z.string().min(1),
  company: z.string().min(2),
  category: z.enum(internshipCategories),
  location: z.string().min(2),
  mode: z.enum(internshipModes),
  type: z.enum(internshipListingTypes),
  level: z.enum(courseLevels),
  deadline: z.string().min(4),
  stipend: z.string().min(2),
  duration: z.string().min(2),
  shortDescription: z.string().min(12),
  fullDescription: z.string().min(24),
  requirements: z.array(z.string()).min(1),
  preferredQualifications: z.array(z.string()).min(1),
  responsibilities: z.array(z.string()).min(1),
  skills: z.array(z.string()).min(1),
  interests: z.array(z.string()).min(1),
  applicationLink: z.string().min(4),
  status: z.enum(["Draft", "Published", "Archived"]),
})

type InternshipEditorValues = z.output<typeof internshipEditorSchema>

export function InternshipAdminEditor({
  internshipId,
}: {
  internshipId?: string
}) {
  const router = useRouter()
  const {
    state,
    saveAdminInternshipContent,
    archiveAdminInternshipContent,
    deleteAdminInternshipContent,
  } = useCareerHub()
  const existingInternship = internshipId
    ? state.internships.find((internship) => internship.id === internshipId)
    : undefined

  const defaultInternship = existingInternship ?? createEmptyInternship()

  const form = useForm<InternshipEditorValues>({
    resolver: zodResolver(internshipEditorSchema) as never,
    defaultValues: {
      id: defaultInternship.id,
      title: defaultInternship.title,
      slug: defaultInternship.slug,
      company: defaultInternship.company,
      category: defaultInternship.category,
      location: defaultInternship.location,
      mode: defaultInternship.mode,
      type: defaultInternship.type ?? "Internship",
      level: defaultInternship.level,
      deadline: defaultInternship.deadline,
      stipend: defaultInternship.stipend,
      duration: defaultInternship.duration,
      shortDescription:
        defaultInternship.shortDescription ?? defaultInternship.description,
      fullDescription:
        defaultInternship.fullDescription ?? defaultInternship.description,
      requirements: defaultInternship.requirements,
      preferredQualifications:
        defaultInternship.preferredQualifications ?? [""].filter(Boolean),
      responsibilities: defaultInternship.responsibilities,
      skills: defaultInternship.skills,
      interests: defaultInternship.interests,
      applicationLink: defaultInternship.applicationLink ?? "",
      status: defaultInternship.status ?? "Draft",
    },
  })

  const watchedTitle = useWatch({ control: form.control, name: "title" })
  const watchedSlug = useWatch({ control: form.control, name: "slug" })
  const watchedStatus = useWatch({ control: form.control, name: "status" })
  const watchedCompany = useWatch({ control: form.control, name: "company" })
  const watchedDeadline = useWatch({ control: form.control, name: "deadline" })
  const watchedSkills = useWatch({ control: form.control, name: "skills" }) ?? []

  function onSubmit(values: InternshipEditorValues) {
    saveAdminInternshipContent({
      ...(existingInternship ?? createEmptyInternship()),
      id:
        existingInternship?.id ||
        values.id ||
        `internship-${slugify(values.slug || values.title)}`,
      slug: slugify(values.slug || values.title),
      title: values.title,
      company: values.company,
      category: values.category,
      location: values.location,
      mode: values.mode,
      type: values.type,
      level: values.level,
      deadline: values.deadline,
      stipend: values.stipend,
      duration: values.duration,
      description: values.shortDescription,
      shortDescription: values.shortDescription,
      fullDescription: values.fullDescription,
      requirements: values.requirements,
      preferredQualifications: values.preferredQualifications,
      responsibilities: values.responsibilities,
      skills: values.skills,
      interests: values.interests,
      applicationLink: values.applicationLink,
      status: values.status,
    })

    toast.success(
      existingInternship ? "Internship updated." : "Internship created."
    )
    router.push("/admin/internships")
  }

  if (internshipId && !existingInternship) {
    return (
      <div className="section-shell py-10">
        <Card className="premium-panel">
          <CardContent className="space-y-4 p-8">
            <h2 className="font-heading text-2xl font-semibold text-slate-950">
              Internship not found
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              This listing may have been removed or the link is out of date.
            </p>
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/admin/internships"
            >
              Back to internships
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Internship editor"
        title={
          existingInternship ? `Edit ${existingInternship.title}` : "Create internship"
        }
        description="Manage listing details, publishing status, qualifications, and application flow."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full px-5",
              })}
              href="/admin/internships"
            >
              <ArrowLeftIcon className="size-4" />
              Back to internships
            </Link>
            {existingInternship &&
            getContentStatus(existingInternship.status) === "Published" ? (
              <Link
                className={buttonVariants({
                  variant: "default",
                  className: "rounded-full px-5",
                })}
                href={`/internships/${existingInternship.slug}`}
              >
                Preview learner listing
                <ArrowUpRightIcon className="size-4" />
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="premium-panel">
          <CardContent className="space-y-3 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Learner visibility
            </p>
            <h2 className="font-heading text-2xl font-semibold text-slate-950">
              {watchedStatus === "Published"
                ? "This listing is visible in learner internship discovery"
                : watchedStatus === "Draft"
                  ? "This listing is still private to internal staff"
                  : "This listing is archived and hidden from learners"}
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              Publishing exposes the role to internship discovery, saved internships,
              and the learner application tracker.
            </p>
          </CardContent>
        </Card>

        <Card className="premium-panel">
          <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
            <div className="rounded-[1.2rem] border border-border bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Company</p>
              <p className="mt-2 font-heading text-base font-semibold text-slate-950">
                {watchedCompany || "Not set"}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-border bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Deadline</p>
              <p className="mt-2 font-heading text-base font-semibold text-slate-950">
                {watchedDeadline || "Not set"}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-border bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Skill tags
              </p>
              <p className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                {watchedSkills.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="premium-panel">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-heading text-2xl text-slate-950">
                Listing settings
              </CardTitle>
              <AdminStatusBadge status={watchedStatus} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 p-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Title</Label>
              <Input {...form.register("title")} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                {...form.register("slug")}
                onBlur={(event) => {
                  if (!event.target.value.trim() && watchedTitle) {
                    form.setValue("slug", slugify(watchedTitle), { shouldDirty: true })
                  }
                }}
                placeholder={watchedTitle ? slugify(watchedTitle) : "internship-slug"}
                value={watchedSlug}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                {...form.register("status")}
              >
                {["Draft", "Published", "Archived"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input {...form.register("company")} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                {...form.register("category")}
              >
                {internshipCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input {...form.register("location")} />
            </div>
            <div className="space-y-2">
              <Label>Mode</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                {...form.register("mode")}
              >
                {internshipModes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Listing type</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                {...form.register("type")}
              >
                {internshipListingTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-white px-4 text-sm text-slate-700"
                {...form.register("level")}
              >
                {courseLevels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="date" {...form.register("deadline")} />
            </div>
            <div className="space-y-2">
              <Label>Stipend</Label>
              <Input {...form.register("stipend")} />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input {...form.register("duration")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Short description</Label>
              <Textarea {...form.register("shortDescription")} className="min-h-24" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Full description</Label>
              <Textarea {...form.register("fullDescription")} className="min-h-32" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Application link</Label>
              <Input {...form.register("applicationLink")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Responsibilities</Label>
              <Controller
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add responsibilities"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Requirements</Label>
              <Controller
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add requirements"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Preferred qualifications</Label>
              <Controller
                control={form.control}
                name="preferredQualifications"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add preferred qualifications"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Skills</Label>
              <Controller
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add relevant skills"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Interest tags</Label>
              <Controller
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Add related learner interests"
                    value={field.value ?? []}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {existingInternship ? (
              <>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-slate-600"
                  onClick={() => {
                    archiveAdminInternshipContent(existingInternship.id)
                    toast.success("Internship archived.")
                    router.push("/admin/internships")
                  }}
                  type="button"
                >
                  Archive
                </button>
                {(existingInternship.status ?? "Published") !== "Published" ? (
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-medium text-rose-700"
                    onClick={() => {
                      if (
                        !window.confirm(`Delete "${existingInternship.title}" permanently?`)
                      ) {
                        return
                      }
                      deleteAdminInternshipContent(existingInternship.id)
                      toast.success("Internship deleted.")
                      router.push("/admin/internships")
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
          <Button className="rounded-full px-5" type="submit">
            {existingInternship ? "Save changes" : "Create internship"}
          </Button>
        </div>
      </form>
    </div>
  )
}

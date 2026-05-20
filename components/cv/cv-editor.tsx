"use client"

import { useDeferredValue, useEffect, useState } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  AwardIcon,
  FileCheck2Icon,
  LightbulbIcon,
  PlusIcon,
  RocketIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { PageIntro } from "@/components/shared/app-primitives"
import { TagInput } from "@/components/shared/tag-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { evaluateCv } from "@/services/career-hub-service"

const projectSchema = z.object({
  title: z.string().min(2),
  role: z.string().min(2),
  summary: z.string().min(10),
  impact: z.string().min(8),
  stack: z.array(z.string()).min(1),
})

const certificationSchema = z.object({
  courseName: z.string().min(2),
  issuer: z.string().min(2),
  issuedAt: z.string().min(4),
  credentialId: z.string().min(4),
})

const cvSchema = z.object({
  headline: z.string().min(4),
  summary: z.string().min(40),
  education: z.string().min(4),
  skills: z.array(z.string()).min(6),
  experienceText: z.string().min(10),
  achievements: z.array(z.string()).min(1),
  certifications: z.array(certificationSchema).min(1),
  projects: z.array(projectSchema).min(1),
})

type CVFormValues = z.infer<typeof cvSchema>

function createBlankProject() {
  return {
    title: "",
    role: "",
    summary: "",
    impact: "",
    stack: [],
  }
}

function createBlankCertification() {
  return {
    courseName: "",
    issuer: "Tetisol",
    issuedAt: "",
    credentialId: "",
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export function CVEditor() {
  const {
    activeWorkspace,
    updateCv,
    importLearningIntoCv,
    earnedCertificates,
    completedCourses,
    opportunityIntelligence,
  } = useCareerHub()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<CVFormValues>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      headline: activeWorkspace?.cv.headline ?? "",
      summary: activeWorkspace?.cv.summary ?? "",
      education: activeWorkspace?.cv.education ?? "",
      skills: activeWorkspace?.cv.skills ?? [],
      experienceText: activeWorkspace?.cv.experience.join("\n") ?? "",
      achievements: activeWorkspace?.cv.achievements ?? [],
      certifications:
        activeWorkspace?.cv.certifications.length
          ? activeWorkspace.cv.certifications
          : [createBlankCertification()],
      projects:
        activeWorkspace?.cv.projects.length
          ? activeWorkspace.cv.projects
          : [createBlankProject()],
    },
  })

  const certificationFields = useFieldArray({
    control: form.control,
    name: "certifications",
  })
  const projectFields = useFieldArray({
    control: form.control,
    name: "projects",
  })

  useEffect(() => {
    if (!activeWorkspace) {
      return
    }

    form.reset({
      headline: activeWorkspace.cv.headline,
      summary: activeWorkspace.cv.summary,
      education: activeWorkspace.cv.education,
      skills: activeWorkspace.cv.skills,
      experienceText: activeWorkspace.cv.experience.join("\n"),
      achievements: activeWorkspace.cv.achievements,
      certifications:
        activeWorkspace.cv.certifications.length
          ? activeWorkspace.cv.certifications
          : [createBlankCertification()],
      projects:
        activeWorkspace.cv.projects.length
          ? activeWorkspace.cv.projects
          : [createBlankProject()],
    })
  }, [activeWorkspace, form])

  const watchedValues = useWatch({
    control: form.control,
  })
  const deferredValues = useDeferredValue(watchedValues)
  const previewCv = {
    id: activeWorkspace?.cv.id ?? "cv-preview",
    headline: deferredValues.headline ?? "",
    summary: deferredValues.summary ?? "",
    education: deferredValues.education ?? "",
    skills: deferredValues.skills ?? [],
    experience: (deferredValues.experienceText ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    achievements: deferredValues.achievements ?? [],
    certifications:
      deferredValues.certifications?.map((certification, index) => ({
        id:
          activeWorkspace?.cv.certifications[index]?.id ??
          `preview-certification-${index + 1}`,
        courseName: certification?.courseName ?? "",
        issuer: certification?.issuer ?? "",
        issuedAt: certification?.issuedAt ?? "",
        credentialId: certification?.credentialId ?? "",
      })) ?? [],
    projects:
      deferredValues.projects?.map((project, index) => ({
        id: activeWorkspace?.cv.projects[index]?.id ?? `preview-project-${index + 1}`,
        title: project?.title ?? "",
        role: project?.role ?? "",
        summary: project?.summary ?? "",
        impact: project?.impact ?? "",
        stack: project?.stack ?? [],
        sourceCourseId: activeWorkspace?.cv.projects[index]?.sourceCourseId,
      })) ?? [],
  }
  const evaluation = evaluateCv(previewCv)

  const learningSkills = unique(completedCourses.flatMap((course) => course.skills))
  const missingLearningSkills = learningSkills.filter(
    (skill) =>
      !previewCv.skills.some(
        (existingSkill) => normalize(existingSkill) === normalize(skill)
      )
  )
  const unrepresentedCompletedCourses = completedCourses.filter(
    (course) =>
      !previewCv.projects.some((project) => project.sourceCourseId === course.id) &&
      !previewCv.projects.some(
        (project) => normalize(project.title).includes(normalize(course.title))
      )
  )

  const sectionHealth = [
    {
      label: "Story",
      helper: "Headline and summary",
      complete: Boolean(previewCv.headline && previewCv.summary),
    },
    {
      label: "Skills",
      helper: "Technical and role skills",
      complete: previewCv.skills.length >= 6,
    },
    {
      label: "Proof",
      helper: "Projects and certificates",
      complete:
        previewCv.projects.length > 0 &&
        previewCv.certifications.some((item) => item.courseName),
    },
    {
      label: "Impact",
      helper: "Experience and achievements",
      complete:
        previewCv.experience.length > 0 && previewCv.achievements.length > 0,
    },
  ]
  const sectionCompletion = Math.round(
    (sectionHealth.filter((item) => item.complete).length / sectionHealth.length) * 100
  )

  if (!activeWorkspace) {
    return null
  }

  function onSubmit(values: CVFormValues) {
    if (!activeWorkspace) {
      return
    }

    setIsSaving(true)

    updateCv({
      id: activeWorkspace.cv.id,
      headline: values.headline,
      summary: values.summary,
      education: values.education,
      skills: values.skills,
      experience: values.experienceText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      achievements: values.achievements,
      certifications: values.certifications.map((certification, index) => ({
        id:
          activeWorkspace.cv.certifications[index]?.id ??
          `certification-${index + 1}`,
        courseName: certification.courseName,
        issuer: certification.issuer,
        issuedAt: certification.issuedAt,
        credentialId: certification.credentialId,
      })),
      projects: values.projects.map((project, index) => ({
        id: activeWorkspace.cv.projects[index]?.id ?? `project-${index + 1}`,
        title: project.title,
        role: project.role,
        summary: project.summary,
        impact: project.impact,
        stack: project.stack,
        sourceCourseId: activeWorkspace.cv.projects[index]?.sourceCourseId,
      })),
    })

    toast.success("CV updated with the latest learning and career highlights.")
    setIsSaving(false)
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="CV builder"
        title="Turn Tetisol learning into visible career proof"
        description="Build a sharper CV using your courses, projects, skills, and certificates. The goal is not just a neat document, but a profile that reads as employable."
        action={
          <Button
            className="rounded-full px-5"
            onClick={() => {
              importLearningIntoCv()
              toast.success("Imported learning achievements into your CV.")
            }}
            type="button"
            variant="secondary"
          >
            <SparklesIcon className="size-4" />
            Import learning
          </Button>
        }
      />

      <form
        className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="premium-panel">
          <CardContent className="space-y-8 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  {...form.register("headline")}
                  placeholder="AI-focused product learner building practical internship-ready tools"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="summary">Professional summary</Label>
                <Textarea
                  className="min-h-32"
                  id="summary"
                  {...form.register("summary")}
                  placeholder="Summarize your strengths, direction, learning proof, and the impact you want to create."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  {...form.register("education")}
                  placeholder="BSc Computer Science, expected 2026"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Technical skills</Label>
                <Controller
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <TagInput
                      onChange={field.onChange}
                      placeholder="Next.js, SQL, Prompt Engineering..."
                      value={field.value}
                    />
                  )}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="experienceText">Experience highlights</Label>
                <Textarea
                  className="min-h-36"
                  id="experienceText"
                  {...form.register("experienceText")}
                  placeholder="Add one achievement per line. Course projects, leadership work, volunteering, and practical experiments all count."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Achievements / leadership</Label>
                <Controller
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <TagInput
                      onChange={field.onChange}
                      placeholder="Completed Prompt Engineering certificate, Led a team demo..."
                      value={field.value}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-slate-950">
                    Certifications
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">
                    Include Tetisol certificates and any other verified proof of learning.
                  </p>
                </div>
                <Button
                  onClick={() => certificationFields.append(createBlankCertification())}
                  type="button"
                  variant="outline"
                >
                  <PlusIcon className="size-4" />
                  Add certification
                </Button>
              </div>

              <div className="space-y-4">
                {certificationFields.fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="rounded-[1.5rem] border-border/80 bg-white/80"
                  >
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-heading text-xl font-semibold text-slate-950">
                          Certification {index + 1}
                        </h3>
                        {certificationFields.fields.length > 1 ? (
                          <Button
                            onClick={() => certificationFields.remove(index)}
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2Icon className="size-4" />
                            Remove
                          </Button>
                        ) : null}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`certification-name-${field.id}`}>Course name</Label>
                          <Input
                            id={`certification-name-${field.id}`}
                            {...form.register(`certifications.${index}.courseName`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`certification-issuer-${field.id}`}>Issuer</Label>
                          <Input
                            id={`certification-issuer-${field.id}`}
                            {...form.register(`certifications.${index}.issuer`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`certification-date-${field.id}`}>Issued at</Label>
                          <Input
                            id={`certification-date-${field.id}`}
                            {...form.register(`certifications.${index}.issuedAt`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`certification-id-${field.id}`}>Credential ID</Label>
                          <Input
                            id={`certification-id-${field.id}`}
                            {...form.register(`certifications.${index}.credentialId`)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-slate-950">
                    Projects
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">
                    Show evidence of execution. What you built matters more than what you say you know.
                  </p>
                </div>
                <Button
                  onClick={() => projectFields.append(createBlankProject())}
                  type="button"
                  variant="outline"
                >
                  <PlusIcon className="size-4" />
                  Add project
                </Button>
              </div>

              <div className="space-y-4">
                {projectFields.fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="rounded-[1.5rem] border-border/80 bg-white/80"
                  >
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-heading text-xl font-semibold text-slate-950">
                          Project {index + 1}
                        </h3>
                        {projectFields.fields.length > 1 ? (
                          <Button
                            onClick={() => projectFields.remove(index)}
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2Icon className="size-4" />
                            Remove
                          </Button>
                        ) : null}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`project-title-${field.id}`}>Title</Label>
                          <Input
                            id={`project-title-${field.id}`}
                            {...form.register(`projects.${index}.title`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-role-${field.id}`}>Role</Label>
                          <Input
                            id={`project-role-${field.id}`}
                            {...form.register(`projects.${index}.role`)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`project-summary-${field.id}`}>Summary</Label>
                          <Textarea
                            id={`project-summary-${field.id}`}
                            {...form.register(`projects.${index}.summary`)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`project-impact-${field.id}`}>Impact</Label>
                          <Textarea
                            id={`project-impact-${field.id}`}
                            {...form.register(`projects.${index}.impact`)}
                            placeholder="Quantify a result where possible."
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Stack</Label>
                          <Controller
                            control={form.control}
                            name={`projects.${index}.stack`}
                            render={({ field: stackField }) => (
                              <TagInput
                                onChange={stackField.onChange}
                                placeholder="React, Supabase, SQL..."
                                value={stackField.value}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {Object.keys(form.formState.errors).length ? (
              <div className="rounded-[1.25rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm leading-6 text-destructive">
                Fill in the missing sections before saving so the CV score can update cleanly.
              </div>
            ) : null}
            <Button
              className="h-11 w-full rounded-full"
              disabled={isSaving}
              type="submit"
            >
              Save CV
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {opportunityIntelligence ? (
            <Card className="premium-panel panel-shimmer">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="font-heading text-2xl text-slate-950">
                    AI career guidance
                  </CardTitle>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <SparklesIcon className="size-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.25rem] border border-primary/12 bg-primary/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    Next best action
                  </p>
                  <p className="mt-2 font-heading text-xl font-semibold text-slate-950">
                    {opportunityIntelligence.nextBestAction.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {opportunityIntelligence.nextBestAction.description}
                  </p>
                </div>
                {opportunityIntelligence.insights
                  .filter((item) => item.kind === "CV" || item.kind === "Certificate")
                  .slice(0, 2)
                  .map((item) => (
                    <div
                      className="rounded-[1.25rem] border border-border bg-white/75 px-4 py-3 text-sm leading-7 text-slate-600"
                      key={item.id}
                    >
                      <p className="font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-2">{item.description}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ) : null}

          <Card className="premium-panel">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="font-heading text-2xl text-slate-950">
                  CV signal health
                </CardTitle>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <RocketIcon className="size-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Section coverage</span>
                  <span>{sectionCompletion}%</span>
                </div>
                <Progress value={sectionCompletion} />
              </div>
              <div className="grid gap-3">
                {sectionHealth.map((section) => (
                  <div
                    key={section.label}
                    className="flex items-center justify-between rounded-[1.25rem] border border-border bg-white/75 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-950">{section.label}</p>
                      <p className="text-sm text-slate-500">{section.helper}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        section.complete
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {section.complete ? "Strong" : "Needs work"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="premium-panel">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="font-heading text-2xl text-slate-950">
                  Learning imports
                </CardTitle>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <SparklesIcon className="size-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.25rem] border border-border bg-white/75 p-4 text-sm leading-7 text-slate-600">
                {completedCourses.length} completed courses and {earnedCertificates.length} certificates can be pulled directly into this CV.
              </div>
              {missingLearningSkills.length ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-950">
                    Suggested skills from learning history
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {missingLearningSkills.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-primary/12 bg-primary/8 px-3 py-1.5 text-sm text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {unrepresentedCompletedCourses.length ? (
                <div className="rounded-[1.25rem] border border-border bg-white/75 p-4 text-sm leading-7 text-slate-600">
                  <p className="font-semibold text-slate-950">Unused course outcomes</p>
                  <p className="mt-2">
                    You completed {unrepresentedCompletedCourses[0].title}
                    {unrepresentedCompletedCourses[1]
                      ? ` and ${unrepresentedCompletedCourses[1].title}`
                      : ""}, but those outcomes are not clearly visible in the current CV yet.
                  </p>
                </div>
              ) : null}
              <Button
                className="w-full rounded-full"
                onClick={() => {
                  importLearningIntoCv()
                  toast.success("Imported learning achievements into your CV.")
                }}
                type="button"
                variant="secondary"
              >
                Import learning achievements
              </Button>
            </CardContent>
          </Card>

          <Card className="premium-panel">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="font-heading text-2xl text-slate-950">
                  Live score
                </CardTitle>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <FileCheck2Icon className="size-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Current CV quality</span>
                  <span>{evaluation.score}%</span>
                </div>
                <Progress value={evaluation.score} />
              </div>
              <div className="space-y-3">
                {evaluation.suggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    className="rounded-[1.25rem] border border-border bg-white/75 px-4 py-3 text-sm leading-6 text-slate-600"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="premium-panel">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="font-heading text-2xl text-slate-950">
                  Live preview
                </CardTitle>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <LightbulbIcon className="size-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 bg-white/75 p-6">
              <div>
                <h2 className="font-heading text-3xl font-semibold text-slate-950">
                  {previewCv.headline ||
                    activeWorkspace.profile.name ||
                    "Your headline"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {previewCv.summary ||
                    "Your summary will appear here as you write."}
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-slate-950">
                  Education
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {previewCv.education || "Add your education details."}
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-slate-950">
                  Skills
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {previewCv.skills.length ? (
                    previewCv.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-secondary px-3 py-1 text-sm text-slate-600"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Add skills to fill this section.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <AwardIcon className="size-4 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-slate-950">
                    Certifications
                  </h3>
                </div>
                <div className="space-y-3">
                  {previewCv.certifications.length ? (
                    previewCv.certifications.map((certification) => (
                      <div
                        key={certification.id}
                        className="rounded-[1.25rem] border border-border bg-white px-4 py-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-950">
                              {certification.courseName}
                            </p>
                            <p className="text-sm text-slate-500">
                              {certification.issuer}
                            </p>
                          </div>
                          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {certification.issuedAt}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                          Credential ID: {certification.credentialId}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Add certifications to show learning proof.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-slate-950">
                  Achievements
                </h3>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                  {previewCv.achievements.length ? (
                    previewCv.achievements.map((achievement) => (
                      <li key={achievement}>- {achievement}</li>
                    ))
                  ) : (
                    <li>- Add achievements that prove momentum and initiative.</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-slate-950">
                  Experience
                </h3>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                  {previewCv.experience.length ? (
                    previewCv.experience.map((item) => <li key={item}>- {item}</li>)
                  ) : (
                    <li>
                      - Add concise experience bullets to make your CV feel lived-in.
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-slate-950">
                  Projects
                </h3>
                <div className="mt-4 space-y-4">
                  {previewCv.projects.map((project, index) => (
                    <div
                      key={`${project.title}-${index}`}
                      className="rounded-[1.25rem] border border-border bg-white px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-950">
                          {project.title || `Project ${index + 1}`}
                        </p>
                        <p className="text-sm text-slate-500">
                          {project.role || "Add your role"}
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {project.summary ||
                          "Summarize what you built and why it mattered."}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {project.impact ||
                          "Describe the outcome or impact of the project."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}

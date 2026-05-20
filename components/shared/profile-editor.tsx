"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { PageIntro } from "@/components/shared/app-primitives"
import { TagInput } from "@/components/shared/tag-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const profileSchema = z.object({
  name: z.string().min(2),
  school: z.string().min(2),
  degree: z.string().min(2),
  location: z.string().min(2),
  bio: z.string().min(30),
  skills: z.array(z.string()).min(3),
  interests: z.array(z.string()).min(2),
  preferredRoles: z.array(z.string()).min(1),
  availability: z.string().min(2),
  preferredInternshipFields: z.array(z.string()).min(1),
  learningFocus: z.array(z.string()).min(1),
  careerGoals: z.array(z.string()).min(1),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfileEditor({
  mode,
}: {
  mode: "onboarding" | "profile"
}) {
  const router = useRouter()
  const { activeWorkspace, completeOnboarding, updateProfile } = useCareerHub()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: activeWorkspace?.profile.name ?? "",
      school: activeWorkspace?.profile.school ?? "",
      degree: activeWorkspace?.profile.degree ?? "",
      location: activeWorkspace?.profile.location ?? "",
      bio: activeWorkspace?.profile.bio ?? "",
      skills: activeWorkspace?.profile.skills ?? [],
      interests: activeWorkspace?.profile.interests ?? [],
      preferredRoles: activeWorkspace?.profile.preferredRoles ?? [],
      availability: activeWorkspace?.profile.availability ?? "Immediate",
      preferredInternshipFields: activeWorkspace?.profile.preferredInternshipFields ?? [],
      learningFocus: activeWorkspace?.profile.learningFocus ?? [],
      careerGoals: activeWorkspace?.profile.careerGoals ?? [],
    },
  })

  useEffect(() => {
    if (!activeWorkspace) {
      return
    }

    form.reset({
      name: activeWorkspace.profile.name,
      school: activeWorkspace.profile.school,
      degree: activeWorkspace.profile.degree,
      location: activeWorkspace.profile.location,
      bio: activeWorkspace.profile.bio,
      skills: activeWorkspace.profile.skills,
      interests: activeWorkspace.profile.interests,
      preferredRoles: activeWorkspace.profile.preferredRoles,
      availability: activeWorkspace.profile.availability,
      preferredInternshipFields: activeWorkspace.profile.preferredInternshipFields,
      learningFocus: activeWorkspace.profile.learningFocus,
      careerGoals: activeWorkspace.profile.careerGoals,
    })
  }, [activeWorkspace, form])

  function onSubmit(values: ProfileValues) {
    setIsSaving(true)

    if (mode === "onboarding") {
      completeOnboarding(values)
      toast.success("Profile complete. Your learning and career recommendations are ready.")
      router.push("/dashboard")
    } else {
      updateProfile(values)
      toast.success("Profile updated successfully.")
    }

    setIsSaving(false)
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={mode === "onboarding" ? "Onboarding" : "Profile"}
        title={
          mode === "onboarding"
            ? "Tell Tetisol what you want to learn and where you want to go"
            : "Keep your learner and career profile current"
        }
        description={
          mode === "onboarding"
            ? "We use your background, interests, learning focus, and internship direction to personalize courses, recommendations, certificates, and career support."
            : "Update your profile so course suggestions, internship matching, and CV recommendations stay aligned with your latest goals."
        }
      />

      <form className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="glass-card rounded-[1.75rem] border-white/80">
          <CardContent className="grid gap-5 p-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Input id="school" {...form.register("school")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree / Program</Label>
              <Input id="degree" {...form.register("degree")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Professional summary</Label>
              <Textarea
                className="min-h-32"
                id="bio"
                {...form.register("bio")}
                placeholder="What are you learning, what are you good at, and what kind of career direction are you building toward?"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                {...form.register("availability")}
                placeholder="Available from June 2026"
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
                    placeholder="React, SQL, Prompt Engineering..."
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Career interests</Label>
              <Controller
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="AI, Web Development, Analytics..."
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred roles</Label>
              <Controller
                control={form.control}
                name="preferredRoles"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Frontend Intern, Data Intern..."
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred internship fields</Label>
              <Controller
                control={form.control}
                name="preferredInternshipFields"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="AI, Engineering, Security..."
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Learning focus</Label>
              <Controller
                control={form.control}
                name="learningFocus"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Prompt Engineering, Web Development..."
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Career goals</Label>
              <Controller
                control={form.control}
                name="careerGoals"
                render={({ field }) => (
                  <TagInput
                    onChange={field.onChange}
                    placeholder="Earn a certificate, land an internship, strengthen my portfolio..."
                    value={field.value}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-[1.75rem] border-white/80">
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-slate-950">
                Recommendation fuel
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                A richer profile gives Tetisol better context for course recommendations, internship matching, certificate relevance, and CV guidance.
              </p>
            </div>
            <ul className="space-y-3 text-sm leading-7 text-slate-600">
              <li>Use exact skill names you want to be found for.</li>
              <li>List learning categories you genuinely want to go deeper in.</li>
              <li>Describe career goals in terms of outcomes, not only titles.</li>
              <li>Keep this updated as you complete courses and shift focus.</li>
            </ul>
            {Object.keys(form.formState.errors).length ? (
              <div className="rounded-[1.25rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm leading-6 text-destructive">
                Please complete the required fields and add the missing tags before saving.
              </div>
            ) : null}
            <Button className="h-11 w-full rounded-full" disabled={isSaving} type="submit">
              {mode === "onboarding"
                ? "Finish onboarding"
                : "Save profile changes"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

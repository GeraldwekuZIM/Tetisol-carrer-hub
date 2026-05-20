"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeftIcon,
  BookOpenIcon,
  LockKeyholeIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { DemoPersona } from "@/types"

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2),
})

type SignInValues = z.infer<typeof signInSchema>
type SignUpValues = z.infer<typeof signUpSchema>

export function AuthPanel() {
  const router = useRouter()
  const { signIn, signUp, hasSupabase, demoPersonas } = useCareerHub()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [isPending, setIsPending] = useState(false)

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "demo@tetisol.com",
      password: "careerhub",
    },
  })

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  })

  function completeSignIn(email: string, password: string) {
    setIsPending(true)
    startTransition(() => {
      void signIn(email, password).then((result) => {
        setIsPending(false)
        if (!result.success) {
          toast.error(result.message)
          return
        }

        toast.success(result.message)
        router.push("/dashboard")
      })
    })
  }

  function onSignIn(values: SignInValues) {
    completeSignIn(values.email, values.password)
  }

  function onSignUp(values: SignUpValues) {
    setIsPending(true)
    startTransition(() => {
      void signUp(values.fullName, values.email, values.password).then(
        (result) => {
          setIsPending(false)
          if (!result.success) {
            toast.error(result.message)
            return
          }

          toast.success(result.message)
          router.push("/onboarding")
        }
      )
    })
  }

  function handlePersonaAccess(persona: DemoPersona) {
    setMode("signin")
    signInForm.setValue("email", persona.email, { shouldValidate: true })
    signInForm.setValue("password", persona.password, { shouldValidate: true })

    if (!hasSupabase) {
      completeSignIn(persona.email, persona.password)
    }
  }

  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-12">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card rounded-[2.25rem] p-8 text-slate-950">
          <Link
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "mb-8 w-fit rounded-full px-0 text-slate-600",
              })
            )}
            href="/"
          >
            <ArrowLeftIcon className="size-4" />
            Back to home
          </Link>
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <BookOpenIcon className="size-4" />
              Tetisol Learning + Career Platform
            </div>
            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
                Learn practical skills, earn proof, and move toward real opportunities
              </h1>
              <p className="text-base leading-8 text-slate-600">
                Sign in to manage courses, lessons, certificates, internships, application tracking, and your CV from one connected Tetisol workspace.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Browse structured AI and tech courses",
                "Track lessons, progress, notes, and assessments",
                "Earn certificates that feed your learner profile",
                "Connect learning outcomes to internships and CV growth",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-border bg-white/85 p-4 text-sm leading-7 text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>

            {!hasSupabase ? (
              <div className="futuristic-shell panel-shimmer overflow-hidden rounded-[1.75rem] border border-primary/12 bg-slate-950 p-6 text-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.72)]">
                <div className="ambient-grid absolute inset-0 opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_26%)]" />
                <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sky-200">
                      <SparklesIcon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
                        Demo mission states
                      </p>
                      <h2 className="mt-1 font-heading text-2xl font-semibold text-white">
                        Open a fully seeded learner journey in one click
                      </h2>
                    </div>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-slate-300">
                    These workspaces are preloaded with realistic progress, certificates, CV quality, reminders, and opportunity states so the platform feels alive before backend wiring is complete.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {demoPersonas.map((persona) => (
                      <button
                        className="hover-signal rounded-[1.4rem] border border-white/10 bg-white/8 p-4 text-left transition hover:border-sky-300/20 hover:bg-white/12"
                        key={persona.id}
                        onClick={() => handlePersonaAccess(persona)}
                        type="button"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                              {persona.state}
                            </p>
                            <h3 className="mt-2 font-heading text-xl font-semibold text-white">
                              {persona.fullName}
                            </h3>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-sky-100">
                            Open
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {persona.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {persona.focus.slice(0, 3).map((focus) => (
                            <span
                              className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-slate-200"
                              key={focus}
                            >
                              {focus}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4 text-sm leading-7 text-slate-300">
                    Internal CMS demo access: <strong className="text-white">admin@tetisol.com</strong> / <strong className="text-white">careerhub</strong>.
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <Card className="glass-card rounded-[2.25rem] border-white/80">
          <CardHeader className="space-y-4 px-8 pt-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Access your workspace
                </p>
                <CardTitle className="mt-3 font-heading text-3xl text-slate-950">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </CardTitle>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <LockKeyholeIcon className="size-5" />
              </div>
            </div>
            <div className="grid grid-cols-2 rounded-full bg-secondary p-1">
              <button
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  mode === "signin"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                )}
                onClick={() => setMode("signin")}
                type="button"
              >
                Sign in
              </button>
              <button
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  mode === "signup"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                )}
                onClick={() => setMode("signup")}
                type="button"
              >
                Sign up
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            {mode === "signin" ? (
              <form
                className="space-y-5"
                onSubmit={signInForm.handleSubmit(onSignIn)}
              >
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    {...signInForm.register("email")}
                    placeholder="student@example.com"
                  />
                  {signInForm.formState.errors.email ? (
                    <p className="text-sm text-destructive">
                      {signInForm.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    {...signInForm.register("password")}
                    placeholder="At least 6 characters"
                  />
                  {signInForm.formState.errors.password ? (
                    <p className="text-sm text-destructive">
                      {signInForm.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>
                {!hasSupabase ? (
                  <div className="rounded-[1.25rem] border border-primary/15 bg-primary/8 p-4 text-sm leading-7 text-slate-600">
                    Demo mode is active. Use any seeded learner persona, or sign in manually with <strong>demo@tetisol.com</strong> / <strong>careerhub</strong>. Internal admin access uses <strong>admin@tetisol.com</strong> / <strong>careerhub</strong>.
                  </div>
                ) : null}
                <Button
                  className="h-11 w-full rounded-full"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? "Signing you in..." : "Continue to workspace"}
                </Button>
              </form>
            ) : (
              <form
                className="space-y-5"
                onSubmit={signUpForm.handleSubmit(onSignUp)}
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full name</Label>
                  <Input
                    id="signup-name"
                    {...signUpForm.register("fullName")}
                    placeholder="Your full name"
                  />
                  {signUpForm.formState.errors.fullName ? (
                    <p className="text-sm text-destructive">
                      {signUpForm.formState.errors.fullName.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    {...signUpForm.register("email")}
                    placeholder="student@example.com"
                  />
                  {signUpForm.formState.errors.email ? (
                    <p className="text-sm text-destructive">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    {...signUpForm.register("password")}
                    placeholder="Choose a secure password"
                  />
                  {signUpForm.formState.errors.password ? (
                    <p className="text-sm text-destructive">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>
                <div className="rounded-[1.25rem] border border-border bg-secondary/70 p-4 text-sm leading-7 text-slate-600">
                  <div className="mb-2 inline-flex items-center gap-2 font-semibold text-slate-950">
                    <TargetIcon className="size-4 text-primary" />
                    What happens next
                  </div>
                  Create an account, complete onboarding, choose your learning direction, and Tetisol will start shaping course, CV, and internship guidance around your profile.
                </div>
                <Button
                  className="h-11 w-full rounded-full"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? "Creating account..." : "Create account"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

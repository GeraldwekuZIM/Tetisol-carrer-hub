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
  TargetIcon,
} from "lucide-react"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

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
  const { signIn, signUp, hasSupabase } = useCareerHub()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [isPending, setIsPending] = useState(false)

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
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
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
                Supabase environment variables are not available in this build. Add
                <strong> NEXT_PUBLIC_SUPABASE_URL</strong> and
                <strong> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</strong> locally and on Netlify
                before presenting this login flow.
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
                  <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                    Backend configuration is missing for this environment. Sign-in is disabled until Supabase env variables are configured.
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

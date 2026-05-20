"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Quiz, QuizAttempt } from "@/types"

export function QuizCard({
  quiz,
  lastAttempt,
  onSubmit,
}: {
  quiz: Quiz
  lastAttempt?: QuizAttempt
  onSubmit: (answers: Record<string, string>) => void
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    lastAttempt?.answers ?? {}
  )

  const answeredCount = useMemo(
    () => Object.keys(answers).filter((key) => answers[key]).length,
    [answers]
  )

  return (
    <Card className="rounded-[1.75rem] border-primary/15 bg-primary/5">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Assessment
            </p>
            <CardTitle className="mt-3 font-heading text-2xl text-slate-950">
              {quiz.title}
            </CardTitle>
          </div>
          {lastAttempt ? (
            <div className="rounded-[1.25rem] bg-white px-4 py-3 text-right shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Last score
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {lastAttempt.score}%
              </p>
            </div>
          ) : null}
        </div>
        <p className="text-sm leading-7 text-slate-600">{quiz.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>Answered</span>
            <span>
              {answeredCount}/{quiz.questions.length}
            </span>
          </div>
          <Progress value={(answeredCount / quiz.questions.length) * 100} />
        </div>

        <div className="space-y-5">
          {quiz.questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5"
            >
              <p className="font-medium text-slate-950">
                {questionIndex + 1}. {question.prompt}
              </p>
              <div className="mt-4 space-y-2">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option
                  return (
                    <label
                      key={option}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-[1rem] border px-4 py-3 text-sm transition",
                        selected
                          ? "border-primary bg-primary/8 text-slate-950"
                          : "border-border bg-white text-slate-600 hover:border-primary/20 hover:bg-primary/5"
                      )}
                    >
                      <input
                        checked={selected}
                        className="mt-1"
                        name={question.id}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: option,
                          }))
                        }
                        type="radio"
                      />
                      <span>{option}</span>
                    </label>
                  )
                })}
              </div>
              {lastAttempt?.passed ? (
                <div className="mt-4 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
                  <Label className="mb-2 block text-emerald-900">
                    Why the correct answer matters
                  </Label>
                  {question.explanation}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <Button
          className="w-full rounded-full"
          disabled={answeredCount !== quiz.questions.length}
          onClick={() => onSubmit(answers)}
          type="button"
        >
          Submit assessment
        </Button>
      </CardContent>
    </Card>
  )
}

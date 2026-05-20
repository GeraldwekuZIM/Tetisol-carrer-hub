import { howItWorksSteps } from "@/components/marketing/marketing-data"
import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent } from "@/components/ui/card"

export function HowItWorksSection() {
  return (
    <section className="section-shell mt-24 scroll-mt-28" id="how-it-works">
      <SectionHeading
        description="The Tetisol flow is intentionally simple so learners can move from setup into real progress without fighting the platform."
        eyebrow="How It Works"
        title="Three focused steps from profile setup to employability momentum"
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {howItWorksSteps.map((step, index) => (
          <Card
            key={step.title}
            className="glass-card group rounded-[1.85rem] border-white/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-36px_rgba(79,70,229,0.55)]"
          >
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_18px_36px_-26px_rgba(79,70,229,0.9)]">
                  <step.icon className="size-5" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Step {index + 1}
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="font-heading text-2xl font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="text-base leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-border bg-white/80 p-4 text-sm leading-7 text-slate-600 transition-colors duration-300 group-hover:bg-primary/6">
                {step.detail}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

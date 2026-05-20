import { features } from "@/components/marketing/marketing-data"
import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  return (
    <section className="section-shell mt-24 scroll-mt-28" id="features">
      <SectionHeading
        description="Tetisol is designed around the real problems that slow learners down: disconnected courses, weak proof of skills, scattered internship search, and CVs that do not reflect growth."
        eyebrow="Features"
        title="A connected system for learning, proving progress, and getting career-ready"
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="glass-card rounded-[1.75rem] border-white/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-36px_rgba(79,70,229,0.6)]"
          >
            <CardHeader className="space-y-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_16px_30px_-24px_rgba(79,70,229,0.8)]">
                <feature.icon className="size-5" />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {feature.stat}
                </p>
                <CardTitle className="font-heading text-2xl text-slate-950">
                  {feature.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-600">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

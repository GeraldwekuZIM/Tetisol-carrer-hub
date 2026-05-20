import { learningOutcomeProof } from "@/components/marketing/marketing-data"
import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent } from "@/components/ui/card"

export function OutcomesSection() {
  return (
    <section className="section-shell mt-24 scroll-mt-28" id="learning-outcomes">
      <SectionHeading
        description="Tetisol is not positioned as a content dump. It is a structured platform for building confidence, visible proof, and career readiness over time."
        eyebrow="Learning Outcomes"
        title="Certificates, progress, and employability signals built into the product"
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {learningOutcomeProof.map((item) => (
          <Card
            key={item.title}
            className="glass-card rounded-[1.85rem] border-white/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-36px_rgba(79,70,229,0.5)]"
          >
            <CardContent className="space-y-5 p-6">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_18px_36px_-26px_rgba(79,70,229,0.9)]">
                <item.icon className="size-5" />
              </div>
              <div className="space-y-3">
                <h3 className="font-heading text-2xl font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="text-base leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

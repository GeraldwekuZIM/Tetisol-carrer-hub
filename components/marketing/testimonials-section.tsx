import { testimonials } from "@/components/marketing/marketing-data"
import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent } from "@/components/ui/card"

const proofMetrics = [
  {
    label: "Learning plus career",
    value: "One connected journey",
  },
  {
    label: "Certificate-ready",
    value: "Assessment-backed proof",
  },
  {
    label: "More employable",
    value: "Projects, CV, internships",
  },
] as const

export function TestimonialsSection() {
  return (
    <section className="section-shell mt-24 scroll-mt-28" id="stories">
      <SectionHeading
        align="center"
        description="Believable placeholder feedback from the kind of users Tetisol is built to support: learners trying to gain practical skills and move toward work with more confidence."
        eyebrow="Stories And Proof"
        title="Early-user style validation for a learning platform with real career value"
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {testimonials.map((item) => (
          <Card
            key={item.name}
            className="glass-card rounded-[1.75rem] border-white/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-36px_rgba(79,70,229,0.5)]"
          >
            <CardContent className="space-y-5 p-6">
              <p className="text-base leading-8 text-slate-700">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="rounded-[1.25rem] border border-border bg-white/75 p-4">
                <p className="font-heading text-lg font-semibold text-slate-950">
                  {item.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">{item.role}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                  {item.school}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {proofMetrics.map((item) => (
          <div
            key={item.label}
            className="rounded-[1.5rem] border border-white/80 bg-white/80 px-5 py-5 text-center shadow-[0_20px_50px_-34px_rgba(79,70,229,0.45)] backdrop-blur transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {item.label}
            </p>
            <p className="mt-3 font-heading text-2xl font-semibold text-slate-950">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

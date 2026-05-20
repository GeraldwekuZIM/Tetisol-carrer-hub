import { featuredCategories } from "@/components/marketing/marketing-data"
import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent } from "@/components/ui/card"

export function CourseCategoriesSection() {
  return (
    <section className="section-shell mt-24 scroll-mt-28" id="course-categories">
      <SectionHeading
        description="Tetisol combines modern AI and technology learning paths with structured outcomes. The platform is designed to feel credible enough for universities, partners, and ambitious learners."
        eyebrow="Featured Categories"
        title="Learn the skills employers and internship teams keep asking for"
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featuredCategories.map((category) => (
          <Card
            key={category.title}
            className="glass-card rounded-[1.75rem] border-white/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-36px_rgba(79,70,229,0.55)]"
          >
            <CardContent className="space-y-4 p-6">
              <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                {category.count} live track{category.count === 1 ? "" : "s"}
              </div>
              <div className="space-y-3">
                <h3 className="font-heading text-2xl font-semibold text-slate-950">
                  {category.title}
                </h3>
                <p className="text-base leading-7 text-slate-600">
                  {category.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

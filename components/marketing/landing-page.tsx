import { CourseCategoriesSection } from "@/components/marketing/course-categories-section"
import { DashboardPreviewSection } from "@/components/marketing/dashboard-preview-section"
import { FeaturesSection } from "@/components/marketing/features-section"
import { HeroSection } from "@/components/marketing/hero-section"
import { HowItWorksSection } from "@/components/marketing/how-it-works-section"
import { LandingFooter } from "@/components/marketing/landing-footer"
import { LandingHeader } from "@/components/marketing/landing-header"
import { OutcomesSection } from "@/components/marketing/outcomes-section"
import { TestimonialsSection } from "@/components/marketing/testimonials-section"

export function LandingPage() {
  return (
    <div className="relative overflow-hidden pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_12%_18%,rgba(99,102,241,0.2),transparent_22%),radial-gradient(circle_at_88%_12%,rgba(14,165,233,0.18),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.72),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[38rem] h-px bg-linear-to-r from-transparent via-primary/18 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-[92rem] h-px bg-linear-to-r from-transparent via-sky-400/18 to-transparent" />

      <LandingHeader />

      <main className="relative">
        <HeroSection />
        <CourseCategoriesSection />
        <FeaturesSection />
        <OutcomesSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <TestimonialsSection />
      </main>

      <LandingFooter />
    </div>
  )
}

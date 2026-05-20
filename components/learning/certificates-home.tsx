"use client"

import { AwardIcon } from "lucide-react"

import { CertificateCard } from "@/components/learning/certificate-card"
import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro, StatCard } from "@/components/shared/app-primitives"

export function CertificatesHome() {
  const { activeWorkspace, earnedCertificates, state } = useCareerHub()

  if (!activeWorkspace) {
    return null
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Certificates"
        title="Collect proof of learning that feeds your career story"
        description="Your Tetisol certificates are designed to become part of your learner profile, CV, and employability narrative."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          helper="Certificates ready to share soon"
          icon={AwardIcon}
          label="Earned"
          value={`${earnedCertificates.length}`}
        />
        <StatCard
          helper="Assessment-backed course completions"
          icon={AwardIcon}
          label="Verified"
          value={`${earnedCertificates.length}`}
        />
        <StatCard
          helper="Learning evidence connected to your profile"
          icon={AwardIcon}
          label="Career-ready"
          value="Aligned"
        />
      </div>

      {earnedCertificates.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {earnedCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              course={state.courses.find((course) => course.id === certificate.courseId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          className="rounded-[1.75rem]"
          description="Complete a course and pass its assessment to unlock your first Tetisol certificate."
          icon={AwardIcon}
          title="No certificates yet"
        />
      )}
    </div>
  )
}

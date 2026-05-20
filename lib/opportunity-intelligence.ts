import {
  getCompletedCourses,
  getCourseProgress,
  getEnrollment,
  getInProgressCourses,
} from "@/lib/learning"
import type {
  Course,
  CourseMatch,
  Internship,
  InternshipMatch,
  OpportunityIntelligence,
  IntelligenceInsight,
  NextBestAction,
  UserWorkspace,
} from "@/types"

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function buildCoachCopy(state: OpportunityIntelligence["learnerState"]) {
  if (state === "Career-ready learner") {
    return {
      title: "Tetisol AI Coach: You are close to conversion",
      summary:
        "Your learning proof is strong enough that the biggest gains now come from targeted applications, sharper CV positioning, and faster follow-through on deadlines.",
    }
  }

  if (state === "Almost-certified learner") {
    return {
      title: "Tetisol AI Coach: One more push unlocks proof",
      summary:
        "You are close to turning effort into visible proof. Finishing an almost-complete course will strengthen both your profile and the quality of your internship matches.",
    }
  }

  if (state === "Stalled learner") {
    return {
      title: "Tetisol AI Coach: Momentum needs a reset",
      summary:
        "Your direction is still strong, but Tetisol is seeing slowdown signals. A short return to one active course can quickly improve learning momentum and recommendation quality.",
    }
  }

  if (state === "Active learner") {
    return {
      title: "Tetisol AI Coach: Keep compounding the signal",
      summary:
        "You already have real movement across learning and career preparation. The best next step is to keep stacking proof instead of starting too many new tracks.",
    }
  }

  return {
    title: "Tetisol AI Coach: Start the first signal loop",
    summary:
      "Tetisol works best once you create one full cycle: enroll, complete a course, earn proof, improve the CV, and translate that into internship action.",
  }
}

export function getOpportunityIntelligence({
  courses,
  internships,
  recommendedCourses,
  recommendedInternships,
  workspace,
}: {
  courses: Course[]
  internships: Internship[]
  recommendedCourses: CourseMatch[]
  recommendedInternships: InternshipMatch[]
  workspace: UserWorkspace | null
}): OpportunityIntelligence {
  if (!workspace) {
    return {
      learnerState: "New learner",
      readinessScore: 0,
      momentumLabel: "Waiting for profile setup",
      matchingInternshipCount: 0,
      certificateOpportunityCount: 0,
      coachTitle: "Tetisol AI Coach: Build your first signal",
      coachSummary:
        "Complete onboarding and start one course so Tetisol can personalize your path into skills, certificates, and internships.",
      nextBestAction: {
        id: "action-onboarding",
        title: "Complete onboarding",
        description: "Add your interests, skills, and location so Tetisol can personalize the platform.",
        ctaLabel: "Finish setup",
        href: "/onboarding",
        tone: "opportunity",
        badge: "First step",
      },
      insights: [],
      alerts: [],
    }
  }

  const enrolledCourses = workspace.enrollments
    .map((enrollment) => courses.find((course) => course.id === enrollment.courseId))
    .filter((course): course is Course => Boolean(course))
  const inProgressCourses = getInProgressCourses(courses, workspace)
  const completedCourses = getCompletedCourses(courses, workspace)
  const certificatesMissingFromCv = workspace.certificates.filter(
    (certificate) =>
      !workspace.cv.certifications.some(
        (entry) => entry.credentialId === certificate.certificateNumber
      )
  )
  const urgentApplications = workspace.applications
    .filter((application) => application.deadline && daysUntil(application.deadline) <= 5)
    .sort((left, right) => left.deadline.localeCompare(right.deadline))
  const strongMatches = recommendedInternships.filter((item) => item.matchScore >= 68)
  const stalledCourses = inProgressCourses.filter((course) => {
    const enrollment = getEnrollment(workspace, course.id)
    if (!enrollment?.lastActivityAt) {
      return false
    }

    return daysUntil(enrollment.lastActivityAt) < -7
  })
  const almostCertifiedCourses = inProgressCourses.filter((course) => {
    const progress = getCourseProgress(course, getEnrollment(workspace, course.id))
    const hasCertificate = workspace.certificates.some(
      (certificate) => certificate.courseId === course.id
    )
    return course.certificateAvailable && progress.progressPercent >= 75 && !hasCertificate
  })
  const savedInternshipRecords = internships.filter((internship) =>
    workspace.savedInternshipIds.includes(internship.id)
  )
  const recommendedCourse = recommendedCourses[0]
  const topMatch = strongMatches[0] ?? recommendedInternships[0]

  let learnerState: OpportunityIntelligence["learnerState"] = "New learner"
  if (
    completedCourses.length >= 2 &&
    workspace.certificates.length >= 2 &&
    workspace.cv.score >= 88 &&
    workspace.applications.length >= 1
  ) {
    learnerState = "Career-ready learner"
  } else if (almostCertifiedCourses.length > 0) {
    learnerState = "Almost-certified learner"
  } else if (stalledCourses.length > 0) {
    learnerState = "Stalled learner"
  } else if (enrolledCourses.length > 0) {
    learnerState = "Active learner"
  }

  const readinessScore = clamp(
    Math.round(
      completedCourses.length * 10 +
        workspace.certificates.length * 12 +
        workspace.applications.length * 8 +
        workspace.cv.score * 0.45 +
        strongMatches.length * 4
    ),
    0,
    100
  )

  const momentumLabel =
    learnerState === "Career-ready learner"
      ? "Conversion mode"
      : learnerState === "Almost-certified learner"
        ? "Proof almost unlocked"
        : learnerState === "Stalled learner"
          ? "Momentum cooling"
          : learnerState === "Active learner"
            ? "Compounding steadily"
            : "Ready to begin"

  const coachCopy = buildCoachCopy(learnerState)

  const insights: IntelligenceInsight[] = []
  const alerts: IntelligenceInsight[] = []

  if (strongMatches.length) {
    insights.push({
      id: "insight-opportunity-matches",
      kind: "Opportunity",
      tone: "opportunity",
      title: `${strongMatches.length} internships already align with your signal`,
      description:
        topMatch
          ? `${topMatch.title} stands out because it overlaps with your recent skills and interests.`
          : "Tetisol is surfacing several roles with stronger-than-average fit.",
      badge: `${strongMatches.length} strong matches`,
      href: "/internships",
    })
  }

  if (almostCertifiedCourses.length) {
    const course = almostCertifiedCourses[0]
    const progress = getCourseProgress(course, getEnrollment(workspace, course.id))
    insights.push({
      id: "insight-certificate-opportunity",
      kind: "Certificate",
      tone: "positive",
      title: `${course.title} is close to certificate-ready`,
      description: `You are ${progress.progressPercent}% through the course. Finishing it will upgrade your profile proof immediately.`,
      badge: `${progress.progressPercent}% complete`,
      href: `/learning/${course.slug}`,
    })
  }

  if (certificatesMissingFromCv.length) {
    insights.push({
      id: "insight-cert-import",
      kind: "CV",
      tone: "warning",
      title: `${certificatesMissingFromCv.length} certificates are not visible in your CV`,
      description:
        "Importing completed certificates into the CV builder will strengthen your story and make your learning easier to trust.",
      badge: "CV upgrade",
      href: "/cv-builder",
    })
  }

  if (savedInternshipRecords.length && recommendedCourse) {
    insights.push({
      id: "insight-course-to-role",
      kind: "AI Coach",
      tone: "neutral",
      title: `${recommendedCourse.title} could strengthen saved opportunities`,
      description:
        "Tetisol sees overlap between your saved internships and this course's skills, which means one learning step could improve several applications at once.",
      badge: "Course to role",
      href: `/courses/${recommendedCourse.slug}`,
    })
  }

  if (workspace.cv.score < 82) {
    alerts.push({
      id: "alert-cv-attention",
      kind: "CV",
      tone: "warning",
      title: "Your CV still needs stronger proof",
      description:
        "One or more sections are underpowered. Import learning evidence, tighten achievements, and make at least one project impact measurable.",
      badge: `${workspace.cv.score}% score`,
      href: "/cv-builder",
    })
  }

  if (stalledCourses.length) {
    alerts.push({
      id: "alert-stalled-learning",
      kind: "Momentum",
      tone: "urgent",
      title: `${stalledCourses[0].title} looks stalled`,
      description:
        "Tetisol has not seen recent activity on an in-progress course. Restarting one lesson can restore momentum and improve recommendations.",
      badge: "Needs attention",
      href: `/learning/${stalledCourses[0].slug}`,
    })
  }

  if (urgentApplications.length) {
    const application = urgentApplications[0]
    const internship = internships.find((item) => item.id === application.internshipId)
    alerts.push({
      id: "alert-deadline",
      kind: "Deadline",
      tone: "urgent",
      title: `${internship?.title ?? "Application"} deadline is approaching`,
      description:
        application.deadline
          ? `This opportunity is due in ${daysUntil(application.deadline)} day(s). Prioritize submission quality and follow-through.`
          : "A tracked application needs timely follow-up.",
      badge: application.deadline,
      href: "/applications",
    })
  }

  if (!alerts.length) {
    alerts.push({
      id: "alert-steady-state",
      kind: "AI Coach",
      tone: "positive",
      title: "No urgent blockers detected",
      description:
        "Your current path looks stable. Keep focusing on one meaningful learning step and one opportunity step at a time.",
      badge: "Stable",
      href: "/dashboard",
    })
  }

  const nextBestAction: NextBestAction = (() => {
    if (urgentApplications.length) {
      const internship = internships.find(
        (item) => item.id === urgentApplications[0].internshipId
      )
      return {
        id: "next-application-deadline",
        title: `Prepare ${internship?.title ?? "your application"} before the deadline`,
        description:
          "The biggest immediate return is protecting a near-term opportunity that already matches your direction.",
        ctaLabel: "Open applications",
        href: "/applications",
        tone: "urgent",
        badge: urgentApplications[0].deadline,
      }
    }

    if (stalledCourses.length) {
      return {
        id: "next-resume-stalled-course",
        title: `Resume ${stalledCourses[0].title}`,
        description:
          "This is the fastest way to restore learning momentum and keep recommendations from going stale.",
        ctaLabel: "Resume learning",
        href: `/learning/${stalledCourses[0].slug}`,
        tone: "warning",
        badge: "Momentum reset",
      }
    }

    if (almostCertifiedCourses.length) {
      return {
        id: "next-finish-certificate-course",
        title: `Finish ${almostCertifiedCourses[0].title}`,
        description:
          "Completing one almost-finished course will unlock visible proof and strengthen your CV immediately.",
        ctaLabel: "Complete course",
        href: `/learning/${almostCertifiedCourses[0].slug}`,
        tone: "positive",
        badge: "Certificate close",
      }
    }

    if (certificatesMissingFromCv.length) {
      return {
        id: "next-import-certificates",
        title: "Import completed certificates into your CV",
        description:
          "You already earned the proof. The next gain is making it visible to recruiters and internship reviewers.",
        ctaLabel: "Open CV builder",
        href: "/cv-builder",
        tone: "opportunity",
        badge: "Quick win",
      }
    }

    if (workspace.cv.score < 82) {
      return {
        id: "next-improve-cv",
        title: "Strengthen your CV before you apply wider",
        description:
          "A better summary, stronger project impact, and visible certificates will improve the quality of each application.",
        ctaLabel: "Improve CV",
        href: "/cv-builder",
        tone: "warning",
        badge: "Needs attention",
      }
    }

    if (topMatch) {
      return {
        id: "next-explore-top-match",
        title: `Review ${topMatch.title}`,
        description:
          "Tetisol sees a strong opportunity match based on your current skills, interests, and recent learning direction.",
        ctaLabel: "View internship",
        href: `/internships/${topMatch.slug}`,
        tone: "opportunity",
        badge: `${topMatch.matchScore}% fit`,
      }
    }

    if (recommendedCourse) {
      return {
        id: "next-enroll-course",
        title: `Enroll in ${recommendedCourse.title}`,
        description:
          "This course is the clearest next step for improving your skill graph and unlocking better career outcomes.",
        ctaLabel: "View course",
        href: `/courses/${recommendedCourse.slug}`,
        tone: "opportunity",
        badge: "Recommended",
      }
    }

    return {
      id: "next-general-learning",
      title: "Explore the course catalog",
      description:
        "A strong Tetisol journey starts when one course begins feeding the rest of the platform.",
      ctaLabel: "Browse courses",
      href: "/courses",
      tone: "neutral",
      badge: "Start here",
    }
  })()

  return {
    learnerState,
    readinessScore,
    momentumLabel,
    matchingInternshipCount: strongMatches.length,
    certificateOpportunityCount: almostCertifiedCourses.length,
    coachTitle: coachCopy.title,
    coachSummary: coachCopy.summary,
    nextBestAction,
    insights: insights.slice(0, 4),
    alerts: alerts.slice(0, 3),
  }
}

export function getCourseOpportunityPreview({
  course,
  internships,
  workspace,
}: {
  course: Course
  internships: Internship[]
  workspace: UserWorkspace | null
}) {
  const overlappingInternships = internships
    .map((internship) => {
      const sharedSkills = internship.skills.filter((skill) =>
        course.skills.some(
          (courseSkill) => normalize(courseSkill) === normalize(skill)
        )
      )
      const sharedFocus = internship.interests.filter((interest) =>
        course.internshipFocus.some(
          (focus) => normalize(focus).includes(normalize(interest)) || normalize(interest).includes(normalize(focus))
        )
      )
      return {
        internship,
        score: sharedSkills.length * 2 + sharedFocus.length * 3,
        signals: unique([...sharedSkills, ...sharedFocus]),
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)

  const progress = getCourseProgress(course, getEnrollment(workspace, course.id))
  const hasCertificate = workspace?.certificates.some(
    (certificate) => certificate.courseId === course.id
  )

  return {
    matchingRoleCount: overlappingInternships.length,
    suggestedSignals: unique(overlappingInternships.flatMap((item) => item.signals)).slice(0, 5),
    topInternships: overlappingInternships.slice(0, 3).map((item) => item.internship),
    statusLabel: hasCertificate
      ? "Certificate earned"
      : progress.progressPercent >= 75
        ? "Almost complete"
        : progress.progressPercent > 0
          ? "In progress"
          : "Ready to start",
  }
}

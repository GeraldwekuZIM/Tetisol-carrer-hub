import {
  getCourseAnalyticsById,
  getPlatformAnalytics,
  getStudentAnalyticsById,
} from "@/lib/analytics"
import { getContentStatus } from "@/lib/content"
import { getCourseProgress, getEnrollment } from "@/lib/learning"
import type {
  CareerHubState,
  Course,
  CourseMatch,
  Internship,
  InternshipMatch,
  OpportunityIntelligence,
  Reminder,
  UserAccount,
  UserWorkspace,
} from "@/types"

export type CopilotPrompt = {
  id: string
  label: string
  answer: string
}

export type CopilotAction = {
  label: string
  href: string
  emphasis?: "primary" | "secondary"
}

export type CopilotExperience = {
  scope: "Public" | "Student" | "Admin"
  pageLabel: string
  title: string
  summary: string
  statusBadge?: string
  signals: string[]
  prompts: CopilotPrompt[]
  actions: CopilotAction[]
}

type CopilotInput = {
  pathname: string
  activeUser: UserAccount | null
  activeWorkspace: UserWorkspace | null
  state: CareerHubState
  publishedCourses: Course[]
  publishedInternships: Internship[]
  recommendedCourses: CourseMatch[]
  recommendedInternships: InternshipMatch[]
  inProgressCourses: Course[]
  completedCourses: Course[]
  earnedCertificates: UserWorkspace["certificates"]
  savedInternships: Internship[]
  trackedInternships: Internship[]
  dashboardReminders: Reminder[]
  opportunityIntelligence: OpportunityIntelligence | null
  isAdmin: boolean
}

function getSegments(pathname: string) {
  return pathname.split("/").filter(Boolean)
}

function getScope(pathname: string): CopilotExperience["scope"] {
  return pathname.startsWith("/admin") ? "Admin" : pathname === "/" ? "Public" : "Student"
}

function getPublishedCourseCount(state: CareerHubState) {
  return state.courses.filter((course) => getContentStatus(course.status) === "Published")
    .length
}

function getPublishedInternshipCount(state: CareerHubState) {
  return state.internships.filter(
    (internship) => getContentStatus(internship.status) === "Published"
  ).length
}

function getStudentDefault(input: CopilotInput): CopilotExperience {
  const nextReminder = input.dashboardReminders[0]
  const nextBestAction =
    input.opportunityIntelligence?.nextBestAction.ctaLabel ?? "Open dashboard"

  return {
    scope: getScope(input.pathname),
    pageLabel: "Tetisol workspace",
    title: "I can explain this page and suggest the next move",
    summary:
      nextReminder?.description ??
      "Tetisol ties your courses, certificates, internships, applications, and CV into one guided workflow.",
    statusBadge: input.opportunityIntelligence?.momentumLabel,
    signals: [
      `${input.inProgressCourses.length} courses in progress`,
      `${input.savedInternships.length} saved opportunities`,
      `${input.earnedCertificates.length} certificates earned`,
    ],
    prompts: [
      {
        id: "workspace-overview",
        label: "Explain this page",
        answer:
          "This page fits into the learning-to-employment loop. I can point out what is happening here, what data matters most, and which action will improve your signal fastest.",
      },
      {
        id: "next-step",
        label: "What should I do next?",
        answer: `Your strongest next move right now is to ${nextBestAction.toLowerCase()}. That keeps learning proof, CV quality, and internship momentum moving together.`,
      },
      {
        id: "recommendations",
        label: "How are recommendations made?",
        answer:
          "Tetisol currently uses your skills, course history, certificates, saved roles, internship interests, and profile preferences to produce guided recommendations.",
      },
    ],
    actions: [
      {
        label: "Open dashboard",
        href: "/dashboard",
        emphasis: "primary",
      },
      {
        label: "Review internships",
        href: "/internships",
        emphasis: "secondary",
      },
    ],
  }
}

export function shouldShowCopilot(pathname: string) {
  return pathname !== "/auth"
}

export function getCopilotExperience(input: CopilotInput): CopilotExperience {
  const segments = getSegments(input.pathname)
  const scope = getScope(input.pathname)
  const nextReminder = input.dashboardReminders[0]
  const primaryCourse = input.inProgressCourses[0] ?? input.recommendedCourses[0]
  const primaryInternship =
    input.recommendedInternships[0] ?? input.savedInternships[0] ?? input.trackedInternships[0]
  const dashboardAction = input.opportunityIntelligence?.nextBestAction

  if (input.pathname === "/") {
    return {
      scope,
      pageLabel: "Public landing",
      title: "Tetisol Copilot is ready to guide the full journey",
      summary:
        "From the public experience, I can help explain learning paths, certificates, internships, and how the platform connects them into one product.",
      statusBadge: "Launch preview",
      signals: [
        `${input.publishedCourses.length} published courses`,
        `${input.publishedInternships.length} published internships`,
        "AI guidance available after sign-in",
      ],
      prompts: [
        {
          id: "landing-platform",
          label: "What is Tetisol?",
          answer:
            "Tetisol is designed as one ecosystem: learn practical tech skills, earn proof, strengthen your CV, then move into internships with a clearer story.",
        },
        {
          id: "landing-start",
          label: "Where should a new learner start?",
          answer:
            "A new learner should start with a beginner-friendly course, complete enough lessons to build visible progress, then let internships and CV suggestions adapt from that signal.",
        },
        {
          id: "landing-proof",
          label: "Why does this feel different?",
          answer:
            "The differentiator is connection. Courses, certificates, applications, and CV improvements are not isolated tools here; they feed each other.",
        },
      ],
      actions: [
        {
          label: "Explore courses",
          href: "/courses",
          emphasis: "primary",
        },
        {
          label: "Open internships",
          href: "/internships",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/dashboard") {
    return {
      scope,
      pageLabel: "Student dashboard",
      title:
        dashboardAction?.title ?? "Use this dashboard as your learning and career control center",
      summary:
        dashboardAction?.description ??
        "This dashboard combines learning momentum, certificates, internships, applications, and CV readiness into one operating view.",
      statusBadge: input.opportunityIntelligence?.momentumLabel,
      signals: [
        `${input.inProgressCourses.length} courses in progress`,
        `${input.recommendedInternships.length} internship matches`,
        `${input.trackedInternships.length} tracked applications`,
      ],
      prompts: [
        {
          id: "dashboard-next",
          label: "What should I do next?",
          answer:
            input.opportunityIntelligence?.coachSummary ??
            "Focus on the next high-leverage move: resume an active course, strengthen your CV, or convert a saved internship into a tracked application.",
        },
        {
          id: "dashboard-readiness",
          label: "How ready am I?",
          answer: `Your current readiness score is ${input.opportunityIntelligence?.readinessScore ?? 0}%. Tetisol is weighing course progress, certificates, applications, and CV strength together.`,
        },
        {
          id: "dashboard-deadlines",
          label: "What needs attention?",
          answer:
            nextReminder?.title
              ? `${nextReminder.title} is your nearest visible reminder right now, so that is the best urgency signal to clear first.`
              : "You do not have a pressing reminder right now, so this is a good moment to push forward on learning or CV quality.",
        },
      ],
      actions: [
        {
          label: primaryCourse ? "Resume learning" : "Explore courses",
          href: primaryCourse ? `/learning/${primaryCourse.slug}` : "/courses",
          emphasis: "primary",
        },
        {
          label: primaryInternship ? "Review matches" : "Open internships",
          href: primaryInternship ? `/internships/${primaryInternship.slug}` : "/internships",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/courses") {
    return {
      scope,
      pageLabel: "Course catalog",
      title: "Use the catalog to choose the fastest route into visible skill proof",
      summary:
        "This page helps you compare learning lanes by category, difficulty, duration, and employability relevance before you commit time.",
      statusBadge: `${input.publishedCourses.length} live courses`,
      signals: [
        `${input.recommendedCourses.length} personalized recommendations`,
        `${input.completedCourses.length} completed courses`,
        `${input.publishedCourses.length} published learning options`,
      ],
      prompts: [
        {
          id: "catalog-choice",
          label: "How do I choose a course?",
          answer:
            "Choose the course that fits your role direction, fills the biggest skill gap on your CV, or maps most clearly into internships you want to pursue.",
        },
        {
          id: "catalog-filters",
          label: "What do the filters mean?",
          answer:
            "Category narrows the skill domain, level helps you avoid overreaching, and duration helps you match a course to your available time and urgency.",
        },
        {
          id: "catalog-value",
          label: "How will this help my career?",
          answer:
            "Every strong course outcome can become a CV skill, a project talking point, a certificate, or a better internship recommendation later in the platform.",
        },
      ],
      actions: [
        {
          label: primaryCourse ? `Open ${primaryCourse.title}` : "Open my learning",
          href: primaryCourse ? `/courses/${primaryCourse.slug}` : "/learning",
          emphasis: "primary",
        },
        {
          label: "View my learning",
          href: "/learning",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (segments[0] === "courses" && segments[1]) {
    const course = input.publishedCourses.find((item) => item.slug === segments[1])
    const enrollment = course ? getEnrollment(input.activeWorkspace, course.id) : null
    const progress = course ? getCourseProgress(course, enrollment) : null

    return {
      scope,
      pageLabel: "Course details",
      title: course
        ? `This course builds signal for ${course.internshipFocus[0] ?? "multiple role pathways"}`
        : "Review a course before you commit",
      summary:
        course?.description ??
        "Course detail pages explain outcomes, module depth, prerequisites, and how a learning path connects to internships and certification proof.",
      statusBadge: course?.certificateAvailable ? "Certificate path" : "Exploration",
      signals: [
        course ? `${course.modules.length} modules` : "Structured modules",
        course ? `${course.skills.length} skill tags` : "Skill pathways",
        progress ? `${progress.progressPercent}% complete` : "Not enrolled yet",
      ],
      prompts: [
        {
          id: "course-detail-fit",
          label: "Is this worth my time?",
          answer: course
            ? `${course.title} is best when you want to strengthen ${course.skills
                .slice(0, 3)
                .join(", ")} and turn that into clearer internship positioning.`
            : "Use the module count, outcomes, and role pathways to judge whether the course aligns with your next career move.",
        },
        {
          id: "course-detail-certificate",
          label: "What happens after completion?",
          answer:
            course?.certificateAvailable
              ? "Once completed, this course can unlock a certificate, improve recommendation quality, and feed your CV with clearer proof."
              : "Completion still strengthens skills, projects, and recommendation quality even if the certificate layer is scaffolded.",
        },
        {
          id: "course-detail-preview",
          label: "What should I check first?",
          answer:
            "Scan outcomes, prerequisites, and module depth first. Those three areas tell you whether the course matches your current level and intended role direction.",
        },
      ],
      actions: [
        {
          label: enrollment ? "Resume in player" : "Open course player",
          href: course ? `/learning/${course.slug}` : "/learning",
          emphasis: "primary",
        },
        {
          label: "Browse internships",
          href: "/internships",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/learning") {
    return {
      scope,
      pageLabel: "My learning",
      title: "Keep your active learning lane moving, not scattered",
      summary:
        "This page helps you resume the right course, revisit evidence, and track which completions are becoming useful proof.",
      statusBadge: input.earnedCertificates.length
        ? `${input.earnedCertificates.length} certificates earned`
        : "Progress in motion",
      signals: [
        `${input.inProgressCourses.length} active courses`,
        `${input.completedCourses.length} completed courses`,
        `${input.earnedCertificates.length} certificates earned`,
      ],
      prompts: [
        {
          id: "learning-resume",
          label: "Where should I resume?",
          answer:
            primaryCourse
              ? `${primaryCourse.title} is your best resume point because it is the nearest active signal Tetisol can compound right now.`
              : "If nothing is in progress yet, start with one course that aligns tightly with the roles you want.",
        },
        {
          id: "learning-proof",
          label: "How does progress help me?",
          answer:
            "Finished lessons create clearer learning momentum, completed courses unlock proof, and certificates make your CV and recommendations more credible.",
        },
        {
          id: "learning-certificates",
          label: "When do certificates matter most?",
          answer:
            "Certificates matter most when paired with projects, skills, and a CV that clearly translates the learning into role-relevant proof.",
        },
      ],
      actions: [
        {
          label: primaryCourse ? "Resume course" : "Browse courses",
          href: primaryCourse ? `/learning/${primaryCourse.slug}` : "/courses",
          emphasis: "primary",
        },
        {
          label: "Open certificates",
          href: "/certificates",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (segments[0] === "learning" && segments[1]) {
    const course = input.state.courses.find((item) => item.slug === segments[1])
    const enrollment = course ? getEnrollment(input.activeWorkspace, course.id) : null
    const progress = course ? getCourseProgress(course, enrollment) : null

    return {
      scope,
      pageLabel: "Course player",
      title: course ? `Stay focused inside ${course.title}` : "Use the player to move lesson by lesson",
      summary:
        progress?.nextLesson
          ? `Your next lesson is ${progress.nextLesson.title}. Tetisol keeps notes, lesson progress, quiz gates, and role relevance connected here.`
          : "The player keeps the course map, lesson content, progress, quizzes, and notes in one place so you can stay in flow.",
      statusBadge: progress ? `${progress.progressPercent}% complete` : "Learning flow",
      signals: [
        progress
          ? `${progress.completedLessons}/${progress.totalLessons} lessons complete`
          : "Structured lesson rail",
        course ? `${course.modules.length} modules` : "Modular path",
        input.dashboardReminders[0]?.title ?? "Notes and quizzes available",
      ],
      prompts: [
        {
          id: "player-next",
          label: "What should I do here?",
          answer:
            "Work one lesson at a time, save notes that can survive into your CV or interviews, and clear any quiz gates before jumping ahead.",
        },
        {
          id: "player-notes",
          label: "Why save notes?",
          answer:
            "Good notes capture ideas worth reusing later in projects, CV bullets, interview stories, or certificate-linked evidence.",
        },
        {
          id: "player-progress",
          label: "How does progress affect Tetisol?",
          answer:
            "Progress updates your learning momentum, changes your next best action, and improves course-to-internship matching across the platform.",
        },
      ],
      actions: [
        {
          label: "Back to my learning",
          href: "/learning",
          emphasis: "primary",
        },
        {
          label: "Open internships",
          href: "/internships",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname.startsWith("/certificates")) {
    return {
      scope,
      pageLabel: "Certificates",
      title: "Certificates are most valuable when they become visible proof elsewhere",
      summary:
        "Use this area to review completion proof, then feed that signal into your profile, CV, and internship story.",
      statusBadge: `${input.earnedCertificates.length} earned`,
      signals: [
        `${input.earnedCertificates.length} certificates earned`,
        `${input.completedCourses.length} completed courses`,
        `${input.activeWorkspace?.cv.certifications.length ?? 0} CV certificate entries`,
      ],
      prompts: [
        {
          id: "certificates-use",
          label: "What should I do with certificates?",
          answer:
            "Add them into your CV, use them to reinforce internship applications, and keep pairing them with real skills or project evidence.",
        },
        {
          id: "certificates-value",
          label: "Do certificates change recommendations?",
          answer:
            "Yes. Certificates act as visible proof that improves matching confidence when Tetisol recommends internships or prompts CV upgrades.",
        },
        {
          id: "certificates-share",
          label: "What is still mock here?",
          answer:
            "The certificate preview and share structure are ready, but real generation, download, and public verification are still scaffolded for backend wiring.",
        },
      ],
      actions: [
        {
          label: "Improve CV",
          href: "/cv-builder",
          emphasis: "primary",
        },
        {
          label: "Review completed courses",
          href: "/learning",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/internships") {
    return {
      scope,
      pageLabel: "Internships",
      title: "Use this page to convert skills into real opportunity flow",
      summary:
        "The internship surface maps your profile, course history, certificates, and saved roles into more relevant listings and deadlines.",
      statusBadge: `${input.recommendedInternships.length} ranked matches`,
      signals: [
        `${input.savedInternships.length} saved roles`,
        `${input.trackedInternships.length} tracked roles`,
        `${input.publishedInternships.length} published listings`,
      ],
      prompts: [
        {
          id: "internships-filters",
          label: "How should I use filters?",
          answer:
            "Start with category and level first, then use location and mode to trim the list without losing the best skill-aligned roles.",
        },
        {
          id: "internships-save",
          label: "When should I save vs track?",
          answer:
            "Save a role when you need time to compare it. Add it to the tracker when you are ready to manage notes, status, and deadlines actively.",
        },
        {
          id: "internships-match",
          label: "Why is a role recommended?",
          answer:
            "Tetisol looks for overlap between your skills, completed learning, career interests, location preferences, and existing role signals.",
        },
      ],
      actions: [
        {
          label: primaryInternship ? "Open strongest match" : "Open saved roles",
          href: primaryInternship ? `/internships/${primaryInternship.slug}` : "/saved",
          emphasis: "primary",
        },
        {
          label: "Open tracker",
          href: "/applications",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/saved") {
    return {
      scope,
      pageLabel: "Saved internships",
      title: "Use saved roles as a staging area, not a parking lot",
      summary:
        "This page is best used to compare promising roles before converting them into tracked applications with notes and deadlines.",
      statusBadge: `${input.savedInternships.length} saved`,
      signals: [
        `${input.savedInternships.length} saved roles`,
        `${input.trackedInternships.length} already in tracker`,
        `${input.recommendedInternships.length} recommendation candidates`,
      ],
      prompts: [
        {
          id: "saved-convert",
          label: "What should I do here?",
          answer:
            "Review fit, deadline, and requirements quickly. If a role still looks strong, move it into the application tracker so it becomes actionable.",
        },
        {
          id: "saved-prioritize",
          label: "Which saved role should I act on first?",
          answer:
            primaryInternship
              ? `${primaryInternship.title} is the strongest place to start if it still matches your current direction and deadline window.`
              : "Prioritize the role with the best fit and the nearest deadline you can still meet well.",
        },
        {
          id: "saved-improve",
          label: "How can I improve these matches?",
          answer:
            "Stronger profile data, better CV sections, and more completed course signals all improve how confident Tetisol becomes about opportunity fit.",
        },
      ],
      actions: [
        {
          label: "Open internships",
          href: "/internships",
          emphasis: "primary",
        },
        {
          label: "Open tracker",
          href: "/applications",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/applications") {
    return {
      scope,
      pageLabel: "Application tracker",
      title: "This tracker is where saved intent becomes operational follow-through",
      summary:
        "Use statuses, notes, and deadlines together so every role has a visible next step and no application disappears into memory.",
      statusBadge: `${input.trackedInternships.length} active cards`,
      signals: [
        `${input.trackedInternships.length} tracked applications`,
        input.dashboardReminders[0]?.title ?? "Deadline monitoring active",
        `${input.savedInternships.length} saved roles still waiting`,
      ],
      prompts: [
        {
          id: "applications-status",
          label: "What do the statuses mean?",
          answer:
            "Interested means you are still evaluating. Applied means the submission is sent. Interview, Offer, and Rejected help you keep the pipeline honest and current.",
        },
        {
          id: "applications-next",
          label: "What should I do next?",
          answer:
            "Move stale roles forward, update notes after every conversation, and attach deadlines so the board reflects the real state of your opportunities.",
        },
        {
          id: "applications-followup",
          label: "How should I use notes?",
          answer:
            "Capture recruiter context, interview takeaways, missing materials, and next follow-up dates. That turns the board into an operational memory system.",
        },
      ],
      actions: [
        {
          label: "Review internships",
          href: "/internships",
          emphasis: "primary",
        },
        {
          label: "Strengthen CV",
          href: "/cv-builder",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/cv-builder") {
    const cvScore = input.activeWorkspace?.cv.score ?? 0

    return {
      scope,
      pageLabel: "CV builder",
      title: "Use this builder to translate learning into an employable story",
      summary:
        "The CV builder is strongest when it imports course outcomes, certificates, skills, and projects instead of leaving them disconnected from your learning history.",
      statusBadge: `${cvScore}% score`,
      signals: [
        `${cvScore}% current CV score`,
        `${input.completedCourses.length} completed courses available`,
        `${input.earnedCertificates.length} certificates available`,
      ],
      prompts: [
        {
          id: "cv-next",
          label: "What should I improve first?",
          answer:
            input.opportunityIntelligence?.alerts.find((item) => item.kind === "CV")
              ?.description ??
            "Start with the weakest missing proof: underused skills, missing certificates, or course outcomes that are not yet visible in the document.",
        },
        {
          id: "cv-import",
          label: "Why import learning?",
          answer:
            "Importing learning saves time and makes sure certificates, course skills, and projects actually show up where employers can see them.",
        },
        {
          id: "cv-recruiter",
          label: "How should this read?",
          answer:
            "It should read like a coherent signal: where you are headed, what you know, what you built, and why you are credible for the opportunities you want.",
        },
      ],
      actions: [
        {
          label: "Open certificates",
          href: "/certificates",
          emphasis: "primary",
        },
        {
          label: "Review internships",
          href: "/internships",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/profile" || input.pathname === "/onboarding") {
    return {
      scope,
      pageLabel: "Profile",
      title: "Your profile is the signal engine behind personalization",
      summary:
        "Skills, interests, preferred roles, and locations directly affect recommendations, course ordering, and internship matching across Tetisol.",
      statusBadge: input.activeUser?.role ?? "student",
      signals: [
        `${input.activeWorkspace?.profile.skills.length ?? 0} skills listed`,
        `${input.activeWorkspace?.profile.interests.length ?? 0} interests listed`,
        `${input.activeWorkspace?.preferences.preferredLocations.length ?? 0} preferred locations`,
      ],
      prompts: [
        {
          id: "profile-why",
          label: "Why does this page matter?",
          answer:
            "A stronger profile gives Tetisol better material to personalize learning paths, internship matches, reminders, and career guidance.",
        },
        {
          id: "profile-fill",
          label: "What should I complete first?",
          answer:
            "Start with skills, career interests, and preferred roles. Those are the highest-leverage signals for both learning and internships.",
        },
        {
          id: "profile-personalization",
          label: "What changes when I update this?",
          answer:
            "Course recommendations, internship ranking, and guidance cards all adapt when your profile and preferences become clearer.",
        },
      ],
      actions: [
        {
          label: "Open dashboard",
          href: "/dashboard",
          emphasis: "primary",
        },
        {
          label: "Browse courses",
          href: "/courses",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/admin/analytics") {
    const analytics = getPlatformAnalytics(input.state)
    const primaryCourse = analytics.courseSnapshots[0]
    const primaryRiskStudent = analytics.atRiskLearners[0]

    return {
      scope,
      pageLabel: "Instructor analytics",
      title: "Track learner participation, risk, and internship readiness from one dashboard",
      summary:
        "This view brings together active learners, completion rates, quiz performance, course pressure points, and career-readiness signals across the platform.",
      statusBadge: `${analytics.atRiskStudents} at-risk learners`,
      signals: [
        `${analytics.activeLearners} active learners`,
        `${analytics.readyToApplyStudents} ready to apply`,
        analytics.mostDifficultModule
          ? `Weakest module: ${analytics.mostDifficultModule}`
          : "Module performance still forming",
      ],
      prompts: [
        {
          id: "analytics-risk",
          label: "Who needs help first?",
          answer:
            primaryRiskStudent
              ? `${primaryRiskStudent.fullName} is the clearest place to start because ${primaryRiskStudent.riskReasons[0]?.toLowerCase() ?? "their activity has slowed significantly"}.`
              : "No one currently matches the at-risk rules, so this is a good time to optimize course quality and readiness support.",
        },
        {
          id: "analytics-drop",
          label: "Where is engagement dropping?",
          answer:
            analytics.mostDifficultModule
              ? `The clearest drop point right now is ${analytics.mostDifficultModule}, so that is the best place to review pacing, clarity, or assessment design.`
              : "There is not enough concentration around one weak module yet, so monitor the course snapshots for the next pattern.",
        },
        {
          id: "analytics-readiness",
          label: "Who is ready for internships?",
          answer:
            analytics.readyToApplyStudents > 0
              ? `${analytics.readyToApplyStudents} learners currently look internship-ready based on learning proof, CV quality, and matching opportunity signal.`
              : "No learners are fully internship-ready yet, so focus on certificate completion, stronger CV translation, and steady course progression.",
        },
      ],
      actions: [
        {
          label: primaryCourse ? "Open top course analytics" : "Review courses",
          href: primaryCourse
            ? `/admin/courses/${primaryCourse.courseId}/analytics`
            : "/admin/courses",
          emphasis: "primary",
        },
        {
          label: primaryRiskStudent ? "Open at-risk learner" : "Manage internships",
          href: primaryRiskStudent
            ? `/admin/students/${primaryRiskStudent.userId}`
            : "/admin/internships",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/admin") {
    const draftCourses = input.state.courses.filter(
      (course) => getContentStatus(course.status) === "Draft"
    ).length

    return {
      scope,
      pageLabel: "Admin dashboard",
      title: "Run the learner experience from one internal command surface",
      summary:
        "This workspace lets Tetisol staff maintain live student content, track drafts, and keep courses and internships operationally aligned.",
      statusBadge: `${getPublishedCourseCount(input.state)} courses live`,
      signals: [
        `${draftCourses} course drafts`,
        `${getPublishedInternshipCount(input.state)} internships live`,
        `${input.state.internships.length} total opportunity records`,
      ],
      prompts: [
        {
          id: "admin-overview",
          label: "What needs attention here?",
          answer:
            draftCourses > 0
              ? `${draftCourses} course drafts are still private, so publishing or archiving them is the clearest operational task.`
              : "The clearest next check is internship freshness: confirm deadlines and archive listings that are no longer relevant.",
        },
        {
          id: "admin-student-link",
          label: "How does admin affect students?",
          answer:
            "Published courses appear in the catalog and learner recommendations. Published internships feed discovery, saved roles, and application tracking on the student side.",
        },
        {
          id: "admin-workflow",
          label: "What is the publish workflow?",
          answer:
            "Draft keeps content private. Published exposes it to learner-facing surfaces. Archived removes it from active discovery while preserving the record.",
        },
      ],
      actions: [
        {
          label: "Manage courses",
          href: "/admin/courses",
          emphasis: "primary",
        },
        {
          label: "Manage internships",
          href: "/admin/internships",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/admin/courses") {
    const draftCourses = input.state.courses.filter(
      (course) => getContentStatus(course.status) === "Draft"
    ).length

    return {
      scope,
      pageLabel: "Admin courses",
      title: "Manage learning content with the student experience in mind",
      summary:
        "Everything here feeds the public catalog, course detail pages, learning player, certificate logic, and recommendation scaffolding.",
      statusBadge: `${getPublishedCourseCount(input.state)} published`,
      signals: [
        `${input.state.courses.length} total course records`,
        `${draftCourses} drafts pending review`,
        `${input.state.quizzes.length} quizzes attached`,
      ],
      prompts: [
        {
          id: "admin-courses-publish",
          label: "What should be published?",
          answer:
            "Publish only when the title, outcomes, prerequisites, module flow, and quizzes are coherent enough that a learner could use the course immediately.",
        },
        {
          id: "admin-courses-structure",
          label: "What makes a strong course?",
          answer:
            "Strong courses are specific, modular, outcome-driven, and clear about how the learner should progress from lesson to lesson.",
        },
        {
          id: "admin-courses-impact",
          label: "Where does this show up?",
          answer:
            "Published course content appears in the catalog, detail pages, learner recommendations, and downstream learning-progress surfaces.",
        },
      ],
      actions: [
        {
          label: "Create course",
          href: "/admin/courses/new",
          emphasis: "primary",
        },
        {
          label: "View student catalog",
          href: "/courses",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (
    segments[0] === "admin" &&
    segments[1] === "courses" &&
    segments[2] &&
    segments[3] === "analytics"
  ) {
    const analytics = getCourseAnalyticsById(input.state, segments[2])

    return {
      scope,
      pageLabel: "Course analytics",
      title: analytics
        ? `Understand how learners are moving through ${analytics.course.title}`
        : "Course analytics overview",
      summary:
        analytics
          ? "This page combines enrollment depth, module completion, quiz outcomes, risk, and certificate progress for one course."
          : "Review how a specific course is performing before making content changes.",
      statusBadge: analytics ? `${analytics.atRiskStudents} learners at risk` : "Analytics",
      signals: [
        analytics ? `${analytics.totalEnrollments} enrollments` : "No enrollments yet",
        analytics ? `${analytics.completionRate}% completion rate` : "Completion still forming",
        analytics?.strugglingModuleTitle
          ? `Struggle point: ${analytics.strugglingModuleTitle}`
          : "No clear weak module yet",
      ],
      prompts: [
        {
          id: "course-analytics-struggle",
          label: "Where do learners struggle?",
          answer:
            analytics?.strugglingModuleTitle
              ? `${analytics.strugglingModuleTitle} is the clearest pressure point so far. Review module pacing, lesson clarity, and quiz difficulty there first.`
              : "Learner behavior is not yet concentrated around one weak area, so keep watching module completion data.",
        },
        {
          id: "course-analytics-risk",
          label: "How healthy is this course?",
          answer:
            analytics
              ? `${analytics.activeStudents} learners are active, ${analytics.inactiveStudents} are inactive, and ${analytics.atRiskStudents} currently need attention in this course.`
              : "This course needs more learner participation before health patterns become meaningful.",
        },
        {
          id: "course-analytics-certificates",
          label: "What about certificates?",
          answer:
            analytics
              ? `${analytics.certificatesIssued} certificates have been issued and ${analytics.certificateEligibleCount} learners may be close to certificate readiness.`
              : "Certificate readiness will appear here once learners begin completing the course.",
        },
      ],
      actions: [
        {
          label: analytics ? "Edit course" : "Back to courses",
          href: analytics ? `/admin/courses/${analytics.course.id}` : "/admin/courses",
          emphasis: "primary",
        },
        {
          label: analytics ? "Open learner catalog" : "Open analytics home",
          href: analytics ? `/courses/${analytics.course.slug}` : "/admin/analytics",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (segments[0] === "admin" && segments[1] === "courses" && segments[2]) {
    const course = segments[2] === "new"
      ? null
      : input.state.courses.find((item) => item.id === segments[2]) ?? null
    const lessonCount =
      course?.modules.reduce((total, module) => total + module.lessons.length, 0) ?? 0

    return {
      scope,
      pageLabel: "Course editor",
      title: course
        ? `Shape ${course.title} as a learner-ready experience`
        : "Build a course that feels publishable, not just complete",
      summary:
        course
          ? "Use this editor to keep metadata, lesson flow, quizzes, and publish state clean before exposing the course to learners."
          : "A strong draft needs clear positioning, outcomes, thoughtful modules, and lessons that feel purposeful rather than padded.",
      statusBadge: course ? getContentStatus(course.status) : "Draft builder",
      signals: [
        course ? `${course.modules.length} modules` : "Modular authoring",
        course ? `${lessonCount} lessons` : "Lesson sequencing",
        course ? `${course.skills.length} skill tags` : "Skill mapping",
      ],
      prompts: [
        {
          id: "admin-course-editor-sequence",
          label: "How should modules flow?",
          answer:
            "Move from fundamentals to practice to proof. Each module should answer a distinct learner question and clearly prepare the next one.",
        },
        {
          id: "admin-course-editor-quizzes",
          label: "Where should quizzes go?",
          answer:
            "Use quizzes to confirm understanding after meaningful instruction, not as filler. A quiz should protect progress, not interrupt it randomly.",
        },
        {
          id: "admin-course-editor-publish",
          label: "When is this ready?",
          answer:
            "It is ready when the learner can understand why the course exists, what they will gain, how the modules progress, and how completion helps them afterward.",
        },
      ],
      actions: [
        {
          label: "Back to courses",
          href: "/admin/courses",
          emphasis: "primary",
        },
        ...(course
          ? [
              {
                label: "Preview learner page",
                href: `/courses/${course.slug}`,
                emphasis: "secondary" as const,
              },
            ]
          : []),
      ],
    }
  }

  if (segments[0] === "admin" && segments[1] === "students" && segments[2]) {
    const student = getStudentAnalyticsById(input.state, segments[2])

    return {
      scope,
      pageLabel: "Student analytics",
      title: student
        ? `Monitor ${student.fullName}'s progress, risk, and readiness`
        : "Learner analytics detail",
      summary:
        student
          ? "This page brings one learner's course participation, quiz performance, engagement recency, certificate path, and internship readiness into one instructor view."
          : "Review a learner's activity and readiness from one instructor-facing profile.",
      statusBadge: student?.readinessState,
      signals: [
        student ? `${student.totalProgressPercent}% total progress` : "No learner data",
        student ? `${student.sessionCount} tracked sessions` : "Session data unavailable",
        student
          ? `${student.matchingInternships.length} internship matches`
          : "Readiness data unavailable",
      ],
      prompts: [
        {
          id: "student-analytics-risk",
          label: "Does this learner need help?",
          answer:
            student
              ? student.atRisk
                ? `${student.fullName} is currently flagged because ${student.riskReasons[0]?.toLowerCase() ?? "their recent activity and performance suggest they need support"}.`
                : `${student.fullName} is currently stable, with no at-risk rule triggered.`
              : "Learner data is not available for this route.",
        },
        {
          id: "student-analytics-readiness",
          label: "Are they ready for internships?",
          answer:
            student
              ? `${student.fullName} is currently marked as ${student.readinessState.toLowerCase()}. ${student.readinessSummary}`
              : "Internship readiness becomes clearer once learner data is available.",
        },
        {
          id: "student-analytics-next",
          label: "What should I advise next?",
          answer:
            student?.suggestedAction ??
            "Use this profile to identify the next instruction, support, or readiness step.",
        },
      ],
      actions: [
        {
          label: "Back to analytics",
          href: "/admin/analytics",
          emphasis: "primary",
        },
        {
          label: student?.courses[0]
            ? "Open strongest course"
            : "Review courses",
          href: student?.courses[0]
            ? `/admin/courses/${student.courses[0].courseId}/analytics`
            : "/admin/courses",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (input.pathname === "/admin/internships") {
    const draftInternships = input.state.internships.filter(
      (internship) => getContentStatus(internship.status) === "Draft"
    ).length

    return {
      scope,
      pageLabel: "Admin internships",
      title: "Keep opportunity listings clean, current, and learner-relevant",
      summary:
        "This board controls what students see in discovery, what they can save, and what they can move into the application tracker.",
      statusBadge: `${getPublishedInternshipCount(input.state)} published`,
      signals: [
        `${input.state.internships.length} total listings`,
        `${draftInternships} drafts pending`,
        `${input.trackedInternships.length} tracked by the active learner`,
      ],
      prompts: [
        {
          id: "admin-internships-quality",
          label: "What makes a strong listing?",
          answer:
            "A strong listing is specific about the role, deadline, requirements, application path, and the skills that make the opportunity a good fit.",
        },
        {
          id: "admin-internships-publish",
          label: "When should a listing stay draft?",
          answer:
            "Keep it in draft if core information is missing, the deadline is unclear, or the quality is not strong enough for a learner to act confidently.",
        },
        {
          id: "admin-internships-student",
          label: "How does this affect students?",
          answer:
            "Published internships feed discovery, recommendation logic, saved roles, and the application tracker, so status clarity matters a lot.",
        },
      ],
      actions: [
        {
          label: "Create internship",
          href: "/admin/internships/new",
          emphasis: "primary",
        },
        {
          label: "View student internships",
          href: "/internships",
          emphasis: "secondary",
        },
      ],
    }
  }

  if (segments[0] === "admin" && segments[1] === "internships" && segments[2]) {
    const internship =
      segments[2] === "new"
        ? null
        : input.state.internships.find((item) => item.id === segments[2]) ?? null

    return {
      scope,
      pageLabel: "Internship editor",
      title: internship
        ? `Keep ${internship.title} clear enough for immediate action`
        : "Create an internship listing that reads as credible and actionable",
      summary:
        internship
          ? "Use this editor to improve clarity, fit, deadline quality, and publish state before learners see the role."
          : "A strong listing should give learners enough context to decide quickly whether to save, track, or apply.",
      statusBadge: internship ? getContentStatus(internship.status) : "Draft builder",
      signals: [
        internship ? internship.company : "Company context",
        internship ? internship.deadline : "Deadline clarity",
        internship ? `${internship.skills.length} skill tags` : "Skill mapping",
      ],
      prompts: [
        {
          id: "admin-internship-editor-strong",
          label: "What makes this listing strong?",
          answer:
            "Strong listings are specific, believable, deadline-aware, and clearly tied to the skills and responsibilities a learner needs to evaluate.",
        },
        {
          id: "admin-internship-editor-recommendation",
          label: "How does this affect matching?",
          answer:
            "Skills, category, interest tags, and location all contribute to how confidently Tetisol can recommend the role to students.",
        },
        {
          id: "admin-internship-editor-publish",
          label: "When is it ready to publish?",
          answer:
            "Publish only when the title, company, requirements, qualifications, deadline, and application path are complete and trustworthy.",
        },
      ],
      actions: [
        {
          label: "Back to internships",
          href: "/admin/internships",
          emphasis: "primary",
        },
        ...(internship
          ? [
              {
                label: "Preview learner listing",
                href: `/internships/${internship.slug}`,
                emphasis: "secondary" as const,
              },
            ]
          : []),
      ],
    }
  }

  return getStudentDefault(input)
}

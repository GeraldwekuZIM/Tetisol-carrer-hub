import { normalizeCourseForAdmin, normalizeInternshipForAdmin, slugify } from "@/lib/content"
import {
  createBlankWorkspace,
  defaultCareerHubState,
} from "@/lib/demo-data"
import {
  deriveCertificateCvEntries,
  deriveCourseProjects,
  deriveLearningAchievements,
  deriveLearningSkills,
  getCourseById,
  getCourseProgress,
  getEnrollment,
  getLessonById,
  getQuizById,
} from "@/lib/learning"
import type {
  ApplicationRecord,
  ApplicationStatus,
  Certificate,
  CVDocument,
  CVInput,
  CareerHubState,
  Course,
  CourseResource,
  Internship,
  ProfileInput,
  Quiz,
  QuizFeedback,
  UserWorkspace,
} from "@/types"

function cloneState(state: CareerHubState) {
  return JSON.parse(JSON.stringify(state)) as CareerHubState
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function mergeUnique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function ensureWorkspace(state: CareerHubState, userId: string, name = "") {
  if (!state.workspaces[userId]) {
    state.workspaces[userId] = createBlankWorkspace(name)
  }

  return state.workspaces[userId]
}

function ensureEnrollment(state: CareerHubState, workspace: UserWorkspace, courseId: string) {
  let enrollment = workspace.enrollments.find((item) => item.courseId === courseId)

  if (!enrollment) {
    const timestamp = new Date().toISOString()
    enrollment = {
      id: generateId("enrollment"),
      courseId,
      enrolledAt: timestamp,
      startedAt: timestamp,
      completedAt: null,
      completedLessonIds: [],
      lastLessonId: null,
      lastActivityAt: timestamp,
    }
    workspace.enrollments.unshift(enrollment)
  }

  return enrollment
}

function updateWorkspacePreferencesFromProfile(workspace: UserWorkspace) {
  workspace.preferences.preferredLocations = workspace.profile.location
    ? [workspace.profile.location]
    : workspace.preferences.preferredLocations
  workspace.preferences.preferredInternshipFields =
    workspace.profile.preferredInternshipFields
  workspace.preferences.preferredLearningCategories = workspace.profile.learningFocus
}

function buildCertificate(courseTitle: string, courseId: string, learnerName: string): Certificate {
  const courseCode = courseTitle
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase()

  return {
    id: generateId("certificate"),
    courseId,
    learnerName,
    issuedAt: new Date().toISOString().slice(0, 10),
    certificateNumber: `TET-${courseCode}-${Date.now().toString().slice(-6)}`,
    shareUrl: null,
    downloadUrl: null,
  }
}

function awardCertificateIfEligible(
  state: CareerHubState,
  workspace: UserWorkspace,
  courseId: string
) {
  const course = getCourseById(state.courses, courseId)
  const enrollment = getEnrollment(workspace, courseId)

  if (!course || !enrollment) {
    return false
  }

  const progress = getCourseProgress(course, enrollment)
  const alreadyAwarded = workspace.certificates.some(
    (certificate) => certificate.courseId === courseId
  )

  if (!course.certificateAvailable || !progress.isCompleted || alreadyAwarded) {
    return false
  }

  enrollment.completedAt = enrollment.completedAt ?? new Date().toISOString()
  workspace.certificates.unshift(
    buildCertificate(course.title, course.id, workspace.profile.name || "Tetisol Learner")
  )
  workspace.reminders.unshift({
    id: generateId("reminder"),
    kind: "Certificate",
    title: `${course.title} certificate ready`,
    description: "Your certificate is now available in the certificates area.",
    date: new Date().toISOString().slice(0, 10),
    href: "/certificates",
  })

  return true
}

function mergeProjects(
  existingProjects: CVInput["projects"],
  importedProjects: CVInput["projects"]
) {
  const seen = new Set<string>()

  return [...existingProjects, ...importedProjects].filter((project) => {
    const key = project.sourceCourseId ?? project.title
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function buildResourceEntries(resourceLink: string | undefined): CourseResource[] | undefined {
  const trimmed = resourceLink?.trim()
  if (!trimmed) {
    return undefined
  }

  return [
    {
      label: "Lesson resource",
      kind: "Guide",
      url: trimmed,
    },
  ]
}

function buildCourseEntityId(prefix: string, title: string, fallback: string) {
  const slug = slugify(title)
  if (!slug) {
    return fallback
  }

  return `${prefix}-${slug}`
}

function normalizeAdminCourseInput(course: Course): Course {
  const normalizedCourseId =
    course.id || buildCourseEntityId("course", course.slug || course.title, generateId("course"))
  const normalizedSlug = slugify(course.slug || course.title) || generateId("course")

  const normalizedModules = course.modules.map((module, moduleIndex) => {
    const moduleId =
      module.id ||
      buildCourseEntityId("module", module.title, generateId("module"))

    return {
      ...module,
      id: moduleId,
      orderIndex: moduleIndex,
      lessons: module.lessons.map((lesson, lessonIndex) => {
        const lessonId =
          lesson.id ||
          buildCourseEntityId("lesson", lesson.title, generateId("lesson"))

        return {
          ...lesson,
          id: lessonId,
          slug: slugify(lesson.slug || lesson.title) || generateId("lesson"),
          orderIndex: lessonIndex,
          published: lesson.published ?? true,
          resources: lesson.resources?.length
            ? lesson.resources
            : buildResourceEntries(lesson.resourceLink),
        }
      }),
    }
  })

  return normalizeCourseForAdmin({
    ...course,
    id: normalizedCourseId,
    slug: normalizedSlug,
    modules: normalizedModules,
    updatedAt: new Date().toISOString().slice(0, 10),
  })
}

function normalizeAdminQuizInput(quizzes: Quiz[], course: Course) {
  return quizzes
    .filter((quiz) => quiz.lessonId && quiz.moduleId)
    .map((quiz, quizIndex) => {
      const quizId =
        quiz.id ||
        buildCourseEntityId("quiz", quiz.title || `${course.title}-quiz-${quizIndex + 1}`, generateId("quiz"))

      return {
        ...quiz,
        id: quizId,
        courseId: course.id,
        questions: quiz.questions.map((question, questionIndex) => ({
          ...question,
          id: question.id || `${quizId}-question-${questionIndex + 1}`,
        })),
      }
    })
}

function normalizeAdminInternshipInput(internship: Internship): Internship {
  return normalizeInternshipForAdmin({
    ...internship,
    id:
      internship.id ||
      buildCourseEntityId("internship", internship.slug || internship.title, generateId("internship")),
    slug: slugify(internship.slug || internship.title) || generateId("internship"),
    postedAt: internship.postedAt || new Date().toISOString().slice(0, 10),
    description: internship.shortDescription ?? internship.description,
  })
}

export function createInitialState() {
  return cloneState(defaultCareerHubState)
}

export function hydrateCareerHubState(state: CareerHubState) {
  const nextState = cloneState(state)

  defaultCareerHubState.users.forEach((defaultUser) => {
    const existingUser = nextState.users.find((user) => user.id === defaultUser.id)
    if (!existingUser) {
      nextState.users.push(defaultUser)
      return
    }

    existingUser.role = existingUser.role ?? defaultUser.role ?? "student"
  })

  Object.entries(defaultCareerHubState.workspaces).forEach(([userId, workspace]) => {
    if (!nextState.workspaces[userId]) {
      nextState.workspaces[userId] = workspace
    }
  })

  nextState.courses = nextState.courses.map((course) => normalizeCourseForAdmin(course))
  nextState.internships = nextState.internships.map((internship) =>
    normalizeInternshipForAdmin(internship)
  )

  return nextState
}

export function getActiveUser(state: CareerHubState) {
  return state.users.find((user) => user.id === state.activeUserId) ?? null
}

export function getActiveWorkspace(state: CareerHubState): UserWorkspace | null {
  if (!state.activeUserId) {
    return null
  }

  return state.workspaces[state.activeUserId] ?? null
}

export function syncAuthenticatedUser(
  state: CareerHubState,
  user: { id: string; email: string; fullName: string }
) {
  const nextState = cloneState(state)
  const existingUser = nextState.users.find((item) => item.id === user.id)

  if (!existingUser) {
    nextState.users.push({
      id: user.id,
      email: user.email,
      password: "",
      fullName: user.fullName,
      role: "student",
    })
  } else {
    existingUser.email = user.email
    existingUser.fullName = user.fullName
  }

  ensureWorkspace(nextState, user.id, user.fullName)
  nextState.activeUserId = user.id
  return nextState
}

export function signInLocally(
  state: CareerHubState,
  email: string,
  password: string
) {
  const nextState = cloneState(state)
  const normalizedEmail = email.trim().toLowerCase()
  const user = nextState.users.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail && item.password === password
  )

  if (!user) {
    return {
      error: "We could not find an account with those demo credentials.",
      state,
    }
  }

  ensureWorkspace(nextState, user.id, user.fullName)
  nextState.activeUserId = user.id

  return {
    error: null,
    state: nextState,
  }
}

export function signUpLocally(
  state: CareerHubState,
  payload: { fullName: string; email: string; password: string }
) {
  const nextState = cloneState(state)
  const normalizedEmail = payload.email.trim().toLowerCase()

  if (
    nextState.users.some(
      (user) => user.email.toLowerCase() === normalizedEmail
    )
  ) {
    return {
      error: "An account with that email already exists in demo mode.",
      state,
    }
  }

  const userId = generateId("user")
  nextState.users.push({
    id: userId,
    email: normalizedEmail,
    password: payload.password,
    fullName: payload.fullName,
    role: "student",
  })
  nextState.workspaces[userId] = createBlankWorkspace(payload.fullName)
  nextState.activeUserId = userId

  return {
    error: null,
    state: nextState,
  }
}

export function signOutUser(state: CareerHubState) {
  const nextState = cloneState(state)
  nextState.activeUserId = null
  return nextState
}

export function evaluateCv(cv: CVInput): Pick<CVDocument, "score" | "suggestions"> {
  let score = 0
  const suggestions: string[] = []

  if (cv.headline.trim()) {
    score += 12
  } else {
    suggestions.push("Add a focused headline that makes your target role obvious.")
  }

  if (cv.summary.trim().length >= 80) {
    score += 16
  } else {
    suggestions.push("Write a stronger summary with impact, strengths, and career direction.")
  }

  if (cv.education.trim()) {
    score += 10
  } else {
    suggestions.push("Include your education details and expected graduation date.")
  }

  if (cv.skills.length >= 8) {
    score += 15
  } else {
    suggestions.push("List at least 8 relevant skills to improve recruiter matching.")
  }

  if (cv.experience.filter(Boolean).length >= 2) {
    score += 12
  } else {
    suggestions.push("Add 2 concise experience bullets, even from school or volunteer work.")
  }

  if (cv.projects.length >= 2) {
    score += 14
  } else {
    suggestions.push("Include at least 2 practical projects that show initiative and execution.")
  }

  if (cv.certifications.length >= 1) {
    score += 10
  } else {
    suggestions.push("Add a certification or course completion to strengthen your evidence of learning.")
  }

  if (cv.achievements.length >= 2) {
    score += 11
  } else {
    suggestions.push("Include 2 achievement statements that show momentum and impact.")
  }

  if (
    cv.projects.some(
      (project) => project.impact.trim() && /\d/.test(project.impact)
    )
  ) {
    score += 10
  } else {
    suggestions.push("Quantify one project outcome with a number, timeframe, or result.")
  }

  return {
    score: Math.min(score, 100),
    suggestions: suggestions.slice(0, 4),
  }
}

export function completeOnboarding(
  state: CareerHubState,
  profile: ProfileInput
) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId, profile.name)
  workspace.profile = profile
  workspace.onboardingCompleted = true
  updateWorkspacePreferencesFromProfile(workspace)

  if (!workspace.cv.skills.length) {
    workspace.cv.skills = profile.skills
  }

  if (!workspace.cv.education.trim()) {
    workspace.cv.education = [profile.degree, profile.school].filter(Boolean).join(", ")
  }

  const user = nextState.users.find((item) => item.id === state.activeUserId)
  if (user) {
    user.fullName = profile.name || user.fullName
  }

  return nextState
}

export function updateProfile(state: CareerHubState, profile: ProfileInput) {
  return completeOnboarding(state, profile)
}

export function toggleSavedInternship(state: CareerHubState, internshipId: string) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  const isSaved = workspace.savedInternshipIds.includes(internshipId)

  workspace.savedInternshipIds = isSaved
    ? workspace.savedInternshipIds.filter((id) => id !== internshipId)
    : [internshipId, ...workspace.savedInternshipIds]

  return nextState
}

export function addInternshipToTracker(
  state: CareerHubState,
  internshipId: string,
  status: ApplicationStatus = "Interested"
) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  const existingApplication = workspace.applications.find(
    (application) => application.internshipId === internshipId
  )

  if (existingApplication) {
    existingApplication.status = status
    existingApplication.updatedAt = new Date().toISOString()
    return nextState
  }

  workspace.applications.unshift({
    id: generateId("application"),
    internshipId,
    status,
    notes: "Newly added from the internship finder.",
    deadline:
      nextState.internships.find((internship) => internship.id === internshipId)
        ?.deadline ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  return nextState
}

export function moveApplication(
  state: CareerHubState,
  applicationId: string,
  nextStatus: ApplicationStatus
) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  const application = workspace.applications.find((item) => item.id === applicationId)

  if (!application) {
    return state
  }

  application.status = nextStatus
  application.updatedAt = new Date().toISOString()

  return nextState
}

export function updateApplicationDetails(
  state: CareerHubState,
  applicationId: string,
  updates: Pick<ApplicationRecord, "notes" | "deadline">
) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  const application = workspace.applications.find((item) => item.id === applicationId)

  if (!application) {
    return state
  }

  application.notes = updates.notes
  application.deadline = updates.deadline
  application.updatedAt = new Date().toISOString()

  return nextState
}

export function enrollInCourse(state: CareerHubState, courseId: string) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  ensureEnrollment(nextState, workspace, courseId)
  return nextState
}

export function markLessonComplete(
  state: CareerHubState,
  courseId: string,
  lessonId: string
) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  const course = getCourseById(nextState.courses, courseId)

  if (!course) {
    return state
  }

  const lesson = getLessonById(course, lessonId)
  if (!lesson || lesson.quizId) {
    return state
  }

  const enrollment = ensureEnrollment(nextState, workspace, courseId)
  if (!enrollment.completedLessonIds.includes(lessonId)) {
    enrollment.completedLessonIds.push(lessonId)
  }
  enrollment.lastLessonId = lessonId
  enrollment.lastActivityAt = new Date().toISOString()

  const progress = getCourseProgress(course, enrollment)
  if (progress.isCompleted) {
    enrollment.completedAt = enrollment.completedAt ?? new Date().toISOString()
  }
  awardCertificateIfEligible(nextState, workspace, courseId)

  return nextState
}

export function saveLearningNote(
  state: CareerHubState,
  courseId: string,
  lessonId: string,
  content: string
) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  const existingNote = workspace.learningNotes.find((note) => note.lessonId === lessonId)
  const trimmedContent = content.trim()

  if (!trimmedContent) {
    workspace.learningNotes = workspace.learningNotes.filter(
      (note) => note.lessonId !== lessonId
    )
    const enrollment = workspace.enrollments.find((item) => item.courseId === courseId)
    if (enrollment) {
      enrollment.lastActivityAt = new Date().toISOString()
    }
    return nextState
  }

  if (existingNote) {
    existingNote.content = trimmedContent
    existingNote.updatedAt = new Date().toISOString()
    const enrollment = workspace.enrollments.find((item) => item.courseId === courseId)
    if (enrollment) {
      enrollment.lastActivityAt = new Date().toISOString()
    }
    return nextState
  }

  workspace.learningNotes.unshift({
    id: generateId("note"),
    courseId,
    lessonId,
    content: trimmedContent,
    updatedAt: new Date().toISOString(),
  })
  const enrollment = workspace.enrollments.find((item) => item.courseId === courseId)
  if (enrollment) {
    enrollment.lastActivityAt = new Date().toISOString()
  }

  return nextState
}

export function submitQuiz(
  state: CareerHubState,
  courseId: string,
  quizId: string,
  answers: Record<string, string>
): { state: CareerHubState; feedback: QuizFeedback } {
  if (!state.activeUserId) {
    return {
      state,
      feedback: {
        success: false,
        message: "Sign in to submit quizzes.",
      },
    }
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  const quiz = getQuizById(nextState.quizzes, quizId)

  if (!quiz || quiz.courseId !== courseId) {
    return {
      state,
      feedback: {
        success: false,
        message: "Quiz not found for this course.",
      },
    }
  }

  const correctAnswers = quiz.questions.filter(
    (question) => answers[question.id] === question.correctAnswer
  ).length
  const score = Math.round((correctAnswers / quiz.questions.length) * 100)
  const passed = score >= quiz.passingScore

  workspace.quizAttempts = workspace.quizAttempts.filter(
    (attempt) => attempt.quizId !== quizId
  )
  workspace.quizAttempts.unshift({
    id: generateId("attempt"),
    quizId,
    courseId,
    lessonId: quiz.lessonId,
    answers,
    score,
    passed,
    submittedAt: new Date().toISOString(),
  })

  const enrollment = ensureEnrollment(nextState, workspace, courseId)
  if (passed && !enrollment.completedLessonIds.includes(quiz.lessonId)) {
    enrollment.completedLessonIds.push(quiz.lessonId)
  }
  enrollment.lastLessonId = quiz.lessonId
  enrollment.lastActivityAt = new Date().toISOString()

  const course = getCourseById(nextState.courses, courseId)
  if (course) {
    const progress = getCourseProgress(course, enrollment)
    if (progress.isCompleted) {
      enrollment.completedAt = enrollment.completedAt ?? new Date().toISOString()
    }
  }

  const certificateEarned = passed
    ? awardCertificateIfEligible(nextState, workspace, courseId)
    : false

  return {
    state: nextState,
    feedback: {
      success: passed,
      message: passed
        ? certificateEarned
          ? "Quiz passed and your course certificate is now ready."
          : "Quiz passed. Your progress has been updated."
        : "Quiz submitted. Review the lesson notes and try again.",
      score,
      passed,
      certificateEarned,
    },
  }
}

export function importLearningIntoCv(state: CareerHubState) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)

  const learnedSkills = deriveLearningSkills(nextState.courses, workspace)
  const importedProjects = deriveCourseProjects(nextState.courses, workspace)
  const importedAchievements = deriveLearningAchievements(nextState.courses, workspace)
  const importedCertifications = deriveCertificateCvEntries(
    nextState.courses,
    workspace.certificates
  )

  const nextCv: CVInput = {
    ...workspace.cv,
    skills: mergeUnique([
      ...workspace.cv.skills,
      ...workspace.profile.skills,
      ...learnedSkills,
    ]),
    projects: mergeProjects(workspace.cv.projects, importedProjects),
    certifications: importedCertifications,
    achievements: mergeUnique([
      ...workspace.cv.achievements,
      ...importedAchievements,
    ]),
  }

  const evaluation = evaluateCv(nextCv)
  workspace.cv = {
    ...nextCv,
    ...evaluation,
    lastUpdated: new Date().toISOString(),
  }

  return nextState
}

export function updateCv(state: CareerHubState, cv: CVInput) {
  if (!state.activeUserId) {
    return state
  }

  const nextState = cloneState(state)
  const workspace = ensureWorkspace(nextState, state.activeUserId)
  const evaluation = evaluateCv(cv)

  workspace.cv = {
    ...cv,
    ...evaluation,
    lastUpdated: new Date().toISOString(),
  }

  return nextState
}

export function saveAdminCourseContent(
  state: CareerHubState,
  payload: {
    course: Course
    quizzes: Quiz[]
  }
) {
  const nextState = cloneState(state)
  const normalizedCourse = normalizeAdminCourseInput(payload.course)
  const normalizedQuizzes = normalizeAdminQuizInput(payload.quizzes, normalizedCourse)

  const existingCourseIndex = nextState.courses.findIndex(
    (course) => course.id === normalizedCourse.id
  )

  if (existingCourseIndex >= 0) {
    nextState.courses[existingCourseIndex] = normalizedCourse
  } else {
    nextState.courses.unshift(normalizedCourse)
  }

  nextState.quizzes = [
    ...nextState.quizzes.filter((quiz) => quiz.courseId !== normalizedCourse.id),
    ...normalizedQuizzes,
  ]

  return nextState
}

export function archiveAdminCourseContent(
  state: CareerHubState,
  courseId: string
) {
  const nextState = cloneState(state)
  const course = nextState.courses.find((item) => item.id === courseId)

  if (!course) {
    return state
  }

  course.status = "Archived"
  course.updatedAt = new Date().toISOString().slice(0, 10)
  return nextState
}

export function deleteAdminCourseContent(
  state: CareerHubState,
  courseId: string
) {
  const nextState = cloneState(state)
  nextState.courses = nextState.courses.filter((course) => course.id !== courseId)
  nextState.quizzes = nextState.quizzes.filter((quiz) => quiz.courseId !== courseId)

  Object.values(nextState.workspaces).forEach((workspace) => {
    workspace.enrollments = workspace.enrollments.filter(
      (enrollment) => enrollment.courseId !== courseId
    )
    workspace.quizAttempts = workspace.quizAttempts.filter(
      (attempt) => attempt.courseId !== courseId
    )
    workspace.certificates = workspace.certificates.filter(
      (certificate) => certificate.courseId !== courseId
    )
    workspace.learningNotes = workspace.learningNotes.filter(
      (note) => note.courseId !== courseId
    )
    workspace.cv.projects = workspace.cv.projects.filter(
      (project) => project.sourceCourseId !== courseId
    )
  })

  return nextState
}

export function saveAdminInternshipContent(
  state: CareerHubState,
  internship: Internship
) {
  const nextState = cloneState(state)
  const normalizedInternship = normalizeAdminInternshipInput(internship)
  const existingInternshipIndex = nextState.internships.findIndex(
    (item) => item.id === normalizedInternship.id
  )

  if (existingInternshipIndex >= 0) {
    nextState.internships[existingInternshipIndex] = normalizedInternship
  } else {
    nextState.internships.unshift(normalizedInternship)
  }

  return nextState
}

export function archiveAdminInternshipContent(
  state: CareerHubState,
  internshipId: string
) {
  const nextState = cloneState(state)
  const internship = nextState.internships.find((item) => item.id === internshipId)

  if (!internship) {
    return state
  }

  internship.status = "Archived"
  return nextState
}

export function deleteAdminInternshipContent(
  state: CareerHubState,
  internshipId: string
) {
  const nextState = cloneState(state)
  nextState.internships = nextState.internships.filter(
    (internship) => internship.id !== internshipId
  )

  Object.values(nextState.workspaces).forEach((workspace) => {
    workspace.savedInternshipIds = workspace.savedInternshipIds.filter(
      (savedId) => savedId !== internshipId
    )
    workspace.applications = workspace.applications.filter(
      (application) => application.internshipId !== internshipId
    )
  })

  return nextState
}

import { getPublishedInternships } from "@/lib/content"
import {
  deriveLearningSkills,
  getCourseById,
  getCourseProgress,
  getLessonById,
} from "@/lib/learning"
import { getRecommendedInternships } from "@/lib/recommendations"
import type {
  CareerHubState,
  Course,
  CourseEnrollment,
  InternshipMatch,
  QuizAttempt,
  UserWorkspace,
} from "@/types"

const DAY_MS = 1000 * 60 * 60 * 24

export type LearnerRiskLevel = "none" | "warning" | "high"
export type LearnerEngagementState = "Active today" | "Recently active" | "Inactive"
export type LearnerReadinessState =
  | "Ready to apply"
  | "Needs CV improvement"
  | "Needs more skills"
  | "Building momentum"

export type CourseParticipationSnapshot = {
  courseId: string
  courseSlug: string
  courseTitle: string
  category: string
  progressPercent: number
  completedLessons: number
  totalLessons: number
  status: "Not started" | "In progress" | "Completed"
  lastActivityAt: string | null
  completionAt: string | null
  lastLessonTitle: string | null
  averageQuizScore: number | null
  quizPassRate: number
}

export type StudentAnalytics = {
  userId: string
  fullName: string
  email: string
  school: string
  degree: string
  profileLocation: string
  enrolledCourseCount: number
  completedCourseCount: number
  activeCourseCount: number
  totalLessonsCompleted: number
  totalProgressPercent: number
  lastActiveAt: string | null
  daysInactive: number | null
  engagementState: LearnerEngagementState
  engagementLabel: string
  sessionCount: number
  consistencyLabel: "Consistent" | "Variable" | "Sporadic"
  averageQuizScore: number | null
  quizPassRate: number
  failedQuizAttempts: number
  certificatesIssued: number
  certificateEligibleCount: number
  cvScore: number
  readinessState: LearnerReadinessState
  readinessSummary: string
  atRisk: boolean
  riskLevel: LearnerRiskLevel
  riskReasons: string[]
  suggestedAction: string
  skillsGained: string[]
  matchingInternships: InternshipMatch[]
  readyInternshipCount: number
  courses: CourseParticipationSnapshot[]
}

export type ModuleAnalytics = {
  moduleId: string
  title: string
  lessonCount: number
  averageCompletionPercent: number
  completedStudents: number
  quizPassRate: number
  atRiskStudents: number
}

export type CourseAnalytics = {
  course: Course
  totalEnrollments: number
  activeStudents: number
  inactiveStudents: number
  completedStudents: number
  averageProgress: number
  completionRate: number
  quizPassRate: number
  certificatesIssued: number
  certificateEligibleCount: number
  atRiskStudents: number
  moduleBreakdown: ModuleAnalytics[]
  learners: StudentAnalytics[]
  strugglingModuleTitle: string | null
}

export type PlatformAnalytics = {
  totalStudents: number
  activeLearners: number
  inactiveLearners: number
  activeToday: number
  averageProgress: number
  completionRate: number
  averageQuizScore: number
  quizPassRate: number
  certificatesIssued: number
  atRiskStudents: number
  readyToApplyStudents: number
  progressDistribution: Array<{ label: string; count: number }>
  engagementDistribution: Array<{ label: string; count: number }>
  courseSnapshots: Array<{
    courseId: string
    title: string
    enrollments: number
    completionRate: number
    averageProgress: number
    atRiskStudents: number
  }>
  atRiskLearners: StudentAnalytics[]
  readyLearners: StudentAnalytics[]
  studentSummaries: StudentAnalytics[]
  mostDifficultCourse: string | null
  mostDifficultModule: string | null
}

function average(values: number[]) {
  if (!values.length) {
    return 0
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length)
}

function toTimestamp(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  const time = date.getTime()
  return Number.isNaN(time) ? null : time
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function formatDateKey(time: number) {
  return new Date(time).toISOString().slice(0, 10)
}

function getStudentUsers(state: CareerHubState) {
  return state.users.filter(
    (user) =>
      user.role !== "admin" &&
      user.role !== "instructor" &&
      state.workspaces[user.id]
  )
}

function getCourseAttempts(workspace: UserWorkspace, courseId: string) {
  return workspace.quizAttempts.filter((attempt) => attempt.courseId === courseId)
}

function getWorkspaceActivityTimes(workspace: UserWorkspace) {
  return [
    ...workspace.enrollments.flatMap((enrollment) => [
      enrollment.enrolledAt,
      enrollment.startedAt,
      enrollment.lastActivityAt,
      enrollment.completedAt,
    ]),
    ...workspace.quizAttempts.map((attempt) => attempt.submittedAt),
    ...workspace.learningNotes.map((note) => note.updatedAt),
    ...workspace.applications.flatMap((application) => [
      application.createdAt,
      application.updatedAt,
    ]),
    workspace.cv.lastUpdated,
    ...workspace.certificates.map((certificate) => certificate.issuedAt),
  ]
    .map(toTimestamp)
    .filter((value): value is number => value !== null)
}

function getWorkspaceLastActiveAt(workspace: UserWorkspace) {
  const times = getWorkspaceActivityTimes(workspace)
  if (!times.length) {
    return null
  }

  return new Date(Math.max(...times)).toISOString()
}

function getSessionCount(workspace: UserWorkspace) {
  return unique(getWorkspaceActivityTimes(workspace).map((time) => formatDateKey(time))).length
}

function getDaysInactive(lastActiveAt: string | null, now = new Date()) {
  const timestamp = toTimestamp(lastActiveAt)
  if (timestamp === null) {
    return null
  }

  return Math.max(0, Math.floor((now.getTime() - timestamp) / DAY_MS))
}

function getEngagementState(daysInactive: number | null): LearnerEngagementState {
  if (daysInactive === null || daysInactive >= 5) {
    return "Inactive"
  }

  if (daysInactive === 0) {
    return "Active today"
  }

  return "Recently active"
}

function getEngagementLabel(daysInactive: number | null) {
  if (daysInactive === null) {
    return "No tracked activity yet"
  }

  if (daysInactive === 0) {
    return "Active today"
  }

  if (daysInactive <= 4) {
    return `Recently active (${daysInactive} day${daysInactive === 1 ? "" : "s"} ago)`
  }

  return `Inactive for ${daysInactive} days`
}

function getConsistencyLabel(sessionCount: number, daysInactive: number | null) {
  if (daysInactive !== null && daysInactive <= 2 && sessionCount >= 4) {
    return "Consistent"
  }

  if (daysInactive !== null && daysInactive <= 5 && sessionCount >= 2) {
    return "Variable"
  }

  return "Sporadic"
}

function getCourseSnapshot(
  course: Course,
  enrollment: CourseEnrollment,
  workspace: UserWorkspace
): CourseParticipationSnapshot {
  const progress = getCourseProgress(course, enrollment)
  const attempts = getCourseAttempts(workspace, course.id)
  const latestLesson = enrollment.lastLessonId
    ? getLessonById(course, enrollment.lastLessonId)
    : null

  return {
    courseId: course.id,
    courseSlug: course.slug,
    courseTitle: course.title,
    category: course.category,
    progressPercent: progress.progressPercent,
    completedLessons: progress.completedLessons,
    totalLessons: progress.totalLessons,
    status:
      progress.isCompleted
        ? "Completed"
        : progress.completedLessons > 0
          ? "In progress"
          : "Not started",
    lastActivityAt: enrollment.lastActivityAt,
    completionAt: enrollment.completedAt,
    lastLessonTitle: latestLesson?.title ?? null,
    averageQuizScore: attempts.length ? average(attempts.map((attempt) => attempt.score)) : null,
    quizPassRate: attempts.length
      ? Math.round((attempts.filter((attempt) => attempt.passed).length / attempts.length) * 100)
      : 0,
  }
}

function getRepeatedFailureAttempts(attempts: QuizAttempt[]) {
  const groupedFailures = attempts
    .filter((attempt) => !attempt.passed)
    .reduce<Record<string, number>>((accumulator, attempt) => {
      accumulator[attempt.quizId] = (accumulator[attempt.quizId] ?? 0) + 1
      return accumulator
    }, {})

  return Object.values(groupedFailures).filter((count) => count >= 2).length
}

function getReadinessState(args: {
  cvScore: number
  completedCourseCount: number
  totalProgressPercent: number
  readyInternshipCount: number
}): {
  state: LearnerReadinessState
  summary: string
} {
  if (
    args.cvScore >= 85 &&
    args.completedCourseCount >= 2 &&
    args.readyInternshipCount >= 2
  ) {
    return {
      state: "Ready to apply",
      summary:
        "This learner has enough proof, CV quality, and role fit to move into internships confidently.",
    }
  }

  if (args.cvScore < 75) {
    return {
      state: "Needs CV improvement",
      summary:
        "Learning momentum exists, but the CV signal still needs stronger translation before applying widely.",
    }
  }

  if (args.completedCourseCount === 0 || args.totalProgressPercent < 35) {
    return {
      state: "Needs more skills",
      summary:
        "This learner needs more completed learning evidence before internship readiness becomes strong.",
    }
  }

  return {
    state: "Building momentum",
    summary:
      "This learner is progressing well and is close to being internship-ready with a bit more proof and CV refinement.",
  }
}

function getRiskAssessment(args: {
  daysInactive: number | null
  courseSnapshots: CourseParticipationSnapshot[]
  repeatedFailures: number
}) {
  const reasons: string[] = []

  if ((args.daysInactive ?? 0) >= 5) {
    reasons.push(`No activity for ${args.daysInactive} days`)
  }

  const lowProgressCourse = args.courseSnapshots.find(
    (course) => course.status !== "Completed" && course.progressPercent <= 25
  )
  if (lowProgressCourse) {
    reasons.push(`Low progress in ${lowProgressCourse.courseTitle}`)
  }

  const stalledCourse = args.courseSnapshots.find(
    (course) =>
      course.status === "In progress" &&
      course.progressPercent < 80 &&
      (args.daysInactive ?? 0) >= 4
  )
  if (stalledCourse) {
    reasons.push(`Stalled in ${stalledCourse.courseTitle}`)
  }

  if (args.repeatedFailures > 0) {
    reasons.push("Repeated quiz failures need intervention")
  }

  const uniqueReasons = unique(reasons).slice(0, 3)
  const riskLevel: LearnerRiskLevel =
    uniqueReasons.length === 0
      ? "none"
      : (args.daysInactive ?? 0) >= 10 || args.repeatedFailures > 0 || uniqueReasons.length >= 2
        ? "high"
        : "warning"

  const suggestedAction =
    uniqueReasons[0] === undefined
      ? "Keep the learner moving with the next recommended course or internship step."
      : uniqueReasons[0].startsWith("No activity")
        ? "Prompt the learner to resume their most recent course and review their next lesson."
        : uniqueReasons[0].startsWith("Repeated quiz")
          ? "Recommend a module review before the next assessment attempt."
          : "Review the learner's progress and help them clear the current blocker."

  return {
    atRisk: riskLevel !== "none",
    riskLevel,
    riskReasons: uniqueReasons,
    suggestedAction,
  }
}

export function formatAnalyticsDate(value: string | null | undefined) {
  if (!value) {
    return "No activity"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "No activity"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function getStudentAnalyticsById(
  state: CareerHubState,
  studentId: string,
  now = new Date()
): StudentAnalytics | null {
  const user = state.users.find((candidate) => candidate.id === studentId)
  const workspace = state.workspaces[studentId]

  if (!user || !workspace || user.role === "admin" || user.role === "instructor") {
    return null
  }

  const courseSnapshots = workspace.enrollments
    .map((enrollment) => {
      const course = getCourseById(state.courses, enrollment.courseId)
      return course ? getCourseSnapshot(course, enrollment, workspace) : null
    })
    .filter((snapshot): snapshot is CourseParticipationSnapshot => Boolean(snapshot))
    .sort((left, right) => right.progressPercent - left.progressPercent)

  const totalLessons = courseSnapshots.reduce(
    (total, course) => total + course.totalLessons,
    0
  )
  const totalLessonsCompleted = courseSnapshots.reduce(
    (total, course) => total + course.completedLessons,
    0
  )
  const totalProgressPercent = totalLessons
    ? Math.round((totalLessonsCompleted / totalLessons) * 100)
    : 0
  const lastActiveAt = getWorkspaceLastActiveAt(workspace)
  const daysInactive = getDaysInactive(lastActiveAt, now)
  const engagementState = getEngagementState(daysInactive)
  const engagementLabel = getEngagementLabel(daysInactive)
  const sessionCount = getSessionCount(workspace)
  const consistencyLabel = getConsistencyLabel(sessionCount, daysInactive)
  const allAttempts = workspace.quizAttempts
  const averageQuizScore = allAttempts.length
    ? average(allAttempts.map((attempt) => attempt.score))
    : null
  const quizPassRate = allAttempts.length
    ? Math.round((allAttempts.filter((attempt) => attempt.passed).length / allAttempts.length) * 100)
    : 0
  const failedQuizAttempts = allAttempts.filter((attempt) => !attempt.passed).length
  const completedCourseCount = courseSnapshots.filter(
    (course) => course.status === "Completed"
  ).length
  const activeCourseCount = courseSnapshots.filter(
    (course) => course.status === "In progress"
  ).length
  const certificateEligibleCount = courseSnapshots.filter((course) => {
    const sourceCourse = getCourseById(state.courses, course.courseId)
    return (
      course.status === "Completed" &&
      sourceCourse?.certificateAvailable &&
      !workspace.certificates.some((certificate) => certificate.courseId === course.courseId)
    )
  }).length
  const matchingInternships = getRecommendedInternships(
    workspace.profile,
    getPublishedInternships(state.internships),
    state.courses,
    workspace
  )
  const readyInternshipCount = matchingInternships.filter(
    (internship) => internship.matchScore >= 70
  ).length
  const readiness = getReadinessState({
    cvScore: workspace.cv.score,
    completedCourseCount,
    totalProgressPercent,
    readyInternshipCount,
  })
  const risk = getRiskAssessment({
    daysInactive,
    courseSnapshots,
    repeatedFailures: getRepeatedFailureAttempts(allAttempts),
  })

  return {
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    school: workspace.profile.school,
    degree: workspace.profile.degree,
    profileLocation: workspace.profile.location,
    enrolledCourseCount: courseSnapshots.length,
    completedCourseCount,
    activeCourseCount,
    totalLessonsCompleted,
    totalProgressPercent,
    lastActiveAt,
    daysInactive,
    engagementState,
    engagementLabel,
    sessionCount,
    consistencyLabel,
    averageQuizScore,
    quizPassRate,
    failedQuizAttempts,
    certificatesIssued: workspace.certificates.length,
    certificateEligibleCount,
    cvScore: workspace.cv.score,
    readinessState: readiness.state,
    readinessSummary: readiness.summary,
    atRisk: risk.atRisk,
    riskLevel: risk.riskLevel,
    riskReasons: risk.riskReasons,
    suggestedAction: risk.suggestedAction,
    skillsGained: deriveLearningSkills(state.courses, workspace),
    matchingInternships,
    readyInternshipCount,
    courses: courseSnapshots,
  } satisfies StudentAnalytics
}

export function getAllStudentAnalytics(
  state: CareerHubState,
  now = new Date()
): StudentAnalytics[] {
  return getStudentUsers(state)
    .map((user) => getStudentAnalyticsById(state, user.id, now))
    .filter((student): student is StudentAnalytics => Boolean(student))
    .sort((left, right) => {
      if (left.atRisk !== right.atRisk) {
        return left.atRisk ? -1 : 1
      }

      return right.totalProgressPercent - left.totalProgressPercent
    })
}

export function getCourseAnalyticsById(
  state: CareerHubState,
  courseId: string,
  now = new Date()
): CourseAnalytics | null {
  const course = getCourseById(state.courses, courseId)
  if (!course) {
    return null
  }

  const learners = getAllStudentAnalytics(state, now).filter((student) =>
    student.courses.some((snapshot) => snapshot.courseId === courseId)
  )
  const courseSnapshots = learners
    .map((student) => student.courses.find((snapshot) => snapshot.courseId === courseId) ?? null)
    .filter((snapshot): snapshot is CourseParticipationSnapshot => Boolean(snapshot))
  const courseQuizIds = new Set(
    state.quizzes.filter((quiz) => quiz.courseId === courseId).map((quiz) => quiz.id)
  )
  const allAttempts = Object.values(state.workspaces).flatMap((workspace) =>
    workspace.quizAttempts.filter((attempt) => courseQuizIds.has(attempt.quizId))
  )
  const moduleBreakdown = course.modules.map((module) => {
    const moduleQuizIds = new Set(
      state.quizzes
        .filter((quiz) => quiz.courseId === courseId && quiz.moduleId === module.id)
        .map((quiz) => quiz.id)
    )
    const moduleAttempts = allAttempts.filter((attempt) => moduleQuizIds.has(attempt.quizId))
    const completionValues = learners.map((student) => {
      const enrollment = state.workspaces[student.userId]?.enrollments.find(
        (candidate) => candidate.courseId === courseId
      )
      const completedCount = module.lessons.filter((lesson) =>
        enrollment?.completedLessonIds.includes(lesson.id)
      ).length

      return module.lessons.length
        ? Math.round((completedCount / module.lessons.length) * 100)
        : 0
    })

    return {
      moduleId: module.id,
      title: module.title,
      lessonCount: module.lessons.length,
      averageCompletionPercent: average(completionValues),
      completedStudents: learners.filter((student) => {
        const enrollment = state.workspaces[student.userId]?.enrollments.find(
          (candidate) => candidate.courseId === courseId
        )
        return module.lessons.every((lesson) =>
          enrollment?.completedLessonIds.includes(lesson.id)
        )
      }).length,
      quizPassRate: moduleAttempts.length
        ? Math.round((moduleAttempts.filter((attempt) => attempt.passed).length / moduleAttempts.length) * 100)
        : 0,
      atRiskStudents: learners.filter(
        (student) =>
          student.atRisk &&
          student.courses.some(
            (snapshot) =>
              snapshot.courseId === courseId &&
              snapshot.lastLessonTitle &&
              module.lessons.some((lesson) => lesson.title === snapshot.lastLessonTitle)
          )
      ).length,
    } satisfies ModuleAnalytics
  })

  const strugglingModule =
    [...moduleBreakdown]
      .filter((module) => module.lessonCount > 0)
      .sort((left, right) => left.averageCompletionPercent - right.averageCompletionPercent)[0] ??
    null

  return {
    course,
    totalEnrollments: learners.length,
    activeStudents: learners.filter(
      (student) => student.engagementState !== "Inactive"
    ).length,
    inactiveStudents: learners.filter(
      (student) => student.engagementState === "Inactive"
    ).length,
    completedStudents: courseSnapshots.filter(
      (snapshot) => snapshot.status === "Completed"
    ).length,
    averageProgress: average(courseSnapshots.map((snapshot) => snapshot.progressPercent)),
    completionRate: learners.length
      ? Math.round(
          (courseSnapshots.filter((snapshot) => snapshot.status === "Completed").length /
            learners.length) *
            100
        )
      : 0,
    quizPassRate: allAttempts.length
      ? Math.round((allAttempts.filter((attempt) => attempt.passed).length / allAttempts.length) * 100)
      : 0,
    certificatesIssued: learners.filter((student) =>
      state.workspaces[student.userId]?.certificates.some(
        (certificate) => certificate.courseId === courseId
      )
    ).length,
    certificateEligibleCount: learners.filter((student) =>
      student.courses.some(
        (snapshot) =>
          snapshot.courseId === courseId &&
          snapshot.status === "Completed" &&
          !state.workspaces[student.userId]?.certificates.some(
            (certificate) => certificate.courseId === courseId
          )
      )
    ).length,
    atRiskStudents: learners.filter((student) => student.atRisk).length,
    moduleBreakdown,
    learners,
    strugglingModuleTitle: strugglingModule?.title ?? null,
  } satisfies CourseAnalytics
}

export function getPlatformAnalytics(
  state: CareerHubState,
  now = new Date()
): PlatformAnalytics {
  const students = getAllStudentAnalytics(state, now)
  const totalEnrollments = students.reduce(
    (total, student) => total + student.enrolledCourseCount,
    0
  )
  const completedEnrollments = students.reduce(
    (total, student) => total + student.completedCourseCount,
    0
  )
  const allAttempts = Object.values(state.workspaces).flatMap((workspace) => workspace.quizAttempts)
  const courseSnapshots = state.courses
    .map((course) => getCourseAnalyticsById(state, course.id, now))
    .filter((course): course is CourseAnalytics => Boolean(course))
    .sort((left, right) => right.totalEnrollments - left.totalEnrollments)

  const progressDistribution = [
    { label: "0-24%", count: students.filter((student) => student.totalProgressPercent < 25).length },
    {
      label: "25-49%",
      count: students.filter(
        (student) =>
          student.totalProgressPercent >= 25 && student.totalProgressPercent < 50
      ).length,
    },
    {
      label: "50-74%",
      count: students.filter(
        (student) =>
          student.totalProgressPercent >= 50 && student.totalProgressPercent < 75
      ).length,
    },
    {
      label: "75-99%",
      count: students.filter(
        (student) =>
          student.totalProgressPercent >= 75 && student.totalProgressPercent < 100
      ).length,
    },
    { label: "100%", count: students.filter((student) => student.totalProgressPercent === 100).length },
  ]

  const engagementDistribution = [
    {
      label: "Active today",
      count: students.filter((student) => student.engagementState === "Active today").length,
    },
    {
      label: "Recently active",
      count: students.filter((student) => student.engagementState === "Recently active").length,
    },
    {
      label: "Inactive",
      count: students.filter((student) => student.engagementState === "Inactive").length,
    },
  ]

  const mostDifficultCourse =
    [...courseSnapshots]
      .filter((course) => course.totalEnrollments > 0)
      .sort((left, right) => left.averageProgress - right.averageProgress)[0]
      ?.course.title ?? null

  const allModules = courseSnapshots.flatMap((course) => course.moduleBreakdown)
  const mostDifficultModule =
    [...allModules]
      .filter((module) => module.lessonCount > 0)
      .sort((left, right) => left.averageCompletionPercent - right.averageCompletionPercent)[0]
      ?.title ?? null

  return {
    totalStudents: students.length,
    activeLearners: students.filter((student) => student.engagementState !== "Inactive").length,
    inactiveLearners: students.filter((student) => student.engagementState === "Inactive").length,
    activeToday: students.filter((student) => student.engagementState === "Active today").length,
    averageProgress: average(students.map((student) => student.totalProgressPercent)),
    completionRate: totalEnrollments
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0,
    averageQuizScore: allAttempts.length ? average(allAttempts.map((attempt) => attempt.score)) : 0,
    quizPassRate: allAttempts.length
      ? Math.round((allAttempts.filter((attempt) => attempt.passed).length / allAttempts.length) * 100)
      : 0,
    certificatesIssued: students.reduce(
      (total, student) => total + student.certificatesIssued,
      0
    ),
    atRiskStudents: students.filter((student) => student.atRisk).length,
    readyToApplyStudents: students.filter(
      (student) => student.readinessState === "Ready to apply"
    ).length,
    progressDistribution,
    engagementDistribution,
    courseSnapshots: courseSnapshots.map((course) => ({
      courseId: course.course.id,
      title: course.course.title,
      enrollments: course.totalEnrollments,
      completionRate: course.completionRate,
      averageProgress: course.averageProgress,
      atRiskStudents: course.atRiskStudents,
    })),
    atRiskLearners: students.filter((student) => student.atRisk).slice(0, 5),
    readyLearners: students
      .filter((student) => student.readinessState === "Ready to apply")
      .slice(0, 5),
    studentSummaries: students,
    mostDifficultCourse,
    mostDifficultModule,
  } satisfies PlatformAnalytics
}

import type {
  CVProject,
  Certificate,
  Course,
  CourseEnrollment,
  CourseMatch,
  CourseLesson,
  LearningCategory,
  Quiz,
  QuizAttempt,
  StudentProfile,
  UserWorkspace,
} from "@/types"

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

export function getCourseById(courses: Course[], courseId: string) {
  return courses.find((course) => course.id === courseId)
}

export function getCourseBySlug(courses: Course[], slug: string) {
  return courses.find((course) => course.slug === slug)
}

export function getAllLessons(course: Course) {
  return course.modules.flatMap((module) => module.lessons)
}

export function getLessonById(course: Course, lessonId: string) {
  return getAllLessons(course).find((lesson) => lesson.id === lessonId)
}

export function getModuleByLessonId(course: Course, lessonId: string) {
  return course.modules.find((module) =>
    module.lessons.some((lesson) => lesson.id === lessonId)
  )
}

export function getQuizById(quizzes: Quiz[], quizId: string) {
  return quizzes.find((quiz) => quiz.id === quizId)
}

export function getEnrollment(
  workspace: UserWorkspace | null | undefined,
  courseId: string
) {
  return workspace?.enrollments.find((enrollment) => enrollment.courseId === courseId)
}

export function getAttemptForQuiz(
  workspace: UserWorkspace | null | undefined,
  quizId: string
) {
  return workspace?.quizAttempts
    .filter((attempt) => attempt.quizId === quizId)
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt))[0]
}

export function getCourseProgress(course: Course, enrollment?: CourseEnrollment | null) {
  const lessons = getAllLessons(course)
  const completedLessonIds = enrollment?.completedLessonIds ?? []
  const completedLessons = lessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id)
  ).length
  const progressPercent = lessons.length
    ? Math.round((completedLessons / lessons.length) * 100)
    : 0
  const nextLesson =
    lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ??
    lessons[lessons.length - 1] ??
    null

  return {
    totalLessons: lessons.length,
    completedLessons,
    progressPercent,
    nextLesson,
    isCompleted: lessons.length > 0 && completedLessons === lessons.length,
  }
}

export function getEnrolledCourses(courses: Course[], workspace: UserWorkspace | null) {
  return (workspace?.enrollments ?? [])
    .map((enrollment) => getCourseById(courses, enrollment.courseId))
    .filter((course): course is Course => Boolean(course))
}

export function getCompletedCourses(courses: Course[], workspace: UserWorkspace | null) {
  return getEnrolledCourses(courses, workspace).filter((course) =>
    getCourseProgress(course, getEnrollment(workspace, course.id)).isCompleted
  )
}

export function getInProgressCourses(courses: Course[], workspace: UserWorkspace | null) {
  return getEnrolledCourses(courses, workspace).filter((course) => {
    const progress = getCourseProgress(course, getEnrollment(workspace, course.id))
    return progress.completedLessons > 0 && !progress.isCompleted
  })
}

export function getRecommendedCourses(
  profile: StudentProfile,
  courses: Course[],
  workspace: UserWorkspace | null
): CourseMatch[] {
  const completedCourseIds = new Set(
    getCompletedCourses(courses, workspace).map((course) => course.id)
  )
  const profileInterests = [
    ...profile.interests,
    ...profile.preferredRoles,
    ...profile.preferredInternshipFields,
    ...profile.learningFocus,
    ...profile.careerGoals,
  ].map(normalize)

  return courses
    .filter((course) => !completedCourseIds.has(course.id))
    .map((course) => {
      let matchScore = course.featured ? 24 : 18
      const reasons: string[] = []
      const courseCorpus = [
        course.title,
        course.category,
        course.shortDescription,
        course.description,
        ...course.skills,
        ...course.outcomes,
        ...course.internshipFocus,
      ]
        .join(" ")
        .toLowerCase()

      const matchingInterests = unique(
        profileInterests.filter((interest) => courseCorpus.includes(interest))
      )
      if (matchingInterests.length) {
        matchScore += matchingInterests.length * 9
        reasons.push(`Aligned with ${matchingInterests.slice(0, 2).join(" and ")}`)
      }

      const sharedSkills = course.skills.filter((skill) =>
        profile.skills.map(normalize).includes(normalize(skill))
      )
      if (sharedSkills.length) {
        matchScore += sharedSkills.length * 6
        reasons.push(`Builds on ${sharedSkills.slice(0, 2).join(" and ")}`)
      }

      if (workspace?.enrollments.some((enrollment) => enrollment.courseId === course.id)) {
        matchScore += 4
        reasons.push("Already started in your workspace")
      }

      if (course.category === "Career Readiness") {
        matchScore += 5
        reasons.push("Supports employability and internship prep")
      }

      return {
        ...course,
        matchScore,
        matchReasons: unique(reasons).slice(0, 3),
      }
    })
    .sort((left, right) => right.matchScore - left.matchScore)
}

export function deriveLearningSkills(courses: Course[], workspace: UserWorkspace | null) {
  const skills = (workspace?.enrollments ?? []).flatMap((enrollment) => {
    const course = getCourseById(courses, enrollment.courseId)
    return course?.skills ?? []
  })

  return unique(skills)
}

export function deriveRecommendedCategories(
  courses: Course[],
  workspace: UserWorkspace | null
) {
  const categories = (workspace?.enrollments ?? [])
    .map((enrollment) => getCourseById(courses, enrollment.courseId)?.category)
    .filter((category): category is LearningCategory => Boolean(category))

  return unique(categories)
}

export function getRelatedCourses(courses: Course[], course: Course, limit = 3) {
  return courses
    .filter((candidate) => candidate.id !== course.id)
    .map((candidate) => {
      let score = candidate.category === course.category ? 16 : 0
      const sharedSkills = candidate.skills.filter((skill) =>
        course.skills.map(normalize).includes(normalize(skill))
      )
      score += sharedSkills.length * 4
      if (candidate.level === course.level) {
        score += 3
      }

      return {
        course: candidate,
        score,
      }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.course)
}

export function getCertificateForCourse(
  workspace: UserWorkspace | null | undefined,
  courseId: string
) {
  return workspace?.certificates.find((certificate) => certificate.courseId === courseId)
}

export function deriveCourseProjects(courses: Course[], workspace: UserWorkspace | null) {
  return getCompletedCourses(courses, workspace).slice(0, 3).map<CVProject>((course) => ({
    id: `course-project-${course.id}`,
    title: `${course.title} Capstone`,
    role: "Learner Builder",
    summary: `Completed guided practical work in ${course.category.toLowerCase()} and translated lessons into a portfolio-ready project.`,
    impact: `Finished ${getAllLessons(course).length} lessons and earned a Tetisol certificate backed by hands-on assessments.`,
    stack: course.skills.slice(0, 4),
    sourceCourseId: course.id,
  }))
}

export function deriveLearningAchievements(courses: Course[], workspace: UserWorkspace | null) {
  const completedCourses = getCompletedCourses(courses, workspace)

  return completedCourses.map((course) => {
    const progress = getCourseProgress(course, getEnrollment(workspace, course.id))
    return `Completed ${course.title} and finished ${progress.totalLessons} structured lessons in ${course.category.toLowerCase()}.`
  })
}

export function deriveCertificateCvEntries(courses: Course[], certificates: Certificate[]) {
  return certificates.map((certificate) => ({
    id: `cv-cert-${certificate.id}`,
    courseName:
      getCourseById(courses, certificate.courseId)?.title ?? "Tetisol Course",
    issuer: "Tetisol",
    issuedAt: certificate.issuedAt,
    credentialId: certificate.certificateNumber,
  }))
}

export function getNextLearningReminder(
  course: Course,
  workspace: UserWorkspace | null
) {
  const progress = getCourseProgress(course, getEnrollment(workspace, course.id))

  if (progress.isCompleted || !progress.nextLesson) {
    return null
  }

  return {
    title: `Resume ${course.title}`,
    description: `Next lesson: ${progress.nextLesson.title}`,
    href: `/learning/${course.slug}`,
  }
}

export function getLatestQuizAttempt(
  attempts: QuizAttempt[],
  quizId: string
) {
  return attempts
    .filter((attempt) => attempt.quizId === quizId)
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt))[0]
}

export function getLessonNote(
  workspace: UserWorkspace | null | undefined,
  lessonId: string
) {
  return workspace?.learningNotes.find((note) => note.lessonId === lessonId)
}

export function getLessonTypeLabel(lesson: CourseLesson) {
  if (lesson.type === "Quiz") {
    return "Assessment"
  }

  return lesson.type
}

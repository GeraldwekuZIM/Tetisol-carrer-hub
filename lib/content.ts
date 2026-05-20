import {
  courseLevels,
  internshipCategories,
  internshipModes,
  learningCategories,
} from "@/types"
import type {
  ContentStatus,
  Course,
  CourseModule,
  Internship,
  InternshipListingType,
  Quiz,
} from "@/types"

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function getContentStatus(status?: ContentStatus): ContentStatus {
  return status ?? "Published"
}

export function isPublishedStatus(status?: ContentStatus) {
  return getContentStatus(status) === "Published"
}

export function getInternshipListingType(
  type?: InternshipListingType
): InternshipListingType {
  return type ?? "Internship"
}

export function getPublishedCourses(courses: Course[]) {
  return courses.filter((course) => isPublishedStatus(course.status))
}

export function getPublishedInternships(internships: Internship[]) {
  return internships.filter((internship) => isPublishedStatus(internship.status))
}

export function getActiveInternships(internships: Internship[]) {
  const today = todayIso()
  return internships.filter(
    (internship) =>
      isPublishedStatus(internship.status) && internship.deadline >= today
  )
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function normalizeModules(modules: CourseModule[]) {
  return [...modules]
    .sort((left, right) => (left.orderIndex ?? 0) - (right.orderIndex ?? 0))
    .map((module, moduleIndex) => ({
      ...module,
      orderIndex: module.orderIndex ?? moduleIndex,
      lessons: [...module.lessons]
        .sort((left, right) => (left.orderIndex ?? 0) - (right.orderIndex ?? 0))
        .map((lesson, lessonIndex) => ({
          ...lesson,
          orderIndex: lesson.orderIndex ?? lessonIndex,
          published: lesson.published ?? true,
        })),
    }))
}

export function normalizeCourseForAdmin(course: Course): Course {
  return {
    ...course,
    status: getContentStatus(course.status),
    thumbnail: course.thumbnail ?? "",
    collaborators: course.collaborators ?? [],
    modules: normalizeModules(course.modules),
  }
}

export function normalizeInternshipForAdmin(internship: Internship): Internship {
  return {
    ...internship,
    shortDescription: internship.shortDescription ?? internship.description,
    fullDescription: internship.fullDescription ?? internship.description,
    preferredQualifications: internship.preferredQualifications ?? [],
    applicationLink: internship.applicationLink ?? "",
    type: getInternshipListingType(internship.type),
    status: getContentStatus(internship.status),
  }
}

export function getCourseQuizzes(quizzes: Quiz[], courseId: string) {
  return quizzes.filter((quiz) => quiz.courseId === courseId)
}

export function createEmptyAdminCourse(): Course {
  return {
    id: "",
    slug: "",
    title: "",
    category: learningCategories[0],
    level: courseLevels[0],
    duration: "4h 00m",
    durationHours: 4,
    shortDescription: "",
    description: "",
    rating: 4.7,
    reviewCount: 0,
    instructor: {
      name: "Tetisol Team",
      role: "Program Lead",
      company: "Tetisol",
      bio: "Internal course owner.",
    },
    collaborators: [],
    skills: [],
    outcomes: [],
    prerequisites: [],
    modules: [],
    certificateAvailable: true,
    featured: false,
    popular: false,
    isNew: true,
    heroGradient: "from-indigo-600 via-indigo-500 to-sky-400",
    internshipFocus: [],
    updatedAt: todayIso(),
    status: "Draft",
    thumbnail: "",
  }
}

export function createEmptyInternship(): Internship {
  return {
    id: "",
    slug: "",
    title: "",
    company: "",
    location: "Remote",
    mode: internshipModes[0],
    category: internshipCategories[0],
    level: courseLevels[0],
    stipend: "USD 0/month",
    duration: "12 weeks",
    deadline: todayIso(),
    postedAt: todayIso(),
    description: "",
    shortDescription: "",
    fullDescription: "",
    skills: [],
    interests: [],
    responsibilities: [],
    requirements: [],
    preferredQualifications: [],
    applicationLink: "",
    type: "Internship",
    status: "Draft",
  }
}

import type { SupabaseClient, User } from "@supabase/supabase-js"

import { normalizeCourseForAdmin, normalizeInternshipForAdmin, slugify } from "@/lib/content"
import { mapSupabaseRole } from "@/lib/supabase"
import type {
  CareerHubState,
  Course,
  CourseLevel,
  CVDocument,
  CVInput,
  Internship,
  InternshipCategory,
  InternshipMode,
  LearningCategory,
  StudentProfile,
  UserAccount,
  UserWorkspace,
} from "@/types"

type ProfileRow = {
  id: string
  full_name: string | null
  email: string | null
  role: string | null
  avatar_url?: string | null
  department?: string | null
  student_number?: string | null
  lecturer_number?: string | null
}

type LessonRow = {
  id: string
  course_id: string
  title: string
  content: string | null
  video_url: string | null
  lesson_order: number | null
  duration_minutes: number | null
}

type CourseRow = {
  id: string
  title: string
  slug: string | null
  description: string | null
  category: string | null
  level: string | null
  instructor_id: string | null
  thumbnail_url: string | null
  status: string | null
  updated_at: string | null
  profiles?: Pick<ProfileRow, "full_name" | "email" | "department"> | null
  lessons?: LessonRow[]
}

type OpportunityRow = {
  id: string
  title: string
  company: string | null
  description: string | null
  location: string | null
  type: string | null
  deadline: string | null
  created_at: string | null
}

type EnrollmentRow = {
  id: string
  course_id: string
  status: string | null
  enrolled_at: string | null
}

type ProgressRow = {
  course_id: string
  lesson_id: string
  completed: boolean | null
  progress_percent: number | null
  completed_at: string | null
  updated_at: string | null
}

type SavedOpportunityRow = {
  opportunity_id: string
}

type CvProfileRow = {
  id: string
  student_id: string
  summary: string | null
  skills: string[] | null
  education: unknown
  experience: unknown
  projects: unknown
  updated_at: string | null
}

type NotificationRow = {
  id: string
  title: string
  message: string
  created_at: string | null
}

const learningCategoryFallback: LearningCategory = "Career Readiness"
const courseLevelFallback: CourseLevel = "Beginner"
const internshipCategoryFallback: InternshipCategory = "Engineering"

function asLearningCategory(value: string | null | undefined): LearningCategory {
  const normalized = value?.trim()
  const known = [
    "Artificial Intelligence",
    "Prompt Engineering",
    "Cybersecurity",
    "Software Engineering",
    "Web Development",
    "Data Analytics",
    "Cloud Computing",
    "UI/UX Design",
    "Digital Marketing",
    "IT Support",
    "Career Readiness",
  ]

  return known.includes(normalized ?? "")
    ? (normalized as LearningCategory)
    : learningCategoryFallback
}

function asCourseLevel(value: string | null | undefined): CourseLevel {
  return value === "Intermediate" || value === "Advanced" ? value : courseLevelFallback
}

function asInternshipCategory(value: string | null | undefined): InternshipCategory {
  const normalized = value?.trim()
  const known = [
    "Engineering",
    "Data",
    "Security",
    "Product",
    "Design",
    "Marketing",
    "Cloud",
    "IT Support",
    "AI",
  ]

  return known.includes(normalized ?? "")
    ? (normalized as InternshipCategory)
    : internshipCategoryFallback
}

function asInternshipMode(value: string | null | undefined): InternshipMode {
  if (value === "Remote" || value === "Hybrid" || value === "Onsite") {
    return value
  }

  return "Remote"
}

function firstSentence(value: string | null | undefined, fallback: string) {
  const text = value?.trim()
  if (!text) {
    return fallback
  }

  return text.split(/[.!?]/)[0]?.trim() || fallback
}

function dateOnly(value: string | null | undefined) {
  return value?.slice(0, 10) || new Date().toISOString().slice(0, 10)
}

function emptyCv(id: string): CVDocument {
  return {
    id,
    headline: "",
    summary: "",
    education: "",
    skills: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    score: 0,
    suggestions: [
      "Add a focused headline.",
      "Add skills, education, experience, and practical projects.",
    ],
    lastUpdated: new Date().toISOString(),
  }
}

function normalizeJsonArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => (typeof item === "string" ? item : ""))
    .filter(Boolean)
}

function mapCvProjects(value: unknown): CVDocument["projects"] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((project, index) => ({
      id: typeof project.id === "string" ? project.id : `project-${index + 1}`,
      title: typeof project.title === "string" ? project.title : "",
      role: typeof project.role === "string" ? project.role : "",
      summary: typeof project.summary === "string" ? project.summary : "",
      impact: typeof project.impact === "string" ? project.impact : "",
      stack: normalizeJsonArray(project.stack),
      sourceCourseId:
        typeof project.sourceCourseId === "string" ? project.sourceCourseId : undefined,
    }))
}

function mapCvProfile(row: CvProfileRow | null | undefined, profileId: string): CVDocument {
  if (!row) {
    return emptyCv(`cv-${profileId}`)
  }

  return {
    ...emptyCv(row.id),
    summary: row.summary ?? "",
    education: normalizeJsonArray(row.education).join("\n"),
    experience: normalizeJsonArray(row.experience),
    projects: mapCvProjects(row.projects),
    skills: row.skills ?? [],
    lastUpdated: row.updated_at ?? new Date().toISOString(),
  }
}

function mapProfile(row: ProfileRow | null | undefined, user?: User | null): UserAccount {
  const email = row?.email ?? user?.email ?? ""
  const fullName =
    row?.full_name ?? user?.user_metadata?.full_name ?? email.split("@")[0] ?? "Tetisol User"

  return {
    id: row?.id ?? user?.id ?? "anonymous",
    email,
    password: "",
    fullName,
    role: mapSupabaseRole(row?.role),
  }
}

function mapStudentProfile(row: ProfileRow | null | undefined, user?: User | null): StudentProfile {
  const fullName =
    row?.full_name ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? ""

  return {
    name: fullName,
    school: row?.department ?? "",
    degree: "",
    location: "",
    bio: "",
    skills: [],
    interests: [],
    preferredRoles: [],
    availability: "Available for learning and opportunities",
    preferredInternshipFields: [],
    learningFocus: [],
    careerGoals: [],
  }
}

function createWorkspace({
  profileRow,
  user,
  enrollments,
  progress,
  saved,
  cvProfile,
  notifications,
}: {
  profileRow: ProfileRow | null
  user: User
  enrollments: EnrollmentRow[]
  progress: ProgressRow[]
  saved: SavedOpportunityRow[]
  cvProfile: CvProfileRow | null
  notifications: NotificationRow[]
}): UserWorkspace {
  return {
    profile: mapStudentProfile(profileRow, user),
    preferences: {
      preferredLocations: [],
      preferredInternshipFields: [],
      preferredLearningCategories: [],
      weeklyLearningGoalHours: 5,
      internshipPriority: "Balanced",
    },
    savedInternshipIds: saved.map((item) => item.opportunity_id),
    applications: [],
    cv: mapCvProfile(cvProfile, user.id),
    enrollments: enrollments.map((enrollment) => {
      const courseProgress = progress.filter((item) => item.course_id === enrollment.course_id)
      const completed = courseProgress.filter((item) => item.completed)
      const latest = [...courseProgress].sort((left, right) =>
        (right.updated_at ?? "").localeCompare(left.updated_at ?? "")
      )[0]

      return {
        id: enrollment.id,
        courseId: enrollment.course_id,
        enrolledAt: enrollment.enrolled_at ?? new Date().toISOString(),
        startedAt: enrollment.enrolled_at ?? new Date().toISOString(),
        completedAt: null,
        completedLessonIds: completed.map((item) => item.lesson_id),
        lastLessonId: latest?.lesson_id ?? null,
        lastActivityAt: latest?.updated_at ?? enrollment.enrolled_at ?? new Date().toISOString(),
      }
    }),
    quizAttempts: [],
    certificates: [],
    learningNotes: [],
    reminders: notifications.slice(0, 6).map((notification) => ({
      id: notification.id,
      kind: "Application",
      title: notification.title,
      description: notification.message,
      date: dateOnly(notification.created_at),
      href: "/dashboard",
    })),
    onboardingCompleted: Boolean(profileRow?.full_name),
  }
}

function mapCourse(row: CourseRow): Course {
  const lessons = [...(row.lessons ?? [])].sort(
    (left, right) => (left.lesson_order ?? 0) - (right.lesson_order ?? 0)
  )
  const durationMinutes = lessons.reduce(
    (total, lesson) => total + (lesson.duration_minutes ?? 15),
    0
  )
  const durationHours = Math.max(1, Math.round((durationMinutes / 60) * 10) / 10)
  const instructorName = row.profiles?.full_name ?? "Tetisol Lecturer"

  return normalizeCourseForAdmin({
    id: row.id,
    slug: row.slug || slugify(row.title),
    title: row.title,
    category: asLearningCategory(row.category),
    level: asCourseLevel(row.level),
    duration: `${durationHours}h`,
    durationHours,
    shortDescription: firstSentence(row.description, "Structured Tetisol course."),
    description: row.description ?? "Structured Tetisol course content.",
    rating: 4.7,
    reviewCount: 0,
    instructor: {
      name: instructorName,
      role: "Lecturer",
      company: row.profiles?.department ?? "Tetisol Hub",
      bio: `${instructorName} facilitates this Tetisol course.`,
    },
    collaborators: [],
    skills: [row.category ?? "Career readiness"].filter(Boolean),
    outcomes: [
      "Complete practical lessons",
      "Track learning progress",
      "Build evidence for opportunities",
    ],
    prerequisites: [],
    modules: [
      {
        id: `module-${row.id}`,
        title: "Course lessons",
        summary: "Supabase-backed lesson sequence for this course.",
        estimatedTime: `${durationMinutes || 60} min`,
        orderIndex: 0,
        lessons: lessons.map((lesson, index) => ({
          id: lesson.id,
          slug: slugify(lesson.title) || `lesson-${index + 1}`,
          title: lesson.title,
          type: lesson.video_url ? "Video" : "Text",
          duration: `${lesson.duration_minutes ?? 15} min`,
          objective: firstSentence(lesson.content, "Complete this lesson."),
          summary: firstSentence(lesson.content, "Course lesson."),
          content: lesson.content ? [lesson.content] : ["Lesson content will be added by the lecturer."],
          orderIndex: index,
          published: true,
        })),
      },
    ],
    certificateAvailable: true,
    featured: false,
    popular: false,
    isNew: false,
    heroGradient: "from-emerald-600 via-sky-600 to-indigo-600",
    internshipFocus: [row.category ?? "Career readiness"].filter(Boolean),
    updatedAt: dateOnly(row.updated_at),
    status: row.status === "draft" ? "Draft" : row.status === "archived" ? "Archived" : "Published",
    thumbnail: row.thumbnail_url ?? "",
  })
}

function mapOpportunity(row: OpportunityRow): Internship {
  const type = row.type ?? "Internship"

  return normalizeInternshipForAdmin({
    id: row.id,
    slug: slugify(row.title),
    title: row.title,
    company: row.company ?? "Tetisol Partner",
    location: row.location ?? "Remote",
    mode: asInternshipMode(row.location === "Remote" ? "Remote" : "Hybrid"),
    category: asInternshipCategory(type),
    level: "Beginner",
    stipend: "See opportunity details",
    duration: "Flexible",
    deadline: row.deadline ?? new Date().toISOString().slice(0, 10),
    postedAt: dateOnly(row.created_at),
    description: row.description ?? "Opportunity details will be updated by the Tetisol team.",
    shortDescription: firstSentence(row.description, "Tetisol opportunity."),
    fullDescription: row.description ?? "Opportunity details will be updated by the Tetisol team.",
    skills: [type].filter(Boolean),
    interests: [type].filter(Boolean),
    responsibilities: ["Review the role details and prepare a focused application."],
    requirements: ["Complete your profile and CV before applying."],
    preferredQualifications: [],
    applicationLink: "",
    type: type.includes("Graduate") ? "Graduate Program" : "Internship",
    status: "Published",
  })
}

export function createRemoteInitialState(): CareerHubState {
  return {
    users: [],
    activeUserId: null,
    internships: [],
    courses: [],
    quizzes: [],
    workspaces: {},
  }
}

export async function loadSupabaseCareerHubState(
  client: SupabaseClient,
  user: User | null
): Promise<CareerHubState> {
  const state = createRemoteInitialState()

  const [coursesResult, opportunitiesResult] = await Promise.all([
    client
      .from("courses")
      .select("*, profiles:instructor_id(full_name,email,department), lessons(*)")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    client.from("opportunities").select("*").order("created_at", { ascending: false }),
  ])

  if (coursesResult.error) {
    throw new Error(`Courses query failed: ${coursesResult.error.message}`)
  }

  state.courses = ((coursesResult.data ?? []) as CourseRow[]).map(mapCourse)
  state.internships = ((opportunitiesResult.data ?? []) as OpportunityRow[]).map(mapOpportunity)

  if (!user) {
    return state
  }

  const [
    profileResult,
    enrollmentsResult,
    progressResult,
    savedResult,
    cvResult,
    notificationsResult,
  ] = await Promise.all([
    client.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    client.from("enrollments").select("*").eq("student_id", user.id),
    client.from("lesson_progress").select("*").eq("student_id", user.id),
    client.from("saved_opportunities").select("opportunity_id").eq("student_id", user.id),
    client.from("cv_profiles").select("*").eq("student_id", user.id).maybeSingle(),
    client.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ])

  if (profileResult.error) {
    throw new Error(`Profile query failed: ${profileResult.error.message}`)
  }

  const profileRow = (profileResult.data as ProfileRow | null) ?? null
  const account = mapProfile(profileRow, user)
  state.users = [account]
  state.activeUserId = user.id
  state.workspaces[user.id] = createWorkspace({
    profileRow,
    user,
    enrollments: (enrollmentsResult.data ?? []) as EnrollmentRow[],
    progress: (progressResult.data ?? []) as ProgressRow[],
    saved: (savedResult.data ?? []) as SavedOpportunityRow[],
    cvProfile: (cvResult.data as CvProfileRow | null) ?? null,
    notifications: (notificationsResult.data ?? []) as NotificationRow[],
  })

  return state
}

export async function persistSupabaseEnrollment(
  client: SupabaseClient,
  studentId: string,
  courseId: string
) {
  const { error } = await client
    .from("enrollments")
    .upsert(
      {
        student_id: studentId,
        course_id: courseId,
        status: "active",
      },
      { onConflict: "student_id,course_id" }
    )

  if (error) {
    throw error
  }
}

export async function persistSupabaseLessonProgress(
  client: SupabaseClient,
  studentId: string,
  courseId: string,
  lessonId: string
) {
  const { error } = await client
    .from("lesson_progress")
    .upsert(
      {
        student_id: studentId,
        course_id: courseId,
        lesson_id: lessonId,
        completed: true,
        progress_percent: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "student_id,lesson_id" }
    )

  if (error) {
    throw error
  }
}

export async function persistSupabaseSavedOpportunity(
  client: SupabaseClient,
  studentId: string,
  opportunityId: string,
  shouldSave: boolean
) {
  if (shouldSave) {
    const { error } = await client
      .from("saved_opportunities")
      .upsert(
        {
          student_id: studentId,
          opportunity_id: opportunityId,
        },
        { onConflict: "student_id,opportunity_id" }
      )

    if (error) {
      throw error
    }
    return
  }

  const { error } = await client
    .from("saved_opportunities")
    .delete()
    .eq("student_id", studentId)
    .eq("opportunity_id", opportunityId)

  if (error) {
    throw error
  }
}

export async function persistSupabaseProfile(
  client: SupabaseClient,
  studentId: string,
  profile: StudentProfile
) {
  const { error } = await client
    .from("profiles")
    .update({
      full_name: profile.name,
      department: profile.school || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", studentId)

  if (error) {
    throw error
  }
}

export async function persistSupabaseCv(
  client: SupabaseClient,
  studentId: string,
  cv: CVInput
) {
  const { error } = await client
    .from("cv_profiles")
    .upsert(
      {
        student_id: studentId,
        summary: [cv.headline, cv.summary].filter(Boolean).join("\n\n"),
        skills: cv.skills,
        education: cv.education ? [cv.education] : [],
        experience: cv.experience,
        projects: cv.projects,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "student_id" }
    )

  if (error) {
    throw error
  }
}

import type { SupabaseClient } from "@supabase/supabase-js"

export type TetisolRole = "student" | "lecturer" | "admin"

export type ProfileRow = {
  id: string
  full_name: string
  email: string
  role: TetisolRole
  avatar_url: string | null
  department: string | null
  student_number: string | null
  lecturer_number: string | null
  created_at: string
  updated_at: string
}

export type CourseRow = {
  id: string
  title: string
  slug: string
  description: string
  category: string
  level: string
  instructor_id: string | null
  thumbnail_url: string | null
  status: "draft" | "published" | "archived"
  created_at: string
  updated_at: string
}

export type LessonRow = {
  id: string
  course_id: string
  title: string
  content: string
  video_url: string | null
  lesson_order: number
  duration_minutes: number
  created_at: string
}

export type EnrollmentRow = {
  id: string
  student_id: string
  course_id: string
  status: string
  enrolled_at: string
}

export type LessonProgressRow = {
  id: string
  student_id: string
  course_id: string
  lesson_id: string
  completed: boolean
  progress_percent: number
  completed_at: string | null
  updated_at: string
}

export type AttendanceRecordRow = {
  id: string
  student_id: string
  course_id: string
  lecturer_id: string | null
  session_title: string
  attended: boolean
  attended_at: string
}

export type OpportunityRow = {
  id: string
  title: string
  company: string
  description: string
  location: string
  type: string
  deadline: string | null
  posted_by: string | null
  created_at: string
}

export type CvProfileRow = {
  id: string
  student_id: string
  summary: string
  skills: string[]
  education: unknown
  experience: unknown
  projects: unknown
  updated_at: string
}

export type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: string }

export type TetisolSupabaseClient = SupabaseClient

export async function safeQuery<T>(
  query: PromiseLike<{ data: T | null; error: { message: string } | null }>
): Promise<ServiceResult<T>> {
  try {
    const { data, error } = await query
    if (error) {
      return { data: null, error: error.message }
    }
    if (data === null) {
      return { data: null, error: "No data returned from Supabase." }
    }
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unexpected Supabase error.",
    }
  }
}

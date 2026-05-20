import type { SupabaseClient } from "@supabase/supabase-js"

import type { ApplicationStatus } from "@/types"

type DatabaseResult<T> =
  | { data: T; error: null }
  | { data: null; error: string }

type AwaitableDatabaseResponse<T> = PromiseLike<{
  data: T | null
  error: { message: string } | null
}>

async function runQuery<T>(
  operation: () => AwaitableDatabaseResponse<T>
): Promise<DatabaseResult<T>> {
  try {
    const { data, error } = await operation()
    if (error) {
      return { data: null, error: error.message }
    }

    if (data === null) {
      return { data: null, error: "No database record was returned." }
    }

    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unexpected database error",
    }
  }
}

export function createCareerHubDatabaseService(client: SupabaseClient) {
  return {
    getCourseCatalog() {
      return runQuery(() =>
        client
          .from("courses")
          .select("id, slug, title, category, level, duration_text, short_description, instructor_name, featured, popular, is_new, updated_at")
          .eq("status", "Published")
          .order("featured", { ascending: false })
          .order("updated_at", { ascending: false })
      )
    },

    getCourseWithLessons(slug: string) {
      return runQuery(() =>
        client
          .from("courses")
          .select("*, course_modules(*, course_lessons(*)), course_collaborators(*)")
          .eq("slug", slug)
          .single()
      )
    },

    getStudentDashboard(userId: string) {
      return runQuery(() =>
        client
          .from("course_enrollments")
          .select("*, courses(id, slug, title, category), lesson_progress(*)")
          .eq("user_id", userId)
          .order("last_activity_at", { ascending: false })
      )
    },

    upsertEnrollment(userId: string, courseId: string) {
      return runQuery(() =>
        client
          .from("course_enrollments")
          .upsert(
            {
              user_id: userId,
              course_id: courseId,
              last_activity_at: new Date().toISOString(),
            },
            { onConflict: "user_id,course_id" }
          )
          .select()
          .single()
      )
    },

    upsertLessonProgress(payload: {
      enrollmentId: string
      lessonId: string
      completedAt?: string | null
      note?: string
    }) {
      return runQuery(() =>
        client
          .from("lesson_progress")
          .upsert(
            {
              enrollment_id: payload.enrollmentId,
              lesson_id: payload.lessonId,
              completed_at: payload.completedAt ?? new Date().toISOString(),
              note: payload.note ?? "",
            },
            { onConflict: "enrollment_id,lesson_id" }
          )
          .select()
          .single()
      )
    },

    getLecturerParticipation(courseId: string) {
      return runQuery(() =>
        client
          .from("participation_records")
          .select("*, profiles(id, name, school), courses(id, title)")
          .eq("course_id", courseId)
          .order("participated_at", { ascending: false })
          .limit(200)
      )
    },

    getAdminAnalyticsSnapshot() {
      return runQuery(() =>
        client
          .from("platform_activity_summary")
          .select("*")
          .single()
      )
    },

    saveOpportunityApplication(payload: {
      userId: string
      internshipId: string
      status: ApplicationStatus
      notes?: string
      deadline?: string
    }) {
      return runQuery(() =>
        client
          .from("tracked_applications")
          .upsert({
            user_id: payload.userId,
            internship_id: payload.internshipId,
            status: payload.status,
            notes: payload.notes ?? "",
            deadline: payload.deadline || null,
          })
          .select()
          .single()
      )
    },
  }
}

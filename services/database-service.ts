import type { SupabaseClient } from "@supabase/supabase-js"

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
          .select("id, slug, title, category, level, description, thumbnail_url, instructor_id, updated_at")
          .eq("status", "published")
          .order("updated_at", { ascending: false })
      )
    },

    getCourseWithLessons(slug: string) {
      return runQuery(() =>
        client
          .from("courses")
          .select("*, lessons(*)")
          .eq("slug", slug)
          .single()
      )
    },

    getStudentDashboard(userId: string) {
      return runQuery(() =>
        client
          .from("enrollments")
          .select("*, courses(id, slug, title, category), lesson_progress(*)")
          .eq("student_id", userId)
          .order("enrolled_at", { ascending: false })
      )
    },

    upsertEnrollment(userId: string, courseId: string) {
      return runQuery(() =>
        client
          .from("enrollments")
          .upsert(
            {
              student_id: userId,
              course_id: courseId,
            },
            { onConflict: "student_id,course_id" }
          )
          .select()
          .single()
      )
    },

    upsertLessonProgress(payload: {
      studentId: string
      courseId: string
      lessonId: string
      progressPercent: number
    }) {
      return runQuery(() =>
        client
          .from("lesson_progress")
          .upsert(
            {
              student_id: payload.studentId,
              course_id: payload.courseId,
              lesson_id: payload.lessonId,
              progress_percent: payload.progressPercent,
              completed: payload.progressPercent >= 100,
              completed_at:
                payload.progressPercent >= 100 ? new Date().toISOString() : null,
            },
            { onConflict: "student_id,lesson_id" }
          )
          .select()
          .single()
      )
    },

    getLecturerParticipation(courseId: string) {
      return runQuery(() =>
        client
          .from("attendance_records")
          .select("*, profiles!attendance_records_student_id_fkey(id, full_name, email), courses(id, title)")
          .eq("course_id", courseId)
          .order("attended_at", { ascending: false })
          .limit(200)
      )
    },

    getAdminAnalyticsSnapshot() {
      return runQuery(() =>
        client
          .from("admin_platform_summary")
          .select("*")
          .single()
      )
    },

    saveOpportunity(payload: {
      userId: string
      opportunityId: string
    }) {
      return runQuery(() =>
        client
          .from("saved_opportunities")
          .upsert(
            {
              student_id: payload.userId,
              opportunity_id: payload.opportunityId,
            },
            { onConflict: "student_id,opportunity_id" }
          )
          .select()
          .single()
      )
    },
  }
}

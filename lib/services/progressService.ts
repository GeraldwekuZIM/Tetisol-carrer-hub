import type {
  LessonProgressRow,
  ServiceResult,
  TetisolSupabaseClient,
} from "@/lib/services/supabase-service-types"
import { safeQuery } from "@/lib/services/supabase-service-types"

export function createProgressService(client: TetisolSupabaseClient) {
  return {
    listStudentProgress(studentId: string): Promise<ServiceResult<LessonProgressRow[]>> {
      return safeQuery(
        client
          .from("lesson_progress")
          .select("*")
          .eq("student_id", studentId)
          .order("updated_at", { ascending: false })
      )
    },

    updateLessonProgress(params: {
      studentId: string
      courseId: string
      lessonId: string
      progressPercent: number
      completed?: boolean
    }): Promise<ServiceResult<LessonProgressRow>> {
      const completed = params.completed ?? params.progressPercent >= 100

      return safeQuery(
        client
          .from("lesson_progress")
          .upsert(
            {
              student_id: params.studentId,
              course_id: params.courseId,
              lesson_id: params.lessonId,
              progress_percent: params.progressPercent,
              completed,
              completed_at: completed ? new Date().toISOString() : null,
            },
            { onConflict: "student_id,lesson_id" }
          )
          .select()
          .single()
      )
    },
  }
}

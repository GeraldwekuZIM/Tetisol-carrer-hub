import type {
  EnrollmentRow,
  ServiceResult,
  TetisolSupabaseClient,
} from "@/lib/services/supabase-service-types"
import { safeQuery } from "@/lib/services/supabase-service-types"

export function createEnrollmentService(client: TetisolSupabaseClient) {
  return {
    listStudentEnrollments(studentId: string): Promise<ServiceResult<EnrollmentRow[]>> {
      return safeQuery(
        client
          .from("enrollments")
          .select("*, courses(*)")
          .eq("student_id", studentId)
          .order("enrolled_at", { ascending: false })
      )
    },

    enrollStudent(studentId: string, courseId: string): Promise<ServiceResult<EnrollmentRow>> {
      return safeQuery(
        client
          .from("enrollments")
          .upsert({ student_id: studentId, course_id: courseId }, { onConflict: "student_id,course_id" })
          .select()
          .single()
      )
    },
  }
}

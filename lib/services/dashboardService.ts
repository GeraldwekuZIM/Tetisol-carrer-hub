import type { ServiceResult, TetisolSupabaseClient } from "@/lib/services/supabase-service-types"
import { safeQuery } from "@/lib/services/supabase-service-types"

export function createDashboardService(client: TetisolSupabaseClient) {
  return {
    getStudentDashboard(studentId: string): Promise<ServiceResult<unknown>> {
      return safeQuery(
        client
          .from("enrollments")
          .select("*, courses(*), lesson_progress(*)")
          .eq("student_id", studentId)
          .order("enrolled_at", { ascending: false })
      )
    },

    getLecturerDashboard(lecturerId: string): Promise<ServiceResult<unknown>> {
      return safeQuery(
        client
          .from("courses")
          .select("*, enrollments(*, profiles(id, full_name, email)), assignments(*), attendance_records(*)")
          .eq("instructor_id", lecturerId)
      )
    },

    getAdminSummary(): Promise<ServiceResult<unknown>> {
      return safeQuery(client.from("admin_platform_summary").select("*").single())
    },
  }
}

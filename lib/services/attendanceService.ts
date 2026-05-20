import type {
  AttendanceRecordRow,
  ServiceResult,
  TetisolSupabaseClient,
} from "@/lib/services/supabase-service-types"
import { safeQuery } from "@/lib/services/supabase-service-types"

export function createAttendanceService(client: TetisolSupabaseClient) {
  return {
    listCourseAttendance(courseId: string): Promise<ServiceResult<AttendanceRecordRow[]>> {
      return safeQuery(
        client
          .from("attendance_records")
          .select("*, profiles!attendance_records_student_id_fkey(id, full_name, email)")
          .eq("course_id", courseId)
          .order("attended_at", { ascending: false })
      )
    },

    markAttendance(params: {
      studentId: string
      courseId: string
      lecturerId: string
      sessionTitle: string
      attended: boolean
    }): Promise<ServiceResult<AttendanceRecordRow>> {
      return safeQuery(
        client
          .from("attendance_records")
          .insert({
            student_id: params.studentId,
            course_id: params.courseId,
            lecturer_id: params.lecturerId,
            session_title: params.sessionTitle,
            attended: params.attended,
          })
          .select()
          .single()
      )
    },
  }
}

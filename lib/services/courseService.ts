import type {
  CourseRow,
  LessonRow,
  ServiceResult,
  TetisolSupabaseClient,
} from "@/lib/services/supabase-service-types"
import { safeQuery } from "@/lib/services/supabase-service-types"

export function createCourseService(client: TetisolSupabaseClient) {
  return {
    listPublishedCourses(): Promise<ServiceResult<CourseRow[]>> {
      return safeQuery(
        client
          .from("courses")
          .select("*")
          .eq("status", "published")
          .order("updated_at", { ascending: false })
      )
    },

    getCourseBySlug(slug: string): Promise<ServiceResult<CourseRow & { lessons: LessonRow[] }>> {
      return safeQuery(
        client
          .from("courses")
          .select("*, lessons(*)")
          .eq("slug", slug)
          .single()
      )
    },

    listLecturerCourses(lecturerId: string): Promise<ServiceResult<CourseRow[]>> {
      return safeQuery(
        client
          .from("courses")
          .select("*")
          .eq("instructor_id", lecturerId)
          .order("updated_at", { ascending: false })
      )
    },
  }
}

import type {
  CvProfileRow,
  ServiceResult,
  TetisolSupabaseClient,
} from "@/lib/services/supabase-service-types"
import { safeQuery } from "@/lib/services/supabase-service-types"

export function createCvService(client: TetisolSupabaseClient) {
  return {
    getStudentCv(studentId: string): Promise<ServiceResult<CvProfileRow>> {
      return safeQuery(
        client.from("cv_profiles").select("*").eq("student_id", studentId).single()
      )
    },

    upsertStudentCv(params: {
      studentId: string
      summary: string
      skills: string[]
      education: unknown
      experience: unknown
      projects: unknown
    }): Promise<ServiceResult<CvProfileRow>> {
      return safeQuery(
        client
          .from("cv_profiles")
          .upsert(
            {
              student_id: params.studentId,
              summary: params.summary,
              skills: params.skills,
              education: params.education,
              experience: params.experience,
              projects: params.projects,
            },
            { onConflict: "student_id" }
          )
          .select()
          .single()
      )
    },
  }
}

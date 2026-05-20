import type {
  OpportunityRow,
  ServiceResult,
  TetisolSupabaseClient,
} from "@/lib/services/supabase-service-types"
import { safeQuery } from "@/lib/services/supabase-service-types"

export function createOpportunityService(client: TetisolSupabaseClient) {
  return {
    listOpportunities(): Promise<ServiceResult<OpportunityRow[]>> {
      return safeQuery(
        client.from("opportunities").select("*").order("deadline", { ascending: true })
      )
    },

    saveOpportunity(studentId: string, opportunityId: string) {
      return safeQuery(
        client
          .from("saved_opportunities")
          .upsert(
            { student_id: studentId, opportunity_id: opportunityId },
            { onConflict: "student_id,opportunity_id" }
          )
          .select()
          .single()
      )
    },

    listSavedOpportunities(studentId: string) {
      return safeQuery(
        client
          .from("saved_opportunities")
          .select("*, opportunities(*)")
          .eq("student_id", studentId)
          .order("saved_at", { ascending: false })
      )
    },
  }
}

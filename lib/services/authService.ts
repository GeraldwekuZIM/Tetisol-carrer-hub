import { createClient } from "@/utils/supabase/client"
import type { ProfileRow, ServiceResult } from "@/lib/services/supabase-service-types"
import { safeQuery } from "@/lib/services/supabase-service-types"

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function signUpWithPassword(params: {
  fullName: string
  email: string
  password: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
      },
    },
  })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  return error ? { success: false, error: error.message } : { success: true, error: null }
}

export async function getCurrentProfile(): Promise<ServiceResult<ProfileRow>> {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { data: null, error: userError?.message ?? "No authenticated user." }
  }

  return safeQuery(
    supabase.from("profiles").select("*").eq("id", user.id).single()
  )
}

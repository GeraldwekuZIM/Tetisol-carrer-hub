"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient, User } from "@supabase/supabase-js"

let browserClient: SupabaseClient | null = null

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
}

export function getSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) {
    return null
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string
    )
  }

  return browserClient
}

export async function getSupabaseCurrentUser() {
  const client = getSupabaseBrowserClient()
  if (!client) {
    return null
  }

  const {
    data: { user },
  } = await client.auth.getUser()

  return user
}

export function mapSupabaseUser(user: User) {
  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      "Tetisol User",
  }
}

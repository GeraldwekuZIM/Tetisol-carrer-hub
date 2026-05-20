"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient, User } from "@supabase/supabase-js"

import type { UserRole } from "@/types"

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

export function mapSupabaseRole(role: string | null | undefined): UserRole {
  if (role === "admin") {
    return "admin"
  }

  if (role === "lecturer" || role === "instructor") {
    return "instructor"
  }

  return "student"
}

export async function getSupabaseCurrentProfile() {
  const client = getSupabaseBrowserClient()
  if (!client) {
    return null
  }

  const user = await getSupabaseCurrentUser()
  if (!user) {
    return null
  }

  const { data } = await client
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", user.id)
    .maybeSingle()

  return data
    ? {
        id: data.id as string,
        fullName: (data.full_name as string | null) ?? "",
        email: (data.email as string | null) ?? user.email ?? "",
        role: mapSupabaseRole(data.role as string | null),
      }
    : null
}

export async function ensureSupabaseProfile(payload: {
  id: string
  email: string
  fullName: string
  role?: "student" | "lecturer" | "admin"
}) {
  const client = getSupabaseBrowserClient()
  if (!client) {
    return null
  }

  const { data, error } = await client
    .from("profiles")
    .upsert(
      {
        id: payload.id,
        email: payload.email,
        full_name: payload.fullName,
        role: payload.role ?? "student",
      },
      { onConflict: "id" }
    )
    .select("id, full_name, email, role")
    .single()

  if (error) {
    return null
  }

  return {
    id: data.id as string,
    fullName: (data.full_name as string | null) ?? payload.fullName,
    email: (data.email as string | null) ?? payload.email,
    role: mapSupabaseRole(data.role as string | null),
  }
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
    role: mapSupabaseRole(user.user_metadata?.role),
  }
}

"use client"

export function isDemoModeEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true"
  )
}

export function logDataSource(source: "supabase" | "fallback-demo", detail: string) {
  if (process.env.NODE_ENV !== "development") {
    return
  }

  console.info(`[Tetisol data:${source}] ${detail}`)
}

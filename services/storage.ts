import type { CareerHubState } from "@/types"

const STORAGE_KEY = "tetisol-learning-platform-state-v3"

export function loadCareerHubState() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY)
    if (!rawState) {
      return null
    }

    return JSON.parse(rawState) as CareerHubState
  } catch {
    return null
  }
}

export function saveCareerHubState(state: CareerHubState) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

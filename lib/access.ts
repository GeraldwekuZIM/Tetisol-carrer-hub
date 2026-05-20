import type { UserAccount, UserRole } from "@/types"

export function getUserRole(user: UserAccount | null | undefined): UserRole {
  return user?.role ?? "student"
}

export function isAdminUser(user: UserAccount | null | undefined) {
  return getUserRole(user) === "admin"
}

export function isInstructorUser(user: UserAccount | null | undefined) {
  return getUserRole(user) === "instructor"
}

export function isInternalUser(user: UserAccount | null | undefined) {
  const role = getUserRole(user)
  return role === "admin" || role === "instructor"
}

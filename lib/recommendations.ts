import { deriveLearningSkills } from "@/lib/learning"
import type {
  Course,
  Internship,
  InternshipMatch,
  StudentProfile,
  UserWorkspace,
} from "@/types"

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function getRecommendationSignals(
  profile: StudentProfile,
  courses: Course[],
  workspace: UserWorkspace | null
) {
  const learnedSkills = deriveLearningSkills(courses, workspace)
  const learnedTopics = (workspace?.enrollments ?? [])
    .map((enrollment) => courses.find((course) => course.id === enrollment.courseId))
    .filter((course): course is Course => Boolean(course))
    .flatMap((course) => [course.title, course.category, ...course.internshipFocus])

  return {
    skills: unique([...profile.skills, ...learnedSkills]).map(normalize),
    interests: unique([
      ...profile.interests,
      ...profile.preferredInternshipFields,
      ...profile.learningFocus,
      ...profile.careerGoals,
      ...learnedTopics,
    ]).map(normalize),
    roles: unique(profile.preferredRoles).map(normalize),
    location: normalize(profile.location),
  }
}

export function getRecommendedInternships(
  profile: StudentProfile,
  internships: Internship[],
  courses: Course[] = [],
  workspace: UserWorkspace | null = null
): InternshipMatch[] {
  const signals = getRecommendationSignals(profile, courses, workspace)

  return internships
    .map((internship) => {
      let matchScore = internship.level === "Beginner" ? 20 : 12
      const reasons: string[] = []

      const sharedSkills = internship.skills.filter((skill) =>
        signals.skills.includes(normalize(skill))
      )
      if (sharedSkills.length) {
        matchScore += sharedSkills.length * 11
        reasons.push(`Matches ${sharedSkills.slice(0, 3).join(", ")}`)
      }

      const internshipKeywords = [
        internship.title,
        internship.category,
        internship.description,
        ...internship.interests,
        ...internship.skills,
      ]
        .join(" ")
        .toLowerCase()

      const interestMatches = signals.interests.filter((interest) =>
        internshipKeywords.includes(interest)
      )
      if (interestMatches.length) {
        matchScore += interestMatches.length * 8
        reasons.push(`Aligned with ${unique(interestMatches).slice(0, 2).join(" and ")}`)
      }

      const learnedReason = workspace?.enrollments
        .map((enrollment) => courses.find((course) => course.id === enrollment.courseId))
        .filter((course): course is Course => Boolean(course))
        .find((course) =>
          course.skills.some((skill) =>
            internshipKeywords.includes(normalize(skill))
          ) ||
          course.internshipFocus.some((focus) =>
            internshipKeywords.includes(normalize(focus))
          )
        )
      if (learnedReason) {
        matchScore += 7
        reasons.push(`Recommended because you studied ${learnedReason.title}`)
      }

      const roleMatches = signals.roles.filter((role) =>
        internshipKeywords.includes(role.replace(" intern", ""))
      )
      if (roleMatches.length) {
        matchScore += roleMatches.length * 6
        reasons.push("Close to your preferred internship path")
      }

      if (signals.location) {
        if (internship.mode === "Remote") {
          matchScore += 7
          reasons.push("Remote-friendly for your search")
        } else if (normalize(internship.location).includes(signals.location)) {
          matchScore += 12
          reasons.push(`Available in ${profile.location}`)
        }
      }

      const daysUntilDeadline =
        (new Date(internship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      if (daysUntilDeadline > 7) {
        matchScore += 4
      }

      if (sharedSkills.length === 0 && interestMatches.length === 0) {
        reasons.push("Useful stretch opportunity to broaden your portfolio")
      }

      return {
        ...internship,
        matchScore,
        matchReasons: unique(reasons).slice(0, 3),
      }
    })
    .sort((left, right) => right.matchScore - left.matchScore)
}

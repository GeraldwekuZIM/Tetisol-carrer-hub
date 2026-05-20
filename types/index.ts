export const applicationStatuses = [
  "Interested",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
] as const

export const internshipModes = ["Remote", "Hybrid", "Onsite"] as const
export const internshipCategories = [
  "Engineering",
  "Data",
  "Security",
  "Product",
  "Design",
  "Marketing",
  "Cloud",
  "IT Support",
  "AI",
] as const

export const learningCategories = [
  "Artificial Intelligence",
  "Prompt Engineering",
  "Cybersecurity",
  "Software Engineering",
  "Web Development",
  "Data Analytics",
  "Cloud Computing",
  "UI/UX Design",
  "Digital Marketing",
  "IT Support",
  "Career Readiness",
] as const

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const
export const lessonTypes = ["Text", "Video", "Resource", "Quiz"] as const
export const reminderKinds = [
  "Learning",
  "Quiz",
  "Application",
  "Deadline",
  "Certificate",
] as const
export const demoPersonaStates = [
  "New learner",
  "Active learner",
  "Stalled learner",
  "Almost-certified learner",
  "Career-ready learner",
] as const
export const userRoles = ["student", "admin", "instructor"] as const
export const contentStatuses = ["Draft", "Published", "Archived"] as const
export const internshipListingTypes = [
  "Internship",
  "Apprenticeship",
  "Graduate Program",
] as const
export const intelligenceTones = [
  "positive",
  "warning",
  "urgent",
  "opportunity",
  "neutral",
] as const
export const intelligenceKinds = [
  "AI Coach",
  "Momentum",
  "Opportunity",
  "CV",
  "Deadline",
  "Certificate",
] as const

export type ApplicationStatus = (typeof applicationStatuses)[number]
export type InternshipMode = (typeof internshipModes)[number]
export type InternshipCategory = (typeof internshipCategories)[number]
export type LearningCategory = (typeof learningCategories)[number]
export type CourseLevel = (typeof courseLevels)[number]
export type LessonType = (typeof lessonTypes)[number]
export type ReminderKind = (typeof reminderKinds)[number]
export type DemoPersonaState = (typeof demoPersonaStates)[number]
export type UserRole = (typeof userRoles)[number]
export type ContentStatus = (typeof contentStatuses)[number]
export type InternshipListingType = (typeof internshipListingTypes)[number]
export type IntelligenceTone = (typeof intelligenceTones)[number]
export type IntelligenceKind = (typeof intelligenceKinds)[number]

export type Internship = {
  id: string
  slug: string
  title: string
  company: string
  location: string
  mode: InternshipMode
  category: InternshipCategory
  level: CourseLevel
  stipend: string
  duration: string
  deadline: string
  postedAt: string
  description: string
  shortDescription?: string
  fullDescription?: string
  skills: string[]
  interests: string[]
  responsibilities: string[]
  requirements: string[]
  preferredQualifications?: string[]
  applicationLink?: string
  type?: InternshipListingType
  status?: ContentStatus
}

export type InternshipMatch = Internship & {
  matchScore: number
  matchReasons: string[]
}

export type UserAccount = {
  id: string
  email: string
  password: string
  fullName: string
  role?: UserRole
  demoPersonaState?: DemoPersonaState
  demoPersonaDescription?: string
  demoPersonaFocus?: string[]
}

export type StudentProfile = {
  name: string
  school: string
  degree: string
  location: string
  bio: string
  skills: string[]
  interests: string[]
  preferredRoles: string[]
  availability: string
  preferredInternshipFields: string[]
  learningFocus: string[]
  careerGoals: string[]
}

export type UserPreferences = {
  preferredLocations: string[]
  preferredInternshipFields: string[]
  preferredLearningCategories: string[]
  weeklyLearningGoalHours: number
  internshipPriority: "Learning-first" | "Balanced" | "Career-first"
}

export type ApplicationRecord = {
  id: string
  internshipId: string
  status: ApplicationStatus
  notes: string
  deadline: string
  createdAt: string
  updatedAt: string
}

export type CourseInstructor = {
  name: string
  role: string
  company: string
  bio: string
}

export type CourseCollaborator = {
  id: string
  name: string
  email: string
  role: "Admin" | "Lecturer" | "Teaching Assistant" | "Reviewer"
  canEditContent: boolean
  canManageAssessments: boolean
  canPublish: boolean
}

export type CourseResource = {
  label: string
  kind: "Guide" | "Template" | "Cheatsheet" | "Project Brief"
  url?: string
}

export type CourseLesson = {
  id: string
  slug: string
  title: string
  type: LessonType
  duration: string
  objective: string
  summary: string
  content: string[]
  resources?: CourseResource[]
  quizId?: string
  orderIndex?: number
  published?: boolean
  resourceLink?: string
}

export type CourseModule = {
  id: string
  title: string
  summary: string
  estimatedTime: string
  lessons: CourseLesson[]
  orderIndex?: number
}

export type Course = {
  id: string
  slug: string
  title: string
  category: LearningCategory
  level: CourseLevel
  duration: string
  durationHours: number
  shortDescription: string
  description: string
  rating: number
  reviewCount: number
  instructor: CourseInstructor
  collaborators?: CourseCollaborator[]
  skills: string[]
  outcomes: string[]
  prerequisites: string[]
  modules: CourseModule[]
  certificateAvailable: boolean
  featured: boolean
  popular: boolean
  isNew: boolean
  heroGradient: string
  internshipFocus: string[]
  updatedAt: string
  status?: ContentStatus
  thumbnail?: string
}

export type CourseMatch = Course & {
  matchScore: number
  matchReasons: string[]
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export type Quiz = {
  id: string
  courseId: string
  moduleId: string
  lessonId: string
  title: string
  description: string
  passingScore: number
  questions: QuizQuestion[]
}

export type CourseEnrollment = {
  id: string
  courseId: string
  enrolledAt: string
  startedAt: string
  completedAt: string | null
  completedLessonIds: string[]
  lastLessonId: string | null
  lastActivityAt: string
}

export type QuizAttempt = {
  id: string
  quizId: string
  courseId: string
  lessonId: string
  answers: Record<string, string>
  score: number
  passed: boolean
  submittedAt: string
}

export type LearningNote = {
  id: string
  courseId: string
  lessonId: string
  content: string
  updatedAt: string
}

export type Certificate = {
  id: string
  courseId: string
  learnerName: string
  issuedAt: string
  certificateNumber: string
  shareUrl: string | null
  downloadUrl: string | null
}

export type Reminder = {
  id: string
  kind: ReminderKind
  title: string
  description: string
  date: string
  href: string
}

export type CVProject = {
  id: string
  title: string
  role: string
  summary: string
  impact: string
  stack: string[]
  sourceCourseId?: string
}

export type CVCertification = {
  id: string
  courseName: string
  issuer: string
  issuedAt: string
  credentialId: string
}

export type CVDocument = {
  id: string
  headline: string
  summary: string
  education: string
  skills: string[]
  experience: string[]
  projects: CVProject[]
  certifications: CVCertification[]
  achievements: string[]
  score: number
  suggestions: string[]
  lastUpdated: string
}

export type UserWorkspace = {
  profile: StudentProfile
  preferences: UserPreferences
  savedInternshipIds: string[]
  applications: ApplicationRecord[]
  cv: CVDocument
  enrollments: CourseEnrollment[]
  quizAttempts: QuizAttempt[]
  certificates: Certificate[]
  learningNotes: LearningNote[]
  reminders: Reminder[]
  onboardingCompleted: boolean
}

export type DemoPersona = {
  id: string
  email: string
  password: string
  fullName: string
  state: DemoPersonaState
  description: string
  focus: string[]
}

export type IntelligenceInsight = {
  id: string
  kind: IntelligenceKind
  tone: IntelligenceTone
  title: string
  description: string
  badge?: string
  href?: string
}

export type NextBestAction = {
  id: string
  title: string
  description: string
  ctaLabel: string
  href: string
  tone: IntelligenceTone
  badge?: string
}

export type OpportunityIntelligence = {
  learnerState: DemoPersonaState
  readinessScore: number
  momentumLabel: string
  matchingInternshipCount: number
  certificateOpportunityCount: number
  coachTitle: string
  coachSummary: string
  nextBestAction: NextBestAction
  insights: IntelligenceInsight[]
  alerts: IntelligenceInsight[]
}

export type CareerHubState = {
  users: UserAccount[]
  activeUserId: string | null
  internships: Internship[]
  courses: Course[]
  quizzes: Quiz[]
  workspaces: Record<string, UserWorkspace>
}

export type ProfileInput = StudentProfile

export type CVInput = Omit<CVDocument, "score" | "suggestions" | "lastUpdated">

export type ActionFeedback = {
  success: boolean
  message: string
}

export type QuizFeedback = ActionFeedback & {
  score?: number
  passed?: boolean
  certificateEarned?: boolean
}

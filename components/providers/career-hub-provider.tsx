"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"

import { demoPersonas as seededDemoPersonas } from "@/lib/demo-data"
import { isInternalUser } from "@/lib/access"
import { getPublishedCourses, getPublishedInternships } from "@/lib/content"
import {
  getCompletedCourses,
  getEnrolledCourses,
  getInProgressCourses,
  getNextLearningReminder,
  getRecommendedCourses,
} from "@/lib/learning"
import { getOpportunityIntelligence } from "@/lib/opportunity-intelligence"
import { getRecommendedInternships } from "@/lib/recommendations"
import {
  getSupabaseBrowserClient,
  getSupabaseCurrentUser,
  getSupabaseCurrentProfile,
  ensureSupabaseProfile,
  hasSupabaseEnv,
  mapSupabaseUser,
} from "@/lib/supabase"
import {
  addInternshipToTracker,
  archiveAdminCourseContent,
  archiveAdminInternshipContent,
  completeOnboarding,
  createInitialState,
  hydrateCareerHubState,
  deleteAdminCourseContent,
  deleteAdminInternshipContent,
  enrollInCourse,
  getActiveUser,
  getActiveWorkspace,
  importLearningIntoCv,
  markLessonComplete,
  moveApplication,
  saveLearningNote,
  signInLocally,
  signOutUser,
  signUpLocally,
  saveAdminCourseContent,
  saveAdminInternshipContent,
  submitQuiz,
  syncAuthenticatedUser,
  toggleSavedInternship,
  updateApplicationDetails,
  updateCv,
  updateProfile,
} from "@/services/career-hub-service"
import {
  loadCareerHubState,
  saveCareerHubState,
} from "@/services/storage"
import type {
  ActionFeedback,
  ApplicationRecord,
  ApplicationStatus,
  CVInput,
  CareerHubState,
  Course,
  DemoPersona,
  Internship,
  OpportunityIntelligence,
  ProfileInput,
  Quiz,
  QuizFeedback,
  Reminder,
} from "@/types"

type CareerHubContextValue = {
  hydrated: boolean
  state: CareerHubState
  activeUser: ReturnType<typeof getActiveUser>
  activeWorkspace: ReturnType<typeof getActiveWorkspace>
  publishedCourses: Course[]
  publishedInternships: Internship[]
  recommendedInternships: ReturnType<typeof getRecommendedInternships>
  recommendedCourses: ReturnType<typeof getRecommendedCourses>
  enrolledCourses: Course[]
  inProgressCourses: Course[]
  completedCourses: Course[]
  earnedCertificates: NonNullable<ReturnType<typeof getActiveWorkspace>>["certificates"]
  savedInternships: Internship[]
  trackedInternships: Internship[]
  upcomingDeadlines: Array<ApplicationRecord & { internship?: Internship }>
  dashboardReminders: Reminder[]
  opportunityIntelligence: OpportunityIntelligence | null
  demoPersonas: DemoPersona[]
  hasSupabase: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<ActionFeedback>
  signUp: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<ActionFeedback>
  signOut: () => Promise<void>
  completeOnboarding: (profile: ProfileInput) => void
  updateProfile: (profile: ProfileInput) => void
  toggleSavedInternship: (internshipId: string) => void
  addInternshipToTracker: (
    internshipId: string,
    status?: ApplicationStatus
  ) => void
  moveApplication: (applicationId: string, status: ApplicationStatus) => void
  updateApplicationDetails: (
    applicationId: string,
    updates: Pick<ApplicationRecord, "notes" | "deadline">
  ) => void
  updateCv: (cv: CVInput) => void
  importLearningIntoCv: () => void
  enrollInCourse: (courseId: string) => void
  markLessonComplete: (courseId: string, lessonId: string) => void
  saveLearningNote: (courseId: string, lessonId: string, content: string) => void
  submitQuiz: (
    courseId: string,
    quizId: string,
    answers: Record<string, string>
  ) => QuizFeedback
  saveAdminCourseContent: (payload: {
    course: Course
    quizzes: Quiz[]
  }) => void
  archiveAdminCourseContent: (courseId: string) => void
  deleteAdminCourseContent: (courseId: string) => void
  saveAdminInternshipContent: (internship: Internship) => void
  archiveAdminInternshipContent: (internshipId: string) => void
  deleteAdminInternshipContent: (internshipId: string) => void
}

const CareerHubContext = createContext<CareerHubContextValue | undefined>(
  undefined
)

function subscribeToHydration() {
  return () => {}
}

export function CareerHubProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = useState<CareerHubState>(() =>
    hydrateCareerHubState(loadCareerHubState() ?? createInitialState())
  )
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  )

  useEffect(() => {
    if (!hydrated) {
      return
    }

    saveCareerHubState(state)
  }, [hydrated, state])

  useEffect(() => {
    if (!hydrated || !hasSupabaseEnv()) {
      return
    }

    void getSupabaseCurrentUser().then(async (user) => {
      if (!user) {
        return
      }

      const profile = await getSupabaseCurrentProfile()
      setState((currentState) =>
        syncAuthenticatedUser(currentState, {
          ...mapSupabaseUser(user),
          fullName: profile?.fullName || mapSupabaseUser(user).fullName,
          email: profile?.email || mapSupabaseUser(user).email,
          role: profile?.role ?? mapSupabaseUser(user).role,
        })
      )
    })
  }, [hydrated])

  const activeUser = getActiveUser(state)
  const activeWorkspace = getActiveWorkspace(state)
  const publishedCourses = useMemo(
    () => getPublishedCourses(state.courses),
    [state.courses]
  )
  const publishedInternships = useMemo(
    () => getPublishedInternships(state.internships),
    [state.internships]
  )
  const isAdmin = isInternalUser(activeUser)

  const recommendedInternships = useMemo(
    () =>
      activeWorkspace
        ? getRecommendedInternships(
            activeWorkspace.profile,
            publishedInternships,
            publishedCourses,
            activeWorkspace
          )
        : publishedInternships.map((internship) => ({
            ...internship,
            matchScore: internship.level === "Beginner" ? 30 : 18,
            matchReasons: [
              "Complete onboarding to unlock personalized learning and career matching",
            ],
          })),
    [activeWorkspace, publishedCourses, publishedInternships]
  )

  const recommendedCourses = useMemo(
    () =>
      activeWorkspace
        ? getRecommendedCourses(activeWorkspace.profile, publishedCourses, activeWorkspace)
        : publishedCourses.map((course) => ({
            ...course,
            matchScore: course.featured ? 28 : 18,
            matchReasons: ["Create your profile to personalize course recommendations"],
          })),
    [activeWorkspace, publishedCourses]
  )

  const enrolledCourses = useMemo(
    () => getEnrolledCourses(state.courses, activeWorkspace),
    [activeWorkspace, state.courses]
  )
  const inProgressCourses = useMemo(
    () => getInProgressCourses(state.courses, activeWorkspace),
    [activeWorkspace, state.courses]
  )
  const completedCourses = useMemo(
    () => getCompletedCourses(state.courses, activeWorkspace),
    [activeWorkspace, state.courses]
  )

  const savedInternships = activeWorkspace
    ? state.internships.filter((internship) =>
        activeWorkspace.savedInternshipIds.includes(internship.id)
      )
    : []

  const trackedInternships = activeWorkspace
    ? state.internships.filter((internship) =>
        activeWorkspace.applications.some(
          (application) => application.internshipId === internship.id
        )
      )
    : []

  const upcomingDeadlines = (activeWorkspace?.applications ?? [])
    .map((application) => ({
      ...application,
      internship: state.internships.find(
        (internship) => internship.id === application.internshipId
      ),
    }))
    .filter((application) => application.deadline)
    .sort((left, right) => left.deadline.localeCompare(right.deadline))
    .slice(0, 4)

  const dashboardReminders = useMemo(() => {
    if (!activeWorkspace) {
      return []
    }

    const learningReminders: Reminder[] = inProgressCourses
      .map((course) => {
        const reminder = getNextLearningReminder(course, activeWorkspace)
        if (!reminder) {
          return null
        }

        return {
          id: `learning-${course.id}`,
          kind: "Learning" as const,
          date: new Date().toISOString().slice(0, 10),
          ...reminder,
        }
      })
      .filter(Boolean) as Reminder[]

    const deadlineReminders = upcomingDeadlines.map((application) => ({
      id: `deadline-${application.id}`,
      kind: "Deadline" as const,
      title: `${application.internship?.title ?? "Application"} deadline`,
      description: application.notes,
      date: application.deadline,
      href: "/applications",
    }))

    return [...activeWorkspace.reminders, ...learningReminders, ...deadlineReminders]
      .sort((left, right) => left.date.localeCompare(right.date))
      .slice(0, 6)
  }, [activeWorkspace, inProgressCourses, upcomingDeadlines])

  const opportunityIntelligence = useMemo(
    () =>
      getOpportunityIntelligence({
        courses: state.courses,
        internships: state.internships,
        recommendedCourses,
        recommendedInternships,
        workspace: activeWorkspace,
      }),
    [activeWorkspace, recommendedCourses, recommendedInternships, state.courses, state.internships]
  )

  async function signIn(email: string, password: string): Promise<ActionFeedback> {
    if (hasSupabaseEnv()) {
      const client = getSupabaseBrowserClient()
      if (!client) {
        return {
          success: false,
          message: "Supabase is configured incorrectly for browser auth.",
        }
      }

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        return {
          success: false,
          message: error?.message ?? "Unable to sign in right now.",
        }
      }

      const authenticatedUser = data.user
      const profile = await getSupabaseCurrentProfile()
      setState((currentState) =>
        syncAuthenticatedUser(currentState, {
          ...mapSupabaseUser(authenticatedUser),
          fullName: profile?.fullName || mapSupabaseUser(authenticatedUser).fullName,
          email: profile?.email || mapSupabaseUser(authenticatedUser).email,
          role: profile?.role ?? mapSupabaseUser(authenticatedUser).role,
        })
      )

      return {
        success: true,
        message: "Welcome back. Your learning and career workspace is ready.",
      }
    }

    const result = signInLocally(state, email, password)
    if (result.error) {
      return {
        success: false,
        message: result.error,
      }
    }

    setState(result.state)
    return {
      success: true,
      message: "Signed in with local demo mode.",
    }
  }

  async function signUp(
    fullName: string,
    email: string,
    password: string
  ): Promise<ActionFeedback> {
    if (hasSupabaseEnv()) {
      const client = getSupabaseBrowserClient()
      if (!client) {
        return {
          success: false,
          message: "Supabase is configured incorrectly for browser auth.",
        }
      }

      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      const createdUser = data.user
      if (createdUser) {
        const mappedUser = mapSupabaseUser(createdUser)
        const profile = await ensureSupabaseProfile({
          id: createdUser.id,
          email: mappedUser.email,
          fullName,
          role: "student",
        })
        setState((currentState) =>
          syncAuthenticatedUser(currentState, {
            ...mappedUser,
            fullName: profile?.fullName || fullName,
            role: profile?.role ?? "student",
          })
        )
      }

      return {
        success: true,
        message:
          "Account created. If email confirmation is enabled, check your inbox before continuing.",
      }
    }

    const result = signUpLocally(state, {
      fullName,
      email,
      password,
    })

    if (result.error) {
      return {
        success: false,
        message: result.error,
      }
    }

    setState(result.state)
    return {
      success: true,
      message: "Demo account created. Let's finish your onboarding.",
    }
  }

  async function signOut() {
    if (hasSupabaseEnv()) {
      const client = getSupabaseBrowserClient()
      await client?.auth.signOut()
    }

    setState((currentState) => signOutUser(currentState))
  }

  const value: CareerHubContextValue = {
    hydrated,
    state,
    activeUser,
    activeWorkspace,
    publishedCourses,
    publishedInternships,
    recommendedInternships,
    recommendedCourses,
    enrolledCourses,
    inProgressCourses,
    completedCourses,
    earnedCertificates: activeWorkspace?.certificates ?? [],
    savedInternships,
    trackedInternships,
    upcomingDeadlines,
    dashboardReminders,
    opportunityIntelligence,
    demoPersonas: seededDemoPersonas,
    hasSupabase: hasSupabaseEnv(),
    isAdmin,
    signIn,
    signUp,
    signOut,
    completeOnboarding: (profile) =>
      setState((currentState) => completeOnboarding(currentState, profile)),
    updateProfile: (profile) =>
      setState((currentState) => updateProfile(currentState, profile)),
    toggleSavedInternship: (internshipId) =>
      setState((currentState) =>
        toggleSavedInternship(currentState, internshipId)
      ),
    addInternshipToTracker: (internshipId, status) =>
      setState((currentState) =>
        addInternshipToTracker(currentState, internshipId, status)
      ),
    moveApplication: (applicationId, status) =>
      setState((currentState) => moveApplication(currentState, applicationId, status)),
    updateApplicationDetails: (applicationId, updates) =>
      setState((currentState) =>
        updateApplicationDetails(currentState, applicationId, updates)
      ),
    updateCv: (cv) =>
      setState((currentState) => updateCv(currentState, cv)),
    importLearningIntoCv: () =>
      setState((currentState) => importLearningIntoCv(currentState)),
    enrollInCourse: (courseId) =>
      setState((currentState) => enrollInCourse(currentState, courseId)),
    markLessonComplete: (courseId, lessonId) =>
      setState((currentState) => markLessonComplete(currentState, courseId, lessonId)),
    saveLearningNote: (courseId, lessonId, content) =>
      setState((currentState) =>
        saveLearningNote(currentState, courseId, lessonId, content)
      ),
    submitQuiz: (courseId, quizId, answers) => {
      const result = submitQuiz(state, courseId, quizId, answers)
      setState(result.state)
      return result.feedback
    },
    saveAdminCourseContent: (payload) =>
      setState((currentState) => saveAdminCourseContent(currentState, payload)),
    archiveAdminCourseContent: (courseId) =>
      setState((currentState) => archiveAdminCourseContent(currentState, courseId)),
    deleteAdminCourseContent: (courseId) =>
      setState((currentState) => deleteAdminCourseContent(currentState, courseId)),
    saveAdminInternshipContent: (internship) =>
      setState((currentState) => saveAdminInternshipContent(currentState, internship)),
    archiveAdminInternshipContent: (internshipId) =>
      setState((currentState) =>
        archiveAdminInternshipContent(currentState, internshipId)
      ),
    deleteAdminInternshipContent: (internshipId) =>
      setState((currentState) =>
        deleteAdminInternshipContent(currentState, internshipId)
      ),
  }

  return (
    <CareerHubContext.Provider value={value}>
      {children}
    </CareerHubContext.Provider>
  )
}

export function useCareerHub() {
  const context = useContext(CareerHubContext)

  if (!context) {
    throw new Error("useCareerHub must be used within CareerHubProvider.")
  }

  return context
}

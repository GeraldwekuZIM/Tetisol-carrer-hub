import type { LucideIcon } from "lucide-react"
import {
  AwardIcon,
  BookOpenCheckIcon,
  BriefcaseBusinessIcon,
  CompassIcon,
  FileTextIcon,
  KanbanSquareIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react"

import { seedCourses, seedInternships } from "@/lib/demo-data"

export type MarketingFeature = {
  title: string
  description: string
  stat: string
  icon: LucideIcon
}

export type MarketingStep = {
  title: string
  description: string
  detail: string
  icon: LucideIcon
}

export type MarketingCategory = {
  title: string
  description: string
  count: number
}

export type MarketingProof = {
  title: string
  description: string
  icon: LucideIcon
}

export type MarketingTestimonial = {
  quote: string
  name: string
  role: string
  school: string
}

export const landingNavLinks = [
  { label: "Courses", href: "#course-categories" },
  { label: "Outcomes", href: "#learning-outcomes" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Preview", href: "#dashboard-preview" },
  { label: "Stories", href: "#stories" },
] as const

export const heroStats = [
  {
    label: "Structured courses",
    value: `${seedCourses.length} demo-ready tracks`,
  },
  {
    label: "Career connection",
    value: `${seedInternships.length} internships seeded`,
  },
  {
    label: "One platform",
    value: "Learn, certify, apply",
  },
] as const

export const features: MarketingFeature[] = [
  {
    title: "Find internships faster",
    description:
      "Browse roles with recommendations informed by your learning path, skill tags, and preferred career direction.",
    stat: "Learning-aware discovery",
    icon: CompassIcon,
  },
  {
    title: "Track every application",
    description:
      "Move opportunities through clear stages, store notes, and keep deadlines visible without spreadsheet sprawl.",
    stat: "Career pipeline clarity",
    icon: KanbanSquareIcon,
  },
  {
    title: "Build a professional CV",
    description:
      "Pull in certificates, projects, achievements, and skills from your learning history to tell a stronger story.",
    stat: "CV connected to learning",
    icon: FileTextIcon,
  },
  {
    title: "Improve employability",
    description:
      "Use courses, certifications, and practical workflow habits to move from studying to internship and job readiness.",
    stat: "Outcome-first platform",
    icon: TrendingUpIcon,
  },
] as const

export const featuredCategories: MarketingCategory[] = [
  {
    title: "Artificial Intelligence",
    description: "Understand AI workflows, evaluation, and practical product use cases.",
    count: seedCourses.filter((course) => course.category === "Artificial Intelligence").length,
  },
  {
    title: "Prompt Engineering",
    description: "Design reliable prompts, assess quality, and build repeatable AI workflows.",
    count: seedCourses.filter((course) => course.category === "Prompt Engineering").length,
  },
  {
    title: "Cybersecurity",
    description: "Learn risk thinking, defensive operations, and documentation habits teams trust.",
    count: seedCourses.filter((course) => course.category === "Cybersecurity").length,
  },
  {
    title: "Web Development",
    description: "Build product-minded frontend and full stack foundations for real team environments.",
    count: seedCourses.filter((course) => course.category === "Web Development").length,
  },
  {
    title: "Data Analytics",
    description: "Move from messy data to useful dashboards, metrics, and recommendations.",
    count: seedCourses.filter((course) => course.category === "Data Analytics").length,
  },
  {
    title: "Career Readiness",
    description: "Turn coursework and projects into applications, interviews, and stronger CV positioning.",
    count: seedCourses.filter((course) => course.category === "Career Readiness").length,
  },
] as const

export const learningOutcomeProof: MarketingProof[] = [
  {
    title: "Earn certificates that matter",
    description:
      "Complete lessons and assessments to unlock branded certificates that can flow directly into your profile and CV builder.",
    icon: AwardIcon,
  },
  {
    title: "Track progress without losing context",
    description:
      "Use a dedicated course player with modules, lessons, notes, progress indicators, and quiz checkpoints.",
    icon: BookOpenCheckIcon,
  },
  {
    title: "Connect learning to career outcomes",
    description:
      "Courses influence recommendations, strengthen your CV, and surface internship directions that fit what you are building.",
    icon: TargetIcon,
  },
] as const

export const howItWorksSteps: MarketingStep[] = [
  {
    title: "Create your profile",
    description:
      "Tell Tetisol what you study, what you want to learn, and where you want to become employable.",
    detail: "Your school, skills, learning focus, career goals, and internship fields shape your personalized path.",
    icon: SparklesIcon,
  },
  {
    title: "Discover opportunities",
    description:
      "Browse structured courses, enroll in the right tracks, and unlock recommendations that get smarter as you learn.",
    detail: "Featured courses, progress tracking, and realistic internships live in one connected experience.",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Track and apply smarter",
    description:
      "Complete lessons, earn certificates, improve your CV, and move internship applications through a clear pipeline.",
    detail: "The result is not just learning completion. It is stronger readiness for real opportunities.",
    icon: TargetIcon,
  },
] as const

export const proofPoints = [
  "Featured tech courses",
  "Module quizzes and assessments",
  "Certificates and profile proof",
  "Recommended internships",
  "Tracked applications",
  "CV score and guidance",
] as const

export const dashboardPreviewHighlights = [
  {
    title: "Learning dashboard",
    body: "See enrolled courses, progress, certificates, and the next lesson to resume in one view.",
    icon: BookOpenCheckIcon,
  },
  {
    title: "Career outcomes preview",
    body: "Pair course momentum with recommended internships, application flow, and upcoming deadlines.",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "CV and employability loop",
    body: "Turn projects, certificates, and skill growth into a stronger starter profile.",
    icon: FileTextIcon,
  },
] as const

export const testimonials: MarketingTestimonial[] = [
  {
    quote:
      "I liked that my courses, certificates, internship search, and CV lived in one place instead of feeling like four separate tools.",
    name: "Thandeka M.",
    role: "Final-year Information Systems student",
    school: "University of Zimbabwe",
  },
  {
    quote:
      "The learning player made it feel like a real platform, and the CV import from my completed courses saved me time I would have spent rewriting everything.",
    name: "Brian N.",
    role: "Graduate and junior data candidate",
    school: "NUST",
  },
  {
    quote:
      "It feels built for the messy in-between stage where you are learning skills, building confidence, and trying to become genuinely employable.",
    name: "Rudo C.",
    role: "Student product designer",
    school: "Midlands State University",
  },
] as const

export const footerLinkGroups = [
  {
    title: "Platform",
    links: [
      { label: "Landing Page", href: "/" },
      { label: "Courses", href: "/courses" },
      { label: "Sign In", href: "/auth" },
    ],
  },
  {
    title: "Learning",
    links: [
      { label: "My Learning", href: "/learning" },
      { label: "Certificates", href: "/certificates" },
      { label: "Course Catalog", href: "#course-categories" },
    ],
  },
  {
    title: "Career",
    links: [
      { label: "Internships", href: "/internships" },
      { label: "Application Tracker", href: "/applications" },
      { label: "CV Builder", href: "/cv-builder" },
    ],
  },
] as const

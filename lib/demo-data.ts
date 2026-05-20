import type {
  ApplicationRecord,
  CVDocument,
  CareerHubState,
  Certificate,
  Course,
  CourseLesson,
  CourseModule,
  CourseResource,
  CVProject,
  DemoPersona,
  Internship,
  LearningNote,
  Quiz,
  QuizQuestion,
  StudentProfile,
  UserAccount,
  UserPreferences,
  UserWorkspace,
} from "@/types"

const now = "2026-04-21T08:30:00.000Z"

function createLesson({
  id,
  title,
  slug,
  type,
  duration,
  objective,
  summary,
  content,
  resources,
  quizId,
}: CourseLesson) {
  return {
    id,
    title,
    slug,
    type,
    duration,
    objective,
    summary,
    content,
    resources,
    quizId,
  }
}

function createModule(module: CourseModule) {
  return module
}

function createQuiz(
  id: string,
  courseId: string,
  moduleId: string,
  lessonId: string,
  title: string,
  description: string,
  questions: QuizQuestion[],
  passingScore = 70
): Quiz {
  return {
    id,
    courseId,
    moduleId,
    lessonId,
    title,
    description,
    passingScore,
    questions,
  }
}

function createQuestions(
  prefix: string,
  entries: Array<{
    prompt: string
    options: string[]
    correctAnswer: string
    explanation: string
  }>
) {
  return entries.map((entry, index) => ({
    id: `${prefix}-question-${index + 1}`,
    ...entry,
  }))
}

function createResource(label: string, kind: CourseResource["kind"]): CourseResource {
  return { label, kind }
}

export const seedInternships: Internship[] = [
  {
    id: "internship-software-dev",
    slug: "software-dev-intern",
    title: "Software Dev Intern",
    company: "BlueOrbit Labs",
    location: "Harare, Zimbabwe",
    mode: "Hybrid",
    category: "Engineering",
    level: "Beginner",
    stipend: "USD 250/month",
    duration: "12 weeks",
    deadline: "2026-05-18",
    postedAt: "2026-04-18",
    description:
      "Build student-facing product features, collaborate with product and design, and learn how production web apps are shipped with care.",
    skills: ["React", "TypeScript", "APIs", "Problem Solving"],
    interests: ["Web Development", "Software Engineering"],
    responsibilities: [
      "Build polished product surfaces in React and Next.js",
      "Help connect features to APIs and databases",
      "Write clean, tested code with senior mentorship",
    ],
    requirements: [
      "Comfortable with JavaScript fundamentals",
      "Strong curiosity for shipping real products",
      "Portfolio or school project work is a plus",
    ],
  },
  {
    id: "internship-data-analyst",
    slug: "data-analyst-intern",
    title: "Data Analyst Intern",
    company: "Nexa Insights",
    location: "Remote",
    mode: "Remote",
    category: "Data",
    level: "Beginner",
    stipend: "USD 220/month",
    duration: "10 weeks",
    deadline: "2026-05-08",
    postedAt: "2026-04-19",
    description:
      "Turn raw business data into clear dashboards and recommendations for product, growth, and learner success teams.",
    skills: ["Python", "SQL", "Excel", "Dashboards"],
    interests: ["Analytics", "Business Intelligence"],
    responsibilities: [
      "Build weekly learner performance dashboards",
      "Clean and segment data for reporting",
      "Present clear insights to stakeholders",
    ],
    requirements: [
      "Confidence with spreadsheets or SQL basics",
      "Ability to explain numbers clearly",
      "Attention to detail and structured thinking",
    ],
  },
  {
    id: "internship-cybersecurity",
    slug: "cybersecurity-intern",
    title: "Cybersecurity Intern",
    company: "ShieldStack",
    location: "Bulawayo, Zimbabwe",
    mode: "Onsite",
    category: "Security",
    level: "Intermediate",
    stipend: "USD 300/month",
    duration: "16 weeks",
    deadline: "2026-05-25",
    postedAt: "2026-04-17",
    description:
      "Support vulnerability reviews, improve team security hygiene, and learn how product companies protect their systems and users.",
    skills: ["Networking", "Linux", "Security Basics", "Documentation"],
    interests: ["Cybersecurity", "Risk Management"],
    responsibilities: [
      "Assist with vulnerability scans and remediation tracking",
      "Document security findings and operational playbooks",
      "Support awareness and compliance activities",
    ],
    requirements: [
      "Basic understanding of networks and operating systems",
      "Strong documentation habits",
      "Willingness to learn security tooling fast",
    ],
  },
  {
    id: "internship-ai-research",
    slug: "ai-research-assistant-intern",
    title: "AI Research Assistant Intern",
    company: "ModelWorks Africa",
    location: "Remote",
    mode: "Remote",
    category: "AI",
    level: "Intermediate",
    stipend: "USD 320/month",
    duration: "12 weeks",
    deadline: "2026-05-22",
    postedAt: "2026-04-20",
    description:
      "Support prompt testing, dataset review, and experiment documentation for AI education and productivity tools.",
    skills: ["Prompt Engineering", "Research", "Python", "Communication"],
    interests: ["Artificial Intelligence", "Prompt Engineering"],
    responsibilities: [
      "Evaluate prompt quality and document patterns",
      "Support small-scale model experiments and benchmarking",
      "Write concise notes that help the product team iterate quickly",
    ],
    requirements: [
      "Comfortable writing clearly and testing hypotheses",
      "Exposure to AI tools or Python is helpful",
      "Strong attention to detail",
    ],
  },
  {
    id: "internship-cloud-ops",
    slug: "cloud-operations-intern",
    title: "Cloud Operations Intern",
    company: "Nimbus Transit",
    location: "Johannesburg, South Africa",
    mode: "Hybrid",
    category: "Cloud",
    level: "Beginner",
    stipend: "USD 260/month",
    duration: "12 weeks",
    deadline: "2026-05-27",
    postedAt: "2026-04-21",
    description:
      "Work with engineers to monitor cloud services, improve deployment visibility, and support reliable product delivery.",
    skills: ["Cloud Basics", "Monitoring", "Linux", "Documentation"],
    interests: ["Cloud Computing", "DevOps"],
    responsibilities: [
      "Update dashboards and deployment notes",
      "Support release readiness checklists",
      "Investigate simple incidents with senior guidance",
    ],
    requirements: [
      "Strong curiosity about cloud systems",
      "Comfort with terminal basics is a plus",
      "Organized written communication",
    ],
  },
  {
    id: "internship-product-design",
    slug: "product-design-intern",
    title: "Product Design Intern",
    company: "Studio Kite",
    location: "Remote",
    mode: "Remote",
    category: "Design",
    level: "Beginner",
    stipend: "USD 210/month",
    duration: "8 weeks",
    deadline: "2026-05-12",
    postedAt: "2026-04-14",
    description:
      "Shape intuitive flows for learner and candidate journeys, from onboarding to application tracking and course completion.",
    skills: ["Figma", "User Research", "Wireframing", "Visual Design"],
    interests: ["UI/UX Design", "Product Thinking"],
    responsibilities: [
      "Design polished mobile and desktop experiences",
      "Translate research into interface improvements",
      "Contribute to a shared component system",
    ],
    requirements: [
      "Strong design portfolio or case studies",
      "Comfort with feedback and iteration",
      "Understanding of user-centered design principles",
    ],
  },
  {
    id: "internship-it-support",
    slug: "it-support-intern",
    title: "IT Support Intern",
    company: "CampusNet Services",
    location: "Harare, Zimbabwe",
    mode: "Onsite",
    category: "IT Support",
    level: "Beginner",
    stipend: "USD 190/month",
    duration: "10 weeks",
    deadline: "2026-05-14",
    postedAt: "2026-04-15",
    description:
      "Support device setup, user troubleshooting, and service desk operations in a growing campus technology environment.",
    skills: ["Troubleshooting", "Customer Support", "Hardware Basics", "Documentation"],
    interests: ["IT Support", "Operations"],
    responsibilities: [
      "Resolve first-line support issues",
      "Document recurring problems and fixes",
      "Assist with onboarding devices and accounts",
    ],
    requirements: [
      "Patient communication",
      "Interest in practical technical support work",
      "Reliable follow-through",
    ],
  },
  {
    id: "internship-digital-marketing",
    slug: "digital-marketing-intern",
    title: "Digital Marketing Intern",
    company: "BrightPath Media",
    location: "Remote",
    mode: "Remote",
    category: "Marketing",
    level: "Beginner",
    stipend: "USD 180/month",
    duration: "10 weeks",
    deadline: "2026-05-15",
    postedAt: "2026-04-16",
    description:
      "Help attract students and graduates with campaigns, content, and performance reporting across digital channels.",
    skills: ["Content Writing", "Campaigns", "Analytics", "Canva"],
    interests: ["Digital Marketing", "Brand Building"],
    responsibilities: [
      "Create campaign ideas for student audiences",
      "Support content calendars and reporting",
      "Track channel performance and engagement trends",
    ],
    requirements: [
      "Strong writing and creativity",
      "Basic comfort with campaign analytics",
      "Interest in brand and growth work",
    ],
  },
  {
    id: "internship-prompt-designer",
    slug: "prompt-designer-intern",
    title: "Prompt Design Intern",
    company: "Cortex Flow",
    location: "Remote",
    mode: "Remote",
    category: "AI",
    level: "Beginner",
    stipend: "USD 240/month",
    duration: "8 weeks",
    deadline: "2026-05-30",
    postedAt: "2026-04-21",
    description:
      "Help design repeatable prompts, evaluate response quality, and support AI workflow experiments for internal operations.",
    skills: ["Prompt Engineering", "QA", "Writing", "Critical Thinking"],
    interests: ["Prompt Engineering", "Artificial Intelligence"],
    responsibilities: [
      "Draft and iterate prompt libraries for internal teams",
      "Score responses against simple rubrics",
      "Document prompting patterns that improve outcomes",
    ],
    requirements: [
      "Strong written communication",
      "Comfort using AI tools",
      "Curiosity about systems and iteration",
    ],
  },
]

const aiModules = [
  createModule({
    id: "course-ai-intro-module-1",
    title: "AI Foundations",
    summary: "Understand what AI is, where it fits, and how to reason about value and risk.",
    estimatedTime: "2h 10m",
    lessons: [
      createLesson({
        id: "course-ai-intro-lesson-1",
        slug: "what-ai-actually-means",
        title: "What AI Actually Means",
        type: "Text",
        duration: "18 min",
        objective: "Build a grounded mental model for AI systems.",
        summary: "Separate hype from practical definitions and identify where AI creates real leverage.",
        content: [
          "Artificial intelligence is best understood as a family of systems that can perform tasks requiring perception, prediction, or decision support. In practice, most product teams care less about abstract definitions and more about whether a system improves speed, accuracy, or access.",
          "This lesson maps core terms like machine learning, models, data, and inference into simple product language. The goal is to make later lessons less mysterious and more actionable.",
        ],
      }),
      createLesson({
        id: "course-ai-intro-lesson-2",
        slug: "ai-use-cases-you-can-evaluate",
        title: "AI Use Cases You Can Evaluate",
        type: "Video",
        duration: "22 min",
        objective: "Learn to judge whether an AI use case is useful, realistic, and safe.",
        summary: "Review how automation, copilots, and recommendation systems show up in real teams.",
        content: [
          "You will walk through common AI product patterns such as assistants, classifiers, search augmentation, and recommendations. The point is not to memorize categories, but to see how problems are framed before a team even chooses a model.",
          "Pay attention to where human review is still necessary. Good AI products often succeed because the workflow is well designed, not because the model is magical.",
        ],
        resources: [createResource("AI opportunity scorecard", "Guide")],
      }),
      createLesson({
        id: "course-ai-intro-lesson-3",
        slug: "responsible-ai-basics-quiz",
        title: "Responsible AI Basics Quiz",
        type: "Quiz",
        duration: "12 min",
        objective: "Check your understanding of AI definitions, value, and risk.",
        summary: "A short assessment covering fundamentals from module one.",
        content: [
          "Complete the quiz to unlock the second module. Focus on practical thinking rather than memorizing buzzwords.",
        ],
        quizId: "quiz-ai-module-1",
      }),
    ],
  }),
  createModule({
    id: "course-ai-intro-module-2",
    title: "Building with AI",
    summary: "Move from concepts into workflow design, data thinking, and trustworthy implementation.",
    estimatedTime: "2h 25m",
    lessons: [
      createLesson({
        id: "course-ai-intro-lesson-4",
        slug: "designing-an-ai-workflow",
        title: "Designing an AI Workflow",
        type: "Text",
        duration: "20 min",
        objective: "Understand how AI fits inside a broader product workflow.",
        summary: "Learn the difference between model quality and workflow quality.",
        content: [
          "A strong AI workflow includes inputs, context, quality checks, and clear next actions. Learners often overfocus on prompts or models and underinvest in how users recover from poor outputs.",
          "This lesson shows how to map a simple AI workflow for tutoring support, content review, or student matching so you can evaluate reliability in context.",
        ],
      }),
      createLesson({
        id: "course-ai-intro-lesson-5",
        slug: "data-feedback-and-iteration",
        title: "Data, Feedback, and Iteration",
        type: "Resource",
        duration: "16 min",
        objective: "Connect data collection and evaluation to better AI products.",
        summary: "See how feedback loops improve systems over time.",
        content: [
          "Reliable AI features improve when teams capture failures, collect examples, and iterate deliberately. Even basic scorecards and review checklists can create compounding gains.",
          "You will leave this lesson with a lightweight template for logging output quality and identifying where more context or policy is needed.",
        ],
        resources: [
          createResource("Model evaluation worksheet", "Template"),
          createResource("Feedback loop cheatsheet", "Cheatsheet"),
        ],
      }),
      createLesson({
        id: "course-ai-intro-lesson-6",
        slug: "ai-foundations-checkpoint",
        title: "AI Foundations Checkpoint",
        type: "Quiz",
        duration: "14 min",
        objective: "Validate your understanding of AI workflows and evaluation.",
        summary: "A module checkpoint before course completion.",
        content: [
          "This quiz tests whether you can reason about use cases, feedback loops, and trust in AI-assisted experiences.",
        ],
        quizId: "quiz-ai-module-2",
      }),
    ],
  }),
] satisfies CourseModule[]

const promptModules = [
  createModule({
    id: "course-prompt-engineering-module-1",
    title: "Prompting Fundamentals",
    summary: "Learn the anatomy of strong prompts and how to reduce vague outputs.",
    estimatedTime: "2h 5m",
    lessons: [
      createLesson({
        id: "course-prompt-engineering-lesson-1",
        slug: "why-good-prompts-are-systems",
        title: "Why Good Prompts Are Systems",
        type: "Text",
        duration: "17 min",
        objective: "See prompting as workflow design, not clever phrasing.",
        summary: "Break prompting into instruction, context, examples, and evaluation.",
        content: [
          "Prompt engineering is rarely about one perfect sentence. Strong prompts define the task, add the right context, and make success measurable.",
          "In this lesson you will compare weak prompts with improved versions and learn what changes actually increase reliability.",
        ],
      }),
      createLesson({
        id: "course-prompt-engineering-lesson-2",
        slug: "prompt-patterns-that-scale",
        title: "Prompt Patterns That Scale",
        type: "Video",
        duration: "24 min",
        objective: "Practice reusable prompt structures for summarization, extraction, and planning.",
        summary: "Work through formats that teams can reuse across support, operations, and product work.",
        content: [
          "You will review role prompting, structured output, examples, and constraints. The aim is to make prompting repeatable for real tasks, not just demos.",
          "The accompanying worksheet helps you judge quality, latency, and human review needs when prompts move into production workflows.",
        ],
        resources: [createResource("Reusable prompt library", "Template")],
      }),
      createLesson({
        id: "course-prompt-engineering-lesson-3",
        slug: "prompting-basics-quiz",
        title: "Prompting Basics Quiz",
        type: "Quiz",
        duration: "10 min",
        objective: "Confirm your grasp of prompt structure and evaluation.",
        summary: "A short quiz on prompt anatomy and reliability.",
        content: [
          "Pass this assessment to move into prompt testing and workflow optimization.",
        ],
        quizId: "quiz-prompt-module-1",
      }),
    ],
  }),
  createModule({
    id: "course-prompt-engineering-module-2",
    title: "Prompt Operations",
    summary: "Test, refine, and operationalize prompts for consistent team use.",
    estimatedTime: "2h 20m",
    lessons: [
      createLesson({
        id: "course-prompt-engineering-lesson-4",
        slug: "evaluating-output-quality",
        title: "Evaluating Output Quality",
        type: "Text",
        duration: "18 min",
        objective: "Use rubrics and failure analysis to improve prompts.",
        summary: "Learn how teams score outputs and decide what to fix next.",
        content: [
          "Quality evaluation matters because prompts that look good once can still fail in real use. A simple rubric can expose where format, depth, or accuracy breaks down.",
          "This lesson introduces fast ways to compare outputs and capture failure modes without building a heavy testing framework.",
        ],
      }),
      createLesson({
        id: "course-prompt-engineering-lesson-5",
        slug: "building-prompt-ready-workflows",
        title: "Building Prompt-Ready Workflows",
        type: "Resource",
        duration: "15 min",
        objective: "Connect prompts to reusable business and learning workflows.",
        summary: "Turn isolated prompting into a dependable process.",
        content: [
          "Prompting becomes valuable when it fits into a workflow with templates, handoff rules, and review steps. You will map a simple workflow for a study assistant and a career coaching use case.",
          "The goal is to show how prompt operations support product quality and employability-focused tools.",
        ],
        resources: [
          createResource("Prompt QA rubric", "Guide"),
          createResource("Workflow handoff checklist", "Cheatsheet"),
        ],
      }),
      createLesson({
        id: "course-prompt-engineering-lesson-6",
        slug: "prompt-ops-checkpoint",
        title: "Prompt Ops Checkpoint",
        type: "Quiz",
        duration: "12 min",
        objective: "Assess your ability to improve and operationalize prompts.",
        summary: "Final course quiz with scenario-based questions.",
        content: [
          "This assessment focuses on prompt quality, evaluation, and workflow reliability.",
        ],
        quizId: "quiz-prompt-module-2",
      }),
    ],
  }),
] satisfies CourseModule[]

const cybersecurityModules = [
  createModule({
    id: "course-cybersecurity-module-1",
    title: "Security Mindset",
    summary: "Understand common attack surfaces, risk thinking, and daily security habits.",
    estimatedTime: "2h 15m",
    lessons: [
      createLesson({
        id: "course-cybersecurity-lesson-1",
        slug: "thinking-like-a-defender",
        title: "Thinking Like a Defender",
        type: "Text",
        duration: "19 min",
        objective: "Learn how defenders reason about risk and exposure.",
        summary: "Build the habits that make security work less abstract.",
        content: [
          "Security is about identifying what matters, where it can fail, and how to reduce harm. This lesson introduces assets, threats, controls, and tradeoffs in clear product language.",
          "You will practice translating vague worries into concrete risks that a small team can actually act on.",
        ],
      }),
      createLesson({
        id: "course-cybersecurity-lesson-2",
        slug: "account-device-and-network-basics",
        title: "Account, Device, and Network Basics",
        type: "Video",
        duration: "26 min",
        objective: "Review the foundations of identity, endpoints, and network hygiene.",
        summary: "See how everyday controls reduce real-world vulnerability.",
        content: [
          "The biggest security improvements often come from consistent fundamentals: strong identity controls, patching, device hygiene, and visibility.",
          "This lesson turns those ideas into a practical checklist for entry-level defenders and support teams.",
        ],
        resources: [createResource("Security hygiene checklist", "Guide")],
      }),
      createLesson({
        id: "course-cybersecurity-lesson-3",
        slug: "security-mindset-quiz",
        title: "Security Mindset Quiz",
        type: "Quiz",
        duration: "11 min",
        objective: "Check your understanding of assets, risk, and basic controls.",
        summary: "A short quiz to confirm module-one fundamentals.",
        content: [
          "Answer scenario-based questions about security posture, identity, and everyday risk reduction.",
        ],
        quizId: "quiz-cybersecurity-module-1",
      }),
    ],
  }),
  createModule({
    id: "course-cybersecurity-module-2",
    title: "Defensive Operations",
    summary: "Work with logs, alerts, and response habits that support real operational security.",
    estimatedTime: "2h 30m",
    lessons: [
      createLesson({
        id: "course-cybersecurity-lesson-4",
        slug: "logs-alerts-and-triage",
        title: "Logs, Alerts, and Triage",
        type: "Text",
        duration: "21 min",
        objective: "Understand what operational teams look for when suspicious activity appears.",
        summary: "Move from theory into practical defensive workflow thinking.",
        content: [
          "Alerts without context can overwhelm a team. Triage helps analysts decide what matters, what can wait, and what needs escalation.",
          "This lesson introduces a lightweight response flow that new analysts can use to stay organized under pressure.",
        ],
      }),
      createLesson({
        id: "course-cybersecurity-lesson-5",
        slug: "documenting-and-communicating-incidents",
        title: "Documenting and Communicating Incidents",
        type: "Resource",
        duration: "14 min",
        objective: "Write clearer incident notes and remediation follow-up.",
        summary: "Good documentation is a technical skill and a hiring differentiator.",
        content: [
          "Security work creates value when others can act on it. Strong incident notes reduce confusion, speed handoffs, and build trust.",
          "You will review a simple incident template and practice turning observations into next actions.",
        ],
        resources: [
          createResource("Incident response note template", "Template"),
          createResource("Escalation checklist", "Cheatsheet"),
        ],
      }),
      createLesson({
        id: "course-cybersecurity-lesson-6",
        slug: "defensive-operations-checkpoint",
        title: "Defensive Operations Checkpoint",
        type: "Quiz",
        duration: "12 min",
        objective: "Test your understanding of triage and operational communication.",
        summary: "Final checkpoint for the course.",
        content: [
          "This assessment focuses on security operations, triage, and communicating findings clearly.",
        ],
        quizId: "quiz-cybersecurity-module-2",
      }),
    ],
  }),
] satisfies CourseModule[]

const fullStackModules = [
  createModule({
    id: "course-full-stack-module-1",
    title: "Modern Web Foundations",
    summary: "Learn how frontend, backend, and data layers work together in a production app.",
    estimatedTime: "2h 20m",
    lessons: [
      createLesson({
        id: "course-full-stack-lesson-1",
        slug: "frontend-backend-and-data",
        title: "Frontend, Backend, and Data",
        type: "Text",
        duration: "20 min",
        objective: "Build a reliable mental model of full stack architecture.",
        summary: "Understand the responsibilities of each part of a web product.",
        content: [
          "Full stack development is not about doing everything alone. It is about understanding how user interfaces, APIs, and databases connect into one dependable experience.",
          "This lesson explains the core request-response cycle and why product quality depends on collaboration across layers.",
        ],
      }),
      createLesson({
        id: "course-full-stack-lesson-2",
        slug: "working-with-apis-and-forms",
        title: "Working with APIs and Forms",
        type: "Video",
        duration: "23 min",
        objective: "See how data moves from interface to server and back again.",
        summary: "Review validation, loading states, and helpful user feedback.",
        content: [
          "This lesson focuses on user-facing quality: clear forms, useful error states, and predictable data handling. Those are often the details that separate student projects from credible products.",
          "You will trace a common app flow from form submission to database persistence to UI refresh.",
        ],
        resources: [createResource("CRUD flow diagram", "Guide")],
      }),
      createLesson({
        id: "course-full-stack-lesson-3",
        slug: "web-foundations-quiz",
        title: "Web Foundations Quiz",
        type: "Quiz",
        duration: "11 min",
        objective: "Check your understanding of app layers and data flow.",
        summary: "A quick quiz on the fundamentals of full stack thinking.",
        content: [
          "Use this assessment to confirm you understand how frontend, backend, and data systems coordinate.",
        ],
        quizId: "quiz-full-stack-module-1",
      }),
    ],
  }),
  createModule({
    id: "course-full-stack-module-2",
    title: "Shipping Product Features",
    summary: "Go beyond theory and think like a teammate shipping reliable user value.",
    estimatedTime: "2h 30m",
    lessons: [
      createLesson({
        id: "course-full-stack-lesson-4",
        slug: "building-for-real-users",
        title: "Building for Real Users",
        type: "Text",
        duration: "19 min",
        objective: "Translate feature work into user outcomes and quality bars.",
        summary: "Learn to connect engineering decisions to actual product goals.",
        content: [
          "Good engineering work is not only technically correct. It is also understandable, resilient, and aligned with user needs.",
          "This lesson shows how to break a feature into smaller decisions around UX, validation, data, and release confidence.",
        ],
      }),
      createLesson({
        id: "course-full-stack-lesson-5",
        slug: "portfolio-ready-project-brief",
        title: "Portfolio-Ready Project Brief",
        type: "Resource",
        duration: "16 min",
        objective: "Prepare a practical project brief you can turn into a portfolio piece.",
        summary: "Use the brief to practice shipping a small but credible product.",
        content: [
          "Portfolio projects stand out when they solve a clear problem and show the decisions behind the build. This brief helps you scope something realistic rather than overly broad.",
          "You will also see how to capture impact so your project strengthens your CV later.",
        ],
        resources: [
          createResource("Project brief starter", "Project Brief"),
          createResource("Feature acceptance checklist", "Cheatsheet"),
        ],
      }),
      createLesson({
        id: "course-full-stack-lesson-6",
        slug: "shipping-features-checkpoint",
        title: "Shipping Features Checkpoint",
        type: "Quiz",
        duration: "13 min",
        objective: "Confirm your understanding of user-centered feature delivery.",
        summary: "Final assessment on product-minded engineering.",
        content: [
          "This checkpoint covers architecture, UX, validation, and release quality in modern web apps.",
        ],
        quizId: "quiz-full-stack-module-2",
      }),
    ],
  }),
] satisfies CourseModule[]

const dataAnalyticsModules = [
  createModule({
    id: "course-data-analytics-module-1",
    title: "Data Wrangling Fundamentals",
    summary: "Organize messy data and prepare it for useful analysis.",
    estimatedTime: "2h 12m",
    lessons: [
      createLesson({
        id: "course-data-analytics-lesson-1",
        slug: "asking-better-questions-with-data",
        title: "Asking Better Questions with Data",
        type: "Text",
        duration: "16 min",
        objective: "Start analysis with clear questions and decision context.",
        summary: "The best analysis begins before code or charts.",
        content: [
          "Many weak analyses fail because the question is vague. Strong analysts define the audience, decision, and evidence needed before touching the dataset.",
          "This lesson helps you frame useful questions so later steps stay focused and relevant.",
        ],
      }),
      createLesson({
        id: "course-data-analytics-lesson-2",
        slug: "cleaning-data-with-python",
        title: "Cleaning Data with Python",
        type: "Video",
        duration: "27 min",
        objective: "Use Python-friendly habits for cleaning and preparing tabular data.",
        summary: "Review common issues such as missing values, inconsistent fields, and duplicate records.",
        content: [
          "Data cleaning is where trust is built. You will look at a simple workflow for inspecting data, fixing basic issues, and documenting assumptions.",
          "The lesson is intentionally practical so that learners can carry the same habits into internship tasks and student projects.",
        ],
        resources: [createResource("Pandas cleaning checklist", "Guide")],
      }),
      createLesson({
        id: "course-data-analytics-lesson-3",
        slug: "data-wrangling-quiz",
        title: "Data Wrangling Quiz",
        type: "Quiz",
        duration: "10 min",
        objective: "Assess your understanding of question framing and cleaning basics.",
        summary: "Module-one checkpoint for analytics learners.",
        content: [
          "Complete this quiz to validate your understanding of clean inputs and analysis setup.",
        ],
        quizId: "quiz-data-analytics-module-1",
      }),
    ],
  }),
  createModule({
    id: "course-data-analytics-module-2",
    title: "Insight Communication",
    summary: "Turn analysis into dashboards and recommendations that others can use.",
    estimatedTime: "2h 18m",
    lessons: [
      createLesson({
        id: "course-data-analytics-lesson-4",
        slug: "choosing-the-right-metric",
        title: "Choosing the Right Metric",
        type: "Text",
        duration: "18 min",
        objective: "Pick metrics that genuinely help decisions.",
        summary: "Move away from vanity charts and toward meaningful evidence.",
        content: [
          "Strong analysts know that the wrong metric can create false confidence. This lesson helps you connect metrics to behavior, outcomes, and next actions.",
          "You will also review how to explain caveats without weakening your insight.",
        ],
      }),
      createLesson({
        id: "course-data-analytics-lesson-5",
        slug: "storytelling-with-dashboards",
        title: "Storytelling with Dashboards",
        type: "Resource",
        duration: "15 min",
        objective: "Use dashboards to guide action instead of simply showing data.",
        summary: "Learn a cleaner structure for analytical communication.",
        content: [
          "A good dashboard helps someone understand what changed, why it matters, and what to do next. This lesson gives you a structure that is especially useful in internship settings.",
          "You will also review an example dashboard narrative that turns numbers into a business recommendation.",
        ],
        resources: [
          createResource("Dashboard storytelling guide", "Guide"),
          createResource("Insight narrative template", "Template"),
        ],
      }),
      createLesson({
        id: "course-data-analytics-lesson-6",
        slug: "analytics-storytelling-checkpoint",
        title: "Analytics Storytelling Checkpoint",
        type: "Quiz",
        duration: "11 min",
        objective: "Measure your understanding of metrics and communication.",
        summary: "Final checkpoint for the course.",
        content: [
          "This assessment focuses on metrics, dashboards, and practical recommendations.",
        ],
        quizId: "quiz-data-analytics-module-2",
      }),
    ],
  }),
] satisfies CourseModule[]

const cloudModules = [
  createModule({
    id: "course-cloud-module-1",
    title: "Cloud Concepts",
    summary: "Understand what cloud services are and why they matter to modern teams.",
    estimatedTime: "1h 55m",
    lessons: [
      createLesson({
        id: "course-cloud-lesson-1",
        slug: "what-the-cloud-solves",
        title: "What the Cloud Solves",
        type: "Text",
        duration: "15 min",
        objective: "Understand the value of cloud services in practical terms.",
        summary: "Learn why teams use cloud infrastructure and how services are grouped.",
        content: [
          "Cloud computing helps teams launch faster, scale more easily, and avoid managing every server detail themselves. That convenience comes with tradeoffs around cost, security, and architecture choices.",
          "This lesson introduces core service models in plain language so you can reason about real product setups.",
        ],
      }),
      createLesson({
        id: "course-cloud-lesson-2",
        slug: "reliability-and-observability",
        title: "Reliability and Observability",
        type: "Video",
        duration: "22 min",
        objective: "See how teams monitor services and respond to issues.",
        summary: "Get familiar with uptime, logs, alerts, and deployment confidence.",
        content: [
          "Reliable cloud systems depend on visibility. Teams need metrics, logs, and alerts that make it easier to spot issues before users feel them.",
          "You will review how basic observability practices support both product quality and entry-level cloud roles.",
        ],
        resources: [createResource("Cloud monitoring checklist", "Guide")],
      }),
      createLesson({
        id: "course-cloud-lesson-3",
        slug: "cloud-concepts-quiz",
        title: "Cloud Concepts Quiz",
        type: "Quiz",
        duration: "9 min",
        objective: "Check your understanding of service models and observability basics.",
        summary: "Quick checkpoint for module one.",
        content: [
          "Answer a short set of questions covering cloud value, services, and monitoring.",
        ],
        quizId: "quiz-cloud-module-1",
      }),
    ],
  }),
  createModule({
    id: "course-cloud-module-2",
    title: "Deploying Reliably",
    summary: "Connect deployment habits, environment management, and basic operational readiness.",
    estimatedTime: "2h 5m",
    lessons: [
      createLesson({
        id: "course-cloud-lesson-4",
        slug: "deployment-readiness",
        title: "Deployment Readiness",
        type: "Text",
        duration: "17 min",
        objective: "Understand the checks that keep releases predictable.",
        summary: "Learn why release confidence depends on process as much as tooling.",
        content: [
          "A deployment is safer when teams know what is changing, how to verify it, and how to recover. Even small startups rely on these habits to move quickly without chaos.",
          "This lesson introduces a practical release checklist that new learners can understand and reuse.",
        ],
      }),
      createLesson({
        id: "course-cloud-lesson-5",
        slug: "hands-on-ops-template",
        title: "Hands-On Ops Template",
        type: "Resource",
        duration: "14 min",
        objective: "Use a simple template for documenting environments and release checks.",
        summary: "Turn abstract cloud ideas into a repeatable operations habit.",
        content: [
          "This template helps learners think through environments, rollout steps, and fallback plans. It is especially useful when you want to show operational maturity in internships.",
          "Treat it as a lightweight document you can adapt for personal or team projects.",
        ],
        resources: [
          createResource("Release readiness template", "Template"),
          createResource("Environment map example", "Guide"),
        ],
      }),
      createLesson({
        id: "course-cloud-lesson-6",
        slug: "cloud-ops-checkpoint",
        title: "Cloud Ops Checkpoint",
        type: "Quiz",
        duration: "10 min",
        objective: "Assess your understanding of release readiness and operational basics.",
        summary: "Final course checkpoint.",
        content: [
          "Use this quiz to confirm your understanding of cloud reliability and deployment habits.",
        ],
        quizId: "quiz-cloud-module-2",
      }),
    ],
  }),
] satisfies CourseModule[]

function createCompactModules(coursePrefix: string, themes: string[]) {
  return [
    createModule({
      id: `${coursePrefix}-module-1`,
      title: themes[0],
      summary: `Build practical understanding of ${themes[0].toLowerCase()} in a real learner workflow.`,
      estimatedTime: "1h 50m",
      lessons: [
        createLesson({
          id: `${coursePrefix}-lesson-1`,
          slug: `${coursePrefix}-concepts`,
          title: `${themes[0]} Concepts`,
          type: "Text",
          duration: "18 min",
          objective: `Understand the foundations of ${themes[0].toLowerCase()}.`,
          summary: "Start with principles, user needs, and real-world context.",
          content: [
            `This lesson introduces the language, workflows, and practical expectations behind ${themes[0].toLowerCase()}.`,
            "The goal is to help you think like a practitioner instead of collecting isolated definitions.",
          ],
        }),
        createLesson({
          id: `${coursePrefix}-lesson-2`,
          slug: `${coursePrefix}-workflow`,
          title: `${themes[0]} Workflow`,
          type: "Resource",
          duration: "16 min",
          objective: `Apply ${themes[0].toLowerCase()} through a structured workflow.`,
          summary: "Use a guide and template to turn concepts into repeatable action.",
          content: [
            `You will map a simple workflow for ${themes[0].toLowerCase()} and note where quality, communication, and iteration matter most.`,
          ],
          resources: [createResource(`${themes[0]} workflow template`, "Template")],
        }),
      ],
    }),
    createModule({
      id: `${coursePrefix}-module-2`,
      title: themes[1],
      summary: `Translate ${themes[1].toLowerCase()} into portfolio value and employability signals.`,
      estimatedTime: "1h 40m",
      lessons: [
        createLesson({
          id: `${coursePrefix}-lesson-3`,
          slug: `${coursePrefix}-application`,
          title: `${themes[1]} in Practice`,
          type: "Video",
          duration: "22 min",
          objective: `See how ${themes[1].toLowerCase()} shows up in team settings.`,
          summary: "Review examples that connect the skill to real work.",
          content: [
            `This lesson shows how ${themes[1].toLowerCase()} becomes visible in projects, collaboration, and internships.`,
            "The focus stays on practical execution and learner confidence rather than theory alone.",
          ],
          resources: [createResource(`${themes[1]} checklist`, "Guide")],
        }),
        createLesson({
          id: `${coursePrefix}-lesson-4`,
          slug: `${coursePrefix}-checkpoint`,
          title: `${themes[1]} Checkpoint`,
          type: "Quiz",
          duration: "10 min",
          objective: `Confirm your understanding of ${themes[0].toLowerCase()} and ${themes[1].toLowerCase()}.`,
          summary: "A short assessment to complete the course.",
          content: [
            "Answer a short quiz focused on practical application, communication, and workflow quality.",
          ],
          quizId: `quiz-${coursePrefix}-final`,
        }),
      ],
    }),
  ] satisfies CourseModule[]
}

export const seedCourses: Course[] = [
  {
    id: "course-ai-intro",
    slug: "introduction-to-artificial-intelligence",
    title: "Introduction to Artificial Intelligence",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: "4h 35m",
    durationHours: 5,
    shortDescription:
      "Build a grounded understanding of AI systems, workflows, and responsible implementation.",
    description:
      "A practical starter course for learners who want to understand where AI creates value, how teams evaluate it, and how to think clearly about trust, feedback, and implementation.",
    rating: 4.8,
    reviewCount: 1284,
    instructor: {
      name: "Tetisol AI Team",
      role: "Applied AI Instructors",
      company: "Tetisol",
      bio: "The Tetisol AI Team helps learners turn AI concepts into portfolio-ready, employability-focused skills.",
    },
    skills: ["Artificial Intelligence", "AI Workflow Design", "Evaluation", "Responsible AI"],
    outcomes: [
      "Explain the difference between models, workflows, and product value",
      "Assess whether an AI use case is realistic and useful",
      "Design lightweight evaluation and feedback loops",
    ],
    prerequisites: ["Comfort reading product and technical examples"],
    modules: aiModules,
    certificateAvailable: true,
    featured: true,
    popular: true,
    isNew: false,
    heroGradient: "from-indigo-600 via-indigo-500 to-sky-400",
    internshipFocus: ["AI Research Intern", "Prompt Design Intern", "AI Operations Intern"],
    updatedAt: "2026-04-20",
  },
  {
    id: "course-prompt-engineering",
    slug: "practical-prompt-engineering",
    title: "Practical Prompt Engineering",
    category: "Prompt Engineering",
    level: "Beginner",
    duration: "4h 25m",
    durationHours: 4,
    shortDescription:
      "Learn prompt structures, quality evaluation, and repeatable AI workflow design.",
    description:
      "A career-focused prompt engineering course that helps learners design dependable prompts, evaluate results, and translate prompting into real product and operations workflows.",
    rating: 4.9,
    reviewCount: 1688,
    instructor: {
      name: "Rudo Chikafa",
      role: "Prompt Systems Lead",
      company: "Tetisol",
      bio: "Rudo helps student teams build reliable AI workflows that improve communication, productivity, and product quality.",
    },
    skills: ["Prompt Engineering", "Prompt Evaluation", "Workflow Design", "AI Communication"],
    outcomes: [
      "Write stronger prompts using reusable structures",
      "Evaluate prompt quality with simple rubrics",
      "Map prompt-driven workflows for real-world tasks",
    ],
    prerequisites: ["Comfort using generative AI tools"],
    modules: promptModules,
    certificateAvailable: true,
    featured: true,
    popular: true,
    isNew: true,
    heroGradient: "from-sky-600 via-indigo-500 to-cyan-400",
    internshipFocus: ["Prompt Design Intern", "AI Research Assistant", "Operations Analyst Intern"],
    updatedAt: "2026-04-21",
  },
  {
    id: "course-cybersecurity",
    slug: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "4h 45m",
    durationHours: 5,
    shortDescription:
      "Learn security reasoning, operational basics, and documentation habits that teams value.",
    description:
      "An entry-level cybersecurity course that covers risk thinking, control basics, incident documentation, and defensive workflows in a way that feels relevant to real internship environments.",
    rating: 4.7,
    reviewCount: 954,
    instructor: {
      name: "Tawanda Ncube",
      role: "Security Operations Mentor",
      company: "Tetisol",
      bio: "Tawanda teaches practical security foundations for learners who want to become dependable entry-level defenders.",
    },
    skills: ["Cybersecurity", "Security Operations", "Documentation", "Risk Thinking"],
    outcomes: [
      "Explain basic security controls and risks",
      "Triage simple alerts and document findings clearly",
      "Understand the habits that support reliable defensive work",
    ],
    prerequisites: ["Basic comfort with browsers, devices, and online accounts"],
    modules: cybersecurityModules,
    certificateAvailable: true,
    featured: true,
    popular: true,
    isNew: false,
    heroGradient: "from-slate-900 via-indigo-700 to-sky-500",
    internshipFocus: ["Cybersecurity Intern", "IT Support Intern", "SOC Trainee"],
    updatedAt: "2026-04-19",
  },
  {
    id: "course-full-stack",
    slug: "full-stack-web-development-basics",
    title: "Full Stack Web Development Basics",
    category: "Web Development",
    level: "Beginner",
    duration: "4h 50m",
    durationHours: 5,
    shortDescription:
      "Understand how interfaces, APIs, and data work together in modern web products.",
    description:
      "A foundational web development course for learners who want to build credible product projects and understand what full stack delivery actually looks like on a team.",
    rating: 4.8,
    reviewCount: 1416,
    instructor: {
      name: "Tetisol Product Engineering",
      role: "Full Stack Instructors",
      company: "Tetisol",
      bio: "The Tetisol product engineering team teaches modern product-minded development with a strong UX and delivery lens.",
    },
    skills: ["Next.js", "React", "APIs", "Product Thinking"],
    outcomes: [
      "Understand full stack architecture and data flow",
      "Build forms and interfaces with better user feedback",
      "Scope a portfolio project that shows real product judgment",
    ],
    prerequisites: ["Basic HTML, CSS, or JavaScript exposure is helpful"],
    modules: fullStackModules,
    certificateAvailable: true,
    featured: true,
    popular: true,
    isNew: false,
    heroGradient: "from-indigo-700 via-violet-600 to-sky-400",
    internshipFocus: ["Software Dev Intern", "Frontend Intern", "Product Engineering Intern"],
    updatedAt: "2026-04-18",
  },
  {
    id: "course-data-analytics",
    slug: "data-analytics-with-python",
    title: "Data Analytics with Python",
    category: "Data Analytics",
    level: "Beginner",
    duration: "4h 30m",
    durationHours: 5,
    shortDescription:
      "Clean data, choose better metrics, and communicate insights that lead to action.",
    description:
      "A beginner-friendly analytics course focused on asking stronger questions, cleaning data with confidence, and turning analysis into dashboards and recommendations.",
    rating: 4.8,
    reviewCount: 1135,
    instructor: {
      name: "Nomsa Dube",
      role: "Data Learning Lead",
      company: "Tetisol",
      bio: "Nomsa teaches analytics through practical business questions and employability-ready communication habits.",
    },
    skills: ["Python", "Data Cleaning", "Metrics", "Dashboards"],
    outcomes: [
      "Frame better analytical questions",
      "Prepare messy datasets for analysis",
      "Build clearer metric stories for stakeholders",
    ],
    prerequisites: ["Comfort with spreadsheets is enough to start"],
    modules: dataAnalyticsModules,
    certificateAvailable: true,
    featured: true,
    popular: false,
    isNew: true,
    heroGradient: "from-sky-700 via-cyan-600 to-indigo-500",
    internshipFocus: ["Data Analyst Intern", "Business Intelligence Intern", "Operations Analyst"],
    updatedAt: "2026-04-21",
  },
  {
    id: "course-cloud",
    slug: "cloud-computing-essentials",
    title: "Cloud Computing Essentials",
    category: "Cloud Computing",
    level: "Beginner",
    duration: "4h 0m",
    durationHours: 4,
    shortDescription:
      "Understand cloud services, observability, and release readiness for modern teams.",
    description:
      "A practical introduction to cloud thinking for learners who want to understand infrastructure value, system visibility, and reliable release habits.",
    rating: 4.7,
    reviewCount: 802,
    instructor: {
      name: "Tetisol Platform Team",
      role: "Cloud and Reliability Instructors",
      company: "Tetisol",
      bio: "The platform team teaches cloud fundamentals in a way that supports product delivery and internship readiness.",
    },
    skills: ["Cloud Basics", "Observability", "Release Readiness", "Operations"],
    outcomes: [
      "Explain why teams use cloud services",
      "Understand logs, alerts, and observability basics",
      "Apply deployment readiness habits to projects and team workflows",
    ],
    prerequisites: ["No prior cloud experience required"],
    modules: cloudModules,
    certificateAvailable: true,
    featured: false,
    popular: true,
    isNew: false,
    heroGradient: "from-cyan-700 via-sky-600 to-indigo-500",
    internshipFocus: ["Cloud Operations Intern", "DevOps Intern", "Infrastructure Support Intern"],
    updatedAt: "2026-04-17",
  },
  {
    id: "course-ui-ux",
    slug: "ui-ux-design-foundations",
    title: "UI/UX Design Foundations",
    category: "UI/UX Design",
    level: "Beginner",
    duration: "3h 40m",
    durationHours: 4,
    shortDescription:
      "Learn user-centered design thinking, interface quality, and portfolio-ready workflow habits.",
    description:
      "A design fundamentals course that helps learners move from vague ideas to clearer user flows, stronger interface decisions, and better communication in product teams.",
    rating: 4.8,
    reviewCount: 721,
    instructor: {
      name: "Tatenda Mhlanga",
      role: "Product Design Coach",
      company: "Tetisol",
      bio: "Tatenda helps learners build design confidence through structured user-centered workflows.",
    },
    skills: ["UX Research", "Wireframing", "Visual Design", "Interface Thinking"],
    outcomes: [
      "Map user needs into cleaner journeys",
      "Create stronger interface structures",
      "Communicate design thinking more clearly in a portfolio",
    ],
    prerequisites: ["No design background required"],
    modules: createCompactModules("course-ui-ux", ["User-Centered Design", "Interface Quality"]),
    certificateAvailable: true,
    featured: false,
    popular: true,
    isNew: false,
    heroGradient: "from-rose-500 via-indigo-500 to-sky-400",
    internshipFocus: ["Product Design Intern", "UX Intern", "Creative Technology Intern"],
    updatedAt: "2026-04-14",
  },
  {
    id: "course-it-support",
    slug: "it-support-fundamentals",
    title: "IT Support Fundamentals",
    category: "IT Support",
    level: "Beginner",
    duration: "3h 30m",
    durationHours: 4,
    shortDescription:
      "Build troubleshooting, service desk, and communication habits for dependable support work.",
    description:
      "A practical support course that prepares learners for entry-level service desk and campus support environments with a focus on troubleshooting and user empathy.",
    rating: 4.6,
    reviewCount: 564,
    instructor: {
      name: "Tetisol Support Enablement",
      role: "IT Support Coaches",
      company: "Tetisol",
      bio: "The support enablement team teaches reliable troubleshooting habits with a strong user-experience lens.",
    },
    skills: ["Troubleshooting", "Service Desk", "Documentation", "User Support"],
    outcomes: [
      "Handle common first-line support issues more confidently",
      "Write clearer support notes and escalation context",
      "Demonstrate patience and structured problem solving",
    ],
    prerequisites: ["Basic device and internet familiarity"],
    modules: createCompactModules("course-it-support", ["Support Basics", "Troubleshooting Workflow"]),
    certificateAvailable: true,
    featured: false,
    popular: false,
    isNew: false,
    heroGradient: "from-slate-700 via-sky-600 to-cyan-400",
    internshipFocus: ["IT Support Intern", "Helpdesk Trainee", "Operations Support Intern"],
    updatedAt: "2026-04-13",
  },
  {
    id: "course-career-readiness",
    slug: "career-readiness-for-tech-students",
    title: "Career Readiness for Tech Students",
    category: "Career Readiness",
    level: "Beginner",
    duration: "3h 20m",
    durationHours: 3,
    shortDescription:
      "Turn your skills into stronger applications, clearer stories, and better internship readiness.",
    description:
      "A focused employability course covering positioning, evidence of work, application quality, and communication habits that help learners move from studying to earning.",
    rating: 4.9,
    reviewCount: 1795,
    instructor: {
      name: "Tetisol Career Studio",
      role: "Career Readiness Mentors",
      company: "Tetisol",
      bio: "The career team helps learners package skills into stronger internship and job opportunities.",
    },
    skills: ["CV Writing", "Interview Preparation", "Career Storytelling", "Professional Communication"],
    outcomes: [
      "Write stronger evidence-based CV content",
      "Map learning and projects into employability signals",
      "Prepare for applications and interviews more strategically",
    ],
    prerequisites: ["Open to all learners"],
    modules: createCompactModules("course-career-readiness", ["Career Positioning", "Application Strategy"]),
    certificateAvailable: true,
    featured: true,
    popular: true,
    isNew: false,
    heroGradient: "from-indigo-700 via-sky-600 to-cyan-400",
    internshipFocus: ["All internship pathways", "Graduate trainee roles", "Portfolio-driven applications"],
    updatedAt: "2026-04-21",
  },
  {
    id: "course-digital-marketing",
    slug: "digital-marketing-for-tech-builders",
    title: "Digital Marketing for Tech Builders",
    category: "Digital Marketing",
    level: "Beginner",
    duration: "3h 35m",
    durationHours: 4,
    shortDescription:
      "Learn campaign thinking, audience messaging, and analytics for modern digital channels.",
    description:
      "A modern marketing starter course for learners who want to pair storytelling with metrics and understand how digital channels support real growth goals.",
    rating: 4.6,
    reviewCount: 433,
    instructor: {
      name: "Lindiwe Sibanda",
      role: "Growth Marketing Mentor",
      company: "Tetisol",
      bio: "Lindiwe helps learners connect content, campaigns, and analytics to practical growth work.",
    },
    skills: ["Campaign Strategy", "Content Writing", "Performance Analytics", "Audience Research"],
    outcomes: [
      "Plan simple digital campaigns with clearer goals",
      "Create stronger audience-focused content",
      "Use analytics to improve creative work",
    ],
    prerequisites: ["No prior marketing experience required"],
    modules: createCompactModules("course-digital-marketing", ["Audience Strategy", "Campaign Analytics"]),
    certificateAvailable: true,
    featured: false,
    popular: false,
    isNew: true,
    heroGradient: "from-fuchsia-500 via-indigo-500 to-sky-400",
    internshipFocus: ["Digital Marketing Intern", "Content Intern", "Growth Operations Intern"],
    updatedAt: "2026-04-20",
  },
]

export const seedQuizzes: Quiz[] = [
  createQuiz(
    "quiz-ai-module-1",
    "course-ai-intro",
    "course-ai-intro-module-1",
    "course-ai-intro-lesson-3",
    "Responsible AI Basics Quiz",
    "Check your understanding of AI definitions, use cases, and responsibility basics.",
    createQuestions("quiz-ai-module-1", [
      {
        prompt: "Which description best fits a practical AI workflow?",
        options: [
          "A model running without any review or context",
          "A set of inputs, context, quality checks, and next actions",
          "Any chatbot with a friendly interface",
          "A dataset stored in a spreadsheet",
        ],
        correctAnswer: "A set of inputs, context, quality checks, and next actions",
        explanation: "Useful AI products depend on workflow design, not only model quality.",
      },
      {
        prompt: "Why do teams evaluate AI use cases before building them?",
        options: [
          "To reduce unnecessary work and identify where AI is a poor fit",
          "To avoid talking to users",
          "To make prompts longer",
          "To remove all human judgment",
        ],
        correctAnswer: "To reduce unnecessary work and identify where AI is a poor fit",
        explanation: "Use-case evaluation prevents wasted effort and surfaces workflow risk early.",
      },
      {
        prompt: "Which factor most improves trust in an AI-assisted flow?",
        options: [
          "Hiding low-confidence output",
          "Clear review steps and feedback loops",
          "Using the newest model name",
          "Adding more colors to the interface",
        ],
        correctAnswer: "Clear review steps and feedback loops",
        explanation: "Trust increases when quality is managed through review and iteration.",
      },
    ])
  ),
  createQuiz(
    "quiz-ai-module-2",
    "course-ai-intro",
    "course-ai-intro-module-2",
    "course-ai-intro-lesson-6",
    "AI Foundations Checkpoint",
    "Assess your understanding of AI workflow design and evaluation habits.",
    createQuestions("quiz-ai-module-2", [
      {
        prompt: "What should a team capture first when improving an AI workflow?",
        options: [
          "Failure examples and output quality patterns",
          "A bigger logo",
          "More meetings with no agenda",
          "A second landing page",
        ],
        correctAnswer: "Failure examples and output quality patterns",
        explanation: "Collected failures make iteration more targeted and useful.",
      },
      {
        prompt: "Why are feedback loops important in AI products?",
        options: [
          "They help systems improve over time",
          "They make prompts shorter",
          "They replace product decisions",
          "They eliminate the need for evaluation",
        ],
        correctAnswer: "They help systems improve over time",
        explanation: "Feedback loops help teams learn from failures and refine quality.",
      },
      {
        prompt: "Which statement is most accurate?",
        options: [
          "Model quality alone guarantees a good user experience",
          "Workflow design matters alongside model output",
          "AI products do not need guardrails",
          "Evaluation only matters after launch",
        ],
        correctAnswer: "Workflow design matters alongside model output",
        explanation: "Even strong models can create poor experiences inside weak workflows.",
      },
    ])
  ),
  createQuiz(
    "quiz-prompt-module-1",
    "course-prompt-engineering",
    "course-prompt-engineering-module-1",
    "course-prompt-engineering-lesson-3",
    "Prompting Basics Quiz",
    "Validate your understanding of prompt structure and quality.",
    createQuestions("quiz-prompt-module-1", [
      {
        prompt: "What usually makes a prompt more reliable?",
        options: [
          "More context, clearer instructions, and useful examples",
          "Using only one-word prompts",
          "Avoiding any constraints",
          "Removing the task objective",
        ],
        correctAnswer: "More context, clearer instructions, and useful examples",
        explanation: "Good prompts clarify the task and shape output quality.",
      },
      {
        prompt: "Why is structured output helpful?",
        options: [
          "It makes responses easier to review and reuse",
          "It guarantees factual accuracy",
          "It removes the need for QA",
          "It forces the model to be creative",
        ],
        correctAnswer: "It makes responses easier to review and reuse",
        explanation: "Structure improves consistency and downstream usability.",
      },
      {
        prompt: "Prompt engineering is best described as:",
        options: [
          "A system design skill for getting dependable outputs",
          "A way to avoid thinking about users",
          "Random experimentation with no evaluation",
          "Only useful for writers",
        ],
        correctAnswer: "A system design skill for getting dependable outputs",
        explanation: "Effective prompting supports repeatable workflows and measurable quality.",
      },
    ])
  ),
  createQuiz(
    "quiz-prompt-module-2",
    "course-prompt-engineering",
    "course-prompt-engineering-module-2",
    "course-prompt-engineering-lesson-6",
    "Prompt Ops Checkpoint",
    "Assess prompt evaluation and workflow integration skills.",
    createQuestions("quiz-prompt-module-2", [
      {
        prompt: "What is the main purpose of a prompt quality rubric?",
        options: [
          "To compare outputs against consistent criteria",
          "To make prompts longer",
          "To avoid human review entirely",
          "To reduce the need for product decisions",
        ],
        correctAnswer: "To compare outputs against consistent criteria",
        explanation: "Rubrics turn vague impressions into usable feedback.",
      },
      {
        prompt: "When does prompt work become most valuable?",
        options: [
          "When it fits a workflow with handoff and review steps",
          "When it exists as a random note",
          "When no one documents it",
          "When it changes every hour",
        ],
        correctAnswer: "When it fits a workflow with handoff and review steps",
        explanation: "Prompting creates real value when it becomes reusable and dependable.",
      },
      {
        prompt: "Which habit best supports prompt improvement?",
        options: [
          "Logging failure patterns and iteration notes",
          "Changing everything at once",
          "Ignoring bad outputs",
          "Only testing once",
        ],
        correctAnswer: "Logging failure patterns and iteration notes",
        explanation: "Improvement depends on visible evidence and deliberate iteration.",
      },
    ])
  ),
  createQuiz(
    "quiz-cybersecurity-module-1",
    "course-cybersecurity",
    "course-cybersecurity-module-1",
    "course-cybersecurity-lesson-3",
    "Security Mindset Quiz",
    "Check your understanding of risk, controls, and basic security habits.",
    createQuestions("quiz-cybersecurity-module-1", [
      {
        prompt: "A security asset is best described as:",
        options: [
          "Something valuable that should be protected",
          "Any app feature with bright colors",
          "A type of password manager only",
          "A random alert in a dashboard",
        ],
        correctAnswer: "Something valuable that should be protected",
        explanation: "Assets include data, systems, accounts, and operations that matter to the organization.",
      },
      {
        prompt: "Why do strong identity controls matter?",
        options: [
          "They reduce unauthorized access risk",
          "They eliminate all incidents forever",
          "They remove the need for patching",
          "They only help designers",
        ],
        correctAnswer: "They reduce unauthorized access risk",
        explanation: "Identity controls are a core part of everyday security hygiene.",
      },
      {
        prompt: "What is a practical first step in risk thinking?",
        options: [
          "Define what matters and where it could fail",
          "Collect every tool available",
          "Ignore tradeoffs",
          "Only think about worst-case scenarios",
        ],
        correctAnswer: "Define what matters and where it could fail",
        explanation: "Security improves when teams translate concern into concrete, actionable risk.",
      },
    ])
  ),
  createQuiz(
    "quiz-cybersecurity-module-2",
    "course-cybersecurity",
    "course-cybersecurity-module-2",
    "course-cybersecurity-lesson-6",
    "Defensive Operations Checkpoint",
    "Assess your understanding of triage and incident communication.",
    createQuestions("quiz-cybersecurity-module-2", [
      {
        prompt: "What is triage in security operations?",
        options: [
          "Prioritizing alerts and deciding next actions",
          "Deleting all alerts immediately",
          "A type of firewall only",
          "Writing marketing copy",
        ],
        correctAnswer: "Prioritizing alerts and deciding next actions",
        explanation: "Triage helps teams focus effort where risk is highest.",
      },
      {
        prompt: "Why is incident documentation important?",
        options: [
          "It supports clearer handoffs and remediation follow-up",
          "It slows teams down for no reason",
          "It replaces technical investigation",
          "It matters only after an audit",
        ],
        correctAnswer: "It supports clearer handoffs and remediation follow-up",
        explanation: "Good documentation makes security work useful to others.",
      },
      {
        prompt: "Which habit helps an entry-level defender most?",
        options: [
          "Clear notes, consistent process, and calm escalation",
          "Guessing without evidence",
          "Ignoring context",
          "Escalating everything immediately",
        ],
        correctAnswer: "Clear notes, consistent process, and calm escalation",
        explanation: "Reliable operations depend on disciplined communication and process.",
      },
    ])
  ),
  createQuiz(
    "quiz-full-stack-module-1",
    "course-full-stack",
    "course-full-stack-module-1",
    "course-full-stack-lesson-3",
    "Web Foundations Quiz",
    "Check your understanding of app architecture and data flow.",
    createQuestions("quiz-full-stack-module-1", [
      {
        prompt: "Which layer usually handles user interaction directly?",
        options: ["Frontend", "Database", "Server logs", "Queue worker"],
        correctAnswer: "Frontend",
        explanation: "The frontend is the user-facing layer of a web app.",
      },
      {
        prompt: "Why do strong forms matter in product work?",
        options: [
          "They improve clarity, trust, and data quality",
          "They only make the page look longer",
          "They remove the need for backend validation",
          "They are unrelated to user experience",
        ],
        correctAnswer: "They improve clarity, trust, and data quality",
        explanation: "Forms are where user confidence and data quality often meet.",
      },
      {
        prompt: "An API is primarily used to:",
        options: [
          "Move data between parts of a system",
          "Choose brand colors",
          "Replace user research",
          "Store CSS directly",
        ],
        correctAnswer: "Move data between parts of a system",
        explanation: "APIs connect clients and services in a predictable way.",
      },
    ])
  ),
  createQuiz(
    "quiz-full-stack-module-2",
    "course-full-stack",
    "course-full-stack-module-2",
    "course-full-stack-lesson-6",
    "Shipping Features Checkpoint",
    "Assess your understanding of delivery quality and user-centered engineering.",
    createQuestions("quiz-full-stack-module-2", [
      {
        prompt: "What often makes a portfolio project feel credible?",
        options: [
          "A clear problem, thoughtful scope, and visible product decisions",
          "Maximum complexity regardless of purpose",
          "No explanation of user value",
          "Only copying a tutorial exactly",
        ],
        correctAnswer: "A clear problem, thoughtful scope, and visible product decisions",
        explanation: "Employers value clear judgment and execution, not only complexity.",
      },
      {
        prompt: "Why do release checklists help teams?",
        options: [
          "They reduce avoidable mistakes during delivery",
          "They make features less useful",
          "They replace testing entirely",
          "They are only for large enterprises",
        ],
        correctAnswer: "They reduce avoidable mistakes during delivery",
        explanation: "Checklists make quality and verification more repeatable.",
      },
      {
        prompt: "Which mindset improves engineering impact most?",
        options: [
          "Connecting technical choices to user outcomes",
          "Optimizing without context",
          "Ignoring product goals",
          "Avoiding feedback",
        ],
        correctAnswer: "Connecting technical choices to user outcomes",
        explanation: "Product-minded engineering leads to stronger decisions and collaboration.",
      },
    ])
  ),
  createQuiz(
    "quiz-data-analytics-module-1",
    "course-data-analytics",
    "course-data-analytics-module-1",
    "course-data-analytics-lesson-3",
    "Data Wrangling Quiz",
    "Check question framing and dataset preparation fundamentals.",
    createQuestions("quiz-data-analytics-module-1", [
      {
        prompt: "What should come before charting or coding?",
        options: [
          "Clarifying the decision and analytical question",
          "Choosing random colors",
          "Writing the conclusion first",
          "Removing all rows immediately",
        ],
        correctAnswer: "Clarifying the decision and analytical question",
        explanation: "Useful analysis starts with a clear question and audience.",
      },
      {
        prompt: "Why is data cleaning important?",
        options: [
          "It improves trust in analysis and reduces misleading conclusions",
          "It only matters for very large teams",
          "It replaces domain knowledge",
          "It removes the need for documentation",
        ],
        correctAnswer: "It improves trust in analysis and reduces misleading conclusions",
        explanation: "Bad inputs weaken any analysis, regardless of tooling.",
      },
      {
        prompt: "A strong cleaning habit is:",
        options: [
          "Documenting assumptions and changes",
          "Editing data without notes",
          "Deleting unfamiliar columns immediately",
          "Skipping inspection",
        ],
        correctAnswer: "Documenting assumptions and changes",
        explanation: "Documentation helps others understand and trust your work.",
      },
    ])
  ),
  createQuiz(
    "quiz-data-analytics-module-2",
    "course-data-analytics",
    "course-data-analytics-module-2",
    "course-data-analytics-lesson-6",
    "Analytics Storytelling Checkpoint",
    "Assess your understanding of metrics and communication.",
    createQuestions("quiz-data-analytics-module-2", [
      {
        prompt: "What makes a metric useful?",
        options: [
          "It supports a real decision or behavior insight",
          "It is easy to screenshot",
          "It always goes up",
          "It looks impressive in isolation",
        ],
        correctAnswer: "It supports a real decision or behavior insight",
        explanation: "Useful metrics connect evidence to action.",
      },
      {
        prompt: "A strong dashboard should help people:",
        options: [
          "See what changed, why it matters, and what to do next",
          "Look at as many charts as possible",
          "Ignore caveats",
          "Avoid taking action",
        ],
        correctAnswer: "See what changed, why it matters, and what to do next",
        explanation: "Great dashboards guide action, not just observation.",
      },
      {
        prompt: "What strengthens analytical storytelling?",
        options: [
          "Clear narrative, caveats, and recommendation",
          "Only listing raw numbers",
          "Hiding uncertainty",
          "Removing context from the audience",
        ],
        correctAnswer: "Clear narrative, caveats, and recommendation",
        explanation: "Decision-makers need both evidence and context.",
      },
    ])
  ),
  createQuiz(
    "quiz-cloud-module-1",
    "course-cloud",
    "course-cloud-module-1",
    "course-cloud-lesson-3",
    "Cloud Concepts Quiz",
    "Validate your understanding of cloud value and observability basics.",
    createQuestions("quiz-cloud-module-1", [
      {
        prompt: "Why do teams use cloud services?",
        options: [
          "To launch faster and scale without managing every server directly",
          "To avoid all architectural decisions",
          "To remove security concerns entirely",
          "To stop documenting systems",
        ],
        correctAnswer: "To launch faster and scale without managing every server directly",
        explanation: "Cloud services trade infrastructure convenience for thoughtful design and governance.",
      },
      {
        prompt: "What is observability mainly about?",
        options: [
          "Seeing how systems behave through metrics, logs, and alerts",
          "Only naming servers well",
          "Removing dashboards",
          "Avoiding deployment reviews",
        ],
        correctAnswer: "Seeing how systems behave through metrics, logs, and alerts",
        explanation: "Visibility is a major part of reliable operations.",
      },
      {
        prompt: "Which skill is especially valuable in cloud operations?",
        options: [
          "Clear operational documentation",
          "Ignoring process",
          "Skipping verification",
          "Changing environments without notes",
        ],
        correctAnswer: "Clear operational documentation",
        explanation: "Operations work depends on clarity, repeatability, and handoff confidence.",
      },
    ])
  ),
  createQuiz(
    "quiz-cloud-module-2",
    "course-cloud",
    "course-cloud-module-2",
    "course-cloud-lesson-6",
    "Cloud Ops Checkpoint",
    "Assess your understanding of release readiness and operational discipline.",
    createQuestions("quiz-cloud-module-2", [
      {
        prompt: "What helps make a deployment safer?",
        options: [
          "Knowing what changed, how to verify it, and how to recover",
          "Deploying without communication",
          "Skipping environment review",
          "Avoiding logs",
        ],
        correctAnswer: "Knowing what changed, how to verify it, and how to recover",
        explanation: "Release readiness is about reducing avoidable surprises.",
      },
      {
        prompt: "Why do teams document environments?",
        options: [
          "To reduce confusion and improve coordination",
          "Only to satisfy a checklist",
          "To replace monitoring",
          "To make setup harder",
        ],
        correctAnswer: "To reduce confusion and improve coordination",
        explanation: "Operational clarity supports faster and safer work.",
      },
      {
        prompt: "Which habit is strongest for entry-level cloud learners?",
        options: [
          "Treating reliability as a process, not only a toolset",
          "Relying only on intuition",
          "Skipping validation",
          "Making silent production changes",
        ],
        correctAnswer: "Treating reliability as a process, not only a toolset",
        explanation: "Reliable delivery comes from disciplined habits and clear systems.",
      },
    ])
  ),
  createQuiz(
    "quiz-course-ui-ux-final",
    "course-ui-ux",
    "course-ui-ux-module-2",
    "course-ui-ux-lesson-4",
    "Interface Quality Checkpoint",
    "Final quiz for UI/UX design foundations.",
    createQuestions("quiz-course-ui-ux-final", [
      {
        prompt: "What should guide interface decisions first?",
        options: ["User needs and clarity", "Random trends", "Only personal taste", "Maximum animation"],
        correctAnswer: "User needs and clarity",
        explanation: "Strong design starts with user understanding and clear goals.",
      },
      {
        prompt: "A good workflow template helps designers:",
        options: ["Repeat quality decisions more consistently", "Avoid all feedback", "Skip research", "Ignore constraints"],
        correctAnswer: "Repeat quality decisions more consistently",
        explanation: "Templates support repeatable quality, especially for newer designers.",
      },
      {
        prompt: "Why is interface quality employability-relevant?",
        options: ["It shows judgment, empathy, and craft", "It removes collaboration", "It only matters for freelancers", "It is separate from product work"],
        correctAnswer: "It shows judgment, empathy, and craft",
        explanation: "Hiring teams value thoughtful design decisions and communication.",
      },
    ])
  ),
  createQuiz(
    "quiz-course-it-support-final",
    "course-it-support",
    "course-it-support-module-2",
    "course-it-support-lesson-4",
    "Troubleshooting Workflow Checkpoint",
    "Final quiz for IT support fundamentals.",
    createQuestions("quiz-course-it-support-final", [
      {
        prompt: "What makes troubleshooting more effective?",
        options: ["A structured process and clear notes", "Guessing quickly", "Escalating everything", "Ignoring users"],
        correctAnswer: "A structured process and clear notes",
        explanation: "Consistency improves both resolution speed and communication.",
      },
      {
        prompt: "Why does empathy matter in support work?",
        options: ["It improves trust and user experience", "It slows down every task", "It replaces technical skill", "It only matters for managers"],
        correctAnswer: "It improves trust and user experience",
        explanation: "Support work is technical and human at the same time.",
      },
      {
        prompt: "Good documentation in support helps with:",
        options: ["Faster future resolution and clearer escalation", "Making tickets longer only", "Avoiding collaboration", "Hiding uncertainty"],
        correctAnswer: "Faster future resolution and clearer escalation",
        explanation: "Clear notes reduce repeat work and improve team coordination.",
      },
    ])
  ),
  createQuiz(
    "quiz-course-career-readiness-final",
    "course-career-readiness",
    "course-career-readiness-module-2",
    "course-career-readiness-lesson-4",
    "Application Strategy Checkpoint",
    "Final quiz for career readiness.",
    createQuestions("quiz-course-career-readiness-final", [
      {
        prompt: "What makes a CV bullet stronger?",
        options: ["Clear action, context, and outcome", "Only listing tools", "Keeping it vague", "Avoiding evidence"],
        correctAnswer: "Clear action, context, and outcome",
        explanation: "Evidence and specificity create stronger employability signals.",
      },
      {
        prompt: "Why should learning history appear in applications?",
        options: ["It shows skill growth and initiative", "It is unrelated to hiring", "It replaces all project work", "It only matters after graduation"],
        correctAnswer: "It shows skill growth and initiative",
        explanation: "Courses, certificates, and projects help tell a fuller readiness story.",
      },
      {
        prompt: "The best application strategy is usually:",
        options: ["Targeted and evidence-based", "Apply everywhere with the same CV", "Wait for perfect confidence", "Hide your projects"],
        correctAnswer: "Targeted and evidence-based",
        explanation: "Focused applications tend to be stronger and easier to improve.",
      },
    ])
  ),
  createQuiz(
    "quiz-course-digital-marketing-final",
    "course-digital-marketing",
    "course-digital-marketing-module-2",
    "course-digital-marketing-lesson-4",
    "Campaign Analytics Checkpoint",
    "Final quiz for digital marketing foundations.",
    createQuestions("quiz-course-digital-marketing-final", [
      {
        prompt: "What makes campaign analytics useful?",
        options: ["Connecting results to audience behavior and next actions", "Only collecting likes", "Ignoring campaign goals", "Removing context"],
        correctAnswer: "Connecting results to audience behavior and next actions",
        explanation: "Analytics helps marketing teams improve strategy and execution.",
      },
      {
        prompt: "Strong digital content usually starts with:",
        options: ["Clear audience understanding", "Random posting", "Guessing what people want", "Avoiding measurement"],
        correctAnswer: "Clear audience understanding",
        explanation: "Audience clarity improves both messaging and performance.",
      },
      {
        prompt: "Why is campaign documentation helpful?",
        options: ["It helps teams learn what worked and improve faster", "It replaces creativity", "It is only for agencies", "It slows everything down"],
        correctAnswer: "It helps teams learn what worked and improve faster",
        explanation: "Documentation supports iteration and accountability.",
      },
    ])
  ),
]

seedInternships.forEach((internship) => {
  internship.shortDescription ??= internship.description
  internship.fullDescription ??= internship.description
  internship.preferredQualifications ??= internship.requirements.slice(0, 2)
  internship.applicationLink ??= `https://apply.tetisol.dev/${internship.slug}`
  internship.type ??= "Internship"
  internship.status ??= "Published"
})

seedCourses.forEach((course) => {
  course.status ??= "Published"
  course.thumbnail ??= `tetisol-course-${course.slug}.png`
  course.modules = course.modules.map((module, moduleIndex) => ({
    ...module,
    orderIndex: module.orderIndex ?? moduleIndex,
    lessons: module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      orderIndex: lesson.orderIndex ?? lessonIndex,
      published: lesson.published ?? true,
      resourceLink: lesson.resourceLink ?? lesson.resources?.[0]?.url ?? "",
    })),
  }))
})

export const demoPersonas: DemoPersona[] = [
  {
    id: "user-new",
    email: "new@tetisol.com",
    password: "careerhub",
    fullName: "Aisha Ncube",
    state: "New learner",
    description:
      "Just finished onboarding, has clear interests, but has not started a course yet.",
    focus: ["Artificial Intelligence", "Career Readiness", "First internship"],
  },
  {
    id: "user-demo",
    email: "demo@tetisol.com",
    password: "careerhub",
    fullName: "Lerato Moyo",
    state: "Active learner",
    description:
      "Learning steadily, already holds certificates, and is actively translating progress into internships.",
    focus: ["Prompt Engineering", "Frontend product work", "Internship readiness"],
  },
  {
    id: "user-stalled",
    email: "stalled@tetisol.com",
    password: "careerhub",
    fullName: "Tawanda Dube",
    state: "Stalled learner",
    description:
      "Started strong in AI and cloud topics, then lost momentum and now needs a focused restart.",
    focus: ["Artificial Intelligence", "Cloud Computing", "Cybersecurity"],
  },
  {
    id: "user-almost",
    email: "almost@tetisol.com",
    password: "careerhub",
    fullName: "Nomsa Sibanda",
    state: "Almost-certified learner",
    description:
      "Close to unlocking a certificate and already seeing internship relevance from recent learning.",
    focus: ["Cybersecurity", "Cloud Computing", "Operations roles"],
  },
  {
    id: "user-ready",
    email: "ready@tetisol.com",
    password: "careerhub",
    fullName: "Musa Chari",
    state: "Career-ready learner",
    description:
      "Strong learner profile with multiple certificates, a high-quality CV, and applications already in motion.",
    focus: ["Prompt Engineering", "Data Analytics", "AI internship applications"],
  },
]

function createDemoAccount(persona: DemoPersona): UserAccount {
  return {
    id: persona.id,
    email: persona.email,
    password: persona.password,
    fullName: persona.fullName,
    role: "student",
    demoPersonaState: persona.state,
    demoPersonaDescription: persona.description,
    demoPersonaFocus: persona.focus,
  }
}

export const demoUser: UserAccount = createDemoAccount(demoPersonas[1])
export const newLearnerUser: UserAccount = createDemoAccount(demoPersonas[0])
export const stalledLearnerUser: UserAccount = createDemoAccount(demoPersonas[2])
export const almostCertifiedUser: UserAccount = createDemoAccount(demoPersonas[3])
export const careerReadyUser: UserAccount = createDemoAccount(demoPersonas[4])
export const adminUser: UserAccount = {
  id: "user-admin",
  email: "admin@tetisol.com",
  password: "careerhub",
  fullName: "Tetisol Admin",
  role: "admin",
}

export const instructorUser: UserAccount = {
  id: "user-instructor",
  email: "lecturer@tetisol.com",
  password: "careerhub",
  fullName: "Tetisol Lecturer",
  role: "instructor",
}

export const blankProfile: StudentProfile = {
  name: "",
  school: "",
  degree: "",
  location: "",
  bio: "",
  skills: [],
  interests: [],
  preferredRoles: [],
  availability: "Immediate",
  preferredInternshipFields: [],
  learningFocus: [],
  careerGoals: [],
}

export const blankPreferences: UserPreferences = {
  preferredLocations: [],
  preferredInternshipFields: [],
  preferredLearningCategories: [],
  weeklyLearningGoalHours: 4,
  internshipPriority: "Balanced",
}

export const demoProfile: StudentProfile = {
  name: "Lerato Moyo",
  school: "National University of Science and Technology",
  degree: "BSc Computer Science",
  location: "Harare, Zimbabwe",
  bio: "Final-year learner building AI and web product skills with a strong interest in startup tools, practical automation, and internship readiness.",
  skills: ["React", "TypeScript", "Prompt Engineering", "SQL", "Problem Solving"],
  interests: ["Artificial Intelligence", "Web Development", "Data Analytics"],
  preferredRoles: ["Frontend Intern", "Prompt Design Intern", "Data Intern"],
  availability: "Available from June 2026",
  preferredInternshipFields: ["AI", "Engineering", "Data"],
  learningFocus: [
    "Prompt Engineering",
    "Artificial Intelligence",
    "Web Development",
  ],
  careerGoals: [
    "Build a portfolio that shows practical AI and product skills",
    "Secure an internship in AI, software, or analytics",
  ],
}

export const demoPreferences: UserPreferences = {
  preferredLocations: ["Harare, Zimbabwe", "Remote"],
  preferredInternshipFields: ["AI", "Engineering", "Data"],
  preferredLearningCategories: [
    "Prompt Engineering",
    "Artificial Intelligence",
    "Career Readiness",
  ],
  weeklyLearningGoalHours: 6,
  internshipPriority: "Balanced",
}

const demoProjects: CVProject[] = [
  {
    id: "project-career",
    title: "Tetisol Opportunity Compass",
    role: "Frontend & Workflow Builder",
    summary:
      "Built a responsive learning-to-career dashboard that combines course progress, internship recommendations, and CV momentum.",
    impact:
      "Reduced opportunity discovery time for testers from 30 minutes to under 10 while making weekly learning goals visible in one view.",
    stack: ["Next.js", "TypeScript", "Supabase"],
  },
  {
    id: "project-prompt",
    title: "Prompt Review Studio",
    role: "AI Workflow Learner",
    summary:
      "Created a prompt quality review flow with templates, scoring prompts, and clearer feedback loops for student support use cases.",
    impact:
      "Improved review consistency across 15 test prompts and turned the workflow into a portfolio-ready case study.",
    stack: ["Prompt Engineering", "QA", "Notion"],
    sourceCourseId: "course-prompt-engineering",
  },
]

export const blankCv: CVDocument = {
  id: "cv-default",
  headline: "",
  summary: "",
  education: "",
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  score: 0,
  suggestions: [],
  lastUpdated: now,
}

export const demoCertificates: Certificate[] = [
  {
    id: "certificate-prompt",
    courseId: "course-prompt-engineering",
    learnerName: "Lerato Moyo",
    issuedAt: "2026-04-16",
    certificateNumber: "TET-PE-2026-0148",
    shareUrl: null,
    downloadUrl: null,
  },
  {
    id: "certificate-career",
    courseId: "course-career-readiness",
    learnerName: "Lerato Moyo",
    issuedAt: "2026-04-18",
    certificateNumber: "TET-CR-2026-0081",
    shareUrl: null,
    downloadUrl: null,
  },
]

export const demoCv: CVDocument = {
  id: "cv-demo",
  headline: "AI-focused product learner building employability tools for students",
  summary:
    "I enjoy turning practical learning into usable product experiences. My strongest work blends frontend execution, prompt workflow design, and clear communication that helps users move from learning into real opportunities.",
  education:
    "BSc Computer Science, National University of Science and Technology, expected 2026",
  skills: [
    "React",
    "TypeScript",
    "Prompt Engineering",
    "Next.js",
    "SQL",
    "Career Storytelling",
  ],
  experience: [
    "Completed structured learning in prompt engineering and career readiness, then translated that work into portfolio-ready assets.",
    "Built a learner dashboard prototype that combined courses, internship recommendations, and CV feedback into one product flow.",
  ],
  projects: demoProjects,
  certifications: demoCertificates.map((certificate) => ({
    id: `cv-${certificate.id}`,
    courseName:
      seedCourses.find((course) => course.id === certificate.courseId)?.title ??
      "Tetisol Certificate",
    issuer: "Tetisol",
    issuedAt: certificate.issuedAt,
    credentialId: certificate.certificateNumber,
  })),
  achievements: [
    "Completed Tetisol's Practical Prompt Engineering certificate with assessment-based validation.",
    "Turned course outcomes into stronger CV bullets and internship-ready portfolio evidence.",
  ],
  score: 92,
  suggestions: [
    "Add one direct portfolio link beside your headline.",
    "Quantify a second project result with learner or team impact.",
  ],
  lastUpdated: now,
}

export const demoApplications: ApplicationRecord[] = [
  {
    id: "application-1",
    internshipId: "internship-software-dev",
    status: "Interview",
    notes: "Completed coding challenge. Follow-up call scheduled with the engineering lead.",
    deadline: "2026-04-28",
    createdAt: "2026-04-10",
    updatedAt: "2026-04-20",
  },
  {
    id: "application-2",
    internshipId: "internship-ai-research",
    status: "Applied",
    notes: "Shared portfolio links and prompt workflow case study.",
    deadline: "2026-05-22",
    createdAt: "2026-04-12",
    updatedAt: "2026-04-18",
  },
  {
    id: "application-3",
    internshipId: "internship-data-analyst",
    status: "Interested",
    notes: "Looks aligned with current analytics learning path.",
    deadline: "2026-05-08",
    createdAt: "2026-04-19",
    updatedAt: "2026-04-19",
  },
]

function getCourseLessonIds(courseId: string) {
  const course = seedCourses.find((item) => item.id === courseId)
  return course ? course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)) : []
}

export const demoLearningNotes: LearningNote[] = [
  {
    id: "note-prompt-lesson-4",
    courseId: "course-prompt-engineering",
    lessonId: "course-prompt-engineering-lesson-4",
    content:
      "Rubrics matter because they make output quality discussable. I should reuse this in my portfolio case study.",
    updatedAt: "2026-04-16T10:00:00.000Z",
  },
  {
    id: "note-data-lesson-2",
    courseId: "course-data-analytics",
    lessonId: "course-data-analytics-lesson-2",
    content:
      "Need to show cleaning assumptions clearly when presenting insights. This could strengthen my internship interviews.",
    updatedAt: "2026-04-20T13:20:00.000Z",
  },
]

export function createBlankWorkspace(name = ""): UserWorkspace {
  return {
    profile: {
      ...blankProfile,
      name,
    },
    preferences: blankPreferences,
    savedInternshipIds: [],
    applications: [],
    cv: {
      ...blankCv,
      id: `cv-${Math.random().toString(36).slice(2, 9)}`,
    },
    enrollments: [],
    quizAttempts: [],
    certificates: [],
    learningNotes: [],
    reminders: [],
    onboardingCompleted: false,
  }
}

export const adminWorkspace: UserWorkspace = {
  ...createBlankWorkspace("Tetisol Admin"),
  profile: {
    ...blankProfile,
    name: "Tetisol Admin",
    school: "Tetisol",
    degree: "Internal CMS",
    location: "Harare, Zimbabwe",
    bio: "Internal platform administrator managing learning and opportunity content.",
  },
  preferences: {
    ...blankPreferences,
    weeklyLearningGoalHours: 0,
    internshipPriority: "Balanced",
  },
  reminders: [
    {
      id: "admin-reminder-1",
      kind: "Learning",
      title: "Review this week's featured courses",
      description: "Check draft content, publishing status, and internship freshness before new campaigns go live.",
      date: "2026-04-24",
      href: "/admin",
    },
  ],
  onboardingCompleted: true,
}

function createSeededCv(
  id: string,
  values: Partial<CVDocument>
): CVDocument {
  return {
    ...blankCv,
    id,
    ...values,
    lastUpdated: values.lastUpdated ?? now,
  }
}

function createSeededCertificate(
  id: string,
  courseId: string,
  learnerName: string,
  issuedAt: string,
  certificateNumber: string
): Certificate {
  return {
    id,
    courseId,
    learnerName,
    issuedAt,
    certificateNumber,
    shareUrl: null,
    downloadUrl: null,
  }
}

const completedPromptLessons = getCourseLessonIds("course-prompt-engineering")
const completedCareerLessons = getCourseLessonIds("course-career-readiness")
const completedAiLessons = getCourseLessonIds("course-ai-intro")
const completedCloudLessons = getCourseLessonIds("course-cloud")
const completedFullStackLessons = getCourseLessonIds("course-full-stack")
const inProgressDataLessons = [
  "course-data-analytics-lesson-1",
  "course-data-analytics-lesson-2",
  "course-data-analytics-lesson-3",
]
const inProgressCyberLessons = [
  "course-cybersecurity-lesson-1",
  "course-cybersecurity-lesson-2",
]
const stalledAiLessons = [
  "course-ai-intro-lesson-1",
  "course-ai-intro-lesson-2",
]
const stalledCloudLessons = [
  "course-cloud-lesson-1",
]
const almostCyberLessons = getCourseLessonIds("course-cybersecurity").slice(0, 5)

export const demoWorkspace: UserWorkspace = {
  profile: demoProfile,
  preferences: demoPreferences,
  savedInternshipIds: [
    "internship-software-dev",
    "internship-ai-research",
    "internship-data-analyst",
  ],
  applications: demoApplications,
  cv: demoCv,
  enrollments: [
    {
      id: "enrollment-prompt",
      courseId: "course-prompt-engineering",
      enrolledAt: "2026-04-11",
      startedAt: "2026-04-11",
      completedAt: "2026-04-16",
      completedLessonIds: completedPromptLessons,
      lastLessonId: completedPromptLessons[completedPromptLessons.length - 1] ?? null,
      lastActivityAt: "2026-04-16T12:00:00.000Z",
    },
    {
      id: "enrollment-career",
      courseId: "course-career-readiness",
      enrolledAt: "2026-04-13",
      startedAt: "2026-04-13",
      completedAt: "2026-04-18",
      completedLessonIds: completedCareerLessons,
      lastLessonId: completedCareerLessons[completedCareerLessons.length - 1] ?? null,
      lastActivityAt: "2026-04-18T14:20:00.000Z",
    },
    {
      id: "enrollment-data",
      courseId: "course-data-analytics",
      enrolledAt: "2026-04-19",
      startedAt: "2026-04-19",
      completedAt: null,
      completedLessonIds: inProgressDataLessons,
      lastLessonId: "course-data-analytics-lesson-3",
      lastActivityAt: "2026-04-20T16:20:00.000Z",
    },
    {
      id: "enrollment-cyber",
      courseId: "course-cybersecurity",
      enrolledAt: "2026-04-20",
      startedAt: "2026-04-20",
      completedAt: null,
      completedLessonIds: inProgressCyberLessons,
      lastLessonId: "course-cybersecurity-lesson-2",
      lastActivityAt: "2026-04-20T12:05:00.000Z",
    },
  ],
  quizAttempts: [
    {
      id: "attempt-prompt-1",
      quizId: "quiz-prompt-module-1",
      courseId: "course-prompt-engineering",
      lessonId: "course-prompt-engineering-lesson-3",
      answers: {},
      score: 100,
      passed: true,
      submittedAt: "2026-04-14T09:00:00.000Z",
    },
    {
      id: "attempt-prompt-2",
      quizId: "quiz-prompt-module-2",
      courseId: "course-prompt-engineering",
      lessonId: "course-prompt-engineering-lesson-6",
      answers: {},
      score: 87,
      passed: true,
      submittedAt: "2026-04-16T12:00:00.000Z",
    },
    {
      id: "attempt-career-1",
      quizId: "quiz-course-career-readiness-final",
      courseId: "course-career-readiness",
      lessonId: "course-career-readiness-lesson-4",
      answers: {},
      score: 93,
      passed: true,
      submittedAt: "2026-04-18T14:20:00.000Z",
    },
    {
      id: "attempt-data-1",
      quizId: "quiz-data-analytics-module-1",
      courseId: "course-data-analytics",
      lessonId: "course-data-analytics-lesson-3",
      answers: {},
      score: 78,
      passed: true,
      submittedAt: "2026-04-20T16:20:00.000Z",
    },
  ],
  certificates: demoCertificates,
  learningNotes: demoLearningNotes,
  reminders: [
    {
      id: "reminder-data-module-2",
      kind: "Learning",
      title: "Resume Data Analytics with Python",
      description: "Continue with Choosing the Right Metric to keep your analytics path moving.",
      date: "2026-04-23",
      href: "/learning/data-analytics-with-python",
    },
    {
      id: "reminder-application-call",
      kind: "Application",
      title: "BlueOrbit interview follow-up",
      description: "Prepare one product story and one technical challenge reflection before the call.",
      date: "2026-04-28",
      href: "/applications",
    },
  ],
  onboardingCompleted: true,
}

export const newLearnerProfile: StudentProfile = {
  name: "Aisha Ncube",
  school: "University of Zimbabwe",
  degree: "BSc Information Systems",
  location: "Mutare, Zimbabwe",
  bio: "Early-stage learner exploring AI and digital work opportunities with a strong desire to build a first credible portfolio.",
  skills: ["Communication", "Research", "Presentation"],
  interests: ["Artificial Intelligence", "Career Readiness", "Digital Marketing"],
  preferredRoles: ["AI Research Intern", "Digital Marketing Intern"],
  availability: "Available immediately",
  preferredInternshipFields: ["AI", "Marketing"],
  learningFocus: ["Artificial Intelligence", "Career Readiness"],
  careerGoals: [
    "Build my first internship-ready CV",
    "Find a structured entry point into AI and digital work",
  ],
}

export const stalledLearnerProfile: StudentProfile = {
  name: "Tawanda Dube",
  school: "Chinhoyi University of Technology",
  degree: "BSc Software Engineering",
  location: "Bulawayo, Zimbabwe",
  bio: "Started strong in AI and cloud topics but lost consistency after exams and now needs a clearer restart path.",
  skills: ["Python", "Linux", "Documentation", "Problem Solving"],
  interests: ["Artificial Intelligence", "Cloud Computing", "Cybersecurity"],
  preferredRoles: ["Cloud Operations Intern", "AI Research Assistant Intern"],
  availability: "Available from May 2026",
  preferredInternshipFields: ["Cloud", "AI", "Security"],
  learningFocus: ["Artificial Intelligence", "Cloud Computing"],
  careerGoals: [
    "Restart my practical learning rhythm",
    "Translate coursework into a more visible portfolio",
  ],
}

export const almostCertifiedProfile: StudentProfile = {
  name: "Nomsa Sibanda",
  school: "Midlands State University",
  degree: "BSc Cybersecurity",
  location: "Harare, Zimbabwe",
  bio: "A focused cybersecurity learner who is close to completing a certificate and wants that proof to unlock stronger operations roles.",
  skills: ["Linux", "Networking", "Security Basics", "Documentation"],
  interests: ["Cybersecurity", "Cloud Computing", "IT Support"],
  preferredRoles: ["Cybersecurity Intern", "Cloud Operations Intern"],
  availability: "Available in June 2026",
  preferredInternshipFields: ["Security", "Cloud", "IT Support"],
  learningFocus: ["Cybersecurity", "Cloud Computing"],
  careerGoals: [
    "Complete a certificate in cybersecurity",
    "Secure an internship in security operations",
  ],
}

export const careerReadyProfile: StudentProfile = {
  name: "Musa Chari",
  school: "Africa University",
  degree: "BSc Data Science",
  location: "Harare, Zimbabwe",
  bio: "A high-momentum learner using AI, analytics, and prompt engineering courses to sharpen a portfolio and apply to ambitious internship roles.",
  skills: ["Python", "SQL", "Prompt Engineering", "Dashboards", "Storytelling"],
  interests: ["Artificial Intelligence", "Prompt Engineering", "Data Analytics"],
  preferredRoles: ["AI Research Assistant Intern", "Prompt Design Intern", "Data Analyst Intern"],
  availability: "Available immediately",
  preferredInternshipFields: ["AI", "Data", "Engineering"],
  learningFocus: ["Prompt Engineering", "Data Analytics", "Artificial Intelligence"],
  careerGoals: [
    "Convert Tetisol learning proof into internships this quarter",
    "Build a portfolio that demonstrates product-ready AI and analytics skills",
  ],
}

const newLearnerCv = createSeededCv("cv-new", {
  headline: "Curious learner building a first path into AI and digital work",
  summary:
    "I am at the beginning of my tech journey and actively exploring practical learning paths that can help me build confidence, skills, and a first internship-ready CV.",
  education:
    "BSc Information Systems, University of Zimbabwe, expected 2027",
  skills: ["Communication", "Research", "Presentation", "Canva", "Learning Agility"],
  experience: [
    "Participated in student-led technology events and presentations.",
  ],
  projects: [
    {
      id: "project-new-1",
      title: "Career Exploration Board",
      role: "Learner Researcher",
      summary:
        "Created a simple opportunity board to compare internships, courses, and skills I need to build.",
      impact:
        "Gave me a structured plan for choosing learning priorities over the next 8 weeks.",
      stack: ["Notion", "Research", "Communication"],
    },
  ],
  achievements: [
    "Completed onboarding and mapped a first learning direction inside Tetisol.",
  ],
  score: 48,
  suggestions: [
    "Add at least one technical course completion.",
    "Increase the number of role-relevant skills.",
    "Add a stronger project with measurable outcome.",
  ],
})

const stalledLearnerCv = createSeededCv("cv-stalled", {
  headline: "Cloud and AI learner rebuilding practical momentum",
  summary:
    "I have foundational exposure to cloud and AI concepts and want to turn that base into visible proof through consistent project work and clearer execution.",
  education:
    "BSc Software Engineering, Chinhoyi University of Technology, expected 2026",
  skills: ["Python", "Linux", "Cloud Basics", "Documentation", "Problem Solving"],
  experience: [
    "Started practical learning in AI foundations and cloud operations.",
    "Documented setup guides and simple technical workflows during university team work.",
  ],
  projects: [
    {
      id: "project-stalled-1",
      title: "Cloud Study Notes Hub",
      role: "Learner Builder",
      summary:
        "Structured personal notes and checklists for cloud operations and monitoring basics.",
      impact:
        "Reduced time spent re-learning repeated concepts and made revision easier before labs.",
      stack: ["Markdown", "Linux", "Documentation"],
    },
  ],
  achievements: [
    "Built a structured study system for cloud topics.",
  ],
  score: 61,
  suggestions: [
    "Finish one active course to unlock stronger proof.",
    "Add one quantified project outcome.",
    "Import course-based skills into the CV.",
  ],
})

const almostCertifiedCertificates = [
  createSeededCertificate(
    "certificate-almost-cloud",
    "course-cloud",
    "Nomsa Sibanda",
    "2026-04-10",
    "TET-CC-2026-0301"
  ),
]

const almostCertifiedCv = createSeededCv("cv-almost", {
  headline: "Cybersecurity learner preparing for operations-focused internships",
  summary:
    "I enjoy practical security and infrastructure work and I am building a portfolio that shows operational thinking, technical discipline, and readiness for internship responsibility.",
  education:
    "BSc Cybersecurity, Midlands State University, expected 2026",
  skills: ["Linux", "Networking", "Security Basics", "Cloud Basics", "Documentation", "Incident Thinking"],
  experience: [
    "Completed cloud computing essentials and applied the lessons to operations checklists.",
    "Worked through guided cybersecurity lessons focused on practical defensive habits.",
  ],
  projects: [
    {
      id: "project-almost-1",
      title: "Security Playbook Starter",
      role: "Learner Analyst",
      summary:
        "Created a starter incident response and vulnerability review checklist from course work.",
      impact:
        "Improved how quickly I can reason through common security scenarios during practice sessions.",
      stack: ["Linux", "Security Basics", "Documentation"],
      sourceCourseId: "course-cloud",
    },
  ],
  certifications: almostCertifiedCertificates.map((certificate) => ({
    id: `cv-${certificate.id}`,
    courseName:
      seedCourses.find((course) => course.id === certificate.courseId)?.title ??
      "Tetisol Certificate",
    issuer: "Tetisol",
    issuedAt: certificate.issuedAt,
    credentialId: certificate.certificateNumber,
  })),
  achievements: [
    "Completed Cloud Computing Essentials and used the lessons to strengthen operations thinking.",
  ],
  score: 78,
  suggestions: [
    "Finish Cybersecurity Fundamentals to unlock stronger proof.",
    "Add one more quantified impact statement.",
  ],
})

const careerReadyCertificates = [
  createSeededCertificate(
    "certificate-ready-ai",
    "course-ai-intro",
    "Musa Chari",
    "2026-04-05",
    "TET-AI-2026-0601"
  ),
  createSeededCertificate(
    "certificate-ready-prompt",
    "course-prompt-engineering",
    "Musa Chari",
    "2026-04-08",
    "TET-PE-2026-0602"
  ),
  createSeededCertificate(
    "certificate-ready-data",
    "course-data-analytics",
    "Musa Chari",
    "2026-04-15",
    "TET-DA-2026-0603"
  ),
  createSeededCertificate(
    "certificate-ready-career",
    "course-career-readiness",
    "Musa Chari",
    "2026-04-17",
    "TET-CR-2026-0604"
  ),
]

const careerReadyCv = createSeededCv("cv-ready", {
  headline: "AI and analytics learner shipping portfolio-grade systems for internship teams",
  summary:
    "I build practical systems that connect AI workflows, analytics, and product communication. My strongest work turns structured learning into usable tools, measurable outcomes, and clearer hiring signals.",
  education:
    "BSc Data Science, Africa University, expected 2026",
  skills: [
    "Python",
    "SQL",
    "Prompt Engineering",
    "Dashboards",
    "Data Storytelling",
    "APIs",
    "Next.js",
    "Evaluation Design",
  ],
  experience: [
    "Completed multiple Tetisol learning tracks in AI, prompt engineering, analytics, and career readiness.",
    "Built portfolio-grade systems that combine recommendations, CV guidance, and internship intelligence.",
    "Translated structured coursework into targeted internship applications and live interview preparation.",
  ],
  projects: [
    {
      id: "project-ready-1",
      title: "Learner Opportunity Intelligence Console",
      role: "Frontend and Workflow Builder",
      summary:
        "Built a dashboard that connects learning activity, role matching, deadline alerts, and CV readiness.",
      impact:
        "Helped testers identify the next best action faster and reduced missed opportunity review steps across mock user journeys.",
      stack: ["Next.js", "TypeScript", "Prompt Engineering", "Analytics"],
    },
    {
      id: "project-ready-2",
      title: "Prompt Quality Evaluation Lab",
      role: "AI Workflow Designer",
      summary:
        "Created a small evaluation flow for prompt patterns used in study support and operations assistance.",
      impact:
        "Improved consistency of prompt reviews and created reusable scoring templates for future work.",
      stack: ["Prompt Engineering", "Python", "Evaluation Design"],
      sourceCourseId: "course-prompt-engineering",
    },
  ],
  certifications: careerReadyCertificates.map((certificate) => ({
    id: `cv-${certificate.id}`,
    courseName:
      seedCourses.find((course) => course.id === certificate.courseId)?.title ??
      "Tetisol Certificate",
    issuer: "Tetisol",
    issuedAt: certificate.issuedAt,
    credentialId: certificate.certificateNumber,
  })),
  achievements: [
    "Completed four Tetisol certificates connected to AI, analytics, and employability.",
    "Maintained an application pipeline with strong match-quality internship targets.",
    "Built portfolio work that turns learning history into recruiter-facing proof.",
  ],
  score: 96,
  suggestions: [
    "Add a public portfolio link beside your headline.",
  ],
})

export const newLearnerWorkspace: UserWorkspace = {
  profile: newLearnerProfile,
  preferences: {
    preferredLocations: ["Mutare, Zimbabwe", "Remote"],
    preferredInternshipFields: ["AI", "Marketing"],
    preferredLearningCategories: ["Artificial Intelligence", "Career Readiness"],
    weeklyLearningGoalHours: 5,
    internshipPriority: "Learning-first",
  },
  savedInternshipIds: ["internship-ai-research"],
  applications: [],
  cv: newLearnerCv,
  enrollments: [],
  quizAttempts: [],
  certificates: [],
  learningNotes: [],
  reminders: [
    {
      id: "reminder-new-start",
      kind: "Learning",
      title: "Start your first Tetisol course",
      description: "One completed course will unlock smarter recommendations and a stronger CV foundation.",
      date: "2026-04-22",
      href: "/courses",
    },
  ],
  onboardingCompleted: true,
}

export const stalledLearnerWorkspace: UserWorkspace = {
  profile: stalledLearnerProfile,
  preferences: {
    preferredLocations: ["Bulawayo, Zimbabwe", "Remote"],
    preferredInternshipFields: ["Cloud", "AI", "Security"],
    preferredLearningCategories: ["Artificial Intelligence", "Cloud Computing", "Cybersecurity"],
    weeklyLearningGoalHours: 4,
    internshipPriority: "Balanced",
  },
  savedInternshipIds: ["internship-cloud-ops", "internship-ai-research"],
  applications: [],
  cv: stalledLearnerCv,
  enrollments: [
    {
      id: "enrollment-stalled-ai",
      courseId: "course-ai-intro",
      enrolledAt: "2026-04-01",
      startedAt: "2026-04-01",
      completedAt: null,
      completedLessonIds: stalledAiLessons,
      lastLessonId: "course-ai-intro-lesson-2",
      lastActivityAt: "2026-04-06T10:20:00.000Z",
    },
    {
      id: "enrollment-stalled-cloud",
      courseId: "course-cloud",
      enrolledAt: "2026-04-03",
      startedAt: "2026-04-03",
      completedAt: null,
      completedLessonIds: stalledCloudLessons,
      lastLessonId: "course-cloud-lesson-1",
      lastActivityAt: "2026-04-07T08:15:00.000Z",
    },
  ],
  quizAttempts: [],
  certificates: [],
  learningNotes: [
    {
      id: "note-stalled-ai",
      courseId: "course-ai-intro",
      lessonId: "course-ai-intro-lesson-2",
      content:
        "The use-case framework made sense. I need to return and turn it into a small portfolio experiment.",
      updatedAt: "2026-04-06T10:15:00.000Z",
    },
  ],
  reminders: [
    {
      id: "reminder-stalled-return",
      kind: "Learning",
      title: "Resume Introduction to Artificial Intelligence",
      description: "You paused after the foundations module. Finishing the next lesson will restore momentum fast.",
      date: "2026-04-22",
      href: "/learning/introduction-to-artificial-intelligence",
    },
  ],
  onboardingCompleted: true,
}

export const almostCertifiedWorkspace: UserWorkspace = {
  profile: almostCertifiedProfile,
  preferences: {
    preferredLocations: ["Harare, Zimbabwe", "Remote"],
    preferredInternshipFields: ["Security", "Cloud", "IT Support"],
    preferredLearningCategories: ["Cybersecurity", "Cloud Computing"],
    weeklyLearningGoalHours: 6,
    internshipPriority: "Balanced",
  },
  savedInternshipIds: ["internship-cybersecurity", "internship-cloud-ops"],
  applications: [
    {
      id: "application-almost-1",
      internshipId: "internship-cybersecurity",
      status: "Interested",
      notes: "Strong fit once the cybersecurity certificate is complete.",
      deadline: "2026-05-25",
      createdAt: "2026-04-19",
      updatedAt: "2026-04-20",
    },
  ],
  cv: almostCertifiedCv,
  enrollments: [
    {
      id: "enrollment-almost-cyber",
      courseId: "course-cybersecurity",
      enrolledAt: "2026-04-08",
      startedAt: "2026-04-08",
      completedAt: null,
      completedLessonIds: almostCyberLessons,
      lastLessonId: almostCyberLessons[almostCyberLessons.length - 1] ?? null,
      lastActivityAt: "2026-04-20T15:05:00.000Z",
    },
    {
      id: "enrollment-almost-cloud",
      courseId: "course-cloud",
      enrolledAt: "2026-04-01",
      startedAt: "2026-04-01",
      completedAt: "2026-04-10",
      completedLessonIds: completedCloudLessons,
      lastLessonId: completedCloudLessons[completedCloudLessons.length - 1] ?? null,
      lastActivityAt: "2026-04-10T11:10:00.000Z",
    },
  ],
  quizAttempts: [
    {
      id: "attempt-almost-cloud",
      quizId: "quiz-cloud-module-2",
      courseId: "course-cloud",
      lessonId: "course-cloud-lesson-6",
      answers: {},
      score: 89,
      passed: true,
      submittedAt: "2026-04-10T11:10:00.000Z",
    },
    {
      id: "attempt-almost-cyber",
      quizId: "quiz-cybersecurity-module-1",
      courseId: "course-cybersecurity",
      lessonId: "course-cybersecurity-lesson-3",
      answers: {},
      score: 82,
      passed: true,
      submittedAt: "2026-04-16T09:35:00.000Z",
    },
  ],
  certificates: almostCertifiedCertificates,
  learningNotes: [
    {
      id: "note-almost-cyber",
      courseId: "course-cybersecurity",
      lessonId: "course-cybersecurity-lesson-5",
      content:
        "Need to reuse the incident-response framing in my CV project section and interview prep.",
      updatedAt: "2026-04-20T14:50:00.000Z",
    },
  ],
  reminders: [
    {
      id: "reminder-almost-finish",
      kind: "Certificate",
      title: "Finish Cybersecurity Fundamentals",
      description: "You are one step away from unlocking another Tetisol certificate.",
      date: "2026-04-23",
      href: "/learning/cybersecurity-fundamentals",
    },
  ],
  onboardingCompleted: true,
}

export const careerReadyWorkspace: UserWorkspace = {
  profile: careerReadyProfile,
  preferences: {
    preferredLocations: ["Harare, Zimbabwe", "Remote"],
    preferredInternshipFields: ["AI", "Data", "Engineering"],
    preferredLearningCategories: ["Prompt Engineering", "Data Analytics", "Artificial Intelligence"],
    weeklyLearningGoalHours: 7,
    internshipPriority: "Career-first",
  },
  savedInternshipIds: [
    "internship-ai-research",
    "internship-prompt-designer",
    "internship-data-analyst",
  ],
  applications: [
    {
      id: "application-ready-1",
      internshipId: "internship-ai-research",
      status: "Interview",
      notes: "Prepare experiment design examples and prompt evaluation stories.",
      deadline: "2026-05-22",
      createdAt: "2026-04-09",
      updatedAt: "2026-04-20",
    },
    {
      id: "application-ready-2",
      internshipId: "internship-prompt-designer",
      status: "Applied",
      notes: "Shared evaluation lab project and certificate portfolio.",
      deadline: "2026-05-30",
      createdAt: "2026-04-18",
      updatedAt: "2026-04-19",
    },
    {
      id: "application-ready-3",
      internshipId: "internship-data-analyst",
      status: "Offer",
      notes: "Received a verbal offer pending paperwork.",
      deadline: "2026-04-25",
      createdAt: "2026-04-05",
      updatedAt: "2026-04-21",
    },
  ],
  cv: careerReadyCv,
  enrollments: [
    {
      id: "enrollment-ready-ai",
      courseId: "course-ai-intro",
      enrolledAt: "2026-03-29",
      startedAt: "2026-03-29",
      completedAt: "2026-04-05",
      completedLessonIds: completedAiLessons,
      lastLessonId: completedAiLessons[completedAiLessons.length - 1] ?? null,
      lastActivityAt: "2026-04-05T09:10:00.000Z",
    },
    {
      id: "enrollment-ready-prompt",
      courseId: "course-prompt-engineering",
      enrolledAt: "2026-04-02",
      startedAt: "2026-04-02",
      completedAt: "2026-04-08",
      completedLessonIds: completedPromptLessons,
      lastLessonId: completedPromptLessons[completedPromptLessons.length - 1] ?? null,
      lastActivityAt: "2026-04-08T12:20:00.000Z",
    },
    {
      id: "enrollment-ready-data",
      courseId: "course-data-analytics",
      enrolledAt: "2026-04-09",
      startedAt: "2026-04-09",
      completedAt: "2026-04-15",
      completedLessonIds: getCourseLessonIds("course-data-analytics"),
      lastLessonId: "course-data-analytics-lesson-6",
      lastActivityAt: "2026-04-15T17:10:00.000Z",
    },
    {
      id: "enrollment-ready-career",
      courseId: "course-career-readiness",
      enrolledAt: "2026-04-11",
      startedAt: "2026-04-11",
      completedAt: "2026-04-17",
      completedLessonIds: completedCareerLessons,
      lastLessonId: completedCareerLessons[completedCareerLessons.length - 1] ?? null,
      lastActivityAt: "2026-04-17T12:35:00.000Z",
    },
    {
      id: "enrollment-ready-full-stack",
      courseId: "course-full-stack",
      enrolledAt: "2026-04-19",
      startedAt: "2026-04-19",
      completedAt: null,
      completedLessonIds: completedFullStackLessons.slice(0, 2),
      lastLessonId: completedFullStackLessons[1] ?? null,
      lastActivityAt: "2026-04-21T10:10:00.000Z",
    },
  ],
  quizAttempts: [
    {
      id: "attempt-ready-ai",
      quizId: "quiz-ai-module-2",
      courseId: "course-ai-intro",
      lessonId: "course-ai-intro-lesson-6",
      answers: {},
      score: 91,
      passed: true,
      submittedAt: "2026-04-05T09:10:00.000Z",
    },
    {
      id: "attempt-ready-prompt",
      quizId: "quiz-prompt-module-2",
      courseId: "course-prompt-engineering",
      lessonId: "course-prompt-engineering-lesson-6",
      answers: {},
      score: 95,
      passed: true,
      submittedAt: "2026-04-08T12:20:00.000Z",
    },
    {
      id: "attempt-ready-data",
      quizId: "quiz-data-analytics-module-2",
      courseId: "course-data-analytics",
      lessonId: "course-data-analytics-lesson-6",
      answers: {},
      score: 88,
      passed: true,
      submittedAt: "2026-04-15T17:10:00.000Z",
    },
  ],
  certificates: careerReadyCertificates,
  learningNotes: [
    {
      id: "note-ready-prompt",
      courseId: "course-prompt-engineering",
      lessonId: "course-prompt-engineering-lesson-5",
      content:
        "The workflow handoff checklist belongs directly inside my internship talking points because it shows systems thinking.",
      updatedAt: "2026-04-08T10:40:00.000Z",
    },
    {
      id: "note-ready-data",
      courseId: "course-data-analytics",
      lessonId: "course-data-analytics-lesson-5",
      content:
        "Need to keep translating charts into decisions. Recruiters will care more about judgment than visuals alone.",
      updatedAt: "2026-04-14T15:15:00.000Z",
    },
  ],
  reminders: [
    {
      id: "reminder-ready-offer",
      kind: "Deadline",
      title: "Respond to Data Analyst Intern offer",
      description: "Confirm offer details and prepare your questions before the paperwork deadline.",
      date: "2026-04-25",
      href: "/applications",
    },
    {
      id: "reminder-ready-full-stack",
      kind: "Learning",
      title: "Keep Full Stack Web Development Basics moving",
      description: "A small amount of frontend momentum keeps your portfolio diverse while applications are active.",
      date: "2026-04-23",
      href: "/learning/full-stack-web-development-basics",
    },
  ],
  onboardingCompleted: true,
}

export const defaultCareerHubState: CareerHubState = {
  users: [
    adminUser,
    instructorUser,
    newLearnerUser,
    demoUser,
    stalledLearnerUser,
    almostCertifiedUser,
    careerReadyUser,
  ],
  activeUserId: null,
  internships: seedInternships,
  courses: seedCourses,
  quizzes: seedQuizzes,
  workspaces: {
    [adminUser.id]: adminWorkspace,
    [newLearnerUser.id]: newLearnerWorkspace,
    [demoUser.id]: demoWorkspace,
    [stalledLearnerUser.id]: stalledLearnerWorkspace,
    [almostCertifiedUser.id]: almostCertifiedWorkspace,
    [careerReadyUser.id]: careerReadyWorkspace,
  },
}

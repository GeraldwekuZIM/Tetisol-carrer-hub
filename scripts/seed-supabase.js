/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs")
const path = require("node:path")
const { createClient } = require("@supabase/supabase-js")

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const content = fs.readFileSync(filePath, "utf8")
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue
    }
    const [key, ...valueParts] = trimmed.split("=")
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "")
    }
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local before seeding."
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const password = "careerhub"
const departments = ["Software Engineering", "Data Analytics", "Cybersecurity", "Cloud", "Career Readiness"]
const courseCategories = [
  "Web Development",
  "Data Analytics",
  "Cybersecurity",
  "Cloud Computing",
  "Artificial Intelligence",
  "Career Readiness",
  "Digital Marketing",
  "UI/UX Design",
]

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function upsertAuthUser(email, fullName, role) {
  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers()
  if (listError) {
    throw listError
  }

  const existingUser = existingUsers.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  )

  if (existingUser) {
    return existingUser
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role,
    },
  })

  if (error) {
    throw error
  }

  return data.user
}

async function upsert(table, rows, onConflict) {
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict })

  if (error) {
    throw new Error(`${table}: ${error.message}`)
  }
}

async function seed() {
  console.log("Creating auth users and profiles...")

  const students = []
  const lecturers = []
  const admins = []

  for (let index = 1; index <= 50; index += 1) {
    const fullName = `Tetisol Student ${String(index).padStart(2, "0")}`
    const email = `student${String(index).padStart(2, "0")}@tetisol.test`
    const user = await upsertAuthUser(email, fullName, "student")
    students.push({ user, index, fullName, email })
  }

  for (let index = 1; index <= 5; index += 1) {
    const fullName = `Tetisol Lecturer ${index}`
    const email = `lecturer${index}@tetisol.test`
    const user = await upsertAuthUser(email, fullName, "lecturer")
    lecturers.push({ user, index, fullName, email })
  }

  for (let index = 1; index <= 2; index += 1) {
    const fullName = `Tetisol Admin ${index}`
    const email = `admin${index}@tetisol.test`
    const user = await upsertAuthUser(email, fullName, "admin")
    admins.push({ user, index, fullName, email })
  }

  await upsert(
    "profiles",
    [
      ...students.map(({ user, index, fullName, email }) => ({
        id: user.id,
        full_name: fullName,
        email,
        role: "student",
        department: departments[index % departments.length],
        student_number: `TET-STU-${String(index).padStart(4, "0")}`,
      })),
      ...lecturers.map(({ user, index, fullName, email }) => ({
        id: user.id,
        full_name: fullName,
        email,
        role: "lecturer",
        department: departments[index % departments.length],
        lecturer_number: `TET-LEC-${String(index).padStart(3, "0")}`,
      })),
      ...admins.map(({ user, index, fullName, email }) => ({
        id: user.id,
        full_name: fullName,
        email,
        role: "admin",
        department: "Platform Administration",
        lecturer_number: `TET-ADM-${String(index).padStart(3, "0")}`,
      })),
    ],
    "id"
  )

  console.log("Creating courses and lessons...")

  const courses = Array.from({ length: 15 }, (_, index) => {
    const title = [
      "Frontend Engineering Studio",
      "Data Analytics With Python",
      "Cybersecurity Operations Basics",
      "Cloud Deployment Fundamentals",
      "AI Productivity Foundations",
      "Career Readiness For Tech Students",
      "Database Design For Apps",
      "Product Design Sprint",
      "IT Support Service Desk",
      "Digital Marketing Analytics",
      "Python Automation Essentials",
      "Software Testing Fundamentals",
      "Prompt Engineering For Workflows",
      "Portfolio Project Lab",
      "Professional Communication For Tech",
    ][index]

    return {
      title,
      slug: slugify(title),
      description:
        "A Tetisol Hub demo course designed for practical learning, progress tracking, lecturer review, and internship readiness.",
      category: courseCategories[index % courseCategories.length],
      level: index % 3 === 0 ? "Intermediate" : "Beginner",
      instructor_id: lecturers[index % lecturers.length].user.id,
      status: "published",
      thumbnail_url: null,
    }
  })

  await upsert(
    "courses",
    courses,
    "slug"
  )

  const { data: courseRows, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .in("slug", courses.map((course) => course.slug))

  if (courseError) {
    throw courseError
  }

  const lessons = []
  for (const course of courseRows) {
    for (let lessonIndex = 1; lessonIndex <= 6 + (course.slug.length % 3); lessonIndex += 1) {
      lessons.push({
        course_id: course.id,
        lesson_order: lessonIndex,
        title: `Lesson ${lessonIndex}: Applied Practice`,
        content:
          "Students review the topic, complete a practical activity, and record progress for lecturer visibility.",
        video_url: null,
        duration_minutes: 12 + lessonIndex * 3,
      })
    }
  }

  await upsert("lessons", lessons, "course_id,lesson_order")

  const { data: lessonRows, error: lessonError } = await supabase
    .from("lessons")
    .select("*")

  if (lessonError) {
    throw lessonError
  }

  console.log("Creating enrollments, progress, attendance, and assignments...")

  const enrollments = []
  const progress = []
  const attendance = []

  for (const student of students) {
    const selectedCourses = courseRows
      .slice(student.index % courseRows.length)
      .concat(courseRows)
      .slice(0, 4)

    for (const course of selectedCourses) {
      enrollments.push({
        student_id: student.user.id,
        course_id: course.id,
        status: "active",
      })

      const courseLessons = lessonRows
        .filter((lesson) => lesson.course_id === course.id)
        .slice(0, 4)

      for (const lesson of courseLessons) {
        const percent = ((student.index + lesson.lesson_order) % 4) * 25
        progress.push({
          student_id: student.user.id,
          course_id: course.id,
          lesson_id: lesson.id,
          completed: percent >= 100,
          progress_percent: percent,
          completed_at: percent >= 100 ? new Date().toISOString() : null,
        })
      }

      attendance.push({
        student_id: student.user.id,
        course_id: course.id,
        lecturer_id: course.instructor_id,
        session_title: "Weekly practical lab",
        attended: student.index % 5 !== 0,
      })
    }
  }

  await upsert("enrollments", enrollments, "student_id,course_id")
  await upsert("lesson_progress", progress, "student_id,lesson_id")

  const { error: attendanceError } = await supabase
    .from("attendance_records")
    .insert(attendance)
  if (attendanceError) {
    throw attendanceError
  }

  const assignments = courseRows.map((course, index) => ({
    course_id: course.id,
    lecturer_id: course.instructor_id,
    title: `${course.title} portfolio task`,
    description: "Submit a short practical reflection and evidence of your work.",
    due_date: new Date(Date.now() + (index + 7) * 86400000).toISOString(),
  }))
  await upsert("assignments", assignments, "course_id,title")

  const { data: assignmentRows, error: assignmentError } = await supabase
    .from("assignments")
    .select("*")
  if (assignmentError) {
    throw assignmentError
  }

  const submissions = students.slice(0, 40).map((student, index) => ({
    assignment_id: assignmentRows[index % assignmentRows.length].id,
    student_id: student.user.id,
    submission_text:
      "I completed the practical task and connected it to my internship readiness goals.",
    grade: index % 4 === 0 ? null : 70 + (index % 25),
    feedback: index % 4 === 0 ? null : "Good progress. Add more specific evidence next time.",
  }))
  await upsert("assignment_submissions", submissions, "assignment_id,student_id")

  console.log("Creating opportunities, saved opportunities, CVs, announcements, and notifications...")

  const opportunities = Array.from({ length: 20 }, (_, index) => ({
    title: [
      "Frontend Intern",
      "Data Analyst Intern",
      "Cybersecurity Trainee",
      "Cloud Operations Intern",
      "AI Research Assistant",
    ][index % 5],
    company: ["BlueOrbit Labs", "Nexa Insights", "ShieldStack", "Nimbus Transit", "ModelWorks Africa"][index % 5],
    description:
      "A realistic opportunity for Tetisol students to practice applications and match learning progress to career goals.",
    location: index % 3 === 0 ? "Remote" : index % 3 === 1 ? "Harare, Zimbabwe" : "Bulawayo, Zimbabwe",
    type: index % 4 === 0 ? "graduate program" : "internship",
    deadline: new Date(Date.now() + (index + 10) * 86400000).toISOString().slice(0, 10),
    posted_by: admins[index % admins.length].user.id,
  }))

  await upsert("opportunities", opportunities, "title,company,deadline")

  const { data: opportunityRows, error: opportunityRowsError } = await supabase
    .from("opportunities")
    .select("*")
    .limit(20)
  if (opportunityRowsError) {
    throw opportunityRowsError
  }

  await upsert(
    "saved_opportunities",
    students.flatMap((student, index) => [
      {
        student_id: student.user.id,
        opportunity_id: opportunityRows[index % opportunityRows.length].id,
      },
      {
        student_id: student.user.id,
        opportunity_id: opportunityRows[(index + 5) % opportunityRows.length].id,
      },
    ]),
    "student_id,opportunity_id"
  )

  await upsert(
    "cv_profiles",
    students.map((student, index) => ({
      student_id: student.user.id,
      summary:
        "Tetisol learner building practical skills, course evidence, and internship readiness.",
      skills: ["Communication", "Problem Solving", courseCategories[index % courseCategories.length]],
      education: [{ school: "Tetisol Partner College", program: "Applied Technology" }],
      experience: [{ role: "Student Project Contributor", organization: "Tetisol Hub" }],
      projects: [{ title: "Career Hub Portfolio Project", impact: "Completed practical course evidence." }],
    })),
    "student_id"
  )

  await upsert(
    "announcements",
    [
      {
        title: "Welcome to Tetisol Hub",
        message: "Complete your profile, enroll in a course, and track your internship readiness.",
        target_role: "student",
        created_by: admins[0].user.id,
      },
      {
        title: "Lecturer participation review",
        message: "Review attendance and progress before the weekly supervision meeting.",
        target_role: "lecturer",
        created_by: admins[0].user.id,
      },
    ],
    "title,target_role"
  )

  await upsert(
    "notifications",
    students.map((student) => ({
      user_id: student.user.id,
      title: "Your Tetisol learning plan is ready",
      message: "Open your dashboard to continue learning and review matched opportunities.",
    })),
    "user_id,title"
  )

  console.log("Seed complete.")
  console.log("Demo password for all generated users:", password)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})

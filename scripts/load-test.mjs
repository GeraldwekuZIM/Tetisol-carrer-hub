const args = new Map()
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index]
  const value = process.argv[index + 1]
  if (key?.startsWith("--")) {
    args.set(key.slice(2), value)
  }
}

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000"
const users = Number(args.get("users") ?? process.env.LOAD_TEST_USERS ?? 50)
const scenario = args.get("scenario") ?? "mixed"
const durationSeconds = Number(
  args.get("duration") ?? process.env.LOAD_TEST_DURATION_SECONDS ?? 60
)

const scenarios = {
  dashboard: ["/dashboard"],
  courses: ["/courses"],
  courseDetails: ["/courses/practical-prompt-engineering"],
  lecturers: ["/admin/analytics", "/admin/courses"],
  mixed: [
    "/",
    "/auth",
    "/dashboard",
    "/courses",
    "/courses/practical-prompt-engineering",
    "/learning",
    "/learning/practical-prompt-engineering",
    "/internships",
    "/saved",
    "/applications",
    "/cv-builder",
    "/admin",
    "/admin/analytics",
    "/admin/courses",
    "/api/health",
  ],
}

const selectedRoutes = scenarios[scenario] ?? scenarios.mixed
const deadline = Date.now() + durationSeconds * 1000
const results = []

async function requestRoute(route, virtualUser) {
  const started = performance.now()
  try {
    const response = await fetch(`${baseUrl}${route}`, {
      headers: {
        "user-agent": `tetisol-load-test/student-${virtualUser}`,
      },
    })
    results.push({
      route,
      status: response.status,
      durationMs: performance.now() - started,
      ok: response.status >= 200 && response.status < 400,
    })
  } catch (error) {
    results.push({
      route,
      status: 0,
      durationMs: performance.now() - started,
      ok: false,
      error: error instanceof Error ? error.message : "Request failed",
    })
  }
}

async function updateProgress(virtualUser) {
  const started = performance.now()
  try {
    const response = await fetch(`${baseUrl}/api/load-test/progress`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": `tetisol-load-test/student-${virtualUser}`,
      },
      body: JSON.stringify({
        studentId: `student-${String(virtualUser).padStart(2, "0")}`,
        courseId: "practical-prompt-engineering",
        lessonId: "evaluating-output-quality",
      }),
    })
    results.push({
      route: "POST /api/load-test/progress",
      status: response.status,
      durationMs: performance.now() - started,
      ok: response.status >= 200 && response.status < 400,
    })
  } catch (error) {
    results.push({
      route: "POST /api/load-test/progress",
      status: 0,
      durationMs: performance.now() - started,
      ok: false,
      error: error instanceof Error ? error.message : "Request failed",
    })
  }
}

async function virtualUserLoop(virtualUser) {
  let index = virtualUser % selectedRoutes.length

  while (Date.now() < deadline) {
    await requestRoute(selectedRoutes[index], virtualUser)
    if (index % 5 === 0) {
      await updateProgress(virtualUser)
    }
    index = (index + 1) % selectedRoutes.length
  }
}

await Promise.all(
  Array.from({ length: users }, (_, index) => virtualUserLoop(index + 1))
)

const total = results.length
const failures = results.filter((result) => !result.ok)
const durations = results.map((result) => result.durationMs).sort((a, b) => a - b)
const percentile = (value) =>
  Math.round(durations[Math.min(durations.length - 1, Math.floor(durations.length * value))] ?? 0)

const summary = {
  baseUrl,
  scenario,
  virtualUsers: users,
  durationSeconds,
  totalRequests: total,
  successRate: total ? `${(((total - failures.length) / total) * 100).toFixed(2)}%` : "0%",
  failedRequests: failures.length,
  p50Ms: percentile(0.5),
  p90Ms: percentile(0.9),
  p95Ms: percentile(0.95),
  maxMs: Math.round(durations.at(-1) ?? 0),
}

console.table([summary])

if (failures.length > 0) {
  console.error("Sample failures:", failures.slice(0, 10))
  process.exit(1)
}

if (percentile(0.95) > 3000) {
  console.warn("Performance warning: p95 exceeded 3000ms.")
}

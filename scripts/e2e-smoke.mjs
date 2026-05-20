const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000"

const routes = [
  "/",
  "/courses",
  "/auth",
  "/dashboard",
  "/learning",
  "/internships",
  "/applications",
  "/cv-builder",
  "/admin",
  "/admin/courses",
  "/admin/analytics",
  "/api/health",
]

async function checkRoute(route) {
  const started = performance.now()
  const response = await fetch(`${baseUrl}${route}`, {
    redirect: "manual",
    headers: {
      "user-agent": "tetisol-smoke-test/1.0",
    },
  })
  const durationMs = Math.round(performance.now() - started)
  const ok = response.status >= 200 && response.status < 400

  return {
    route,
    status: response.status,
    durationMs,
    ok,
  }
}

const results = await Promise.all(routes.map(checkRoute))
const failures = results.filter((result) => !result.ok)

console.table(results)

if (failures.length > 0) {
  console.error(`Smoke test failed on ${failures.length} route(s).`)
  process.exit(1)
}

const slowRoutes = results.filter((result) => result.durationMs > 2500)
if (slowRoutes.length > 0) {
  console.warn("Slow route warning:", slowRoutes)
}

console.log(`Smoke test passed for ${results.length} routes at ${baseUrl}.`)

export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json({
    ok: true,
    service: "tetisol-career-hub",
    checkedAt: new Date().toISOString(),
  })
}

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))

  return Response.json({
    ok: true,
    scenario: "lesson-progress",
    studentId: String(payload.studentId ?? "anonymous"),
    courseId: String(payload.courseId ?? "course-demo"),
    lessonId: String(payload.lessonId ?? "lesson-demo"),
    updatedAt: new Date().toISOString(),
  })
}

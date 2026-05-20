import { CourseAdminEditor } from "@/components/admin/course-admin-editor"

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  return <CourseAdminEditor courseId={courseId} />
}

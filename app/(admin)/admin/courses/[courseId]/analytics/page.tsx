import { CourseAnalyticsView } from "@/components/analytics/course-analytics-view"

export default async function AdminCourseAnalyticsPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  return <CourseAnalyticsView courseId={courseId} />
}

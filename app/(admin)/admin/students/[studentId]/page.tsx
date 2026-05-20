import { StudentAnalyticsDetail } from "@/components/analytics/student-analytics-detail"

export default async function AdminStudentAnalyticsPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params

  return <StudentAnalyticsDetail studentId={studentId} />
}

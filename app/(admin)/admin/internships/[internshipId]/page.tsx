import { InternshipAdminEditor } from "@/components/admin/internship-admin-editor"

export default async function AdminInternshipDetailPage({
  params,
}: {
  params: Promise<{ internshipId: string }>
}) {
  const { internshipId } = await params

  return <InternshipAdminEditor internshipId={internshipId} />
}

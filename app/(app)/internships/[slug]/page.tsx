import { InternshipDetail } from "@/components/internships/internship-detail"

export const dynamic = "force-dynamic"

export default async function InternshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <InternshipDetail slug={slug} />
}

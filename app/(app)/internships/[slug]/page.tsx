import { InternshipDetail } from "@/components/internships/internship-detail"
import { seedInternships } from "@/lib/demo-data"

export async function generateStaticParams() {
  return seedInternships.map((internship) => ({
    slug: internship.slug,
  }))
}

export default async function InternshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <InternshipDetail slug={slug} />
}

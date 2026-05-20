import { CertificatePreview } from "@/components/learning/certificate-preview"

export default async function CertificatePreviewPage({
  params,
}: {
  params: Promise<{ certificateId: string }>
}) {
  const { certificateId } = await params

  return <CertificatePreview certificateId={certificateId} />
}

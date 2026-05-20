import { AppShell } from "@/components/navigation/app-shell"

export default function LearningAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}

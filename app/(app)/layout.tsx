import { AppShell } from "@/components/navigation/app-shell"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}

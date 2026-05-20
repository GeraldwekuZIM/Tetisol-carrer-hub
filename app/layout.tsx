import type { Metadata } from "next"

import { AppProviders } from "@/components/providers/app-providers"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Tetisol Learning Platform",
    template: "%s | Tetisol Learning Platform",
  },
  description:
    "An AI learning and career platform that helps learners move from skill building to certification to internship and job readiness.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

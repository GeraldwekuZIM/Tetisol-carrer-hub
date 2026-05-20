"use client"

import { Toaster } from "sonner"

import { FloatingCopilot } from "@/components/copilot/floating-copilot"
import { CareerHubProvider } from "@/components/providers/career-hub-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function AppProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <CareerHubProvider>
        {children}
        <FloatingCopilot />
        <Toaster richColors position="top-right" />
      </CareerHubProvider>
    </TooltipProvider>
  )
}

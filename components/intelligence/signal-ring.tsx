"use client"

import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

export function SignalRing({
  value,
  label,
  caption,
  className,
}: {
  value: number
  label: string
  caption?: string
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        aria-label={`${label}: ${clamped}%`}
        className="signal-ring relative flex size-36 items-center justify-center rounded-full"
        role="img"
        style={
          {
            "--signal-value": clamped,
            "--signal-fill": `conic-gradient(from 210deg, rgba(56, 189, 248, 0.92) 0deg, rgba(129, 140, 248, 0.96) ${clamped * 3.6}deg, rgba(148, 163, 184, 0.12) ${clamped * 3.6}deg, rgba(148, 163, 184, 0.12) 360deg)`,
          } as CSSProperties
        }
      >
        <div className="absolute inset-[10px] rounded-full border border-white/16 bg-slate-950/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
        <div className="absolute inset-[20px] rounded-full border border-white/8 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.18),transparent_55%)]" />
        <div className="relative text-center text-white">
          <p className="font-heading text-3xl font-semibold tracking-tight">{clamped}%</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
            {label}
          </p>
        </div>
      </div>
      {caption ? (
        <p className="max-w-[11rem] text-center text-xs leading-6 text-slate-300">
          {caption}
        </p>
      ) : null}
    </div>
  )
}

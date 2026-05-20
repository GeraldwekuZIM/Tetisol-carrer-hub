"use client"

import { cn } from "@/lib/utils"

export function CategoryPills({
  items,
  value,
  onChange,
}: {
  items: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = item === value
        return (
          <button
            key={item}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-white/80 text-slate-600 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            )}
            onClick={() => onChange(item)}
            type="button"
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}

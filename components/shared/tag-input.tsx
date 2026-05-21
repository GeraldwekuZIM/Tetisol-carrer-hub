"use client"

import { useState } from "react"
import { XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type TagInputProps = {
  value?: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add an item",
  className,
}: TagInputProps) {
  const [draft, setDraft] = useState("")
  const normalizedValue = Array.from(
    new Set((value ?? []).map((item) => item.trim()).filter(Boolean))
  )

  function commitTag() {
    const nextValue = draft.trim()
    if (!nextValue) {
      return
    }

    if (!normalizedValue.includes(nextValue)) {
      onChange([...normalizedValue, nextValue])
    }
    setDraft("")
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white/80 p-3 shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap gap-2">
        {normalizedValue.map((item) => (
          <Badge
            key={item}
            className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary"
          >
            {item}
            <button
              className="ml-2 inline-flex"
              onClick={() =>
                onChange(normalizedValue.filter((tag) => tag !== item))
              }
              type="button"
            >
              <XIcon className="size-3.5" />
              <span className="sr-only">Remove {item}</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault()
              commitTag()
            }
          }}
        />
        <Button onClick={commitTag} type="button" variant="outline">
          Add
        </Button>
      </div>
    </div>
  )
}

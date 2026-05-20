import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow: string
  title: string
  description: string
  align?: "left" | "center"
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center"
      )}
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
          {eyebrow}
        </p>
        <div className="space-y-3">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {title}
          </h2>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

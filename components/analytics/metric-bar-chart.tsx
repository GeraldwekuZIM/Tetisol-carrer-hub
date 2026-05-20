"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricBarChart({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: Array<{
    label: string
    value: number
  }>
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <Card className="premium-panel panel-shimmer">
      <CardHeader>
        <CardTitle className="font-heading text-2xl text-slate-950">
          {title}
        </CardTitle>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div className="space-y-2" key={item.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-medium text-slate-950">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary/70 to-sky-400/75"
                style={{ width: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 10 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

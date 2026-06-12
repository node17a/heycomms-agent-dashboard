"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { BUDGET_SEGMENTS } from "@/lib/data"

export function BudgetBar() {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-hairline bg-card p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-label text-muted-foreground">Budget Allocation</h2>
        <span className="font-serif text-lg leading-none nums text-foreground">£12,000</span>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full border border-hairline">
        {BUDGET_SEGMENTS.map((seg, i) => (
          <button
            key={seg.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ width: `${seg.pct}%` }}
            aria-label={`${seg.label} ${seg.pct}%`}
            className={cn(
              "h-full border-r border-card transition-colors last:border-r-0",
              hover === i ? "bg-accent-mint" : i % 2 === 0 ? "bg-foreground/80" : "bg-foreground/40",
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {BUDGET_SEGMENTS.map((seg, i) => (
          <div
            key={seg.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-2 rounded-full transition-colors",
                  hover === i ? "bg-accent-mint" : i % 2 === 0 ? "bg-foreground/80" : "bg-foreground/40",
                )}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">{seg.label}</span>
            </div>
            <span className="font-serif text-base leading-none nums text-foreground">
              {hover === i ? `£${seg.amount.toLocaleString()}` : `${seg.pct}%`}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

"use client"

import type { EventSetup } from "@/lib/event-store"
import { BUDGET_SEGMENTS, formatBudget } from "@/lib/event-store"

const SEGMENT_CLASSES = [
  "bg-money",
  "bg-primary",
  "bg-money/60",
  "bg-muted-foreground",
  "bg-money/30",
]

export function BudgetBreakdown({ setup }: { setup: EventSetup }) {
  const total = Number(setup.budget) || 0

  return (
    <section className="rounded-3xl border border-hairline bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Budget breakdown</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Suggested allocation</p>
        </div>
        <span className="rounded-full bg-money px-3 py-1 text-sm font-bold text-money-foreground">
          {formatBudget(setup.budget)}
        </span>
      </div>

      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {BUDGET_SEGMENTS.map((seg, i) => (
          <div
            key={seg.label}
            className={SEGMENT_CLASSES[i % SEGMENT_CLASSES.length]}
            style={{ width: `${seg.pct}%` }}
            aria-hidden="true"
          />
        ))}
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {BUDGET_SEGMENTS.map((seg, i) => (
          <li key={seg.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2.5">
              <span
                className={`size-2.5 rounded-full ${SEGMENT_CLASSES[i % SEGMENT_CLASSES.length]}`}
                aria-hidden="true"
              />
              <span className="font-medium tracking-wide text-foreground">{seg.label}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="text-muted-foreground">{seg.pct}%</span>
              <span className="w-16 text-right font-mono tabular-nums text-foreground">
                {formatBudget(String(Math.round((total * seg.pct) / 100)))}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

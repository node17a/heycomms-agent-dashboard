"use client"

import { Download } from "lucide-react"
import type { BudgetAllocation } from "@/lib/agent-dashboard"
import { formatBudget } from "@/lib/event-store"

const SEGMENT_CLASSES: Record<string, string> = {
  venue: "bg-money",
  catering: "bg-primary",
  av_tech: "bg-people",
  marketing: "bg-lime",
  contingency: "bg-muted-foreground",
}

export function BudgetBreakdown({ budget }: { budget: BudgetAllocation }) {
  const total = budget.totalBudget

  return (
    <section className="rounded-3xl border border-hairline bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Budget breakdown</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Agent allocation</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-money px-3 py-1 text-sm font-bold text-money-foreground">
            {formatBudget(String(total))}
          </span>
          {budget.spreadsheetUrl && (
            <a
              href={budget.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-money hover:text-money"
            >
              <Download className="size-3.5" />
              Spreadsheet
            </a>
          )}
        </div>
      </div>

      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {budget.breakdown.map((seg) => (
          <div
            key={seg.key}
            className={SEGMENT_CLASSES[seg.key] ?? "bg-muted-foreground"}
            style={{ width: `${seg.percentage}%` }}
            aria-hidden="true"
          />
        ))}
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {budget.breakdown.map((seg) => (
          <li key={seg.key} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2.5">
              <span
                className={`size-2.5 rounded-full ${SEGMENT_CLASSES[seg.key] ?? "bg-muted-foreground"}`}
                aria-hidden="true"
              />
              <span className="font-medium tracking-wide text-foreground">{seg.label}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="text-muted-foreground">{seg.percentage}%</span>
              <span className="w-16 text-right font-mono tabular-nums text-foreground">
                {formatBudget(String(seg.amount))}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {budget.notes && <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{budget.notes}</p>}
    </section>
  )
}

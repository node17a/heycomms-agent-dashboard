"use client"

import { SUPPLIERS } from "@/lib/event-store"
import { ArrowUpRight } from "lucide-react"

export function SupplierGrid() {
  return (
    <section className="rounded-3xl border border-hairline bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Suggested suppliers</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Matched to your budget and date</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {SUPPLIERS.length} matches
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUPPLIERS.map((s) => (
          <article
            key={s.name}
            className="group flex items-center justify-between rounded-2xl border border-hairline bg-background p-4 transition-colors hover:border-primary"
          >
            <div className="min-w-0">
              <span className="text-[0.7rem] font-semibold tracking-wide text-muted-foreground">{s.category}</span>
              <h3 className="truncate font-semibold text-foreground">{s.name}</h3>
              <p className="mt-0.5 font-mono text-sm tabular-nums text-foreground">{s.priceRange}</p>
            </div>
            <button
              type="button"
              className="flex shrink-0 items-center gap-1 rounded-full bg-foreground px-3 py-2 text-xs font-medium text-background transition-transform group-hover:scale-105"
            >
              {s.contact}
              <ArrowUpRight className="size-3.5" />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

"use client"

import { LayoutDashboard, CalendarDays, Truck, Users, Palette } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProgressRing } from "@/components/progress-ring"
import { Tag } from "@/components/tag"
import { ACTIVE_EVENT } from "@/lib/data"

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Events", icon: CalendarDays },
  { label: "Suppliers", icon: Truck },
  { label: "Societies", icon: Users },
  { label: "Branding", icon: Palette },
]

export function LeftSidebar() {
  const [active, setActive] = useState("Dashboard")
  const budgetPct = Math.round((ACTIVE_EVENT.budgetSpent / ACTIVE_EVENT.budgetTotal) * 100)
  const countdownPct = Math.round(((ACTIVE_EVENT.totalDays - ACTIVE_EVENT.daysToGo) / ACTIVE_EVENT.totalDays) * 100)

  return (
    <aside className="flex flex-col gap-10 border-r border-hairline px-6 py-8">
      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-xl leading-none tracking-tight text-foreground">Hey</span>
        <span className="font-mono text-xs uppercase tracking-label text-muted-foreground">Comms</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ label, icon: Icon }) => {
          const isActive = active === label
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.5} />
              <span className="flex-1">{label}</span>
              {isActive && <span className="size-1.5 rounded-full bg-accent-mint" aria-hidden="true" />}
            </button>
          )
        })}
      </nav>

      <div className="rounded-2xl border border-hairline p-5">
        <div className="flex items-center justify-between">
          <Tag>Active Event</Tag>
          <span className="size-1.5 rounded-full bg-accent-mint" aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-serif text-lg leading-tight text-balance text-foreground">{ACTIVE_EVENT.name}</h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-label text-muted-foreground">{ACTIVE_EVENT.date}</p>

        <div className="mt-5 flex items-center justify-center">
          <ProgressRing
            value={countdownPct}
            size={120}
            big={`D-${ACTIVE_EVENT.daysToGo}`}
            small="To Go"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-hairline p-5">
        <div className="flex items-center justify-between">
          <Tag>Budget Spent</Tag>
          <span className="font-mono text-[11px] tracking-label text-muted-foreground nums">{budgetPct}%</span>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <ProgressRing value={budgetPct} size={64} big={`${budgetPct}`} small="%" />
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-lg leading-none nums text-foreground">
              £{ACTIVE_EVENT.budgetSpent.toLocaleString()}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              of £{ACTIVE_EVENT.budgetTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

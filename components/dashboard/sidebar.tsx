"use client"

import { useState } from "react"
import { LayoutGrid, CalendarDays, Truck, Palette, MessageSquare, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Schedule", icon: CalendarDays },
  { label: "Suppliers", icon: Truck },
  { label: "Comms", icon: MessageSquare },
  { label: "Branding", icon: Palette },
]

export function DashboardSidebar() {
  const [active, setActive] = useState("Dashboard")

  return (
    <aside className="sticky top-6 z-20 m-4 hidden h-[calc(100vh-2rem)] w-16 flex-col items-center justify-between rounded-full bg-sidebar py-5 sm:flex">
      <div className="flex flex-col items-center gap-6">
        <span className="flex size-9 items-center justify-center rounded-full bg-lime font-mono text-sm font-bold text-lime-foreground">
          H
        </span>

        <nav className="flex flex-col items-center gap-2">
          {NAV.map(({ label, icon: Icon }) => {
            const isActive = active === label
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full transition-colors",
                  isActive
                    ? "bg-lime text-lime-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </button>
            )
          })}
        </nav>
      </div>

      <button
        aria-label="Settings"
        className="flex size-10 items-center justify-center rounded-full text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <Settings className="size-5" strokeWidth={1.75} />
      </button>
    </aside>
  )
}

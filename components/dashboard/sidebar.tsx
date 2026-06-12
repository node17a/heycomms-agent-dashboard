"use client"

import { useState } from "react"
import {
  LayoutGrid,
  CalendarDays,
  Truck,
  Palette,
  MessageSquare,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Overview",   icon: LayoutGrid,   href: "#overview"   },
  { label: "Schedule",   icon: CalendarDays, href: "#comms"       },
  { label: "Suppliers",  icon: Truck,         href: "#suppliers"  },
  { label: "Comms",      icon: MessageSquare, href: "#comms"      },
  { label: "Branding",   icon: Palette,       href: "#branding"   },
]

export function DashboardSidebar() {
  const [active, setActive] = useState("Overview")

  function handleNav(label: string, href: string) {
    setActive(label)
    // Smooth-scroll to the section if it exists
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <aside
      className="sticky top-6 z-20 m-4 hidden h-[calc(100vh-2rem)] w-16 flex-col items-center justify-between rounded-[2rem] bg-sidebar py-5 sm:flex"
      aria-label="Dashboard navigation"
    >
      {/* Logo mark */}
      <div className="flex flex-col items-center gap-6">
        <img src="/logo.png" alt="COMMS" className="h-7 w-auto mix-blend-multiply dark:mix-blend-screen" aria-label="COMMS" />

        <nav className="flex flex-col items-center gap-1" role="navigation">
          {NAV.map(({ label, icon: Icon, href }) => {
            const isActive = active === label
            return (
              <div key={label} className="group relative">
                <button
                  onClick={() => handleNav(label, href)}
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-all duration-150",
                    isActive
                      ? "bg-lime text-lime-foreground shadow-md shadow-lime/30"
                      : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="size-[18px]" strokeWidth={isActive ? 2.25 : 1.75} />
                </button>

                {/* Tooltip */}
                <span
                  className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  role="tooltip"
                >
                  {label}
                </span>
              </div>
            )
          })}
        </nav>
      </div>

      {/* Settings */}
      <div className="group relative">
        <button
          aria-label="Settings"
          className="flex size-10 items-center justify-center rounded-full text-sidebar-foreground/50 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Settings className="size-[18px]" strokeWidth={1.75} />
        </button>
        <span
          className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
          role="tooltip"
        >
          Settings
        </span>
      </div>
    </aside>
  )
}

"use client"

import { useEventSetup } from "@/lib/event-store"
import { Blobs } from "@/components/blobs"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { StatCards } from "@/components/dashboard/stat-cards"
import { CountdownMessages } from "@/components/dashboard/countdown-messages"
import { BudgetBreakdown } from "@/components/dashboard/budget-breakdown"
import { ChatPanel } from "@/components/dashboard/chat-panel"
import { SupplierGrid } from "@/components/dashboard/supplier-grid"
import { BrandingKit } from "@/components/dashboard/branding-kit"
import { daysUntil, formatDate } from "@/lib/event-store"

export default function DashboardPage() {
  const { setup } = useEventSetup()
  const days = daysUntil(setup.date)

  const now = new Date()
  const timeLabel = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  const dateLabel = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })

  return (
    <div className="relative min-h-screen bg-background">
      <Blobs className="absolute" />

      <div className="relative z-10 flex">
        <DashboardSidebar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {/* Top bar */}
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-balance text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                Your {setup.name} plan is ready
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Everything below was drafted by the agent. Tweak anything in chat.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-hairline bg-card px-4 py-2">
              <span className="tabular-nums text-sm text-foreground">{timeLabel}</span>
              <span className="size-1 rounded-full bg-muted-foreground" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">{dateLabel}</span>
            </div>
          </header>

          {/* Stat cards */}
          <div id="overview" className="mt-6 scroll-mt-6">
            <StatCards setup={setup} days={days} />
          </div>

          {/* Middle row */}
          <div id="comms" className="mt-6 grid scroll-mt-6 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_380px]">
            <CountdownMessages setup={setup} />
            <BudgetBreakdown setup={setup} />
            <ChatPanel setup={setup} />
          </div>

          {/* Bottom row */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <section id="suppliers" className="scroll-mt-6">
              <SupplierGrid />
            </section>
            <section id="branding" className="scroll-mt-6">
              <BrandingKit setup={setup} dateLabel={formatDate(setup.date)} />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

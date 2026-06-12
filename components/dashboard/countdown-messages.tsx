"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCountdownMessages, type EventSetup, type CountdownMessage } from "@/lib/event-store"

const PLATFORM_STYLES: Record<CountdownMessage["platform"], string> = {
  WHATSAPP: "bg-primary text-primary-foreground",
  INSTAGRAM: "bg-people text-people-foreground",
  EMAIL: "bg-money text-money-foreground",
}

export function CountdownMessages({ setup }: { setup: EventSetup }) {
  const messages = getCountdownMessages(setup)
  const [open, setOpen] = useState<string | null>(messages[0]?.marker ?? null)

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-hairline bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Countdown messages</h2>
        <span className="font-mono text-xs uppercase tracking-label text-muted-foreground">
          {messages.length} drafted
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {messages.map((msg) => {
          const isOpen = open === msg.marker
          return (
            <button
              key={msg.marker}
              onClick={() => setOpen(isOpen ? null : msg.marker)}
              className={cn(
                "flex flex-col rounded-2xl border p-4 text-left transition-colors",
                isOpen ? "border-transparent bg-lime" : "border-hairline bg-background hover:border-lime",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold tabular-nums",
                    isOpen ? "bg-lime-foreground text-lime" : "bg-primary text-primary-foreground",
                  )}
                >
                  {msg.marker}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-label",
                    isOpen ? "bg-lime-foreground/10 text-lime-foreground" : PLATFORM_STYLES[msg.platform],
                  )}
                >
                  {msg.platform}
                </span>
                <span
                  className={cn(
                    "ml-auto flex items-center gap-2 text-xs",
                    isOpen ? "text-lime-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {msg.sendLabel}
                  <ChevronDown
                    className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                    strokeWidth={2}
                  />
                </span>
              </div>

              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  isOpen ? "whitespace-pre-line text-lime-foreground" : "truncate text-muted-foreground",
                )}
              >
                {isOpen ? msg.full : msg.preview}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

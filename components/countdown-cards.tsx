"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tag } from "@/components/tag"
import { COUNTDOWN_MESSAGES } from "@/lib/data"

export function CountdownCards() {
  const [open, setOpen] = useState<string | null>("D-15")

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-label text-muted-foreground">Comms Schedule</h2>
        <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
          {COUNTDOWN_MESSAGES.length} drafted
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {COUNTDOWN_MESSAGES.map((msg) => {
          const isOpen = open === msg.marker
          const urgent = msg.marker === "D-3"
          return (
            <button
              key={msg.marker}
              onClick={() => setOpen(isOpen ? null : msg.marker)}
              className="group relative flex flex-col rounded-2xl border border-hairline bg-card p-5 pl-7 text-left transition-colors hover:border-accent-mint"
            >
              {/* dashed ticket-stub left edge */}
              <span
                className={cn(
                  "absolute left-3 top-5 bottom-5 border-l border-dashed",
                  urgent ? "border-accent-amber" : "border-hairline",
                )}
                aria-hidden="true"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-label leading-none",
                      urgent ? "border-accent-amber text-accent-amber" : "border-foreground text-foreground",
                    )}
                  >
                    Remarks · {msg.marker}
                  </span>
                  <Tag>{msg.platform}</Tag>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                    {msg.sendDate}
                  </span>
                  {isOpen ? (
                    <Minus className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
                  ) : (
                    <Plus className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
                  )}
                </div>
              </div>

              {!isOpen && (
                <p className="mt-3 truncate text-sm leading-relaxed text-muted-foreground">{msg.preview}</p>
              )}

              {isOpen && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground">{msg.full}</p>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

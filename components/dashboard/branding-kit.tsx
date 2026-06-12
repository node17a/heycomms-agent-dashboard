"use client"

import type { EventSetup } from "@/lib/event-store"
import { AtSign, Users, Calendar } from "lucide-react"

export function BrandingKit({ setup, dateLabel }: { setup: EventSetup; dateLabel: string }) {
  const handle = setup.instagram ? `@${setup.instagram}` : "@yourpage"

  return (
    <section className="overflow-hidden rounded-3xl border border-hairline bg-primary p-5 text-primary-foreground sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Branding kit</h2>
        <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">Draft</span>
      </div>

      <div className="mt-5 rounded-2xl bg-primary-foreground p-5 text-foreground">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">EVENT IDENTITY</p>
        <h3 className="mt-1 text-balance text-2xl font-bold leading-tight">{setup.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{setup.description}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5 text-foreground">
            <AtSign className="size-4 text-muted-foreground" />
            {handle}
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <Users className="size-4 text-muted-foreground" />
            {setup.attendance || "TBC"} guests
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <Calendar className="size-4 text-muted-foreground" />
            {dateLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex gap-1.5" aria-label="Suggested palette">
          <span className="size-7 rounded-full bg-foreground ring-2 ring-primary-foreground" />
          <span className="size-7 rounded-full bg-primary-foreground ring-2 ring-primary-foreground" />
          <span className="size-7 rounded-full bg-secondary ring-2 ring-primary-foreground" />
        </div>
        <p className="text-sm text-primary-foreground/80">Suggested palette + tone of voice</p>
      </div>
    </section>
  )
}

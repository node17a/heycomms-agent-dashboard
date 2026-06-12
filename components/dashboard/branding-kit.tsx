"use client"

import type { EventSetup } from "@/lib/event-store"
import { AtSign, Users, Calendar } from "lucide-react"

export function BrandingKit({ setup, dateLabel }: { setup: EventSetup; dateLabel: string }) {
  const handle = setup.instagram ? `@${setup.instagram}` : "@yourpage"
  const initial = (setup.name || "E").charAt(0).toUpperCase()

  return (
    <section className="overflow-hidden rounded-3xl border border-hairline bg-primary p-5 text-primary-foreground sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Branding kit</h2>
        <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">Draft</span>
      </div>

      {/* Instagram-style social preview */}
      <div className="mt-4 overflow-hidden rounded-2xl bg-primary-foreground">
        {/* Cover gradient using the 3 brand colours */}
        <div className="h-20 bg-gradient-to-r from-people via-lime to-money" />

        <div className="px-4 pb-4">
          {/* Avatar */}
          <div className="-mt-7 flex items-end justify-between">
            <div className="flex size-14 items-center justify-center rounded-full border-[3px] border-primary-foreground bg-lime text-xl font-bold text-lime-foreground">
              {initial}
            </div>
            <a
              href={setup.instagram ? `https://instagram.com/${setup.instagram}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Follow
            </a>
          </div>

          {/* Name + handle */}
          <div className="mt-2.5">
            <p className="font-bold leading-tight text-foreground">{setup.name || "Your event"}</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-people">
              <AtSign className="size-3.5" />
              {setup.instagram || "yourhandle"}
            </p>
          </div>

          {/* Description */}
          {setup.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {setup.description}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-hairline pt-3">
            <span className="flex items-center gap-1.5 text-xs text-foreground">
              <Users className="size-3.5 text-people" />
              {setup.attendance || "TBC"} guests
            </span>
            <span className="flex items-center gap-1.5 text-xs text-foreground">
              <Calendar className="size-3.5 text-muted-foreground" />
              {dateLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Palette */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex gap-1.5" aria-label="Brand palette">
          <span className="size-6 rounded-full bg-lime ring-2 ring-primary-foreground/30" />
          <span className="size-6 rounded-full bg-money ring-2 ring-primary-foreground/30" />
          <span className="size-6 rounded-full bg-people ring-2 ring-primary-foreground/30" />
          <span className="size-6 rounded-full bg-primary-foreground ring-2 ring-primary-foreground/30" />
        </div>
        <p className="text-xs text-primary-foreground/60">Brand palette</p>
      </div>
    </section>
  )
}

"use client"

import type { EventSetup } from "@/lib/event-store"
import { AtSign, Users, Calendar, ExternalLink } from "lucide-react"

export function BrandingKit({ setup, dateLabel }: { setup: EventSetup; dateLabel: string }) {
  const handle = setup.instagram?.replace(/^@/, "").trim() ?? ""
  const profileUrl = handle ? `https://instagram.com/${handle}` : null
  const initial = (setup.name || "E").charAt(0).toUpperCase()

  return (
    <section className="overflow-hidden rounded-3xl border border-hairline bg-primary p-5 text-primary-foreground sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Branding kit</h2>
        <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">Draft</span>
      </div>

      {/* Social profile card — built from setup form data */}
      <div className="mt-4 overflow-hidden rounded-2xl bg-primary-foreground">
        <div className="h-20 bg-gradient-to-r from-people via-lime to-money" />

        <div className="px-4 pb-4">
          <div className="-mt-7 flex items-end justify-between">
            <div className="flex size-14 items-center justify-center rounded-full border-[3px] border-primary-foreground bg-lime text-xl font-bold text-lime-foreground">
              {initial}
            </div>

            {profileUrl ? (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-hairline px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Open Instagram
                <ExternalLink className="size-3" />
              </a>
            ) : (
              <span className="rounded-full border border-hairline px-3.5 py-1.5 text-xs text-muted-foreground">
                No handle set
              </span>
            )}
          </div>

          <div className="mt-2.5">
            <p className="font-bold leading-tight text-foreground">{setup.name || "Your event"}</p>
            <div className="mt-0.5 flex items-center gap-1">
              <AtSign className="size-3.5 text-people" />
              <span className="text-sm text-people">{handle || "—"}</span>
            </div>
          </div>

          {setup.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {setup.description}
            </p>
          )}

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


export function BrandingKit({ setup, dateLabel }: { setup: EventSetup; dateLabel: string }) {
  const handle = setup.instagram?.replace(/^@/, "").trim() ?? ""
  const profileUrl = handle ? `https://instagram.com/${handle}` : null
  const initial = (setup.name || "E").charAt(0).toUpperCase()

  const { data, status } = useInstagramProfile(handle)

  return (
    <section className="overflow-hidden rounded-3xl border border-hairline bg-primary p-5 text-primary-foreground sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Branding kit</h2>
        <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">Draft</span>
      </div>

      {/* Instagram profile preview */}
      <div className="mt-4 overflow-hidden rounded-2xl bg-primary-foreground">
        <div className="h-20 bg-gradient-to-r from-people via-lime to-money" />

        <div className="px-4 pb-4">
          <div className="-mt-7 flex items-end justify-between">
            {/* Avatar: real thumbnail if oEmbed returns one, else initial */}
            <div className="size-14 overflow-hidden rounded-full border-[3px] border-primary-foreground bg-lime">
              {status === "ok" && data?.thumbnail_url ? (
                <img
                  src={data.thumbnail_url}
                  alt={handle}
                  className="size-full object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-xl font-bold text-lime-foreground">
                  {initial}
                </span>
              )}
            </div>

            {/* Follow / open link */}
            {profileUrl ? (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-hairline px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                View on Instagram
                <ExternalLink className="size-3" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-semibold text-muted-foreground"
              >
                Follow
              </button>
            )}
          </div>

          {/* Name + handle */}
          <div className="mt-2.5">
            {/* Use oEmbed author_name if available, else fall back to setup name */}
            <p className="font-bold leading-tight text-foreground">
              {status === "ok" && data?.author_name ? data.author_name : setup.name || "Your event"}
            </p>
            <div className="mt-0.5 flex items-center gap-1">
              {status === "loading" ? (
                <Loader2 className="size-3.5 animate-spin text-people" />
              ) : (
                <AtSign className="size-3.5 text-people" />
              )}
              <span className="text-sm text-people">{handle || "yourhandle"}</span>
              {status === "error" && handle && (
                <span className="ml-1 text-[10px] text-muted-foreground">(not found)</span>
              )}
            </div>
          </div>

          {/* Description from setup */}
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

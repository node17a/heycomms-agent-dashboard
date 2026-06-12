"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Check, RefreshCw } from "lucide-react"
import { Blobs } from "@/components/blobs"
import { cn } from "@/lib/utils"
import { readSetup, saveEventId } from "@/lib/event-store"

const STEPS = [
  "Analysing your event brief",
  "Allocating your budget",
  "Finding suppliers near you",
  "Drafting countdown messages",
  "Building your branding kit",
  "Scanning for society collabs",
]

const STEP_MS = 2000

export default function LoadingPage() {
  const router = useRouter()
  const [completed, setCompleted] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (completed >= STEPS.length || error) return
    const timer = setTimeout(() => setCompleted((c) => c + 1), STEP_MS)
    return () => clearTimeout(timer)
  }, [completed, error])

  useEffect(() => {
    if (started.current) return
    started.current = true
    void startOnboarding()
  }, [])

  async function startOnboarding() {
    const setup = readSetup()
    if (!setup) {
      router.replace("/setup")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/chat/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setup }),
      })
      const data = await response.json()

      if (!response.ok || !data.eventId) {
        throw new Error(data.error || "The agent could not create the budget dashboard.")
      }

      saveEventId(data.eventId)
      router.push(`/dashboard?event_id=${data.eventId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "The agent could not create the budget dashboard.")
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Blobs />

      <div className="relative z-10 mb-8 inline-flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-lime" aria-hidden="true" />
        <span className="text-sm font-semibold uppercase tracking-label text-foreground">HeyComms</span>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-hairline bg-card p-8 shadow-xl shadow-black/5 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex size-16 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-lime opacity-60" />
            <span className="absolute inset-0 rounded-full border-4 border-lime" />
            <span className="size-3 rounded-full bg-lime" />
          </div>

          <h1 className="mt-6 text-balance text-2xl font-bold leading-tight text-foreground">
            Building your event plan...
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ? "The agent needs a quick retry." : "This usually takes 10–15 seconds."}
          </p>
        </div>

        <ul className="mt-8 flex flex-col gap-3" aria-live="polite">
          {STEPS.map((step, i) => {
            const isDone = i < completed
            const isActive = i === completed
            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-500",
                  isDone
                    ? "border-hairline bg-secondary"
                    : isActive
                      ? "border-lime bg-lime/10"
                      : "border-hairline bg-card opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isDone ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                  )}
                  aria-hidden="true"
                >
                  {isDone ? (
                    <Check className="size-3.5" strokeWidth={3} />
                  ) : isActive ? (
                    <span className="size-2 animate-pulse rounded-full bg-lime" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "text-sm transition-colors",
                    isDone || isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step}
                </span>
              </li>
            )
          })}
        </ul>

        {error && (
          <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-foreground">Budget tool did not finish</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{error}</p>
              </div>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setCompleted(0)
                void startOnboarding()
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              Retry budget allocation
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-2 flex w-full items-center justify-center rounded-full border border-hairline bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Open local preview
            </button>
          </div>
        )}
      </div>

      <p className="relative z-10 mt-6 text-xs font-semibold uppercase tracking-label text-muted-foreground">
        Powered by Claude AI
      </p>
    </main>
  )
}

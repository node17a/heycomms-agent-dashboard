"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Blobs } from "@/components/blobs"
import { cn } from "@/lib/utils"

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

  useEffect(() => {
    if (completed >= STEPS.length) {
      const done = setTimeout(() => router.push("/dashboard"), 900)
      return () => clearTimeout(done)
    }
    const timer = setTimeout(() => setCompleted((c) => c + 1), STEP_MS)
    return () => clearTimeout(timer)
  }, [completed, router])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Blobs />

      <div className="relative z-10 mb-8">
        <img src="/logo.png" alt="COMMS" className="h-8 w-auto mix-blend-multiply dark:mix-blend-screen" />
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
          <p className="mt-2 text-sm text-muted-foreground">This usually takes 10–15 seconds.</p>
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
      </div>

      <p className="relative z-10 mt-6 text-xs font-semibold uppercase tracking-label text-muted-foreground">
        Powered by Claude AI
      </p>
    </main>
  )
}

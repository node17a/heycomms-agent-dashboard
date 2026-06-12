"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Blobs } from "@/components/blobs"
import { saveSetup, DEFAULT_SETUP, type EventSetup } from "@/lib/event-store"
import { cn } from "@/lib/utils"

export default function SetupPage() {
  const router = useRouter()
  const [form, setForm] = useState<EventSetup>({
    name: "",
    description: "",
    instagram: "",
    attendance: "",
    budget: "",
    date: "",
  })

  function update<K extends keyof EventSetup>(key: K, value: EventSetup[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload: EventSetup = {
      name: form.name.trim() || DEFAULT_SETUP.name,
      description: form.description.trim() || DEFAULT_SETUP.description,
      instagram: form.instagram.replace(/^@/, "").trim() || DEFAULT_SETUP.instagram,
      attendance: form.attendance.trim() || DEFAULT_SETUP.attendance,
      budget: form.budget.trim() || DEFAULT_SETUP.budget,
      date: form.date || DEFAULT_SETUP.date,
    }
    saveSetup(payload)
    router.push("/loading")
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Blobs />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xl rounded-3xl border border-hairline bg-card p-8 shadow-xl shadow-black/5 sm:p-10"
      >
        <div className="mb-2 inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-lime" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-label text-muted-foreground">HeyComms</span>
        </div>

        <h1 className="text-balance text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Tell us about your event
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The agent handles everything else.</p>

        <div className="mt-8 flex flex-col gap-5">
          <Field label="Event name">
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Summer Grad Ball"
              className={inputBase}
            />
          </Field>

          <Field label="Event description">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Black-tie graduation ball with a live band and rooftop afterparty..."
              rows={3}
              className={cn(inputBase, "resize-none leading-relaxed")}
            />
          </Field>

          <Field label="Society Instagram">
            <div className="flex items-center rounded-2xl border border-hairline bg-background focus-within:border-lime focus-within:ring-2 focus-within:ring-lime/30">
              <span className="pl-4 pr-1 text-sm text-muted-foreground">@</span>
              <input
                value={form.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                placeholder="engsoc"
                className="w-full bg-transparent py-3 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Expected attendance">
              <div className="flex items-center rounded-2xl border border-hairline bg-background focus-within:border-lime focus-within:ring-2 focus-within:ring-lime/30">
                <input
                  type="number"
                  min={1}
                  value={form.attendance}
                  onChange={(e) => update("attendance", e.target.value)}
                  placeholder="400"
                  className="w-full bg-transparent py-3 pl-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <span className="mr-2 shrink-0 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  people
                </span>
              </div>
            </Field>

            <Field label="Budget">
              <div className="flex items-center rounded-2xl border border-hairline bg-background focus-within:border-lime focus-within:ring-2 focus-within:ring-lime/30">
                <span className="pl-4 pr-1 text-sm text-muted-foreground">£</span>
                <input
                  type="number"
                  min={0}
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  placeholder="12000"
                  className="w-full bg-transparent py-3 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </Field>
          </div>

          <Field label="Event date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputBase}
            />
          </Field>
        </div>

        <button
          type="submit"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          Let HeyComms plan this
          <ArrowRight className="size-4" strokeWidth={2} />
        </button>

        <p className="mt-3 text-center text-xs text-muted-foreground">Takes about 10 seconds.</p>
      </form>
    </main>
  )
}

const inputBase =
  "w-full rounded-2xl border border-hairline bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-lime focus:ring-2 focus:ring-lime/30"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-label text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

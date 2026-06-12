"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, AtSign, Users, PoundSterling, Calendar, FileText, Sparkles } from "lucide-react"
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

  const handle = form.instagram.replace(/^@/, "").trim()
  const eventName = form.name.trim() || "Your event"
  const eventDesc = form.description.trim() || "Add a description to preview your event identity."

  return (
    <main className="relative flex min-h-screen bg-background">
      <Blobs />

      {/* ── Left panel: live preview ─────────────────────── */}
      <div className="relative z-10 hidden w-[44%] flex-col items-center justify-center bg-primary px-12 py-16 lg:flex">
        {/* Wordmark */}
        <div className="absolute left-8 top-8 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-lime text-sm font-bold text-lime-foreground">
            H
          </span>
          <span className="text-sm font-semibold text-primary-foreground">HeyComms</span>
        </div>

        <div className="w-full max-w-xs">
          <p className="eyebrow mb-6 text-primary-foreground/50">Live preview</p>

          {/* Instagram profile card */}
          <div className="overflow-hidden rounded-3xl bg-primary-foreground">
            {/* Fake IG header gradient */}
            <div className="h-24 bg-gradient-to-br from-people via-lime to-money opacity-90" />

            <div className="px-5 pb-5">
              {/* Avatar */}
              <div className="-mt-8 flex items-end justify-between">
                <div className="flex size-16 items-center justify-center rounded-full border-4 border-primary-foreground bg-lime text-2xl font-bold text-lime-foreground">
                  {(form.name.trim() || "E").charAt(0).toUpperCase()}
                </div>
                <button
                  type="button"
                  disabled
                  className="rounded-full border border-hairline px-4 py-1.5 text-xs font-semibold text-foreground"
                >
                  Follow
                </button>
              </div>

              {/* Handle + name */}
              <div className="mt-3">
                <p className="text-base font-bold leading-tight text-foreground">
                  {eventName}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-people">
                  <AtSign className="size-3.5" />
                  {handle || "yourhandle"}
                </p>
              </div>

              {/* Bio */}
              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {eventDesc}
              </p>

              {/* Stats row */}
              <div className="mt-4 flex gap-4 border-t border-hairline pt-4 text-center text-xs">
                <div>
                  <p className="font-bold text-foreground">{form.attendance || "—"}</p>
                  <p className="text-muted-foreground">guests</p>
                </div>
                <div>
                  <p className="font-bold text-money">
                    {form.budget ? `£${Number(form.budget).toLocaleString()}` : "—"}
                  </p>
                  <p className="text-muted-foreground">budget</p>
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {form.date
                      ? new Date(form.date + "T00:00:00").toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })
                      : "—"}
                  </p>
                  <p className="text-muted-foreground">date</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-primary-foreground/50">
            Fill in the form to see your event identity come to life. The agent uses this to generate your plan.
          </p>
        </div>
      </div>

      {/* ── Right panel: form ────────────────────────────── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-14 sm:px-10">
        {/* Mobile wordmark */}
        <div className="absolute left-5 top-6 flex items-center gap-2 lg:hidden">
          <span className="flex size-7 items-center justify-center rounded-full bg-lime text-xs font-bold text-lime-foreground">
            H
          </span>
          <span className="text-sm font-semibold text-foreground">HeyComms</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-balance text-3xl font-bold leading-tight text-foreground">
              Tell us about your event
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The agent handles everything else — budget, suppliers, comms, branding.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Event name */}
            <Field label="Event name" icon={<Sparkles className="size-3.5 text-lime" />}>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Summer Grad Ball"
                className={inputBase}
              />
            </Field>

            {/* Description */}
            <Field label="What is it?" icon={<FileText className="size-3.5 text-muted-foreground" />}>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Black-tie graduation ball with a live band and rooftop afterparty..."
                rows={3}
                className={cn(inputBase, "resize-none leading-relaxed")}
              />
            </Field>

            {/* Instagram */}
            <Field
              label="Society Instagram"
              icon={<AtSign className="size-3.5 text-people" />}
              hint="people"
            >
              <div className="flex items-center rounded-2xl border border-hairline bg-background transition-colors focus-within:border-people focus-within:ring-2 focus-within:ring-people/20">
                <span className="pl-4 pr-1 text-sm font-medium text-people">@</span>
                <input
                  value={form.instagram}
                  onChange={(e) => update("instagram", e.target.value)}
                  placeholder="engsoc"
                  className="w-full bg-transparent py-3 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </Field>

            {/* Attendance + Budget */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Attendance"
                icon={<Users className="size-3.5 text-people" />}
                hint="people"
              >
                <div className="flex items-center rounded-2xl border border-hairline bg-background transition-colors focus-within:border-people focus-within:ring-2 focus-within:ring-people/20">
                  <input
                    type="number"
                    min={1}
                    value={form.attendance}
                    onChange={(e) => update("attendance", e.target.value)}
                    placeholder="400"
                    className="w-full bg-transparent py-3 pl-4 pr-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <span className="mr-3 shrink-0 rounded-full bg-people-soft px-2.5 py-0.5 text-[10px] font-semibold text-people-foreground">
                    pax
                  </span>
                </div>
              </Field>

              <Field
                label="Budget"
                icon={<PoundSterling className="size-3.5 text-money" />}
                hint="money"
              >
                <div className="flex items-center rounded-2xl border border-hairline bg-background transition-colors focus-within:border-money focus-within:ring-2 focus-within:ring-money/20">
                  <span className="pl-4 pr-1 text-sm font-medium text-money">£</span>
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

            {/* Date */}
            <Field label="Event date" icon={<Calendar className="size-3.5 text-muted-foreground" />}>
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
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Let HeyComms plan this
            <ArrowRight className="size-4" strokeWidth={2.5} />
          </button>

          <p className="mt-3 text-center text-xs text-muted-foreground">Takes about 10 seconds.</p>
        </form>
      </div>
    </main>
  )
}

const inputBase =
  "w-full rounded-2xl border border-hairline bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-lime focus:ring-2 focus:ring-lime/20"

function Field({
  label,
  icon,
  hint,
  children,
}: {
  label: string
  icon?: React.ReactNode
  hint?: "money" | "people"
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5">
        {icon}
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-label",
            hint === "money" ? "text-money" : hint === "people" ? "text-people" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </span>
      {children}
    </label>
  )
}

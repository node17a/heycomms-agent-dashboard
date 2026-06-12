import { cn } from "@/lib/utils"
import { formatBudget, SUPPLIERS, getCountdownMessages, type EventSetup } from "@/lib/event-store"

export function StatCards({ setup, days }: { setup: EventSetup; days: number }) {
  const messages = getCountdownMessages(setup)

  const cards = [
    {
      label: "Budget allocated",
      value: formatBudget(setup.budget),
      sub: `across ${setup.attendance || "—"} guests`,
      tone: "lime" as const,
    },
    {
      label: "Suppliers found",
      value: SUPPLIERS.length.toString(),
      sub: "shortlisted & ready",
      tone: "white" as const,
    },
    {
      label: "Countdown messages",
      value: messages.length.toString(),
      sub: "drafted for you",
      tone: "white" as const,
    },
    {
      label: "Until event",
      value: `D-${days}`,
      sub: "days to go",
      tone: "black" as const,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={cn(
            "flex flex-col gap-3 rounded-3xl p-5",
            c.tone === "lime" && "bg-lime text-lime-foreground",
            c.tone === "white" && "border border-hairline bg-card text-card-foreground",
            c.tone === "black" && "bg-primary text-primary-foreground",
          )}
        >
          <span
            className={cn(
              "font-mono text-xs uppercase tracking-label",
              c.tone === "white" ? "text-muted-foreground" : "opacity-70",
            )}
          >
            {c.label}
          </span>
          <span className="text-3xl font-bold leading-none tabular-nums sm:text-4xl">{c.value}</span>
          <span className={cn("text-xs", c.tone === "white" ? "text-muted-foreground" : "opacity-70")}>{c.sub}</span>
        </div>
      ))}
    </div>
  )
}

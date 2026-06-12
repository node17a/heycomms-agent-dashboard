import { cn } from "@/lib/utils"
import { formatBudget, SUPPLIERS, getCountdownMessages, type EventSetup } from "@/lib/event-store"

export function StatCards({ setup, days }: { setup: EventSetup; days: number }) {
  const messages = getCountdownMessages(setup)

  const cards = [
    {
      label: "Budget allocated",
      value: formatBudget(setup.budget),
      sub: `across ${setup.attendance || "—"} guests`,
      tone: "money" as const,
    },
    {
      label: "Suppliers found",
      value: SUPPLIERS.length.toString(),
      sub: "shortlisted & ready",
      tone: "lime" as const,
    },
    {
      label: "Countdown messages",
      value: messages.length.toString(),
      sub: "drafted for you",
      tone: "people" as const,
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
            "flex flex-col justify-between gap-2 rounded-3xl p-5 min-h-[130px]",
            c.tone === "lime"   && "bg-lime   text-lime-foreground",
            c.tone === "money"  && "bg-money  text-money-foreground",
            c.tone === "people" && "bg-people text-people-foreground",
            c.tone === "black"  && "bg-primary text-primary-foreground",
          )}
        >
          <span className="eyebrow opacity-60">{c.label}</span>
          <span className="text-4xl font-bold leading-none tabular-nums">{c.value}</span>
          <span className="text-xs opacity-60">{c.sub}</span>
        </div>
      ))}
    </div>
  )
}

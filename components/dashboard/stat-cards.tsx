import { cn } from "@/lib/utils"
import type { AgentEvent, BudgetAllocation } from "@/lib/agent-dashboard"
import { formatBudget, SUPPLIERS } from "@/lib/event-store"

export function StatCards({ event, budget, days }: { event: AgentEvent; budget: BudgetAllocation; days: number }) {
  const cards = [
    {
      label: "Budget allocated",
      value: formatBudget(String(budget.totalBudget)),
      sub: `across ${event.expectedAttendance || "—"} guests`,
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
      value: "3",
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
            "flex flex-col gap-3 rounded-3xl p-5",
            c.tone === "lime" && "bg-lime text-lime-foreground",
            c.tone === "money" && "bg-money text-money-foreground",
            c.tone === "people" && "bg-people text-people-foreground",
            c.tone === "black" && "bg-primary text-primary-foreground",
          )}
        >
          <span className="eyebrow opacity-70">{c.label}</span>
          <span className="text-3xl font-bold leading-none tabular-nums sm:text-4xl">{c.value}</span>
          <span className="text-xs opacity-70">{c.sub}</span>
        </div>
      ))}
    </div>
  )
}

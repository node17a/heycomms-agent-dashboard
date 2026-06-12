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
            "flex flex-col justify-between gap-2 rounded-3xl p-5 min-h-[130px]",
            c.tone === "lime"    && "bg-lime text-[#1a2400]",
            c.tone === "money"  && "bg-money text-white",
            c.tone === "people" && "bg-people text-white",
            c.tone === "black"  && "bg-foreground text-background",
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

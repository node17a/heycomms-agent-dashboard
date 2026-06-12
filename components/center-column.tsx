import { StatPills } from "@/components/stat-pills"
import { CountdownCards } from "@/components/countdown-cards"
import { BudgetBar } from "@/components/budget-bar"
import { SupplierGrid } from "@/components/supplier-grid"
import { Tag } from "@/components/tag"
import { ACTIVE_EVENT } from "@/lib/data"

export function CenterColumn() {
  return (
    <main className="flex flex-col gap-8 px-8 py-8">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Tag accent>{ACTIVE_EVENT.society}</Tag>
          <Tag>Planning</Tag>
        </div>
        <h1 className="font-serif text-5xl leading-[1.05] text-balance text-foreground">{ACTIVE_EVENT.name}</h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Your agent is tracking the run-up. Comms are drafted, budget is allocated, suppliers are shortlisted.
        </p>
      </header>

      <StatPills />
      <CountdownCards />
      <BudgetBar />
      <SupplierGrid />
    </main>
  )
}

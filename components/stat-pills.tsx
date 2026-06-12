import { Tag } from "@/components/tag"
import { ACTIVE_EVENT } from "@/lib/data"

interface Stat {
  label: string
  value: string
  sub: string
}

const STATS: Stat[] = [
  { label: "Attendees", value: ACTIVE_EVENT.attendees.toString(), sub: `/ ${ACTIVE_EVENT.capacity} cap` },
  { label: "Budget Left", value: `£${(ACTIVE_EVENT.budgetTotal - ACTIVE_EVENT.budgetSpent).toLocaleString()}`, sub: `of £${ACTIVE_EVENT.budgetTotal.toLocaleString()}` },
  { label: "Days To Go", value: ACTIVE_EVENT.daysToGo.toString(), sub: ACTIVE_EVENT.date },
  { label: "Tasks Done", value: `${ACTIVE_EVENT.tasksDone}`, sub: `/ ${ACTIVE_EVENT.tasksTotal} total` },
]

export function StatPills() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="flex flex-col gap-2 bg-card p-5">
          <Tag>{s.label}</Tag>
          <span className="font-serif text-3xl leading-none nums text-foreground">{s.value}</span>
          <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">{s.sub}</span>
        </div>
      ))}
    </div>
  )
}

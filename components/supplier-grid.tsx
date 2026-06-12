import { ArrowUpRight } from "lucide-react"
import { Tag } from "@/components/tag"
import { SUPPLIERS } from "@/lib/data"

export function SupplierGrid() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-label text-muted-foreground">Suppliers</h2>
        <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
          {SUPPLIERS.length} shortlisted
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUPPLIERS.map((s) => (
          <div
            key={s.name}
            className="group flex flex-col gap-3 rounded-2xl border border-hairline bg-card p-5 transition-colors hover:border-accent-mint"
          >
            <div className="flex items-start justify-between gap-3">
              <Tag>{s.category}</Tag>
              <ArrowUpRight
                className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="font-serif text-lg leading-tight text-balance text-foreground">{s.name}</h3>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">{s.note}</span>
              <span className="font-serif text-base leading-none nums text-foreground">{s.priceRange}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

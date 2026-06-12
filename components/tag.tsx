import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function Tag({
  children,
  className,
  accent,
}: {
  children: ReactNode
  className?: string
  accent?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-label leading-none",
        accent ? "border-accent-mint text-foreground" : "border-hairline text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  )
}

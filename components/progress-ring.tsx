import { cn } from "@/lib/utils"

interface ProgressRingProps {
  value: number // 0-100
  size?: number
  stroke?: number
  label?: string
  big?: string
  small?: string
  accent?: boolean
  className?: string
}

export function ProgressRing({
  value,
  size = 96,
  stroke = 2,
  big,
  small,
  accent = true,
  className,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (Math.min(Math.max(value, 0), 100) / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-hairline"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className={accent ? "stroke-accent-mint" : "stroke-foreground"}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {big && <span className="font-serif text-2xl leading-none nums text-foreground">{big}</span>}
        {small && (
          <span className="mt-1 font-mono text-[9px] uppercase tracking-label text-muted-foreground">{small}</span>
        )}
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"

/**
 * Decorative blurred organic blobs used across pages.
 * Purely decorative — hidden from assistive tech.
 */
export function Blobs({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="absolute -left-24 -top-24 size-96 rounded-full bg-blob-lime opacity-40 blur-3xl" />
      <div className="absolute -right-20 -top-16 size-80 rounded-full bg-blob-peach opacity-40 blur-3xl" />
      <div className="absolute -bottom-24 right-10 size-96 rounded-full bg-blob-lavender opacity-40 blur-3xl" />
    </div>
  )
}

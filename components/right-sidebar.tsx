"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tag } from "@/components/tag"
import { SOCIETIES } from "@/lib/data"

const SUGGESTIONS = ["Draft a D-1 reminder", "Where can I save budget?", "Suggest a collab society"]

function getText(parts: { type: string; text?: string }[]) {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("")
}

export function RightSidebar() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })
  const busy = status === "streaming" || status === "submitted"

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <aside className="flex flex-col gap-6 border-l border-hairline px-6 py-8">
      {/* AGENT CHAT */}
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-hairline bg-card">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent-mint" aria-hidden="true" />
            <h2 className="font-mono text-xs uppercase tracking-label text-foreground">Agent</h2>
          </div>
          <Tag>HeyComms</Tag>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col gap-4 py-2">
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                I&apos;m planning the Grad Ball with you. Ask me to draft comms, rebalance the budget, or find a collab.
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-lg border border-hairline px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-accent-mint hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[88%] text-sm leading-relaxed",
                m.role === "user" ? "self-end" : "self-start",
              )}
            >
              <div
                className={cn(
                  "whitespace-pre-line rounded-2xl px-3 py-2",
                  m.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground",
                )}
              >
                {getText(m.parts) || (busy ? "…" : "")}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="flex items-center gap-2 border-t border-hairline px-3 py-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask HeyComms anything..."
            className="flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            className="flex size-8 items-center justify-center rounded-full border border-hairline text-foreground transition-colors hover:border-accent-mint disabled:opacity-40"
          >
            <ArrowUp className="size-4" strokeWidth={1.5} />
          </button>
        </form>
      </div>

      {/* SOCIETIES */}
      <div className="flex flex-col gap-3">
        <h2 className="font-mono text-xs uppercase tracking-label text-muted-foreground">Collab Suggestions</h2>
        {SOCIETIES.map((soc) => (
          <div
            key={soc.name}
            className="group flex items-center justify-between rounded-2xl border border-hairline bg-card p-4 transition-colors hover:border-accent-mint"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-foreground">{soc.name}</span>
              <div className="flex items-center gap-2">
                <Tag>{soc.tag}</Tag>
                <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                  {soc.members}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-label text-foreground transition-colors group-hover:text-accent-foreground">
              Pitch →
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}

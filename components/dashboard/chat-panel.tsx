"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send } from "lucide-react"
import type { EventSetup } from "@/lib/event-store"

function messageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return ""
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("")
}

const SUGGESTIONS = ["Draft a launch caption", "Suggest a timeline", "Help me cut costs"]

export function ChatPanel({ setup }: { setup: EventSetup }) {
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: () => setError("The agent is unavailable right now. Add billing to the AI Gateway to enable replies."),
  })

  const busy = status === "streaming" || status === "submitted"

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setError(null)
    sendMessage({ text: trimmed }, { body: { event: setup } })
    setInput("")
  }

  return (
    <section className="flex flex-col rounded-3xl border border-hairline bg-foreground p-5 text-background sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          hi
        </span>
        <div>
          <h2 className="text-base font-bold leading-none text-background">Event agent</h2>
          <p className="mt-1 text-xs text-background/60">Ask about your plan</p>
        </div>
      </div>

      <div className="mt-4 flex min-h-48 flex-1 flex-col gap-3 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col justify-end gap-2">
            <p className="text-sm text-background/70">
              {"Hey! I drafted your "}
              <span className="font-semibold text-background">{setup.name}</span>
              {" plan. What should we refine first?"}
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-background/10 text-background"
              }`}
            >
              {messageText(m) || (busy ? "…" : "")}
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-2xl bg-background/10 px-3.5 py-2.5 text-xs leading-relaxed text-background/70">
          {error}
        </p>
      )}

      {messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="rounded-full border border-background/20 px-3 py-1.5 text-xs text-background/80 transition-colors hover:bg-background/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="mt-3 flex items-center gap-2 rounded-full bg-background/10 p-1.5 pl-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message the agent…"
          className="flex-1 bg-transparent text-sm text-background placeholder:text-background/40 focus:outline-none"
          aria-label="Message the event agent"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </form>
    </section>
  )
}

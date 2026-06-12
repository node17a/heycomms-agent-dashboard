import { streamText, convertToModelMessages, type UIMessage } from "ai"

export const maxDuration = 30

interface EventContext {
  name?: string
  description?: string
  instagram?: string
  attendance?: string
  budget?: string
  date?: string
}

function buildSystem(event: EventContext): string {
  const name = event.name || "their event"
  const desc = event.description || "a student society event"
  const extra: string[] = []
  if (event.attendance) extra.push(`Expected attendance: ${event.attendance} people.`)
  if (event.budget) extra.push(`Total budget: £${Number(event.budget).toLocaleString()}.`)
  if (event.date) extra.push(`Event date: ${event.date}.`)
  if (event.instagram) extra.push(`Society Instagram: @${event.instagram}.`)

  return `You are HeyComms, a smart student society event planning agent. You help students plan events by managing budgets, finding suppliers, drafting countdown messages, and building branding kits. Be concise, friendly, and practical. Keep replies short (2-4 sentences) unless asked to draft a full message. Use plain text, no markdown headers.

You are talking to a student planning: "${name}" — ${desc}
${extra.join("\n")}`
}

export async function POST(req: Request) {
  const { messages, event }: { messages: UIMessage[]; event?: EventContext } = await req.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6",
    system: buildSystem(event ?? {}),
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}

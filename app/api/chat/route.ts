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

interface BudgetContext {
  totalBudget?: number
  breakdown?: Array<{ label: string; percentage: number; amount: number }>
}

function buildSystem(event: EventContext, budget?: BudgetContext): string {
  const name = event.name || "their event"
  const desc = event.description || "a student society event"
  const extra: string[] = []
  if (event.attendance) extra.push(`Expected attendance: ${event.attendance} people.`)
  if (event.budget) extra.push(`Total budget: £${Number(event.budget).toLocaleString()}.`)
  if (event.date) extra.push(`Event date: ${event.date}.`)
  if (event.instagram) extra.push(`Society Instagram: @${event.instagram}.`)
  if (budget?.totalBudget) extra.push(`Allocated budget: £${budget.totalBudget.toLocaleString()}.`)
  if (budget?.breakdown?.length) {
    extra.push(
      `Budget allocation: ${budget.breakdown
        .map((item) => `${item.label} ${item.percentage}% (£${item.amount.toLocaleString()})`)
        .join(", ")}.`,
    )
  }

  return `You are HeyComms, a smart student society event planning agent. You help students plan events by managing budgets, finding suppliers, drafting countdown messages, and building branding kits. Be concise, friendly, and practical. Keep replies short (2-4 sentences) unless asked to draft a full message. Use plain text, no markdown headers.

You are talking to a student planning: "${name}" — ${desc}
${extra.join("\n")}`
}

export async function POST(req: Request) {
  const { messages, event, budget }: { messages: UIMessage[]; event?: EventContext; budget?: BudgetContext } =
    await req.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6",
    system: buildSystem(event ?? {}, budget),
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}

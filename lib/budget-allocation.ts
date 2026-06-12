import type { AgentDashboardData, BudgetCategory } from "@/lib/agent-dashboard"

export type EventType = "club night" | "formal dinner" | "sports social" | "default"

interface AllocationInput {
  totalBudget: number
  eventType?: string | null
}

interface SetupLike {
  name: string
  description: string
  instagram: string
  attendance: string
  budget: string
  date: string
}

const CATEGORY_LABELS: Record<string, string> = {
  venue: "VENUE",
  catering: "CATERING",
  av_tech: "AV / TECH",
  marketing: "MARKETING",
  contingency: "CONTINGENCY",
}

const CATEGORY_NOTES: Record<string, string> = {
  venue: "Space hire, deposits and minimum spend.",
  catering: "Food, soft drinks and service costs.",
  av_tech: "Sound, lighting, staging and technical support.",
  marketing: "Paid social, print assets and launch materials.",
  contingency: "Buffer for price changes and last-minute needs.",
}

const SPLITS: Record<EventType, Record<string, number>> = {
  "club night": {
    venue: 35,
    catering: 20,
    av_tech: 25,
    marketing: 15,
    contingency: 5,
  },
  "formal dinner": {
    venue: 30,
    catering: 40,
    av_tech: 10,
    marketing: 15,
    contingency: 5,
  },
  "sports social": {
    venue: 25,
    catering: 40,
    av_tech: 5,
    marketing: 20,
    contingency: 10,
  },
  default: {
    venue: 35,
    catering: 25,
    av_tech: 15,
    marketing: 15,
    contingency: 10,
  },
}

export function inferEventType(input: string): EventType {
  const value = input.toLowerCase()
  if (value.includes("sport") || value.includes("football") || value.includes("rugby") || value.includes("team")) {
    return "sports social"
  }
  if (value.includes("formal") || value.includes("dinner") || value.includes("ball")) {
    return "formal dinner"
  }
  if (value.includes("club") || value.includes("night") || value.includes("party")) {
    return "club night"
  }
  return "default"
}

export function normalizeEventType(eventType?: string | null): EventType {
  if (!eventType) return "default"
  const value = eventType.toLowerCase().trim()
  if (value === "club night" || value === "formal dinner" || value === "sports social") {
    return value
  }
  return inferEventType(value)
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function allocateBudgetCategories({ totalBudget, eventType }: AllocationInput): BudgetCategory[] {
  const safeTotal = Number.isFinite(totalBudget) && totalBudget > 0 ? totalBudget : 0
  const split = SPLITS[normalizeEventType(eventType)]

  return Object.entries(split).map(([key, percentage]) => ({
    key,
    label: CATEGORY_LABELS[key] ?? key.toUpperCase(),
    percentage,
    amount: roundMoney((safeTotal * percentage) / 100),
    notes: CATEGORY_NOTES[key] ?? "",
  }))
}

export function setupToDashboardData(setup: SetupLike): AgentDashboardData {
  const totalBudget = Number(setup.budget) || 0
  const expectedAttendance = Number(setup.attendance) || 0
  const eventType = inferEventType(`${setup.name} ${setup.description}`)

  return {
    event: {
      id: "local",
      name: setup.name,
      description: setup.description,
      instagram: setup.instagram,
      date: setup.date,
      venue: null,
      expectedAttendance,
      status: "planning",
    },
    budget: {
      totalBudget,
      breakdown: allocateBudgetCategories({ totalBudget, eventType }),
      spreadsheetUrl: null,
      notes: "Local preview allocation. Submit the setup flow to generate a saved agent budget.",
    },
  }
}

export function budgetBreakdownRecord(breakdown: BudgetCategory[]): Record<string, { percentage: number; amount: number; notes: string }> {
  return Object.fromEntries(
    breakdown.map((item) => [
      item.key,
      {
        percentage: item.percentage,
        amount: item.amount,
        notes: item.notes,
      },
    ]),
  )
}

import { NextResponse } from "next/server"
import type { AgentDashboardData, BudgetAllocation } from "@/lib/agent-dashboard"
import { getSupabase } from "@/lib/supabase"

export const runtime = "nodejs"

interface EventRow {
  id: string
  name: string
  description: string | null
  instagram: string | null
  date: string | null
  venue: string | null
  expected_attendance: number | null
  status: string | null
}

interface BudgetRow {
  total_budget: number | string
  breakdown: BudgetAllocation["breakdown"]
  spreadsheet_url: string | null
  notes: string | null
}

function toDateValue(value: string | null): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toISOString().slice(0, 10)
}

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const supabase = getSupabase()

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id,name,description,instagram,date,venue,expected_attendance,status")
      .eq("id", id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 })
    }

    const { data: budget, error: budgetError } = await supabase
      .from("budgets")
      .select("total_budget,breakdown,spreadsheet_url,notes")
      .eq("event_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (budgetError || !budget) {
      return NextResponse.json({ error: "Budget allocation not found." }, { status: 404 })
    }

    const eventRow = event as EventRow
    const budgetRow = budget as BudgetRow
    const payload: AgentDashboardData = {
      event: {
        id: eventRow.id,
        name: eventRow.name,
        description: eventRow.description ?? "",
        instagram: eventRow.instagram ?? "",
        date: toDateValue(eventRow.date),
        venue: eventRow.venue,
        expectedAttendance: eventRow.expected_attendance ?? 0,
        status: eventRow.status ?? "planning",
      },
      budget: {
        totalBudget: Number(budgetRow.total_budget) || 0,
        breakdown: budgetRow.breakdown ?? [],
        spreadsheetUrl: budgetRow.spreadsheet_url,
        notes: budgetRow.notes,
      },
    }

    return NextResponse.json(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load event dashboard data."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { tool } from "ai"
import { z } from "zod"
import type { AgentEvent, BudgetAllocation } from "@/lib/agent-dashboard"
import {
  allocateBudgetCategories,
  budgetBreakdownRecord,
  inferEventType,
  normalizeEventType,
} from "@/lib/budget-allocation"
import { generateBudgetXlsx } from "@/lib/export-budget"
import { getSupabase } from "@/lib/supabase"

const BUCKET = "budget-exports"

interface CreateEventInput {
  name: string
  description?: string
  instagram?: string
  date?: string | null
  venue?: string | null
  expectedAttendance?: number | null
}

interface AllocateBudgetInput {
  eventId: string
  totalBudget: number
  eventType?: string | null
  expectedAttendance?: number | null
  eventName?: string | null
}

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

function formatSupabaseError(fallback: string, error: unknown): string {
  if (!error || typeof error !== "object") return fallback
  const details = error as { message?: string; code?: string; details?: string; hint?: string; error?: string }
  const parts = [
    details.message || details.error || fallback,
    details.code ? `code: ${details.code}` : "",
    details.details ? `details: ${details.details}` : "",
    details.hint ? `hint: ${details.hint}` : "",
  ].filter(Boolean)
  return parts.join(" | ")
}

function toDateValue(value?: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toISOString().slice(0, 10)
}

function toDbDate(value?: string | null): string | null {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00.000Z`
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

function mapEventRow(row: EventRow): AgentEvent {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    instagram: row.instagram ?? "",
    date: toDateValue(row.date) ?? "",
    venue: row.venue,
    expectedAttendance: row.expected_attendance ?? 0,
    status: row.status ?? "planning",
  }
}

export async function createEventRecord(input: CreateEventInput): Promise<AgentEvent> {
  const supabase = getSupabase()
  const expectedAttendance = Number(input.expectedAttendance) || null
  const { data, error } = await supabase
    .from("events")
    .insert({
      name: input.name.trim() || "Untitled Event",
      description: input.description?.trim() ?? "",
      instagram: input.instagram?.replace(/^@/, "").trim() ?? "",
      date: toDbDate(input.date),
      venue: input.venue?.trim() || null,
      expected_attendance: expectedAttendance,
      status: "planning",
    })
    .select("id,name,description,instagram,date,venue,expected_attendance,status")
    .single()

  if (error) {
    throw new Error(`Failed to create event: ${formatSupabaseError("Supabase insert failed", error)}`)
  }

  return mapEventRow(data as EventRow)
}

export async function allocateBudgetForEvent(input: AllocateBudgetInput): Promise<BudgetAllocation> {
  const supabase = getSupabase()
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id,name,description,instagram,date,venue,expected_attendance,status")
    .eq("id", input.eventId)
    .single()

  if (eventError) {
    throw new Error(
      `Failed to load event for budget allocation: ${formatSupabaseError("Supabase select failed", eventError)}`,
    )
  }

  const eventRow = event as EventRow
  const totalBudget = Number(input.totalBudget) || 0
  const expectedAttendance = Number(input.expectedAttendance || eventRow.expected_attendance) || 0
  const eventType = normalizeEventType(
    input.eventType ?? inferEventType(`${eventRow.name} ${eventRow.description ?? ""}`),
  )
  const breakdown = allocateBudgetCategories({ totalBudget, eventType })
  const notes = `Allocated using the ${eventType === "default" ? "standard event" : eventType} split.`

  const budgetPayload = {
    event_id: input.eventId,
    total_budget: totalBudget,
    breakdown,
    spreadsheet_url: null,
    notes,
  }

  const { error: upsertError } = await supabase
    .from("budgets")
    .upsert(budgetPayload, { onConflict: "event_id" })

  if (upsertError) {
    throw new Error(`Failed to save budget allocation: ${formatSupabaseError("Supabase upsert failed", upsertError)}`)
  }

  const workbook = generateBudgetXlsx(
    budgetBreakdownRecord(breakdown),
    totalBudget,
    expectedAttendance,
    input.eventName || eventRow.name,
  )
  const storagePath = `${input.eventId}/budget.xlsx`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, workbook, {
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      upsert: true,
    })

  if (uploadError) {
    throw new Error(
      `Failed to upload budget spreadsheet: ${formatSupabaseError("Supabase storage upload failed", uploadError)}`,
    )
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60)

  if (signedError) {
    throw new Error(
      `Failed to create spreadsheet download link: ${formatSupabaseError("Supabase signed URL failed", signedError)}`,
    )
  }

  const spreadsheetUrl = signed.signedUrl
  const { error: updateError } = await supabase
    .from("budgets")
    .update({ spreadsheet_url: spreadsheetUrl })
    .eq("event_id", input.eventId)

  if (updateError) {
    throw new Error(
      `Failed to save spreadsheet download link: ${formatSupabaseError("Supabase update failed", updateError)}`,
    )
  }

  return {
    totalBudget,
    breakdown,
    spreadsheetUrl,
    notes,
  }
}

export const agentTools = {
  create_event: tool({
    description: "Create a student society event record for the dashboard.",
    inputSchema: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      instagram: z.string().optional(),
      date: z.string().optional(),
      venue: z.string().optional(),
      expected_attendance: z.number().int().positive().optional(),
    }),
    execute: async (input) =>
      createEventRecord({
        name: input.name,
        description: input.description,
        instagram: input.instagram,
        date: input.date,
        venue: input.venue,
        expectedAttendance: input.expected_attendance,
      }),
  }),
  allocate_budget: tool({
    description: "Allocate an event budget, persist it, and generate a spreadsheet export.",
    inputSchema: z.object({
      event_id: z.string().uuid(),
      total_budget: z.number().nonnegative(),
      event_type: z.string().optional(),
      expected_attendance: z.number().int().nonnegative().optional(),
    }),
    execute: async (input) =>
      allocateBudgetForEvent({
        eventId: input.event_id,
        totalBudget: input.total_budget,
        eventType: input.event_type,
        expectedAttendance: input.expected_attendance,
      }),
  }),
}

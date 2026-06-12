import { NextResponse } from "next/server"
import { z } from "zod"
import { createEventRecord, allocateBudgetForEvent } from "@/lib/agent-tools"
import { inferEventType } from "@/lib/budget-allocation"

export const runtime = "nodejs"
export const maxDuration = 30

const setupSchema = z.object({
  name: z.string().default("Untitled Event"),
  description: z.string().default(""),
  instagram: z.string().default(""),
  attendance: z.string().default(""),
  budget: z.string().default(""),
  date: z.string().default(""),
})

const bodySchema = z.object({
  setup: setupSchema,
})

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json())
    const setup = body.setup
    const expectedAttendance = Number(setup.attendance) || 0
    const totalBudget = Number(setup.budget) || 0
    const eventType = inferEventType(`${setup.name} ${setup.description}`)

    const event = await createEventRecord({
      name: setup.name,
      description: setup.description,
      instagram: setup.instagram,
      date: setup.date,
      expectedAttendance,
    })

    await allocateBudgetForEvent({
      eventId: event.id,
      totalBudget,
      eventType,
      expectedAttendance,
      eventName: event.name,
    })

    if (!event.id) {
      return NextResponse.json({ error: "Could not extract event id from agent tool result." }, { status: 500 })
    }

    return NextResponse.json({
      eventId: event.id,
      message: `Your ${event.name} dashboard is ready with a fresh budget allocation and spreadsheet export.`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to onboard event."
    if (message.startsWith("Missing required environment variable:")) {
      return NextResponse.json(
        {
          error: `${message}. Add your Supabase values to .env.local, then restart the dev server.`,
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

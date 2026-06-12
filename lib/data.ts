export type Platform = "WHATSAPP" | "INSTAGRAM" | "EMAIL"

export interface CountdownMessage {
  marker: string // D-15
  platform: Platform
  preview: string
  full: string
  sendDate: string
}

export interface Supplier {
  name: string
  category: string
  priceRange: string
  note: string
}

export interface BudgetSegment {
  label: string
  pct: number
  amount: number
}

export interface Society {
  name: string
  tag: string
  members: string
}

export const ACTIVE_EVENT = {
  name: "Summer Grad Ball",
  society: "Engineering Society",
  date: "28 JUN 2026",
  daysToGo: 15,
  totalDays: 60,
  attendees: 284,
  capacity: 400,
  budgetTotal: 12000,
  budgetSpent: 7350,
  tasksDone: 18,
  tasksTotal: 26,
}

export const COUNTDOWN_MESSAGES: CountdownMessage[] = [
  {
    marker: "D-15",
    platform: "INSTAGRAM",
    sendDate: "13 JUN",
    preview: "Tickets are LIVE for the Summer Grad Ball — early bird closes Friday.",
    full: "Tickets are LIVE for the Summer Grad Ball. Early bird pricing closes this Friday at midnight. Black-tie, live band, and a rooftop afterparty at The Exchange. Tag the friends you're bringing and grab your table before they're gone. Link in bio.",
  },
  {
    marker: "D-7",
    platform: "WHATSAPP",
    sendDate: "21 JUN",
    preview: "One week to go! Final ticket release + table allocations close Sunday.",
    full: "One week to go until the Grad Ball! This is the FINAL ticket release — once these go, that's it. Table allocations and dietary requirements close Sunday 11:59pm. Drop your meal choice in the form (link below) so catering can finalise numbers. See you on the 28th!",
  },
  {
    marker: "D-3",
    platform: "EMAIL",
    sendDate: "25 JUN",
    preview: "Your Grad Ball guide: timings, dress code, travel and what to bring.",
    full: "Subject: Your Grad Ball Guide — everything you need for Saturday\n\nHi everyone,\n\nWe're three days out! Here's your run-of-show: doors 7:00pm, dinner 8:00pm, awards 9:30pm, live band 10:00pm, afterparty until 1:00am. Dress code is black-tie. Coaches leave from the Students' Union at 6:30pm sharp — bring your ticket QR code (attached). Can't wait to celebrate with you all.\n\n— The Engineering Society Committee",
  },
]

export const BUDGET_SEGMENTS: BudgetSegment[] = [
  { label: "VENUE", pct: 40, amount: 4800 },
  { label: "CATERING", pct: 25, amount: 3000 },
  { label: "MARKETING", pct: 20, amount: 2400 },
  { label: "OTHER", pct: 15, amount: 1800 },
]

export const SUPPLIERS: Supplier[] = [
  { name: "The Exchange Rooftop", category: "VENUE", priceRange: "£3.5k–5k", note: "Capacity 450 · AV incl." },
  { name: "Forkful Catering", category: "CATERING", priceRange: "£18–24pp", note: "Veg & halal options" },
  { name: "Northside Print Co.", category: "PRINT", priceRange: "£120–400", note: "48h turnaround" },
  { name: "Lumen Live Band", category: "ENTERTAINMENT", priceRange: "£900–1.4k", note: "5-piece · 2x45min" },
]

export const SOCIETIES: Society[] = [
  { name: "Photography Society", tag: "MEDIA", members: "210 members" },
  { name: "Music Collective", tag: "ENTERTAINMENT", members: "340 members" },
  { name: "Business Society", tag: "SPONSORSHIP", members: "520 members" },
]

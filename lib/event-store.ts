"use client"

import { useEffect, useState } from "react"

export interface EventSetup {
  name: string
  description: string
  instagram: string
  attendance: string
  budget: string
  date: string // ISO yyyy-mm-dd
}

export interface CountdownMessage {
  marker: string
  platform: "WHATSAPP" | "INSTAGRAM" | "EMAIL"
  preview: string
  full: string
  sendLabel: string
}

export interface Supplier {
  name: string
  category: string
  priceRange: string
  contact: string
}

export interface BudgetSegment {
  label: string
  pct: number
}

const STORAGE_KEY = "heycomms:event"

export const DEFAULT_SETUP: EventSetup = {
  name: "Summer Grad Ball",
  description:
    "A black-tie graduation ball for the Engineering Society with a live band, three-course dinner and a rooftop afterparty.",
  instagram: "engsoc",
  attendance: "400",
  budget: "12000",
  date: "2026-06-28",
}

export const BUDGET_SEGMENTS: BudgetSegment[] = [
  { label: "VENUE", pct: 40 },
  { label: "CATERING", pct: 25 },
  { label: "MARKETING", pct: 20 },
  { label: "AV", pct: 8 },
  { label: "CONTINGENCY", pct: 7 },
]

export const SUPPLIERS: Supplier[] = [
  { name: "The Exchange Rooftop", category: "VENUE", priceRange: "£3.5k–5k", contact: "Enquire" },
  { name: "Forkful Catering", category: "CATERING", priceRange: "£18–24pp", contact: "Get quote" },
  { name: "Lumen Live Band", category: "AV", priceRange: "£900–1.4k", contact: "Book" },
  { name: "Northside Print Co.", category: "MARKETING", priceRange: "£120–400", contact: "Order" },
]

export function getCountdownMessages(setup: EventSetup): CountdownMessage[] {
  const name = setup.name || "the event"
  const handle = setup.instagram ? `@${setup.instagram}` : "our page"
  return [
    {
      marker: "D-15",
      platform: "INSTAGRAM",
      sendLabel: "2 weeks out",
      preview: `Tickets are LIVE for ${name} — early bird closes Friday.`,
      full: `Tickets are LIVE for ${name}. Early bird pricing closes this Friday at midnight. Tag the friends you're bringing and grab your spot before they're gone. Link in bio — follow ${handle} for the full reveal.`,
    },
    {
      marker: "D-7",
      platform: "WHATSAPP",
      sendLabel: "1 week out",
      preview: `One week to go! Final ticket release for ${name}.`,
      full: `One week until ${name}! This is the FINAL ticket release — once these go, that's it. Confirm your spot and let us know any dietary requirements by Sunday so we can finalise numbers. See you there!`,
    },
    {
      marker: "D-3",
      platform: "EMAIL",
      sendLabel: "3 days out",
      preview: `Your ${name} guide: timings, dress code and travel.`,
      full: `Subject: Your ${name} guide — everything you need\n\nHi everyone,\n\nWe're three days out! Here's your run-of-show, dress code and travel info. Bring your ticket QR code (attached). Can't wait to celebrate with you all.\n\n— ${handle}`,
    },
  ]
}

export function daysUntil(dateIso: string): number {
  if (!dateIso) return 0
  const target = new Date(dateIso + "T00:00:00")
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - now.getTime()) / 86_400_000)
  return Math.max(diff, 0)
}

export function formatBudget(value: string): string {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return "£0"
  return `£${n.toLocaleString()}`
}

export function formatDate(dateIso: string): string {
  if (!dateIso) return "TBC"
  const d = new Date(dateIso + "T00:00:00")
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function saveSetup(setup: EventSetup) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(setup))
}

export function readSetup(): EventSetup | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return { ...DEFAULT_SETUP, ...JSON.parse(raw) }
  } catch {
    return null
  }
}

export function useEventSetup(): { setup: EventSetup; loaded: boolean } {
  const [setup, setSetup] = useState<EventSetup>(DEFAULT_SETUP)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = readSetup()
    if (stored) setSetup(stored)
    setLoaded(true)
  }, [])

  return { setup, loaded }
}

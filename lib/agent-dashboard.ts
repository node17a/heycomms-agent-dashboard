export interface BudgetCategory {
  key: string
  label: string
  percentage: number
  amount: number
  notes: string
}

export interface BudgetAllocation {
  totalBudget: number
  breakdown: BudgetCategory[]
  spreadsheetUrl: string | null
  notes: string | null
}

export interface AgentEvent {
  id: string
  name: string
  description: string
  instagram: string
  date: string
  venue: string | null
  expectedAttendance: number
  status: string
}

export interface AgentDashboardData {
  event: AgentEvent
  budget: BudgetAllocation
}

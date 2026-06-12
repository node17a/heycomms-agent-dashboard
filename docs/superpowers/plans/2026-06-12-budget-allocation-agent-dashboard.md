# Budget Allocation Agent Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first HeyComms agent tool by creating persistent event/budget records, generating budget exports, and rendering the real allocation inside the existing `/setup -> /loading -> /dashboard` flow.

**Architecture:** Keep the existing frontend route journey and progressively replace local mock data with API-backed agent dashboard data. Put pure budget math in a small helper, Supabase persistence/export logic in server-only libs, and keep components receiving UI-ready camelCase props.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, Vercel AI SDK tool definitions, Supabase JS, SheetJS `xlsx`, TypeScript.

---

## File Structure

- Create `supabase/migrations/20260612000000_budget_allocation.sql`: event/budget tables, storage bucket, and required index.
- Create `lib/agent-dashboard.ts`: shared frontend/server types for event and budget dashboard data.
- Create `lib/budget-allocation.ts`: pure split selection, amount calculation, fallback dashboard data, and type-safe helpers.
- Create `lib/budget-allocation.test.ts`: executable assertions for budget splits and rounding.
- Create `lib/supabase.ts`: server Supabase client using service role key.
- Create `lib/export-budget.ts`: SheetJS workbook generation.
- Create `lib/agent-tools.ts`: core create/allocate functions plus AI SDK `tool()` wrappers.
- Create `app/api/chat/onboard/route.ts`: setup-to-agent onboarding endpoint.
- Create `app/api/events/[id]/route.ts`: dashboard data fetch endpoint.
- Modify `package.json`: add Supabase, xlsx, and a focused test script.
- Modify `lib/event-store.ts`: add event id storage and fallback dashboard helpers.
- Modify `app/loading/page.tsx`: call onboarding endpoint and redirect to `/dashboard?event_id=...`.
- Modify `app/dashboard/page.tsx`: fetch dashboard data and pass real props to widgets.
- Modify `components/dashboard/budget-breakdown.tsx`: render dynamic budget categories and spreadsheet link.
- Modify `components/dashboard/stat-cards.tsx`: render from event/budget props.
- Modify `components/dashboard/chat-panel.tsx` and `app/api/chat/route.ts`: include budget context in chat.

---

### Task 1: Dependencies And Database Contract

**Files:**
- Modify: `package.json`
- Create: `supabase/migrations/20260612000000_budget_allocation.sql`

- [ ] **Step 1: Add runtime dependencies and a focused budget test script**

Update `package.json` dependencies to include:

```json
"@supabase/supabase-js": "^2.86.0",
"xlsx": "^0.18.5"
```

Add this script:

```json
"test:budget": "tsx lib/budget-allocation.test.ts"
```

Add this dev dependency:

```json
"tsx": "^4.21.0"
```

- [ ] **Step 2: Create the migration**

Create `supabase/migrations/20260612000000_budget_allocation.sql`:

```sql
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Untitled Event',
  description text not null default '',
  instagram text not null default '',
  date timestamptz,
  venue text,
  expected_attendance int,
  status text default 'planning',
  created_at timestamptz default now()
);

create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  total_budget numeric not null,
  breakdown jsonb not null,
  spreadsheet_url text,
  notes text,
  created_at timestamptz default now()
);

create unique index if not exists budgets_event_id_key on budgets(event_id);

insert into storage.buckets (id, name, public)
values ('budget-exports', 'budget-exports', false)
on conflict (id) do update set public = false;
```

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`

Expected: lockfile updates and `node_modules` becomes available.

---

### Task 2: Budget Types And Pure Allocation Logic

**Files:**
- Create: `lib/agent-dashboard.ts`
- Create: `lib/budget-allocation.ts`
- Create: `lib/budget-allocation.test.ts`

- [ ] **Step 1: Define shared dashboard types**

Create `lib/agent-dashboard.ts`:

```ts
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
```

- [ ] **Step 2: Write allocation tests**

Create `lib/budget-allocation.test.ts`:

```ts
import assert from "node:assert/strict"
import { allocateBudgetCategories, inferEventType } from "./budget-allocation"

const formal = allocateBudgetCategories({
  totalBudget: 3000,
  eventType: "formal dinner",
})

assert.deepEqual(
  formal.map((item) => [item.key, item.percentage, item.amount]),
  [
    ["venue", 30, 900],
    ["catering", 40, 1200],
    ["av_tech", 10, 300],
    ["marketing", 15, 450],
    ["contingency", 5, 150],
  ],
)

const defaultSplit = allocateBudgetCategories({
  totalBudget: 999.99,
  eventType: "unknown event",
})

assert.equal(defaultSplit[0].amount, 350)
assert.equal(defaultSplit[4].amount, 100)
assert.equal(inferEventType("summer ball formal dinner for 200 people"), "formal dinner")
assert.equal(inferEventType("weekly party at a club"), "club night")
assert.equal(inferEventType("football team social"), "sports social")

console.log("budget allocation tests passed")
```

- [ ] **Step 3: Run test to verify it fails before implementation**

Run: `pnpm test:budget`

Expected: fail because `lib/budget-allocation.ts` does not exist yet.

- [ ] **Step 4: Implement pure budget logic**

Create `lib/budget-allocation.ts` with split definitions, `inferEventType()`, and `allocateBudgetCategories()`.

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test:budget`

Expected: `budget allocation tests passed`.

---

### Task 3: Export And Supabase Tool Core

**Files:**
- Create: `lib/supabase.ts`
- Create: `lib/export-budget.ts`
- Create: `lib/agent-tools.ts`

- [ ] **Step 1: Add Supabase client**

Create `lib/supabase.ts` with a server-side Supabase client and explicit env validation.

- [ ] **Step 2: Add XLSX generation**

Create `lib/export-budget.ts` with `generateBudgetXlsx()` that writes `Budget Summary` and `Per Head Breakdown` sheets.

- [ ] **Step 3: Add core create/allocate functions and AI SDK tools**

Create `lib/agent-tools.ts` exporting:

```ts
createEventRecord(input)
allocateBudgetForEvent(input)
agentTools = { create_event, allocate_budget }
```

The core functions perform Supabase writes, spreadsheet upload, signed URL creation, and return camelCase dashboard-ready data.

---

### Task 4: API Routes

**Files:**
- Create: `app/api/chat/onboard/route.ts`
- Create: `app/api/events/[id]/route.ts`

- [ ] **Step 1: Add onboarding route**

Create `POST /api/chat/onboard` that accepts `{ setup }`, calls `createEventRecord()` and `allocateBudgetForEvent()`, and returns `{ eventId, message }`.

- [ ] **Step 2: Add event dashboard route**

Create `GET /api/events/[id]` that fetches one event and its budget, maps snake_case database fields to `AgentDashboardData`, and returns 404 for missing data.

---

### Task 5: Client Storage And Loading Bridge

**Files:**
- Modify: `lib/event-store.ts`
- Modify: `app/loading/page.tsx`

- [ ] **Step 1: Add event id storage helpers and fallback dashboard data**

Update `lib/event-store.ts` to export `saveEventId()`, `readEventId()`, and `setupToDashboardData()`.

- [ ] **Step 2: Wire `/loading` to the onboarding endpoint**

Update `app/loading/page.tsx` to read setup from localStorage, POST to `/api/chat/onboard`, save `eventId`, and redirect to `/dashboard?event_id=<id>`. Show retry UI if onboarding fails.

---

### Task 6: Dashboard Components

**Files:**
- Modify: `components/dashboard/budget-breakdown.tsx`
- Modify: `components/dashboard/stat-cards.tsx`
- Modify: `components/dashboard/chat-panel.tsx`
- Modify: `app/api/chat/route.ts`

- [ ] **Step 1: Make `BudgetBreakdown` dynamic**

Accept `budget: BudgetAllocation`, render `budget.breakdown`, and show a spreadsheet button only when `budget.spreadsheetUrl` exists.

- [ ] **Step 2: Make `StatCards` dynamic**

Accept `{ event, budget, days }` and render budget total, expected attendance, supplier count, message count, and D-day value without reading mock budget segments.

- [ ] **Step 3: Add budget context to chat**

Allow `ChatPanel` to pass `budget` in the request body and let `app/api/chat/route.ts` add concise budget context to the system prompt.

---

### Task 7: Dashboard Page Fetching

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Fetch dashboard data**

Read `event_id` from search params, fetch `/api/events/[id]`, and keep a loading/error state.

- [ ] **Step 2: Preserve local fallback**

Use `setupToDashboardData(setup)` when there is no `event_id` or the fetch fails, and show a subtle warning in the latter case.

- [ ] **Step 3: Pass real props through the dashboard**

Convert `AgentDashboardData.event` into the existing `EventSetup` shape for countdown, branding, and chat while passing `event` and `budget` directly to updated stat/budget components.

---

### Task 8: Verification

**Files:**
- Existing app files only.

- [ ] **Step 1: Run focused test**

Run: `pnpm test:budget`

Expected: pass.

- [ ] **Step 2: Run TypeScript/build checks**

Run: `pnpm lint`

Expected: pass or actionable lint output.

Run: `pnpm build`

Expected: pass. If Supabase/AI env vars are missing at runtime, build should still succeed because env access occurs inside request-time functions.

- [ ] **Step 3: Manual flow**

Run: `pnpm dev`, open `/setup`, enter a formal dinner with 200 attendance and 3000 budget, submit, verify `/loading` calls onboarding and `/dashboard?event_id=...` renders the real allocation.

---

## Self-Review

- Spec coverage: migration, Supabase client, XLSX export, agent tool core, onboarding API, event API, setup/loading/dashboard flow, dynamic budget component, spreadsheet link, and verification are covered.
- Placeholder scan: no `TODO`, `TBD`, or unbounded “handle later” steps remain.
- Type consistency: plan uses `AgentDashboardData`, `AgentEvent`, `BudgetAllocation`, and `BudgetCategory` consistently across routes and components.

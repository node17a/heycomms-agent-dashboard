# Budget Allocation Agent Dashboard Design

## Goal

Build the first HeyComms agent tool: budget allocation. Keep the existing `/setup -> /loading -> /dashboard` journey, but replace the static budget mock with real agent-generated budget data, persisted through Supabase and exported as an XLSX spreadsheet.

The dashboard should feel like an agent operations dashboard: the user gives the event brief once, the agent creates the event, allocates budget, generates the spreadsheet, and the dashboard shows the completed tool output.

## Current App Shape

The current app has:

- `app/setup/page.tsx`: client setup form for event name, description, Instagram, attendance, budget, and date.
- `app/loading/page.tsx`: simulated planning progress before redirecting to `/dashboard`.
- `app/dashboard/page.tsx`: client dashboard built from `useEventSetup()`.
- `lib/event-store.ts`: localStorage event setup plus static budget segments and suppliers.
- `components/dashboard/budget-breakdown.tsx`: fixed percentage budget display.
- `components/dashboard/stat-cards.tsx`: summary cards derived from local setup data.
- `components/dashboard/chat-panel.tsx`: streaming AI chat using current event context.

There are no `LandingPage`, `EventDashboard`, event summary stat chip, or spreadsheet download components matching the pasted prompt. The implementation will adapt the existing HeyComms frontend rather than depend on missing components.

## Data Model

Use the pasted Supabase tables with two small conventions for UI compatibility:

- `events.expected_attendance` is the canonical attendance value.
- `budgets.breakdown` stores UI-ready budget categories as JSON.

Migration:

```sql
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Untitled Event',
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
```

Create a private Supabase Storage bucket named `budget-exports`.

## Types

Add shared types for the new data shape:

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

Use camelCase in API responses and frontend props. Keep snake_case inside Supabase access code only.

## Agent Tools

Create `lib/supabase.ts`:

```ts
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)
```

Create `lib/export-budget.ts` with:

```ts
export function generateBudgetXlsx(
  breakdown: Record<string, { percentage: number; amount: number; notes?: string }>,
  total_budget: number,
  expected_attendance: number,
  event_name: string,
): Buffer
```

The workbook has:

- Sheet 1, `Budget Summary`: `Category | Percentage | Amount (£) | Notes`.
- Sheet 2, `Per Head Breakdown`: `Category | Total (£) | Per Person (£)`.
- Header rows and total row styled bold when supported by SheetJS.
- Column widths set as requested.

Create `lib/agent-tools.ts` with Vercel AI SDK `tool()` definitions:

- `createEvent`: inserts an event and returns fields needed by the dashboard summary.
- `allocateBudget`: accepts `event_id`, `total_budget`, `event_type`, and `expected_attendance`.

Budget splits:

- `club night`: venue 35, catering 20, av_tech 25, marketing 15, contingency 5.
- `formal dinner`: venue 30, catering 40, av_tech 10, marketing 15, contingency 5.
- `sports social`: venue 25, catering 40, av_tech 5, marketing 20, contingency 10.
- default: venue 35, catering 25, av_tech 15, marketing 15, contingency 10.

`allocateBudget` must:

1. Calculate GBP amounts rounded to 2 decimals.
2. Upsert into `budgets`.
3. Generate the XLSX file.
4. Upload it to `budget-exports/{event_id}/budget.xlsx`.
5. Create a signed URL with 1 hour expiry.
6. Save that URL to `budgets.spreadsheet_url`.
7. Return the `BudgetAllocation` shape.

## Routes

### `POST /api/chat/onboard`

This route is called from `/loading`. It receives setup form data, not a free-text landing prompt.

Body:

```ts
{
  setup: EventSetup
}
```

Behavior:

- Use `generateText` with `createEvent` and `allocateBudget`.
- The system prompt tells the agent to create the event immediately, make reasonable inferences, then allocate budget immediately.
- If the model cannot infer `event_type`, use the default allocation split.
- Extract `event_id` from the `createEvent` tool result.
- Return `{ eventId, message }`.
- Return 500 if no event id can be extracted.

### `GET /api/events/[id]`

Fetch one event and its latest budget row. Return `AgentDashboardData` with no extra frontend reshaping required.

If the event or budget is missing, return 404 with a clear JSON error.

## Frontend Flow

### `/setup`

Keep the existing form and visual preview. On submit:

- Save setup locally for fallback display.
- Push to `/loading`.

### `/loading`

Replace simulated-only progress with a real onboarding call:

- Read setup from localStorage.
- POST `{ setup }` to `/api/chat/onboard`.
- While waiting, show the existing progress UI.
- On success, save `eventId` locally and push to `/dashboard?event_id=<id>`.
- On failure, show an error panel with a retry button.

### `/dashboard`

Read `event_id` from search params.

- If present, fetch `/api/events/[id]` and render agent data.
- If absent or fetch fails, fall back to current local setup mock state so the dashboard does not go blank during development.

Update these components:

- `StatCards`: accept `event`, `budget`, and `days` instead of deriving only from `EventSetup`.
- `BudgetBreakdown`: accept `budget: BudgetAllocation`; render category rows from `budget.breakdown`; show `budget.spreadsheetUrl` as a download/open button when present.
- `ChatPanel`: keep current behavior but pass the real event/budget context when available.

Keep the existing visual language: compact dashboard, left icon sidebar, black/lime/blue/orange palette, rounded cards, and concise operational copy.

## Error Handling

- Missing Supabase env vars should produce a server error with a short message.
- Missing setup data on `/loading` should redirect back to `/setup`.
- Failed onboarding should stay on `/loading` with retry.
- Failed dashboard fetch should use local fallback data and display a subtle warning.
- Missing spreadsheet URL should hide or disable the download button rather than rendering an empty link.

## Testing And Verification

Manual acceptance case:

1. User fills setup with: `Summer Ball`, `formal dinner`, `200` people, `3000` budget.
2. Submit sends the user to `/loading`.
3. Loading calls the onboarding route and redirects to `/dashboard?event_id=<id>`.
4. Dashboard renders event name, date, attendance, total budget, budget categories, GBP amounts, and a spreadsheet link.
5. Formal dinner split is: venue 30%, catering 40%, av_tech 10%, marketing 15%, contingency 5%.
6. Amounts for £3000 are: £900, £1200, £300, £450, £150.
7. No undefined values appear in the UI.

Code checks:

- Run lint/build after dependencies are installed.
- If Supabase credentials are unavailable locally, verify pure helpers such as budget allocation and XLSX generation independently.

## Out Of Scope For First Tool

- Auth and multi-user event ownership.
- Editing budget categories after allocation.
- Real supplier search.
- Scheduled message sending.
- Public spreadsheet links that never expire.
- Replacing the whole route model with `/events/[id]`.

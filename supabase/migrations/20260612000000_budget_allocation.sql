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

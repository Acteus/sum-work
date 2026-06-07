create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  description text not null check (char_length(description) between 1 and 120),
  amount_in_cents integer not null check (amount_in_cents > 0),
  paid_by uuid not null references auth.users(id),
  occurred_on date not null,
  created_at timestamptz not null default now()
);

create table public.expense_shares (
  expense_id uuid not null references public.expenses(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  amount_in_cents integer not null check (amount_in_cents >= 0),
  primary key (expense_id, user_id)
);

create table public.settlements (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  paid_by uuid not null references auth.users(id),
  paid_to uuid not null references auth.users(id),
  amount_in_cents integer not null check (amount_in_cents > 0),
  settled_at timestamptz not null default now(),
  check (paid_by <> paid_to)
);

-- Row-level security policies are required before connecting production data.
-- See docs/ARCHITECTURE.md for the intended ownership rules.

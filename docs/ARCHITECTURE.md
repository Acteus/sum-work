# Architecture

## Current boundary

The app is intentionally split into four layers:

1. `src/domain` owns money rules and has no React or database dependencies.
2. `src/server` owns authenticated reads, writes, validation, and persistence.
3. `src/features` and `src/components` render feature and shared UI.
4. `src/app` composes routes; `src/data` temporarily provides demo records.

This lets the expense form and history be built against stable types before a
hosted database is configured.

## Money rules

- Store amounts as integer centavos (`amountInCents`).
- Expense shares must add up exactly to the expense total.
- A positive balance means the group owes that member.
- A negative balance means that member owes the group.
- Remainder centavos from equal splitting are assigned deterministically.

## Supabase integration

Browser and server clients are available in `src/utils/supabase`. The Next.js
proxy verifies and refreshes auth claims on application routes. Environment
values are documented in `.env.example`; real values remain uncommitted.

`supabase/migrations` defines the versioned tables. Before using real accounts:

- Add row-level security to every public table.
- Let group members read group data.
- Let group members create expenses and shares in their groups.
- Restrict destructive edits to the record creator or group owner.
- Perform expense and share inserts in one database transaction.

Authentication is deliberately not mocked in the UI. It should be connected
once a Supabase project exists, rather than teaching the frontend to depend on
a temporary fake-auth API.

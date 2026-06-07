# Architecture

## Current boundary

The app is intentionally split into three layers:

1. `src/domain` owns money rules and has no React or database dependencies.
2. `src/data` currently provides demo records.
3. `src/app` and `src/components` render the product experience.

This lets the expense form and history be built against stable types before a
hosted database is configured.

## Money rules

- Store amounts as integer centavos (`amountInCents`).
- Expense shares must add up exactly to the expense total.
- A positive balance means the group owes that member.
- A negative balance means that member owes the group.
- Remainder centavos from equal splitting are assigned deterministically.

## Planned Supabase integration

`supabase/schema.sql` defines the initial tables. Before using real accounts:

- Add Supabase server/client packages and environment variables.
- Add row-level security to every public table.
- Let group members read group data.
- Let group members create expenses and shares in their groups.
- Restrict destructive edits to the record creator or group owner.
- Perform expense and share inserts in one database transaction.

Authentication is deliberately not mocked in the UI. It should be connected
once a Supabase project exists, rather than teaching the frontend to depend on
a temporary fake-auth API.

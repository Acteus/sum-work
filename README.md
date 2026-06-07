# Sumwork

Sumwork is a shared expense tracker for trips, households, and friend groups.
The current version establishes the product shell and the calculation engine;
the next contributor owns the core expense-management interface.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Browser and server
helpers live in `src/utils/supabase`, and `src/proxy.ts` refreshes auth sessions.

## Checks

```bash
npm run lint
npm test
npm run build
```

## Project map

- `src/domain/expenses.ts` contains framework-independent balance logic.
- `src/data/demo-group.ts` supplies temporary data for the app shell.
- `src/features` contains feature-owned presentation and orchestration.
- `src/server` contains authenticated reads, writes, persistence, and validation.
- `src/components` contains shared and marketing-only UI.
- `src/utils/supabase` contains browser, server, and session helpers.
- `src/app/page.tsx` renders the current dashboard.
- `supabase/migrations` contains the versioned persistence model.
- `CONTRIBUTING.md` is the handoff for the next contributor.
- `docs/ARCHITECTURE.md` explains boundaries and future integration.

Money is stored and calculated as integer cents. The UI currently uses PHP.

# Sumwork

Sumwork is a shared expense tracker for trips, households, and friend groups.
The current version establishes the product shell and the calculation engine;
the next contributor owns the core expense-management interface.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm test
npm run build
```

## Project map

- `src/domain/expenses.ts` contains framework-independent balance logic.
- `src/data/demo-group.ts` supplies temporary data for the app shell.
- `src/app/page.tsx` renders the current dashboard.
- `supabase/schema.sql` is the proposed persistence model.
- `CONTRIBUTING.md` is the handoff for the next contributor.
- `docs/ARCHITECTURE.md` explains boundaries and future integration.

Money is stored and calculated as integer cents. The UI currently uses PHP.

# AGENTS.md

Operating instructions for coding agents working on Sumwork.
Read this file before every task.

**Working code only. Finish the job. Do not blur contributor boundaries.**

---

## 0. Non-negotiables

1. No flattery or filler. Start with the answer or action.
2. Disagree directly when a premise is technically wrong or unsafe.
3. Never fabricate APIs, paths, schema fields, test results, or deployment
   status. Read or run the source of truth.
4. Stop and ask when two plausible interpretations materially change the result.
5. Keep every changed line scoped to the requested feature.
6. Do not overwrite or complete another contributor's assigned feature unless
   the user explicitly reassigns it.
7. Never calculate money with floating-point pesos. Use integer centavos.
8. Never expose Supabase service-role keys or other secrets to the browser.
9. Do not claim completion until lint, tests, build, and relevant UI checks pass.

---

## 1. Working Method

### Before editing

- State the intended change and verification in one or two sentences.
- Read the files being changed and their callers or consumers.
- Match established patterns unless the task explicitly changes architecture.
- Surface assumptions that cannot be resolved from the repository.
- For meaningful competing approaches, explain the tradeoff before choosing.

### While editing

- Implement the smallest complete solution to the stated problem.
- Do not add speculative configurability, abstractions, or error handling.
- Do not refactor adjacent working code or reformat unrelated files.
- Clean up only imports, variables, and files made obsolete by the current edit.
- If a solution is substantially longer than necessary, simplify it.

### Verification

- Translate vague work into observable success criteria.
- Prefer a failing test or reproducible check before fixing a bug.
- Run the narrowest relevant check while iterating and the full required checks
  before completion.
- Read complete errors and fix root causes rather than suppressing symptoms.
- For UI work, visually compare relevant desktop and mobile states.
- Never report a command as passing unless its output was observed.

### Communication and session hygiene

- Be direct and concise; report blockers and tradeoffs plainly.
- Use descriptive commit subjects under 72 characters.
- Do not add AI co-author attribution unless explicitly requested.
- After two failed corrections on the same issue, stop, summarize what was
  learned, and change strategy instead of repeating the same attempt.
- When an agent mistake reveals a missing rule, add one concrete line under
  Project Learnings; tighten existing rules instead of duplicating them.

---

## 2. Project Context

Sumwork is a shared ledger for group expenses and consensual user-to-user debt
agreements. It records external payments but does not transfer or hold money.

The current delivery plan is in `docs/PRODUCT_ROADMAP.md`.
Architecture decisions are in `docs/ARCHITECTURE.md`.
The beginner UI contribution brief is in `CONTRIBUTING.md`.

### Stack

- Next.js `16.2.7` App Router with React `19`
- TypeScript in strict mode
- Tailwind CSS `4` plus project CSS in `src/app/globals.css`
- Supabase Auth and Postgres through `@supabase/ssr`
- Vitest for domain tests
- Vercel deployment from GitHub `main`

Next.js 16 differs from older versions. Read the relevant local documentation
in `node_modules/next/dist/docs` before using routing, caching, middleware, or
server APIs. Use `src/proxy.ts`, not the legacy `middleware.ts` convention.

### Commands

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

Run focused tests while iterating and all three checks before finishing.

---

## 3. Repository Layout And Ownership

### Route composition

- `src/app`: routes, layouts, route-level loading/error states, and page
  composition.
- Keep route files thin. Business rules do not belong in React pages.
- `src/app/globals.css` is the current design-system source of truth until
  reusable UI primitives replace global component classes.

### Friend-owned UI work

- `src/features/expenses/components`: expense form and expense history UI.
- `src/features/members/components`: participant management UI.
- Responsive, empty, loading, success, and error states for those features.
- UI work may call documented domain functions and server actions.
- UI work must not change financial formulas, RLS, migrations, or server-side
  authorization without explicit coordination.

### Shared UI

- `src/components/ui`: reusable, feature-neutral primitives only.
- `src/components/marketing`: public landing-page components.
- Do not place feature-specific forms or workflows in shared component folders.

### Platform and financial work

- `src/domain`: framework-independent financial types, validation, calculations,
  and their colocated tests.
- `src/server/actions`: authenticated mutation entrypoints.
- `src/server/queries`: authenticated server-side reads.
- `src/server/repositories`: Supabase persistence adapters.
- `src/server/validation`: server input schemas and parsing.
- `src/utils/supabase`: low-level browser, server, environment, and session
  clients only.
- `supabase/migrations`: versioned database schema and RLS changes.

### Temporary data

- `src/data`: demo fixtures only.
- Production features must not add new business logic to demo fixtures.
- Remove demo dependencies route by route as persisted data becomes available.

---

## 4. Dependency Rules

Keep dependencies flowing in this direction:

```text
app / feature components
        |
        v
server actions and queries
        |
        v
domain rules + repositories
        |
        v
Supabase clients / database
```

- `src/domain` must not import React, Next.js, Supabase, or browser APIs.
- Client Components must not import server modules.
- Components must not query Supabase directly.
- Server actions validate input, authorize the actor, call domain logic, then
  persist through repositories.
- Repositories map database rows to domain types; they do not decide financial
  policy.

---

## 5. Financial Invariants

- Store amounts as integer centavos.
- The initial supported currency is PHP.
- Expense shares must add up exactly to the expense total.
- Positive balances mean the group owes the member; negative balances mean the
  member owes the group.
- Equal-split remainder centavos are assigned deterministically.
- Debt terms require debtor acceptance before activation.
- Interest is optional annual simple interest expressed in basis points.
- Interest starts the day after the due date using a fixed 365-day basis.
- Partial payments clear accrued interest before principal.
- The default maximum APR is 36%, controlled by application configuration.
- Accepted terms and confirmed payments are never edited in place; append a new
  event or replacement proposal.

Add or update domain tests before changing any invariant.

---

## 6. Supabase And Security

- Real environment values belong in `.env.local` and Vercel, never in commits.
- Only `NEXT_PUBLIC_SUPABASE_URL` and the publishable key may be exposed to the
  browser.
- All public tables must have Row Level Security enabled before production use.
- Users may read only groups they belong to and debts they are party to.
- Treat browser input and user IDs as untrusted.
- Derive the acting user from the verified Supabase session.
- Multi-record financial writes must be atomic.
- Financial mutations must append an immutable `ledger_events` record.
- Avoid `getSession()` for server authorization; use verified claims/user APIs.

Do not run production migrations unless the user explicitly asks.

---

## 7. UI Direction

- Preserve the current cream, ink, orange, and green palette.
- Preserve the Cormorant Garamond and DM Sans typography pairing.
- Reuse editorial panels, restrained borders, strong monetary hierarchy, and
  numbered actions.
- Distinguish informal balances from accepted debts visually and in wording.
- Show principal, interest, total due, due date, and confirmation state
  separately.
- Use neutral language: "due", "overdue", "awaiting confirmation", and
  "needs review".
- Maintain keyboard access, visible focus, readable contrast, and mobile layouts.
- For meaningful UI changes, verify desktop and 390px mobile views in Browser.

---

## 8. Coding And Verification

- Match existing TypeScript style, path aliases, and naming.
- Prefer small feature modules over broad utility files.
- Add abstractions only when they enforce a real boundary or remove duplication.
- Keep tests beside framework-independent domain code where practical.
- Test invalid inputs and authorization failures, not only happy paths.
- For database work, test RLS with unrelated, member, debtor, and creditor users.
- Run `git diff --check` and inspect `git status` before finishing.
- Never revert unrelated user changes in a dirty worktree.

---

## 9. Forbidden

- No direct payment processing, automatic debits, collections, or credit scoring.
- No compound interest or hidden fees.
- No mixed-currency ledger in the first release.
- No public debtor profiles or public debt history.
- No client-side service-role key.
- No direct Supabase access from presentation components.
- No unilateral activation of debt terms or payment confirmations.
- No completing friend-owned UI features under the guise of scaffolding.

---

## 10. Project Learnings

Append concise, concrete rules here when a correction reveals a missing project
constraint. Tighten an existing rule instead of duplicating it.

- The public landing page is intentionally polished; authenticated product work
  should extend its visual language rather than replacing it.
- Friend-owned UI surfaces stay intentionally unimplemented until that
  contributor takes them on.

## graphify

Graphify generates a local knowledge graph at `graphify-out/`. Generated graph
files and `.codex/` hooks are machine-specific and intentionally gitignored.
Each contributor should install Graphify and run `graphify update .` locally.

Contributor setup:

```bash
graphify install --platform codex
graphify codex install
graphify update .
```

For another coding agent, replace `codex` with its supported platform name.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If `graphify-out/graph.json` is missing, run `graphify update .` before using Graphify queries.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

# Your contribution to Sumwork

Welcome. The project foundation is ready, but the most important user-facing
work has intentionally been left for you. Nothing below is filler: each item
becomes part of the real product.

## Recommended first feature: Add an expense

Build an expense form with:

- Description
- Amount in PHP
- Date
- Payer
- One or more participants
- Equal splitting by default
- Inline validation and a useful success state

Use `splitEqually` from `src/domain/expenses.ts`. Convert pesos to integer
centavos before calling domain functions. Do not calculate with decimal money.

### Acceptance criteria

- A valid submission produces an `Expense` object.
- The sum of all shares always equals `amountInCents`.
- Empty descriptions, zero/negative amounts, and no participants are rejected.
- The form can be completed with a keyboard.
- Error messages explain how to fix the problem.

## Next features

### Expense history

Render expenses newest-first. Add text search, payer filtering, and an empty
state. Begin with `demoExpenses`; database integration can follow later.

### Participant management

Create interfaces to add, rename, and remove group members. Prevent removal
when it would leave an existing expense pointing to a missing member.

### Responsive and state polish

Audit the complete flow at narrow mobile sizes. Add loading, no-data, error,
and success states. Preserve visible focus indicators and readable contrast.

## Suggested file ownership

You are free to choose your component structure. A good starting point is:

```text
src/components/expense-form/
src/components/expense-history/
src/components/member-manager/
```

Avoid changing `src/domain/expenses.ts` until its tests make sense to you.
When its behavior needs to change, add or update a test first.

## Workflow

1. Create a feature branch, such as `feature/add-expense-form`.
2. Run `npm test` before you begin.
3. Keep the first pull request focused on one feature.
4. Include screenshots for desktop and mobile.
5. Run `npm run lint`, `npm test`, and `npm run build` before review.

## Useful learning path

Start with rendering the fields, then local React state, validation, submission,
and finally visual polish. You do not need to write database code for the first
version; returning an `Expense` object in memory is a complete first milestone.
Supabase helpers are ready in `src/utils/supabase` when the interface is ready
to persist real records.

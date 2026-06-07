# Sumwork Shared Ledger Product Roadmap

## Summary

Evolve Sumwork into a shared ledger for groups and direct user-to-user debts.

The product will retain the current editorial visual language, PHP money
formatting, responsive layout, and beginner-friendly contribution boundaries.
Delivery will be phased so expense tracking works before advanced debt features
are introduced.

## Core Product Model

- Users authenticate through Supabase Auth using email magic links initially.
- Users create groups, invite members, record shared expenses, and view balances.
- A balance may remain informal or be converted into an explicit debt agreement.
- Users may also propose standalone direct loans unrelated to an expense.
- Debt agreements require debtor acceptance before becoming active.
- Sumwork records external payments; it does not process or hold funds.
- Material changes and payments require confirmation by the other party.
- Every financial action produces an immutable activity event.

## Financial Rules

- Store all monetary values as integer centavos.
- Use PHP as the initial and group-level currency; prevent mixed-currency ledgers.
- Interest is optional annual simple interest expressed in basis points.
- Interest begins the day after the due date and accrues daily:
  `remaining principal x APR x overdue days / 365`.
- Round accrued interest deterministically to centavos.
- Partial payments clear accrued interest first, then principal.
- Future interest accrues only against remaining principal.
- Default maximum APR is 36%, controlled through application configuration.
- Rates above the configured cap are rejected.
- Display that Sumwork is a record-keeping tool and users remain responsible for
  applicable lending laws.

## Data And Interfaces

Extend the Supabase model with:

- `profiles`: display name, avatar, timezone, notification preferences.
- `group_invites`: email/token, role, expiry, acceptance state.
- `debts`: creditor, debtor, source expense, principal, remaining principal,
  due date, APR, status, accepted terms, timestamps.
- `debt_payments`: amount, external method, reference, optional receipt,
  allocation, proposer, confirmation state.
- `ledger_events`: append-only audit records for proposals, acceptance, edits,
  payments, disputes, and completion.
- `notifications`: in-app delivery state and associated entity.
- Add lifecycle fields to existing expenses and settlements instead of deleting
  their current structure.

Public domain types should include `DebtAgreement`, `DebtTerms`, `DebtPayment`,
`InterestAccrual`, `LedgerEvent`, and explicit status unions.

State transitions:

- Debt: `draft -> proposed -> active -> overdue -> settled`
- Alternative outcomes: `declined`, `cancelled`, or `disputed`
- Payment: `proposed -> confirmed` or `rejected`
- Accepted financial terms cannot be edited in place; changes create a
  replacement proposal and audit event.

Use Supabase Row Level Security so only involved users and group members can
read relevant records. Mutations should run through validated server actions or
route handlers, with expense creation, shares, payments, and audit events
committed atomically.

Implementation ownership and dependency boundaries are defined in `AGENTS.md`.
Friend-owned UI belongs in `src/features/expenses/components` and
`src/features/members/components`; financial and persistence work belongs in
`src/domain`, `src/server`, and `supabase/migrations`.

## Delivery Phases

### 1. Authenticated Ledger Foundation

- Profiles, group creation, invitations, member roles, and RLS.
- Replace demo data with server-rendered Supabase records.
- Preserve the existing public landing page and introduce an authenticated
  ledger workspace.

### 2. Shared Expense MVP

- Friend-owned expense form, participant management, expense history, filters,
  and responsive states.
- Equal and custom splits.
- Balance calculations from persisted expenses.
- Record and confirm ordinary settlements without interest.

### 3. Debt Agreements

- Create direct debts or convert an expense balance into a debt proposal.
- Capture principal, debtor, creditor, due date, optional APR, and notes.
- Debtor acceptance, rejection, cancellation, and term-change proposals.
- Debt detail page with clear agreement summary and activity timeline.

### 4. Payments And Interest

- Daily simple-interest calculation for overdue active debts.
- Partial and full external-payment recording.
- Two-party payment confirmation.
- Interest-first allocation and automatic settlement when the balance reaches
  zero.
- Overdue, due-soon, disputed, and settled states.

### 5. Notifications And Reporting

- In-app and email notifications for proposals, acceptance, due dates, overdue
  status, and payment confirmation.
- Idempotent scheduled reminder jobs.
- Personal dashboard for amounts owed, amounts receivable, upcoming due dates,
  and recent activity.
- Exportable ledger statement suitable for reconciliation, not legal
  enforcement.

## UI Direction

- Keep the current cream, ink, orange, and green palette and existing typography.
- Reuse the editorial panels, strong monetary hierarchy, numbered actions, and
  restrained borders.
- Build authenticated screens around a ledger dashboard, group detail, debt
  detail, and activity timeline.
- Clearly distinguish informal balances from accepted debts.
- Show principal, accrued interest, total due, due date, and confirmation state
  separately.
- Never use alarming debt-collection language; prefer neutral terms such as
  "due," "overdue," "awaiting confirmation," and "needs review."
- Maintain keyboard operation, visible focus states, readable contrast, mobile
  layouts, and complete loading, empty, and error states.

## Testing And Acceptance

- Unit-test splitting, balances, daily interest, rounding, partial payments,
  rate caps, and state transitions.
- Test leap-year and timezone boundaries without changing the fixed 365-day
  interest basis.
- Integration-test atomic expense, debt, payment, confirmation, and audit-event
  writes.
- Verify RLS prevents unrelated users from reading or mutating ledger records.
- Verify neither party can activate a debt or payment unilaterally.
- Test duplicate submissions and notification jobs for idempotency.
- Run lint, unit tests, integration tests, production build, and desktop/mobile
  browser QA for each phase.
- A phase is complete only when its persisted workflow works in production and
  previous ledger behavior remains intact.

## Assumptions

- Sumwork tracks agreements and external payments but does not transfer money.
- No compounding interest, penalties, automatic debits, collections, credit
  scoring, or public debtor profiles.
- PHP is the only supported currency in the first release.
- Default timezone is Asia/Manila, with dates stored in UTC and displayed using
  the user's profile timezone.
- The existing contributor guide remains authoritative for the friend-owned
  expense UI work.
- Optional Supabase Agent Skills are not required for implementation.

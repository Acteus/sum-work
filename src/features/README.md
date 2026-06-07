# Features

User-facing product areas and their presentation orchestration live here.

- `expenses/` and `members/` contain friend-owned UI work.
- `ledger/` contains authenticated ledger views and orchestration.

Features may consume shared UI, domain functions, and documented server
interfaces. They must not bypass server authorization or persistence boundaries.

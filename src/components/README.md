# Components

Shared presentation code lives here.

- `marketing/` contains public landing-page components.
- `ui/` contains reusable, feature-neutral primitives.

Feature workflows belong in `src/features`, not this directory. Components must
not query Supabase directly or implement financial rules.

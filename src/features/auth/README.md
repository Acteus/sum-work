# Authentication UI

This feature owns the presentation for signing in and registering.

- `components/` contains UI-only authentication forms.
- Route files in `src/app` compose these components.
- Supabase calls, session handling, and authorization do not belong here.

When authentication is connected, forms should call documented server actions
rather than importing Supabase clients directly.

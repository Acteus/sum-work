# Server

Authenticated application operations live here.

- `actions/` exposes mutation entrypoints.
- `queries/` exposes server-side reads.
- `repositories/` maps Supabase records to domain types.
- `validation/` parses and validates untrusted input.

Server code may depend on domain rules and Supabase utilities. Client Components
must never import this directory.

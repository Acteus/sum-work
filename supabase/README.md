# Supabase

- `migrations/` contains ordered schema and Row Level Security changes.
- New migrations must be additive and timestamped.
- Never edit an applied production migration; create a new migration.
- Do not place secrets or generated local Supabase state in this directory.

The current initial migration is a proposed baseline. RLS must be added before
the tables are used for production data.

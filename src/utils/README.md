# Utilities

Low-level integration helpers live here.

`supabase/` owns client creation, environment access, and session refresh only.
Business workflows, authorization policy, and financial rules do not belong in
utility modules.

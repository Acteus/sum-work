# Server Actions

Authenticated mutation entrypoints live here.

Each action must parse input, verify the actor, call domain logic, persist
through repositories, and return a narrow result suitable for the UI.

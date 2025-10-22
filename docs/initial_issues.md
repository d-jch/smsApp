# Initial development issues

Below are suggested initial issues for the first development sprint. You can
copy these into GitHub Issues.

1. Auth & Database setup

- Description: Add DB connection setup, migration tooling, and basic auth flow
  (signup/login). Read DB URL from environment and store secrets in GitHub
  Secrets.
- Acceptance: `src/db.ts` with connection and a migration script; tests for DB
  connection.

2. Home page components and layout

- Description: Implement the main UI components using daisyUI and Fresh islands.
  Create component library for `Button`, `Card`, and `Header`.
- Acceptance: Components exist under `components/` with stories/examples and
  unit tests.

3. E2E smoke test

- Description: Add a simple end-to-end smoke test (Playwright or Deno-based)
  that starts the app and checks the home page loads.
- Acceptance: E2E test runs on CI (staging) and passes.

# Renovate configuration

This repository includes a `renovate.json` to enable Renovate to manage
dependency updates for `deno.json` imports (npm and JSR imports).

What this config does
- Uses `regexManagers` to scan `deno.json` and create PRs for `npm:` and
  `jsr:` imports.
- Groups updates that originate from `deno.json` under the `deno.json imports`
  group.
- Does not automerge by default; review PRs before merging.

How to enable
1. Install the Renovate GitHub App for this repository (https://github.com/apps/renovate).
2. Alternatively, enable Renovate via your org's Renovate setup.
3. After installation, Renovate will open PRs according to the rules.

Notes & next steps
- If Renovate PRs break typecheck, consider adding a small CI job to run
  `deno cache`/`deno check` for Renovate PRs to validate upgrades.
- The `jsr:` regex is intentionally loose; some manual review may be needed
  for major upgrades.

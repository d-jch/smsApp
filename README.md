# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

Then start the project in development mode:

```
deno task dev
```

This will watch the project directory and restart as necessary.

## Production

To run the built server in production with minimal permissions:

```
deno task start:prod
```

This runs the `_fresh` server bundle with only network and read access to the
built assets. Avoid using `-A` in production; grant only the permissions your
deployment needs (e.g. `--allow-net` and `--allow-read` for static assets).

## Pinned Deno version

This project pins the recommended Deno runtime version for CI and local
development. The configured version is `2.5.4` (see `deno.json` `deno-version`).
Use the same or a compatible Deno 2.x release locally to avoid unexpected CI
failures.

## Environment variables

Copy `.env.example` to `.env` (or set environment variables in your deployment)
and fill in values for DB, secrets, and third-party DSNs. Do not commit secrets
to the repository. Example variables are:

- `PORT` - server port
- `NODE_ENV` - environment (`development`/`production`)
- `DATABASE_URL` - database connection string
- `SENTRY_DSN` - Sentry DSN for error reporting
- `JWT_SECRET` - JWT signing secret

Note on token storage

The frontend islands currently store the received JWT in `localStorage` for
simplicity and to keep the client code minimal. This is convenient for demos and
prototypes but has important security implications: tokens in localStorage are
vulnerable to exfiltration via XSS. For production, prefer issuing HttpOnly,
Secure cookies from the server (Set-Cookie) and keep tokens out of
JavaScript-accessible storage. See OWASP session management guidance for
details.

The repository includes `src/config.ts` which reads these values via `Deno.env`.

## Testing and CI (DB TLS / custom CA)

If your Postgres instance uses a custom CA (self-signed or private CA), you have
two recommended ways to run tests and CI without disabling TLS verification:

1. Local developer (preferred per-client verification)

- Place your CA PEM in `src/global-bundle.pem` (already present in this repo if
  used).
- Run tests locally with permission to read that file:

```bash
deno test --allow-net --allow-env --allow-read=./src/global-bundle.pem
```

2. CI runner (process-wide `--cert`) — recommended for GitHub Actions

- Add your CA PEM as a repository secret named `DB_CA_PEM` (or update CI to
  mount a file).
- The included GitHub Actions workflow will write the secret to `/tmp/db_ca.pem`
  and pass `--cert=/tmp/db_ca.pem` to `deno run` and `deno test` so the runner
  trusts the CA.

Notes

- Avoid `--unsafely-ignore-certificate-errors` in CI or production.
- The `src/db.ts` client also passes the CA to the driver via
  `tls.caCertificates`, so per-client verification is used in addition to the
  process-level `--cert` where applicable.

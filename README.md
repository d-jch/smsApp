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

The repository includes `src/config.ts` which reads these values via `Deno.env`.

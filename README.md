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

Production
----------

To run the built server in production with minimal permissions:

```
deno task start:prod
```

This runs the `_fresh` server bundle with only network and read access to the built assets. Avoid using `-A` in production; grant only the permissions your deployment needs (e.g. `--allow-net` and `--allow-read` for static assets).

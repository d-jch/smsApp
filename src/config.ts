export interface AppConfig {
  port: number;
  nodeEnv: string;
  databaseUrl?: string;
  sentryDsn?: string;
  jwtSecret?: string;
}

export function loadConfig(): AppConfig {
  const port = Number(Deno.env.get("PORT") ?? "8000");
  return {
    port,
    nodeEnv: Deno.env.get("NODE_ENV") ?? "production",
    databaseUrl: Deno.env.get("DATABASE_URL") ?? undefined,
    sentryDsn: Deno.env.get("SENTRY_DSN") ?? undefined,
    jwtSecret: Deno.env.get("JWT_SECRET") ?? undefined,
  };
}

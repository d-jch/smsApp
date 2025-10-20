import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { loadConfig } from "./config.ts";

const cfg = loadConfig();

let client: Client | null = null;

export function getClient(): Client {
  if (!cfg.databaseUrl) {
    throw new Error("DATABASE_URL not configured");
  }
  if (!client) {
    client = new Client(cfg.databaseUrl);
  }
  return client;
}

export async function connect() {
  const c = getClient();
  await c.connect();
  return c;
}

export async function disconnect() {
  if (client) {
    await client.end();
    client = null;
  }
}

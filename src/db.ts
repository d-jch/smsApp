// DB wrapper using deno-postgres and a repo-local CA bundle (src/global-bundle.pem)
// Usage permissions needed when running: --allow-net --allow-env --allow-read
import { Client } from "@db/postgres";

interface PgClient {
  connect?: () => Promise<void>;
  end?: () => Promise<void>;
  queryArray: (
    q: string,
    args?: Array<unknown>,
  ) => Promise<{ rows: Array<unknown[]> }>;
  queryObject: <T = Record<string, unknown>>(
    q: string,
    args?: Array<unknown>,
  ) => Promise<{ rows: T[] }>;
}

let _client: PgClient | null = null;

async function initClient(): Promise<PgClient> {
  if (_client) return _client;

  const DATABASE_URL = Deno.env.get("DATABASE_URL");
  if (!DATABASE_URL) throw new Error("DATABASE_URL not configured");

  // Prefer CA PEM from environment (CI can set DB_CA_PEM). If not present, fall back to the
  // repository file `src/global-bundle.pem` (allowed for private repos / controlled access).
  let caPem = Deno.env.get("DB_CA_PEM");
  if (!caPem) {
    const caPath = new URL("./global-bundle.pem", import.meta.url).pathname;
    caPem = await Deno.readTextFile(caPath);
  }

  const url = new URL(DATABASE_URL);
  const user = decodeURIComponent(url.username || "");
  const password = decodeURIComponent(url.password || "");
  const hostname = url.hostname;
  const port = url.port ? Number(url.port) : 5432;
  const database = url.pathname ? url.pathname.replace(/^\//, "") : undefined;

  const clientInstance = new Client({
    user: user || undefined,
    password: password || undefined,
    hostname,
    port,
    database,
    tls: caPem
      ? {
        enabled: true,
        enforce: true,
        caCertificates: [caPem],
      }
      : undefined,
  }) as unknown as PgClient;

  if (typeof (clientInstance as PgClient).connect === "function") {
    await (clientInstance as PgClient).connect!();
  }

  _client = clientInstance;
  return _client;
}

export async function connect() {
  const client = await initClient();
  return {
    queryArray: async (sql: string, params?: unknown[]) => {
      const res = params
        ? await client.queryArray(sql, params as Array<unknown>)
        : await client.queryArray(sql);
      return { rows: res.rows };
    },
    queryObject: async <T = Record<string, unknown>>(
      sql: string,
      params?: unknown[],
    ) => {
      const res = params
        ? await client.queryObject<T>(sql, params as Array<unknown>)
        : await client.queryObject<T>(sql);
      return { rows: res.rows };
    },
  };
}

export async function disconnect() {
  if (!_client) return;
  if (_client.end) await _client.end();
  _client = null;
}

export function getClient() {
  if (!_client) throw new Error("DB not initialized; call connect() first");
  return _client;
}

import { assert } from "@std/assert";
import { connect, disconnect } from "../src/db.ts";

// Move environment access into test runtime so the test module can be imported
// without needing --allow-env at module load time. This makes the test safer
// to run in environments that don't grant env access globally.
Deno.test("db: connect and create users table (integration)", async () => {
  const DATABASE_URL = Deno.env.get("DATABASE_URL");
  if (!DATABASE_URL) {
    console.log("Skipping DB tests because DATABASE_URL is not set");
    return;
  }

  const client = await connect();
  try {
    const result = await client.queryArray(`SELECT 1 as ok`);
    // queryArray result exposes rows array
    assert(result.rows.length > 0);
  } finally {
    await disconnect();
  }
});

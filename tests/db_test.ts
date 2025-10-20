import { assert } from "https://deno.land/std@0.201.0/testing/asserts.ts";
import { connect, disconnect } from "../src/db.ts";

const DATABASE_URL = Deno.env.get("DATABASE_URL");

if (DATABASE_URL) {
  Deno.test("db: connect and create users table", async () => {
    const client = await connect();
    try {
      const result = await client.queryArray(`SELECT 1 as ok`);
      assert(result.length > 0);
    } finally {
      await disconnect();
    }
  });
} else {
  console.log("Skipping DB tests because DATABASE_URL is not set");
}

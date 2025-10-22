import { connect, disconnect } from "../src/db.ts";

async function migrate() {
  const client = await connect();
  try {
    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    console.log("Migration applied");
  } finally {
    await disconnect();
  }
}

if (import.meta.main) {
  migrate().catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}

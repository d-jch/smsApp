import { hash, compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, getNumericDate, Header } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { connect, disconnect } from "./db.ts";

export interface User {
  id: number;
  email: string;
}

export async function createUser(email: string, password: string): Promise<User> {
  const client = await connect();
  try {
    const pwHash = await hash(password);
    await client.queryArray(`INSERT INTO users (email, password_hash) VALUES ($1, $2)`, email, pwHash);
    const res = await client.queryObject<{ id: number }>(`SELECT id FROM users WHERE email = $1`, email);
    const id = res.rows[0]?.id ?? 0;
    return { id, email };
  } finally {
    await disconnect();
  }
}

export async function deleteUserByEmail(email: string): Promise<void> {
  const client = await connect();
  try {
    await client.queryArray(`DELETE FROM users WHERE email = $1`, email);
  } finally {
    await disconnect();
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const client = await connect();
  try {
    const res = await client.queryObject<{ id: number; password_hash: string }>(`SELECT id, password_hash FROM users WHERE email = $1`, email);
    const row = res.rows[0];
    if (!row) return null;
    const ok = await compare(password, row.password_hash);
    if (!ok) return null;
    return { id: row.id, email };
  } finally {
    await disconnect();
  }
}

export async function createJwtForUser(userId: number) {
  const key = Deno.env.get("JWT_SECRET") ?? "dev-secret";
  const header: Header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: String(userId),
    iss: "smsApp",
    exp: getNumericDate(60 * 60),
  };
  return await create(header, payload, key);
}

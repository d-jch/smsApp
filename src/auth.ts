import { compare, hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import {
  create,
  getNumericDate,
  Header,
} from "https://deno.land/x/djwt@v2.8/mod.ts";
import { connect, disconnect } from "./db.ts";

export interface User {
  id: number;
  email: string;
}

export async function createUser(
  email: string,
  password: string,
): Promise<User> {
  const client = await connect();
  try {
    const pwHash = await hash(password);
    // Cast parameters to text to avoid driver/pg type inference issues and
    // return the inserted id in one statement.
    const insert = await client.queryObject<{ id: number }>(
      `INSERT INTO users (email, password_hash) VALUES ($1::text, $2::text) RETURNING id`,
      [email, pwHash],
    );
    const id = insert.rows[0]?.id ?? 0;
    return { id, email };
  } finally {
    await disconnect();
  }
}

export async function deleteUserByEmail(email: string): Promise<void> {
  const client = await connect();
  try {
    await client.queryArray(`DELETE FROM users WHERE email = $1`, [email]);
  } finally {
    await disconnect();
  }
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<User | null> {
  const client = await connect();
  try {
    const res = await client.queryObject<{ id: number; password_hash: string }>(
      `SELECT id, password_hash FROM users WHERE email = $1`,
      [email],
    );
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
  const secret = Deno.env.get("JWT_SECRET") ?? "dev-secret";
  // Import secret into a CryptoKey for HMAC-SHA256 signing
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const header: Header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: String(userId),
    iss: "smsApp",
    exp: getNumericDate(60 * 60),
  };
  return await create(header, payload, cryptoKey as unknown as CryptoKey);
}

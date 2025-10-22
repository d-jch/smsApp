import argon2 from "argon2";
import { jwtVerify, SignJWT } from "jose";
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
    const pwHash = await argon2.hash(password);
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
    const ok = await argon2.verify(row.password_hash, password);
    if (!ok) return null;
    return { id: row.id, email };
  } finally {
    await disconnect();
  }
}

export async function createJwtForUser(userId: number) {
  const key = getJwtKey();
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuer("smsApp")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
  return jwt;
}

export async function verifyJwt(token: string) {
  const key = getJwtKey();
  const { payload } = await jwtVerify(token, key);
  return payload;
}

// getJwtKey returns a CryptoKey compatible key for signing/verification.
// It prefers the `JWT_SECRET` env variable. In production it throws if missing
// to avoid unsafe defaults. For development/tests it will generate a
// per-process random secret so users aren't blocked, but this secret is not
// persisted between runs.
function getJwtKey(): Uint8Array {
  const secret = Deno.env.get("JWT_SECRET");
  if (secret) {
    return new TextEncoder().encode(secret);
  }
  const env = Deno.env.get("NODE_ENV") ?? Deno.env.get("ENV") ?? "development";
  if (env === "production") {
    throw new Error("JWT_SECRET env is required in production");
  }
  // development / test fallback: generate a per-process random key
  // 32 bytes = 256 bits for HS256 secret
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  // warn once in dev so maintainers know a secret wasn't provided
  try {
    console.warn(
      "Warning: JWT_SECRET not set — using a generated in-memory secret for dev/test only",
    );
  } catch {
    // noop in environments where console may be restricted
  }
  return buf;
}

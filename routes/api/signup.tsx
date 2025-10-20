import { HandlerContext } from "fresh/server.ts";
import { createUser, createJwtForUser } from "../../src/auth.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
  try {
    const user = await createUser(email, password);
    const token = await createJwtForUser(user.id);
    return new Response(JSON.stringify({ token }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};

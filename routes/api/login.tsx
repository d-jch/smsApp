import { HandlerContext } from "fresh/server.ts";
import { authenticateUser, createJwtForUser } from "../../src/auth.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
  try {
    const user = await authenticateUser(email, password);
    if (!user) return new Response(JSON.stringify({ error: "invalid credentials" }), { status: 401 });
    const token = await createJwtForUser(user.id);
    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};

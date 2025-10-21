import { define } from "@/utils.ts";
import { authenticateUser, createJwtForUser } from "@/src/auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const { email, password } = body ?? {};

      const emailStr = typeof email === "string" ? email : undefined;
      const passwordStr = typeof password === "string" ? password : undefined;

      if (!emailStr || !passwordStr) {
        return Response.json({ error: "missing fields" }, { status: 400 });
      }

      const user = await authenticateUser(emailStr, passwordStr);
      if (!user) {
        return Response.json({ error: "invalid credentials" }, { status: 401 });
      }

      const token = await createJwtForUser(user.id);
      return Response.json({ token }, { status: 200 });
    } catch (err) {
      if (err instanceof SyntaxError) {
        return Response.json({ error: "invalid JSON body" }, { status: 400 });
      }
      console.error("login error:", err);
      return Response.json({ error: "internal server error" }, { status: 500 });
    }
  },
});

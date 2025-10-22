import { define } from "@/utils.ts";
import { createJwtForUser, createUser } from "@/src/auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const { email, password } = body ?? {};

      // 类型验证
      const emailStr = typeof email === "string" ? email : undefined;
      const passwordStr = typeof password === "string" ? password : undefined;

      if (!emailStr || !passwordStr) {
        return Response.json({ error: "missing fields" }, { status: 400 });
      }

      // 创建用户
      const user = await createUser(emailStr, passwordStr);
      const token = await createJwtForUser(user.id);

      return Response.json({ token }, { status: 201 });
    } catch (err) {
      if (err instanceof SyntaxError) {
        return Response.json({ error: "invalid JSON body" }, { status: 400 });
      }
      console.error("signup error:", err);
      return Response.json({ error: "internal server error" }, { status: 500 });
    }
  },
});

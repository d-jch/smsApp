import { useState } from "preact/hooks";

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const body = {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Signup failed");
        setLoading(false);
        return;
      }
      // NOTE: storing JWT in localStorage is convenient for client-only demos,
      // but exposes the token to XSS risks. Prefer HttpOnly, Secure cookies
      // for production session tokens. This is intentionally left as an
      // explicit MVP choice and should be migrated later.
      if (json.token) localStorage.setItem("token", json.token);
      const g = globalThis as unknown as { location?: { href?: string } };
      if (g.location) g.location.href = "/";
    } catch (err: unknown) {
      const msg = typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : undefined;
      setError(msg ?? "Network error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} class="space-y-4" id="signup-form">
      <label class="block">
        <span class="label">Email</span>
        <input name="email" type="email" required class="input w-full" />
      </label>
      <label class="block">
        <span class="label">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          class="input w-full"
        />
      </label>
      <div>
        <button class="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing..." : "Sign up"}
        </button>
      </div>
      {error ? <p class="text-error mt-2">{error}</p> : null}
    </form>
  );
}

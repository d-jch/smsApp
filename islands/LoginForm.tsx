import { useState } from "preact/hooks";

export default function LoginForm() {
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login failed");
        setLoading(false);
        return;
      }
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
    <form onSubmit={onSubmit} class="space-y-4" id="login-form">
      <label class="block">
        <span class="label">Email</span>
        <input name="email" type="email" required class="input w-full" />
      </label>
      <label class="block">
        <span class="label">Password</span>
        <input name="password" type="password" required class="input w-full" />
      </label>
      <div>
        <button class="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
      {error ? <p class="text-error mt-2">{error}</p> : null}
    </form>
  );
}

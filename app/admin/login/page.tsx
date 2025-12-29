"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMsg(error.message);
        setLoading(false);
        return;
      }

      // ✅ Redirect back to where user came from (if middleware sent them)
      const redirectedFrom = searchParams.get("redirectedFrom");
      router.push(redirectedFrom || "/admin/prayer-times");
    } catch (err) {
      setMsg("Login failed. Please check your Supabase configuration.");
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Admin Login
      </h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ marginBottom: 6 }}>Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="admin@brookfieldmasjid.org.uk"
            style={{ width: "100%", padding: 10, border: "1px solid #ccc" }}
            required
            autoComplete="email"
          />
        </label>

        <label>
          <div style={{ marginBottom: 6 }}>Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            style={{ width: "100%", padding: 10, border: "1px solid #ccc" }}
            required
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {msg && <p style={{ color: "crimson", marginTop: 8 }}>{msg}</p>}
      </form>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    router.push("/admin/prayer-times");
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
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, fontWeight: 700 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {msg && <p style={{ color: "crimson" }}>{msg}</p>}
      </form>
    </main>
  );
}

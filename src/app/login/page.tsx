"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else if (!data.session) setNotice("Check your email to confirm your account, then sign in.");
      else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        router.push("/");
        router.refresh();
      }
    }
    setBusy(false);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-4">
      <div className="w-full rounded-[28px] bg-card p-7 shadow-[0_30px_60px_-30px_rgba(11,64,52,0.25)]">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lg font-bold text-white">M</div>
        <h1 className="mt-4 text-2xl font-bold">{mode === "signin" ? "Sign in to MarketCap" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-muted">Save stocks to your own private watchlist.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-line bg-field px-3 outline-none focus:border-forest focus-visible:ring-2 focus-visible:ring-forest/30"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-line bg-field px-3 outline-none focus:border-forest focus-visible:ring-2 focus-visible:ring-forest/30"
            />
            {mode === "signup" && <span className="mt-1 block text-xs text-muted">At least 8 characters.</span>}
          </label>

          {error && <p role="alert" className="text-sm text-neg">{error}</p>}
          {notice && <p role="status" className="text-sm text-up">{notice}</p>}

          <button
            disabled={busy}
            className="h-11 w-full rounded-xl bg-forest font-medium text-white transition-colors hover:bg-forest-2 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="font-medium text-forest underline-offset-2 hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
        <p className="mt-3 text-center text-sm"><Link href="/" className="text-muted hover:text-ink">← Back to dashboard</Link></p>
      </div>
    </main>
  );
}

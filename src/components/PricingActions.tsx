"use client";

import Link from "next/link";
import { useState } from "react";

async function go(path: string, setBusy: (b: boolean) => void, setError: (e: string | null) => void) {
  setBusy(true);
  setError(null);
  try {
    const res = await fetch(path, { method: "POST" });
    const body = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !body.url) throw new Error(body.error ?? "Something went wrong");
    window.location.href = body.url;
  } catch (e) {
    setError(e instanceof Error ? e.message : "Something went wrong");
    setBusy(false);
  }
}

const primary = "block h-12 w-full rounded-xl bg-white text-center text-[15px] font-medium leading-[48px] text-forest transition-opacity hover:opacity-90 disabled:opacity-60";

export function ProAction({ signedIn, isPaid }: { signedIn: boolean; isPaid: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {!signedIn ? (
        <Link href="/login" className={primary}>Sign in to subscribe</Link>
      ) : isPaid ? (
        <button disabled={busy} onClick={() => go("/api/stripe/portal", setBusy, setError)} className={primary}>
          {busy ? "Opening…" : "Manage subscription"}
        </button>
      ) : (
        <button disabled={busy} onClick={() => go("/api/stripe/checkout", setBusy, setError)} className={primary}>
          {busy ? "Redirecting to Stripe…" : "Subscribe for $120/month"}
        </button>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-[#ffb4a3]">{error}</p>}
    </div>
  );
}

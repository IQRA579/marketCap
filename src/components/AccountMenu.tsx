"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function AccountMenu({ email, isPaid }: { email: string | null; isPaid: boolean }) {
  const router = useRouter();
  const qc = useQueryClient();

  if (!email) {
    return (
      <Link href="/login" className="rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-white hover:bg-forest-2">
        Sign in
      </Link>
    );
  }

  const signOut = async () => {
    await createClient().auth.signOut();
    qc.clear();
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/pricing"
        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${isPaid ? "bg-forest text-white" : "bg-t-cream text-ink"}`}
        title={isPaid ? "Manage subscription" : "Upgrade"}
      >
        {isPaid ? "Pro" : "Free · Upgrade"}
      </Link>
      <span className="hidden max-w-[160px] truncate text-muted md:inline" title={email}>{email}</span>
      <button onClick={signOut} className="rounded-lg px-2 py-1 text-muted hover:text-ink">Sign out</button>
    </div>
  );
}

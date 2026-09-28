import "server-only";
import { reconcileUser } from "@/lib/subscriptions";
import { createClient } from "@/lib/supabase/server";

export interface Session {
  email: string | null;
  isPaid: boolean;
}

export async function getSession(): Promise<Session> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { email: null, isPaid: false };

  const { data: sub } = await supabase.from("subscriptions").select("status,stripe_customer_id").eq("user_id", data.user.id).maybeSingle();
  let isPaid = sub?.status === "active" || sub?.status === "trialing";
  // Started checkout but not marked paid yet: confirm with Stripe (covers a missing/late webhook).
  if (!isPaid && sub?.stripe_customer_id) isPaid = await reconcileUser(data.user.id);
  return { email: data.user.email ?? null, isPaid };
}

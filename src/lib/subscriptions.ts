import "server-only";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const PAID = ["active", "trialing"];

export async function syncSubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  // current_period_end moved onto subscription items in newer API versions.
  const end = sub.items.data[0]?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end;

  const admin = createAdminClient();
  let userId = sub.metadata?.user_id;
  if (!userId) {
    const { data } = await admin.from("subscriptions").select("user_id").eq("stripe_customer_id", customerId).maybeSingle();
    userId = data?.user_id;
  }
  if (!userId) return;

  await admin.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    status: sub.status,
    current_period_end: end ? new Date(end * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  });
}

// Asks Stripe for the user's real subscription state and stores it. This makes upgrades show up
// even when the webhook isn't running (local dev) or arrives late. Returns true if the user is paid.
export async function reconcileUser(userId: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data: row } = await admin.from("subscriptions").select("stripe_customer_id,status").eq("user_id", userId).maybeSingle();
    if (!row?.stripe_customer_id) return false;

    const { data: subs } = await getStripe().subscriptions.list({ customer: row.stripe_customer_id, status: "all", limit: 10 });
    const best = subs.find((s) => PAID.includes(s.status)) ?? subs[0];
    if (best) await syncSubscription({ ...best, metadata: { ...best.metadata, user_id: userId } });
    return !!best && PAID.includes(best.status);
  } catch {
    return false; // Stripe or DB unreachable: fall back to whatever is stored.
  }
}

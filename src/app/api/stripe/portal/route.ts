import { getStripe, siteUrl } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

// Opens the Stripe billing portal so a subscriber can cancel or update their card.
export async function POST() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return Response.json({ error: "Sign in first" }, { status: 401 });

  // RLS lets users read their own subscription row.
  const { data: row } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", data.user.id).maybeSingle();
  if (!row?.stripe_customer_id) return Response.json({ error: "No billing account yet" }, { status: 404 });

  try {
    const portal = await getStripe().billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: `${siteUrl()}/pricing`,
    });
    return Response.json({ url: portal.url });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Portal failed" }, { status: 500 });
  }
}

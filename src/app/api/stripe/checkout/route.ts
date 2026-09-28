import { getStripe, siteUrl } from "@/lib/stripe";
import { reconcileUser } from "@/lib/subscriptions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return Response.json({ error: "Sign in first" }, { status: 401 });

  try {
    const stripe = getStripe();
    const admin = createAdminClient();

    const { data: row } = await admin.from("subscriptions").select("stripe_customer_id,status").eq("user_id", user.id).maybeSingle();
    // Ask Stripe too, so a user can never pay twice because the DB was behind.
    const alreadyPaid = row?.status === "active" || row?.status === "trialing" || (row?.stripe_customer_id ? await reconcileUser(user.id) : false);
    if (alreadyPaid) {
      return Response.json({ error: "You already have an active subscription" }, { status: 409 });
    }

    let customerId = row?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
      customerId = customer.id;
      await admin.from("subscriptions").upsert({ user_id: user.id, stripe_customer_id: customerId });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: 12000,
                recurring: { interval: "month" },
                product_data: { name: "MarketCap Pro", description: "Unlimited saved stocks" },
              },
            },
      ],
      subscription_data: { metadata: { user_id: user.id } },
      success_url: `${siteUrl()}/pricing?checkout=success`,
      cancel_url: `${siteUrl()}/pricing?checkout=cancelled`,
    });

    return Response.json({ url: session.url });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Checkout failed" }, { status: 500 });
  }
}

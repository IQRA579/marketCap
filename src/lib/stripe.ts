import "server-only";
import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // Safety net: this app is wired for sandbox testing only.
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) {
    throw new Error("Live Stripe keys are blocked. Use a sandbox key (sk_test_...).");
  }
  return new Stripe(key);
}

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

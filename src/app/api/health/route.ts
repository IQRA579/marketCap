// Reports whether required env vars are visible to the running app. Never returns values.
const NAMES = [
  "FINNHUB_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_SITE_URL",
] as const;

export async function GET() {
  const env = Object.fromEntries(
    NAMES.map((n) => {
      const v = process.env[n];
      return [n, v ? { set: true, length: v.length, hasQuotesOrSpaces: /^["'\s]|["'\s]$/.test(v) } : { set: false }];
    }),
  );
  return Response.json({ ok: NAMES.every((n) => !!process.env[n]), env });
}

import Link from "next/link";
import { ProAction } from "@/components/PricingActions";
import { getSession } from "@/lib/session";

export const metadata = { title: "Pricing · MarketCap" };

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
    <path d="M3 8.5l3 3 7-7" />
  </svg>
);

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { checkout } = await searchParams;
  const { email, isPaid } = await getSession();

  return (
    <main className="mx-auto max-w-[900px] p-3 sm:p-8">
      <div className="rounded-[28px] bg-card p-5 shadow-[0_30px_60px_-30px_rgba(11,64,52,0.25)] sm:p-9">
        <Link href="/" className="text-sm text-muted hover:text-ink">← Back to dashboard</Link>
        <h1 className="mt-4 text-3xl font-bold">Pricing</h1>
        <p className="mt-1 text-muted">Start free. Upgrade when you want an unlimited watchlist.</p>

        <p className="mt-4 rounded-xl bg-t-cream px-4 py-2.5 text-sm">
          <strong>Sandbox mode.</strong> This is a test page. Pay with card <code className="font-mono">4242 4242 4242 4242</code>, any future date, any CVC. No real money moves.
        </p>

        {checkout === "success" && (
          <p role="status" className="mt-4 rounded-xl bg-t-mint px-4 py-2.5 text-sm">
            Payment received. {isPaid ? "Your Pro plan is active." : "Your plan will switch to Pro in a few seconds. Refresh if it hasn't."}
          </p>
        )}
        {checkout === "cancelled" && <p role="status" className="mt-4 rounded-xl bg-t-stone px-4 py-2.5 text-sm">Checkout cancelled. You haven&apos;t been charged.</p>}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="flex flex-col rounded-2xl border border-line p-6" aria-labelledby="free">
            <h2 id="free" className="text-lg font-bold">Free</h2>
            <p className="mt-2 text-4xl font-bold">$0<span className="text-base font-normal text-muted"> / month</span></p>
            <ul className="mt-5 flex-1 space-y-3 text-sm">
              <li className="flex gap-2"><Check />Live prices and market news</li>
              <li className="flex gap-2"><Check />Save up to 3 stocks to your watchlist</li>
              <li className="flex gap-2"><Check />Private to your account</li>
            </ul>
            <div className="mt-6">
              {email ? (
                <p className="h-12 rounded-xl border border-line text-center text-[15px] leading-[46px] text-muted">{isPaid ? "Included" : "Your current plan"}</p>
              ) : (
                <Link href="/login" className="block h-12 rounded-xl border border-forest text-center text-[15px] font-medium leading-[46px] text-forest hover:bg-forest/10">Get started free</Link>
              )}
            </div>
          </section>

          <section className="flex flex-col rounded-2xl bg-forest p-6 text-white" aria-labelledby="pro">
            <div className="flex items-center justify-between">
              <h2 id="pro" className="text-lg font-bold">Pro</h2>
              {isPaid && <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs">Current plan</span>}
            </div>
            <p className="mt-2 text-4xl font-bold">$120<span className="text-base font-normal text-white/70"> / month</span></p>
            <ul className="mt-5 flex-1 space-y-3 text-sm">
              <li className="flex gap-2"><Check />Everything in Free</li>
              <li className="flex gap-2"><Check />Unlimited saved stocks</li>
              <li className="flex gap-2"><Check />Cancel any time from the billing portal</li>
            </ul>
            <div className="mt-6"><ProAction signedIn={!!email} isPaid={isPaid} /></div>
          </section>
        </div>
      </div>
    </main>
  );
}

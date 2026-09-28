"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWatchlist, type Entry } from "@/lib/useWatchlist";
import { AccountMenu } from "./AccountMenu";
import { indices, portfolio, watchlist as defaultWatchlist, type Signal, type Stock } from "@/lib/mock";
import { useQuotes } from "@/lib/useQuotes";
import { IndexTiles } from "./IndexTiles";
import { PortfolioPanel } from "./PortfolioPanel";
import { SearchBox, type SearchHit } from "./SearchBox";
import { Logo, Sidebar } from "./Sidebar";
import { StockList } from "./StockList";
import { ThemeToggle } from "./ThemeToggle";

const defaults: Entry[] = defaultWatchlist.map(({ symbol, name }) => ({ symbol, name }));
const signalFor = (pct: number): Signal => (pct > 0.3 ? "BUY" : pct < -0.3 ? "SELL" : "HOLD");

export function Dashboard({ email, isPaid }: { email: string | null; isPaid: boolean }) {
  const router = useRouter();
  const { entries, loading, limitHit, dismissLimit, add: addEntry, remove } = useWatchlist(!!email, defaults);

  const symbols = [...indices.map((i) => i.symbol), ...entries.map((e) => e.symbol)];
  const { quotes, isLive } = useQuotes(symbols);

  const tiles = indices.map((t) => {
    const q = quotes?.[t.symbol];
    return q ? { ...t, price: q.price, up: q.changePct >= 0 } : t;
  });

  const stocks: Stock[] = entries.map((e) => {
    const mock = defaultWatchlist.find((w) => w.symbol === e.symbol);
    const q = quotes?.[e.symbol];
    const range = q ? q.high - q.low : 0;
    return {
      symbol: e.symbol,
      name: e.name,
      price: q?.price ?? mock?.price ?? 0,
      changePct: q?.changePct ?? mock?.changePct ?? 0,
      signal: q ? signalFor(q.changePct) : (mock?.signal ?? "HOLD"),
      momentum: q ? (range > 0 ? Math.round(((q.price - q.low) / range) * 100) : 50) : (mock?.momentum ?? 50),
      series: mock?.series ?? [],
    };
  });

  const add = (h: SearchHit) => {
    if (!email) return router.push("/login");
    addEntry({ symbol: h.symbol, name: h.description });
  };
  const removeStock = (symbol: string) => (email ? remove(symbol) : router.push("/login"));

  return (
    <main className="mx-auto flex min-h-screen max-w-[1180px] items-center p-3 sm:p-8">
      <div className="grid w-full gap-4 rounded-[28px] bg-card p-3 shadow-[0_30px_60px_-30px_rgba(11,64,52,0.25)] sm:p-4 lg:grid-cols-[1fr_minmax(300px,340px)]">
        <div className="min-w-0 p-3 sm:p-5">
          <div className="flex items-start gap-5">
            <Logo />
            <header className="min-w-0">
              <p className="text-sm text-ink/80">Welcome back to</p>
              <h1 className="text-[26px] font-bold leading-tight">MarketCap <span aria-hidden="true">👋</span></h1>
            </header>
            <div className="ml-auto flex flex-col items-end gap-1.5">
              <AccountMenu email={email} isPaid={isPaid} />
              <p className="hidden items-center gap-1.5 whitespace-nowrap text-[11px] text-muted xl:flex" role="status">
                <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-up" : "bg-muted"}`} />
                {isLive ? "Live · 10s" : "Connecting…"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 sm:pl-[60px]">
            <SearchBox onSelect={add} />
            <ThemeToggle />
          </div>

          {limitHit && (
            <div role="alert" className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-t-cream px-4 py-3 text-sm sm:ml-[60px]">
              <span>Free plan is limited to 3 saved stocks. <Link href="/pricing" className="font-medium text-forest underline">Upgrade to Pro</Link> for unlimited.</span>
              <button onClick={dismissLimit} aria-label="Dismiss" className="text-muted hover:text-ink">✕</button>
            </div>
          )}
          {!email && (
            <p className="mt-4 rounded-xl bg-t-stone px-4 py-3 text-sm sm:ml-[60px]">
              You&apos;re viewing a demo watchlist. <Link href="/login" className="font-medium text-forest underline">Sign in</Link> to save your own stocks.
            </p>
          )}

          <div className="mt-4 sm:pl-[60px]">
            <IndexTiles tiles={tiles} />
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="sm:pt-8"><Sidebar /></div>
            <div className="min-w-0 flex-1"><StockList stocks={stocks} onRemove={removeStock} loading={loading} /></div>
          </div>
        </div>

        <PortfolioPanel {...portfolio} />
      </div>
    </main>
  );
}

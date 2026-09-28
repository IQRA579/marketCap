import type { Holding } from "@/lib/mock";
import { Sparkline } from "./Sparkline";

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

const cardTone = {
  sand: { bg: "bg-t-cream", line: "#e0c65a" },
  mint: { bg: "bg-t-mint", line: "#3fae7a" },
  sky: { bg: "bg-t-blue", line: "#6a7fd1" },
};

export function PortfolioPanel({ total, gain, loss, holdings }: { total: number; gain: number; loss: number; holdings: Holding[] }) {
  return (
    <aside aria-label="My portfolio" className="flex min-w-0 flex-col rounded-[28px] bg-forest p-5 text-white sm:p-6">
      <p className="mt-2 text-center text-[15px] text-white/80">My portfolio</p>
      <p className="mt-2 text-center text-[40px] font-bold leading-none tabular-nums">{usd(total)}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
          <p className="text-xs text-white/70">Gain</p>
          <p className="mt-1 text-[17px] font-bold tabular-nums"><span className="mr-1 text-[9px] text-up">▲</span>{usd(gain)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
          <p className="text-xs text-white/70">Loss</p>
          <p className="mt-1 text-[17px] font-bold tabular-nums"><span className="mr-1 text-[9px] text-down">▼</span>{usd(loss)}</p>
        </div>
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-lg font-bold">Holdings</h2>
        <button className="text-xs text-white/70 hover:text-white">View all</button>
      </div>

      <div className="scroll-x -mr-5 mt-3 flex gap-3 overflow-x-auto pr-5 sm:-mr-6 sm:pr-6">
        {holdings.map((h) => {
          const t = cardTone[h.tone];
          return (
            <article key={h.symbol} className={`min-w-[190px] flex-1 rounded-2xl p-4 text-ink ${t.bg}`}>
              <div className="flex items-start justify-between">
                <h3 className="text-[22px] font-bold leading-none">{h.symbol}</h3>
                <span className="rounded-md bg-card/70 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">+ {h.changePct.toFixed(2)}%</span>
              </div>
              <p className="mt-1 text-xs text-ink/70">{h.name}</p>
              <div className="my-3"><Sparkline data={h.series} color={t.line} width={150} height={34} /></div>
              <p className="text-[22px] font-bold tabular-nums">{usd(h.value)}</p>
              <p className="text-[10px] text-ink/60">{h.share}% of your portfolio</p>
            </article>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <button className="w-full rounded-xl border border-white/40 py-3.5 text-[15px] font-medium transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">
          Add holding
        </button>
        <p className="mt-3 text-center text-xs text-white/70">Prices may be delayed · Not investment advice</p>
      </div>
    </aside>
  );
}

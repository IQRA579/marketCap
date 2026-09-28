import type { IndexTile } from "@/lib/mock";

const tones = {
  cream: "bg-t-cream",
  rose: "bg-t-rose",
  blue: "bg-t-blue",
  stone: "bg-t-stone",
};

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function IndexTiles({ tiles }: { tiles: IndexTile[] }) {
  return (
    <div className="scroll-x -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
      {tiles.map((t) => (
        <div key={t.symbol} className={`min-w-[150px] rounded-2xl px-4 py-3.5 ${tones[t.tone]}`}>
          <p className="text-[11px] text-ink/60">{t.symbol} · {t.label}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="text-[15px] font-bold tabular-nums">{fmt(t.price)}</p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-label={t.up ? "Up" : "Down"} className={t.up ? "" : "rotate-90"}>
              <path d="M7 17L17 7M8 7h9v9" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

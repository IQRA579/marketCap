"use client";

import { useState } from "react";
import type { Stock } from "@/lib/mock";
import { Sparkline } from "./Sparkline";

const tabs = ["Watchlist", "Movers"] as const;
const ranges = ["Day", "Week", "Month", "Year"];
const types = ["All types", "Stocks", "ETFs"];

const signalDot = { BUY: "bg-up", SELL: "bg-down", HOLD: "bg-muted" } as const;

function Select({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-line bg-field py-2 pl-3.5 pr-8 text-xs text-ink outline-none focus-visible:ring-2 focus-visible:ring-forest/40 sm:w-32"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3.5l3 3 3-3" />
      </svg>
    </label>
  );
}

export function StockList({ stocks, onRemove, loading = false }: { stocks: Stock[]; onRemove: (symbol: string) => void; loading?: boolean }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Watchlist");
  const [range, setRange] = useState("Month");
  const [type, setType] = useState("All types");

  const rows = tab === "Movers" ? [...stocks].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)) : stocks;

  return (
    <section aria-label="Stocks">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div role="tablist" className="flex gap-6">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`border-b-2 pb-1.5 text-[17px] transition-colors ${
                tab === t ? "border-forest font-medium text-forest" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Select label="Range" options={ranges} value={range} onChange={setRange} />
          <Select label="Type" options={types} value={type} onChange={setType} />
        </div>
      </div>

      {loading && <p className="py-10 text-center text-sm text-muted">Loading your watchlist…</p>}
      {!loading && rows.length === 0 && <p className="py-10 text-center text-sm text-muted">Your watchlist is empty. Use the search box to add a stock.</p>}
      <ul className="mt-2">
        {rows.map((s) => {
          const up = s.changePct >= 0;
          const color = up ? "#2e9e5b" : "#e0a93b";
          return (
            <li key={s.symbol} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 border-b border-line py-4 sm:grid-cols-[64px_130px_1fr_150px_24px] lg:gap-x-6">
              <span className="flex items-center gap-2 text-[11px] font-bold tracking-wide">
                <span className={`h-2 w-2 rounded-full ${signalDot[s.signal]}`} />
                {s.signal}
              </span>
              <div className="hidden sm:block">
                {s.series.length > 1 && <Sparkline data={s.series} color={color} width={110} height={40} />}
              </div>
              <div className="min-w-0">
                <p className="text-[17px] font-bold leading-tight">
                  {s.symbol} <span className="text-[10px] font-normal text-muted">/USD</span>
                </p>
                <p className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-[19px] font-bold tabular-nums">${s.price.toFixed(2)}</span>
                  <span className={`text-[11px] font-medium tabular-nums ${up ? "text-up" : "text-ink"}`}>
                    {up ? "+" : "−"}{Math.abs(s.changePct).toFixed(2)}%
                  </span>
                </p>
              </div>
              <div className="hidden sm:block">
                {s.name && <p className="truncate text-xs text-muted">{s.name}</p>}
                <div className="mt-1 flex justify-between text-[11px]">
                  <span className="text-ink/70">Day range</span>
                  <span className="font-bold tabular-nums">{s.momentum}%</span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-line">
                  <div className="h-1 rounded-full bg-muted/60" style={{ width: `${s.momentum}%` }} />
                </div>
              </div>
              <button
                onClick={() => onRemove(s.symbol)}
                aria-label={`Remove ${s.symbol} from watchlist`}
                title="Remove"
                className="grid h-8 w-6 place-items-center text-muted transition-colors hover:text-neg"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l8 8M10 2l-8 8" /></svg>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

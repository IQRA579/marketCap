"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface SearchHit {
  symbol: string;
  description: string;
}

export function SearchBox({ onSelect }: { onSelect: (hit: SearchHit) => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const term = q.trim();
    if (!term) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setStatus("loading");
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error();
        const { results } = (await res.json()) as { results: SearchHit[] };
        setHits(results);
        setActive(0);
        setStatus("idle");
      } catch (e) {
        if ((e as Error).name !== "AbortError") setStatus("error");
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (h: SearchHit) => {
    onSelect(h);
    setQ("");
    setHits([]);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && hits[active]) {
      e.preventDefault();
      pick(hits[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const term = q.trim();
  const showList = open && term.length > 0;

  return (
    <div ref={box} className="relative min-w-0 flex-1">
      <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-label="Search stocks"
        placeholder="Search stocks, e.g. Apple or TSLA"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          if (!e.target.value.trim()) setHits([]);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        className="h-10 w-full rounded-xl border border-line bg-field pl-10 pr-3 text-sm text-ink outline-none placeholder:text-muted focus:border-forest focus-visible:ring-2 focus-visible:ring-forest/30"
      />
      {showList && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-12 z-20 max-h-72 overflow-auto rounded-xl border border-line bg-card py-1 shadow-xl">
          {status === "error" ? (
            <li className="px-4 py-3 text-sm text-neg">Search is unavailable right now.</li>
          ) : hits.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">{status === "loading" ? "Searching…" : "No matches"}</li>
          ) : (
            hits.map((h, i) => (
              <li key={h.symbol} role="option" aria-selected={i === active}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(h)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm ${i === active ? "bg-forest/10" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="font-bold">{h.symbol}</span>
                    <span className="ml-2 truncate text-muted">{h.description}</span>
                  </span>
                  <span className="shrink-0 text-xs text-forest">+ Add</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

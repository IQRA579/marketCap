const items = [
  { label: "Dashboard", d: "M5 20V10M12 20V4M19 20v-7", active: true },
  { label: "Watchlist", d: "M4 8h13a3 3 0 013 3v7H7a3 3 0 01-3-3V8zM8 5h11" },
  { label: "Portfolio", d: "M12 3v9h9A9 9 0 1112 3z" },
  { label: "News", d: "M7 7h10M7 12h10M7 17h6M4 4h16v16H4z" },
  { label: "Settings", d: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 00-2-1.2L14 3h-4l-.6 2.7a7 7 0 00-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 000 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 002 1.2L10 21h4l.6-2.7a7 7 0 002-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" },
];

export function Logo() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lg font-bold text-white" aria-label="MarketCap">
      M
    </div>
  );
}

export function Sidebar() {
  return (
    <nav aria-label="Main" className="flex gap-2 sm:flex-col sm:gap-5">
      {items.map((it) => (
        <button
          key={it.label}
          title={it.label}
          aria-label={it.label}
          aria-current={it.active ? "page" : undefined}
          className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${
            it.active ? "bg-forest/10 text-forest" : "text-muted hover:text-forest"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d={it.d} />
          </svg>
        </button>
      ))}
    </nav>
  );
}

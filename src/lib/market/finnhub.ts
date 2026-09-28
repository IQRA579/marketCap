import "server-only";

const BASE = "https://finnhub.io/api/v1";

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  time: number;
}

export interface SearchHit {
  symbol: string;
  description: string;
  type: string;
}

export interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
}

// In-memory TTL cache keeps us under the free-tier limit (~60 calls/min).
const cache = new Map<string, { at: number; ttl: number; value: unknown }>();

async function get<T>(path: string, params: Record<string, string>, ttlMs: number): Promise<T> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not set");

  const qs = new URLSearchParams(params).toString();
  const cacheKey = `${path}?${qs}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < hit.ttl) return hit.value as T;

  const res = await fetch(`${BASE}${path}?${qs}`, {
    headers: { "X-Finnhub-Token": key },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Finnhub ${path} failed: ${res.status}`);
  const value = (await res.json()) as T;
  cache.set(cacheKey, { at: Date.now(), ttl: ttlMs, value });
  return value;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const q = await get<{ c: number; d: number | null; dp: number | null; h: number; l: number; o: number; pc: number; t: number }>(
    "/quote",
    { symbol },
    8_000,
  );
  return {
    symbol,
    price: q.c,
    change: q.d ?? 0,
    changePct: q.dp ?? 0,
    high: q.h,
    low: q.l,
    open: q.o,
    prevClose: q.pc,
    time: q.t,
  };
}

export async function searchSymbols(query: string): Promise<SearchHit[]> {
  const r = await get<{ result: SearchHit[] }>("/search", { q: query }, 60_000);
  return r.result
    .filter((h) => (h.type === "Common Stock" || h.type === "ETP") && !h.symbol.includes("."))
    .slice(0, 8);
}

export async function getMarketNews(): Promise<NewsItem[]> {
  const r = await get<NewsItem[]>("/news", { category: "general" }, 300_000);
  return r.slice(0, 20);
}

export async function getCompanyNews(symbol: string): Promise<NewsItem[]> {
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 86_400_000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const r = await get<NewsItem[]>("/company-news", { symbol, from: iso(from), to: iso(to) }, 300_000);
  return r.slice(0, 20);
}

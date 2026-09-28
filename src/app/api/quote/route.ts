import { getQuote } from "@/lib/market/finnhub";

const SYMBOL = /^[A-Z][A-Z0-9.-]{0,9}$/;

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("symbols") ?? "";
  const symbols = [...new Set(raw.toUpperCase().split(",").map((s) => s.trim()))].filter((s) => SYMBOL.test(s)).slice(0, 25);
  if (symbols.length === 0) return Response.json({ error: "symbols required" }, { status: 400 });

  const results = await Promise.allSettled(symbols.map(getQuote));
  const quotes = results.flatMap((r) => (r.status === "fulfilled" && r.value.price > 0 ? [r.value] : []));
  return Response.json({ quotes });
}

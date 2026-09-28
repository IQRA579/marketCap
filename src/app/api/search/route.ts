import { searchSymbols } from "@/lib/market/finnhub";

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 40);
  if (q.length < 1) return Response.json({ results: [] });
  try {
    return Response.json({ results: await searchSymbols(q) });
  } catch {
    return Response.json({ error: "search unavailable" }, { status: 502 });
  }
}

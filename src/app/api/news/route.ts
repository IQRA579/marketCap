import { getCompanyNews, getMarketNews } from "@/lib/market/finnhub";

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol")?.toUpperCase();
  try {
    const news = symbol && /^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol) ? await getCompanyNews(symbol) : await getMarketNews();
    return Response.json({ news });
  } catch {
    return Response.json({ error: "news unavailable" }, { status: 502 });
  }
}

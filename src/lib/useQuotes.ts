"use client";

import { useQuery } from "@tanstack/react-query";

export interface LiveQuote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
}

// Polls /api/quote; falls back to undefined so callers can keep showing placeholder data.
export function useQuotes(symbols: string[]) {
  const key = [...symbols].sort().join(",");
  const query = useQuery({
    queryKey: ["quotes", key],
    queryFn: async () => {
      const res = await fetch(`/api/quote?symbols=${key}`);
      if (!res.ok) throw new Error("quote request failed");
      const { quotes } = (await res.json()) as { quotes: LiveQuote[] };
      return Object.fromEntries(quotes.map((q) => [q.symbol, q]));
    },
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });
  return { quotes: query.data as Record<string, LiveQuote> | undefined, isLive: query.isSuccess };
}

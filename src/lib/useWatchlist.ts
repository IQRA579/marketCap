"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Entry {
  symbol: string;
  name: string;
}

const KEY = ["watchlist"];

// Signed-in users: rows live in Supabase, and RLS returns only their own.
// Guests: a read-only demo list (`guestList`).
export function useWatchlist(signedIn: boolean, guestList: Entry[]) {
  const qc = useQueryClient();
  const [limitHit, setLimitHit] = useState(false);

  const list = useQuery({
    queryKey: KEY,
    enabled: signedIn,
    queryFn: async () => {
      const { data, error } = await createClient().from("watchlist").select("symbol,name").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Entry[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (e: Entry) => {
      const { error } = await createClient().from("watchlist").insert({ symbol: e.symbol, name: e.name });
      // 23505 = already saved; treat as success.
      if (error && error.code !== "23505") throw error;
    },
    onSuccess: () => {
      setLimitHit(false);
      return qc.invalidateQueries({ queryKey: KEY });
    },
    onError: (err) => {
      if (String(err.message).includes("FREE_PLAN_LIMIT")) setLimitHit(true);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const { error } = await createClient().from("watchlist").delete().eq("symbol", symbol);
      if (error) throw error;
    },
    onSuccess: () => {
      setLimitHit(false);
      return qc.invalidateQueries({ queryKey: KEY });
    },
  });

  return {
    entries: signedIn ? (list.data ?? []) : guestList,
    loading: signedIn && list.isLoading,
    limitHit,
    dismissLimit: () => setLimitHit(false),
    add: (e: Entry) => addMutation.mutate(e),
    remove: (symbol: string) => removeMutation.mutate(symbol),
  };
}

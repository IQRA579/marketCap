// Temporary mock data; replaced by the market-data API in Phase 2.
export type Signal = "BUY" | "SELL" | "HOLD";

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  signal: Signal;
  momentum: number; // 0-100 bar shown in the list
  series: number[];
}

export interface Holding {
  symbol: string;
  name: string;
  value: number;
  changePct: number;
  share: number; // % of portfolio
  series: number[];
  tone: "sand" | "mint" | "sky";
}

export interface IndexTile {
  symbol: string;
  label: string;
  price: number;
  up: boolean;
  tone: "cream" | "rose" | "blue" | "stone";
}

export const indices: IndexTile[] = [
  { symbol: "SPY", label: "S&P 500", price: 5842.47, up: true, tone: "cream" },
  { symbol: "QQQ", label: "Nasdaq 100", price: 20214.9, up: false, tone: "rose" },
  { symbol: "DIA", label: "Dow Jones", price: 43128.76, up: true, tone: "blue" },
  { symbol: "IWM", label: "Russell 2000", price: 2261.05, up: false, tone: "stone" },
];

export const watchlist: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 227.52, changePct: 0.26, signal: "BUY", momentum: 95, series: [12, 14, 13, 16, 13, 12, 15, 17, 16, 19, 18, 21] },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 138.07, changePct: 0.95, signal: "BUY", momentum: 56, series: [10, 12, 11, 15, 13, 14, 12, 16, 15, 18, 17, 20] },
  { symbol: "TSLA", name: "Tesla Inc.", price: 241.05, changePct: -2.17, signal: "SELL", momentum: 92, series: [20, 18, 19, 16, 17, 14, 15, 12, 13, 11, 12, 10] },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 418.3, changePct: 0.22, signal: "BUY", momentum: 83, series: [11, 13, 12, 14, 12, 13, 15, 14, 16, 15, 17, 18] },
  { symbol: "AMZN", name: "Amazon.com", price: 186.4, changePct: -0.41, signal: "HOLD", momentum: 61, series: [14, 15, 13, 14, 12, 13, 12, 14, 13, 12, 13, 12] },
];

export const portfolio = {
  total: 128257,
  gain: 12678,
  loss: 4123,
  holdings: [
    { symbol: "AAPL", name: "Apple to USD", value: 19479, changePct: 0.26, share: 20, series: [12, 14, 13, 16, 13, 12, 15, 17, 16, 19], tone: "sand" },
    { symbol: "NVDA", name: "NVIDIA to USD", value: 8567, changePct: 0.95, share: 10, series: [10, 12, 11, 15, 13, 14, 12, 16, 15, 18], tone: "mint" },
    { symbol: "MSFT", name: "Microsoft to USD", value: 6240, changePct: 0.22, share: 8, series: [11, 13, 12, 14, 12, 13, 15, 14, 16, 15], tone: "sky" },
  ] as Holding[],
};

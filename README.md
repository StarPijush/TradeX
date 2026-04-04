# TradeX — Virtual Trading Simulator

A production-ready Phase 1 MVP of a virtual trading simulator with a premium dark UI inspired by TradingView.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (utility-first styling)
- **Zustand** (global state with persistence)
- **Mock data** (no real APIs)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/app
  /(auth)/login         → Login page
  /(main)/              → Home (Watchlist + Trade Panel)
  /(main)/menu          → Menu page
  /(main)/settings      → Settings page
  /(main)/chart/[symbol]→ Chart page

/components
  /layout               → Navbar, BottomNav, PageContainer
  /trading              → AssetCard, TradePanel, BalanceCard, PositionCard
  /menu                 → ProfileBox, WalletCard, MenuList
  /ui                   → Button, Card, Badge, Toaster

/lib
  /data                 → mockData.ts
  /trading              → engine.ts, usePriceSimulation.ts
  /utils                → format.ts

/store                  → useTradingStore.ts (Zustand)
/types                  → trading.ts
```

## Features

- 📊 **Live Watchlist** — 8 assets across Equity, Crypto, Index & Commodity with simulated price updates every 2s
- ⚡ **Quick Trade** — Buy/Sell with quantity input, balance validation, position averaging
- 📦 **Open Positions** — Real-time P&L, current market value, sell all button
- 📈 **Chart Page** — Live SVG candlestick-style chart with OHLC and technical indicator placeholders
- 💰 **Balance Card** — Available cash, invested amount, total P&L
- 🎯 **Menu Page** — Profile, wallet breakdown, rewards UI, navigation
- ⚙️ **Settings** — Theme toggle, notification toggles, account reset
- 💾 **Persistence** — Portfolio saved to localStorage via Zustand persist

## Design System

| Token       | Value     |
|-------------|-----------|
| Background  | `#0B0F14` |
| Card        | `#121821` |
| Border      | `#1E2633` |
| Accent      | `#3B82F6` |
| Profit      | `#22C55E` |
| Loss        | `#EF4444` |

## Notes

- This is a **virtual simulator** — no real money or APIs involved
- Prices are simulated with random drift every 2 seconds
- Default starting balance: ₹1,00,000

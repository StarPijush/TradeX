import { useMemo, useEffect } from "react";
import { Asset } from "@/types/trading";
import { MOCK_ASSETS } from "@/lib/data/symbols";
import { useTradingStore } from "@/store/useTradingStore";
import { useMarketStore } from "@/store/useMarketStore";

/**
 * usePriceSimulation
 * Simplified consumer of the Global Market Engine.
 * Ensures the engine is initialized and returns the active asset list.
 */
export function usePriceSimulation(): Asset[] {
  const prices = useMarketStore((s) => s.prices);
  const isInitialized = useMarketStore((s) => s.isInitialized);
  const init = useMarketStore((s) => s.init);

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [isInitialized, init]);

  const assets = useMemo(() => {
    return MOCK_ASSETS.map((asset) => {
      const currentPrice = prices[asset.symbol] || asset.price;
      const initialPrice = MOCK_ASSETS.find((a) => a.symbol === asset.symbol)!.price;
      const priceChange = currentPrice - initialPrice;
      
      return {
        ...asset,
        price: currentPrice,
        priceChange: parseFloat(priceChange.toFixed(2)),
        priceChangePercent: parseFloat(
          ((priceChange / initialPrice) * 100).toFixed(2)
        ),
      };
    });
  }, [prices]);

  return assets;
}

import { useState, useEffect } from "react";
import { Asset } from "@/types/trading";
import { MOCK_ASSETS } from "@/lib/data/symbols";

export function usePriceSimulation(): Asset[] {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          // Simulate smaller, more frequent random price movements
          const changePercent = (Math.random() - 0.5) * 0.15; // ±0.075% per tick
          const priceChange = (asset.price * changePercent) / 100;
          const newPrice = Math.max(asset.price + priceChange, 0.01);

          return {
            ...asset,
            price: parseFloat(newPrice.toFixed(2)),
            priceChange: parseFloat((asset.priceChange + priceChange).toFixed(2)),
            priceChangePercent: parseFloat(((newPrice - MOCK_ASSETS.find(a => a.symbol === asset.symbol)!.price) / MOCK_ASSETS.find(a => a.symbol === asset.symbol)!.price * 100).toFixed(2)),
          };
        })
      );
    }, 1000); // Update every 1 second (faster ticks)

    return () => clearInterval(interval);
  }, []);

  return assets;
}

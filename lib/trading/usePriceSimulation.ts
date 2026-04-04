import { useState, useEffect } from "react";
import { Asset } from "@/types/trading";
import { MOCK_ASSETS } from "@/lib/data/symbols";

export function usePriceSimulation(): Asset[] {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          // Simulate random price movements
          const changePercent = (Math.random() - 0.5) * 2; // -1 to 1
          const priceChange = (asset.price * changePercent) / 100;
          const newPrice = Math.max(asset.price + priceChange, 0.01);

          return {
            ...asset,
            price: parseFloat(newPrice.toFixed(2)),
            priceChange: parseFloat(priceChange.toFixed(2)),
            priceChangePercent: parseFloat(changePercent.toFixed(2)),
          };
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return assets;
}

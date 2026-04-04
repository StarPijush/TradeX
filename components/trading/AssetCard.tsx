import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Asset } from "@/types/trading";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { useEffect, useState, useRef } from "react";
import { useTradingStore } from "@/store/useTradingStore";
import { Star } from "lucide-react";

interface AssetCardProps {
  asset: Asset;
  selected: boolean;
  onSelect: (asset: Asset) => void;
}

export default function AssetCard({ asset, selected, onSelect }: AssetCardProps) {
  const router = useRouter();
  const pos = asset.priceChangePercent >= 0;
  const { favorites, toggleFavorite } = useTradingStore();
  const isFavorite = favorites.includes(asset.symbol);
  
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const prevPrice = useRef(asset.price);

  useEffect(() => {
    if (asset.price > prevPrice.current) {
      setFlash("up");
    } else if (asset.price < prevPrice.current) {
      setFlash("down");
    }
    prevPrice.current = asset.price;

    const timer = setTimeout(() => setFlash(null), 300);
    return () => clearTimeout(timer);
  }, [asset.price]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipples((prev) => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);

    onSelect(asset);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -1, backgroundColor: "rgba(88, 166, 255, 0.04)" }}
      whileTap={{ scale: 0.99 }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 12px",
        cursor: "pointer",
        borderBottom: "1px solid #1E2633",
        background: selected ? "rgba(88, 166, 255, 0.1)" : "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              margin: -50,
              borderRadius: "50%",
              background: "rgba(88, 166, 255, 0.2)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}
      </AnimatePresence>

      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", alignItems: "center" }}>
        {/* Star Icon for Favorite */}
        <motion.button 
          whileTap={{ scale: 1.4 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(asset.symbol);
          }}
          style={{
            background: "none",
            border: "none",
            padding: "0 8px 0 0",
            cursor: "pointer",
            color: isFavorite ? "#FFD700" : "#8B949E",
            display: "flex",
            alignItems: "center",
            opacity: isFavorite ? 1 : 0.4,
          }}
          className="hover:opacity-100 transition-opacity"
        >
          <Star size={14} fill={isFavorite ? "#FFD700" : "none"} />
        </motion.button>

        {/* Symbol + Name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#E6EDF3", fontWeight: 700, fontSize: 13, letterSpacing: "-0.2px" }}>
            {asset.symbol}
          </div>
          <div style={{ color: "#8B949E", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {asset.name}
          </div>
        </div>

        {/* Price */}
        <div style={{ textAlign: "right", marginRight: 16, minWidth: 80 }}>
          <motion.div 
            animate={flash ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.2 }}
            style={{ 
              color: flash === "up" ? "#22C55E" : (flash === "down" ? "#EF4444" : "#E6EDF3"), 
              fontWeight: 800, 
              fontSize: 13,
              transition: "color 0.3s ease"
            }}
          >
            {formatCurrency(asset.price, true)}
          </motion.div>
        </div>

        {/* % Change */}
        <div
          style={{
            color: pos ? "#22C55E" : "#EF4444",
            fontWeight: 700,
            fontSize: 11,
            minWidth: 64,
            padding: "2px 4px",
            background: pos ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
            borderRadius: "2px",
            textAlign: "right",
          }}
        >
          {formatPercent(asset.priceChangePercent)}
        </div>
      </div>
    </motion.div>
  );
}

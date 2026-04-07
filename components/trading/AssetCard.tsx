import { memo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Asset } from "@/types/trading";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { useTradingStore } from "@/store/useTradingStore";
import { Star } from "lucide-react";
import AnimateNumber from "@/components/ui/AnimateNumber";

interface AssetCardProps {
  asset: Asset;
  selected: boolean;
  onSelect: (asset: Asset) => void;
}

const AssetCard = memo(function AssetCard({ asset, selected, onSelect }: AssetCardProps) {
  const isPositive = asset.priceChangePercent >= 0;
  const { favorites, toggleFavorite } = useTradingStore();
  const isFavorite = favorites.includes(asset.symbol);

  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef(asset.price);

  useEffect(() => {
    if (asset.price > prevPrice.current) setFlash("up");
    else if (asset.price < prevPrice.current) setFlash("down");
    prevPrice.current = asset.price;
    const t = setTimeout(() => setFlash(null), 300);
    return () => clearTimeout(t);
  }, [asset.price]);

  return (
    <motion.div
      onClick={() => onSelect(asset)}
      whileHover={{ backgroundColor: "rgba(88, 166, 255, 0.04)" }}
      whileTap={{ scale: 0.99 }}
      style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr auto auto",
        alignItems: "center",
        gap: 10,
        padding: "13px 16px",
        cursor: "pointer",
        background: selected ? "rgba(88,166,255,0.08)" : "transparent",
        transition: "background 0.15s",
        position: "relative",
      }}
    >
      {/* Favorite star */}
      <motion.button
        whileTap={{ scale: 1.4 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(asset.symbol);
        }}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: isFavorite ? "var(--gold)" : "var(--text-dim)",
          display: "flex",
          alignItems: "center",
          opacity: isFavorite ? 1 : 0.5,
          transition: "all 0.15s",
        }}
      >
        <Star size={13} fill={isFavorite ? "var(--gold)" : "none"} strokeWidth={1.5} />
      </motion.button>

      {/* Symbol + name */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.2px",
            whiteSpace: "nowrap",
          }}
        >
          {asset.symbol}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 1,
          }}
        >
          {asset.name}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", minWidth: 90 }}>
        <AnimateNumber
          value={asset.price}
          format={(v) => formatCurrency(v, true)}
          flashColor={true}
          style={{
            fontWeight: 800,
            fontSize: 14,
            fontVariantNumeric: "tabular-nums",
            color:
              flash === "up"
                ? "var(--green)"
                : flash === "down"
                ? "var(--red)"
                : "var(--text)",
            transition: "color 0.2s",
          }}
        />
      </div>

      {/* % change badge */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          padding: "3px 8px",
          borderRadius: 6,
          background: isPositive
            ? "rgba(34,197,94,0.1)"
            : "rgba(239,68,68,0.1)",
          color: isPositive ? "var(--green-bright)" : "var(--red-bright)",
          border: `1px solid ${isPositive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          fontVariantNumeric: "tabular-nums",
          minWidth: 62,
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        {formatPercent(asset.priceChangePercent)}
      </div>
    </motion.div>
  );
});

export default AssetCard;

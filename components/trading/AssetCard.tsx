"use client";

import { useRouter } from "next/navigation";
import { Asset } from "@/types/trading";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

interface AssetCardProps {
  asset: Asset;
  selected: boolean;
  onSelect: (asset: Asset) => void;
}

export default function AssetCard({ asset, selected, onSelect }: AssetCardProps) {
  const router = useRouter();
  const pos = asset.priceChangePercent >= 0;

  return (
    <div
      onClick={() => onSelect(asset)}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 12px",
        cursor: "pointer",
        borderBottom: "1px solid var(--border)",
        background: selected ? "rgba(88, 166, 255, 0.06)" : "transparent",
      }}
      onMouseOver={(e) => {
        if (!selected) {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }
      }}
      onMouseOut={(e) => {
        if (!selected) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {/* Symbol + Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>
          {asset.symbol}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {asset.name}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", marginRight: 12, minWidth: 80 }}>
        <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>
          {formatCurrency(asset.price, true)}
        </div>
      </div>

      {/* % Change */}
      <div
        style={{
          color: pos ? "var(--green)" : "var(--red)",
          fontWeight: 600,
          fontSize: 12,
          minWidth: 64,
          textAlign: "right",
        }}
      >
        {formatPercent(asset.priceChangePercent)}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { MOCK_ASSETS } from "@/lib/data/symbols";

interface SymbolSearchModalProps {
  onClose: () => void;
}

const CATEGORIES = ["All", "Stocks", "Crypto", "Forex", "Indices"];

export default function SymbolSearchModal({ onClose }: SymbolSearchModalProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = MOCK_ASSETS.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
      asset.name.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "All") return matchesSearch;
    if (filter === "Stocks" && asset.category === "Equity") return matchesSearch;
    if (filter === "Crypto" && asset.category === "Crypto") return matchesSearch;
    if (filter === "Indices" && asset.category === "Index") return matchesSearch;
    return matchesSearch && asset.category === filter;
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 100,
        paddingTop: 80,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#161B22",
          width: "100%",
          maxWidth: 600,
          borderRadius: 8,
          border: "1px solid #2A2F36",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ padding: 16, borderBottom: "1px solid #2A2F36" }}>
          <input
            autoFocus
            type="text"
            placeholder="Search symbols"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              color: "#E6EDF3",
              fontSize: 18,
              outline: "none",
            }}
          />
        </div>

        {/* Filter Chips */}
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            gap: 8,
            borderBottom: "1px solid #2A2F36",
            overflowX: "auto",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "6px 12px",
                borderRadius: 16,
                border: "1px solid #2A2F36",
                background: filter === cat ? "#58A6FF" : "transparent",
                color: filter === cat ? "#fff" : "#8B949E",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#8B949E" }}>
              No matches found
            </div>
          ) : (
            filtered.map((asset) => (
              <div
                key={asset.id}
                style={{
                  padding: "10px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#1F242C")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <div style={{ color: "#E6EDF3", fontWeight: 600, fontSize: 14 }}>
                    {asset.symbol}
                  </div>
                  <div style={{ color: "#8B949E", fontSize: 12 }}>
                    {asset.name}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#8B949E", fontSize: 11, fontWeight: 500 }}>
                    {asset.category.toUpperCase()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

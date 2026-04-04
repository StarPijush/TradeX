"use client";

import { useRouter } from "next/navigation";

const ITEMS = [
  { icon: "ℹ️", label: "About Us", sub: "Learn about TradeX", path: null },
  { icon: "❓", label: "Help & Support", sub: "FAQs and guides", path: null },
  { icon: "⚙️", label: "Settings", sub: "Theme, notifications", path: "/settings" },
  { icon: "📋", label: "Terms & Privacy", sub: "Legal information", path: null },
  { icon: "📱", label: "App Version", sub: "v1.0.0", path: null },
];

export default function MenuList() {
  const router = useRouter();

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      {ITEMS.map((item, i) => (
        <button
          key={item.label}
          onClick={() => item.path && router.push(item.path)}
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "none",
            border: "none",
            cursor: item.path ? "pointer" : "default",
            borderBottom: i < ITEMS.length - 1 ? "1px solid var(--border)" : "none",
            display: "flex",
            alignItems: "center",
            gap: 12,
            textAlign: "left",
          }}
          onMouseOver={(e) => {
            if (item.path) {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>
            {item.icon}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "var(--text)", fontWeight: 500, fontSize: 13, marginBottom: 1 }}>
              {item.label}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{item.sub}</div>
          </div>
          {item.path && (
            <span style={{ color: "var(--text-dim)", fontSize: 14 }}>›</span>
          )}
        </button>
      ))}
    </div>
  );
}

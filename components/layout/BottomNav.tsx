"use client";

import { useRouter } from "next/navigation";

const TABS = [
  { id: "/simulator", icon: "📊", label: "Simulator" },
  { id: "/chart/AAPL", icon: "📈", label: "Chart" },
  { id: "/menu", icon: "☰", label: "Menu" },
  { id: "/settings", icon: "⚙", label: "Settings" },
];

export default function BottomNav({ currentPath }: { currentPath: string }) {
  const router = useRouter();

  const isActive = (id: string) => {
    if (id === "/") return currentPath === "/";
    return currentPath.startsWith(id.split("/")[1] ? `/${id.split("/")[1]}` : id);
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        zIndex: 100,
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.id);
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.id)}
            style={{
              flex: 1,
              padding: "8px 4px 6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: active ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                style={{
                  width: 16,
                  height: 2,
                  borderRadius: 1,
                  background: "var(--accent)",
                  marginTop: 1,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

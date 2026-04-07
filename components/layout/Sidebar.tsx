"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, PieChart, History, BarChart2, Settings } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

const navItems = [
  { label: "Simulator", icon: TrendingUp, path: "/simulator" },
  { label: "Portfolio", icon: PieChart, path: "/portfolio" },
  { label: "Analytics", icon: BarChart2, path: "/analytics" },
  { label: "History", icon: History, path: "/history" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "linear-gradient(180deg, #0b0f14 0%, #0d1117 100%)",
        borderRight: "1px solid var(--border)",
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "none",
        flexDirection: "column",
        zIndex: 50,
        flexShrink: 0,
        overflowY: "auto",
      }}
      className="md:flex"
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #58A6FF 0%, #1E72D4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(88,166,255,0.3)",
            flexShrink: 0,
          }}
        >
          <TrendingUp size={18} className="text-white" />
        </div>
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: "-0.5px",
              color: "var(--text)",
              lineHeight: 1.1,
            }}
          >
            TradeX
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            Pro Simulator
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--text-dim)",
            padding: "4px 12px 10px",
          }}
        >
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <motion.div
              key={item.path}
              onClick={() => {
                startTransition(() => {
                  router.push(item.path);
                });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 12,
                transition: "all 0.18s ease",
                textDecoration: "none",
                position: "relative",
                cursor: "pointer",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                background: isActive
                  ? "rgba(88, 166, 255, 0.08)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(88, 166, 255, 0.15)"
                  : "1px solid transparent",
              }}
              onMouseEnter={(e: any) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "var(--text)";
                }
              }}
              onMouseLeave={(e: any) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-muted)";
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{
                    position: "absolute",
                    left: 0,
                    width: 3,
                    height: 22,
                    borderRadius: "0 3px 3px 0",
                    background: "var(--accent)",
                    boxShadow: "0 0 8px rgba(88,166,255,0.5)",
                  }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "-0.1px",
                }}
              >
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 12,
            transition: "all 0.18s ease",
            textDecoration: "none",
            color:
              pathname === "/settings" ? "var(--accent)" : "var(--text-muted)",
            background:
              pathname === "/settings"
                ? "rgba(88, 166, 255, 0.08)"
                : "transparent",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/settings") {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "var(--text)";
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/settings") {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }
          }}
        >
          <Settings size={18} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Settings</span>
        </Link>
      </div>
    </aside>
  );
}

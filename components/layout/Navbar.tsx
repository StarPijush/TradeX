"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTradingStore } from "@/store/useTradingStore";
import { formatCurrency } from "@/lib/utils/format";

export default function Navbar() {
  const router = useRouter();
  const balance = useTradingStore((s) => s.balance);

  // Mock guest user for temporary non-auth development
  const guestUser = {
    name: "Guest User",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=trader",
  };

  return (
    <nav
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48 }}>
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            <span style={{ color: "var(--text)", fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>
              TradeX
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 8, 
                marginRight: 8,
                paddingRight: 12,
                borderRight: "1px solid var(--border)",
                height: 24,
              }}
            >
              <img 
                src={guestUser.image} 
                alt="Profile" 
                style={{ width: 22, height: 22, borderRadius: "50%" }} 
              />
              <span style={{ color: "var(--text)", fontSize: 12, fontWeight: 500 }} className="desktop-only">
                {guestUser.name}
              </span>
            </div>
            
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
              Balance:{" "}
              <span style={{ color: "var(--text)", fontWeight: 600 }}>
                {formatCurrency(balance, true)}
              </span>
            </span>
            <button
              onClick={() => router.push("/menu")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 4,
                background: "transparent",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

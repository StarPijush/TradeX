"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTradingStore } from "@/store/useTradingStore";
import { formatCurrency } from "@/lib/utils/format";
import { TrendingUp, Menu, Wallet } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const balance = useTradingStore((s) => s.balance);

  const guestUser = {
    name: "Guest User",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=trader",
  };

  return (
    <nav className="navbar">
      <div
        style={{
          maxWidth: "var(--max-page-w)",
          margin: "0 auto",
          padding: "0 20px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo — mobile only (desktop uses sidebar) */}
        <div
          className="flex md:hidden items-center gap-2.5 cursor-pointer select-none"
          onClick={() => router.push("/")}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #58A6FF, #1E72D4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(88,166,255,0.3)",
            }}
          >
            <TrendingUp size={16} className="text-white" />
          </div>
          <span
            style={{
              color: "var(--text)",
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: "-0.5px",
            }}
          >
            TradeX
          </span>
        </div>

        {/* Desktop spacer */}
        <div className="hidden md:block" />

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Balance */}
          <div
            className="hidden sm:flex flex-col items-end leading-none"
            style={{ gap: 3 }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--text-dim)",
              }}
            >
              Balance
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 900,
                color: "var(--accent)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.3px",
              }}
            >
              {formatCurrency(balance, true)}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-7 w-px bg-[#1E2633]" />

          {/* User Avatar + Name */}
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "2px solid var(--border)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={guestUser.image}
                alt="Profile"
                width={32}
                height={32}
                sizes="32px"
                className="rounded-full"
              />
            </div>
            <span
              className="hidden lg:block"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-muted)",
                maxWidth: 100,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {guestUser.name}
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => router.push("/menu")}
            className="md:hidden"
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(88,166,255,0.4)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

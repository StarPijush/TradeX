"use client";

import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav
      style={{
        background: "#0D1117",
        borderBottom: "1px solid #2A2F36",
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 60,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center"
      >
        <Link
          href="/simulator"
          style={{
            color: "#E6EDF3",
            fontWeight: 700,
            fontSize: 18,
            textDecoration: "none",
          }}
        >
          TradeX
        </Link>

        <Link
          href="/simulator"
          style={{
            background: "#58A6FF",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}

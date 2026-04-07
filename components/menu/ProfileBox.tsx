"use client";

import { useRouter } from "next/navigation";

export default function ProfileBox() {
  const router = useRouter();

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #111722 0%, #0d1117 100%)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "linear-gradient(135deg, #1E2633 0%, #151B26 100%)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        👤
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "var(--text)", fontWeight: 800, fontSize: 18, marginBottom: 2, letterSpacing: "-0.02em" }}>
          Guest User
        </div>
        <div style={{ color: "var(--text-dim)", fontSize: 12, fontWeight: 500 }}>
          Sign in to sync your portfolio
        </div>
      </div>
      <button
        onClick={() => router.push("/login")}
        style={{
          background: "rgba(88, 166, 255, 0.1)",
          color: "var(--accent)",
          border: "1px solid rgba(88, 166, 255, 0.2)",
          padding: "8px 20px",
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(88, 166, 255, 0.15)";
          e.currentTarget.style.borderColor = "rgba(88, 166, 255, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(88, 166, 255, 0.1)";
          e.currentTarget.style.borderColor = "rgba(88, 166, 255, 0.2)";
        }}
      >
        Login
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

export default function ProfileBox() {
  const router = useRouter();

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: 16,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        👤
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
          Guest User
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 11 }}>
          Sign in to sync your portfolio
        </div>
      </div>
      <button
        onClick={() => router.push("/login")}
        style={{
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          padding: "6px 14px",
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Sign In
      </button>
    </div>
  );
}

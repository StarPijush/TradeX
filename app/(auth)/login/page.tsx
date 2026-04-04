"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#58A6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 900,
              color: "#fff",
              margin: "0 auto 16px",
            }}
          >
            T
          </div>
          <h1 style={{ color: "#E6EDF3", fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
            Look first. Then leap.
          </h1>
          <p style={{ color: "#8B949E", fontSize: 14 }}>
            Join TradeX to start your trading journey.
          </p>
        </div>

        {/* Auth Card */}
        <div
          style={{
            background: "#161B22",
            border: "1px solid #2A2F36",
            borderRadius: 8,
            padding: 32,
            textAlign: "center",
          }}
        >
          <button
            onClick={() => signIn("google", { callbackUrl: "/simulator" })}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#fff",
              color: "#161B22",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              style={{ width: 18, height: 18 }} 
            />
            Continue with Google
          </button>

          <button
            onClick={() => signIn("credentials", { callbackUrl: "/simulator" })}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "transparent",
              color: "#E6EDF3",
              border: "1px solid #2A2F36",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 18 }}>🛡️</span>
            Sign in with Test Account
          </button>

          <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "#2A2F36" }} />
            <span style={{ color: "#484F58", fontSize: 12 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#2A2F36" }} />
          </div>

          <button
            onClick={() => router.push("/")}
            style={{
              background: "transparent",
              border: "none",
              color: "#58A6FF",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Return to home
          </button>
        </div>
        
        <p style={{ color: "#484F58", fontSize: 12, textAlign: "center", marginTop: 24 }}>
          By continuing, you agree to TradeX&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

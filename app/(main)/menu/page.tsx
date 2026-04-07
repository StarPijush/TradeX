"use client";

import { signOut } from "next-auth/react";
import PageContainer from "@/components/layout/PageContainer";
import ProfileBox from "@/components/menu/ProfileBox";
import WalletCard from "@/components/menu/WalletCard";
import MenuList from "@/components/menu/MenuList";
import { Toaster } from "@/components/ui/toaster";

export default function MenuPage() {
  return (
    <div 
      className="page-wrapper min-h-screen"
      style={{ 
        paddingTop: 24,
        background: "radial-gradient(circle at 50% -20%, #111722 0%, #06090F 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Glow Accents */}
      <div 
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "40%",
          background: "radial-gradient(circle, rgba(88,166,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <PageContainer>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 24,
          position: "relative",
          zIndex: 1
        }}>
          <div className="space-y-1">
            <div style={{ 
              fontSize: 10, 
              fontWeight: 800, 
              color: "var(--text-dim)", 
              textTransform: "uppercase", 
              letterSpacing: "0.2em" 
            }}>
              Personal Terminal
            </div>
            <h1 style={{ color: "var(--text)", fontWeight: 900, fontSize: 32, letterSpacing: "-0.04em" }}>
              Menu
            </h1>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.1)",
              borderRadius: 12,
              color: "var(--red)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              padding: "8px 16px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.1)";
            }}
          >
            Sign Out
          </button>
        </div>
        
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <ProfileBox />
          <WalletCard />
          <MenuList />
        </div>
      </PageContainer>
      <Toaster />
    </div>
  );
}

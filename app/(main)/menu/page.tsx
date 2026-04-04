"use client";

import { signOut } from "next-auth/react";
import PageContainer from "@/components/layout/PageContainer";
import ProfileBox from "@/components/menu/ProfileBox";
import WalletCard from "@/components/menu/WalletCard";
import MenuList from "@/components/menu/MenuList";
import { Toaster } from "@/components/ui/toaster";

export default function MenuPage() {
  return (
    <div style={{ paddingTop: 12 }}>
      <PageContainer>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <h1 style={{ color: "var(--text)", fontWeight: 600, fontSize: 16 }}>
            Menu
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--red)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            Log out
          </button>
        </div>
        <ProfileBox />
        <WalletCard />
        <MenuList />
      </PageContainer>
      <Toaster />
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useMarketStore } from "@/store/useMarketStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChartPage = pathname.startsWith("/chart");

  useEffect(() => {
    // Start market engine immediately on app entry
    useMarketStore.getState().init();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D1117] font-sans selection:bg-[#58A6FF]/20">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
        <Navbar />

        {/* Scrollable main area — chart page handles its own layout */}
        <main
          className={`flex-1 min-h-0 ${
            isChartPage
              ? "overflow-hidden flex flex-col"
              : "overflow-y-auto overflow-x-hidden"
          }`}
        >
          {children}
        </main>

        {/* Mobile bottom nav — hidden on desktop via CSS */}
        <BottomNav />
      </div>
    </div>
  );
}

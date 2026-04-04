"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import MarketSummary from "@/components/landing/MarketSummary";
import Link from "next/link";
import TrustSection from "@/components/landing/TrustSection";
import ProductFlow from "@/components/landing/ProductFlow";

export default function LandingPage() {
  return (
    <div className="bg-[#0D1117] min-h-screen font-sans selection:bg-[#58A6FF]/30 overflow-x-hidden">
      <LandingNavbar />
      
      <main>
        {/* Section 1: Hero & Trust */}
        <section className="bg-[#0D1117]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeroSection />
            <TrustSection />
          </div>
        </section>

        {/* Section 2: Showcase */}
        <section className="bg-[#0B0F14] py-16 md:py-24 border-y border-[#21262D]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeatureShowcase />
          </div>
        </section>

        {/* Section 3: Product Flow */}
        <section className="bg-[#0D1117] py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductFlow />
          </div>
        </section>

        {/* Section 4: Markets */}
        <section className="bg-[#0B0F14] py-16 md:py-24 border-t border-[#21262D]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <MarketSummary />
          </div>
        </section>
        
        {/* Professional Footer */}
        <footer className="bg-[#0D1117] pt-24 pb-16 border-t border-[#21262D]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="text-[#E6EDF3] text-2xl font-extrabold tracking-tighter">
                  TradeX
                </div>
                <p className="text-[#8B949E] text-xs text-center md:text-left max-w-xs leading-relaxed">
                  The world&apos;s most advanced trading simulator for educators, researchers, and professional strategists.
                </p>
                <div className="text-[#484F58] text-[10px] uppercase font-bold tracking-[0.2em] mt-2">
                  Built for education. Not financial advice.
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[#8B949E] text-sm font-medium">
                {["Features", "Pricing", "Support", "Privacy", "Terms"].map((l) => (
                  <span key={l} className="cursor-pointer hover:text-[#E6EDF3] transition-colors duration-200">{l}</span>
                ))}
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-[#21262D]/50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-[#484F58] text-[10px] uppercase tracking-[0.25em] font-medium text-center md:text-left">
                © 2026 TradeX Virtual Labs. Precision-engineered for market mastery.
              </div>
              <Link
                href="/simulator"
                className="text-[#58A6FF] text-xs font-bold no-underline hover:text-[#79C0FF] transition-colors duration-200 flex items-center gap-2 group"
              >
                Access Terminal <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

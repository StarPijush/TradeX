"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import MarketSummary from "@/components/landing/MarketSummary";
import Link from "next/link";
import TrustSection from "@/components/landing/TrustSection";
import ProductFlow from "@/components/landing/ProductFlow";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Preloader() {
  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F14]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl font-extrabold text-[#E6EDF3] tracking-tighter"
        >
          TradeX
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[#58A6FF]/30 overflow-x-hidden relative"
      style={{
        background: "radial-gradient(circle at 50% -20%, #111722 0%, #06090F 100%)",
        color: "var(--text)"
      }}
    >
      {/* Subtle Noise Texture Overlay */}
      <div 
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.02,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          zIndex: 1
        }}
      />

      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>

      <LandingNavbar isLoading={isLoading} />
      
      <main className="relative z-10">
        {/* Section 1: Hero & Trust */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            <HeroSection isLoading={isLoading} />
            <TrustSection />
          </div>
        </section>

        {/* Section 2: Showcase */}
        <section 
          className="py-24 lg:py-32 border-y border-[rgba(255,255,255,0.03)]"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeatureShowcase />
          </div>
        </section>

        {/* Section 3: Product Flow */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductFlow />
          </div>
        </section>

        {/* Section 4: Markets */}
        <section 
          className="py-24 lg:py-32 border-t border-[rgba(255,255,255,0.03)]"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MarketSummary />
          </div>
        </section>
        
        {/* Professional Footer */}
        <footer className="pt-32 pb-16 relative">
          {/* Top Divider with Glow */}
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(88,166,255,0.1), transparent)"
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
              <div className="md:col-span-4 flex flex-col items-center md:items-start gap-8">
                <div 
                  className="text-[#E6EDF3] text-3xl font-black tracking-tighter"
                  style={{ textShadow: "0 0 20px rgba(230,237,243,0.1)" }}
                >
                  TradeX
                </div>
                <p className="text-[#8B949E] text-sm text-center md:text-left max-w-sm leading-8 font-medium">
                  The world&apos;s most advanced trading simulator for educators, researchers, and professional strategists.
                </p>
                <div className="text-[#484F58] text-[10px] uppercase font-black tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full">
                  Built for education.
                </div>
              </div>

              <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
                {[
                  { title: "Platform", links: ["Features", "Simulator", "Markets", "Pricing"] },
                  { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
                  { title: "Legal", links: ["Privacy", "Terms", "Support", "Security"] }
                ].map((group) => (
                  <div key={group.title} className="flex flex-col gap-6">
                    <h4 className="text-[#E6EDF3] text-xs font-black uppercase tracking-widest opacity-80">
                      {group.title}
                    </h4>
                    <div className="flex flex-col gap-3 text-[#8B949E] text-[13px] font-semibold">
                      {group.links.map((l) => (
                        <span 
                          key={l} 
                          className="cursor-pointer hover:text-[#58A6FF] hover:translate-x-1 transition-all duration-300"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-12 border-t border-[rgba(255,255,255,0.03)] flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-[#484F58] text-[11px] uppercase tracking-[0.3em] font-black text-center md:text-left">
                © 2026 TradeX Labs • Precision-engineered for mastery.
              </div>
              <Link
                href="/simulator"
                className="bg-white/5 border border-white/10 hover:border-[#58A6FF]/40 text-[#E6EDF3] py-2.5 px-6 rounded-full text-xs font-black uppercase tracking-widest no-underline hover:text-[#58A6FF] transition-all duration-300 flex items-center gap-3 group"
              >
                Access Terminal <span className="group-hover:translate-x-1 transition-transform text-[#58A6FF]">→</span>
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingNavbar({ isLoading }: { readonly isLoading?: boolean }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={isLoading ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-[100] w-full border-b border-white/5"
      style={{
        background: "rgba(13, 17, 23, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <Link
          href="/"
          className="text-[#E6EDF3] text-2xl font-black tracking-tightest no-underline hover:opacity-80 transition-opacity"
        >
          TradeX
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/simulator"
            className="hidden md:block text-[#8B949E] text-sm font-black uppercase tracking-widest no-underline hover:text-[#E6EDF3] transition-colors"
          >
            Terminal
          </Link>
          <Link
            href="/simulator"
            className="bg-white/5 border border-white/10 hover:border-[#58A6FF]/40 text-[#E6EDF3] py-2.5 px-6 rounded-full text-xs font-black uppercase tracking-widest no-underline hover:shadow-[0_0_20px_rgba(88,166,255,0.15)] transition-all duration-300"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

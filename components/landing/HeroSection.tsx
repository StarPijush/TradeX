"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="py-16 md:py-28 flex flex-col items-center text-center"
    >
      <div className="max-w-4xl mb-20 px-4">
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] text-[#E6EDF3] mb-8 tracking-tighter"
        >
          Look first.<br />
          <span className="text-[#8B949E]">Then leap.</span>
        </h1>
        <p
          className="text-base md:text-lg text-[#8B949E] mb-12 leading-relaxed max-w-md mx-auto"
        >
          The best trades require research, then commitment. Join millions of traders who trust TradeX for their financial future.
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          <Link
            href="/simulator"
            className="w-full sm:w-auto bg-[#238636] hover:bg-[#1f772f] text-white py-3 px-10 rounded-lg text-base font-bold no-underline text-center transition-colors duration-200"
          >
            Get started for free
          </Link>
          <Link
            href="/simulator"
            className="w-full sm:w-auto bg-transparent border border-[#2A2F36] hover:bg-[#1C2128] text-[#E6EDF3] py-3 px-10 rounded-lg text-base font-bold no-underline text-center transition-colors duration-200"
          >
            Explore platform
          </Link>
        </div>
      </div>

      {/* Hero Image / Mockup Showcase */}
      <div
        className="w-full max-w-5xl mt-12 bg-[#0B0F14] rounded-xl border border-[#2A2F36] overflow-hidden relative aspect-video mx-auto"
      >
        <Image
          src="/images/hero_chart.png"
          alt="TradeX Trading Interface"
          fill
          className="object-cover opacity-95"
        />
      </div>
    </section>
  );
}

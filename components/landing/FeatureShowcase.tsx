"use client";

import Image from "next/image";

export default function FeatureShowcase() {
  return (
    <section
      className="flex flex-col items-center"
    >
      <div className="max-w-3xl text-center mb-20 px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-[#E6EDF3] mb-6 tracking-tighter"
        >
          High-performance analysis
        </h2>
        <p className="text-base md:text-lg text-[#8B949E] max-w-md mx-auto leading-relaxed">
          The best traders trust TradeX for precision data and zero-latency simulation.
        </p>
      </div>

      <div
        className="w-full flex flex-col gap-10 px-4"
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Professional Charts",
              desc: "The world's standard for financial data visualization and analysis.",
              icon: "📈",
            },
            {
              title: "Fast Execution",
              desc: "Simulate trades with zero latency and real-time market updates.",
              icon: "⚡",
            },
            {
              title: "Global Markets",
              desc: "Access Stocks, Crypto, Forex, and Indices all in one place.",
              icon: "🌍",
            },
          ].map((f) => (
            <div 
              key={f.title} 
              className="bg-[#161B22] p-8 rounded-xl border border-[#2A2F36] hover:bg-[#1C2128] transition-colors duration-200 group"
            >
              <div className="text-2xl mb-6 grayscale group-hover:grayscale-0 transition-all">{f.icon}</div>
              <div className="space-y-2">
                <h3 className="text-[#E6EDF3] text-lg font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="text-[#8B949E] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Preview Showcase */}
        <div
          className="rounded-xl border border-[#2A2F36] overflow-hidden relative aspect-video lg:aspect-[21/9] bg-[#0B0F14]"
        >
          <Image
            src="/images/feature_preview.png"
            alt="Market Overview"
            fill
            className="object-cover opacity-95"
          />
        </div>
      </div>
    </section>
  );
}

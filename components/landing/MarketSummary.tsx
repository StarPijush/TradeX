"use client";

import { formatCurrency, formatPercent } from "@/lib/utils/format";

const INDICES = [
  { name: "NIFTY 50", price: 22453.3, change: 1.36, isUp: true },
  { name: "SENSEX", price: 73806.15, change: 1.24, isUp: true },
  { name: "S&P 500", price: 5243.35, change: 0.62, isUp: true },
  { name: "NASDAQ 100", price: 18108.45, change: -0.47, isUp: false },
];

export default function MarketSummary() {
  return (
    <section
      className="flex flex-col items-center"
    >
      <div className="max-w-3xl text-center mb-20 px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-[#E6EDF3] mb-6 tracking-tighter"
        >
          Institutional-grade data
        </h2>
        <p className="text-base md:text-lg text-[#8B949E] max-w-md mx-auto leading-relaxed">
          Monitor global indices with real-time accuracy and professional-grade visualization.
        </p>
      </div>

      <div
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto px-4"
      >
        {INDICES.map((idx) => (
          <div
            key={idx.name}
            className="bg-[#161B22] rounded-xl p-5 border border-[#2A2F36] transition-colors duration-200 hover:bg-[#1C2128] flex flex-col gap-3"
          >
            <div className="text-[#8B949E] font-bold text-[10px] uppercase tracking-widest">
              {idx.name}
            </div>
            <div className="flex justify-between items-baseline">
              <div className="text-3xl font-bold text-[#E6EDF3] tracking-tighter">
                {formatCurrency(idx.price, true)}
              </div>
              <div
                className={`flex items-center gap-1.5 font-bold text-[11px] ${idx.isUp ? "text-[#22C55E]" : "text-[#EF4444]"}`}
              >
                <div
                  className={`w-1 h-1 rounded-full ${idx.isUp ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}
                />
                {formatPercent(idx.change)}
              </div>
            </div>

            {/* Mini line chart decoration */}
            <div
              className={`h-8 w-full mt-1 rounded relative overflow-hidden ${idx.isUp ? "bg-[#22C55E]/5" : "bg-[#EF4444]/5"}`}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d={idx.isUp ? "M0 30 Q 25 10, 50 25 T 100 5" : "M0 5 Q 25 30, 50 15 T 100 35"}
                  fill="none"
                  stroke={idx.isUp ? "#22C55E" : "#EF4444"}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

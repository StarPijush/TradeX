"use client";

const TRUSTED_SYMBOLS = [
  "Global Equities", "Digital Assets", "Currency Pairs", "Commodities", "World Indices"
];

export default function TrustSection() {
  return (
    <section className="pb-24">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 mb-10 tracking-tight">
          Trusted by 50,000+ traders worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 px-4 opacity-40 grayscale">
          {TRUSTED_SYMBOLS.map((symbol) => (
            <span 
              key={symbol} 
              className="text-base md:text-lg font-bold text-[#E6EDF3] tracking-tighter"
            >
              {symbol}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

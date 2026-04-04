"use client";

const STEPS = [
  {
    step: "01",
    title: "Analyze market",
    desc: "Use advanced technical charts to research potential opportunities.",
  },
  {
    step: "02",
    title: "Simulate trades",
    desc: "Execute buy and sell orders with zero risk and instant processing.",
  },
  {
    step: "03",
    title: "Improve strategy",
    desc: "Track your performance and refine your approach to the markets.",
  },
];

export default function ProductFlow() {
  return (
    <section className="py-12 md:py-24 border-b border-[#21262D]">
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#E6EDF3] tracking-tight mb-4">
          How it works
        </h2>
        <p className="text-[#8B949E] text-base md:text-lg max-w-2xl mx-auto">
          Begin your journey from zero-risk simulation to market mastery in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        {STEPS.map((s) => (
          <div key={s.step} className="flex flex-col items-center md:items-start group">
            <span className="text-sm font-bold text-[#58A6FF] mb-4 bg-[#58A6FF]/10 px-3 py-1 rounded-full">
              STEP {s.step}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#E6EDF3] mb-4 group-hover:translate-x-1 transition-transform">
              {s.title}
            </h3>
            <p className="text-[#8B949E] text-sm md:text-base leading-relaxed text-center md:text-left">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

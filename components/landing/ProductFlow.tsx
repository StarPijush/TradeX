"use client";

import { motion } from "framer-motion";

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
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
        className="text-center mb-24 px-4"
      >
        <h2 className="text-4xl md:text-6xl font-black text-[#E6EDF3] tracking-tighter mb-8">
          How it works
        </h2>
        <p className="text-[#8B949E] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
          Begin your journey from zero-risk simulation to market mastery in three simple steps.
        </p>
      </motion.div>

      <div className="relative max-w-6xl mx-auto">
        {/* Connection Line (Desktop) */}
        <div className="hidden md:block absolute top-[120px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 px-4 relative z-10"
        >
          {STEPS.map((s) => (
            <motion.div 
              variants={fadeUpVariant} 
              key={s.step} 
              className="group flex flex-col items-center md:items-start"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#111722] border border-white/5 flex items-center justify-center mb-10 group-hover:border-[#58A6FF]/30 group-hover:bg-[#161B22] transition-all duration-500 shadow-xl relative">
                <span className="text-lg font-black text-[#8B949E] group-hover:text-[#58A6FF] transition-colors">{s.step}</span>
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-2xl bg-[#58A6FF]/5 scale-0 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
              
              <h3 className="text-2xl font-black text-[#E6EDF3] mb-5 tracking-tightest group-hover:translate-x-1 transition-transform duration-500">
                {s.title}
              </h3>
              <p className="text-[#8B949E] text-[15px] leading-8 font-medium opacity-70 text-center md:text-left max-w-[280px]">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative glow */}
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#58A6FF]/5 blur-[120px] pointer-events-none" />
    </section>
  );
}

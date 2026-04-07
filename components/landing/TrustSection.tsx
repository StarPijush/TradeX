"use client";

import { motion } from "framer-motion";

const TRUSTED_SYMBOLS = [
  "Global Equities", "Digital Assets", "Currency Pairs", "Commodities", "World Indices"
];

export default function TrustSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } 
    }
  };

  return (
    <section className="pt-12 relative">
      {/* Top Divider with Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="text-center pt-8">
        <p className="text-[10px] font-black text-[#8B949E] mb-14 uppercase tracking-[0.4em] opacity-50">
          Trusted by 50,000+ traders worldwide
        </p>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap justify-center items-center gap-x-16 md:gap-x-24 gap-y-12 px-4"
        >
          {TRUSTED_SYMBOLS.map((symbol) => (
            <motion.div 
              variants={item}
              key={symbol} 
              className="group cursor-default"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <span className="text-sm md:text-lg font-black text-[#E6EDF3] tracking-tighter opacity-40 group-hover:opacity-100 group-hover:text-[#58A6FF] transition-all duration-300">
                {symbol}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Divider */}
      <div className="mt-20 w-full h-[1px] bg-white/5 opacity-30" />
    </section>
  );
}

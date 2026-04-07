"use client";

import { ChevronRight } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { motion } from "framer-motion";
import Link from "next/link";

const INDICES = [
  { name: "NIFTY 50", price: 22453.3, change: 1.36, isUp: true, color: "#58A6FF" },
  { name: "SENSEX", price: 73806.15, change: 1.24, isUp: true, color: "#238636" },
  { name: "S&P 500", price: 5243.35, change: 0.62, isUp: true, color: "#F59E0B" },
  { name: "NASDAQ 100", price: 18108.45, change: -0.47, isUp: false, color: "#AB47BC" },
];

export default function MarketSummary() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section className="flex flex-col items-center">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
        className="max-w-4xl text-center mb-24 px-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#238636]/10 border border-[#238636]/20 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#238636] animate-pulse" />
          <span className="text-[10px] font-black text-[#238636] uppercase tracking-widest">Live Indices</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-[#E6EDF3] mb-8 tracking-tighter">
          Institutional-grade data
        </h2>
        <p className="text-lg md:text-xl text-[#8B949E] max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
          Monitor global indices with real-time accuracy and professional-grade visualization.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4"
      >
        {INDICES.map((idx, i) => (
          <motion.div
            variants={fadeUpVariant}
            key={idx.name}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-[#0D1117] p-8 rounded-[32px] border border-white/5 hover:border-white/10 hover:bg-[#111722] transition-all duration-500 relative overflow-hidden group shadow-xl"
          >
            {/* Index Badge */}
            <div className="flex justify-between items-start mb-10">
              <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md opacity-50 group-hover:opacity-100 group-hover:bg-white/10 transition-all">
                {idx.name}
              </span>
              <div 
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: idx.color, boxShadow: `0 0 10px ${idx.color}` }}
              />
            </div>

            <div className="space-y-2 mb-8">
              <div className="text-2xl font-black text-[#E6EDF3] tracking-tighter tabular-nums">
                {formatCurrency(idx.price, true)}
              </div>
              <div
                className={`flex items-center gap-2 font-black text-xs ${idx.isUp ? "text-[#238636]" : "text-[#F85149]"}`}
              >
                {idx.isUp ? "▲" : "▼"} {formatPercent(idx.change)}
              </div>
            </div>

            {/* Decorative Trend Line */}
            <div
              className={`h-12 w-full rounded-2xl relative overflow-hidden transition-all duration-500 group-hover:opacity-100 opacity-40 ${idx.isUp ? "bg-[#238636]/5" : "bg-[#F85149]/5"}`}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d={idx.isUp ? "M0 30 Q 25 10, 50 25 T 100 5" : "M0 5 Q 25 30, 50 15 T 100 35"}
                  fill="none"
                  stroke={idx.isUp ? "#238636" : "#F85149"}
                  strokeWidth="3"
                  className="opacity-80"
                />
              </svg>
            </div>

            {/* Subtle background glow */}
            <div 
              className="absolute -bottom-12 -left-12 w-24 h-24 blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{ background: idx.color }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Access Terminal Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20"
      >
        <Link
          href="/simulator"
          className="text-[#8B949E] text-[10px] font-black uppercase tracking-[0.4em] hover:text-[#58A6FF] transition-all flex items-center gap-4 group"
        >
          View all 500+ assets <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}

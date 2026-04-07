"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function FeatureShowcase() {
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
    <section className="flex flex-col items-center">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
        className="max-w-4xl text-center mb-24 px-4"
      >
        <h2 className="text-4xl md:text-6xl font-black text-[#E6EDF3] mb-8 tracking-tighter">
          High-performance analysis
        </h2>
        <p className="text-lg md:text-xl text-[#8B949E] max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
          The best traders trust TradeX for precision data and zero-latency simulation.
        </p>
      </motion.div>

      <div className="w-full flex flex-col gap-24 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {[
            {
              title: "Professional Charts",
              desc: "The world's standard for financial data visualization and analysis.",
              icon: "📈",
              color: "#58A6FF"
            },
            {
              title: "Fast Execution",
              desc: "Simulate trades with zero latency and real-time market updates.",
              icon: "⚡",
              color: "#238636"
            },
            {
              title: "Global Markets",
              desc: "Access Stocks, Crypto, Forex, and Indices all in one place.",
              icon: "🌍",
              color: "#AB47BC"
            },
          ].map((f) => (
            <motion.div 
              variants={fadeUpVariant}
              key={f.title} 
              className="bg-[#0D1117] p-12 rounded-[32px] border border-white/5 hover:border-white/10 hover:bg-[#111722] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden"
              style={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* Subtle Card Glow */}
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ background: f.color }}
              />
              
              <div 
                className="text-4xl mb-10 p-4 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                style={{ background: `${f.color}10`, border: `1px solid ${f.color}20` }}
              >
                {f.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-[#E6EDF3] text-2xl font-black tracking-tightest">
                  {f.title}
                </h3>
                <p className="text-[#8B949E] text-[15px] leading-8 font-medium opacity-70">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Preview Showcase */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          whileHover={{ scale: 1.002, transition: { duration: 0.4 } }}
          className="rounded-[40px] border border-white/10 overflow-hidden relative aspect-video lg:aspect-[21/9] bg-[#0B0F14] shadow-[0_48px_120px_rgba(0,0,0,0.6)]"
        >
          {/* Terminal Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F14]/40 z-10 pointer-events-none" />
          
          <Image
            src="/images/feature_preview.png"
            alt="Market Overview"
            fill
            className="object-cover opacity-90 brightness-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1600px"
            priority={true}
          />
        </motion.div>
      </div>
    </section>
  );
}

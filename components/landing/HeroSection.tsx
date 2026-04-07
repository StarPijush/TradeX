"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function HeroSection({ isLoading }: { isLoading?: boolean }) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="flex flex-col items-center">
      <motion.div 
        className="max-w-4xl mx-auto px-4 mb-20 text-center"
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={containerVariants}
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-8xl font-black leading-[1.05] text-[#FFFFFF] mb-10 tracking-tightest"
          style={{ letterSpacing: "-0.04em" }}
        >
          Look first.<br />
          <span className="text-[#8B949E] opacity-60">Then leap.</span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-[#8B949E] mb-14 leading-relaxed max-w-2xl mx-auto font-medium opacity-80"
        >
          The best trades require research, then commitment. Join millions of traders who trust TradeX for their financial future.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
        >
          <Link
            href="/simulator"
            className="w-full sm:w-auto bg-[#238636] hover:bg-[#2eaa42] text-white py-4 px-12 rounded-xl text-base font-black uppercase tracking-widest no-underline text-center transition-all duration-300 shadow-[0_0_20px_rgba(35,134,54,0.15)] hover:shadow-[0_0_30px_rgba(35,134,54,0.3)] hover:-translate-y-1"
          >
            Get started
          </Link>
          <Link
            href="/simulator"
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[#E6EDF3] py-4 px-12 rounded-xl text-base font-black uppercase tracking-widest no-underline text-center transition-all duration-300 hover:-translate-y-1"
          >
            Explore
          </Link>
        </motion.div>
      </motion.div>

      {/* Hero Image / Mockup Showcase */}
      <motion.div
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={imageVariants}
        whileHover={{ scale: 1.005, transition: { duration: 0.4 } }}
        className="w-full max-w-6xl mt-12 bg-[#0B0F14] rounded-[32px] border border-white/10 overflow-hidden relative aspect-video mx-auto shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
      >
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-green-500/10 blur-2xl opacity-30 pointer-events-none" />
        
        <Image
          src="/images/hero_chart.png"
          alt="TradeX Trading Interface"
          fill
          className="object-cover opacity-90 brightness-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
          priority
        />
      </motion.div>
    </section>
  );
}

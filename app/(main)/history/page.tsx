"use client";

import { useMemo } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { useTradingStore } from "@/store/useTradingStore";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Clock, TrendingUp, ShieldAlert, ArrowRight, Calendar, Zap, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const { trades } = useTradingStore();

  const groupedTrades = useMemo(() => {
    const groups: { [key: string]: typeof trades } = {};
    const sortedTrades = [...trades].sort((a, b) => b.timestamp - a.timestamp);

    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    sortedTrades.forEach((trade) => {
      const tradeDate = new Date(trade.timestamp);
      const dateStr = tradeDate.toDateString();
      
      let label = dateStr;
      if (dateStr === today) label = "Today";
      else if (dateStr === yesterdayStr) label = "Yesterday";
      else {
        label = tradeDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(trade);
    });

    return Object.entries(groups);
  }, [trades]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="page-wrapper">
      <PageContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#1E2633] border border-[#2A2E39] text-[#8B949E] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              <Clock size={12} className="text-[#58A6FF]" />
              Trade Archival
            </div>
            <h1 className="text-[#E6EDF3] text-4xl font-black tracking-tight">Execution Ledger</h1>
            <p className="text-[#8B949E] text-base font-medium max-w-lg">A historical record of all settled transactions and filled market orders.</p>
          </div>
        </div>

        {groupedTrades.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0B0F14] border border-white/[0.04] rounded-[24px] p-10 text-center shadow-xl max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] flex items-center justify-center mx-auto mb-5 text-white/10 border border-white/[0.05]">
               <History size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-[#E6EDF3] text-lg font-black mb-1 uppercase tracking-tight">No trades yet</h3>
            <p className="text-[#8B949E] text-[13px] max-w-xs mx-auto mb-6 font-medium leading-relaxed">
              Execute your first trade in the simulator to see your logs here.
            </p>
            <motion.button 
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => router.push("/simulator")}
               className="w-full max-w-[240px] bg-green-500 hover:bg-green-400 text-white h-12 rounded-lg text-xs font-black uppercase tracking-[2px] flex items-center justify-center gap-3 mx-auto shadow-lg shadow-green-500/10 transition-all"
            >
              Start Trading
              <ArrowRight size={16} strokeWidth={3} />
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {groupedTrades.map(([dateLabel, tradesInGroup]) => (
              <div key={dateLabel} className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[#8B949E] text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap bg-[#1E2633]/30 px-3 py-1 rounded-md border border-[#1E2633]/50">
                    {dateLabel}
                  </span>
                  <div className="h-px bg-[#1E2633] w-full" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {tradesInGroup.map((trade, i) => (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-[#0B0F14] border border-[#1E2633] p-5 rounded-2xl flex items-center justify-between hover:bg-[#11161D] hover:border-[#2A2E39] transition-all shadow-lg hover:shadow-2xl"
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                            trade.type === "BUY" 
                            ? "bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                            : "bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,83,80,0.1)]"
                          }`}
                        >
                          {trade.type === "BUY" ? <TrendingUp size={24} /> : <ShieldAlert size={24} />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[#E6EDF3] text-[17px] font-black leading-none">{trade.symbol}</span>
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                               trade.type === "BUY" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                             }`}>
                               {trade.type}
                             </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#8B949E] text-[11px] font-bold">
                             <div className="flex items-center gap-1.5"><Zap size={12} className="opacity-60" /> {trade.quantity} units</div>
                             <div className="w-1 h-1 rounded-full bg-[#1E2633]" />
                             <div>@ {formatCurrency(trade.price, true)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                         <div className="text-[#8B949E] text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 opacity-60">Total Value</div>
                         <div className="text-[#E6EDF3] text-[15px] font-black tabular-nums">
                           {formatCurrency(trade.quantity * trade.price, true)}
                         </div>
                         <div className="flex items-center justify-end gap-1.5 text-[#484F58] text-[10px] font-black uppercase mt-1 tracking-tighter">
                           <Clock size={10} />
                           {formatTime(trade.timestamp)}
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}


"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function ChartSkeleton() {
  return (
    <div className="relative w-full h-full bg-[#131722] flex flex-col overflow-hidden">
      {/* Fake Top Bar in Chart */}
      <div className="h-10 border-b border-white/[0.03] flex items-center px-4 gap-4">
        <Skeleton className="w-24 h-4 rounded-md" />
        <Skeleton className="w-16 h-4 rounded-md" />
        <Skeleton className="w-16 h-4 rounded-md opacity-50" />
      </div>

      <div className="flex-1 relative">
        {/* Fake Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          {[...Array(8)].map((_, i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-white" style={{ left: `${(i + 1) * 12.5}%` }} />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-white" style={{ top: `${(i + 1) * 16.6}%` }} />
          ))}
        </div>

        {/* Shimmering Chart Content */}
        <div className="absolute inset-x-8 inset-y-12">
           <Skeleton className="w-full h-full rounded-xl bg-gradient-to-br from-[#1E2633]/20 via-[#1E2633]/10 to-transparent" />
        </div>
      </div>
      
      {/* Bottom status bar */}
      <div className="h-6 border-t border-white/[0.03] flex items-center px-4">
        <Skeleton className="w-32 h-2 opacity-30" />
      </div>
    </div>
  );
}

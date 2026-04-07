"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import PageContainer from "@/components/layout/PageContainer";

export default function PortfolioSkeleton() {
  return (
    <div className="page-wrapper animate-pulse">
      <PageContainer>
        {/* Hero Section Skeleton */}
        <div className="mb-12 flex flex-col items-center space-y-6">
          <Skeleton className="w-48 h-6 rounded-full bg-[#1E2633]/30" />
          <Skeleton className="w-64 h-16 md:h-20 lg:h-24 rounded-2xl bg-[#1E2633]/40" />
          <Skeleton className="w-96 h-4 opacity-30 mx-auto" />
        </div>

        {/* Summary Card Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 bg-gradient-to-br from-[#111722] to-[#0D1117] border border-[#1E2633] rounded-[24px] shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl bg-[#1E2633]" />
                <Skeleton className="w-24 h-3 opacity-40 lowercase tracking-widest" />
              </div>
              <div className="space-y-3">
                 <Skeleton className="w-32 h-8 rounded-lg" />
                 <Skeleton className="w-20 h-4 opacity-50 block" />
              </div>
            </div>
          ))}
        </div>

        {/* List Section Skeletons */}
        <div className="space-y-10">
          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Skeleton className="w-40 h-6 bg-[#1E2633]" />
                <Skeleton className="w-24 h-5 rounded-full bg-[#1E2633]/50" />
                <div className="flex-1 h-px bg-[#1E2633]" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-[#131722]/50 border border-[#1E2633] rounded-2xl p-5 space-y-4">
                     <div className="flex justify-between">
                       <div className="space-y-2">
                         <Skeleton className="w-16 h-4" />
                         <Skeleton className="w-24 h-3 opacity-40" />
                       </div>
                       <Skeleton className="w-20 h-8 rounded-lg opacity-40" />
                     </div>
                     <div className="flex justify-between border-t border-white/[0.03] pt-4">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-16 h-4" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

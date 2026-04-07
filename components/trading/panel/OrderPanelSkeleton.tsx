"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function OrderPanelSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-5 bg-[#131722] h-full border-l border-white/[0.03]">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="w-24 h-3 opacity-40 uppercase tracking-widest" />
        <div className="flex items-center justify-between">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-24 h-6 rounded-lg bg-[#26A69A]/10" />
        </div>
      </div>

      {/* Side Toggle Skeleton */}
      <div className="flex gap-2 p-1 bg-[#1E222D] rounded-xl">
        <Skeleton className="flex-1 h-10 rounded-lg bg-[#1E2633]" />
        <Skeleton className="flex-1 h-10 rounded-lg bg-transparent border border-white/[0.05]" />
      </div>

      {/* Inputs Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="w-16 h-3 opacity-40" />
          <Skeleton className="w-full h-12 rounded-xl bg-[#1E222D]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
             <Skeleton className="w-12 h-2 opacity-40" />
             <Skeleton className="w-full h-10 rounded-lg bg-[#1E222D]" />
          </div>
          <div className="space-y-2">
             <Skeleton className="w-12 h-2 opacity-40" />
             <Skeleton className="w-full h-10 rounded-lg bg-[#1E222D]" />
          </div>
        </div>
      </div>

      {/* Order Value Box Skeleton */}
      <div className="p-4 rounded-xl border border-dashed border-white/[0.08] bg-black/20 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="w-20 h-3 opacity-40" />
          <Skeleton className="w-16 h-3 opacity-80" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="w-16 h-4 opacity-40" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>

      {/* Button Skeleton */}
      <Skeleton className="w-full h-14 rounded-xl bg-[#3D94FF]/10 mt-auto shadow-2xl" />
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';

export function OrderTrackingSkeleton() {
  return (
    <div className="min-h-screen bg-ojo-cream p-8 md:p-16">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Skeleton */}
        <div className="bg-white/40 backdrop-blur-md p-10 rounded-[40px] border border-ojo-stone/10 shadow-xl flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <div className="h-4 w-20 bg-ojo-stone/10 rounded" />
            <div className="h-12 w-64 bg-ojo-stone/10 rounded" />
          </div>
          <div className="flex gap-4">
            <div className="h-14 w-40 bg-ojo-stone/10 rounded-full" />
            <div className="h-14 w-40 bg-ojo-stone/10 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Skeleton */}
          <div className="lg:col-span-8 bg-white rounded-[50px] p-12 shadow-2xl border border-ojo-stone/10 h-[600px]">
             <div className="h-8 w-48 bg-ojo-stone/10 rounded mb-16" />
             <div className="space-y-12">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex gap-10">
                   <div className="w-14 h-14 bg-ojo-stone/10 rounded-2xl" />
                   <div className="space-y-2 py-4">
                     <div className="h-4 w-32 bg-ojo-stone/10 rounded" />
                     <div className="h-3 w-24 bg-ojo-stone/10 rounded" />
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-ojo-charcoal/90 rounded-[50px] p-10 h-72" />
            <div className="bg-white rounded-[50px] p-10 h-96 shadow-xl border border-ojo-stone/10 space-y-8">
               <div className="h-6 w-32 bg-ojo-stone/10 rounded" />
               {[1, 2].map(i => (
                 <div key={i} className="flex gap-6">
                   <div className="w-16 h-16 bg-ojo-stone/10 rounded-2xl" />
                   <div className="space-y-2 py-2">
                     <div className="h-4 w-24 bg-ojo-stone/10 rounded" />
                     <div className="h-3 w-32 bg-ojo-stone/10 rounded" />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

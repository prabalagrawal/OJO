import React from 'react';
import { motion } from 'motion/react';

export function GeneralSkeleton() {
  return (
    <div className="min-h-screen bg-ojo-cream/30 p-8 md:p-16 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-ojo-stone/10 rounded" />
          <div className="h-16 w-1/3 bg-ojo-stone/10 rounded" />
          <div className="h-6 w-1/4 bg-ojo-stone/10 rounded" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white border border-ojo-stone/10 rounded-[2rem]" />
          ))}
        </div>

        <div className="h-[400px] bg-white border border-ojo-stone/10 rounded-[3rem]" />
      </div>
    </div>
  );
}

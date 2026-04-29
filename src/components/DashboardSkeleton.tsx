import React from 'react';
import { motion } from 'motion/react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-ojo-stone/10 rounded" />
          <div className="h-4 w-48 bg-ojo-stone/10 rounded" />
        </div>
        <div className="h-12 w-48 bg-ojo-stone/10 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-40 bg-white border border-ojo-stone/10 rounded-2xl ${i === 3 ? 'md:col-span-2' : ''}`} />
        ))}
      </div>

      <div className="space-y-6">
        <div className="h-8 w-48 bg-ojo-stone/10 rounded" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white border border-ojo-stone/10 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

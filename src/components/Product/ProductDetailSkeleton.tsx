import React from 'react';
import { motion } from 'motion/react';

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-ojo-stone/10 rounded-2xl overflow-hidden relative">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-ojo-stone/5"
              />
            </div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-ojo-stone/10 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-ojo-stone/10 rounded" />
              <div className="h-12 w-3/4 bg-ojo-stone/10 rounded" />
              <div className="h-6 w-32 bg-ojo-stone/10 rounded" />
            </div>

            <div className="h-24 w-full bg-ojo-stone/10 rounded-xl" />

            <div className="space-y-4">
              <div className="h-4 w-20 bg-ojo-stone/10 rounded" />
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-ojo-stone/10" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-20 w-full bg-ojo-stone/10 rounded-xl" />
              <div className="h-20 w-full bg-ojo-stone/10 rounded-xl" />
              <div className="h-20 w-full bg-ojo-stone/10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

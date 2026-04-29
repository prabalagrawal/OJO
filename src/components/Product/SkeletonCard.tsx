import React from 'react';
import { motion } from 'motion/react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-ojo-stone/10 h-full flex flex-col">
      {/* Image Container */}
      <div className="aspect-[4/5] bg-ojo-beige/30 relative">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-ojo-stone/10"
        />
      </div>
      
      {/* Body */}
      <div className="p-4 space-y-4 flex-grow">
        <div className="flex gap-2">
          <div className="h-3 w-20 bg-ojo-stone/10 rounded" />
          <div className="h-3 w-16 bg-ojo-stone/10 rounded" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-full bg-ojo-stone/10 rounded" />
          <div className="h-4 w-2/3 bg-ojo-stone/10 rounded" />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-24 bg-ojo-stone/10 rounded" />
          <div className="h-3 w-12 bg-ojo-stone/10 rounded" />
        </div>
        
        <div className="h-12 w-full bg-ojo-stone/10 rounded mt-4" />
      </div>
    </div>
  );
}

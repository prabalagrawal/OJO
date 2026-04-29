import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Award, Users, ShieldCheck } from 'lucide-react';
import { Product } from '../../data/product-dataset';

// --- FEATURED CARD ---
// For homepage hero grids, spans 2 columns
export function FeaturedCard({ product }: { product: Product }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="md:col-span-2 md:row-span-2 relative aspect-square bg-ojo-beige overflow-hidden group cursor-pointer border border-ojo-stone/10 shadow-premium"
      onClick={() => window.location.href = `/product/${product.id}`}
    >
      <img src={product.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt={product.name} />
      
      {/* Featured Ribbon */}
      <div className="absolute top-6 left-0 z-10">
        <div className="bg-ojo-gold text-ojo-charcoal px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] shadow-xl flex items-center gap-3">
          <Award size={14} /> Featured Craft
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/90 via-ojo-charcoal/20 to-transparent flex flex-col justify-end p-8 md:p-12">
        <div className="space-y-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
           <div className="flex flex-col gap-2">
             <span className="text-ojo-mustard font-black text-[11px] uppercase tracking-[0.5em]">{product.origin.replace('_', ' ')} Heritage</span>
             <h3 className="text-4xl md:text-7xl font-serif text-white leading-[0.85] italic tracking-tighter">
               {product.name}
             </h3>
           </div>
           
           <div className="flex items-center justify-between border-t border-white/10 pt-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border-2 border-ojo-gold p-1">
                   <img src={product.artisanPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                </div>
                <div>
                   <p className="text-white font-serif italic text-xl">{product.artisanName}</p>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Master of {product.category}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 flex items-center justify-center rounded-sm group-hover:bg-ojo-mustard group-hover:text-ojo-charcoal transition-all">
                <ArrowRight size={24} />
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- ARTISAN CARD ---
// For artisan directory
export function ArtisanCard({ name, craft, region, image, count }: { name: string, craft: string, region: string, image: string, count: number }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white p-8 border border-ojo-stone/10 flex flex-col items-center text-center space-y-6 group shadow-sm hover:shadow-warm transition-all"
    >
      <div className="relative">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-ojo-gold p-1 shadow-2xl relative z-10 overflow-hidden">
          <img src={image} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-1000" alt={name} />
        </div>
        <div className="absolute -top-2 -right-2 z-20 w-10 h-10 bg-ojo-gold text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
           <ShieldCheck size={20} />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-2xl font-serif italic text-ojo-charcoal translate-y-2 group-hover:translate-y-0 transition-transform">
          {name}
        </h4>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-[9px] font-black text-ojo-stone uppercase tracking-widest">{craft} Specialist</span>
          <span className="text-[9px] font-black text-ojo-gold uppercase tracking-[0.2em]">{region.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-ojo-stone/40">
         <Star size={12} />
         <span className="text-[10px] font-bold uppercase tracking-widest">500+ pieces verified</span>
      </div>

      <div className="flex flex-col gap-3 w-full">
         <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-ojo-stone/60 mb-2">
            <Users size={14} /> {count} products available
         </div>
         <button className="ojo-btn-primary !py-3 !text-[9px] w-full">
           Follow Artisan
         </button>
      </div>
    </motion.div>
  );
}

// --- COLLECTION CARD ---
// Full-bleed with Pattachitra patterns
export function CollectionCard({ name, image, description }: { name: string, image: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden group p-1 bg-[#8B0F1A]" // Deep red border
    >
      {/* Pattern Overlay Border */}
      <div className="absolute inset-4 z-20 border-2 border-ojo-gold/30 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative w-full h-full overflow-hidden">
        <img src={image} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" alt={name} />
        <div className="absolute inset-0 bg-ojo-charcoal/40 group-hover:bg-ojo-charcoal/20 transition-colors duration-700" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
           <span className="text-ojo-mustard font-black text-[11px] md:text-[13px] uppercase tracking-[0.6em] translate-y-6 group-hover:translate-y-0 transition-transform duration-700">Special Curation</span>
           <h3 className="text-4xl md:text-8xl font-serif text-white italic tracking-tighter transition-transform duration-1000 scale-95 group-hover:scale-100">
             {name}
           </h3>
           <p className="text-white/60 text-sm md:text-xl font-serif italic max-w-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
             {description}
           </p>
           <button className="mt-8 px-10 py-4 bg-ojo-mustard text-ojo-charcoal text-[11px] font-black uppercase tracking-[0.4em] translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
             Shop Collection →
           </button>
        </div>
      </div>
    </motion.div>
  );
}

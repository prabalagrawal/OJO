import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Maximize2, Star, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '../data/product-dataset';

interface MiniQuickViewProps {
  product: Product | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onFullView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function MiniQuickView({ product, position, onClose, onFullView, onAddToCart }: MiniQuickViewProps) {
  if (!product || !position) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onMouseLeave={onClose}
        style={{ 
          position: 'fixed',
          left: Math.min(position.x - 150, window.innerWidth - 350),
          top: Math.min(position.y - 100, window.innerHeight - 500),
          zIndex: 1050
        }}
        className="w-[320px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.15)] overflow-hidden border border-ojo-charcoal/5 rounded-[2rem]"
      >
        <div className="relative aspect-[4/5] overflow-hidden group">
          <img 
            src={product.image} 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
            alt={product.name}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {product.gi_tag && (
              <span className="bg-ojo-terracotta text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest rounded-full">
                GI Certified
              </span>
            )}
            <span className="bg-white/90 backdrop-blur-md text-ojo-charcoal text-[8px] font-black px-2 py-1 uppercase tracking-widest rounded-full flex items-center gap-1">
              <MapPin size={8} /> {product.origin.toUpperCase().replace('_', ' ')}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-1 text-ojo-gold mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill="currentColor" className={i > 3 ? 'opacity-30' : ''} />
              ))}
              <span className="text-[9px] font-black ml-1 text-white">4.8</span>
            </div>
            <h3 className="text-2xl font-serif italic text-white leading-tight">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-ojo-charcoal/60 leading-relaxed italic line-clamp-2">
            {product.short_description || "A masterpiece of traditional Indian craftsmanship, preserving ancestral techniques for the modern connoisseur."}
          </p>

          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-ojo-charcoal/30">Valuation</span>
              <div className="text-2xl font-mono text-ojo-charcoal font-bold">
                ₹{product.price.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-1 text-ojo-terracotta">
              <ShieldCheck size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">OJO Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="bg-ojo-terracotta text-ojo-beige py-3 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-ojo-charcoal transition-all flex items-center justify-center gap-2 rounded-xl"
            >
              <ShoppingBag size={12} />
              Acquire
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onFullView(product);
              }}
              className="border border-ojo-charcoal/10 text-ojo-charcoal py-3 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-ojo-beige transition-all flex items-center justify-center gap-2 rounded-xl"
            >
              <Maximize2 size={12} />
              Full Story
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

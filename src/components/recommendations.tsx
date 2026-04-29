import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Product, PRODUCT_DATASET } from '../data/product-dataset';
import { getRecommendations } from '../lib/recommendations';

interface RecommendationsProps {
  currentProductId: string;
  onProductClick: (product: Product) => void;
}

export function Recommendations({ currentProductId, onProductClick }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    // Generate recommendations using the weighted logic
    const results = getRecommendations(currentProductId, PRODUCT_DATASET, 4);
    setRecommendations(results);
  }, [currentProductId]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-20 pt-20 border-t border-ojo-stone/10">
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard">OJO Discover</span>
            <h3 className="text-3xl font-serif italic text-ojo-charcoal">You may also like</h3>
          </div>
          <div className="flex items-center gap-4 text-ojo-mustard opacity-40 hover:opacity-100 transition-opacity cursor-pointer font-black text-[9px] uppercase tracking-[0.3em]">
             <span>View Collection</span>
             <ArrowRight size={14} />
          </div>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide -mx-2 px-2 snap-x">
          {recommendations.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[280px] w-[280px] group cursor-pointer space-y-4 snap-start"
              onClick={() => onProductClick(product)}
            >
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-ojo-beige/40 border border-ojo-charcoal/5">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {product.gi_tag && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md py-1 px-3 font-black text-[8px] tracking-widest text-ojo-gold border border-ojo-gold/20 shadow-sm rounded-full">
                       GI-Tagged
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-ojo-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">View Record</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                   <h4 className="text-lg font-serif italic text-ojo-charcoal truncate flex-1">{product.name}</h4>
                   <span className="text-sm font-mono text-ojo-terracotta font-bold italic">₹{product.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/30">{product.origin.toUpperCase().replace('_', ' ')}</span>
                   {product.verified_status && <ShieldCheck size={12} className="text-ojo-gold opacity-60" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

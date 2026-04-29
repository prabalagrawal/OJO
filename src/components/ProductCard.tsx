import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Award, Star, Maximize2 } from "lucide-react";
import { KolamBorder } from "./Navigation/Patterns.tsx";
import { Product } from "../data/product-dataset";

interface ProductCardProps {
  product: Product;
  isLarge?: boolean;
  onClick?: () => void;
  onHover?: (product: Product, event: React.MouseEvent) => void;
  onHoverEnd?: () => void;
}

export function ProductCard({ product, isLarge = false, onClick, onHover, onHoverEnd }: ProductCardProps) {
  // Use images array if available, otherwise fallback to single image
  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const originText = product.origin.toUpperCase().replace('_', ' ');
  const artisan = product.artisanName || "Verified Master Artisan";
  
  return (
    <motion.div 
      onClick={onClick}
      onMouseEnter={(e) => onHover?.(product, e)}
      onMouseLeave={() => onHoverEnd?.()}
      whileHover={{ y: -12, scale: 1.01 }}
      className={`group cursor-pointer bg-white p-4 md:p-6 transition-all duration-700 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(196,175,39,0.1)] relative overflow-hidden flex flex-col ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}
      style={{ borderRadius: '1.5rem' }}
    >
      {/* Kolam accent at the top */}
      <div className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
        <KolamBorder height={4} />
      </div>

      <div className={`relative ${isLarge ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden rounded-[1rem] bg-ojo-beige/20 mb-8 border border-ojo-charcoal/5`}>
        <img 
          src={images[0]} 
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
          alt={product.name} 
        />
        <div className="absolute inset-0 bg-ojo-charcoal opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700" />
        
        {product.gi_tag && (
           <div className="absolute top-4 left-4">
              <span className="bg-ojo-terracotta text-ojo-beige text-[8px] font-black px-3 py-1.5 uppercase tracking-[0.2em] shadow-lg rounded-full">
                GI Certified
              </span>
           </div>
        )}
      </div>

      <div className="space-y-6 relative z-10 flex-grow flex flex-col justify-between">
        <div className="space-y-2 text-center md:text-left">
           <div className="flex flex-col md:flex-row items-center md:items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ojo-terracotta">{originText}</span>
              <div className="hidden md:block h-px w-4 bg-ojo-charcoal/10" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ojo-gold/60">{artisan}</span>
           </div>
           <h3 className={`font-serif italic text-ojo-charcoal group-hover:text-ojo-terracotta transition-colors leading-tight ${isLarge ? 'text-4xl md:text-6xl' : 'text-xl md:text-2xl'}`}>
              {product.name}
           </h3>
        </div>

        <div className="flex flex-col gap-4 pt-6 mt-auto border-t border-ojo-charcoal/5">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
               <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/30">Valuation</span>
               <div className={`font-mono text-ojo-charcoal font-bold ${isLarge ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
                 ₹{product.price.toLocaleString()}
               </div>
            </div>
            <div className="flex items-center gap-1 text-ojo-gold opacity-60 group-hover:opacity-100 transition-opacity">
              <Star size={10} fill="currentColor" />
              <span className="text-[9px] font-black">4.9</span>
            </div>
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.98 }}
            className="w-full relative overflow-hidden group/btn border border-ojo-terracotta/20 py-4 transition-all duration-500 overflow-hidden rounded-xl bg-ojo-beige/10 hover:bg-ojo-terracotta/5"
          >
            <div className="flex items-center justify-center gap-2 text-ojo-terracotta group-hover/btn:-translate-y-full transition-transform duration-500">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">View Masterpiece</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ojo-terracotta text-ojo-beige translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500">
              <Maximize2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Full Detail View</span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

const EyeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

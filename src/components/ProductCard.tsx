import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";
import { KolamBorder } from "./Navigation/Patterns.tsx";

interface Product {
  id: string;
  name: string;
  price: number;
  origin: string;
  images: string;
  isGI?: boolean;
}

interface ProductCardProps {
  product: Product;
  isLarge?: boolean;
  onClick?: () => void;
}

export function ProductCard({ product, isLarge = false, onClick }: ProductCardProps) {
  const images = JSON.parse(product.images);
  const originText = `Source: ${product.origin.split(',')[1]?.trim() || product.origin}`;
  
  return (
    <motion.div 
      onClick={onClick}
      className={`group cursor-pointer bg-ojo-beige p-4 md:p-6 transition-all duration-700 shadow-premium hover:shadow-warm relative overflow-hidden flex flex-col ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      {/* Kolam accent at the top */}
      <div className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-40 transition-opacity duration-700">
        <KolamBorder height={4} />
      </div>

      <div className={`relative ${isLarge ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden bg-white mb-8 border border-ojo-charcoal/5`}>
        <img 
          src={images[0]} 
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
          alt={product.name} 
        />
        <div className="absolute inset-0 bg-ojo-charcoal opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700" />
        
        {isLarge && (
           <div className="absolute top-6 left-6">
              <span className="bg-ojo-red text-ojo-beige text-[9px] font-black px-4 py-1.5 uppercase tracking-[0.2em] shadow-lg">
                Verified Heritage
              </span>
           </div>
        )}
      </div>

      <div className="space-y-6 relative z-10 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
           <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ojo-gold">{originText}</span>
              <ShieldCheck size={12} className="text-ojo-gold" />
           </div>
           <h3 className={`font-serif italic text-ojo-charcoal group-hover:text-ojo-red transition-colors leading-tight ${isLarge ? 'text-4xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
              {product.name}
           </h3>
        </div>

        <div className="flex flex-col gap-4 pt-6 border-t border-ojo-charcoal/10">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
               <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Valuation</span>
               <div className={`font-mono text-ojo-charcoal font-bold ${isLarge ? 'text-3xl' : 'text-xl'}`}>
                 ₹{product.price.toLocaleString()}
               </div>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative overflow-hidden group/btn border border-ojo-terracotta/40 py-3 transition-all duration-500 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2 text-ojo-gold group-hover/btn:-translate-y-full transition-transform duration-500">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Explore Piece</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ojo-terracotta text-ojo-beige translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500">
              <EyeIcon size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quick View</span>
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

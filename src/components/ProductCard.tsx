import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";
import { MotifSystem } from "./motifs.tsx";

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
  const originText = `Verified from ${product.origin.split(',')[1]?.trim() || product.origin}`;
  
  return (
    <motion.div 
      onClick={onClick}
      className={`group cursor-pointer bg-ojo-cream rounded-xl p-3 md:p-4 border border-ojo-stone/10 transition-all duration-500 shadow-premium hover:shadow-warm hover:-translate-y-[6px] relative overflow-hidden ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      {/* Subtle Hover Pattern Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none">
        <MotifSystem type="ajrakh" scale={1.2} opacity={1} />
      </div>

      <div className={`${isLarge ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden rounded-lg bg-white mb-6 relative`}>
        <img 
          src={images[0]} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
          alt={product.name} 
        />
        {isLarge && (
           <div className="absolute top-4 left-4">
              <span className="bg-ojo-charcoal text-white text-[9px] font-bold px-3 py-1 uppercase tracking-[0.2em] rounded-sm flex items-center gap-2">
                <Award size={10} className="text-ojo-mustard" />
                GI Certified
              </span>
           </div>
        )}
      </div>

      <div className="space-y-4 relative z-10 px-1">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
             <h3 className={`font-serif text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-tight ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                {product.name}
             </h3>
             <div className="flex items-center gap-2">
                <p className="text-[10px] md:text-[11px] text-ojo-charcoal/40 font-bold uppercase tracking-widest">{originText}</p>
                <ShieldCheck size={12} className="text-ojo-mustard opacity-60" />
             </div>
          </div>
          <div className={`font-mono text-ojo-charcoal font-bold whitespace-nowrap ${isLarge ? 'text-2xl' : 'text-lg'}`}>
            ₹{product.price.toLocaleString()}
          </div>
        </div>
        
        <div className="pt-2 flex items-center justify-between border-t border-ojo-stone/5">
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ojo-mustard opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">Authentic Source</span>
           <ArrowRight size={14} className="text-ojo-charcoal/20 group-hover:text-ojo-mustard transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}

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

        <div className="flex items-end justify-between pt-6 border-t border-ojo-charcoal/10">
          <div className="space-y-1">
             <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Valuation</span>
             <div className={`font-mono text-ojo-charcoal font-bold ${isLarge ? 'text-3xl' : 'text-xl'}`}>
               ₹{product.price.toLocaleString()}
             </div>
          </div>
          <motion.div 
            whileHover={{ x: 10 }}
            className="w-12 h-12 rounded-full border border-ojo-charcoal/10 flex items-center justify-center text-ojo-charcoal group-hover:border-ojo-gold group-hover:text-ojo-gold transition-all"
          >
             <ArrowRight size={20} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

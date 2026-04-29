import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../data/product-dataset';
import { useCart } from '../hooks/useCart';

interface StickyAddToCartProps {
  product: Product;
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 inset-x-0 z-[90] bg-[#111111]/95 backdrop-blur-md border-t border-ojo-stone/10 p-4 md:p-6"
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 overflow-hidden">
               <div className="w-12 h-16 bg-ojo-beige/10 flex-shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
               </div>
               <div className="hidden sm:block">
                  <h4 className="text-white font-serif text-lg leading-tight truncate max-w-[200px]">{product.name}</h4>
                  <p className="text-ojo-mustard font-sans text-xs font-black uppercase tracking-widest">₹{product.price.toLocaleString()}</p>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <button 
                 onClick={() => addToCart(product)}
                 className="ojo-btn-primary !py-4 !px-8 !text-[11px] md:!px-12 flex items-center gap-4"
               >
                  <ShoppingBag size={18} />
                  <span className="hidden xs:inline">Add to Collection</span>
                  <span className="xs:hidden">Add</span>
               </button>
               <button 
                 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                 className="w-12 h-12 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/5 transition-colors"
               >
                  <ArrowRight size={20} className="-rotate-90" />
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

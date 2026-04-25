import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ShieldCheck, Star, Truck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { MotifSystem } from './motifs';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string | string[];
  category: string;
  origin: string;
  artisanName?: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  if (!product) return null;
  
  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ojo-charcoal/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 m-auto w-full max-w-6xl h-[90vh] md:h-auto md:max-h-[85vh] bg-white rounded-[4rem] shadow-4xl z-[110] overflow-hidden flex flex-col md:flex-row border-8 border-white"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-20 w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-xl flex items-center justify-center border border-white/20 hover:bg-white transition-all shadow-xl"
            >
              <X size={20} className="text-ojo-charcoal" />
            </button>

            {/* Left: Swiper-like Image Section */}
            <div className="w-full md:w-1/2 h-80 md:h-full relative overflow-hidden bg-ojo-cream">
              <img 
                src={images[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop"} 
                className="w-full h-full object-cover grayscale" 
                alt={product.name} 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/40 to-transparent" />
              
              <div className="absolute bottom-8 left-8">
                <span className="ojo-label ojo-label-verified border-none shadow-2xl">
                  Ref: {product.id.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Right: Content Section */}
            <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto relative flex flex-col justify-between">
              <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none p-10 h-full w-full">
                <MotifSystem type="kolam" scale={1.2} />
              </div>
              
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard px-4 py-2 border border-ojo-mustard/20 rounded-full">
                       {product.category}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40">
                       Provenance: {product.origin}
                    </span>
                  </div>
                  <h2 className="text-5xl font-serif italic text-ojo-charcoal leading-none tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-ojo-mustard/60 italic">
                    By Master {product.artisanName || "Verified Heritage"}
                  </p>
                </div>

                <div className="text-4xl font-mono text-ojo-charcoal">
                  ₹{product.price?.toLocaleString()}
                </div>

                <div className="space-y-4">
                   <p className="text-lg text-ojo-charcoal/60 leading-relaxed font-light italic">
                      {product.description || "Each piece is hand-crafted using traditional heritage methods passed down through generations, ensuring GI-certified authenticity."}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-ojo-stone/10">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-ojo-cream rounded-xl text-ojo-mustard border border-ojo-mustard/10 shadow-sm">
                         <ShieldCheck size={18} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60">Traceable Provenance</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-ojo-cream rounded-xl text-ojo-mustard border border-ojo-mustard/10 shadow-sm">
                         <Truck size={18} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60">Secure Transport</span>
                   </div>
                </div>
              </div>

              <div className="pt-12 relative z-10 space-y-4">
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="ojo-btn-primary w-full py-8 !text-sm flex items-center justify-center gap-4 group hover:scale-[1.02] transition-transform"
                >
                  <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                  Secure This Record
                </button>
                <p className="text-[9px] text-center uppercase font-black tracking-[0.3em] text-ojo-charcoal/30 flex items-center justify-center gap-2">
                   <Star size={10} className="text-ojo-mustard fill-ojo-mustard" /> 100% Authentic Registry Item
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

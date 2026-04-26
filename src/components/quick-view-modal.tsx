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
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 m-auto w-full max-w-6xl h-full md:h-[80vh] bg-white z-[110] overflow-hidden flex flex-col md:flex-row shadow-deep"
            style={{ borderRadius: '6rem 1rem 1rem 1rem' }}
          >
            <button 
              onClick={onClose}
              className="absolute top-10 right-10 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-3xl flex items-center justify-center border border-white/20 hover:bg-white transition-all shadow-2xl group"
            >
              <X size={24} className="text-ojo-stone group-hover:rotate-90 transition-transform" />
            </button>

            {/* Left: Swiper-like Image Section */}
            <div className="w-full md:w-1/2 h-96 md:h-full relative overflow-hidden bg-ojo-cream">
              <img 
                src={images[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop"} 
                className="w-full h-full object-cover grayscale transition-transform duration-[4s] hover:scale-105" 
                alt={product.name} 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/30 to-transparent" />
              
              <div className="absolute bottom-12 left-12">
                <div className="ojo-badge ojo-badge-verified">
                  Catalog ID: {product.id.slice(-8).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Right: Content Section */}
            <div className="w-full md:w-1/2 p-12 md:p-20 overflow-y-auto relative flex flex-col justify-between bg-white">
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none p-10 h-full w-full">
                <MotifSystem type="jaali" scale={1.5} />
              </div>
              
              <div className="relative z-10 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="ojo-badge !bg-ojo-mustard/10 !text-ojo-mustard !border-ojo-mustard/20">
                       {product.category}
                    </span>
                    <div className="h-px w-8 bg-ojo-stone/20" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40">
                       {product.origin}
                    </span>
                  </div>
                  <h2 className="text-6xl font-serif italic text-ojo-charcoal leading-none tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-ojo-mustard/60 italic">
                    Authored by {product.artisanName || "Verified Heritage Guild"}
                  </p>
                </div>

                <div className="text-5xl font-mono text-ojo-charcoal">
                  ₹{product.price?.toLocaleString()}
                </div>

                <div className="space-y-6">
                   <p className="text-xl text-ojo-charcoal/60 leading-relaxed font-light italic">
                      {product.description || "Each artifact is hand-crafted using traditional heritage methods passed down through generations, ensuring GI-certified authenticity and sovereign trust."}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-ojo-stone/10">
                   <div className="flex items-center gap-4">
                      <ShieldCheck size={20} className="text-ojo-mustard" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-ojo-charcoal/60">Verified Origin</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <Truck size={20} className="text-ojo-mustard" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-ojo-charcoal/60">Global Cluster Track</span>
                   </div>
                </div>
              </div>

              <div className="pt-12 relative z-10 space-y-6">
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="ojo-btn-primary w-full py-8 !text-sm group flex items-center justify-center gap-6"
                >
                  <ShoppingBag size={24} />
                  Secure This Record
                </button>
                <div className="flex justify-center items-center gap-4 opacity-30">
                   <div className="h-px flex-1 bg-ojo-charcoal" />
                   <Star size={12} fill="currentColor" className="text-ojo-mustard" />
                   <div className="h-px flex-1 bg-ojo-charcoal" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

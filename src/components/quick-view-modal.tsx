import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ShieldCheck, Star, Truck, RefreshCw, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { MotifSystem } from './motifs';
import { Recommendations } from './recommendations';
import { BottomSheet } from './bottom-sheet';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string | string[];
  category: string;
  origin: string;
  artisanName?: string;
  tags?: string[];
  popularity_score?: number;
  gi_tag?: boolean;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any) => void;
  onProductUpdate?: (product: any) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart, onProductUpdate }: QuickViewModalProps) {
  if (!product) return null;
  
  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]");
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const content = (
    <div className="space-y-8 pb-32 md:pb-0">
      {/* Mobile Image Section */}
      <div className="md:hidden -mx-6 -mt-8 aspect-[4/5] relative overflow-hidden rounded-b-[3rem] shadow-2xl">
        <img 
          src={images[0] || (product as any).image} 
          className="w-full h-full object-cover" 
          alt={product.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/40 to-transparent" />
        <div className="absolute bottom-10 left-10">
          <div className="ojo-badge ojo-badge-verified">
            ID: {product.id.slice(-8).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="ojo-badge !bg-ojo-mustard/10 !text-ojo-mustard !border-ojo-mustard/20 text-[8px] md:text-[10px]">
             {product.category}
          </span>
          <div className="h-px w-6 md:w-8 bg-ojo-stone/20" />
          <span className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-ojo-charcoal/40">
             {product.origin.replace('_', ' ')}
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-serif italic text-ojo-charcoal leading-none tracking-tight">
          {product.name}
        </h2>
        <p className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-ojo-mustard/60 italic">
          Authored by {product.artisanName || "Verified Heritage Guild"}
        </p>
      </div>

      <div className="flex items-center justify-between py-6 border-y border-ojo-stone/5">
        <div className="text-4xl md:text-5xl font-mono text-ojo-charcoal">
          ₹{product.price?.toLocaleString()}
        </div>
        {product.gi_tag && (
          <div className="ojo-badge !bg-ojo-cream !text-ojo-mustard !border-ojo-mustard/30 text-[8px]">
             GI-Certified
          </div>
        )}
      </div>

      <div className="space-y-6">
         <p className="text-lg md:text-xl text-ojo-charcoal/60 leading-relaxed font-light italic">
            {product.description || (product as any).short_description || "Each artifact is hand-crafted using traditional heritage methods passed down through generations, ensuring GI-certified authenticity and sovereign trust."}
         </p>
      </div>

      <div className="grid grid-cols-2 gap-6 py-6 border-y border-ojo-stone/5">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-ojo-mustard" />
            <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">Verified Origin</span>
         </div>
         <div className="flex items-center gap-3">
            <Truck size={18} className="text-ojo-mustard" />
            <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">Cluster Track</span>
         </div>
      </div>

      <button 
        onClick={() => {
          onAddToCart(product);
          onClose();
        }}
        className="fixed md:relative bottom-10 left-6 right-6 md:bottom-0 md:left-0 md:right-0 z-50 ojo-btn-primary py-6 md:py-8 !text-sm group flex items-center justify-center gap-4 md:gap-6 shadow-2xl md:shadow-none"
      >
        <ShoppingBag size={20} />
        Add to Collection
      </button>

      <Recommendations 
        currentProductId={product.id} 
        onProductClick={(p) => {
          if (onProductUpdate) {
            onProductUpdate(p);
            const container = document.querySelector('.overflow-y-auto');
            if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }} 
      />
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Product Detail"
      >
        {content}
      </BottomSheet>
    );
  }

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
            className="fixed inset-0 m-auto w-full max-w-7xl h-full md:h-[90vh] bg-white z-[110] overflow-hidden flex flex-col md:flex-row shadow-deep"
            style={{ borderRadius: '6rem 1rem 1rem 1rem' }}
          >
            <button 
              onClick={onClose}
              className="absolute top-10 right-10 z-[120] w-14 h-14 rounded-full bg-white/20 backdrop-blur-3xl flex items-center justify-center border border-white/20 hover:bg-white transition-all shadow-2xl group"
            >
              <X size={24} className="text-ojo-stone group-hover:rotate-90 transition-transform" />
            </button>

            {/* Left Decor Image Area */}
            <div className="w-full md:w-1/2 h-full relative overflow-hidden bg-ojo-cream flex-shrink-0">
              <img 
                src={images[0] || (product as any).image} 
                className="w-full h-full object-cover transition-transform duration-[4s] hover:scale-105" 
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

            {/* Right Scrollable Content */}
            <div className="w-full md:w-1/2 p-20 overflow-y-auto relative bg-white">
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none p-10 h-64 w-full">
                <MotifSystem type="jaali" scale={1.5} />
              </div>
              <div className="relative z-10">
                {content}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

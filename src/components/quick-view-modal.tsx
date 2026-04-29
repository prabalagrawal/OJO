import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Star, 
  Truck, 
  RefreshCw, 
  ChevronDown, 
  Plus, 
  Minus, 
  Share2, 
  Maximize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { MotifSystem } from './motifs';
import { Recommendations } from './recommendations';
import { BottomSheet } from './bottom-sheet';

interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  short_description?: string;
  image: string;
  images?: string[];
  category: string;
  origin: string;
  artisanName?: string;
  artisanPhoto?: string;
  artisanBio?: string;
  originStory?: string;
  availableColors?: ColorOption[];
  availableSizes?: string[];
  tags?: string[];
  gi_tag?: boolean;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any, quantity: number, options: any) => void;
  onProductUpdate?: (product: any) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart, onProductUpdate }: QuickViewModalProps) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedColor(product.availableColors?.[0] || null);
      setSelectedSize(product.availableSizes?.[0] || '');
    }
  }, [product]);

  if (!product) return null;
  
  const images = product.images || [product.image];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const currentImage = selectedColor?.image || images[selectedImage];

  const content = (
    <div className="space-y-12 pb-32 md:pb-0">
      {/* Product Title & Basic Info */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="bg-ojo-terracotta/10 text-ojo-terracotta text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
             {product.category}
          </span>
          <div className="h-px w-8 bg-ojo-charcoal/10" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40">
             {product.origin.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl md:text-7xl font-serif italic text-ojo-charcoal leading-none tracking-tight">
            {product.name}
          </h2>
          <div className="flex items-center gap-4 text-ojo-gold">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">48 Collected Reviews</span>
          </div>
        </div>
      </div>

      {/* Pricing & GI Tag */}
      <div className="flex items-center justify-between py-8 border-y border-ojo-charcoal/5">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 italic">Heritage Valuation</span>
          <div className="text-5xl md:text-6xl font-mono text-ojo-charcoal font-bold">
            ₹{product.price?.toLocaleString()}
          </div>
        </div>
        {product.gi_tag && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-ojo-gold flex items-center justify-center animate-[spin_10s_linear_infinite]">
               <ShieldCheck size={24} className="text-ojo-gold" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-ojo-gold">GI-Certified</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-8">
         <p className="text-2xl md:text-3xl text-ojo-charcoal leading-relaxed font-serif italic">
            {product.short_description || "Every artifact is a bridge between the physical and the metaphysical, hand-crafted using traditional heritage methods passed down through sovereign generations."}
         </p>
         
         <div className="grid grid-cols-2 gap-8 py-8 border-y border-ojo-charcoal/5">
           <div>
             <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 block mb-2">Materiality</span>
             <span className="text-sm font-medium text-ojo-charcoal">Hand-spun Natural Fibers</span>
           </div>
           <div>
             <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 block mb-2">Technique</span>
             <span className="text-sm font-medium text-ojo-charcoal">Heritage Loom / Hand-cast</span>
           </div>
           <div>
             <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 block mb-2">Origin Sanctuary</span>
             <span className="text-sm font-medium text-ojo-charcoal">{product.origin.toUpperCase()}</span>
           </div>
           <div>
             <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 block mb-2">Authentication</span>
             <span className="text-sm font-medium text-ojo-charcoal">OJO Sovereign Verified</span>
           </div>
         </div>
      </div>

      {/* Customization Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-t border-ojo-charcoal/5">
        {/* Color Swatches */}
        {product.availableColors && product.availableColors.length > 0 && (
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-charcoal">Hues of Heritage</span>
            <div className="flex gap-4">
              {product.availableColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`group relative w-12 h-12 rounded-full border-2 transition-all p-1 ${
                    selectedColor?.name === color.name ? 'border-ojo-terracotta scale-110 shadow-lg' : 'border-transparent hover:border-ojo-charcoal/20'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
                  </div>
                  <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-widest transition-opacity ${selectedColor?.name === color.name ? 'opacity-100' : 'opacity-0'}`}>
                    {color.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-charcoal">Dimensions</span>
            <div className="relative">
              <select 
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full appearance-none bg-ojo-beige border border-ojo-charcoal/10 rounded-none px-6 py-4 text-[11px] font-black uppercase tracking-widest focus:border-ojo-terracotta outline-none"
              >
                {product.availableSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" size={16} />
            </div>
          </div>
        )}
      </div>

      {/* Cart & CTAs */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex items-center border border-ojo-charcoal/10 px-4 py-2">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:text-ojo-terracotta transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-mono font-bold text-lg">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:text-ojo-terracotta transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <button 
          onClick={() => {
            onAddToCart(product, quantity, { color: selectedColor, size: selectedSize });
          }}
          className="flex-grow bg-[#1a4d2e] text-ojo-beige px-10 py-5 rounded-none font-black text-[12px] uppercase tracking-[0.4em] hover:bg-ojo-charcoal transition-all duration-500 shadow-xl group flex items-center justify-center gap-4"
        >
          <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
          Acquire Piece
        </button>
        
        <button 
          onClick={() => {
            onAddToCart(product, quantity, { color: selectedColor, size: selectedSize });
            onClose();
            navigate("/checkout");
          }}
          className="bg-ojo-terracotta text-ojo-beige px-10 py-5 rounded-none font-black text-[12px] uppercase tracking-[0.4em] hover:bg-ojo-charcoal transition-all duration-500 flex items-center justify-center"
        >
          Buy Now
        </button>
      </div>

      {/* Artisan & Story Section */}
      <div className="space-y-12 py-16 border-t border-ojo-charcoal/5">
        <div className="flex flex-col md:flex-row gap-12 items-start bg-ojo-beige/40 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
            <MotifSystem type="mandala" scale={1.5} />
          </div>
          
          {/* Artisan Profile */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-ojo-gold p-1 shadow-2xl">
              <img 
                src={product.artisanPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"} 
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-1000" 
                alt={product.artisanName} 
              />
            </div>
            <div>
              <h4 className="text-2xl font-serif italic text-ojo-charcoal">{product.artisanName || "Heritage Weaver"}</h4>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ojo-gold">Master Artisan • 30+ Years</span>
            </div>
            <p className="text-sm text-ojo-charcoal/60 leading-relaxed italic">
              {product.artisanBio || "Dedicated to preserving the ancestral rhythms of Indian craftsmanship, ensuring every weave tells a story of sovereign heritage."}
            </p>
          </div>

          {/* Origin Story */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-grow bg-ojo-charcoal/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ojo-charcoal/40">The Origin Narrative</span>
              <div className="h-px flex-grow bg-ojo-charcoal/10" />
            </div>
            <div className="prose prose-stone max-w-none">
              <p className="text-lg text-ojo-charcoal/80 leading-relaxed font-serif italic">
                {product.originStory || "Born in the ancient clusters of central Bharat, this piece is a living record of a lineage that transcends modern mass-production. Every element is harvested with respect for the seasonal cycles of nature."}
              </p>
              <p className="text-lg text-ojo-charcoal/80 leading-relaxed font-serif italic">
                The process involves multiple stages of purification and artistic focus, where the practitioner enters a state of flow to imbed the spirit of the craft into the material. This is not just a product; it is a piece of living history.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-ojo-charcoal/5">
        <div className="flex flex-col items-center text-center p-6 space-y-3">
          <ShieldCheck className="text-ojo-gold" size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal">Sovereign Trust</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 space-y-3">
          <Truck className="text-ojo-gold" size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal">Climate Conscious</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 space-y-3">
          <RefreshCw className="text-ojo-gold" size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal">Cluster Direct</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 space-y-3">
          <Share2 className="text-ojo-gold" size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal">Fair Return</span>
        </div>
      </div>

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
        title={product.name}
      >
        <div className="p-6">
          {content}
        </div>
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
            className="fixed inset-0 bg-[#0c0c0c]/80 backdrop-blur-2xl z-[1001]"
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 md:inset-4 bg-white z-[1002] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5"
            style={{ borderRadius: isMobile ? '0' : '2.5rem' }}
          >
            {/* Immersive Background Blur for context */}
            <div className="absolute inset-0 bg-ojo-beige/50 pointer-events-none" />

            {/* Header Actions */}
            <div className="absolute top-6 md:top-12 right-6 md:right-12 z-[120] flex gap-4">
              <button className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/40 backdrop-blur-3xl flex items-center justify-center border border-white/20 hover:bg-white transition-all shadow-2xl group">
                <Share2 size={20} className="text-ojo-charcoal" />
              </button>
              <button 
                onClick={onClose}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-ojo-charcoal text-white flex items-center justify-center border border-white/10 hover:bg-ojo-terracotta transition-all shadow-2xl group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Left: Interactive Image Gallery */}
            <div className="w-full md:w-[55%] h-[60vh] md:h-full relative overflow-hidden bg-ojo-beige/20 flex flex-col">
              {/* Main Image with Zoom */}
              <div 
                ref={imageRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                className="relative flex-grow overflow-hidden cursor-zoom-in"
              >
                <motion.img 
                  animate={{ 
                    scale: isZoomed ? 2 : 1,
                    x: isZoomed ? -(zoomPos.x - 50) * 1 : 0,
                    y: isZoomed ? -(zoomPos.y - 50) * 1 : 0
                  }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  src={currentImage} 
                  className="w-full h-full object-cover" 
                  alt={product.name} 
                  referrerPolicy="no-referrer"
                />
                
                {/* Navigation Arrows */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((selectedImage - 1 + images.length) % images.length);
                    }}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center pointer-events-auto hover:bg-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((selectedImage + 1) % images.length);
                    }}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center pointer-events-auto hover:bg-white transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="absolute bottom-10 left-10 right-10 flex justify-center gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setSelectedColor(null);
                    }}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white ${
                      idx === selectedImage && !selectedColor ? 'border-ojo-terracotta scale-110 shadow-xl' : 'border-white/20 hover:border-white/60'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                  </button>
                ))}
                {product.availableColors?.map((color, idx) => (
                  <button
                    key={'color-' + idx}
                    onClick={() => setSelectedColor(color)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white ${
                      selectedColor?.name === color.name ? 'border-ojo-terracotta scale-110 shadow-xl' : 'border-white/20 hover:border-white/60'
                    }`}
                  >
                    <img src={color.image} className="w-full h-full object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Scrollable Content */}
            <div className="w-full md:w-[45%] h-full overflow-y-auto relative bg-white border-l border-ojo-charcoal/5">
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none p-10 h-96 w-full">
                <MotifSystem type="jaali" scale={2} />
              </div>
              <div className="relative z-10 p-10 md:p-20">
                {content}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

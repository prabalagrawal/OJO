import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Star, 
  Heart,
  Plus, 
  Minus,
  Maximize2 
} from 'lucide-react';
import { Product } from '../../data/product-dataset';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedSize(product.availableSizes?.[0] || '');
      setSelectedColor(product.availableColors?.[0] || null);
    }
  }, [product]);

  if (!product) return null;

  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const currentImage = selectedColor?.image || images[selectedImage];
  const originText = product.origin.toUpperCase().replace('_', ' ');
  const usdPrice = Math.round(product.price / 83); // Simple constant exchange rate

  const handleAddToCart = () => {
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ojo-charcoal/70 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white w-full max-w-[900px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            style={{ maxHeight: 'calc(100vh - 40px)' }}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-ojo-charcoal/40 hover:text-ojo-charcoal transition-colors"
            >
              <X size={24} />
            </button>

            {/* LEFT: Image Gallery */}
            <div className="w-full md:w-1/2 p-6 bg-ojo-beige/10 flex flex-col gap-4">
              <div className="aspect-[4/5] bg-ojo-beige/30 overflow-hidden relative group">
                <img 
                  src={currentImage} 
                  className="w-full h-full object-cover" 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 rounded-full border border-ojo-gold/30 bg-white/80 backdrop-blur flex items-center justify-center">
                    <ShieldCheck size={20} className="text-ojo-gold" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setSelectedColor(null);
                    }}
                    className={`w-16 h-20 flex-shrink-0 border-2 transition-all ${
                      selectedImage === idx && !selectedColor ? 'border-ojo-gold' : 'border-transparent hover:border-ojo-stone/20'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Info */}
            <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-stone italic">🏺 {originText}</span>
                  </div>
                  <h2 className="text-3xl font-serif text-ojo-charcoal leading-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-0.5 text-ojo-gold">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} fill={i <= 4 ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-ojo-charcoal/40 font-sans tracking-wider">(128 reviews)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-serif font-black text-ojo-charcoal">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-ojo-stone line-through">₹{(product.price * 1.2).toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] font-black text-ojo-gold uppercase tracking-widest font-sans">
                    ~$ {usdPrice} USD
                  </p>
                </div>

                <div className="bg-ojo-beige/20 p-4 border-l-2 border-ojo-gold">
                   <p className="text-xs text-ojo-charcoal/60 leading-relaxed italic">
                     {product.originStory?.substring(0, 120)}...
                   </p>
                </div>

                {/* Variants */}
                <div className="space-y-6">
                  {product.availableColors && (
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-widest">Heritage Palette</span>
                      <div className="flex gap-3">
                        {product.availableColors.map(color => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                              selectedColor?.name === color.name ? 'border-ojo-gold scale-110' : 'border-transparent hover:border-ojo-stone/20'
                            }`}
                          >
                            <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.availableSizes && (
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-widest">Dimension</span>
                      <div className="flex flex-wrap gap-2">
                        {product.availableSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                              selectedSize === size ? 'border-ojo-gold text-ojo-gold bg-ojo-gold/5' : 'border-ojo-stone/10 text-ojo-stone hover:border-ojo-stone'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Counter & Actions */}
                <div className="flex flex-col gap-4 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-ojo-stone/10 rounded">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 text-ojo-stone hover:text-ojo-charcoal transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-mono font-bold">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 text-ojo-stone hover:text-ojo-charcoal transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="flex-grow py-4 border border-ojo-stone/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-ojo-beige/20 transition-all rounded"
                    >
                      <Heart size={16} fill={isWished(product.id) ? "#C1441A" : "none"} className={isWished(product.id) ? "text-ojo-terracotta" : "text-ojo-stone"} />
                      {isWished(product.id) ? "Saved to Collection" : "Add to Wishlist"}
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className="ojo-btn-primary w-full !py-5"
                  >
                    <ShoppingBag size={18} />
                    Acquire Piece
                  </button>

                  <div className="flex items-center justify-between px-2 pt-4 border-t border-ojo-stone/5">
                    <div className="flex items-center gap-4 opacity-40">
                      <ShieldCheck size={14} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Sovereign Tested</span>
                    </div>
                    <button 
                      onClick={() => {
                        onClose();
                        window.location.href = `/product/${product.id}`;
                      }}
                      className="text-[10px] font-black text-ojo-gold uppercase tracking-[0.2em] hover:text-ojo-terracotta transition-colors flex items-center gap-2"
                    >
                      Full Narrative <Maximize2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

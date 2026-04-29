import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Eye, 
  Star, 
  ShoppingCart, 
  CheckCircle2, 
  Truck,
  ArrowRight
} from "lucide-react";
import { Product } from "../../data/product-dataset";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isWished } = useWishlist();

  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const secondImage = images[1] || images[0];
  
  const originText = product.origin.toUpperCase().replace('_', ' ');
  const usdPrice = Math.round(product.price / 83);
  
  const hasBestSellerBadge = product.popularity_score > 90;
  const hasNewBadge = product.id.startsWith('tx_001') || product.id.startsWith('hc_001'); // Mock logic for demo
  const hasLimitedBadge = product.price > 15000;
  const compareAtPrice = product.price * 1.25; // Mock for demo

  // Calculate dynamic delivery date (3-5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const day = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short' });
  const dateNum = deliveryDate.getDate();
  const month = deliveryDate.toLocaleDateString('en-IN', { month: 'short' });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-none shadow-premium hover:shadow-warm transition-all duration-500 overflow-hidden border border-ojo-stone/10 flex flex-col h-full"
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="relative aspect-[4/5] bg-ojo-beige overflow-hidden cursor-pointer" onClick={() => window.location.href = `/product/${product.id}`}>
        {/* Hover Crossfade */}
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={isHovered ? 'second' : 'first'}
            src={isHovered ? secondImage : images[0]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
            alt={product.name}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasNewBadge && (
            <span className="bg-ojo-gold text-ojo-charcoal text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-sm shadow-sm backdrop-blur-sm">
              New
            </span>
          )}
          {hasBestSellerBadge && (
            <span className="bg-ojo-terracotta text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-sm shadow-sm backdrop-blur-sm">
              Bestseller
            </span>
          )}
          {!hasBestSellerBadge && hasLimitedBadge && (
            <span className="bg-ojo-red text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-sm shadow-sm backdrop-blur-sm">
              Limited
            </span>
          )}
          {compareAtPrice && (
            <span className="bg-ojo-charcoal/80 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-sm shadow-sm backdrop-blur-sm">
              Sale
            </span>
          )}
        </div>

        {/* OJO VERIFIED BADGE */}
        <div className="absolute top-3 right-3 group/verified z-20">
          <div className="w-8 h-8 rounded-full border-2 border-ojo-gold flex items-center justify-center bg-white/40 backdrop-blur-md shadow-lg transition-transform group-hover/verified:rotate-12">
            <span className="text-[7px] font-black text-ojo-gold tracking-tighter">✓ OJO</span>
          </div>
          <div className="absolute top-10 right-0 w-40 bg-ojo-charcoal text-white text-[8px] p-2 rounded shadow-2xl opacity-0 group-hover/verified:opacity-100 transition-all pointer-events-none translate-y-2 group-hover/verified:translate-y-0 uppercase tracking-widest font-black text-center z-50">
            Verified Source • Quality Checked • Origin Tracked
          </div>
        </div>

        {/* WISHLIST BUTTON */}
        <button 
          onClick={handleWishlist}
          className="absolute top-14 right-3 z-30 p-2 group/wish"
        >
          <motion.div
            animate={isWished(product.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <Heart 
              size={22} 
              className={isWished(product.id) ? "text-ojo-terracotta fill-ojo-terracotta" : "text-white drop-shadow-md hover:text-ojo-terracotta transition-colors"} 
            />
            {hasBestSellerBadge && (
              <span className="text-[8px] font-black text-white drop-shadow-md">2.4k</span>
            )}
          </motion.div>
        </button>

        {/* QUICK VIEW BUTTON */}
        <motion.button
          initial={{ y: '100%' }}
          animate={{ y: isHovered ? '0%' : '100%' }}
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-0 inset-x-0 bg-ojo-charcoal/85 text-white py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] z-40 transition-colors hover:bg-ojo-charcoal"
        >
          <Eye size={14} /> Quick View
        </motion.button>
      </div>

      {/* 2. CARD BODY */}
      <div className="p-4 bg-white flex flex-col flex-grow">
        {/* ROW 1: Artisan/Origin */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-ojo-stone text-[9px] font-black uppercase tracking-[0.3em] truncate italic font-sans flex items-center gap-1.5">
            🏺 {product.artisanName?.split(' ')[0] || "Artisanal"} Core • {originText}
          </span>
        </div>

        {/* ROW 2: Product Name */}
        <h3 
          className="text-[17px] font-serif text-ojo-charcoal leading-tight mb-3 flex-grow line-clamp-2 min-h-[44px] cursor-pointer hover:text-ojo-gold transition-colors"
          onClick={() => window.location.href = `/product/${product.id}`}
        >
          {product.name}
        </h3>

        {/* ROW 3: Star Rating */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={11} fill={i <= 4 ? "#C4AF27" : "none"} className="text-ojo-gold" />
            ))}
          </div>
          <div className="flex items-center gap-1">
             <span className="text-[11px] font-black text-ojo-charcoal">4.8</span>
             <span className="text-ojo-stone text-[10px] font-medium font-sans">(128)</span>
          </div>
        </div>

        {/* ROW 4: Pricing */}
        <div className="space-y-1 mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-serif font-black text-ojo-charcoal">₹{product.price.toLocaleString()}</span>
            {compareAtPrice && (
              <span className="text-sm text-ojo-stone line-through font-mono">₹{compareAtPrice.toLocaleString()}</span>
            )}
            {compareAtPrice && (
              <div className="bg-ojo-terracotta text-white text-[7px] font-black px-2 py-0.5 tracking-widest uppercase">
                32% OFF
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-ojo-gold uppercase tracking-widest font-sans">
              ~$ {usdPrice} USD
            </span>
            {product.price > 1500 && (
              <span className="text-[9px] font-bold text-ojo-stone font-sans italic opacity-60">
                From ₹{Math.round(product.price / 12)}/month EMI
              </span>
            )}
          </div>
        </div>

        {/* ROW 5: Delivery Promise */}
        <div className="flex flex-col gap-1.5 mb-6">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A4D2E] animate-pulse" />
              <span className="text-[9px] font-bold text-[#1A4D2E] uppercase tracking-widest">
                Free Delivery by {day}, {dateNum} {month}
              </span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-[9px] font-medium text-ojo-stone uppercase tracking-widest opacity-60">
                💵 Cash on Delivery available
              </span>
           </div>
        </div>

        {/* ROW 6: ADD TO CART BUTTON */}
        <button 
          onClick={handleAddToCart}
          className={`w-full py-4 uppercase font-black text-[10px] tracking-[0.4em] transition-all duration-500 rounded-sm flex items-center justify-center gap-3 ${
            isAdded 
              ? 'bg-ojo-terracotta text-white scale-95' 
              : 'bg-ojo-gold text-ojo-charcoal hover:bg-[#A89520] hover:shadow-lg active:scale-95'
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle2 size={16} /> <span>✓ Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> <span>Add to Cart</span>
            </>
          )}
        </button>
        
        {/* Variant summary (subtle) */}
        {product.availableColors && (
          <div className="mt-4 flex gap-1.5 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {product.availableColors.slice(0, 4).map(c => (
              <div key={c.name} className="w-2 h-2 rounded-full border border-ojo-stone/10" style={{ backgroundColor: c.hex }} />
            ))}
            {product.availableColors.length > 4 && <span className="text-[7px] font-black text-ojo-stone/40">+{product.availableColors.length - 4}</span>}
          </div>
        )}
      </div>

      {/* 3. CARD FOOTER */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        className="px-4 py-3 border-t border-ojo-stone/5 bg-ojo-beige/5 flex items-center justify-center cursor-pointer"
        onClick={() => window.location.href = `/product/${product.id}`}
      >
        <span className="text-[9px] font-black text-ojo-gold uppercase tracking-[0.4em] flex items-center gap-2">
           View Narrative <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </motion.div>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Clock, 
  ChevronRight, 
  Gift, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../hooks/useCart';

export function FloatingElements() {
  const [showOffer, setShowOffer] = useState(false);
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
  const { items } = useCart();

  useEffect(() => {
    // Show offer after 30 seconds
    const offerTimer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('ojo_offer_dismissed');
      if (!dismissed) setShowOffer(true);
    }, 30000);

    // Show recently viewed after some time if there's history?
    // For now, let's just trigger it after 5 seconds if cart has items or fake it
    const recentTimer = setTimeout(() => {
      setShowRecentlyViewed(true);
    }, 10000);

    return () => {
      clearTimeout(offerTimer);
      clearTimeout(recentTimer);
    };
  }, []);

  const dismissOffer = () => {
    setShowOffer(false);
    sessionStorage.setItem('ojo_offer_dismissed', 'true');
  };

  return (
    <>
      {/* WHATSAPP FLOAT */}
      <div className="fixed bottom-8 right-8 z-[80] group">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative"
        >
          <a
            href="https://wa.me/911234567890?text=Hi OJO! I need help with my order."
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          >
            <MessageCircle size={32} fill="currentColor" />
          </a>
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#111111] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 shadow-xl pointer-events-none">
             Chat with OJO Support
          </div>
        </motion.div>
      </div>

      {/* RECENTLY VIEWED (Bottom Left) */}
      <AnimatePresence>
        {showRecentlyViewed && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed bottom-8 left-8 z-[80] bg-white border border-ojo-stone/10 p-4 shadow-2xl rounded-sm hidden xl:block w-72"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-ojo-stone">
                  <Clock size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Recently Browsed</span>
               </div>
               <button onClick={() => setShowRecentlyViewed(false)} className="text-ojo-stone/40 hover:text-ojo-red">
                  <X size={14} />
               </button>
            </div>
            
            <div className="flex gap-4 mb-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-16 h-20 bg-ojo-beige/40 rounded-sm overflow-hidden border border-ojo-stone/5 hover:border-ojo-gold cursor-pointer transition-colors">
                    <img src={`https://picsum.photos/seed/ojo${i}/100/150`} className="w-full h-full object-cover" alt="" />
                 </div>
               ))}
            </div>

            <button className="text-[9px] font-black text-ojo-gold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-ojo-terracotta transition-colors">
               View Full History <ChevronRight size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OFFER POPUP (Modal) */}
      <AnimatePresence>
        {showOffer && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismissOffer}
              className="absolute inset-0 bg-ojo-charcoal/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#111111] w-full max-w-lg p-1 overflow-hidden"
            >
              {/* Pattern Frame */}
              <div className="absolute inset-0 border-[6px] border-ojo-gold/20 pointer-events-none" />
              
              <div className="relative bg-white p-12 text-center space-y-8">
                 <button onClick={dismissOffer} className="absolute top-4 right-4 text-ojo-stone/40 hover:text-ojo-charcoal">
                    <X size={24} />
                 </button>

                 <div className="space-y-2">
                    <div className="flex justify-center text-ojo-gold mb-2">
                       <Sparkles size={32} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-ojo-gold">Welcome to the collective</span>
                    <h2 className="text-4xl md:text-5xl font-serif italic text-ojo-charcoal tracking-tighter">
                       A Gift for Your <br />
                       <span className="text-ojo-terracotta not-italic">First Heritage.</span>
                    </h2>
                 </div>

                 <p className="text-ojo-stone font-serif italic text-lg opacity-60">
                    Get extra ₹200 OFF on your first handcrafted masterpiece. Join 50,000+ patrons.
                 </p>

                 <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="YOUR EMAIL" 
                      className="w-full bg-ojo-beige/20 border border-ojo-stone/10 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-ojo-gold transition-all"
                    />
                    <button className="ojo-btn-primary w-full !py-5">
                       Claim Heritage Offer
                    </button>
                    <button 
                      onClick={dismissOffer}
                      className="text-[10px] font-black text-ojo-stone uppercase tracking-widest border-b border-ojo-stone/20 hover:text-ojo-red transition-colors"
                    >
                      I prefer exploring without a discount
                    </button>
                 </div>

                 <div className="pt-4 flex items-center justify-center gap-6 opacity-20">
                    <Gift size={20} />
                    <ShoppingBag size={20} />
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

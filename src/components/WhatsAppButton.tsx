import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000); // Appear after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi OJO! I need help with my order.");
    window.open(`https://wa.me/910000000000?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWhatsAppClick}
          className="fixed right-6 bottom-24 lg:bottom-10 z-[90] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20 transition-all hover:brightness-110 active:scale-95"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle size={28} fill="currentColor" className="text-white" />
          <motion.div 
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute -top-1 -right-1 w-4 h-4 bg-ojo-mustard rounded-full border-2 border-white" 
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

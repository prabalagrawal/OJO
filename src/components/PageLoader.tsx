import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[9999] bg-[#111111] flex items-center justify-center"
        >
          <div className="relative flex flex-col items-center gap-12">
            {/* OJO Eye Symbol */}
            <div className="flex gap-8 items-center">
              {[0, 1].map((i) => (
                <div key={i} className="relative w-24 h-24 border-4 border-ojo-gold rounded-full flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ 
                      scaleY: [1, 0, 1],
                      opacity: [1, 1, 1]
                    }}
                    transition={{ 
                      duration: 0.2, 
                      times: [0, 0.5, 1],
                      delay: 1.2,
                      repeat: 1,
                      repeatDelay: 0.2
                    }}
                    className="w-16 h-16 bg-ojo-gold rounded-full"
                  />
                  {/* Subtle Jali reflect */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(circle,transparent_20%,#C4AF27_20%,#C4AF27_40%,transparent_40%)] bg-[length:10px_10px]" />
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-center space-y-4"
            >
              <h1 className="text-ojo-mustard font-serif text-5xl tracking-[0.2em] font-light">OJO</h1>
              <p className="text-ojo-stone/40 text-[10px] font-black uppercase tracking-[0.6em]">See. Verify. Trust.</p>
            </motion.div>

            {/* Loading Bar */}
            <div className="absolute bottom-[-100px] w-48 h-px bg-ojo-stone/10 overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="w-full h-full bg-ojo-gold"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

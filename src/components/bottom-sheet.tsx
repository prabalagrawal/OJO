import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ojo-charcoal/60 z-[100] backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[3rem] p-8 shadow-deep md:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 bg-ojo-stone/20 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-6">
              {title && <h3 className="text-3xl font-serif italic text-ojo-charcoal">{title}</h3>}
              <button 
                onClick={onClose}
                className="p-3 bg-ojo-cream rounded-full text-ojo-charcoal/40 hover:text-ojo-charcoal transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="pb-12">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

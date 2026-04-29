import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options?: any;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = React.useState<CartItem[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(items);
    }
  }, [isOpen]);

  const removeItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ojo-charcoal/60 backdrop-blur-sm z-[1100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[1101] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-ojo-charcoal/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShoppingBag className="text-ojo-terracotta" />
                <h2 className="text-2xl font-serif italic text-ojo-charcoal">Your Collection</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-ojo-charcoal/5 rounded-full transition-colors"
                id="close-cart-btn"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-ojo-beige/30 flex items-center justify-center">
                    <ShoppingBag size={40} className="text-ojo-charcoal/20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-serif italic text-ojo-charcoal">Your vault is empty</p>
                    <p className="text-sm text-ojo-charcoal/40">Explore our curated heritage pieces to start your collection.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="bg-ojo-terracotta text-ojo-beige px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-ojo-charcoal transition-all"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} className="flex gap-6 group">
                    <div className="w-24 h-32 bg-ojo-beige/20 rounded-xl overflow-hidden flex-shrink-0 border border-ojo-charcoal/5">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif italic text-lg text-ojo-charcoal group-hover:text-ojo-terracotta transition-colors">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(idx)}
                          className="text-ojo-charcoal/20 hover:text-ojo-red transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 italic">Unit</span>
                         <span className="text-sm font-mono font-bold">₹{item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60">Qty: {item.quantity}</span>
                        {item.options?.color && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.options.color.hex }} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">{item.options.color.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 bg-ojo-beige/20 border-t border-ojo-charcoal/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40">Estimated Valuation</span>
                  <span className="text-4xl font-mono font-bold text-ojo-charcoal">₹{total.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  <Link 
                    to="/checkout"
                    onClick={onClose}
                    className="w-full bg-[#1a4d2e] text-ojo-beige py-5 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-ojo-charcoal transition-all shadow-xl group"
                  >
                    Proceed to Acquisition
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <button className="w-full border border-ojo-charcoal/10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all">
                    View Full Vault
                  </button>
                </div>
                <p className="text-[9px] text-center text-ojo-charcoal/40 italic">
                  * Complimentary global shipping applied to heritage collections.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

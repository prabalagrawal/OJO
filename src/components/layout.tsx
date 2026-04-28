import { ReactNode } from "react";
import { OjoLogo } from "./brand.tsx";
import { ShoppingCart, Trash2, X, ShoppingBag, ArrowRight, ShieldCheck, Lock, ChevronRight, Menu, Home, Map as MapIcon, User, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { MotifSystem } from "./motifs.tsx";
import { Header } from "./Navigation/Header.tsx";
import { KolamBorder } from "./Navigation/Patterns.tsx";

interface LayoutProps {
  children: ReactNode;
  user: any;
  onLogout: () => void;
}

export function MiniCart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(cart);
    };
    if (isOpen) loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, [isOpen]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const removeItem = (id: string) => {
    const newItems = items.filter(i => i.productId !== id);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ojo-charcoal/80 backdrop-blur-md z-[200]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-ojo-beige z-[201] shadow-4xl flex flex-col pt-24 md:pt-32 p-6 md:p-12 overflow-hidden"
          >
            <MotifSystem type="jaali" opacity={0.04} />
            <div className="absolute top-0 left-0 w-full opacity-20">
              <KolamBorder height={4} />
            </div>
            
            <div className="absolute top-8 md:top-12 left-6 md:left-12 flex items-center gap-3 md:gap-4 z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-ojo-charcoal text-white flex items-center justify-center shadow-lg border border-ojo-gold/20">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif italic text-ojo-charcoal">Your Cart</h2>
                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 flex items-center gap-2">
                  <ShieldCheck size={10} /> Ethically Sourced
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="absolute top-8 md:top-12 right-6 md:right-12 p-3 hover:bg-ojo-charcoal/5 rounded-full transition-all z-10">
              <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto space-y-10 py-10 relative z-10 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-30">
                  <ShoppingBag size={64} className="animate-pulse text-ojo-gold" />
                  <p className="text-sm font-serif italic max-w-[200px]">Your cart is currently empty</p>
                  <button 
                    onClick={() => {
                      navigate("/category");
                      onClose();
                    }}
                    className="ojo-btn-outline !py-3 !px-6 !border-ojo-gold/30 !text-ojo-gold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-4 md:gap-8 group">
                    <div className="w-24 md:w-32 h-32 md:h-40 rounded-xl md:rounded-[2rem] overflow-hidden bg-white shrink-0 shadow-2xl border border-ojo-stone/10 group-hover:border-ojo-gold/20 transition-all">
                      <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 md:py-2">
                       <div className="space-y-2 md:space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-lg md:text-xl font-serif italic text-ojo-charcoal truncate pr-8 group-hover:text-ojo-red transition-colors">{item.name}</h4>
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-ojo-terracotta">{item.origin}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] md:text-[9px] font-black tracking-widest text-ojo-charcoal/40">QUANTITY</span>
                          <span className="text-xs font-mono font-bold">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-xl md:text-2xl font-mono text-ojo-charcoal">₹{item.price.toLocaleString()}</span>
                         <button onClick={() => removeItem(item.productId)} className="p-2 text-ojo-stone hover:text-ojo-red transition-colors">
                            <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="pt-12 border-t border-ojo-stone/10 relative z-10">
                <div className="flex justify-between items-end mb-12">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Cart Total</span>
                    <p className="text-[10px] text-ojo-terracotta flex items-center gap-2 font-bold">
                       <Lock size={10} /> SECURE CHECKOUT
                    </p>
                  </div>
                  <span className="text-5xl font-mono text-ojo-charcoal">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                      navigate("/cart");
                      onClose();
                    }}
                    className="ojo-btn-primary w-full flex items-center justify-center gap-3 !py-6"
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={onClose}
                    className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 hover:text-ojo-gold transition-colors py-4 uppercase"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "New In", path: "/category?new=true" },
    { label: "Collections", path: "/category?collections=true" },
    { label: "Best Sellers", path: "/category?bestsellers=true" },
    { label: "Shop by Craft", path: "/category" },
    { label: "About OJO", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ojo-beige font-sans">
      <Header 
        onCartClick={() => setIsMiniCartOpen(true)}
        onAccountClick={() => navigate(user ? "/dashboard" : "/login")}
      />

      <main className="flex-grow pt-[180px] md:pt-[200px]">
        {children}
      </main>

      {/* GLOBAL BOTTOM NAVIGATION (MOBILE) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[200] bg-ojo-charcoal rounded-[2rem] p-3 shadow-deep border border-white/10 flex justify-around items-center px-4">
         {[
           { label: 'Home', icon: Home, path: '/' },
           { label: 'Explore', icon: MapIcon, path: '/category' },
           { label: 'Cart', icon: ShoppingBag, path: '/cart' },
           { label: 'Profile', icon: User, path: user ? '/dashboard' : '/login' }
         ].map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <button 
               key={item.label}
               onClick={() => navigate(item.path)} 
               className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${isActive ? 'text-ojo-gold scale-110' : 'text-white/40'}`}
             >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                   {item.label}
                </span>
             </button>
           );
         })}
      </nav>

      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
    </div>
  );
}

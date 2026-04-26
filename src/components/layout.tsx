import { ReactNode } from "react";
import { OjoLogo } from "./brand.tsx";
import { ShoppingCart, Trash2, X, ShoppingBag, ArrowRight, ShieldCheck, Lock, ChevronRight, Menu, Home, Map as MapIcon, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { MotifSystem } from "./motifs.tsx";

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
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-ojo-cream z-[201] shadow-4xl flex flex-col pt-24 md:pt-32 p-6 md:p-12 overflow-hidden"
          >
            <MotifSystem type="jaali" opacity={0.04} />
            
            <div className="absolute top-8 md:top-12 left-6 md:left-12 flex items-center gap-3 md:gap-4 z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-ojo-charcoal text-white flex items-center justify-center shadow-lg">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif italic text-ojo-charcoal">Your Collection</h2>
                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 flex items-center gap-2">
                  <ShieldCheck size={10} /> Verified Registry
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="absolute top-8 md:top-12 right-6 md:right-12 p-3 hover:bg-ojo-charcoal/5 rounded-full transition-all z-10">
              <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto space-y-10 py-10 relative z-10 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-30">
                  <ShoppingBag size={64} className="animate-pulse" />
                  <p className="text-sm font-serif italic max-w-[200px]">The sovereign registry is currently unpopulated</p>
                  <button 
                    onClick={() => {
                      navigate("/category");
                      onClose();
                    }}
                    className="ojo-btn-outline !py-3 !px-6"
                  >
                    Examine Catalog
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-4 md:gap-8 group">
                    <div className="w-24 md:w-32 h-32 md:h-40 rounded-xl md:rounded-[2rem] overflow-hidden bg-white shrink-0 shadow-2xl border border-ojo-stone/10">
                      <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 md:py-2">
                       <div className="space-y-2 md:space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-lg md:text-xl font-serif italic text-ojo-charcoal truncate pr-8">{item.name}</h4>
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-ojo-terracotta">{item.origin}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] md:text-[9px] font-bold text-ojo-charcoal/40">QUANTITY</span>
                          <span className="text-xs font-mono font-bold">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-xl md:text-2xl font-mono text-ojo-charcoal">₹{item.price.toLocaleString()}</span>
                         <button onClick={() => removeItem(item.productId)} className="p-2 text-ojo-stone hover:text-ojo-terracotta transition-colors">
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
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Artifact Valuation</span>
                    <p className="text-[10px] text-ojo-mustard flex items-center gap-2 font-bold">
                       <Lock size={10} /> SECURE TRANSACTION
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
                    Initiate Acquisition <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={onClose}
                    className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 hover:text-ojo-charcoal transition-colors py-4"
                  >
                    Continue Examining Registry
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

  return (
    <div className="min-h-screen flex flex-col bg-ojo-cream font-sans pb-24 md:pb-0">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-12 ${scrolled ? 'py-2 md:py-4' : 'py-6 md:py-8'} ${navVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className={`max-w-[1800px] mx-auto transition-all duration-1000 flex items-center justify-between px-6 md:px-10 relative overflow-hidden ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-3xl shadow-premium py-3 md:py-4 border-b border-ojo-mustard/10 rounded-2xl md:rounded-[2rem]' 
            : 'bg-transparent py-4 md:py-6 border-b border-ojo-charcoal/5'
        }`}>
          {/* Subtle Jaali Overlay when scrolled */}
          {scrolled && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <MotifSystem type="jaali" scale={0.4} />
            </div>
          )}
          
          <div className="flex items-center gap-6 md:gap-20 relative z-10 w-full justify-between">
            {/* Logo Section */}
            <button 
              onClick={() => navigate("/")} 
              className="hover:opacity-80 transition-all group shrink-0"
            >
               <OjoLogo size="sm" className="scale-75 md:scale-100 origin-left" />
            </button>

            {/* Navigation - Desktop Only */}
            <nav className="hidden lg:flex items-center gap-16">
              {[
                { label: "The Vault", path: "/category" },
                { label: "Provenance", path: "/category?verified=true" },
                { label: "Clusters", path: "/category" }
              ].map((item) => (
                <button 
                   key={item.label} 
                   onClick={() => navigate(item.path)}
                   className="relative text-[11px] font-black uppercase tracking-[0.5em] text-ojo-charcoal/60 hover:text-ojo-mustard transition-all group py-1"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-ojo-mustard transition-all duration-500 group-hover:w-full opacity-50" />
                </button>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-4 md:gap-10">
               <button 
                onClick={() => setIsMiniCartOpen(true)}
                className="relative group p-2 md:p-4 hover:bg-white rounded-full transition-all"
               >
                  <ShoppingBag size={20} className="text-ojo-charcoal group-hover:text-ojo-mustard transition-colors duration-500" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 md:top-2 right-1 md:right-2 w-4 md:w-5 h-4 md:h-5 rounded-full bg-ojo-mustard text-[8px] md:text-[10px] font-black text-white flex items-center justify-center shadow-lg border border-ojo-cream">
                      {cartCount}
                    </span>
                  )}
               </button>
               
               <div className="w-px h-6 bg-ojo-mustard/20 hidden md:block" />

               <div className="hidden md:flex items-center gap-8">
                  {user ? (
                    <div className="flex items-center gap-8">
                      {user.role?.toLowerCase() === 'admin' && (
                        <button 
                          onClick={() => navigate('/admin')}
                          className="ojo-btn-primary !px-6 !py-3 !text-[9px]"
                        >
                          <Lock size={12} />
                          <span>Panel</span>
                        </button>
                      )}
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="ojo-btn-outline !px-4 !py-3 !rounded-full"
                      >
                         <span className="text-[12px]">{user.name?.[0].toUpperCase() || "P"}</span>
                      </button>
                      <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-ojo-terracotta hover:text-ojo-mustard transition-colors">
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => navigate("/login")}
                      className="ojo-btn-primary !px-10 !py-4 shadow-ojo-mustard/10 flex items-center gap-3 group"
                    >
                      <span className="relative z-10 text-[10px]">Identify Identity</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
               </div>

               {/* Mobile Menu Trigger for Login/Profile if not using bottom nav for it */}
               {!user && (
                 <button onClick={() => navigate("/login")} className="md:hidden p-2 text-ojo-mustard">
                    <User size={20} />
                 </button>
               )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-4 md:pt-8 overflow-x-hidden">
        {children}
      </main>

      {/* GLOBAL BOTTOM NAVIGATION (MOBILE) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[200] bg-ojo-charcoal rounded-[2rem] p-3 shadow-deep border border-white/10 flex justify-around items-center px-4">
         {[
           { label: 'Home', icon: Home, path: '/' },
           { label: 'Explore', icon: MapIcon, path: '/category' },
           { label: 'Vault', icon: ShoppingBag, path: '/cart' },
           { label: 'Profile', icon: User, path: user ? '/dashboard' : '/login' }
         ].map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <button 
               key={item.label}
               onClick={() => navigate(item.path)} 
               className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${isActive ? 'text-ojo-mustard scale-110' : 'text-white/40'}`}
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

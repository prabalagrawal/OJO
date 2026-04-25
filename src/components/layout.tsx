import { ReactNode } from "react";
import { OjoLogo } from "./brand.tsx";
import { ShoppingCart, Trash2, X, ShoppingBag, ArrowRight, ShieldCheck, Lock, ChevronRight, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
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
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-ojo-cream z-[201] shadow-4xl flex flex-col pt-32 p-12 overflow-hidden"
          >
            <MotifSystem type="jaali" opacity={0.04} />
            
            <div className="absolute top-12 left-12 flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-2xl bg-ojo-charcoal text-white flex items-center justify-center shadow-lg">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-3xl font-serif italic text-ojo-charcoal">Your Collection</h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 flex items-center gap-2">
                  <ShieldCheck size={10} /> Verified Registry
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="absolute top-12 right-12 p-3 hover:bg-ojo-charcoal/5 rounded-full transition-all z-10">
              <X size={24} />
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
                  <div key={item.productId} className="flex gap-8 group">
                    <div className="w-32 h-40 rounded-[2rem] overflow-hidden bg-white shrink-0 shadow-2xl border border-ojo-stone/10">
                      <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-xl font-serif italic text-ojo-charcoal truncate pr-8">{item.name}</h4>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-terracotta">{item.origin}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-ojo-charcoal/40">QUANTITY</span>
                          <span className="text-xs font-mono font-bold">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-2xl font-mono text-ojo-charcoal">₹{item.price.toLocaleString()}</span>
                         <button onClick={() => removeItem(item.productId)} className="p-3 text-ojo-stone hover:text-ojo-terracotta transition-colors">
                            <Trash2 size={18} />
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
  const navigate = useNavigate();

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-ojo-cream font-sans">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[1.5s] px-4 md:px-8 ${scrolled ? 'py-2' : 'py-6'}`}>
        <div className={`max-w-[1800px] mx-auto transition-all duration-1000 flex items-center justify-between px-10 relative overflow-hidden ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-3xl shadow-4xl py-4 border-x border-b border-ojo-mustard/20 rounded-b-[4rem]' 
            : 'bg-white/60 backdrop-blur-md py-8 border-b border-white/30 rounded-b-[6rem]'
        }`}>
          {/* Architectural Arch Detail (Subtle) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-4 bg-ojo-mustard/10 rounded-b-full blur-xl" />
          
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
            <MotifSystem type="jaali" scale={0.3} />
          </div>
          
          <div className="flex items-center gap-16 relative z-10 w-full justify-between">
            {/* Logo Section as a Royal Seal */}
            <button 
              onClick={() => navigate("/")} 
              className="hover:opacity-90 transition-all group flex items-center gap-6"
            >
               <div className="w-14 h-14 bg-ojo-charcoal text-white flex items-center justify-center shadow-4xl transform transition-all group-hover:rotate-45 duration-700 relative overflow-hidden" 
                 style={{ borderRadius: '1.5rem 0.2rem 1.5rem 0.2rem' }}>
                <MotifSystem type="patola" opacity={0.2} scale={0.15} />
                <span className="font-serif italic font-black text-2xl relative z-10">O</span>
               </div>
               <div className="flex flex-col items-start -space-y-1">
                 <span className="font-serif italic text-3xl font-black text-ojo-charcoal tracking-tighter">OJO.</span>
                 <span className="text-[7px] font-black uppercase tracking-[0.6em] text-ojo-mustard hidden md:block">The Sovereign Registry</span>
               </div>
            </button>

            {/* Navigation with Arch Accents */}
            <nav className="hidden lg:flex items-center gap-12">
              {[
                { label: "The Vault", path: "/category" },
                { label: "Provenance Records", path: "/category?verified=true" },
                { label: "State Clusters", path: "/category" }
              ].map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => navigate(item.path)}
                  className="relative text-[10px] font-black uppercase tracking-[0.5em] text-ojo-charcoal hover:text-ojo-mustard transition-all group py-1"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-ojo-mustard rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center gap-8">
               <button 
                onClick={() => setIsMiniCartOpen(true)}
                className="relative group p-4 bg-ojo-cream/50 hover:bg-white rounded-[1.5rem] border border-ojo-stone/20 transition-all hover:shadow-relief"
               >
                  <ShoppingBag size={20} className="text-ojo-charcoal group-hover:text-ojo-mustard transition-colors duration-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ojo-terracotta text-[9px] font-black text-white flex items-center justify-center shadow-lg border-2 border-white">
                      {cartCount}
                    </span>
                  )}
               </button>
               
               <div className="w-px h-8 bg-ojo-mustard/10" />

               <div className="flex items-center gap-6">
                  {user ? (
                    <div className="flex items-center gap-6">
                      {user.role?.toLowerCase() === 'admin' && (
                        <button 
                          onClick={() => navigate('/admin')}
                          className="flex items-center gap-2 px-5 py-2.5 bg-ojo-charcoal text-ojo-mustard shadow-xl hover:bg-black transition-all group"
                          style={{ borderRadius: '1rem 0.2rem 1rem 0.2rem' }}
                        >
                          <Lock size={12} className="group-hover:translate-x-0.5 transition-transform" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Master Panel</span>
                        </button>
                      )}
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-4 group"
                      >
                         <div className="w-12 h-12 bg-ojo-cream border border-ojo-mustard/20 flex items-center justify-center text-ojo-charcoal font-black text-[12px] group-hover:bg-ojo-mustard group-hover:text-white transition-all shadow-md duration-500 relative overflow-hidden"
                           style={{ borderRadius: '1rem 0.2rem 1rem 0.2rem' }}>
                            <div className="absolute inset-0 opacity-[0.03]">
                              <MotifSystem type="kolam" scale={0.4} />
                            </div>
                            <span className="relative z-10">{user.name?.[0].toUpperCase() || "P"}</span>
                         </div>
                      </button>
                      <button onClick={onLogout} className="text-[9px] font-black uppercase tracking-widest text-ojo-terracotta hover:text-ojo-mustard transition-colors">
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => navigate("/login")}
                      className="ojo-btn-primary !px-10 !py-4 shadow-ojo-mustard/10 flex items-center gap-3 group"
                    >
                      <span className="relative z-10">Establish Identity</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
               </div>
               
               <button className="lg:hidden p-3 bg-white/60 rounded-2xl text-ojo-charcoal border border-ojo-stone/10">
                  <Menu size={24} />
               </button>
            </div>
          </div>
          
          {/* Footer Accent Line for Header */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
             <div className="w-full h-full bg-gradient-to-r from-transparent via-ojo-mustard/40 to-transparent" />
          </div>
        </div>
      </header>


      <main className="flex-grow pt-8">
        {children}
      </main>

      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
    </div>
  );
}

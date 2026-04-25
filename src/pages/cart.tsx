import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ShieldCheck, Truck, Plus, Minus, ArrowRight, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(cart);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const newItems = items.map(item => {
      if (item.productId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(i => i.productId !== id);
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("storage"));
    toast.error("Artifact removed from registry");
  };

  const checkout = async () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      navigate("/checkout");
    }, 1500);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const auditingFee = 450;
  const total = subtotal + auditingFee;

  if (items.length === 0) return (
    <div className="min-h-screen bg-ojo-cream flex flex-col items-center justify-center p-8 space-y-12">
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-3xl border border-ojo-stone/10 relative">
        <div className="absolute inset-0 pattern-lotus opacity-10 animate-spin-slow" />
        <ShoppingCart size={48} className="text-ojo-mustard relative z-10" />
      </div>
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-serif text-ojo-charcoal tracking-tighter leading-tight">Your Registry Bag <br/> <span className="italic text-ojo-stone">is Waiting.</span></h2>
        <p className="text-sm text-ojo-charcoal/40 max-w-sm mx-auto font-light leading-relaxed">The ledger of Indian heritage and verified provenance expects your selection.</p>
      </div>
      <button onClick={() => navigate("/")} className="ojo-btn-primary !bg-ojo-mustard !text-ojo-charcoal flex items-center gap-4">
        Explore Heritage <ArrowRight size={16} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-ojo-cream pt-32 px-6 md:px-12 pb-40">
      <div className="max-w-[1440px] mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-4">
              <div className="ojo-label text-ojo-terracotta flex items-center gap-4">
                 <div className="w-12 h-px bg-ojo-terracotta/40" />
                 <span>AUTHENTICATION PENDING</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none">Your Collection <span className="text-ojo-stone/20">({items.length})</span></h1>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard flex items-center gap-3">
              <ShieldCheck size={16} /> 3-Tier Security Active
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-6 sm:p-10 rounded-[60px] flex flex-col sm:flex-row gap-10 group relative border border-ojo-stone/10 shadow-2xl hover:shadow-4xl transition-all"
                >
                  <div className="w-full sm:w-48 h-64 sm:h-56 bg-ojo-cream rounded-[40px] overflow-hidden shadow-inner border border-ojo-stone/20 shrink-0">
                    <img 
                       src={item.image} 
                       alt={item.name} 
                       className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-2">
                    <div className="space-y-4">
                       <div className="flex justify-between items-start gap-4">
                          <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-ojo-mustard">{item.origin} ORIGIN</span>
                             </div>
                             <h3 className="text-3xl font-serif tracking-tighter text-ojo-charcoal leading-none group-hover:text-ojo-terracotta transition-colors">{item.name}</h3>
                          </div>
                          <button 
                            onClick={() => removeItem(item.productId)}
                            className="p-4 bg-ojo-cream rounded-full text-ojo-charcoal/20 hover:text-ojo-terracotta hover:bg-ojo-terracotta/10 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 px-3 py-1 bg-ojo-mustard/10 rounded-full border border-ojo-mustard/20">
                            <ShieldCheck size={10} className="text-ojo-mustard" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-ojo-mustard">OJO Verified Artifact</span>
                          </div>
                          <span className="text-[9px] font-mono text-ojo-charcoal/20 uppercase">LEGER-ID: {item.productId.substring(0,8)}</span>
                       </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between mt-8 sm:mt-0 gap-6">
                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/40">Acquisition Quantity</p>
                        <div className="flex items-center gap-6 p-2 bg-ojo-cream rounded-full border border-ojo-stone/10">
                           <button 
                            onClick={() => updateQuantity(item.productId, -1)}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all shadow-md"
                           >
                              <Minus size={14} />
                           </button>
                           <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                           <button 
                            onClick={() => updateQuantity(item.productId, 1)}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all shadow-md"
                           >
                              <Plus size={14} />
                           </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase tracking-widest text-ojo-mustard/40 mb-1">Unit Valuation</span>
                        <span className="text-4xl font-serif text-ojo-charcoal tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
            <div className="bg-ojo-charcoal p-10 md:p-14 rounded-[70px] space-y-12 relative overflow-hidden shadow-3xl text-ojo-soft-cream">
                <div className="absolute top-0 right-0 w-48 h-48 pattern-mandala opacity-[0.08] -translate-y-1/2 translate-x-1/2" />
                
                <div className="space-y-2">
                   <h3 className="text-4xl font-serif text-ojo-mustard tracking-tighter">Ledger Recap</h3>
                   <p className="text-[10px] uppercase font-black tracking-widest opacity-40 italic">Final audit balance</p>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">Combined Value</span>
                    <span className="font-serif text-2xl">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">Provenance Audit</span>
                    <span className="text-[10px] font-black tracking-widest text-ojo-mustard px-4 py-1.5 bg-ojo-mustard/10 rounded-full border border-ojo-mustard/20">PASSED</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">Handling & Logistics</span>
                    <span className="font-serif text-xl opacity-60">₹{auditingFee}</span>
                  </div>
                </div>

                <div className="pt-10 border-t-2 border-dashed border-white/10 flex justify-between items-end">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard leading-none">Global Total</span>
                      <p className="text-[8px] opacity-20 italic">Inc. Heritage Protection tax</p>
                   </div>
                   <span className="text-5xl font-serif tracking-tighter leading-none text-white">₹{total.toLocaleString()}</span>
                </div>

                <div className="pt-6 space-y-8">
                  <button 
                    onClick={checkout}
                    disabled={checkingOut}
                    className="w-full bg-ojo-mustard text-ojo-charcoal hover:bg-white py-8 rounded-full text-[12px] font-black uppercase tracking-[0.6em] transition-all shadow-3xl disabled:opacity-50 flex items-center justify-center gap-4"
                  >
                    {checkingOut ? (
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <ShieldCheck size={20} />
                       </motion.div>
                    ) : (
                      <>EXECUTE ACQUISITION <ArrowRight size={16} /></>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="text-center space-y-2">
                        <Shield size={20} className="mx-auto text-ojo-mustard/40" />
                        <span className="block text-[8px] font-black uppercase tracking-widest opacity-40">Escrow Protect</span>
                     </div>
                     <div className="text-center space-y-2">
                        <Truck size={20} className="mx-auto text-ojo-mustard/40" />
                        <span className="block text-[8px] font-black uppercase tracking-widest opacity-40">World Tracking</span>
                     </div>
                  </div>
                </div>
            </div>
            
            <div className="mt-8 p-8 border border-ojo-mustard/20 rounded-[50px] bg-ojo-mustard/5 flex gap-6 items-center">
               <div className="w-16 h-16 rounded-3xl bg-ojo-mustard flex items-center justify-center text-ojo-charcoal shrink-0 shadow-lg">
                  <ShieldCheck size={28} />
               </div>
               <p className="text-[11px] font-light text-ojo-charcoal/70 leading-relaxed italic">
                 Your artifacts are insured up to <span className="font-bold text-ojo-charcoal">₹500,000</span> through our Sovereign Guarantee Protocol.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

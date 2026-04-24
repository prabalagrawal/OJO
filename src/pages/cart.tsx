import { useState, useEffect } from "react";
import { api } from "../lib/api.ts";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { motion } from "motion/react";

export function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(cart);
  }, []);

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };

  const checkout = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setCheckingOut(true);
    try {
      const orderItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      await api.post("/orders", { items: orderItems });
      localStorage.removeItem("cart");
      setItems([]);
      alert("Escrow Transaction Initiated. Artifacts pending provenance verification.");
      navigate("/");
    } catch (err) {
      alert("Verification protocol failure. Please retry.");
    } finally {
      setCheckingOut(false);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) return (
    <div className="py-48 text-center space-y-10 pattern-lotus bg-ojo-cream min-h-screen -mx-6 md:-mx-12">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border border-ojo-stone/20">
        <ShoppingCart size={32} className="text-ojo-mustard" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-serif text-ojo-charcoal tracking-tighter">Your Registry Bag <br/> <span className="italic text-ojo-stone">is Empty.</span></h2>
        <p className="text-ojo-charcoal/40 max-w-sm mx-auto text-sm">Discover authentic Indian artifacts verified for their heritage and quality.</p>
      </div>
      <button onClick={() => navigate("/")} className="bg-ojo-mustard text-ojo-charcoal px-12 py-4 rounded-full font-black tracking-[0.3em] text-[10px] uppercase shadow-xl hover:bg-ojo-charcoal hover:text-white transition-all">Explore Registry</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-ojo-cream -mx-6 md:-mx-12 -mt-12 pt-24 px-6 md:px-12 pb-40 relative">
      <div className="absolute inset-0 pattern-diamond-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 pattern-border-trim opacity-10 pointer-events-none" />
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-4 text-ojo-terracotta">
           <div className="w-8 h-[1px] bg-ojo-terracotta" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Selected Provenance</span>
        </div>
        <h1 className="text-6xl font-serif tracking-tighter">Your Collection <span className="text-ojo-charcoal/20">({items.length})</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item, i) => (
            <motion.div 
              key={`${item.productId}-${i}`}
              layout
              className="bg-white p-8 rounded-[40px] flex gap-10 group relative border border-ojo-stone/10 shadow-xl transition-all hover:shadow-2xl"
            >
              <div className="w-40 h-48 bg-ojo-cream rounded-3xl overflow-hidden shadow-inner border border-ojo-stone/20 shrink-0">
                <img 
                   src="https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670&auto=format&fit=crop" 
                   alt={item.name} 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1s]" 
                />
              </div>
              <div className="flex-grow flex flex-col justify-between py-4">
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                    <h3 className="text-3xl font-serif tracking-tighter text-ojo-charcoal">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(i)}
                      className="p-3 bg-ojo-cream rounded-full text-ojo-charcoal/20 hover:text-ojo-terracotta transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-ojo-mustard/10 rounded-full">
                        <ShieldCheck size={10} className="text-ojo-mustard" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-ojo-mustard">OJO Verified Entry</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/30">ID: {item.productId.substring(0,8)}</span>
                   </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-charcoal opacity-40">Registration Quantity</p>
                    <div className="flex items-center gap-4">
                       <button className="w-8 h-8 rounded-full border border-ojo-stone/20 flex items-center justify-center text-xs opacity-40">-</button>
                       <span className="text-sm font-black">{item.quantity}</span>
                       <button className="w-8 h-8 rounded-full border border-ojo-stone/20 flex items-center justify-center text-xs opacity-40">+</button>
                    </div>
                  </div>
                  <span className="text-3xl font-serif text-ojo-charcoal tracking-tighter">₹{item.price.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-ojo-charcoal p-12 rounded-[50px] space-y-10 relative overflow-hidden shadow-3xl text-ojo-soft-cream">
            <div className="absolute top-0 right-0 w-32 h-32 pattern-jali opacity-[0.05]" />
            
            <h3 className="text-3xl font-serif text-ojo-mustard tracking-tighter">Ledger Summary</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Artifact Value</span>
                <span className="font-serif text-xl">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Sovereign Audit</span>
                <span className="text-ojo-mustard font-black tracking-widest text-[9px] px-3 py-1 bg-ojo-mustard/10 rounded-full">INCLUDED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Global Logistics</span>
                <span className="font-serif text-lg">₹450</span>
              </div>
            </div>

            <div className="pt-10 border-t border-white/10 flex justify-between items-end">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard opacity-60">Total Valuation</span>
               <span className="text-5xl font-serif tracking-tighter leading-none text-white">₹{(total + 450).toLocaleString()}</span>
            </div>

            <div className="pt-4">
              <button 
                onClick={checkout}
                disabled={checkingOut}
                className="w-full bg-ojo-mustard text-ojo-charcoal py-10 rounded-[40px] text-[12px] font-black uppercase tracking-[0.6em] hover:bg-white transition-all shadow-2xl disabled:opacity-50"
              >
                {checkingOut ? "VERIFYING LEDGER..." : "EXECUTE ACQUISITION"}
              </button>
              <div className="flex items-center justify-center gap-3 mt-8 opacity-40 text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} className="text-ojo-mustard" />
                <span>OJO Escrow Protocol Active</span>
              </div>
            </div>
          </div>
          
          <div className="p-8 border border-ojo-mustard/20 rounded-[40px] space-y-4 bg-ojo-mustard/5">
             <div className="flex items-center gap-3 text-ojo-mustard">
                <Truck size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Provenance Tracked</span>
             </div>
             <p className="text-[10px] text-ojo-charcoal/60 leading-relaxed italic">Your artifacts will be shipped after the final quality audit at our regional verification hub.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

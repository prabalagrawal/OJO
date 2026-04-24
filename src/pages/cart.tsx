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
    <div className="py-48 text-center space-y-10 pattern-lotus">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
        <ShoppingCart size={32} className="text-ojo-stone" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-serif text-ojo-charcoal">Registry Bag is Empty</h2>
        <p className="text-ojo-charcoal/40 max-w-sm mx-auto">Discover authentic Indian artifacts verified for their heritage and quality.</p>
      </div>
      <button onClick={() => navigate("/")} className="ojo-btn-primary mx-auto">Explore Registry</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12 relative">
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
              className="ojo-card flex gap-10 group relative"
            >
              <div className="w-32 h-40 bg-white rounded-3xl overflow-hidden shadow-md border border-ojo-stone/40 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670&auto=format&fit=crop" 
                  alt={item.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <div className="flex-grow flex flex-col justify-between py-2">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif tracking-tight">{item.name}</h3>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 italic font-serif">Original Origin Verified</span>
                  </div>
                  <p className="text-xs text-ojo-charcoal/40 font-bold tracking-widest uppercase">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-mono text-lg font-black text-ojo-terracotta italic">₹{item.price.toLocaleString()}</span>
                  <button 
                    onClick={() => removeItem(i)}
                    className="p-2 text-ojo-red/40 hover:text-ojo-red transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="ojo-card !bg-white !p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 pattern-lotus opacity-5" />
            
            <h3 className="text-2xl font-serif border-b border-ojo-stone/40 pb-6">Checkout Summary</h3>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between text-sm">
                <span className="font-black uppercase tracking-widest text-ojo-charcoal/40 text-[10px]">Registry Total</span>
                <span className="font-mono font-black italic">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-black uppercase tracking-widest text-ojo-charcoal/40 text-[10px]">Verification Fee</span>
                <span className="text-ojo-olive font-black tracking-widest text-[10px]">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-black uppercase tracking-widest text-ojo-charcoal/40 text-[10px]">Shipping (Verified Cargo)</span>
                <span className="font-mono font-black italic">₹450</span>
              </div>
            </div>

            <div className="pt-8 border-t border-ojo-stone/40 flex justify-between items-end">
               <span className="text-xs font-black uppercase tracking-[0.2em] text-ojo-terracotta">Payable</span>
               <span className="text-4xl font-serif tracking-tighter leading-none">₹{(total + 450).toLocaleString()}</span>
            </div>

            <div className="pt-4">
              <button 
                onClick={checkout}
                disabled={checkingOut}
                className="ojo-btn-primary w-full !rounded-2xl"
              >
                {checkingOut ? "Verifying Transaction..." : "Complete Checkout"}
              </button>
              <div className="flex items-center justify-center gap-3 mt-6 opacity-30 text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} />
                <span>OJO Escrow Protocol Active</span>
              </div>
            </div>
          </div>
          
          <div className="p-8 border border-ojo-stone/40 rounded-[32px] space-y-4 bg-ojo-beige/20">
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

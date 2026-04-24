import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Clock,
  Lock,
  ArrowRight
} from "lucide-react";
import { OjoLogo } from "../components/brand.tsx";

export function Checkout() {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("cart");
      navigate("/dashboard/orders");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-ojo-cream flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute inset-0 pattern-jali opacity-[0.01] pointer-events-none" />
      
      {/* LEFT: Checkout Form */}
      <div className="w-full md:w-3/5 p-8 md:p-16 lg:p-24 overflow-y-auto relative z-10">
        <header className="mb-16 flex items-center justify-between">
           <Link to="/cart">
             <OjoLogo size="sm" />
           </Link>
           <div className="flex items-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step === s ? 'bg-ojo-charcoal text-ojo-white shadow-xl scale-125' : step > s ? 'bg-ojo-mustard text-ojo-white' : 'bg-ojo-stone/20 text-ojo-stone'}`}>
                      {step > s ? <CheckCircle size={16} /> : s}
                   </div>
                   {s < 3 && <div className={`w-8 h-px ${step > s ? 'bg-ojo-mustard' : 'bg-ojo-stone/20'}`} />}
                </div>
              ))}
           </div>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 && <AddressStep key="step1" onNext={handleNext} />}
          {step === 2 && <PaymentStep key="step2" onNext={handleNext} onPrev={() => setStep(1)} />}
          {step === 3 && <ReviewStep key="step3" items={cartItems} total={total} onNext={handleNext} onPrev={() => setStep(2)} loading={loading} />}
        </AnimatePresence>
      </div>

      {/* RIGHT: Order Summary */}
      <div className="w-full md:w-2/5 bg-ojo-charcoal p-8 md:p-16 lg:p-24 text-ojo-white relative overflow-hidden shrink-0">
        <div className="absolute inset-0 pattern-lotus opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-ojo-charcoal via-ojo-charcoal to-ojo-terracotta/20" />
        
        <div className="relative z-10 space-y-12 h-full flex flex-col justify-between">
          <div className="space-y-10">
            <h3 className="text-3xl font-serif text-ojo-mustard tracking-tighter">Acquisition Receipt</h3>
            
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                   <div className="w-16 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <img src="https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670" className="w-full h-full object-cover grayscale brightness-75 group-hover:brightness-100 transition-all" />
                   </div>
                   <div className="min-w-0 flex-grow">
                      <h4 className="font-serif text-lg truncate">{item.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Qty: {item.quantity} • Origin: Verified</p>
                   </div>
                   <span className="font-serif">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 border-t border-white/10 pt-10">
             <div className="space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span>Artifact Subtotal</span>
                  <span className="text-sm font-serif opacity-100">₹{total.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span>Global Logistics</span>
                  <span className="text-sm font-serif opacity-100">₹450</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-ojo-mustard">
                  <span>Sovereign Security</span>
                  <span className="text-xs font-black px-2 py-1 bg-ojo-mustard/10 rounded-md">INCLUDED</span>
               </div>
             </div>

             <div className="flex justify-between items-end pt-4 border-t border-white/5">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-mustard">TOTAL LEDGER</span>
                <span className="text-5xl font-serif tracking-tighter">₹{(total + 450).toLocaleString()}</span>
             </div>

             <div className="pt-6 flex items-center justify-center gap-4 text-ojo-soft-cream/30">
                <Lock size={14} />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">AES-256 Sovereign Encryption Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddressStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <div className="space-y-4">
        <h2 className="text-5xl font-serif text-ojo-charcoal tracking-tighter">Shipment <br /><span className="italic text-ojo-terracotta">Endpoints</span></h2>
        <p className="text-sm text-ojo-stone max-w-sm">Select the secure location for artifact delivery.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[
          { id: 1, title: "Primary Vault", addr: "88 Haven Road, Indiranagar, Bangalore - 560038", active: true },
          { id: 2, title: "Studio Gallery", addr: "12 Creative Plaza, HSR Layout, Bangalore - 560102", active: false },
        ].map(addr => (
          <div key={addr.id} className={`p-8 rounded-[40px] border-2 transition-all cursor-pointer group ${addr.active ? 'border-ojo-mustard bg-white shadow-2xl' : 'border-ojo-stone/20 hover:border-ojo-mustard/40 bg-white/50'}`}>
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${addr.active ? 'border-ojo-mustard' : 'border-ojo-stone'}`}>
                     {addr.active && <div className="w-2.5 h-2.5 rounded-full bg-ojo-mustard" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{addr.title}</span>
               </div>
               <ShieldCheck size={20} className={addr.active ? 'text-ojo-mustard' : 'text-ojo-stone opacity-20'} />
            </div>
            <p className="text-xl font-serif text-ojo-charcoal opacity-60 px-10 italic">"{addr.addr}"</p>
          </div>
        ))}

        <button className="flex items-center justify-center gap-3 p-8 rounded-[40px] border-2 border-dashed border-ojo-stone/30 text-ojo-stone hover:border-ojo-mustard hover:text-ojo-mustard transition-all text-[10px] font-black uppercase tracking-widest">
           <MapPin size={18} /> Establish New Location
        </button>
      </div>

      <button 
        onClick={onNext}
        className="ojo-btn-primary w-full py-8 text-[11px] font-black uppercase tracking-[0.6em] mt-8"
      >
        Proceed to Ledger <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

function PaymentStep({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <div className="space-y-4">
        <h2 className="text-5xl font-serif text-ojo-charcoal tracking-tighter">Fiscal <br /><span className="italic text-ojo-terracotta">Settlement</span></h2>
        <p className="text-sm text-ojo-stone max-w-sm">Select your preferred sovereign payment protocol.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-ojo-charcoal rounded-[40px] p-10 text-ojo-white relative overflow-hidden group border-2 border-transparent">
           <div className="absolute top-0 right-0 w-32 h-32 pattern-jali opacity-10 bg-ojo-mustard -mr-16 -mt-16 rounded-full" />
           <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-start">
                 <CreditCard size={32} className="text-ojo-mustard" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard px-3 py-1 bg-ojo-mustard/10 rounded-full">Primary Protocol</span>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Account Linked</p>
                 <h4 className="text-3xl font-mono tracking-tighter">•••• •••• •••• 9920</h4>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {['UPI Ledger', 'Net Vault', 'Noble Credit', 'Crypto Proof'].map(method => (
             <button key={method} className="p-6 rounded-[30px] border-2 border-ojo-stone/20 hover:border-ojo-mustard transition-all text-[10px] font-black uppercase tracking-widest text-ojo-charcoal">
               {method}
             </button>
           ))}
        </div>
      </div>

      <div className="flex gap-6 mt-8">
        <button onClick={onPrev} className="px-10 py-8 rounded-full border-2 border-ojo-stone/20 text-[11px] font-black uppercase tracking-widest hover:border-ojo-terracotta transition-all">
          Back
        </button>
        <button 
          onClick={onNext}
          className="ojo-btn-primary flex-1 py-8 text-[11px] font-black uppercase tracking-[0.6em]"
        >
          Final Verification <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function ReviewStep({ items, total, onNext, onPrev, loading }: { items: any[], total: number, onNext: () => void, onPrev: () => void, loading: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <div className="space-y-4">
        <h2 className="text-5xl font-serif text-ojo-charcoal tracking-tighter">Final <br /><span className="italic text-ojo-terracotta">Review</span></h2>
        <p className="text-sm text-ojo-stone max-w-sm">Confirm the acquisition details before executing transit.</p>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-stone">Delivery Logic</label>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-ojo-cream border border-ojo-stone/20 flex items-center justify-center text-ojo-terracotta">
                    <MapPin size={20} />
                 </div>
                 <p className="text-sm font-serif italic text-ojo-charcoal">"Primary Vault, Bangalore Hub"</p>
              </div>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-stone">Settlement Method</label>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-ojo-cream border border-ojo-stone/20 flex items-center justify-center text-ojo-mustard">
                    <CreditCard size={20} />
                 </div>
                 <p className="text-sm font-serif italic text-ojo-charcoal">"Secure Card Ending 9920"</p>
              </div>
           </div>
        </div>

        <div className="bg-ojo-mustard/5 p-10 rounded-[40px] border border-ojo-mustard/20 space-y-6">
           <div className="flex items-center gap-4 text-ojo-mustard">
              <ShieldCheck size={24} />
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Sovereign Trust Guarantee</h4>
           </div>
           <p className="text-sm font-light text-ojo-charcoal/60 leading-relaxed italic">
             "By proceeding, you acknowledge the provenance audit of {items.length} artifacts. OJO takes full custodial responsibility during transit until the physical handshake at your vault."
           </p>
        </div>
      </div>

      <div className="flex gap-6 mt-8">
        <button onClick={onPrev} className="px-10 py-8 rounded-full border-2 border-ojo-stone/20 text-[11px] font-black uppercase tracking-widest hover:border-ojo-terracotta transition-all">
          Modify
        </button>
        <button 
          onClick={onNext}
          disabled={loading}
          className="ojo-btn-primary flex-1 py-8 text-[11px] font-black uppercase tracking-[0.6em] disabled:opacity-50"
        >
          {loading ? "EXECUTING ACQUISITION..." : "EXECUTE ACQUISITION"}
        </button>
      </div>
    </motion.div>
  );
}


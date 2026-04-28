import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Box, 
  Clock, 
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  Loader2
} from "lucide-react";
import { api } from "../lib/api.ts";
import { toast } from "sonner";
import { MotifSystem } from "../components/motifs.tsx";

export function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      toast.error("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ojo-cream">
        <Loader2 className="animate-spin text-ojo-mustard" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ojo-cream">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif">Order Not Found</h2>
          <button onClick={() => navigate("/")} className="ojo-btn-primary">Back to Shop</button>
        </div>
      </div>
    );
  }

  const steps = [
    { status: "Order Confirmed", date: new Date(order.createdAt).toLocaleDateString(), icon: <Package size={20} />, completed: true },
    { status: "Processing & Quality Check", date: "Verified", icon: <ShieldCheck size={20} />, completed: order.status !== 'PENDING' },
    { status: "Shipped", date: "In Transit", icon: <Truck size={20} />, completed: order.status === 'SHIPPED' || order.status === 'DELIVERED', current: order.status === 'SHIPPED' },
    { status: "Out for Delivery", date: "Expected Soon", icon: <MapPin size={20} />, completed: order.status === 'DELIVERED' },
    { status: "Delivered", date: "Successfully Delivered", icon: <CheckCircle size={20} />, completed: order.status === 'DELIVERED' },
  ];

  return (
    <div className="min-h-screen bg-ojo-cream p-8 md:p-16">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden bg-white/40 backdrop-blur-md p-10 rounded-[40px] border border-ojo-stone/10 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 opacity-10 text-ojo-mustard -mr-20 -mt-20 pointer-events-none">
             <MotifSystem type="mandala" variant="single" scale={1.5} />
          </div>
          <div className="space-y-4 relative z-10">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-ojo-stone hover:text-ojo-terracotta transition-colors group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Go Back</span>
            </button>
            <div className="space-y-1">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-stone">ORDER TRACKING</span>
               <h1 className="text-5xl font-serif text-ojo-charcoal tracking-tighter">Order #{id}</h1>
            </div>
          </div>
          <div className="flex gap-4">
             <button className="px-8 py-4 bg-white border border-ojo-stone/20 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:border-ojo-mustard transition-all shadow-xl">
               <Phone size={14} className="text-ojo-mustard" />
               Contact Partner
             </button>
             <button className="px-8 py-4 bg-ojo-charcoal text-ojo-white rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-ojo-mustard transition-all shadow-xl">
               <MessageSquare size={14} className="text-ojo-mustard" />
               Help Center
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* TIMELINE */}
          <div className="lg:col-span-8 bg-white rounded-[50px] p-12 shadow-2xl border border-ojo-stone/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 pattern-jali opacity-[0.03] -mr-32 -mt-32" />
            
            <h3 className="text-2xl font-serif text-ojo-charcoal mb-16 px-4">Order <span className="italic text-ojo-terracotta">Progress</span></h3>

            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-10 group relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 shadow-lg ${step.completed ? 'bg-ojo-charcoal text-ojo-white' : step.current ? 'bg-ojo-mustard text-ojo-white animate-pulse' : 'bg-ojo-stone/10 text-ojo-stone/40'}`}>
                      {step.icon}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-1 h-24 transition-all duration-1000 ${step.completed ? 'bg-ojo-charcoal' : 'bg-ojo-stone/10'}`} />
                    )}
                  </div>
                  
                  <div className={`pt-4 space-y-1 transition-all ${step.completed || step.current ? 'opacity-100' : 'opacity-30'}`}>
                    <h4 className={`text-lg font-serif ${step.current ? 'text-ojo-terracotta' : 'text-ojo-charcoal'}`}>
                      {step.status}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                      {step.date}
                    </p>
                    {step.current && (
                      <div className="mt-4 px-4 py-2 bg-ojo-mustard/10 rounded-xl border border-ojo-mustard/20 w-fit">
                         <span className="text-[8px] font-black text-ojo-mustard uppercase tracking-widest">Quality verification in progress</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-ojo-charcoal rounded-[50px] p-10 text-ojo-white shadow-3xl space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 pattern-lotus opacity-[0.05]" />
               
               <div className="space-y-4">
                  <h4 className="text-2xl font-serif text-ojo-mustard">Delivery Details</h4>
                  <div className="space-y-6 pt-4">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Delivering To</p>
                       <p className="text-lg font-serif">88 Haven Road, Indiranagar, Bangalore</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Shipped From</p>
                       <p className="text-lg font-serif">Heritage Guild, Jaipur Rajasthan</p>
                    </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-white/10 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Courier Partner</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">OJO Delivery</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Status Check</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">In Transit - Secure</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[50px] p-10 shadow-xl border border-ojo-stone/10 space-y-8">
               <h4 className="text-xl font-serif text-ojo-charcoal">Items Ordered</h4>
               <div className="space-y-6">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-ojo-stone/10 overflow-hidden shadow-inner shrink-0">
                       <img 
                        src={JSON.parse(item.product.images || "[]")[0]} 
                        className="w-full h-full object-cover grayscale" 
                        alt="" 
                       />
                     </div>
                     <div className="min-w-0">
                       <h5 className="font-serif text-ojo-charcoal truncate">{item.product.name}</h5>
                       <p className="text-[10px] font-black uppercase tracking-widest text-ojo-stone">Item ID: #{item.product.id.slice(-6).toUpperCase()}</p>
                     </div>
                  </div>
                ))}
               </div>
               <div className="pt-6 border-t border-ojo-stone/10 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Order Total</span>
                  <span className="text-xl font-mono font-bold">₹{order.total.toLocaleString()}</span>
               </div>
               <button onClick={() => navigate("/")} className="w-full py-5 rounded-full border-2 border-ojo-stone/20 text-[10px] font-black uppercase tracking-widest hover:border-ojo-mustard transition-all group flex items-center justify-center gap-3">
                 Back to Shop <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

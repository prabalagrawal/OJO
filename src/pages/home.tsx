import { useState } from "react";
import { VerifiedBadge, VerifiedIcon } from "../components/brand.tsx";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, X, Globe, Eye, CheckCircle, User, Grid } from "lucide-react";
import { MotifTraditionalMandala } from "../components/motifs.tsx";

export function QuickViewModal({ product, onClose }: { product: any; onClose: () => void }) {
  const images = JSON.parse(product.images || "[]");
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const existing = cart.find((i: any) => i.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        quantity: 1,
        origin: product.origin
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage")); // Trigger storage event for layout
    window.location.reload(); // Refresh to update cart count in layout
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 lg:p-24"
      >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ojo-charcoal/80 backdrop-blur-3xl"
          />
          
          <motion.div 
            layoutId={`product-${product.id}`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-ojo-cream w-full max-w-6xl rounded-[60px] overflow-hidden shadow-4xl relative z-10 flex flex-col lg:flex-row max-h-[90vh] ring-1 ring-white/20"
          >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-50 p-4 bg-white/20 backdrop-blur-md rounded-full text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Image Side */}
          <div className="lg:w-1/2 relative bg-white h-[400px] lg:h-auto overflow-hidden">
            <div className="absolute inset-0 pattern-jali opacity-[0.05]" />
            <img 
              src={images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
            />
            <div className="absolute top-8 left-8">
               <VerifiedBadge className="scale-125" />
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex gap-4">
              {images.slice(1, 4).map((img: string, i: number) => (
                <div key={i} className="w-16 h-16 rounded-2xl border-2 border-white/50 overflow-hidden shadow-lg">
                   <img src={img} className="w-full h-full object-cover grayscale" />
                </div>
              ))}
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-12 relative overflow-y-auto">
            <div className="absolute inset-0 pattern-mandala opacity-[0.02] pointer-events-none" />
            
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <div className="px-4 py-1 bg-ojo-terracotta/10 text-ojo-terracotta border border-ojo-terracotta/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                   Direct from {product.origin} artisan
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-charcoal/30">OJO-REG-{product.id.substring(0,6)}</span>
               </div>
               
               <div className="space-y-2">
            <h2 className="text-4xl lg:text-6xl font-serif tracking-tighter leading-none text-ojo-charcoal">{product.name}</h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-serif text-ojo-mustard">₹{product.price.toLocaleString()}</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-ojo-charcoal/5 rounded-full">
                <User size={12} className="text-ojo-charcoal/40" />
                <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">{product.artisanName || "Master Guild Artisan"}</span>
              </div>
            </div>
               </div>
            </div>

            <div className="space-y-10">
               <div className="grid grid-cols-3 gap-6 border-y border-ojo-stone/20 py-8">
                  {[
                    { label: "Verified", icon: <CheckCircle size={14} /> },
                    { label: "Authentic", icon: <CheckCircle size={14} /> },
                    { label: "Direct Source", icon: <CheckCircle size={14} /> }
                  ].map((t, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 text-center">
                       <div className="text-ojo-mustard">{t.icon}</div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">{t.label}</span>
                    </div>
                  ))}
               </div>

               <p className="text-base font-light text-ojo-charcoal/70 leading-relaxed italic border-l-2 border-ojo-mustard/20 pl-8">
                 {product.story || product.description}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
               <button 
                onClick={() => navigate(`/product/${product.product_id || product.id}`)}
                className="flex-1 px-12 py-5 rounded-full border-2 border-ojo-charcoal text-[10px] font-black uppercase tracking-widest hover:bg-ojo-charcoal hover:text-white transition-all text-center"
               >
                 View Full Provenance
               </button>
               <button 
                onClick={handleAddToCart}
                className="flex-1 ojo-btn-primary !bg-ojo-mustard !text-ojo-charcoal hover:!bg-ojo-charcoal hover:!text-white"
               >
                 Add to Cart
               </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TrustStep({ step, index }: { step: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <motion.div 
      key={index}
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className={`p-8 bg-white border border-ojo-stone/40 rounded-[30px] shadow-lg shadow-ojo-charcoal/5 space-y-6 transition-all cursor-pointer relative overflow-hidden group
        ${isExpanded ? 'ring-2 ring-ojo-mustard' : ''}`}
    >
      <div className="absolute inset-0 pattern-jali opacity-[0.01]" />
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-ojo-charcoal/5 flex items-center justify-center group-hover:bg-ojo-mustard group-hover:text-white transition-all">
        {step.icon}
      </div>
      <h4 className="relative z-10 text-sm font-black uppercase tracking-widest text-ojo-charcoal">{step.title}</h4>
      <p className="relative z-10 text-[11px] font-light leading-relaxed opacity-50">{step.desc}</p>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 pt-4 overflow-hidden"
          >
            <div className="h-px w-8 bg-ojo-mustard mb-4" />
            <p className="text-[10px] italic text-ojo-mustard/80 leading-relaxed">{step.details}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && (
        <div className="text-[8px] font-black uppercase tracking-widest text-ojo-mustard opacity-0 group-hover:opacity-100 transition-opacity">
          Click to Expand Details
        </div>
      )}
    </motion.div>
  );
}

export function Home() {
  const navigate = useNavigate();

  // Hero Text
  const heroHeadline = "Nothing fake gets through OJO.";
  
  return (
    <div className="space-y-0 maximalist-gradient bg-ojo-cream">
      {/* Hero / Banner Section - Dark Editorial Authority */}
      <section className="relative overflow-hidden bg-ojo-charcoal text-ojo-soft-cream">
        <div className="absolute inset-0 pattern-mandala opacity-[0.08] pointer-events-none scale-150" />
        <div className="absolute inset-0 bg-gradient-to-br from-ojo-charcoal via-ojo-charcoal to-ojo-terracotta/20" />
        
        <div className="absolute top-10 right-10 opacity-10 animate-spin-slow pointer-events-none">
          <MotifTraditionalMandala size={800} color="#B07E1E" />
        </div>
        
        <div className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center px-6 md:px-12 py-24">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-12 relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="ojo-label flex items-center gap-4 text-ojo-mustard"
              >
                <div className="w-12 h-px bg-ojo-mustard" />
                <span>THE SOVEREIGN PROVENANCE REGISTRY</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-[110px] font-serif leading-[0.85] tracking-tighter text-ojo-cream"
              >
                India’s Authentic <br />
                <span className="italic text-ojo-terracotta">Artifacts.</span> <br />
                <span className="relative">
                  Verified.
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute -bottom-4 left-0 h-2 bg-ojo-mustard/40 rounded-full"
                  />
                </span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                <p className="text-xl md:text-2xl font-serif italic text-ojo-soft-cream/80 leading-relaxed border-l-2 border-ojo-mustard pl-8">
                  "{heroHeadline}"
                </p>
                <p className="text-xs md:text-sm font-light text-ojo-soft-cream/60 max-w-lg leading-relaxed ml-8">
                  Every OJO artifact passes through a three-tier rigorous provenance check. 
                  We bridge the gap between ancient lineage and modern digital trust.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 pt-4"
              >
                <button 
                  onClick={() => navigate('/category')}
                  className="bg-ojo-mustard text-ojo-black px-16 py-7 rounded-full font-black tracking-[0.3em] text-[10px] uppercase hover:shadow-[0_0_40px_rgba(176,126,30,0.5)] hover:-translate-y-1 transition-all active:scale-95"
                >
                  Explore Verified Products
                </button>
                <button className="flex items-center gap-4 text-ojo-soft-cream text-[10px] font-black uppercase tracking-widest hover:text-ojo-mustard transition-colors group">
                   The Authentication Process 
                   <div className="w-10 h-px bg-ojo-soft-cream/20 group-hover:bg-ojo-mustard group-hover:w-16 transition-all" />
                   <ArrowRight size={14} />
                </button>
              </motion.div>
            </div>
            
            <div className="lg:col-span-5 relative hidden lg:block">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                 animate={{ opacity: 1, scale: 1, rotate: 0 }}
                 transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
                 className="aspect-[4/5] rounded-[100px] overflow-hidden shadow-3xl border-[20px] border-white/5 relative group"
               >
                  <img 
                    src="https://images.unsplash.com/photo-1623126868352-794017688fa0?q=80&w=2670&auto=format&fit=crop" 
                    className="w-full h-full object-cover grayscale transition-transform duration-[3s] group-hover:scale-110 group-hover:grayscale-0"
                    alt="Artisan"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal to-transparent opacity-60" />
                  
                  <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/10 space-y-4">
                     <div className="flex items-center gap-4">
                        <VerifiedIcon className="scale-150" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">OJO Registry #882-JAIPUR</span>
                     </div>
                     <p className="text-xs font-serif italic text-white/90">"Craft and trust are two sides of the same sovereign coin."</p>
                  </div>
               </motion.div>
               
               {/* Decorative Abstract Elements for Depth */}
               <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ojo-mustard/20 rounded-full blur-[120px] animate-pulse" />
               <div className="absolute -top-20 -right-20 w-80 h-80 bg-ojo-terracotta/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - The Trust Protocol (Light) */}
      <section className="py-40 bg-ojo-cream relative overflow-hidden">
        <div className="absolute inset-0 pattern-lotus opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 space-y-8">
              <div className="ojo-label flex items-center gap-4 text-ojo-terracotta">
                <div className="w-12 h-px bg-ojo-terracotta" />
                <span>THE TRUST PROTOCOL</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif text-ojo-charcoal leading-tight tracking-tighter">
                Verification <br /><span className="italic text-ojo-terracotta">is our Lineage.</span>
              </h2>
              <p className="text-lg font-light text-ojo-charcoal opacity-60 leading-relaxed max-w-sm">
                Each OJO artifact follows a strict pathway of authentication before it enters our registry. No fakes. No imitations. Just truth.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { 
                  title: "Verified Source", 
                  desc: "Directly sourced from registered artisanal guilds.", 
                  icon: <ShieldCheck size={32} className="text-ojo-terracotta" />
                },
                { 
                  title: "Quality Checked", 
                  desc: "Rigorous standards for material and craft.", 
                  icon: <Eye size={32} className="text-ojo-terracotta" />
                },
                { 
                  title: "Origin Tracked", 
                  desc: "GI and history digitally verified.", 
                  icon: <Globe size={32} className="text-ojo-terracotta" />
                },
                { 
                  title: "Registry Entry", 
                  desc: "Every item given a unique fingerprint.", 
                  icon: <Grid size={32} className="text-ojo-terracotta" />
                }
              ].map((step, i) => (
                <div key={i} className="p-10 bg-white rounded-[40px] border border-ojo-stone/10 space-y-6 shadow-xl hover:border-ojo-mustard/40 transition-all group hover:-translate-y-2">
                   <div className="w-16 h-16 rounded-2xl bg-ojo-cream flex items-center justify-center group-hover:bg-ojo-mustard group-hover:text-white transition-all text-ojo-terracotta group-hover:text-white">
                      {step.icon}
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-ojo-charcoal">{step.title}</h4>
                   <p className="text-[11px] font-light leading-relaxed opacity-60">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Region - Immersive Visual Selector (Dark) */}

      <section className="py-40 bg-ojo-charcoal text-ojo-cream">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          <div className="text-center space-y-6">
            <div className="ojo-label flex items-center justify-center gap-4 text-ojo-mustard">
               <div className="w-12 h-px bg-ojo-mustard" />
               <span>REGIONAL ATLAS</span>
               <div className="w-12 h-px bg-ojo-mustard" />
            </div>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter">Cultural Epochs. <br/><span className="italic text-ojo-soft-cream">By Region.</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Kashmir", img: "https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670", color: "#E5E1D8" },
              { name: "Jaipur", img: "https://images.unsplash.com/photo-1590050752117-238444bc3fe2?q=80&w=2576", color: "#FDF2F0" },
              { name: "Kanchipuram", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2670", color: "#F0F4ED" },
              { name: "Bankura", img: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2670", color: "#FAF6F1" }
            ].map((region, i) => (
               <motion.div 
                key={i}
                whileHover={{ scale: 0.98 }}
                className="relative aspect-[3/4] rounded-[60px] overflow-hidden group cursor-pointer border border-white/5 shadow-2xl"
                onClick={() => {
                  navigate(`/category?origin=${region.name}`);
                }}
               >
                  <img src={region.img} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" alt={region.name} />
                  <div className="absolute inset-0 bg-ojo-charcoal/40 group-hover:bg-ojo-charcoal/20 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal to-transparent opacity-90" />
                  <div className="absolute bottom-12 left-0 w-full px-10 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Origin</span>
                    <h4 className="text-4xl font-serif tracking-tighter">{region.name}</h4>
                    <div className="w-8 h-px bg-ojo-mustard opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-700" />
                  </div>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Heritage Archive - Combined Story & Artisan Showcase (Dark) */}
      <section className="relative py-48 overflow-hidden bg-ojo-charcoal text-ojo-soft-cream">
        <div className="absolute inset-0 pattern-jali opacity-[0.04] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="ojo-label flex-col items-start gap-4 text-ojo-mustard">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-ojo-mustard" />
                <span>THE PROVENANCE NARRATIVE</span>
              </div>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none">
              From Origin <br/><span className="italic text-ojo-mustard">To Your Archive.</span>
            </h2>
            <div className="space-y-8 max-w-lg">
              <p className="text-lg font-light text-ojo-soft-cream opacity-60 leading-relaxed border-l-4 border-ojo-mustard/20 pl-8 italic">
                Authenticity isn't a badge, it's a journey. We travel to the heart of the village to ensure every thread and stroke is verified at source.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-6">
                <div className="space-y-2">
                  <div className="text-4xl font-serif text-ojo-mustard">47+</div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Registered Guilds</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-serif text-ojo-mustard">100%</div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Origin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-12 gap-4">
             <motion.div 
                initial={{ rotate: 5, scale: 0.9, opacity: 0 }}
                whileInView={{ rotate: -2, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="col-span-8 aspect-[3/4] rounded-[60px] overflow-hidden border-8 border-white/5 shadow-3xl group"
             >
                <img 
                  src="https://images.unsplash.com/photo-1590736962234-4537156942c1?q=80&w=2670&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
                  alt="Artisanal Heritage"
                />
             </motion.div>
             <motion.div 
                initial={{ rotate: -5, y: 40, opacity: 0 }}
                whileInView={{ rotate: 2, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="col-span-4 aspect-square rounded-[40px] overflow-hidden border-4 border-white/5 shadow-2xl mt-24"
             >
                <img 
                  src="https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale opacity-60"
                  alt="Craft Detail"
                />
             </motion.div>
             <div className="absolute -bottom-10 -right-10 translate-x-4 translate-y-4">
                <VerifiedBadge className="!w-32 !h-32" />
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - (Light transition to Footer) */}
      <section className="py-40 bg-ojo-cream text-ojo-charcoal relative overflow-hidden">
        <div className="absolute inset-0 pattern-lotus opacity-[0.03] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter">Own a Piece of <br/><span className="italic text-ojo-terracotta">Verified Heritage.</span></h2>
          <p className="text-lg font-light opacity-60 max-w-xl mx-auto leading-relaxed">
            Join the registry of those who value provenance over mass production. Authenticity is just one click away.
          </p>
          <div className="pt-6">
            <button 
              onClick={() => navigate('/category')}
              className="bg-ojo-mustard text-ojo-black px-24 py-8 rounded-full font-black tracking-[0.4em] text-xs uppercase hover:bg-ojo-charcoal hover:text-white transition-all shadow-3xl"
            >
              Explore the Full Registry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

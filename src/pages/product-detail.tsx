import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api.ts";
import { VerifiedBadge, VerifiedIcon } from "../components/brand.tsx";
import { motion, AnimatePresence } from "motion/react";
import { Truck, RotateCcw, ShieldCheck, MapPin, ArrowRight, ChevronLeft, MoreVertical, Heart, Grid, CheckCircle, Shield, Map, Eye, User, Sparkles, X } from "lucide-react";
import { MotifMandala, MotifLotus, MotifPaisley, MotifDiamond, MotifRangoli, MotifTraditionalMandala, MotifTraditionalRangoli } from "../components/motifs.tsx";

interface VerificationScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerificationScreen({ isOpen, onClose }: VerificationScreenProps) {
  const timeline = [
    { status: "Sourced", date: "April 12, 2026", desc: "Acquired from the Artisan Guild at prime source." },
    { status: "Checked", date: "April 15, 2026", desc: "Thread count and material purity audited." },
    { status: "Verified", date: "April 18, 2026", desc: "Geographic Indication (GI) confirmed by regional experts." },
    { status: "Listed", date: "Current", desc: "Entered into the Sovereign OJO Registry ledger." }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
           <motion.div onClick={onClose} className="absolute inset-0 bg-ojo-charcoal/90 backdrop-blur-xl" />
           
           <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="w-full max-w-4xl bg-ojo-cream rounded-[60px] overflow-hidden shadow-3xl relative z-10 flex flex-col lg:flex-row max-h-[90vh]"
           >
              <button onClick={onClose} className="absolute top-8 right-8 z-50 p-4 bg-ojo-charcoal text-white rounded-full">
                 <X size={24} />
              </button>

              {/* Left Side: Proof Summary */}
              <div className="lg:w-1/3 bg-ojo-charcoal p-12 text-ojo-soft-cream flex flex-col justify-center gap-10">
                 <div className="w-20 h-20 rounded-full border-2 border-ojo-mustard flex items-center justify-center">
                    <Shield size={36} className="text-ojo-mustard" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-ojo-mustard">Sovereign Proof</h2>
                    <p className="text-3xl font-serif italic text-ojo-white leading-tight">
                       Artifact Integrity <br /> Certificate
                    </p>
                 </div>
                 <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Registry Hash</span>
                       <p className="text-[10px] font-mono break-all opacity-80">OJO-SHA256-88F92A-44C1</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Validator</span>
                       <p className="text-[10px] font-serif italic">Ministry of Heritage & Craft</p>
                    </div>
                 </div>
              </div>

              {/* Right Side: Timeline & Verification Details */}
              <div className="lg:w-2/3 p-12 lg:p-20 overflow-y-auto space-y-16">
                 <div className="space-y-12">
                    <h3 className="text-2xl font-serif text-ojo-charcoal">Provenance <span className="italic text-ojo-stone">Timeline</span></h3>
                    
                    <div className="space-y-8 relative">
                       <div className="absolute left-6 top-2 bottom-2 w-px bg-ojo-stone/20" />
                       
                       {timeline.map((item, idx) => (
                         <div key={idx} className="flex gap-10 relative">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-colors ${idx === timeline.length - 1 ? 'bg-ojo-mustard text-white shadow-xl shadow-ojo-mustard/20' : 'bg-white border border-ojo-stone/20 text-ojo-charcoal/40'}`}>
                               {idx === timeline.length - 1 ? <CheckCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-ojo-mustard/40" />}
                            </div>
                            <div className="space-y-1 pb-4">
                               <div className="flex items-center gap-4">
                                  <h4 className="text-xs font-black uppercase tracking-widest text-ojo-charcoal">{item.status}</h4>
                                  <span className="text-[9px] font-medium opacity-30 italic">{item.date}</span>
                               </div>
                               <p className="text-xs font-light text-ojo-charcoal/60 leading-relaxed max-w-sm">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-ojo-stone/20">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-ojo-mustard">
                          <CheckCircle size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Material Audit Pass</span>
                       </div>
                       <p className="text-[10px] font-light opacity-50">Zero synthetic contaminants detected.</p>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-ojo-mustard">
                          <CheckCircle size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Labor Fair Audit Pass</span>
                       </div>
                       <p className="text-[10px] font-light opacity-50">Equitable wage distribution confirmed.</p>
                    </div>
                 </div>
              </div>
           </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("source");
  const navigate = useNavigate();

  const trustPillars = [
    { 
      id: "source", 
      title: "Verified Source", 
      icon: <VerifiedBadge className="w-5 h-5" />, 
      details: `Sourced directly from registered guilds in ${product?.origin || 'India'}. No middlemen involved in the chain of custody.`
    },
    { 
      id: "quality", 
      title: "Quality Checked", 
      icon: <Eye size={18} />, 
      details: "Thread count audited. Material purity certified (100% organic dyes and natural fibers)."
    },
    { 
      id: "tracked", 
      title: "Origin Tracked", 
      icon: <Map size={18} />, 
      details: "Digital provenance record exists for this item in the OJO Registry ledger since creation."
    }
  ];

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(p => {
        setProduct(p);
        // Fetch related products after we have the origin
        api.get("/products")
          .then(all => {
            const related = all
              .filter((item: any) => item.origin === p.origin && item.id !== p.id)
              .slice(0, 4);
            setRelatedProducts(related);
          });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    setAdding(true);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = { productId: product.id, name: product.name, price: product.price, quantity: 1 };
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    setTimeout(() => {
      setAdding(false);
      navigate("/cart");
    }, 600);
  };

  if (loading) return (
    <div className="py-60 text-center space-y-12 relative overflow-hidden">
       <div className="absolute inset-0 pattern-mandala opacity-[0.03] animate-spin-slow" />
       <div className="w-24 h-24 border-2 border-ojo-mustard border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
       <p className="font-serif italic text-ojo-charcoal/40 text-3xl tracking-tighter">Consulting the Registry Archives...</p>
    </div>
  );
  
  if (!product) return (
    <div className="py-60 text-center space-y-8 bg-white/40 rounded-[60px] m-12 border border-ojo-stone">
       <h1 className="text-6xl font-serif text-ojo-terracotta tracking-tighter leading-none">Registry Entry <br/> Not Found</h1>
       <button onClick={() => navigate("/")} className="ojo-label underline underline-offset-8">Return to Collections</button>
    </div>
  );

  const images = JSON.parse(product.images || "[]");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-ojo-cream -mx-6 md:-mx-12 -mt-12 relative overflow-hidden"
    >
      {/* Immersive Header/Gallery Section (Light) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative bg-ojo-cream">
        {/* Ornate Sidebar Info (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-1 border-r border-ojo-stone/20 pt-32 flex-col items-center gap-12 text-[9px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] opacity-30">
           <span>VERIFIED OJO REGISTRY ENTRY</span>
           <div className="w-px h-32 bg-ojo-stone/40" />
           <span>ARTIFACT ID: {id?.substring(0, 8)}</span>
        </div>

        {/* Hero Gallery Area */}
        <div className="lg:col-span-6 relative p-4 sm:p-8 lg:p-16">
          <div className="sticky top-32 space-y-12">
            <div className="group relative aspect-[4/5] rounded-[80px] overflow-hidden bg-white shadow-3xl border border-ojo-stone/10">
               <img 
                src={images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] scale-105 group-hover:scale-100"
               />
               <motion.div 
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowStory(true)}
                className="absolute bottom-12 left-12 cursor-pointer z-20 drop-shadow-2xl"
               >
                  <VerifiedBadge className="!w-24 !h-24" />
               </motion.div>
            </div>
            
            <div className="flex justify-center gap-4">
              {images.slice(0, 4).map((img: string, i: number) => (
                <div key={i} className="w-20 h-20 rounded-2xl overflow-hidden border border-ojo-stone/20 shadow-lg cursor-pointer hover:border-ojo-mustard transition-all">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content/Detail Area */}
        <div className="lg:col-span-5 px-8 lg:px-16 pt-16 lg:pt-32 pb-48 relative">
           <div className="max-w-md mx-auto space-y-12">
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <div className="ojo-label text-ojo-terracotta flex items-center gap-4">
                     <div className="w-8 h-px bg-ojo-terracotta/40" />
                     {product.origin.toUpperCase()} ORIGIN
                   </div>
                   <div className="text-[9px] font-black font-mono text-ojo-charcoal/20">
                     OJO-ID: {product.origin.substring(0,3).toUpperCase()}-{id?.substring(0,4).toUpperCase()}-2026
                   </div>
                 </div>
                 <div className="space-y-4">
                    <h1 className="text-6xl lg:text-7xl font-serif tracking-tighter leading-none text-ojo-charcoal">
                      {product.name}
                    </h1>
                    
                    {/* Trust Strip */}
                    <div className="flex flex-wrap items-center gap-6 py-4 border-y border-ojo-stone/10">
                       <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-ojo-mustard" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">Verified by OJO</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-ojo-mustard" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">Authentic Source</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-ojo-mustard" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">Secure Checkout</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <VerifiedIcon className="scale-110" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">OJO Registry Verified</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-baseline gap-4 border-b border-ojo-stone/20 pb-8">
                 <span className="text-5xl font-serif text-ojo-charcoal">₹{product.price.toLocaleString()}</span>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-medium opacity-30 italic">Registry Certified</span>
                   <span className="text-[9px] font-black text-ojo-mustard uppercase tracking-widest mt-1">12 people viewed this today</span>
                 </div>
              </div>

              {/* Transparency Card (New) */}
              <div className="p-10 bg-white rounded-[40px] shadow-2xl border border-ojo-stone/10 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 pattern-lotus opacity-5" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-ojo-terracotta">Provenance Data</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Origin</label>
                    <p className="text-sm font-medium">{product.origin}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Maker</label>
                    <p className="text-sm font-medium">{product.artisanName || "Master Guild"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Process</label>
                    <p className="text-sm font-medium">Handcrafted</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Verification</label>
                    <p className="text-sm font-black text-ojo-olive tracking-widest uppercase text-[10px]">Tier 3 Pass</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowStory(true)}
                  className="w-full py-4 border border-ojo-mustard/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-ojo-mustard hover:bg-ojo-mustard hover:text-white transition-all transform hover:-translate-y-1"
                >
                  View Verification Report
                </button>
              </div>

              {/* Trust Panel (Accordion) */}
              <div className="space-y-4">
                {trustPillars.map((pillar) => (
                  <div 
                    key={pillar.id}
                    onClick={() => setExpandedSection(expandedSection === pillar.id ? null : pillar.id)}
                    className="bg-white rounded-3xl border border-ojo-stone/10 shadow-lg cursor-pointer overflow-hidden group"
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-ojo-terracotta">{pillar.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{pillar.title}</span>
                      </div>
                      <RotateCcw size={14} className={`text-ojo-stone/40 transform transition-transform ${expandedSection === pillar.id ? 'rotate-180 text-ojo-mustard' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {expandedSection === pillar.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-xs font-light text-ojo-charcoal opacity-60 leading-relaxed italic border-l border-ojo-mustard/20 pl-4">
                            {pillar.details}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* CTA AREA */}
              <div className="pt-8 space-y-6">
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={addToCart}
                    disabled={adding}
                    className="w-full bg-ojo-mustard text-ojo-charcoal py-8 rounded-[40px] text-[11px] font-black uppercase tracking-[0.6em] hover:bg-ojo-charcoal hover:text-white transition-all shadow-3xl disabled:opacity-50"
                  >
                    {adding ? "ACQUIRING..." : "ADD TO REGISTRY"}
                  </button>
                  <button className="w-full bg-ojo-terracotta text-white py-8 rounded-[40px] text-[11px] font-black uppercase tracking-[0.6em] hover:bg-ojo-charcoal transition-all shadow-3xl">
                    BUY NOW
                  </button>
                </div>
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={14} />
                       <span className="text-[8px] font-black uppercase tracking-widest">Verified Product</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <CheckCircle size={14} />
                       <span className="text-[8px] font-black uppercase tracking-widest">Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Origin Story Section (Light) */}
      <section className="py-40 bg-ojo-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 lg:order-1">
             <div className="aspect-square rounded-[80px] overflow-hidden shadow-3xl border border-ojo-stone/10">
               <img 
                src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2670&auto=format&fit=crop" 
                className="w-full h-full object-cover" 
                alt="Origin" 
               />
             </div>
          </div>
          <div className="space-y-12 order-1 lg:order-2">
            <div className="ojo-label flex items-center gap-4">
              <div className="w-12 h-px bg-ojo-terracotta" />
              <span>THE ORIGIN STORY</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-ojo-charcoal leading-tight tracking-tighter">
              Legacy from <br/><span className="italic text-ojo-terracotta">{product.origin}.</span>
            </h2>
            <p className="text-lg font-light text-ojo-charcoal opacity-60 leading-relaxed border-l-4 border-ojo-mustard pl-10 italic">
              {product.story || `The craft of ${product.name} is a testament to generations of skill passed down through blood and memory. Each artifact is not just a product, but a timeline of a region's soul.`}
            </p>
          </div>
        </div>
      </section>

      {/* Maker Section (Dark) */}
      <section className="py-40 bg-ojo-charcoal text-ojo-soft-cream">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="ojo-label flex items-center gap-4 text-ojo-mustard">
              <div className="w-12 h-px bg-ojo-mustard" />
              <span>MEET THE MAKER</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter">The Hand <br/><span className="italic text-ojo-mustard">Behind the Art.</span></h2>
            <p className="text-lg font-light opacity-80 leading-relaxed max-w-lg">
              {product.artisanName || "Master Artisan"} represents the peak of regional craftsmanship. By bringing this artifact into your home, you directly support the continuity of this ancient guild.
            </p>
            <div className="flex items-center gap-6 pt-6">
              <div className="w-20 h-20 rounded-full border-2 border-ojo-mustard flex items-center justify-center p-1">
                 <div className="w-full h-full rounded-full bg-ojo-mustard/20 flex items-center justify-center">
                    <User size={32} className="text-ojo-mustard" />
                 </div>
              </div>
              <div>
                <h4 className="text-lg font-serif">{product.artisanName || "Master Artisan"}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Guild Member #882-{id?.substring(0,2)}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-white/5 border border-white/5">
              <img src="https://images.unsplash.com/photo-1590736962234-4537156942c1?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover grayscale" />
            </div>
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-white/5 border border-white/5 mt-12">
              <img src="https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section (Light) */}
      <section className="max-w-7xl mx-auto px-6 py-40 space-y-16">
        <div className="flex items-center justify-between">
           <div className="space-y-4">
              <div className="ojo-label flex items-center gap-4">
                 <div className="w-12 h-px bg-ojo-mustard" />
                 <span>CURATED DISCOVERY</span>
              </div>
              <h3 className="text-4xl font-serif text-ojo-charcoal tracking-tighter">Similar <span className="italic text-ojo-stone">Verified Entries.</span></h3>
           </div>
           <button onClick={() => navigate("/")} className="ojo-btn-primary !py-4">View All Registry</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-20">
            {relatedProducts.length > 0 ? relatedProducts.map((p, idx) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col gap-6 group cursor-pointer" 
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="maximalist-card overflow-hidden !p-1 relative bg-white">
                  <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden bg-ojo-stone/10">
                    <div className="absolute inset-0 pattern-jali opacity-[0.02]" />
                    <img 
                      src={JSON.parse(p.images || "[]")[0]} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                      alt={p.name}
                    />
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 duration-500">
                       <VerifiedBadge className="scale-75" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 px-4 relative">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <VerifiedIcon className="shrink-0" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-ojo-mustard truncate">{p.origin}</span>
                      </div>
                      <h4 className="font-serif text-xl md:text-2xl leading-tight group-hover:text-ojo-terracotta transition-colors truncate tracking-tighter">
                        {p.name}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pt-1.5">
                      <span className="text-base md:text-lg font-serif text-ojo-charcoal leading-none whitespace-nowrap">₹{p.price.toLocaleString()}</span>
                      <div className="w-6 h-[1px] bg-ojo-mustard mt-2 group-hover:w-full transition-all duration-700" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-6 group cursor-pointer animate-pulse">
                   <div className="aspect-[4/5] rounded-[40px] bg-ojo-stone/10 border border-ojo-stone/30 relative" />
                   <div className="space-y-2 px-4">
                      <div className="h-2 w-16 bg-ojo-stone/20 rounded" />
                      <div className="h-4 w-32 bg-ojo-stone/20 rounded" />
                   </div>
                </div>
              ))
            )}
        </div>
      </section>

      {/* Navigation Return */}
      <div className="fixed top-12 left-12 z-50">
         <button 
          onClick={() => navigate(-1)} 
          className="p-4 bg-white/80 backdrop-blur-md border border-ojo-stone/40 rounded-full shadow-2xl hover:border-ojo-terracotta group transition-all"
         >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
         </button>
      </div>

      <VerificationScreen isOpen={showStory} onClose={() => setShowStory(false)} />

      {/* Sticky Conversion Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 inset-x-0 z-[60] bg-white/90 backdrop-blur-2xl border-t border-ojo-stone/20 p-6 lg:p-8"
      >
         <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 lg:gap-16">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8">
               <div className="flex flex-col">
                 <span className="text-xl lg:text-3xl font-serif text-ojo-charcoal leading-none">₹{product.price.toLocaleString()}</span>
                 <div className="flex items-center gap-1 mt-1">
                    <ShieldCheck size={10} className="text-ojo-mustard" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-ojo-mustard">OJO Registry Verified</span>
                 </div>
               </div>
               <div className="hidden lg:flex flex-col border-l border-ojo-stone/30 pl-8">
                 <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">In Stock</span>
                 <span className="text-xs font-serif italic text-ojo-stone">Ready for provenance verification</span>
               </div>
            </div>
            <div className="flex items-center gap-4 lg:gap-8 flex-1 max-w-xl">
               <button 
                onClick={addToCart}
                disabled={adding}
                className="flex-1 bg-ojo-charcoal text-ojo-soft-cream py-4 lg:py-6 rounded-2xl lg:rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-ojo-terracotta hover:text-white transition-all disabled:opacity-50 shadow-xl"
               >
                 {adding ? "ACQUIRING..." : "ACQUIRE NOW"}
               </button>
               <button className="hidden sm:flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 rounded-full border border-ojo-stone/40 text-ojo-charcoal hover:border-ojo-mustard hover:text-ojo-mustard transition-all">
                  <Heart size={24} />
               </button>
            </div>
         </div>
      </motion.div>
    </motion.div>
  );
}

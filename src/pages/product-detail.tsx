import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api.ts";
import { VerifiedBadge, VerifiedIcon } from "../components/brand.tsx";
import { motion, AnimatePresence } from "motion/react";
import { Truck, RotateCcw, ShieldCheck, MapPin, ArrowRight, ChevronLeft, MoreVertical, Heart, Grid, CheckCircle, Shield, Map, Eye, User } from "lucide-react";
import { MotifMandala, MotifLotus, MotifPaisley, MotifDiamond, MotifRangoli, MotifTraditionalMandala, MotifTraditionalRangoli } from "../components/motifs.tsx";

interface VerificationScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerificationScreen({ isOpen, onClose }: VerificationScreenProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-ojo-red text-ojo-beige flex flex-col pt-12"
        >
           <button onClick={onClose} className="absolute top-12 left-6 p-2 bg-white/10 rounded-full">
              <ChevronLeft size={24} />
           </button>

           <div className="flex flex-col items-center gap-8 py-12">
              <div className="w-24 h-24 rounded-full border-4 border-ojo-beige/20 flex items-center justify-center">
                 <Shield size={48} className="text-ojo-beige" />
              </div>
              <div className="text-center space-y-4">
                 <h2 className="text-sm font-black uppercase tracking-[0.4em] opacity-40">Verified</h2>
                 <p className="text-3xl font-serif italic text-ojo-beige px-12">
                    This product is <br /> Authentic & Trusted
                 </p>
              </div>
           </div>

           <div className="flex-grow bg-ojo-beige rounded-t-[60px] p-10 space-y-12 shadow-2xl-up">
              <div className="space-y-10 pt-10">
                 {[
                   { label: "Verified Source", icon: <CheckCircle className="text-ojo-terracotta" size={24} />, desc: "Directly sourced from registered artisanal guilds." },
                   { label: "Quality Checked", icon: <Eye className="text-ojo-terracotta" size={24} />, desc: "Rigorous standards for material purity and craft." },
                   { label: "Origin Tracked", icon: <Map className="text-ojo-terracotta" size={24} />, desc: "Geographic Indication (GI) and history verified." },
                   { label: "Authentic Always", icon: <Shield className="text-ojo-terracotta" size={24} />, desc: "Guaranteed by the OJO trust registry ledger." }
                 ].map((item, idx) => (
                   <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    key={idx} 
                    className="flex items-start gap-6 group"
                   >
                     <div className="p-3 bg-ojo-stone/20 rounded-2xl group-hover:bg-ojo-terracotta transition-colors">
                        {item.icon}
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-widest text-ojo-charcoal">{item.label}</h4>
                        <p className="text-[10px] text-ojo-charcoal/40 leading-relaxed max-w-[200px]">{item.desc}</p>
                     </div>
                   </motion.div>
                 ))}
              </div>

              <div className="pt-10">
                 <button 
                  onClick={onClose}
                  className="w-full bg-ojo-mustard text-ojo-beige py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95"
                 >
                   Know the Story
                 </button>
              </div>
           </div>
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
    <div className="min-h-screen bg-ojo-beige -mx-6 md:-mx-12 -mt-12 relative overflow-hidden maximalist-gradient">
      {/* Detailed Background Patterns - Paisley & Lotus */}
      <div className="absolute inset-0 pattern-paisley opacity-40 pointer-events-none mix-blend-multiply" />
      <div className="absolute inset-0 pattern-lotus opacity-30 pointer-events-none mix-blend-multiply" />

      {/* Background Decor */}
      <div className="absolute top-[10%] -right-[15%] opacity-15 animate-spin-slow pointer-events-none">
        <MotifTraditionalMandala size={1200} color="#B8860B" />
      </div>
      <div className="absolute top-[40%] -left-[10%] opacity-[0.05] animate-float pointer-events-none">
        <MotifTraditionalRangoli size={600} color="#A63F1D" />
      </div>
      
      <VerificationScreen isOpen={showStory} onClose={() => setShowStory(false)} />
      
      {/* Immersive Header/Gallery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* Ornate Sidebar Info (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-1 border-r border-ojo-stone/20 pt-32 flex-col items-center gap-12 text-[9px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] opacity-30">
           <span>VERIFIED OJO REGISTRY ENTRY</span>
           <div className="w-px h-32 bg-ojo-stone/40" />
           <span>SOVEREIGN ARTIFACT ID: {id?.substring(0, 8)}</span>
        </div>

        {/* Hero Gallery Area */}
        <div className="lg:col-span-7 relative p-4 sm:p-8 lg:p-16">
          <div className="sticky top-32 space-y-12">
            <div className="group relative aspect-[4/5] rounded-[60px] overflow-hidden bg-white shadow-2xl border border-ojo-stone/40">
               <div className="absolute inset-0 pattern-jali opacity-[0.02]" />
               <img 
                src={images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
               />
               <motion.div 
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowStory(true)}
                className="absolute bottom-12 left-12 cursor-pointer z-20 drop-shadow-2xl"
               >
                  <VerifiedBadge className="!w-24 !h-24" />
               </motion.div>
               <div className="absolute top-12 right-12 flex gap-4">
                  <button className="p-4 bg-white/60 backdrop-blur-md rounded-full text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all shadow-xl">
                    <Heart size={20} />
                  </button>
               </div>
            </div>
            
            {/* Visual Social Proof / Auth Steps */}
            <div className="flex justify-between items-center px-8 text-ojo-charcoal/30">
               <div className="flex items-center gap-4">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Authentication Secured</span>
               </div>
               <div className="h-px flex-grow mx-8 bg-ojo-stone/20" />
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-terracotta">OJO REGISTERED</div>
            </div>
          </div>
        </div>

        {/* Content/Detail Area */}
        <div className="lg:col-span-4 bg-white/40 backdrop-blur-md border-l border-ojo-stone/20 min-h-screen px-8 lg:px-16 pt-16 lg:pt-32 pb-48 relative overflow-hidden">
           <div className="absolute inset-0 pattern-mandala opacity-[0.02] pointer-events-none" />
           <div className="absolute top-0 right-0 w-4 h-full pattern-border-trim opacity-10" />
           
           <div className="max-w-md mx-auto space-y-16 relative z-10">
              <div className="space-y-6">
                 <div className="ojo-label text-ojo-mustard flex items-center gap-4">
                   <div className="w-8 h-px bg-ojo-mustard/40" />
                   {product.origin.toUpperCase()} ORIGIN
                 </div>
                 <div className="space-y-2">
                    <h1 className="text-6xl lg:text-7xl font-serif tracking-tighter leading-none text-ojo-charcoal">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-3">
                      <VerifiedIcon className="scale-110" />
                      <span className="text-[11px] font-black uppercase tracking-widest opacity-20 italic">Validated Heritage Entry</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-serif text-ojo-terracotta">₹{product.price.toLocaleString()}</span>
                    <span className="text-[10px] font-medium opacity-30 italic">Includes Sovereign Registry Certificate</span>
                 </div>
                 <div className="h-[2px] w-full bg-gradient-to-r from-ojo-terracotta/40 via-ojo-mustard/20 to-transparent" />
              </div>

              <div className="space-y-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard border-b border-ojo-mustard/10 pb-4">Provenance Architecture</h3>
                 
                 <div className="space-y-4">
                    {trustPillars.map((pillar) => (
                      <div 
                        key={pillar.id}
                        className={`p-6 rounded-[30px] border transition-all cursor-pointer ${expandedSection === pillar.id ? 'bg-white border-ojo-mustard/30 shadow-xl' : 'bg-white/20 border-ojo-stone/20 overflow-hidden'}`}
                        onClick={() => setExpandedSection(expandedSection === pillar.id ? null : pillar.id)}
                      >
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-xl ${expandedSection === pillar.id ? 'bg-ojo-mustard text-white' : 'bg-ojo-stone/10 text-ojo-charcoal/40'}`}>
                                  {pillar.icon}
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal">{pillar.title}</span>
                            </div>
                            <ArrowRight size={14} className={`transition-transform duration-300 ${expandedSection === pillar.id ? 'rotate-90 text-ojo-mustard' : 'text-ojo-stone/40'}`} />
                         </div>
                         <AnimatePresence>
                            {expandedSection === pillar.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="pt-4 overflow-hidden"
                              >
                                 <p className="text-[11px] font-light leading-relaxed text-ojo-charcoal/60 pl-[52px]">
                                    {pillar.details}
                                 </p>
                              </motion.div>
                            )}
                         </AnimatePresence>
                      </div>
                    ))}
                 </div>

                 {/* Deepened Origin Story Area */}
                 <div className="relative p-10 bg-ojo-terracotta/5 rounded-[40px] border border-ojo-terracotta/10 overflow-hidden group">
                    <div className="absolute top-0 right-0 opacity-[0.08] -mr-12 -mt-12 group-hover:rotate-12 transition-transform duration-1000">
                      <MotifPaisley size={180} color="#A63F1D" />
                    </div>
                    <div className="absolute bottom-0 left-0 opacity-[0.08] -ml-12 -mb-12 group-hover:-rotate-12 transition-transform duration-1000">
                      <MotifLotus size={180} color="#D4AF37" />
                    </div>
                    
                    <div className="relative z-10 space-y-8">
                       <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-full bg-ojo-terracotta/10 flex items-center justify-center border border-ojo-terracotta/20">
                            <MapPin size={24} className="text-ojo-terracotta" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-ojo-terracotta/60">Origin Story</h4>
                            <span className="font-serif italic text-ojo-charcoal text-2xl tracking-tighter">The Legend of {product.origin}</span>
                         </div>
                       </div>

                       <div className="space-y-6">
                         <p className="text-[13px] font-light leading-relaxed opacity-70 font-sans text-ojo-charcoal/80 first-letter:text-4xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-ojo-terracotta">
                           {product.story || `In the heart of ${product.origin}, where the rivers whisper ancient secrets and the soil holds the rhythm of a thousand years, 
                           the craft of ${product.name} was born. It is said that the first weavers drew patterns from the morning frost on lotus leaves 
                           and the spiraling dance of peacocks.`}
                         </p>
                       </div>

                       <div className="pt-4 flex items-center gap-6">
                         <div className="ojo-label text-[8px] opacity-40">Regional Heritage Verified</div>
                         <div className="h-px flex-grow bg-ojo-stone/20" />
                          <MotifTraditionalMandala size={40} color="#B8860B" opacity={0.3} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 space-y-12">
                 <div className="p-8 bg-ojo-charcoal text-ojo-beige rounded-[40px] relative overflow-hidden group border border-ojo-mustard/20">
                    <div className="absolute inset-0 pattern-jali opacity-[0.05]" />
                    <div className="relative z-10 space-y-6">
                       <h4 className="text-xs font-black uppercase tracking-[0.4em] text-ojo-mustard">The Artisan Soul</h4>
                       <p className="text-xs font-light opacity-60 leading-relaxed italic">
                         "Each touch of the hand creates a connection between the past and the present. 
                         This artifact carries the breath of my ancestors."
                       </p>
                       <div className="flex items-center gap-4 pt-2">
                          <div className="w-10 h-10 rounded-full bg-ojo-mustard/20 border border-ojo-mustard/40 flex items-center justify-center">
                            <User size={16} className="text-ojo-mustard" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black uppercase tracking-widest">{product.artisanName || "Master Artisan"}</span>
                             <span className="text-[8px] opacity-40 tracking-[0.2em]">REGISTERED OJO CRAFTSMAN</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-8 pt-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard border-b border-ojo-mustard/10 pb-4">Patron Chronicles</h3>
                <div className="space-y-6">
                   {product.reviews?.length > 0 ? (
                     product.reviews.map((review: any) => (
                       <div key={review.id} className="p-6 bg-white/40 rounded-3xl border border-ojo-stone/20 space-y-3">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal">{review.userName}</span>
                             <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < review.rating ? 'bg-ojo-mustard' : 'bg-ojo-stone/20'}`} />
                                ))}
                             </div>
                          </div>
                          <p className="text-[11px] font-light leading-relaxed opacity-60 font-serif italic italic text-ojo-charcoal/80">
                            "{review.comment}"
                          </p>
                       </div>
                     ))
                   ) : (
                     <p className="text-[10px] opacity-30 italic">No chronicles yet from our patrons.</p>
                   )}
                </div>
              </div>

              <div className="space-y-6 pt-8">
                 <button 
                  onClick={addToCart}
                  disabled={adding}
                  className="w-full bg-ojo-charcoal text-white py-8 rounded-[40px] text-[11px] font-black uppercase tracking-[0.6em] hover:bg-ojo-terracotta transition-all shadow-3xl disabled:opacity-50 group overflow-hidden relative"
                 >
                   <div className="absolute inset-x-0 bottom-0 h-1 bg-ojo-mustard/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                   {adding ? "ARCHIVING TO REGISTRY..." : "ACQUIRE ARTIFACT"}
                 </button>
                 <div className="flex items-center justify-center gap-3 text-[9px] font-medium opacity-30 uppercase tracking-widest">
                    <Truck size={12} />
                    <span>Complimentary Secure Transit Worldwide</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Related Products Section - Curated Provenance */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.length > 0 ? relatedProducts.map((p, idx) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col gap-6 group cursor-pointer" 
                onClick={() => navigate(`/product/${p.id}`)}
              >
                 <div className="aspect-[4/5] rounded-[40px] overflow-hidden bg-white border border-ojo-stone/30 relative">
                    <div className="absolute inset-0 pattern-jali opacity-[0.02]" />
                    <img 
                      src={JSON.parse(p.images || "[]")[0]} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      alt={p.name}
                    />
                    <div className="absolute top-6 right-6">
                       <VerifiedBadge className="scale-50" />
                    </div>
                 </div>
                 <div className="space-y-2 px-4">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-ojo-mustard">{p.origin} REGISTER</span>
                    <h4 className="text-xl font-serif tracking-tighter opacity-80 group-hover:text-ojo-terracotta transition-colors truncate">{p.name}</h4>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-sm font-serif">₹{p.price.toLocaleString()}</span>
                       <div className="w-8 h-px bg-ojo-mustard/40" />
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

      {/* Sticky Conversion Footer (Mobile & Conversion focused) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 inset-x-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-ojo-stone/30 p-6 lg:hidden"
      >
         <div className="flex items-center justify-between gap-6">
            <div className="flex flex-col">
               <span className="text-2xl font-serif text-ojo-charcoal leading-none">₹{product.price.toLocaleString()}</span>
               <span className="text-[8px] font-black uppercase tracking-widest text-ojo-mustard mt-1">Registry Verified</span>
            </div>
            <button 
              onClick={addToCart}
              disabled={adding}
              className="flex-grow bg-ojo-charcoal text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ojo-terracotta transition-all disabled:opacity-50"
            >
              {adding ? "ARCHIVING..." : "ACQUIRE NOW"}
            </button>
         </div>
      </motion.div>
    </div>
  );
}

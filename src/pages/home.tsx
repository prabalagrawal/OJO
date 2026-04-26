import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence 
} from "motion/react";
import { 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  MapPin, 
  Search, 
  Lock,
  Globe,
  Truck,
  RefreshCw,
  Award,
  Zap,
  Info,
  Map as MapIcon,
  Home,
  ShoppingBag,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotifSystem, PatternDivider } from "../components/motifs.tsx";
import { OjoLogo } from "../components/brand.tsx";
import { IndiaExplorer, StateDrawer } from "../components/india-map.tsx";
import { QuickViewModal } from "../components/quick-view-modal.tsx";
import { BottomSheet } from "../components/bottom-sheet.tsx";
import { toast } from "sonner";
import { PRODUCT_DATASET, Product } from "../data/product-dataset";

const DECISION_TAGS = ["Most Trusted", "Best for Gifting", "Premium Pick", "Masterpiece"];

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const addItem = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: any) => i.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: Array.isArray(product.images) ? product.images[0] : JSON.parse(product.images || "[]")[0],
        origin: product.origin,
        quantity: 1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const items = PRODUCT_DATASET.slice(0, 12).map((p, i) => ({
          ...p,
          description: p.short_description,
          images: JSON.stringify([p.image]),
          artisanName: "Master Artisan",
          decisionTag: DECISION_TAGS[i % DECISION_TAGS.length],
          story: "Each piece is hand-crafted using heritage methods passed down through generations."
        })) as any;
        setProducts(items);
        setRecommendedProducts([...PRODUCT_DATASET].sort(() => 0.5 - Math.random()).slice(0, 6));
      } catch (err) {
        toast.error("Failed to load cultural archives.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-ojo-cream selection:bg-ojo-mustard selection:text-white overflow-x-hidden">
      {/* 1. HERO: CINEMATIC ENTRY */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-ojo-charcoal">
        {/* Background Layering */}
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" 
            alt="Editorial Heritage" 
            className="w-full h-full object-cover grayscale-[0.5] brightness-[0.7]"
            referrerPolicy="no-referrer"
          />
          {/* Motif Texture Layer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.5 }}
            className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
          >
             <MotifSystem type="ajrakh" scale={2} opacity={0.04} />
          </motion.div>
          {/* cinematic overlays */}
          <div className="absolute inset-0 z-20 bg-ojo-charcoal/40" />
          <div className="absolute inset-0 z-30 bg-gradient-to-t from-ojo-charcoal via-ojo-charcoal/20 to-ojo-charcoal/40" />
        </motion.div>

        <div className="relative z-40 text-center space-y-8 md:space-y-10 px-6 max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity: heroOpacity }}
          >
            <OjoLogo size="lg" className="mx-auto mb-8 md:mb-10 scale-75 md:scale-100 opacity-90 brightness-[5] filter" />
            <h1 className="text-4xl md:text-[84px] font-serif text-white leading-[1.1] md:leading-[0.95] tracking-tighter italic">
              India’s Authentic <br className="hidden md:block" />
              Products. Verified.
            </h1>
            <p className="mt-6 md:mt-10 text-base md:text-2xl text-white/70 max-w-2xl mx-auto font-light italic leading-relaxed">
              Discover India’s authentic products by origin.
            </p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8 md:mt-10 flex items-center justify-center gap-4 md:gap-6 text-white/40"
            >
               <div className="h-px w-8 md:w-12 bg-white/20" />
               <div className="flex items-center gap-2 md:gap-3">
                  <ShieldCheck size={16} className="text-ojo-mustard" />
                  <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center">Verified at source</span>
               </div>
               <div className="h-px w-8 md:w-12 bg-white/20" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="pt-8 md:pt-12 w-full"
          >
            <button 
              onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })}
              className="ojo-btn-primary w-full md:w-auto !px-8 md:!px-24 !py-5 md:!py-8 !bg-white !text-ojo-charcoal hover:!bg-ojo-mustard group transition-all duration-500 shadow-2xl relative overflow-hidden text-sm md:text-base font-black tracking-widest"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                 Explore India ↓
              </span>
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-12 flex items-center gap-4 opacity-40">
          <div className="w-12 h-[1px] bg-white" />
          <span className="text-[9px] font-black uppercase tracking-[1em] text-white">Sovereign Protocol 2026</span>
        </div>
      </section>

      {/* 2. INDIA EXPLORER: MOBILE-OPTIMIZED */}
      <section id="explorer" className="min-h-screen py-16 md:py-20 flex flex-col justify-center bg-ojo-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
           <MotifSystem type="jaali" scale={4} opacity={1} />
        </div>
        <div className="w-full px-6 md:px-0 space-y-10 md:space-y-12 relative z-10">
          <div className="text-center space-y-4">
             <span className="ojo-badge ojo-badge-verified !text-[8px] md:!text-[10px]">SIGNATURE EXPERIENCE</span>
             <h3 className="text-4xl md:text-7xl font-serif italic text-ojo-charcoal tracking-tighter leading-none">Discover by Origin.</h3>
             <p className="text-ojo-charcoal/40 font-light italic text-base md:text-lg max-w-xl mx-auto">Select a state to audit its verified cultural records.</p>
          </div>
          
          {/* Mobile State List - Refined Card List */}
          <div className="md:hidden space-y-6">
             <div className="flex flex-col gap-3">
                {["Rajasthan", "Gujarat", "Kashmir", "Bengal", "Kerala", "Assam"].map((stateName) => (
                  <motion.button 
                    key={stateName}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedState({ id: stateName.toLowerCase(), name: stateName })}
                    className="flex items-center justify-between p-6 bg-white border border-ojo-stone/10 rounded-2xl active:bg-ojo-cream transition-colors group"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-ojo-cream rounded-full flex items-center justify-center text-ojo-mustard">
                           <MapPin size={18} />
                        </div>
                        <span className="text-base font-serif italic text-ojo-charcoal">{stateName}</span>
                     </div>
                     <ChevronRight size={16} className="text-ojo-stone/30 group-hover:text-ojo-mustard transition-colors" />
                  </motion.button>
                ))}
             </div>
          </div>

          <div className="relative w-full max-w-[1920px] mx-auto hidden md:block">
            <IndiaExplorer onStateClick={(state) => setSelectedState(state)} />
          </div>
        </div>
      </section>

      <PatternDivider type="warli" />

      {/* 3. FEATURED CULTURAL STORY: MOBILE-FIRST */}
      <section className="relative min-h-[70vh] md:h-[80vh] flex items-center overflow-hidden bg-ojo-charcoal">
         <div className="absolute inset-0 opacity-20 group">
            <img 
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" 
              alt="Artisan Story"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-ojo-charcoal/60" />
         </div>
         
         <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
            <MotifSystem type="jaali" scale={2} />
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl space-y-8 md:space-y-12"
            >
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-ojo-mustard">The Sovereign Narrative</span>
               <h2 className="text-5xl md:text-8xl font-serif italic text-white leading-none tracking-tighter">
                  From the deserts <br className="hidden md:block" />
                  of Rajasthan...
               </h2>
               <p className="text-lg md:text-2xl text-white/60 font-light italic leading-snug line-clamp-3 md:line-clamp-none">
                  "Every artifact is a travelogue of technique. We trace the lineage from the shifting sands to the high mountain looms."
               </p>
               <button onClick={() => navigate("/category")} className="ojo-btn-primary w-full md:w-auto !px-12 md:!px-16 !py-5 md:!py-6 !bg-white !text-ojo-charcoal hover:!bg-ojo-mustard font-black tracking-widest text-xs">Explore Collection</button>
            </motion.div>
         </div>
      </section>

      <PatternDivider type="ajrakh" />

      {/* 4. PRODUCT DISCOVERY: ASYMMETRICAL CURATION */}
      <section className="py-60 px-6 md:px-20 bg-ojo-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
           <MotifSystem type="jaali" scale={1.5} />
        </div>
        <div className="max-w-[1800px] mx-auto space-y-40 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 border-b border-ojo-charcoal/10 pb-20">
            <div className="space-y-8">
              <span className="ojo-badge ojo-badge-verified !border-ojo-mustard/30">Curation Registry</span>
              <h2 className="text-6xl md:text-8xl font-serif text-ojo-charcoal tracking-tighter leading-none italic">Verified Artifacts.</h2>
            </div>
            <p className="max-w-md text-xl text-ojo-charcoal/60 italic font-light leading-relaxed">
              Objects prioritized by rarity and cluster-purity. Selection based on the Autumn 2026 Sovereign Audit.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-24">
             {/* Large Feature Card - Takes full width on mobile, 8 cols on desktop */}
             {products.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 onClick={() => setQuickViewProduct(products[0])}
                 className="col-span-2 md:col-span-8 group cursor-pointer relative aspect-[14/10] overflow-hidden rounded-2xl md:rounded-[4rem] shadow-premium hover:shadow-deep transition-all duration-1000 border border-ojo-charcoal/5"
               >
                  <img 
                    src={JSON.parse(products[0].images)[0]} 
                    className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-105" 
                    alt={products[0].name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal via-ojo-charcoal/40 to-transparent" />
                  <div className="absolute bottom-4 md:bottom-12 left-4 md:left-12 right-4 md:right-12 space-y-2 md:space-y-6">
                     <div className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none text-[7px] md:text-[10px]">MASTERPIECE ARCHIVE</div>
                     <h3 className="text-xl md:text-7xl font-serif text-white italic leading-tight">{products[0].name}</h3>
                     <div className="flex justify-between items-end gap-4">
                        <div className="space-y-1 md:space-y-4">
                           <p className="text-[10px] md:text-xl text-white/50 italic font-light max-w-lg line-clamp-1 md:line-clamp-none">{products[0].short_description}</p>
                           <div className="flex gap-1 md:gap-3">
                              <span className="ojo-badge !border-white/20 !text-white text-[7px] md:text-[9px]">Verified {products[0].origin}</span>
                           </div>
                        </div>
                        <div className="text-lg md:text-4xl font-mono text-ojo-mustard italic font-black">₹{products[0].price.toLocaleString()}</div>
                     </div>
                  </div>
               </motion.div>
             )}

             {/* Smaller Cards - 2 column grid on mobile */}
             {products.slice(1, 7).map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setQuickViewProduct(p)}
                  className="col-span-1 md:col-span-4 space-y-3 md:space-y-8 group cursor-pointer"
                >
                   <div className="aspect-square relative overflow-hidden rounded-xl md:rounded-[3rem] shadow-sm md:shadow-premium group-hover:shadow-deep transition-all duration-700 border border-ojo-charcoal/5">
                      <img 
                        src={JSON.parse(p.images)[0]} 
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                        alt={p.name}
                      />
                      <div className="absolute top-2 md:top-4 left-2 md:left-4 flex flex-col gap-1 md:gap-2 scale-75 origin-top-left md:scale-100">
                         <div className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none text-[6px] md:text-[8px] font-black tracking-widest shadow-lg uppercase">{p.decisionTag || 'PREMIUM'}</div>
                      </div>
                   </div>
                   <div className="space-y-1 md:space-y-3 px-1 md:px-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-1">
                         <h4 className="text-sm md:text-3xl font-serif italic text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-tight truncate w-full">{p.name}</h4>
                         <span className="text-xs md:text-xl font-mono text-ojo-mustard font-bold">₹{p.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                         <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/30 truncate">{p.origin}</span>
                         <ShieldCheck size={8} className="text-ojo-mustard md:w-[10px] md:h-[10px]" />
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>

          <div className="text-center pt-20">
             <button onClick={() => navigate("/category")} className="ojo-btn-outline !px-24 !py-10 group border-ojo-charcoal/20 hover:border-ojo-mustard">
                Access Complete Registry <ArrowRight size={18} className="ml-4 transition-transform group-hover:translate-x-4" />
             </button>
          </div>
        </div>
      </section>

      {/* 5. TRUST: MOBILE-FIRST STACK */}
      <section className="py-24 md:py-60 bg-ojo-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ojo-cream to-transparent opacity-10" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <MotifSystem type="jaali" scale={3} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 text-center space-y-20 md:space-y-32">
            <div className="space-y-8 md:space-y-12">
               <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-ojo-mustard">Identity & Trust Registry</span>
               <h2 className="text-5xl md:text-[120px] font-serif italic text-white leading-none tracking-tighter">
                  Verified from <br className="hidden md:block" />
                  <span className="text-ojo-mustard">Origin.</span>
               </h2>
               <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/70 font-light italic leading-snug">
                 Every product is sourced directly from its place of origin.
               </p>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-16">
               {[
                 { title: "GI Tagged", detail: "Government certified geographical indications." },
                 { title: "Verified Source", detail: "Direct cluster audits ensure master-level command." },
                 { title: "Quality Check", detail: "Rigorous three-tier audit for every artifact." }
               ].map((item, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center space-y-4 md:space-y-8 text-center p-8 md:p-12 bg-white/5 border border-white/10 rounded-3xl"
                 >
                    <ShieldCheck size={32} className="text-ojo-mustard mb-2" />
                    <h4 className="text-2xl md:text-4xl font-serif italic text-ojo-mustard leading-tight">{item.title}</h4>
                    <p className="text-base md:text-lg text-white/50 font-light italic">{item.detail}</p>
                 </motion.div>
               ))}
            </div>

            <div className="pt-10">
               <p className="text-ojo-mustard/40 font-black uppercase tracking-[0.4em] text-[10px]">Trusted by thousands of collectors worldwide</p>
            </div>
        </div>
      </section>

      {/* 6. RECOMMENDATIONS: INTELLIGENT CURATION */}
      <section className="py-60 md:py-80 bg-ojo-cream overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
           <MotifSystem type="jaali" scale={2} />
        </div>
        <div className="max-w-[1800px] mx-auto space-y-32 relative z-10">
          <div className="px-6 md:px-20 flex justify-between items-end border-b border-ojo-charcoal/10 pb-16">
             <div className="space-y-4">
                <span className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none text-[9px]">Sovereign Picks</span>
                <h3 className="text-5xl md:text-7xl font-serif italic text-ojo-charcoal tracking-tighter leading-none">You may also like</h3>
             </div>
             <button onClick={() => navigate("/category")} className="text-[11px] font-black uppercase tracking-[0.5em] text-ojo-charcoal/40 hover:text-ojo-mustard transition-colors hidden md:block">See Complete Context</button>
          </div>
          
          <div className="relative">
            <div className="flex gap-8 md:gap-20 overflow-x-auto px-6 md:px-20 pb-16 md:pb-20 scrollbar-hide snap-x snap-mandatory">
               {recommendedProducts.map((p, i) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.8 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -20 }}
                    onClick={() => setQuickViewProduct(p)}
                    className="min-w-[280px] md:min-w-[500px] space-y-6 md:space-y-10 group cursor-pointer snap-start"
                  >
                     <div className="aspect-[3/4] relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-premium group-hover:shadow-deep transition-all duration-1000 bg-white">
                        <img 
                          src={p.image} 
                          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[2s] scale-[1.05] group-hover:scale-100" 
                          alt={p.name}
                        />
                        <div className="absolute inset-0 bg-ojo-charcoal/5 group-hover:bg-transparent transition-colors duration-1000" />
                        
                        {/* Premium Status Tags */}
                        <div className="absolute top-6 md:top-10 left-6 md:left-10 flex flex-col gap-2 md:gap-3">
                           <div className="ojo-badge !bg-white/95 !text-ojo-charcoal !border-none text-[7px] md:text-[8px] font-bold tracking-[0.1em] md:tracking-[0.2em] shadow-xl backdrop-blur-sm flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2">
                              <ShieldCheck size={10} className="text-ojo-mustard" /> GI CERTIFIED
                           </div>
                        </div>
                     </div>
                     <div className="px-4 md:px-6 space-y-2 md:space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-1 md:gap-4">
                           <h4 className="text-2xl md:text-4xl font-serif italic text-ojo-charcoal group-hover:text-ojo-mustard transition-colors duration-500 leading-tight">{p.name}</h4>
                           <span className="text-xl md:text-2xl font-mono text-ojo-mustard font-black">₹{p.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-ojo-charcoal/40">
                           <div className="h-px w-6 md:w-8 bg-ojo-mustard/30" />
                           <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] italic truncate">{p.origin}</span>
                        </div>
                     </div>
                  </motion.div>
               ))}
               <div className="min-w-[40px] md:min-w-[100px] h-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER: MOBILE-OPTIMIZED */}
      <footer className="py-24 md:py-48 bg-ojo-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
           <MotifSystem type="kalamkari" scale={2} />
        </div>
        <div className="max-w-[1800px] mx-auto px-8 flex flex-col md:grid md:grid-cols-4 gap-16 md:gap-24 relative z-10">
           <div className="md:col-span-2 space-y-8 md:space-y-12">
              <OjoLogo size="md" className="scale-75 origin-left md:scale-100" />
              <p className="text-2xl md:text-3xl text-white/40 font-light italic max-w-md leading-tight">
                 Establishing the definitive <br className="hidden md:block" />
                 Indian cultural exchange.
              </p>
           </div>
           
           <div className="space-y-8 md:space-y-12">
              <h4 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-ojo-mustard">Registry Nodes</h4>
              <ul className="space-y-4 md:space-y-6">
                 {["Artisan Directory", "Origin Logs", "GI Certificates", "Trust Protocol"].map(item => (
                   <li key={item}><button className="text-2xl md:text-3xl font-serif italic text-white/50 hover:text-white transition-colors">{item}</button></li>
                 ))}
              </ul>
           </div>

           <div className="space-y-8 md:space-y-12 md:text-right">
              <h4 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-ojo-mustard">OJO Headquarters</h4>
              <p className="text-lg md:text-xl text-white/40 font-mono italic leading-relaxed">
                 Vault 001, Heritage District <br />
                 IND / 110001
              </p>
              <div className="flex md:justify-end gap-6 md:gap-8 pt-4 md:pt-8">
                 <Globe className="text-ojo-mustard opacity-50" size={20} />
                 <Lock className="text-ojo-mustard opacity-50" size={20} />
                 <ShieldCheck className="text-ojo-mustard opacity-50" size={20} />
              </div>
           </div>
        </div>

        <div className="max-w-[1800px] mx-auto px-8 mt-24 md:mt-48 pt-12 md:pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[0.8em] text-white/20 text-center md:text-left">© 2026 OJO SOVEREIGN TRUST. Records Audited.</p>
           <div className="flex gap-8 md:gap-12">
              {["Vault Terms", "Provenance"].map(item => (
                <button key={item} className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-white transition-colors">{item}</button>
              ))}
           </div>
        </div>
      </footer>

      {/* BOTTOM NAVIGATION (MOBILE) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[90] bg-ojo-charcoal rounded-3xl p-4 shadow-deep border border-white/10 flex justify-between items-center px-8">
         <button onClick={() => navigate("/")} className="text-ojo-mustard flex flex-col items-center gap-1">
            <Home size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
         </button>
         <button onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 flex flex-col items-center gap-1">
            <MapIcon size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Explore</span>
         </button>
         <button onClick={() => navigate("/cart")} className="text-white/40 flex flex-col items-center gap-1">
            <ShoppingBag size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Vault</span>
         </button>
         <button onClick={() => navigate("/admin")} className="text-white/40 flex flex-col items-center gap-1">
            <User size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Node</span>
         </button>
      </nav>

      {/* MOBILE BOTTOM SHEET FOR STATE EXPLORATION */}
      <BottomSheet 
        isOpen={!!selectedState && window.innerWidth < 768} 
        onClose={() => setSelectedState(null)} 
        title={selectedState?.name}
      >
        <div className="space-y-10 pb-10">
          <div className="space-y-4">
            <p className="text-xl text-ojo-charcoal/80 italic font-light leading-relaxed">
               Heritage cluster records for {selectedState?.name}. Authenticity guaranteed under Sovereign Protocol.
            </p>
            <div className="flex gap-3">
               <div className="ojo-badge ojo-badge-verified text-[8px] !px-4 !py-2">
                  <ShieldCheck size={10} className="mr-1" /> GI TAGGED
               </div>
               <div className="ojo-badge !bg-ojo-cream !text-ojo-mustard !border-ojo-mustard/20 text-[8px] !px-4 !py-2">
                  <ShieldCheck size={10} className="mr-1" /> VERIFIED SOURCES
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-baseline">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-mustard">SIGNATURE ARTIFACTS</h4>
                <button 
                  onClick={() => navigate(`/category?state=${selectedState?.id}`)}
                  className="text-[9px] font-bold text-ojo-charcoal/40 uppercase tracking-widest"
                >
                  View All
                </button>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {PRODUCT_DATASET.filter(p => p.origin === selectedState?.id).slice(0, 4).map(p => (
                   <div 
                    key={p.id} 
                    onClick={() => {
                       setSelectedState(null);
                       setQuickViewProduct({...p, images: JSON.stringify([p.image])});
                    }}
                    className="space-y-4 group"
                   >
                      <div className="aspect-[4/5] bg-ojo-cream rounded-2xl overflow-hidden shadow-sm border border-ojo-stone/5">
                         <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-tight truncate text-ojo-charcoal">{p.name}</p>
                        <p className="text-xs font-mono text-ojo-mustard">₹{p.price.toLocaleString()}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <button 
             onClick={() => {
                setSelectedState(null);
                navigate(`/category?state=${selectedState?.id}`);
             }}
             className="w-full py-6 bg-ojo-charcoal text-ojo-mustard font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl active:scale-95 transition-all"
          >
             EXPLORE FULL REGISTRY
          </button>
        </div>
      </BottomSheet>

      <StateDrawer 
        state={selectedState} 
        isOpen={!!selectedState && window.innerWidth >= 768} 
        onClose={() => setSelectedState(null)} 
        products={PRODUCT_DATASET.filter(p => p.origin === selectedState?.id).map(p => ({
          ...p,
          images: JSON.stringify([p.image])
        }))}
      />

      <QuickViewModal 
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onProductUpdate={(p) => setQuickViewProduct(p)}
        onAddToCart={(p) => {
          addItem(p);
          toast.success("Record Secured", {
            description: `${p.name} has been added to your vault repository.`
          });
        }}
      />
    </div>
  );
}

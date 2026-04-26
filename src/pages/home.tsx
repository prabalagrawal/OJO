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
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { MotifSystem, PatternDivider } from "../components/motifs.tsx";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import { OjoLogo } from "../components/brand.tsx";
import { IndiaExplorer, StateDrawer } from "../components/india-map.tsx";
import { QuickViewModal } from "../components/quick-view-modal.tsx";
import { toast } from "sonner";

type MotifType = "bagru" | "ajrakh" | "warli" | "gond" | "kolam" | "kalamkari" | "patola" | "jaali" | "sozni" | "paisley";

interface Product {
  id: string;
  name: string;
  price: number;
  origin: string;
  category: string;
  description: string;
  images: string;
  artisanName: string;
  decisionTag?: string;
  story?: string;
  verificationLogs?: any[];
}

const DECISION_TAGS = ["Most Trusted", "Best for Gifting", "Premium Pick", "Masterpiece"];

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

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
        const path = "products";
        const q = query(collection(db, path), limit(12));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc, i) => ({ 
          id: doc.id, 
          ...doc.data(),
          decisionTag: DECISION_TAGS[i % DECISION_TAGS.length],
          story: "Each piece is hand-crafted using heritage methods passed down through generations."
        })) as Product[];
        setProducts(items);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-ojo-mustard selection:text-white overflow-x-hidden">
      {/* 1. HERO: BOLD STATEMENT */}
      <section ref={heroRef} className="relative min-h-screen flex items-center px-6 md:px-12 bg-ojo-cream overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full opacity-10 pointer-events-none">
           <MotifSystem type="kolam" scale={1.5} opacity={1} />
        </div>
        
        <div className="max-w-[1700px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-20"
          >
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-6"
              >
                <div className="ojo-label ojo-label-verified border-none shadow-ojo-mustard/20 bg-ojo-mustard text-white px-8">OJO SOVEREIGN TRUST</div>
                <div className="h-px w-24 bg-ojo-mustard/40" />
                <span className="text-[12px] font-black uppercase tracking-[0.8em] text-ojo-mustard animate-pulse italic">Origin Authenticated</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-serif text-ojo-charcoal leading-[1.1] tracking-tighter">
                India’s Authentic <br />
                <span className="text-ojo-mustard italic block md:ml-12">Products. Verified.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-ojo-charcoal/70 max-w-2xl font-sans leading-relaxed font-light italic">
                Direct access to India’s master artisans. <br className="hidden md:block" />
                Authored by geography. Verified by OJO.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-12 items-center">
              <button onClick={() => navigate("/category")} className="ojo-btn-primary group !px-24 !py-10 !text-[14px] shadow-4xl shadow-ojo-mustard/30 scale-110">
                 Access Registry Archive <ArrowRight size={20} className="inline ml-4 transition-transform group-hover:translate-x-4" />
              </button>
              <div 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-start gap-2 cursor-pointer group ml-8"
              >
                 <span className="text-[10px] font-black uppercase tracking-[0.6em] text-ojo-mustard/60 group-hover:text-ojo-mustard transition-colors">Explore India by Origin ↓</span>
                 <div className="w-40 h-px bg-ojo-mustard/20 group-hover:w-60 transition-all duration-700" />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-10 pt-4">
              <div className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-xl rounded-full border border-ojo-mustard/20 shadow-sm">
                <ShieldCheck size={14} className="text-ojo-mustard" />
                <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">Verified by OJO</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-xl rounded-full border border-ojo-mustard/20 shadow-sm">
                <Award size={14} className="text-ojo-mustard" />
                <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">Authentic Source</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-xl rounded-full border border-ojo-mustard/20 shadow-sm">
                <Lock size={14} className="text-ojo-mustard" />
                <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/60">Secure Checkout</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="hidden lg:block relative aspect-[4/5] perspective-1000"
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl border border-ojo-stone/20 overflow-hidden shadow-premium group"
              style={{ borderRadius: '8rem 1rem 1rem 1rem' }}>
              <img 
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" 
                alt="Heritage Origin" 
                className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/90 via-ojo-charcoal/20 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12 p-12 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/20 text-white shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ojo-mustard mb-4 block">Archive Record 001</span>
                <h3 className="text-3xl font-serif mb-2 italic">The High-Mountain Reserve.</h3>
                <p className="text-[14px] opacity-70 font-light italic">"Harvested within 48 hours of seasonal peak."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="ojo-warli-divider" />

      {/* 2. PRODUCT GRID: EARLY ACCESS */}
      <section id="products" className="py-40 px-8 md:px-20 bg-ojo-cream relative overflow-hidden">
        <MotifSystem type="ajrakh" opacity={0.03} scale={0.8} />
        <div className="max-w-[1800px] mx-auto space-y-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-10 max-w-4xl mx-auto"
          >
            <div className="ojo-badge ojo-badge-verified mx-auto">Active Sovereign Registry</div>
            <h2 className="text-5xl md:text-7xl font-serif text-ojo-charcoal tracking-tighter">
               The Provenance <br /> 
               <span className="italic text-ojo-terracotta">Archive.</span>
            </h2>
            <p className="text-[17px] text-ojo-charcoal/50 leading-relaxed font-sans italic font-light">
              Audited by regional masters. Every record reflects a 5-step GI-certified provenance protocol.
            </p>
          </motion.div>

          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-[4/5] bg-ojo-stone/20 rounded-[3rem]" />
                  <div className="h-6 bg-ojo-stone/20 w-3/4 mx-auto rounded-full" />
                </div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
              {products.slice(0, 12).map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 4) * 0.1, duration: 1 }}
                  className="group flex flex-col ojo-card-product overflow-hidden cursor-pointer"
                  onClick={() => setQuickViewProduct(p)}
                >
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-ojo-cream mb-8">
                    <div className="absolute inset-0 bg-ojo-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img 
                      src={Array.isArray(p.images) ? p.images[0] : JSON.parse(p.images || "[]")[0] || ""} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-all duration-[1s] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Tags Corner */}
                    <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
                       <div className="ojo-badge ojo-badge-verified !bg-white/90 backdrop-blur-md shadow-sm">
                          <ShieldCheck size={12} className="inline mr-2 text-ojo-mustard" /> Verified Record
                       </div>
                       <div className="ojo-label bg-ojo-charcoal/80 backdrop-blur-md text-white text-[8px] tracking-[0.2em] transform -rotate-1">
                          {idx % 3 === 0 ? "PREMIUM PICK" : idx % 3 === 1 ? "MOST TRUSTED" : "BEST FOR GIFTING"}
                       </div>
                    </div>

                    <div className="absolute bottom-8 right-8 z-20">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/80 bg-ojo-charcoal/20 px-4 py-2 rounded-full backdrop-blur-sm">{p.origin}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 px-4 relative z-10">
                     <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-2xl font-serif text-ojo-charcoal italic">{p.name}</h3>
                          <div className="text-lg font-mono text-ojo-mustard font-bold italic">₹{p.price?.toLocaleString()}</div>
                        </div>
                        <p className="text-xs text-ojo-charcoal/40 italic line-clamp-1">"{p.story}"</p>
                     </div>
                     
                     <div className="flex items-center gap-4 pt-4 border-t border-ojo-mustard/10">
                        <div className="flex -space-x-1">
                           {[1,2,3].map(i => (
                             <div key={i} className="w-5 h-5 rounded-full border border-white bg-ojo-mustard/20" />
                           ))}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/30 italic">Audit Log: {p.verificationLogs?.length || 2} Cleared</span>
                     </div>
                  </div>
                </motion.div>
               ))}
             </div>
           )}
          
          <div className="text-center pt-20">
            <button 
              onClick={() => navigate("/category")}
              className="ojo-btn-outline !px-24 !py-8 !text-[12px] group"
            >
              Access Complete Repository <ArrowRight size={18} className="transition-transform group-hover:translate-x-4 ml-4" />
            </button>
          </div>
        </div>
      </section>

      <PatternDivider type="warli" />

      {/* 3. OJO INDIA EXPLORER: SIGNATURE FEATURE */}
      <section className="py-40 px-8 md:px-20 bg-ojo-cream relative overflow-hidden">
         <div className="absolute inset-x-0 top-0 h-full opacity-[0.06] pointer-events-none">
            <MotifSystem type="jaali" scale={1.5} opacity={1} />
         </div>
         <div className="max-w-[1800px] mx-auto space-y-32 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-end gap-16 border-b border-ojo-mustard/10 pb-20">
             <div className="space-y-8">
               <div className="ojo-badge ojo-badge-verified">Geographic Trust Mapping</div>
               <h2 className="text-5xl md:text-7xl font-serif text-ojo-charcoal tracking-tighter leading-tight">
                 The Geography <br />
                 <span className="text-ojo-mustard italic block md:ml-12">of Ancestry.</span>
               </h2>
             </div>
             <div className="max-w-md text-right space-y-6">
               <p className="text-[17px] text-ojo-charcoal/50 font-light italic leading-relaxed">
                 Connect directly with the community. Every state highlighted holds a sovereign trust certificate.
               </p>
               <div className="flex items-center justify-end gap-4 text-ojo-mustard group cursor-pointer font-black text-[12px] uppercase tracking-[0.5em] hover:text-ojo-charcoal transition-colors">
                  <span>View Cluster GIS Data</span>
                  <ArrowRight size={18} />
               </div>
             </div>
           </div>

           <IndiaExplorer onStateClick={(state) => setSelectedState(state)} />
         </div>
       </section>

       <div className="ojo-warli-divider" />

       {/* 4. EXPLORE BY STATE: CARDS SECTION */}
       <section className="py-40 px-8 md:px-20 bg-white relative overflow-hidden">
         <div className="max-w-[1800px] mx-auto space-y-32 relative z-10">
            <div className="max-w-4xl space-y-8">
               <div className="ojo-badge ojo-badge-verified">Heritage Clusters</div>
               <h2 className="text-5xl md:text-7xl font-serif italic text-ojo-charcoal leading-none tracking-tighter">Explore by Origin.</h2>
               <p className="text-[17px] text-ojo-charcoal/50 font-light italic leading-relaxed">
                 From the desert command of Rajasthan to the high-mountain looms of Kashmir—every region tells a story of survival and craft.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
               {[
                 { name: "Rajasthan", tag: "Block Prints", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" },
                 { name: "Tamil Nadu", tag: "Sacred Silks", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2610&auto=format&fit=crop" },
                 { name: "Kashmir", tag: "Pashmina", img: "https://images.unsplash.com/photo-1594191543882-626dfca15494?q=80&w=2574&auto=format&fit=crop" }
               ].map((state, i) => (
                 <motion.div
                   key={state.name}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.2, duration: 1 }}
                   onClick={() => navigate(`/category?origin=${state.name}`)}
                   className="group cursor-pointer relative h-[650px] overflow-hidden shadow-premium hover:shadow-deep transition-all duration-1000"
                   style={{ borderRadius: '6rem 1rem 1rem 1rem' }}
                 >
                    <img src={state.img} className="absolute inset-0 w-full h-full object-cover transition-all duration-[2.5s] group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/90 via-transparent to-transparent" />
                    <div className="absolute bottom-16 left-16 right-16 space-y-6">
                       <span className="ojo-badge !bg-white/20 !text-white !border-white/20">{state.tag}</span>
                       <h3 className="text-4xl font-serif italic text-white tracking-tight leading-none">{state.name}</h3>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
       </section>

       <div className="ojo-warli-divider" />

       {/* 5. TRUST SYSTEM: FUNNEL STYLE */}
       <section className="py-48 bg-ojo-charcoal text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
            <MotifSystem type="kalamkari" scale={1.8} />
         </div>
         
         <div className="max-w-[1700px] mx-auto space-y-40 relative z-10 px-8">
            <div className="grid lg:grid-cols-2 gap-24 items-end">
               <div className="space-y-12">
                  <div className="ojo-badge !bg-white/10 !text-white !border-white/20 px-12">The OJO Standard</div>
                  <h2 className="text-7xl md:text-9xl font-serif italic text-ojo-mustard leading-[0.85] tracking-tighter">
                    Trust is not <br />
                    <span className="text-white">Marketing.</span>
                  </h2>
               </div>
               <div className="max-w-xl space-y-8">
                  <p className="text-2xl text-white/40 leading-snug font-light italic">
                    It is a mandatory physical protocol. We solve the authenticity gap by connecting the source directly to the system.
                  </p>
                  <button className="ojo-btn-primary !bg-ojo-mustard !text-ojo-charcoal !px-12 !py-6 !text-[11px]">Audit Protocol Report</button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { icon: <Globe size={28} />, step: "01", title: "Sourced", desc: "Digital verification at artisanal cluster level.", pattern: "ajrakh" },
                 { icon: <Lock size={28} />, step: "02", title: "Checked", desc: "3-layer physical inspection for certificates.", pattern: "bagru" },
                 { icon: <ShieldCheck size={28} />, step: "03", title: "Verified", desc: "Permanent QR origin ID assigned to records.", pattern: "sozni" },
                 { icon: <Truck size={28} />, step: "04", title: "Listed", desc: "Secure distribution through our nodes.", pattern: "jaali" }
               ].map((step, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.15 }}
                   className="group relative p-12 bg-white/5 border border-white/10 rounded-[4rem] space-y-10 hover:bg-white/10 transition-all duration-1000 overflow-hidden cursor-default"
                 >
                    <div className="flex justify-between items-start">
                       <div className="w-12 h-12 rounded-[1rem] bg-ojo-mustard flex items-center justify-center text-ojo-charcoal">
                          {React.cloneElement(step.icon as any, { size: 20 })}
                       </div>
                       <span className="text-xl font-mono text-white/20 font-black">{step.step}</span>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-2xl font-serif italic tracking-tight leading-none">{step.title}</h4>
                       <p className="text-white/40 leading-relaxed font-light italic text-[15px]">{step.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
       </section>

       <div className="ojo-warli-divider" />

       {/* 6. STORY SECTION: THE DOSSIER */}
       <section className="py-48 bg-white relative overflow-hidden">
         <div className="max-w-[1800px] mx-auto grid lg:grid-cols-2 gap-40 items-center relative z-10 px-8">
            <div className="relative">
               <div className="aspect-[4/5] rounded-[5rem] overflow-hidden group shadow-premium" style={{ borderRadius: '8rem 1rem 1rem 1rem' }}>
                  <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover transition-all duration-[4s] group-hover:scale-105" alt="Arisan at Work" />
               </div>
               <div className="absolute -bottom-12 -right-8 md:-right-12 p-12 bg-white shadow-deep rounded-[3rem] border border-ojo-stone/20 max-w-lg space-y-6">
                  <p className="text-3xl font-serif italic leading-tight text-ojo-charcoal">"Heritage is not just preserved in museums; it is lived on the loom every day."</p>
                  <div className="flex items-center gap-4 border-t border-ojo-stone/10 pt-6">
                     <div className="w-10 h-10 rounded-full bg-ojo-charcoal overflow-hidden group-hover:grayscale-0 grayscale transition-all">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop" alt="" />
                     </div>
                     <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-ojo-charcoal">Anjali Mishra</p>
                        <p className="text-[10px] uppercase tracking-widest text-ojo-mustard">Master Weaver</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-16 pt-20 md:pt-0">
               <div className="space-y-10">
                  <div className="ojo-badge ojo-badge-verified">The Human Connection</div>
                  <h2 className="text-7xl md:text-9xl font-serif text-ojo-charcoal leading-[0.8] tracking-tighter">
                    Stories <br />
                    <span className="italic text-ojo-terracotta ml-0 md:ml-40">Unfolded.</span>
                  </h2>
                  <p className="text-2xl text-ojo-charcoal/60 leading-snug font-light italic max-w-2xl">
                    Each artifact carries the signature of an artisan who has practiced their craft for decades.
                  </p>
               </div>
               <button 
                 onClick={() => navigate("/category")}
                 className="ojo-btn-primary !px-16 !py-6"
               >
                  Meet Master Artisans <ChevronRight size={18} />
               </button>
            </div>
         </div>
       </section>
      {/* FINAL CTA: THE VAULT GATE */}
      <section className="py-64 bg-ojo-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
           <MotifSystem type="jaali" scale={2} opacity={1} />
        </div>
        <div className="max-w-7xl mx-auto text-center space-y-16 relative z-10 px-8">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.2 }}
             className="space-y-12"
           >
              <div className="ojo-badge mx-auto !bg-white/10 !text-white !border-white/20 px-12">OJO Registry Access</div>
              <h2 className="text-8xl md:text-[14rem] font-serif italic text-ojo-mustard leading-none tracking-tighter">
                Secure Your <br />
                <span className="text-white">Heritage.</span>
              </h2>
           </motion.div>
           
           <div className="flex flex-wrap justify-center gap-12 pt-12">
              <button onClick={() => navigate("/category")} className="ojo-btn-primary !px-20 !py-8">
                 Request Access To Vault
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="ojo-btn-outline !bg-white/5 !text-white !border-white/10 hover:!border-white !px-20 !py-8"
              >
                Establish Membership
              </button>
           </div>
        </div>
      </section>

      {/* FOOTER REINFORCEMENT */}
      <footer className="py-32 bg-ojo-cream border-t border-ojo-stone/10 overflow-hidden relative">
         <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none">
            <MotifSystem type="kalamkari" scale={1.2} />
         </div>
         <div className="max-w-[1800px] mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-24 relative z-10">
            <div className="col-span-2 space-y-12">
               <OjoLogo size="md" />
               <p className="text-2xl text-ojo-charcoal/50 font-light italic max-w-sm">
                  The trust-first marketplace for authenticated Indian heritage.
               </p>
            </div>
            <div className="space-y-8">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-mustard">The Ecosystem</h4>
               <ul className="space-y-4">
                  {["Artisan Registry", "Geographic Nodes", "Audit Protocol", "GI-Certificates"].map(link => (
                    <li key={link}><button className="text-2xl font-serif italic text-ojo-charcoal/60 hover:text-ojo-mustard transition-colors">{link}</button></li>
                  ))}
               </ul>
            </div>
            <div className="space-y-8">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Connectivity</h4>
               <ul className="space-y-4">
                  {["Member Login", "Vault Access", "Field Support", "Cluster Mapping"].map(link => (
                    <li key={link}><button className="text-2xl font-serif italic text-ojo-charcoal/60 hover:text-ojo-mustard transition-colors">{link}</button></li>
                  ))}
               </ul>
            </div>
         </div>
         <div className="max-w-[1800px] mx-auto px-10 pt-16 mt-24 border-t border-ojo-stone/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-ojo-charcoal/30">© 2026 OJO SOVEREIGN VAULT. All Rights Audited.</p>
            <div className="flex items-center gap-10 opacity-30 text-ojo-charcoal">
               <RefreshCw size={20} />
               <Truck size={20} />
               <ShieldCheck size={20} />
            </div>
         </div>
      </footer>

      <StateDrawer 
        state={selectedState} 
        isOpen={!!selectedState} 
        onClose={() => setSelectedState(null)} 
        products={products.filter(p => p.origin === selectedState?.id)}
      />

      <QuickViewModal 
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p) => {
          addItem(p);
          toast.success("Artifact Secured", {
            description: `${p.name} has been added to your local vault registry.`
          });
        }}
      />
    </div>
  );
}

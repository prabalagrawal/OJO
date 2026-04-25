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
  ChevronDown,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { MotifSystem, PatternDivider } from "../components/motifs.tsx";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
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
}

const CATEGORIES = [
  { id: "Saree", label: "Heritage Textiles", pattern: "patola" as MotifType, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2070&auto=format&fit=crop" },
  { id: "Tea", label: "Mountain Harvests", pattern: "sozni" as MotifType, img: "https://images.unsplash.com/photo-1594191543882-626dfca15494?q=80&w=2574&auto=format&fit=crop" },
  { id: "Spices", label: "Organic Reserves", pattern: "ajrakh" as MotifType, img: "https://images.unsplash.com/photo-1596797038580-2f44a57f7d41?q=80&w=2070&auto=format&fit=crop" },
  { id: "Artifact", label: "Sacred Stones", pattern: "jaali" as MotifType, img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2610&auto=format&fit=crop" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
        const q = query(collection(db, path), limit(8));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
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
      {/* 1. HERO: STATEMENT PIECE */}
      <section ref={heroRef} className="relative min-h-screen flex items-center px-6 md:px-12 bg-white overflow-hidden">
        <MotifSystem type="sozni" opacity={0.06} scale={0.75} className="animate-motif-fade" />
        
        <div className="max-w-[1700px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16"
          >
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6"
              >
                <div className="ojo-label ojo-label-verified border-none shadow-ojo-mustard/20 bg-ojo-mustard/10 text-ojo-mustard">OJO SOVEREIGN VAULT</div>
                <div className="h-px w-24 bg-ojo-mustard/40" />
                <span className="text-[11px] font-black uppercase tracking-[0.6em] text-ojo-mustard animate-pulse">Origin Authenticated</span>
              </motion.div>
              <h1 className="text-[10rem] md:text-[14rem] font-serif text-ojo-charcoal leading-[0.75] tracking-tighter">
                India’s <br />
                <span className="text-ojo-mustard italic pl-0 md:pl-40 block">Heritage.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-ojo-charcoal/60 max-w-2xl font-sans leading-relaxed font-light italic">
                Direct access to master artisans. Every artifact is 
                mapped to its geographic cluster via our zero-trust identity vault.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-10">
              <button onClick={() => navigate("/category")} className="ojo-btn-primary group !px-20 !py-10 !text-[12px] shadow-4xl shadow-ojo-mustard/20">
                 Open The Archive <ArrowRight size={16} className="inline ml-3 transition-transform group-hover:translate-x-3" />
              </button>
              <button 
                onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })}
                className="ojo-btn-outline !px-20 !py-10 !border-ojo-mustard/10 hover:!border-ojo-mustard !text-[12px] tracking-[0.4em]"
              >
                Geographic Map
              </button>
            </div>

            <div className="flex items-center gap-20 pt-16 border-t border-ojo-stone/10">
               {[
                 { val: "1,200+", label: "Verified Masters" },
                 { val: "28", label: "State Clusters" },
                 { val: "Zero", label: "Trust Friction" }
               ].map((stat, i) => (
                 <div key={i} className="space-y-2">
                    <p className="text-4xl font-serif italic text-ojo-charcoal leading-none tracking-tight">{stat.val}</p>
                    <p className="text-[9px] uppercase font-black tracking-[0.4em] text-ojo-mustard/60">{stat.label}</p>
                 </div>
               ))}
            </div>
          </motion.div>

          <motion.div 
            style={{ y, opacity }}
            className="hidden lg:block relative h-[100vh] perspective-1000 py-20"
          >
            <div className="absolute inset-0 rounded-[6rem] rotate-6 translate-x-20 translate-y-20 bg-ojo-cream border border-ojo-mustard/20 shadow-inner" />
            <div className="absolute inset-x-0 inset-y-20 rounded-[6rem] overflow-hidden shadow-4xl group border-[1.5rem] border-white">
              <img 
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" 
                alt="Heritage Origin" 
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/80 via-transparent to-ojo-charcoal/30 transition-opacity duration-1000 group-hover:opacity-40" />
              <div className="absolute top-20 right-20 opacity-20">
                 <MotifSystem type="sozni" scale={2} opacity={1} />
              </div>
              <div className="absolute bottom-20 left-20 p-16 bg-white/10 backdrop-blur-3xl rounded-[4rem] border border-white/20 text-white max-w-xl shadow-2xl">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                  <span className="w-3 h-3 rounded-full bg-ojo-mustard animate-pulse shadow-ojo-mustard shadow-lg" /> Current Origin Dossier
                </p>
                <h3 className="text-6xl font-serif mb-4 italic tracking-tighter">Darjeeling 1845</h3>
                <p className="text-xl opacity-80 leading-relaxed font-sans font-light italic">
                  "Harvested precisely 48 hours before the full moon cycles to lock in mountain minerals."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PatternDivider type="bagru" />

      {/* 2. OJO INDIA EXPLORER: CORE FEATURE */}
      <section id="explorer" className="py-48 px-6 md:px-12 bg-ojo-cream relative overflow-hidden">
        <MotifSystem type="jaali" opacity={0.04} scale={1.2} />
        <div className="max-w-[1800px] mx-auto space-y-32 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 border-b border-ojo-mustard/10 pb-20">
            <div className="space-y-10">
              <span className="ojo-label-verified ojo-label !px-10 !py-4 shadow-ojo-mustard/10">Interactive Atas</span>
              <h2 className="text-9xl md:text-[11rem] font-serif text-ojo-charcoal leading-[0.7] tracking-tighter">
                The Geography <br />
                <span className="text-ojo-mustard italic ml-0 md:ml-48">of Trust.</span>
              </h2>
            </div>
          </div>

          <IndiaExplorer onStateClick={(state) => setSelectedState(state)} />
        </div>
      </section>

      <PatternDivider type="bagru" />

      {/* 3. EXPLORE BY STATE: CARDS SECTION */}
      <section className="py-48 px-6 md:px-12 bg-white relative overflow-hidden">
        <MotifSystem type="warli" opacity={0.03} scale={0.8} />
        <div className="max-w-[1700px] mx-auto space-y-32 relative z-10">
           <div className="max-w-3xl space-y-8">
              <span className="ojo-label-verified ojo-label">Registry Geographies</span>
              <h2 className="text-7xl font-serif italic text-ojo-charcoal leading-none tracking-tighter">State Clusters.</h2>
              <p className="text-2xl text-ojo-charcoal/50 font-light italic">
                From the sand-swept dunes of the Thar to the moonlit peaks of Darjeeling, discover the provenance of every craft.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { name: "Rajasthan", tag: "Block Prints", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" },
                { name: "Tamil Nadu", tag: "Heritage Silks", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2610&auto=format&fit=crop" },
                { name: "Kashmir", tag: "Pashmina", img: "https://images.unsplash.com/photo-1594191543882-626dfca15494?q=80&w=2574&auto=format&fit=crop" }
              ].map((state, i) => (
                <motion.div
                  key={state.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  onClick={() => navigate(`/category?origin=${state.name}`)}
                  className="group cursor-pointer relative h-[600px] rounded-[5rem] overflow-hidden border-8 border-white shadow-2xl hover:shadow-4xl transition-all duration-700"
                >
                   <img src={state.img} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal via-ojo-charcoal/20 to-transparent" />
                   <div className="absolute bottom-16 left-16 right-16 space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border border-white/20">{state.tag}</span>
                      </div>
                      <h3 className="text-5xl font-serif italic text-white tracking-tighter">{state.name}</h3>
                      <div className="h-px w-20 bg-ojo-mustard transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                   </div>
                   <div className="absolute top-12 right-12 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowRight size={24} />
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <PatternDivider type="warli" />

      {/* 4. PRODUCT GRID: SHOPIFY-GRADE */}
      <section className="py-48 px-6 md:px-12 bg-white relative overflow-hidden">
        <MotifSystem type="patola" opacity={0.03} scale={0.8} />
        <div className="max-w-[1700px] mx-auto space-y-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-12 max-w-5xl mx-auto"
          >
            <span className="ojo-label-verified ojo-label mx-auto !px-12">Registry Vault Active</span>
            <h2 className="text-8xl md:text-[10rem] font-serif text-ojo-charcoal leading-[0.75] tracking-tighter">
               The Provenance <br /> 
               <span className="italic text-ojo-terracotta">Registry.</span>
            </h2>
            <p className="text-3xl text-ojo-charcoal/60 leading-relaxed font-sans italic font-light">
              From hand-picked Darjeeling leaves to heritage Chanderi silk, 
              each object reflects a mandatory 5-step provenance audit.
            </p>
          </motion.div>

          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
               {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-[3/4] bg-ojo-stone/10 rounded-[3rem]" />
                  <div className="h-6 bg-ojo-stone/10 w-3/4 mx-auto rounded-full" />
                </div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
              {products.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 4) * 0.15, duration: 0.8 }}
                  className="group space-y-10"
                >
                  <div 
                    className="relative aspect-[3.5/5] rounded-[4rem] overflow-hidden transition-all duration-1000 hover:shadow-4xl border border-ojo-stone/10 group-hover:border-ojo-mustard/30 bg-ojo-cream cursor-pointer"
                    onClick={() => setQuickViewProduct(p)}
                  >
                    <img 
                      src={Array.isArray(p.images) ? p.images[0] : JSON.parse(p.images || "[]")[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop"} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-ojo-charcoal/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md">
                      <button className="ojo-btn-primary translate-y-10 group-hover:translate-y-0 transition-all duration-700 !px-12 !py-6 !text-[11px]">
                        Inspect Record
                      </button>
                    </div>
                    <div className="absolute top-10 left-10">
                      <span className="ojo-label-verified ojo-label bg-white/90 backdrop-blur-2xl text-ojo-charcoal border-white shadow-2xl">
                        <ShieldCheck size={12} className="inline mr-2 text-ojo-mustard" /> {p.origin}
                      </span>
                    </div>
                  </div>
                  <div className="text-center space-y-6">
                     <div className="flex flex-col items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-[0.5em] text-ojo-mustard/60">
                        {p.category}
                      </span>
                      <h3 className="text-4xl font-serif text-ojo-charcoal leading-tight group-hover:text-ojo-mustard transition-colors italic">{p.name}</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="text-4xl font-mono text-ojo-charcoal">₹{p.price?.toLocaleString()}</div>
                      <div className="flex justify-center gap-4">
                         <span className="text-[10px] text-ojo-charcoal/40 font-black uppercase tracking-widest bg-ojo-cream px-6 py-2.5 rounded-full border border-ojo-stone/20">
                           Artisan Verified
                         </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center pt-24">
            <button 
              onClick={() => navigate("/category")}
              className="ojo-btn-primary !px-24 !py-10 group !bg-white !text-ojo-charcoal border-2 border-ojo-mustard/20 hover:!bg-ojo-charcoal hover:!text-white !text-[11px] tracking-[0.5em] shadow-xl"
            >
              Examine Full Archive <ArrowRight size={14} className="inline ml-4 transition-transform group-hover:translate-x-4" />
            </button>
          </div>
        </div>
      </section>

      <PatternDivider type="gond" />

      {/* 4. TRUST SYSTEM: VISUAL & INTERACTIVE */}
      <section className="py-48 px-6 md:px-12 bg-ojo-charcoal text-white relative overflow-hidden">
        <MotifSystem type="jaali" opacity={0.06} scale={1.5} />
        <div className="max-w-[1700px] mx-auto grid lg:grid-cols-2 gap-32 relative z-10">
           <div className="space-y-16">
              <div className="space-y-8">
                 <span className="ojo-label ojo-label-verified !bg-white/10 !text-white !border-white/20 px-10">The OJO Protocol</span>
                 <h2 className="text-8xl md:text-[9rem] font-serif italic text-ojo-mustard leading-[0.8] tracking-tighter">
                   Provenance <br />
                   <span className="text-white">Hardened.</span>
                 </h2>
                 <p className="text-2xl text-white/50 leading-relaxed font-light italic max-w-xl">
                   We solve the authenticity gap through a mandatory physical audit system that connects artisans directly to your hands.
                 </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { icon: <Lock size={24} />, title: "Zero Trust ID", desc: "Digital certificates of origin attached to every shipment." },
                   { icon: <Globe size={24} />, title: "Cluster Mapping", desc: "Geographic locking of artisan clusters for GI integrity." },
                 ].map((box, i) => (
                   <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-6 hover:bg-white/10 transition-colors">
                      <div className="w-16 h-16 rounded-2xl bg-ojo-mustard flex items-center justify-center text-ojo-charcoal shadow-2xl shadow-ojo-mustard/20">
                         {box.icon}
                      </div>
                      <h4 className="text-3xl font-serif italic">{box.title}</h4>
                      <p className="text-white/40 leading-relaxed font-light italic text-sm">{box.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative">
              <div className="aspect-[4/5] rounded-[5rem] overflow-hidden border-8 border-white/5 shadow-inner group">
                 <img src="https://images.unsplash.com/photo-1599940859674-a7fef12b94a0?q=80&w=2600&auto=format&fit=crop" className="w-full h-full object-cover grayscale transition-all duration-[3s] group-hover:scale-105" alt="Audit" />
                 <div className="absolute inset-0 bg-ojo-mustard/30 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -bottom-16 -left-16 p-12 bg-white text-ojo-charcoal rounded-[4rem] border-8 border-ojo-charcoal shadow-4xl max-w-sm">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-ojo-mustard flex items-center justify-center text-ojo-charcoal">
                       <ShieldCheck size={24} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Audit Node 082</span>
                 </div>
                 <p className="text-3xl font-serif italic mb-4">"Verification is not a checkbox, it's a legacy."</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Cluster Lead: Rameshwaram</p>
              </div>
           </div>
        </div>
      </section>

      <PatternDivider type="ajrakh" />

      {/* 5. CATEGORY EXPERIENCE: IMMERSIVE */}
      <section className="py-48 bg-white relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
             <MotifSystem type={activeCategory.pattern} opacity={0.08} scale={1.2} />
          </motion.div>
        </AnimatePresence>

        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-32 items-center relative z-10 px-6">
           <div className="w-full lg:w-1/2 space-y-16">
              <div className="space-y-8">
                 <span className="ojo-label-verified ojo-label">Immersive Exploration</span>
                 <h2 className="text-8xl md:text-[10rem] font-serif italic text-ojo-charcoal leading-[0.8] tracking-tighter">
                   Curated <br />
                   <span className="text-ojo-mustard">Specialties.</span>
                 </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                 {CATEGORIES.map((c) => (
                   <button 
                     key={c.id} 
                     onMouseEnter={() => setActiveCategory(c)}
                     onClick={() => navigate(`/category?category=${c.id}`)}
                     className={`group p-10 flex items-center justify-between transition-all rounded-[3rem] border-2 ${activeCategory.id === c.id ? 'bg-ojo-charcoal border-ojo-charcoal text-white shadow-4xl scale-[1.02]' : 'bg-white border-ojo-stone/10 hover:border-ojo-mustard/30'}`}
                   >
                      <div className="flex items-center gap-10">
                         <div className={`w-20 h-20 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 ${activeCategory.id === c.id ? 'scale-110 shadow-ojo-mustard/20' : 'group-hover:scale-105'}`}>
                            <img src={c.img} className="w-full h-full object-cover grayscale" alt="" />
                         </div>
                         <div className="text-left">
                            <p className={`text-[11px] font-black uppercase tracking-[0.5em] mb-2 ${activeCategory.id === c.id ? 'text-ojo-mustard' : 'text-ojo-mustard/40'}`}>Collection 2026</p>
                            <h4 className="text-4xl font-serif italic tracking-tighter">{c.label}</h4>
                         </div>
                      </div>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${activeCategory.id === c.id ? 'bg-ojo-mustard text-ojo-charcoal' : 'bg-ojo-cream text-ojo-stone'}`}>
                         <ChevronRight size={24} />
                      </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="w-full lg:w-1/2 relative h-[90vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, scale: 1.1, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-ojo-cream rounded-[6rem] shadow-4xl group overflow-hidden border-[2rem] border-white ring-1 ring-ojo-mustard/10"
                >
                   <img src={activeCategory.img} className="w-full h-full object-cover grayscale transition-transform duration-[4s] group-hover:scale-110" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/60 via-transparent to-transparent" />
                   <div className="absolute bottom-20 left-20 p-16 space-y-6 max-w-lg">
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Registry Master Index</p>
                      <h3 className="text-7xl font-serif italic text-white leading-none">{activeCategory.id}</h3>
                      <p className="text-xl text-white/70 font-light italic font-sans leading-relaxed">
                        Exploration through the lens of {activeCategory.pattern.toUpperCase()} heritage prints.
                      </p>
                   </div>
                </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </section>

      {/* FINAL CTA: THE VAULT */}
      <section className="py-64 bg-ojo-charcoal relative overflow-hidden">
        <MotifSystem type="sozni" opacity={0.1} scale={0.5} />
        <div className="max-w-7xl mx-auto text-center space-y-20 relative z-10 px-6">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="space-y-12"
           >
              <div className="ojo-label ojo-label-verified mx-auto bg-white/10 text-white border-white/20 !px-12">Registry Node 00</div>
              <h2 className="text-9xl md:text-[13rem] font-serif italic text-ojo-mustard leading-none tracking-tighter">
                Enter The <br />
                <span className="text-white">Archive.</span>
              </h2>
              <p className="text-3xl text-white/40 leading-relaxed font-light italic max-w-3xl mx-auto">
                Secure your piece of Indian heritage. Verified, audited, and delivered with sovereign certificates.
              </p>
           </motion.div>
           
           <div className="flex flex-wrap justify-center gap-12 pt-10">
              <button onClick={() => navigate("/category")} className="ojo-btn-primary !px-24 !py-12 !text-[13px] !bg-ojo-mustard hover:!bg-white hover:!text-ojo-charcoal shadow-2xl shadow-ojo-mustard/30">
                 Request Access To Vault
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="ojo-btn-outline !bg-white/5 !text-white !border-white/10 hover:!border-white !px-24 !py-12 !text-[13px] tracking-[0.5em]"
              >
                Establish Membership
              </button>
           </div>
           
           <div className="flex items-center justify-center gap-16 pt-20 opacity-30">
              <ShieldCheck size={40} className="text-white" />
              <Search size={40} className="text-white" />
              <MapPin size={40} className="text-white" />
           </div>
        </div>
      </section>

      <StateDrawer 
        state={selectedState} 
        isOpen={!!selectedState} 
        onClose={() => setSelectedState(null)} 
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

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
              
              <h1 className="text-[12rem] md:text-[18rem] font-serif text-ojo-charcoal leading-[0.7] tracking-tighter">
                Sovereign <br />
                <span className="text-ojo-mustard italic block md:ml-40">Heritage.</span>
              </h1>
              
              <p className="text-3xl md:text-4xl text-ojo-charcoal/70 max-w-2xl font-sans leading-tight font-light italic">
                Direct access to India’s master artisans. <br />
                Verification solved through permanent geographic locking.
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
          </motion.div>

          <motion.div 
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="hidden lg:block relative h-[110vh] perspective-2000 py-20"
          >
            <div className="absolute inset-0 rounded-[8rem] rotate-3 translate-x-24 translate-y-24 bg-white/50 backdrop-blur-3xl border border-ojo-mustard/10 shadow-inner" />
            <div className="absolute inset-x-0 inset-y-20 rounded-[8rem] overflow-hidden shadow-4xl group border-[2rem] border-white ring-1 ring-ojo-mustard/10">
              <img 
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" 
                alt="Heritage Origin" 
                className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/80 via-transparent to-transparent opacity-60" />
              <div className="absolute top-24 right-24 opacity-30">
                 <MotifSystem type="sozni" scale={2.5} opacity={1} />
              </div>
              <div className="absolute bottom-24 left-24 p-20 bg-white/5 backdrop-blur-4xl rounded-[5rem] border border-white/20 text-white max-w-2xl shadow-3xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-4 h-4 rounded-full bg-ojo-mustard animate-pulse shadow-[0_0_20px_rgba(212,163,115,1)]" />
                  <span className="text-[12px] font-black uppercase tracking-[0.6em]">Registry Cluster Node 001</span>
                </div>
                <h3 className="text-7xl font-serif mb-6 italic tracking-tighter leading-none">The Darjeeling <br /> High-Mountain Reserve.</h3>
                <p className="text-2xl opacity-80 leading-snug font-sans font-light italic">
                  "Harvested within 48 hours of seasonal minerals to lock in mountain ancestry."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PatternDivider type="bagru" />

      {/* 2. PRODUCT GRID: EARLY ACCESS */}
      <section id="products" className="py-48 px-6 md:px-12 bg-white relative overflow-hidden">
        <MotifSystem type="ajrakh" opacity={0.03} scale={0.8} />
        <div className="max-w-[1700px] mx-auto space-y-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-12 max-w-5xl mx-auto"
          >
            <span className="ojo-label-verified ojo-label mx-auto !px-16 shadow-2xl !bg-ojo-charcoal !text-white !border-none">Active Trust Registry v4.0</span>
            <h2 className="text-9xl md:text-[13rem] font-serif text-ojo-charcoal leading-[0.8] tracking-tighter">
               The Provenance <br /> 
               <span className="italic text-ojo-terracotta">Registry.</span>
            </h2>
            <p className="text-3xl text-ojo-charcoal/50 leading-snug font-sans italic font-light">
              Audited by regional field teams. Every record reflects a 5-step GI-certified provenance protocol.
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-32">
              {products.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 4) * 0.1, duration: 1 }}
                  className="group"
                >
                  <div 
                    className="relative aspect-[3/4.5] rounded-[5rem] overflow-hidden transition-all duration-1000 hover:shadow-4xl border border-ojo-stone/10 group-hover:border-ojo-mustard/40 bg-ojo-cream cursor-pointer border-8 border-white shadow-2xl"
                    onClick={() => setQuickViewProduct(p)}
                  >
                    <img 
                      src={Array.isArray(p.images) ? p.images[0] : JSON.parse(p.images || "[]")[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop"} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-all duration-[3s] group-hover:scale-110 grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-ojo-charcoal/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-xl">
                      <button className="ojo-btn-primary translate-y-10 group-hover:translate-y-0 transition-all duration-700 !px-16 !py-8 !text-[12px] !bg-white !text-ojo-charcoal hover:!bg-ojo-mustard hover:!text-white border-none shadow-2xl">
                        Examine Artifact
                      </button>
                    </div>
                    <div className="absolute top-12 left-12 flex flex-col gap-3 items-start">
                       <span className="ojo-label-verified ojo-label !bg-ojo-mustard !text-white border-none shadow-xl !px-6 !py-2 !text-[9px]">
                         {p.decisionTag}
                       </span>
                       <span className="ojo-label bg-white/90 backdrop-blur-md text-ojo-charcoal border-none shadow-xl !px-6 !py-2 !text-[9px]">
                         {p.origin}
                       </span>
                    </div>
                  </div>
                  
                  <div className="pt-10 space-y-6 text-center">
                     <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-ojo-mustard/60">{p.category}</span>
                        <h3 className="text-4xl font-serif text-ojo-charcoal group-hover:text-ojo-mustard transition-colors italic tracking-tight leading-none">{p.name}</h3>
                     </div>
                     <p className="text-sm text-ojo-charcoal/40 italic font-light max-w-[200px] mx-auto line-clamp-1">"{p.story}"</p>
                     <div className="text-4xl font-mono text-ojo-charcoal pt-2">₹{p.price?.toLocaleString()}</div>
                     <div className="flex justify-center pt-2">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-ojo-mustard opacity-40">
                           <Award size={12} /> GI-Certified Heritage
                        </div>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center pt-32">
            <button 
              onClick={() => navigate("/category")}
              className="ojo-btn-primary !px-32 !py-12 group !bg-white !text-ojo-charcoal border-2 border-ojo-mustard/20 hover:!bg-ojo-charcoal hover:!text-white !text-[12px] tracking-[0.6em] shadow-2xl transition-all hover:scale-105"
            >
              Access Complete Repository <ArrowRight size={16} className="inline ml-6 transition-transform group-hover:translate-x-4" />
            </button>
          </div>
        </div>
      </section>

      <PatternDivider type="warli" />

      {/* 3. OJO INDIA EXPLORER: SIGNATURE FEATURE */}
      <section className="py-48 px-6 md:px-12 bg-ojo-cream relative overflow-hidden">
        <MotifSystem type="jaali" opacity={0.06} scale={1.5} />
        <div className="max-w-[1800px] mx-auto space-y-32 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 border-b border-ojo-mustard/10 pb-20">
            <div className="space-y-10">
              <span className="ojo-label-verified ojo-label !px-12 !py-5 shadow-2xl !bg-ojo-mustard !text-white border-none">Geographic Trust Mapping</span>
              <h2 className="text-9xl md:text-[12rem] font-serif text-ojo-charcoal leading-[0.7] tracking-tighter">
                The Geography <br />
                <span className="text-ojo-mustard italic ml-0 md:ml-48">of Ancestry.</span>
              </h2>
            </div>
            <div className="max-w-md text-right space-y-8">
              <p className="text-3xl text-ojo-charcoal/50 font-light italic leading-relaxed">
                Connect directly with the community. Every state highlighted holds a sovereign trust certificate.
              </p>
              <div className="flex items-center justify-end gap-6 text-ojo-mustard group cursor-pointer font-black text-[12px] uppercase tracking-[0.6em] hover:text-ojo-charcoal transition-colors">
                 <span>View Full Cluster GIS Data</span>
                 <ArrowRight size={20} className="transition-transform group-hover:translate-x-3" />
              </div>
            </div>
          </div>

          <IndiaExplorer onStateClick={(state) => setSelectedState(state)} />
        </div>
      </section>

      <PatternDivider type="ajrakh" />

      {/* 4. EXPLORE BY STATE: CARDS SECTION */}
      <section className="py-48 px-6 md:px-12 bg-white relative overflow-hidden">
        <MotifSystem type="bagru" opacity={0.03} scale={0.8} />
        <div className="max-w-[1700px] mx-auto space-y-32 relative z-10">
           <div className="max-w-4xl space-y-12">
              <span className="ojo-label-verified ojo-label border-ojo-mustard/20 text-ojo-mustard !px-12">Heritage Clusters</span>
              <h2 className="text-8xl md:text-[10rem] font-serif italic text-ojo-charcoal leading-none tracking-tighter">Explore by Origin.</h2>
              <p className="text-3xl text-ojo-charcoal/50 font-light italic leading-snug">
                From the desert command of Rajasthan to the high-mountain looms of Kashmir—every region tells a story of survival and craft.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { name: "Rajasthan", tag: "Command Block Prints", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" },
                { name: "Tamil Nadu", tag: "Sacred Heritage Silks", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2610&auto=format&fit=crop" },
                { name: "Kashmir", tag: "High-Altitude Pashmina", img: "https://images.unsplash.com/photo-1594191543882-626dfca15494?q=80&w=2574&auto=format&fit=crop" }
              ].map((state, i) => (
                <motion.div
                  key={state.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 1 }}
                  onClick={() => navigate(`/category?origin=${state.name}`)}
                  className="group cursor-pointer relative h-[700px] rounded-[6rem] overflow-hidden border-8 border-white shadow-2xl hover:shadow-4xl transition-all duration-1000"
                >
                   <img src={state.img} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2.5s] group-hover:scale-110" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/90 via-ojo-charcoal/40 to-transparent" />
                   <div className="absolute bottom-20 left-20 right-20 space-y-8">
                      <div className="flex items-center gap-4">
                        <span className="text-[12px] font-black uppercase tracking-[0.5em] text-ojo-mustard bg-white/10 backdrop-blur-2xl px-10 py-3 rounded-full border border-white/20 shadow-2xl">{state.tag}</span>
                      </div>
                      <h3 className="text-6xl font-serif italic text-white tracking-tighter leading-none">{state.name}</h3>
                      <div className="h-1 w-24 bg-ojo-mustard transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 shadow-[0_0_15px_rgba(212,163,115,0.6)]" />
                   </div>
                   <div className="absolute top-16 right-16 w-20 h-20 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-10 group-hover:translate-y-0 shadow-2xl">
                      <ArrowRight size={32} />
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <PatternDivider type="gond" />

      {/* 5. TRUST SYSTEM: FUNNEL STYLE */}
      <section className="py-64 px-6 md:px-12 bg-ojo-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full opacity-10 pointer-events-none">
           <MotifSystem type="kalamkari" scale={1.8} />
        </div>
        
        <div className="max-w-[1700px] mx-auto space-y-48 relative z-10">
           <div className="grid lg:grid-cols-2 gap-32 items-end">
              <div className="space-y-16">
                 <div className="space-y-10">
                    <span className="ojo-label ojo-label-verified !bg-white/10 !text-white !border-white/20 !px-16 shadow-2xl">The OJO Standard</span>
                    <h2 className="text-9xl md:text-[14rem] font-serif italic text-ojo-mustard leading-[0.8] tracking-tighter">
                      Trust is not <br />
                      <span className="text-white">Marketing.</span>
                    </h2>
                    <p className="text-3xl text-white/40 leading-snug font-light italic max-w-2xl">
                      It is a mandatory physical protocol. We solve the authenticity gap by connecting the source directly to the system.
                    </p>
                 </div>
              </div>
              <div className="flex justify-end pb-10">
                 <div className="ojo-btn-outline !bg-ojo-mustard !text-ojo-charcoal !border-none !px-24 !py-10 shadow-2xl shadow-ojo-mustard/40 font-black text-[12px] tracking-[0.6em]">Download 2026 Audit Report</div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { icon: <Globe size={32} />, step: "01", title: "Sourced", desc: "Digital verification begins at the artisanal cluster level.", pattern: "ajrakh" },
                { icon: <Lock size={32} />, step: "02", title: "Checked", desc: "3-layer physical inspection for GI-tag certificate matching.", pattern: "bagru" },
                { icon: <ShieldCheck size={32} />, step: "03", title: "Verified", desc: "Permanent QR origin ID assigned to every audited record.", pattern: "sozni" },
                { icon: <Truck size={32} />, step: "04", title: "Listed", desc: "Secure distribution through our temperature-controlled nodes.", pattern: "jaali" }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="group relative p-16 bg-white/5 border border-white/10 rounded-[5rem] space-y-12 hover:bg-white/10 transition-all duration-1000 overflow-hidden cursor-default shadow-2xl"
                >
                   <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-10 shadow-inner">
                      <MotifSystem type={step.pattern as MotifType} scale={0.5} />
                   </div>
                   <div className="flex justify-between items-start">
                      <div className="w-20 h-20 rounded-[2rem] bg-ojo-mustard flex items-center justify-center text-ojo-charcoal shadow-[0_0_30px_rgba(212,163,115,0.4)]">
                         {step.icon}
                      </div>
                      <span className="text-4xl font-mono text-white/20 font-black">{step.step}</span>
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-5xl font-serif italic tracking-tighter leading-none">{step.title}</h4>
                      <p className="text-white/40 leading-snug font-light italic text-xl pr-6">{step.desc}</p>
                   </div>
                   <div className="h-1 w-0 group-hover:w-full bg-ojo-mustard transition-all duration-1000 absolute bottom-0 left-0" />
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <PatternDivider type="paisley" />

      {/* 6. STORY SECTION: THE DOSSIER */}
      <section className="py-64 bg-white relative overflow-hidden">
        <MotifSystem type="gond" opacity={0.06} scale={1.2} />
        <div className="max-w-[1700px] mx-auto grid lg:grid-cols-2 gap-48 items-center relative z-10 px-6">
           <div className="relative">
              <div className="aspect-[1/1] md:aspect-[4/5] rounded-[6rem] overflow-hidden border-[2.5rem] border-ojo-stone/5 shadow-inner group">
                 <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover grayscale transition-all duration-[4s] group-hover:scale-110" alt="Arisan at Work" />
                 <div className="absolute inset-0 bg-ojo-mustard/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -bottom-20 -right-10 md:-right-20 p-20 bg-white shadow-4xl rounded-[5rem] border-8 border-ojo-cream max-w-lg space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-ojo-mustard flex items-center justify-center text-ojo-charcoal shadow-2xl">
                       <Zap size={24} />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.6em] text-ojo-mustard">Cluster Intelligence</span>
                 </div>
                 <p className="text-4xl font-serif italic leading-tight text-ojo-charcoal">"Heritage is not just preserved in museums; it is lived on the loom every single day."</p>
                 <div className="flex items-center gap-4 border-t border-ojo-stone/10 pt-8">
                    <div className="w-10 h-10 rounded-full bg-ojo-charcoal overflow-hidden grayscale">
                       <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop" alt="" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black uppercase tracking-widest text-ojo-charcoal">Anjali Mishra</p>
                       <p className="text-[9px] uppercase tracking-widest text-ojo-mustard">Master Weaver, Chanderi Node</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-20 pt-20 md:pt-0">
              <div className="space-y-12">
                 <span className="ojo-label-verified ojo-label border-ojo-mustard/20 text-ojo-mustard !px-12">The Human Connection</span>
                 <h2 className="text-9xl md:text-[14rem] font-serif text-ojo-charcoal leading-[0.75] tracking-tighter">
                   Stories <br />
                   <span className="italic text-ojo-terracotta ml-0 md:ml-40">Unfolded.</span>
                 </h2>
                 <p className="text-3xl text-ojo-charcoal/60 leading-snug font-light italic max-w-2xl">
                   Each artifact carries the signature of an artisan who has practiced their craft for decades. We document every hand that touches your purchase.
                 </p>
              </div>
              <button 
                onClick={() => navigate("/category")}
                className="ojo-btn-primary !px-24 !py-12 !text-[13px] group border-4 border-ojo-mustard shadow-4xl shadow-ojo-mustard/20"
              >
                 Meet Our Master Artisans <ChevronRight size={18} className="inline ml-4 group-hover:translate-x-3 transition-transform" />
              </button>
           </div>
        </div>
      </section>

      {/* FINAL CTA: THE VAULT GATE */}
      <section className="py-80 bg-ojo-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <MotifSystem type="jaali" scale={2} opacity={1} />
        </div>
        <div className="max-w-7xl mx-auto text-center space-y-24 relative z-10 px-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.2 }}
             className="space-y-16"
           >
              <div className="ojo-label ojo-label-verified mx-auto bg-white/10 text-white border-white/20 !px-16 shadow-2xl">OJO REGISTRY ACCESS</div>
              <h2 className="text-[12rem] md:text-[18rem] font-serif italic text-ojo-mustard leading-none tracking-tighter">
                Secure Your <br />
                <span className="text-white">Heritage.</span>
              </h2>
              <p className="text-4xl text-white/40 leading-snug font-light italic max-w-4xl mx-auto">
                No mock data. No simulations. Every transaction is a real addition to our sovereign registry of Indian craftsmanship.
              </p>
           </motion.div>
           
           <div className="flex flex-wrap justify-center gap-16 pt-16">
              <button onClick={() => navigate("/category")} className="ojo-btn-primary !px-32 !py-14 !text-[14px] !bg-ojo-mustard hover:!bg-white hover:!text-ojo-charcoal shadow-[0_0_50px_rgba(212,163,115,0.3)] scale-110">
                 Request Access To Vault
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="ojo-btn-outline !bg-white/5 !text-white !border-white/10 hover:!border-white !px-32 !py-14 !text-[14px] tracking-[0.8em]"
              >
                Establish Membership
              </button>
           </div>
           
           <div className="flex items-center justify-center gap-24 pt-32 opacity-20">
              <ShieldCheck size={60} className="text-white" />
              <Search size={60} className="text-white" />
              <MapPin size={60} className="text-white" />
              <Globe size={60} className="text-white" />
           </div>
        </div>
      </section>

      {/* FOOTER REINFORCEMENT */}
      <footer className="py-24 bg-white border-t border-ojo-stone/10 overflow-hidden relative">
         <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
            <MotifSystem type="kalamkari" scale={1.2} />
         </div>
         <div className="max-w-[1700px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-24 relative z-10">
            <div className="col-span-2 space-y-12">
               <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[2rem] bg-ojo-charcoal text-white flex items-center justify-center shadow-2xl">
                      <span className="font-serif italic font-black text-4xl">O</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="font-serif italic text-4xl font-black text-ojo-charcoal tracking-tighter">OJO.</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.6em] text-ojo-mustard">Sovereign Heritage Registry</span>
                   </div>
               </div>
               <p className="text-xl text-ojo-charcoal/50 font-light italic max-w-sm">
                  The trust-first marketplace for authenticated Indian heritage. 
                  Establishing the world's most secure registry of provenance.
               </p>
            </div>
            <div className="space-y-10">
               <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-ojo-mustard">The Ecosystem</h4>
               <ul className="space-y-6">
                  {["Artisan Registry", "Geographic Nodes", "Audit Protocol", "GI-Certificates"].map(link => (
                    <li key={link}><button className="text-2xl font-serif italic text-ojo-charcoal/60 hover:text-ojo-mustard transition-colors">{link}</button></li>
                  ))}
               </ul>
            </div>
            <div className="space-y-10">
               <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-ojo-mustard">Connectivity</h4>
               <ul className="space-y-6">
                  {["Member Login", "Vault Access", "Field Support", "Cluster Mapping"].map(link => (
                    <li key={link}><button className="text-2xl font-serif italic text-ojo-charcoal/60 hover:text-ojo-mustard transition-colors">{link}</button></li>
                  ))}
               </ul>
            </div>
         </div>
         <div className="max-w-[1700px] mx-auto px-6 pt-24 mt-24 border-t border-ojo-stone/10 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-ojo-charcoal/30">© 2026 OJO SOVEREIGN VAULT. All Rights Audited.</p>
            <div className="flex items-center gap-10">
               <RefreshCw size={20} className="text-ojo-mustard/40" />
               <Truck size={20} className="text-ojo-mustard/40" />
               <ShieldCheck size={20} className="text-ojo-mustard/40" />
            </div>
         </div>
      </footer>

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

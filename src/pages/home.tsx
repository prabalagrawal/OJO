import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Plus, 
  X, 
  ChevronRight,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { MotifSystem, PatternDivider } from "../components/motifs.tsx";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

type MotifType = "bagru" | "ajrakh" | "warli" | "gond" | "kolam" | "kalamkari" | "patola" | "jaali" | "sozni" | "paisley";

interface QuickViewProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: any) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewProps) {
  const navigate = useNavigate();
  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ojo-charcoal/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-ojo-cream w-full max-w-5xl h-full max-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-4xl relative z-[201]"
          >
            <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden group">
              <img 
                src={images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="ojo-label ojo-label-verified backdrop-blur-md flex items-center gap-1.5 bg-white/30 text-ojo-charcoal">
                  <ShieldCheck size={10} /> Verified Authentic
                </span>
                {product.decisionHelper && (
                  <span className="ojo-label ojo-label-trusted bg-ojo-mustard text-white backdrop-blur-md shadow-lg">
                    {product.decisionHelper}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-serif italic text-ojo-charcoal leading-tight mb-2">{product.name}</h2>
                    <div className="flex items-center gap-2 text-ojo-terracotta">
                      <MapPin size={12} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">{product.origin}</span>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-ojo-charcoal/5 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ojo-stone/20 flex items-center justify-center">
                      <Star size={14} className="text-ojo-mustard" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Artisan Master</span>
                      <p className="text-xs font-serif italic">{product.artisanName || "Heritage Guild"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-ojo-charcoal/70 leading-relaxed font-sans">{product.description}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-ojo-stone/20 mt-12">
                <div className="flex items-end justify-between mb-8">
                  <div className="text-3xl font-mono font-medium text-ojo-charcoal">₹{product.price?.toLocaleString()}</div>
                  <button 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 hover:text-ojo-charcoal flex items-center gap-1 group transition-colors"
                  >
                    View Full Provenance <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="ojo-btn-primary w-full flex items-center justify-center gap-3"
                >
                  <Plus size={16} /> Add to Collection
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeState, setActiveState] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const categories = [
    { id: "Tea", label: "Mountain Teas" },
    { id: "Saree", label: "Heirloom Sarees" },
    { id: "Handicraft", label: "Artisan Crafts" },
    { id: "Jewelry", label: "Temple Jewelry" },
    { id: "Spice", label: "Heritage Spices" }
  ];

  const states = [
    { name: "Kashmir", tags: ["Sozni Shawls", "Pashmina"], pattern: "sozni", img: "https://images.unsplash.com/photo-1598367772323-3ae1036329fc?q=80&w=2070&auto=format&fit=crop" },
    { name: "Rajasthan", tags: ["Blue Pottery", "Bagru Print"], pattern: "bagru", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" },
    { name: "Gujarat", tags: ["Ajrakh", "Brass Work"], pattern: "ajrakh", img: "https://images.unsplash.com/photo-1567154761405-b3e32906e003?q=80&w=2070&auto=format&fit=crop" },
    { name: "Tamil Nadu", tags: ["Kanchipuram Silks", "Bronze"], pattern: "kolam", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop" },
    { name: "Maharashtra", tags: ["Paithani Sarees", "Warli Art"], pattern: "warli", img: "https://images.unsplash.com/photo-1621235122146-568478440409?q=80&w=2070&auto=format&fit=crop" },
  ];

  const loadProducts = async () => {
    setLoading(true);
    const path = "products";
    try {
      const q = query(collection(db, path), limit(40));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items.slice(0, 12));
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addToCart = (product: any) => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]");
    
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
    window.dispatchEvent(new Event("storage"));
    toast.success(`${product.name} Verified & Added`);
  };

  return (
    <div className="min-h-screen bg-ojo-cream selection:bg-ojo-mustard selection:text-white overflow-x-hidden">
      {/* 1. HERO */}
      <section ref={heroRef} className="relative h-[110vh] overflow-hidden flex items-center px-6 md:px-12 bg-white">
        <MotifSystem type="sozni" opacity={0.08} scale={0.7} className="animate-motif-fade" />
        
        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <span className="ojo-label ojo-label-verified">Sovereign Registry</span>
                <div className="h-px w-12 bg-ojo-mustard/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Origin Authenticated</span>
              </motion.div>
              <h1 className="text-8xl md:text-[10rem] font-serif text-ojo-charcoal leading-[0.8] tracking-tighter">
                India’s <br />
                <span className="text-ojo-mustard italic pl-0 md:pl-24 block">Ancestral Records.</span>
              </h1>
              <p className="text-xl md:text-2xl text-ojo-charcoal/60 max-w-xl font-sans leading-relaxed font-light italic">
                The definitive connection to master artisans. Every artifact is 
                mapped to its geographic cluster via our zero-trust identity vault.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <button onClick={() => navigate("/category")} className="ojo-btn-primary group !px-14 !py-7 !text-[11px]">
                 Open The Vault <ArrowRight size={14} className="inline ml-2 transition-transform group-hover:translate-x-2" />
              </button>
              <button 
                onClick={() => document.getElementById('explore-states')?.scrollIntoView({ behavior: 'smooth' })}
                className="ojo-btn-outline !px-14 !py-7 !border-ojo-mustard/20 hover:!border-ojo-mustard"
              >
                Geographical Map
              </button>
            </div>
          </motion.div>

          <motion.div 
            style={{ y, opacity }}
            className="hidden lg:block relative h-[85vh] perspective-1000"
          >
            <div className="absolute inset-0 rounded-[5rem] overflow-hidden rotate-3 translate-x-12 translate-y-12 bg-ojo-mustard/5 border border-ojo-mustard/10" />
            <div className="absolute inset-0 rounded-[5rem] overflow-hidden shadow-4xl group border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" 
                alt="Darjeeling" 
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/60 via-transparent to-ojo-charcoal/20" />
              <div className="absolute bottom-16 left-16 p-10 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 text-white max-w-sm">
                <p className="text-[10px] uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ojo-mustard animate-pulse" /> Current Origin Focus
                </p>
                <h3 className="text-4xl font-serif mb-2 italic">Darjeeling 1845</h3>
                <p className="text-sm opacity-80 leading-relaxed font-light">"The tea that is harvested only at midnight to preserve its celestial spirit."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PatternDivider type="bagru" />

      {/* 2. EXPLORE BY STATE */}
      <section id="explore-states" className="py-40 px-6 md:px-12 relative overflow-hidden bg-white">
        <MotifSystem type="warli" opacity={0.05} scale={1.2} />
        
        <div className="max-w-[1700px] mx-auto space-y-24 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-8">
              <span className="ojo-label ojo-label-verified shadow-ojo-mustard/10">Registry Geography</span>
              <h2 className="text-7xl md:text-9xl font-serif text-ojo-charcoal leading-[0.75] tracking-tighter">
                Artisan <br />
                <span className="text-ojo-terracotta italic ml-0 md:ml-32">Clusters.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 pb-4">
              {categories.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => navigate(`/category?category=${c.id}`)}
                  className="ojo-btn-outline !py-4 !px-8 !text-[10px] font-black tracking-[0.2em]"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {states.map((state, idx) => (
              <motion.div
                key={state.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                onHoverStart={() => setActiveState(state.name)}
                onHoverEnd={() => setActiveState(null)}
                onClick={() => navigate(`/category?origin=${state.name}`)}
                className="group relative h-[500px] rounded-[3.5rem] overflow-hidden cursor-pointer shadow-2xl hover:shadow-4xl transition-all duration-700 hover:-translate-y-4 border border-ojo-stone/10"
              >
                <img src={state.img} alt={state.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-[1s] group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal via-ojo-charcoal/20 to-transparent flex flex-col justify-end p-10">
                   <p className="text-[10px] text-ojo-mustard font-black uppercase tracking-[0.3em] mb-3 opacity-0 group-hover:opacity-100 transition-all translate-y-6 group-hover:translate-y-0 duration-700">
                    {state.tags.join(" • ")}
                  </p>
                  <h3 className="text-4xl font-serif text-white tracking-tight italic">{state.name}</h3>
                </div>
                <div className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 border border-white/20">
                   <ChevronRight size={20} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PatternDivider type="gond" />

      {/* 3. VERIFIED PICKS */}
      <section className="py-48 px-6 md:px-12 bg-white relative overflow-hidden">
        <MotifSystem type="patola" opacity={0.03} scale={0.8} />
        <div className="max-w-7xl mx-auto space-y-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-10 max-w-4xl mx-auto"
          >
            <span className="ojo-label ojo-label-verified mx-auto px-10">Provenance Protocol Active</span>
            <h2 className="text-7xl md:text-9xl font-serif text-ojo-charcoal leading-[0.75] tracking-tighter">The Sovereign <br /> <span className="italic text-ojo-terracotta">Registry.</span></h2>
            <p className="text-ojo-charcoal/60 leading-relaxed font-sans italic text-2xl font-light">
              From hand-picked Darjeeling leaves to heritage Chanderi silk, 
              each object reflects a mandatory 5-step provenance audit.
            </p>
            <div className="w-40 h-px bg-ojo-mustard mx-auto shadow-gold shadow-lg" />
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-24">
              {products.map((p, idx) => {
                const pImages = Array.isArray(p.images) ? p.images : JSON.parse(p.images || "[]");
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx % 4) * 0.15 }}
                    className="group space-y-8"
                  >
                    <div 
                      className="relative aspect-[3.5/5] rounded-[3.5rem] overflow-hidden transition-all duration-1000 hover:shadow-4xl border border-ojo-stone/10 group-hover:border-ojo-mustard/30 bg-ojo-cream cursor-pointer"
                      onClick={() => setQuickViewProduct(p)}
                    >
                      <img 
                        src={pImages[0]} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 grayscale"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-ojo-charcoal/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md">
                        <button className="ojo-btn-primary translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                          Inspect Record
                        </button>
                      </div>
                      <div className="absolute top-8 left-8">
                        <span className="ojo-label-verified ojo-label bg-white/90 backdrop-blur-2xl text-ojo-charcoal border-white shadow-2xl">
                          <ShieldCheck size={10} className="inline mr-2 text-ojo-mustard" /> {p.origin}
                        </span>
                      </div>
                    </div>
                    <div className="text-center space-y-4">
                       <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-ojo-mustard/60">
                          {p.category}
                        </span>
                        <h3 className="text-3xl font-serif text-ojo-charcoal leading-tight group-hover:text-ojo-mustard transition-colors italic">{p.name}</h3>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-3xl font-mono text-ojo-charcoal">₹{p.price?.toLocaleString()}</div>
                        <span className="text-[9px] text-ojo-charcoal/40 font-black uppercase tracking-widest bg-ojo-cream px-5 py-2 rounded-full border border-ojo-stone/20">
                          Ref: {p.id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          <div className="text-center pt-24">
            <button 
              onClick={() => navigate("/category")}
              className="ojo-btn-primary !px-16 !py-8 group !bg-white !text-ojo-charcoal border border-ojo-mustard/20 hover:!bg-ojo-charcoal hover:!text-white"
            >
              Examine Full Archive <ArrowRight size={14} className="inline ml-3 transition-transform group-hover:translate-x-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. STORY SECTION */}
      <section className="py-48 bg-white relative overflow-hidden">
        <MotifSystem type="kalamkari" opacity={0.06} scale={0.7} />
        <div className="max-w-[1500px] mx-auto grid lg:grid-cols-2 gap-32 items-center relative z-10 px-6">
          <div className="space-y-16">
            <div className="aspect-square rounded-[6rem] bg-ojo-cream overflow-hidden shadow-4xl relative border-8 border-white group">
              <MotifSystem type="bagru" opacity={0.12} />
              <img src="https://images.unsplash.com/photo-1599940859674-a7fef12b94a0?q=80&w=2600&auto=format&fit=crop" className="absolute inset-20 w-[calc(100%-160px)] h-[calc(100%-160px)] object-cover rounded-[3rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
              <div className="absolute inset-0 border-[3rem] border-white/50 pointer-events-none" />
            </div>
            <div className="space-y-8">
              <span className="ojo-label ojo-label-verified">Cluster Dossier 042</span>
              <h2 className="text-7xl font-serif italic text-ojo-charcoal leading-tight">Makaibari: <br /> The Celestial Harvest.</h2>
              <p className="text-2xl text-ojo-charcoal/60 leading-relaxed font-sans font-light italic max-w-xl">
                "We don't harvest tea; we capture the spirit of the mountain. Every leaf 
                is picked as the moon reaches its zenith, ensuring the energy remains intact."
              </p>
            </div>
          </div>
          <div className="space-y-32">
            <div className="p-16 bg-ojo-cream border border-ojo-mustard/20 rounded-[4rem] space-y-12 relative overflow-hidden">
              <MotifSystem type="sozni" opacity={0.05} />
              <h3 className="text-4xl font-serif italic relative z-10">Verification Protocol</h3>
              <ul className="space-y-10 relative z-10">
                {[
                  "Raw Material Purity Test",
                  "Heritage Technique Validation",
                  "Direct Artisan Identity Audit",
                  "Geographic Origin Lockdown"
                ].map((step, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-8 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-ojo-charcoal text-white flex items-center justify-center text-xl font-serif italic shadow-xl transform group-hover:rotate-12 transition-transform">
                      {i+1}
                    </div>
                    <div>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-mustard mb-1 block">Protocol Stage</span>
                        <span className="text-lg font-bold tracking-tight">{step}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="aspect-[16/10] rounded-[4rem] overflow-hidden shadow-4xl group">
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 px-6 md:px-12 bg-ojo-charcoal text-white relative overflow-hidden">
        <MotifSystem type="jaali" opacity={0.04} />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white text-ojo-charcoal flex items-center justify-center shadow-2xl">
                <span className="font-serif italic font-black text-2xl">O</span>
               </div>
               <span className="font-serif italic text-3xl font-black tracking-tighter">OJO.</span>
            </div>
            <p className="text-lg text-white/50 leading-relaxed font-sans font-light italic">
              The Sovereign Registry for Authentic Indian Artifacts. Powered by 
              trust, preserved by heritage clusters.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Registry Access</h4>
            <ul className="space-y-5 text-sm font-bold tracking-wider">
              {["Explore All", "Verified Records", "Mountain Teas", "Heritage Silks"].map(item => (
                <li key={item}><button className="hover:text-ojo-mustard transition-colors text-left">{item}</button></li>
              ))}
            </ul>
          </div>
          <div className="space-y-8 col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-terracotta">Establish Identity</h4>
            <div className="flex gap-4">
              <input 
                type="email" 
                placeholder="Secure email for artifact alerts" 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-10 py-6 text-sm outline-none focus:border-ojo-mustard transition-all text-white placeholder:text-white/30"
              />
              <button className="ojo-btn-primary !px-12 !bg-ojo-mustard hover:!bg-white hover:!text-ojo-charcoal">
                Join
              </button>
            </div>
            <p className="text-[10px] text-white/30 flex items-center gap-3 font-sans font-black uppercase tracking-widest">
              <ShieldCheck size={12} className="text-ojo-mustard" /> Official Provenance Channel • No Third-Party Data
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
          <p>© 2026 OJO Heritage Registry. Certified Indian Standard.</p>
          <div className="flex gap-10">
            <button className="hover:text-white transition-colors">Ethics Code</button>
            <button className="hover:text-white transition-colors">GI Integrity</button>
            <button className="hover:text-white transition-colors">Artisan Rights</button>
          </div>
        </div>
      </footer>

      {/* QUICK VIEW SYSTEM */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)} 
        onAddToCart={addToCart}
      />
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api.ts";
import { VerifiedBadge, VerifiedIcon } from "../components/brand.tsx";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Coffee, Leaf, Sparkles, Grid, ShieldCheck, Filter, X, ChevronDown, Search, Globe, Eye, CheckCircle } from "lucide-react";
import { MotifMandala, MotifLotus, MotifDiamond, MotifOrnamental, MotifPaisley, MotifRangoli, MotifTraditionalMandala, MotifTraditionalRangoli } from "../components/motifs.tsx";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 lg:p-24"
    >
        <motion.div 
          onClick={onClose}
          className="absolute inset-0 bg-ojo-charcoal/60 backdrop-blur-xl"
        />
        
        <motion.div 
          layoutId={`product-${product.id}`}
          className="bg-ojo-cream w-full max-w-6xl rounded-[60px] overflow-hidden shadow-3xl relative z-10 flex flex-col lg:flex-row max-h-[90vh]"
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
                   <div className="flex items-center gap-1">
                     {[1,2,3,4,5].map(s => <Sparkles key={s} size={12} className="text-ojo-mustard" />)}
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter States
  const [originFilter, setOriginFilter] = useState<string>("");
  const [priceMax, setPriceMax] = useState<number>(50000);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  useEffect(() => {
    api.get("/products")
      .then(setProducts)
      .finally(() => setLoading(false));

    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredProducts = useMemo(() => {
    setCurrentPage(1); // Reset to first page when filtering
    return products.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.origin.toLowerCase().includes(query);
      const matchesOrigin = !originFilter || p.origin === originFilter;
      const matchesPrice = p.price <= priceMax;
      const matchesVerified = !verifiedOnly || p.verified; // Assuming products have verified bit
      return matchesQuery && matchesOrigin && matchesPrice && matchesVerified;
    });
  }, [products, query, originFilter, priceMax, verifiedOnly]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const origins = useMemo(() => Array.from(new Set(products.map(p => p.origin))), [products]);

  const categories = [
    { name: "Handloom", icon: <Grid size={24} /> },
    { name: "Tea", icon: <Coffee size={24} /> },
    { name: "Spices", icon: <Leaf size={24} /> },
    { name: "Handicraft", icon: <Sparkles size={24} /> },
    { name: "More", icon: <Grid size={24} /> },
  ];

  return (
    <div className="space-y-0 maximalist-gradient bg-ojo-cream">
      {/* Hero / Banner Section - Dark Editorial Overhaul */}
      <section className="relative overflow-hidden bg-ojo-charcoal text-ojo-soft-cream">
        <div className="absolute inset-0 pattern-mandala opacity-[0.05] pointer-events-none" />
        <div className="absolute top-10 right-10 opacity-10 animate-spin-slow pointer-events-none">
          <MotifTraditionalMandala size={800} color="#B07E1E" />
        </div>
        
        <div className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-24">
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
                className="text-6xl md:text-[100px] font-serif leading-[0.85] tracking-tighter text-ojo-cream"
              >
                India’s Authentic <br />
                <span className="italic text-ojo-terracotta">Products.</span> <br />
                Verified.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm md:text-xl font-light text-ojo-soft-cream opacity-80 max-w-lg leading-relaxed border-l-2 border-ojo-mustard pl-8 ml-2"
              >
                Every OJO artifact passes through a three-tier rigorous provenance check. 
                We bridge the gap between ancient lineage and modern digital trust.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <button 
                  onClick={() => document.getElementById('registry-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-ojo-mustard text-ojo-black px-16 py-6 rounded-full font-black tracking-[0.3em] text-[10px] uppercase hover:shadow-[0_0_20px_rgba(176,126,30,0.4)] hover:-translate-y-1 transition-all"
                >
                  Explore Verified Products
                </button>
                <button className="flex items-center gap-3 text-ojo-soft-cream text-[10px] font-black uppercase tracking-widest hover:text-ojo-mustard transition-colors">
                   The Authentication Process <ArrowRight size={14} />
                </button>
              </motion.div>
            </div>
            
            <div className="lg:col-span-5 relative hidden lg:block">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1.2 }}
                 className="aspect-[4/5] rounded-[80px] overflow-hidden shadow-3xl border-8 border-white/5 relative group"
               >
                  <img 
                    src="https://images.unsplash.com/photo-1623126868352-794017688fa0?q=80&w=2670&auto=format&fit=crop" 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    alt="Artisan"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal to-transparent opacity-40" />
               </motion.div>
               {/* Abstract Overlay Elements */}
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-ojo-mustard/20 rounded-full blur-3xl animate-float" />
               <div className="absolute -top-10 -right-10 w-60 h-60 bg-ojo-terracotta/20 rounded-full blur-3xl animate-float-delayed" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - How OJO Works (Light) */}
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
                Each OJO artifact follows a strict pathway of authentication before it enters our registry.
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
                <div key={i} className="p-10 bg-white rounded-[40px] border border-ojo-stone/10 space-y-6 shadow-xl hover:border-ojo-mustard/40 transition-all group">
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

      {/* Why OJO - Problem/Solution Section */}
      <section className="py-20 bg-ojo-charcoal text-ojo-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-mandala opacity-[0.05] scale-150 animate-spin-slow pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="ojo-label flex items-center gap-4 text-ojo-mustard">
                <div className="w-12 h-px bg-ojo-mustard" />
                <span>THE OJO MANDATE</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif leading-none tracking-tighter">
                The Problem is <span className="italic text-ojo-soft-cream/40">Imitation.</span> <br />
                Our Solution is <span className="text-ojo-mustard">Truth.</span>
              </h2>
              <div className="space-y-8 max-w-lg">
                <p className="text-lg font-light text-ojo-soft-cream/60 leading-relaxed">
                  In a fragmented market overflowing with mass-produced replicas and unverified claims, the soul of true Indian craft is being diluted. 
                </p>
                <div className="h-px w-full bg-white/10" />
                <p className="text-lg font-light text-ojo-soft-cream leading-relaxed font-serif italic">
                  "OJO was born to protect the artisan and the collector alike, creating a digital fortress for ancient lineage."
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Fragmented Supply", desc: "Most marketplaces rely on unverified middlemen, leading to inconsistent quality and opaque origins.", problem: true },
                { title: "OJO Verification", desc: "We deploy field agents and digital ledger technology to verify every item at its source.", problem: false },
                { title: "Fake Heritage", desc: "Machines create patterns that mimic hand-carved soul, destroying the value of genuine craft.", problem: true },
                { title: "Guaranteed Origin", desc: "Every OJO artifact carries a verified Geographical Indication (GI) and a registry fingerprint.", problem: false }
              ].map((item, idx) => (
                <div key={idx} className={`p-10 rounded-[40px] border transition-all ${item.problem ? 'bg-white/5 border-white/10 opacity-60' : 'bg-ojo-mustard text-ojo-charcoal border-ojo-mustard shadow-2xl scale-105'}`}>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4">{item.title}</h4>
                  <p className="text-[11px] font-light leading-relaxed">{item.desc}</p>
                  <div className="mt-6 flex items-center gap-2">
                    {item.problem ? <X size={14} className="text-ojo-terracotta" /> : <CheckCircle size={14} className="text-ojo-charcoal" />}
                    <span className="text-[8px] font-black uppercase tracking-widest">{item.problem ? 'The Fragmented Reality' : 'The OJO Standard'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - How OJO Works (Light) */}
      <section className="py-40 bg-ojo-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 space-y-8">
              <div className="ojo-label flex items-center gap-4 text-ojo-terracotta">
                <div className="w-12 h-px bg-ojo-terracotta" />
                <span>THE TRUST PROTOCOL</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif text-ojo-charcoal leading-tight tracking-tighter">
                Verification <br /><span className="italic text-ojo-terracotta">is our Lineage.</span>
              </h2>
              <p className="text-lg font-light text-ojo-charcoal opacity-60 leading-relaxed max-w-sm">
                Each OJO artifact follows a strict pathway of authentication before it enters our registry.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { 
                  title: "Verified Source", 
                  desc: "Directly sourced from registered artisanal guilds.", 
                  details: "We skip all middlemen, partnering directly with heritage cooperatives.",
                  icon: <ShieldCheck size={32} className="text-ojo-terracotta" />
                },
                { 
                  title: "Quality Checked", 
                  desc: "Rigorous standards for material and craft.", 
                  details: "Every item undergoes a 12-point quality and material audit.",
                  icon: <Eye size={32} className="text-ojo-terracotta" />
                },
                { 
                  title: "Origin Tracked", 
                  desc: "GI and history digitally verified.", 
                  details: "Geographical Indication (GI) mapping ensures regional authenticity.",
                  icon: <Globe size={32} className="text-ojo-terracotta" />
                }
              ].map((step, i) => (
                <div key={i} className="p-10 bg-white rounded-[40px] border border-ojo-stone/20 space-y-6 shadow-xl hover:border-ojo-mustard/40 transition-all group">
                   <div className="w-16 h-16 rounded-2xl bg-ojo-cream flex items-center justify-center group-hover:bg-ojo-mustard group-hover:text-white transition-all">
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
                  setOriginFilter(region.name);
                  document.getElementById('registry-grid')?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Filter & Listing Section - Integrated Maximalism */}
      <section className="space-y-24 px-6 md:px-12">
        <div className="flex flex-col gap-12 relative">
          <div className="absolute -top-32 -right-40 opacity-[0.03] pointer-events-none">
            <MotifTraditionalRangoli size={400} color="#B8860B" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-ojo-stone pb-16">
            <div className="space-y-8 flex-1">
               <div className="ojo-label text-ojo-mustard flex items-center gap-4">
                 <div className="w-8 h-px bg-ojo-mustard/30" />
                 THE SOVEREIGN SELECTION
               </div>
               <h2 className="text-6xl md:text-8xl font-serif tracking-tight leading-none text-ojo-charcoal">OJO <span className="italic">Verified Picks</span></h2>
               <p className="text-sm font-light opacity-40 max-w-md italic ml-2">Authenticated artifacts of extreme cultural merit, curated for the modern collector.</p>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="hidden lg:flex flex-col items-end gap-2 pr-8 border-r border-ojo-stone/30">
                <span className="text-[10px] font-black text-ojo-charcoal uppercase tracking-[0.2em]">{filteredProducts.length} ARTIFACTS</span>
                <span className="text-[9px] font-medium text-ojo-charcoal/40 uppercase tracking-[0.1em]">Currently in Active Registry</span>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-4 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${showFilters ? 'bg-ojo-charcoal text-white border-ojo-charcoal' : 'bg-white text-ojo-charcoal border-ojo-charcoal hover:bg-ojo-charcoal hover:text-white'}`}
              >
                {showFilters ? <X size={16} /> : <Filter size={16} />}
                Explore Filters
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 p-16 bg-white rounded-[60px] border border-ojo-stone shadow-2xl mb-16 relative overflow-hidden">
                  <div className="absolute inset-0 pattern-mandala opacity-[0.03] scale-125" />
                  {/* Origin Selection */}
                  <div className="space-y-6 relative z-10">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40 italic">Regional Origin</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["All", ...origins.slice(0, 5)].map(o => (
                        <button 
                          key={o}
                          onClick={() => setOriginFilter(o === "All" ? "" : o)}
                          className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${ (o === "All" ? originFilter === "" : originFilter === o) ? 'bg-ojo-charcoal text-white border-ojo-charcoal' : 'bg-ojo-cream border-ojo-stone/40 hover:border-ojo-mustard'}`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Valuation */}
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40 italic">Valuation Max</label>
                      <span className="text-xl font-serif text-ojo-terracotta">₹{(priceMax/1000).toLocaleString()}K</span>
                    </div>
                    <div className="relative pt-6">
                      <input 
                        type="range" 
                        min="0" 
                        max="100000" 
                        step="5000"
                        value={priceMax}
                        onChange={(e) => setPriceMax(parseInt(e.target.value))}
                        className="w-full accent-ojo-mustard h-2 bg-ojo-stone/30 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-4 text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/20">
                        <span>Min</span>
                        <span>Mid</span>
                        <span>Max Ledger</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Trust */}
                  <div className="space-y-6 relative z-10">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40 italic">Authentication</label>
                    <div className="flex flex-col gap-4">
                      <label className="flex items-center justify-between p-4 rounded-2xl bg-ojo-cream/40 border border-ojo-stone/20 cursor-pointer group hover:border-ojo-mustard transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-6 bg-ojo-stone/40 rounded-full relative transition-colors ${verifiedOnly ? 'bg-ojo-olive/20' : ''}`}>
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={verifiedOnly}
                              onChange={(e) => setVerifiedOnly(e.target.checked)}
                            />
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${verifiedOnly ? 'left-5' : 'left-1'}`} />
                          </div>
                          <span className="text-xs font-bold text-ojo-charcoal/60 uppercase racking-wider">Sovereign Verified</span>
                        </div>
                        <ShieldCheck size={16} className={verifiedOnly ? 'text-ojo-olive' : 'text-ojo-charcoal/20'} />
                      </label>
                      <p className="text-[9px] leading-relaxed opacity-40 font-medium">Show only artifacts that have completed the full 3-tier provenance authentication process.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Artifact Grid - Staggered Bento Overhaul */}
      <section id="registry-grid" className="px-6 md:px-12">
        {loading ? (
          <div className="h-[600px] flex items-center justify-center relative">
             <div className="absolute inset-0 pattern-mandala opacity-[0.03] animate-spin-slow scale-125" />
             <div className="w-16 h-16 border-2 border-ojo-mustard border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 pb-20">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, idx) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (idx % itemsPerPage) % 4 * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex flex-col gap-6 group cursor-pointer lg:col-span-4 md:col-span-6"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <div className="maximalist-card overflow-hidden !p-1 relative bg-white">
                      <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden bg-ojo-stone/10">
                        <img 
                          src={JSON.parse(product.images || "[]")[0]} 
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2670&auto=format&fit=crop";
                          }}
                        />
                      <div className="absolute inset-0 bg-ojo-charcoal hover:bg-transparent opacity-0 transition-opacity" />
                      
                      {/* Rich Floating Elements on Hover */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-ojo-charcoal/20 backdrop-blur-[2px]">
                         <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/product/${product.id}`;
                          }}
                          className="px-8 py-4 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-ojo-mustard/20"
                         >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-charcoal flex items-center gap-3">
                              View Detail
                              <ArrowRight size={14} className="text-ojo-terracotta" />
                            </span>
                         </motion.div>

                         <motion.button 
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(product);
                          }}
                          className="px-8 py-4 bg-ojo-charcoal text-ojo-soft-cream rounded-full shadow-2xl border border-ojo-mustard/40 text-[10px] font-black uppercase tracking-[0.3em]"
                         >
                            Quick View
                         </motion.button>
                      </div>

                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 duration-500">
                         <VerifiedBadge className="scale-75" />
                      </div>
                      
                      <div className="absolute bottom-6 left-6 px-4 py-2 bg-ojo-charcoal/80 backdrop-blur-md rounded-full border border-white/10 group-hover:border-ojo-mustard transition-colors">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Registry ID: 00{idx + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 px-4 relative">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <VerifiedIcon className="shrink-0" />
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-ojo-mustard truncate">{product.origin}</span>
                        </div>
                        <h4 className="font-serif text-xl md:text-2xl leading-tight group-hover:text-ojo-terracotta transition-colors truncate tracking-tighter">
                          {product.name}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pt-1.5">
                        <span className="text-base md:text-lg font-serif text-ojo-charcoal leading-none whitespace-nowrap">₹{product.price.toLocaleString()}</span>
                        <div className="w-6 h-[1px] bg-ojo-mustard mt-2 group-hover:w-full transition-all duration-700" />
                      </div>
                    </div>
                    <p className="text-[10px] font-light opacity-40 line-clamp-2 leading-relaxed tracking-wide group-hover:opacity-70 transition-opacity">
                      {product.story ? product.story.substring(0, 80) + '...' : product.description}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 lg:col-span-12 py-40 text-center space-y-8 relative overflow-hidden bg-white/40 rounded-[60px] border border-dashed border-ojo-stone">
                <div className="absolute inset-0 pattern-mandala opacity-[0.05] pointer-events-none" />
                <div className="w-32 h-32 bg-ojo-stone/10 rounded-full flex items-center justify-center mx-auto border border-ojo-stone relative z-10 transition-transform hover:rotate-45">
                  <Search size={48} className="text-ojo-mustard/40" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h4 className="font-serif text-5xl tracking-tighter">The Ledger is Silent</h4>
                  <p className="text-sm text-ojo-charcoal/40 max-w-sm mx-auto leading-relaxed font-light">
                    Your current parameters have no matches in our authenticated archives. 
                    Consider expanding your regional or valuation limits.
                  </p>
                  <button 
                    onClick={() => {
                      setOriginFilter("");
                      setPriceMax(100000);
                      setVerifiedOnly(false);
                      const url = new URL(window.location.href);
                      url.searchParams.delete("q");
                      window.history.replaceState({}, "", url);
                      window.dispatchEvent(new Event("popstate"));
                    }}
                    className="mt-8 ojo-btn-primary mx-auto !bg-ojo-terracotta"
                  >
                    Reset All Registry Filters
                  </button>
                </div>
              </div>
            )}
            </div>

            {/* Pagination Controls - Moved properly inside the registry view */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-12 pb-20 relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-ojo-stone/40 to-transparent pointer-events-none" />
                
                <button 
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: document.getElementById('registry-grid')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="relative z-10 p-4 rounded-full border border-ojo-stone/40 bg-white/60 backdrop-blur-md text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <motion.div animate={{ x: currentPage === 1 ? 0 : [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <ArrowRight size={20} className="rotate-180" />
                  </motion.div>
                </button>

                <div className="flex items-center gap-3 relative z-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: document.getElementById('registry-grid')?.offsetTop || 0, behavior: 'smooth' });
                      }}
                      className={`relative w-12 h-12 rounded-[18px] text-[10px] font-black tracking-widest uppercase transition-all overflow-hidden group
                        ${currentPage === page ? 'bg-ojo-charcoal text-white shadow-2xl scale-110' : 'bg-white/40 backdrop-blur-md border border-ojo-stone/20 text-ojo-charcoal/40 hover:border-ojo-mustard'}`}
                    >
                      <div className={`absolute inset-0 pattern-jali opacity-[0.05] pointer-events-none ${currentPage === page ? 'opacity-[0.1]' : ''}`} />
                      <span className="relative z-10">{page < 10 ? `0${page}` : page}</span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: document.getElementById('registry-grid')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="relative z-10 p-4 rounded-full border border-ojo-stone/40 bg-white/60 backdrop-blur-md text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <motion.div animate={{ x: currentPage === totalPages ? 0 : [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <ArrowRight size={20} />
                  </motion.div>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Storytelling Section - From Origin to You */}
      <section className="-mx-6 md:-mx-12 px-6 md:px-12 py-40 relative">
         <div className="absolute inset-0 pattern-lotus opacity-[0.03]" />
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
            <div className="space-y-12">
               <div className="ojo-label flex items-center gap-4">
                  <div className="w-12 h-px bg-ojo-mustard" />
                  <span>THE PROVENANCE NARRATIVE</span>
               </div>
               <h2 className="text-6xl md:text-8xl font-serif text-ojo-charcoal leading-none tracking-tighter">
                  From Origin <br />
                  <span className="italic text-ojo-stone">To You.</span>
               </h2>
               <p className="text-lg font-light text-ojo-charcoal/60 leading-relaxed border-l-4 border-ojo-terracotta pl-12 italic">
                  Authenticity isn't a badge, it's a journey. We travel to the heart of the village to ensure every thread, grain, and stroke is genuine. 
                  When you hold an OJO artifact, you hold the verified soul of an entire region.
               </p>
               <div className="grid grid-cols-2 gap-12 pt-8">
                  <div className="space-y-4">
                     <span className="text-4xl font-serif text-ojo-terracotta tracking-tighter">47+</span>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Registered Guilds</p>
                  </div>
                  <div className="space-y-4">
                     <span className="text-4xl font-serif text-ojo-terracotta tracking-tighter">1,200+</span>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Artifacts</p>
                  </div>
               </div>
            </div>

            <div className="relative">
               <div className="aspect-square rounded-[80px] overflow-hidden rotate-3 hover:rotate-0 transition-all duration-1000 shadow-3xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670&auto=format&fit=crop" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
                    alt="Artisan Story" 
                  />
               </div>
               <div className="absolute -bottom-12 -left-12 p-12 bg-ojo-mustard text-white rounded-[40px] shadow-2xl -rotate-6">
                  <MotifLotus size={60} />
                  <h4 className="text-xl font-serif italic mt-6">Hand-tagged at Source</h4>
               </div>
            </div>
         </div>
      </section>

      {/* Artisan Showcase - (Dark) */}
      <section className="relative py-48 overflow-hidden bg-ojo-charcoal text-ojo-soft-cream">
        <div className="absolute inset-0 pattern-jali opacity-[0.04] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="ojo-label flex items-center gap-4 text-ojo-mustard">
              <div className="w-12 h-px bg-ojo-mustard" />
              <span>THE ARTISAN CHARTER</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none">
              A Legacy <br/><span className="italic text-ojo-mustard">Untouched</span> <br/>By Time.
            </h2>
            <div className="space-y-8 max-w-lg">
              <p className="text-lg font-light text-ojo-soft-cream opacity-60 leading-relaxed">
                We believe that true value lies in the human hand. Machine perfection is cold; artisanal imperfection is a fingerprint of reality.
              </p>
              <div className="flex gap-12 pt-6">
                <div className="space-y-2">
                  <div className="text-4xl font-serif text-ojo-mustard">82%</div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Direct Profit to Guilds</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-serif text-ojo-mustard">100%</div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Origin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
             <motion.div 
                initial={{ rotate: 5, scale: 0.9, opacity: 0 }}
                whileInView={{ rotate: -2, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative aspect-[3/4] rounded-[80px] overflow-hidden border-8 border-white/5 shadow-3xl group"
             >
                <img 
                  src="https://images.unsplash.com/photo-1590736962234-4537156942c1?q=80&w=2670&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
                  alt="Artisanal Heritage"
                />
                <div className="absolute inset-0 bg-ojo-mustard/10 mix-blend-color" />
             </motion.div>
             <div className="absolute -bottom-10 -right-10 translate-x-4 translate-y-4">
                <VerifiedBadge className="!w-40 !h-40" />
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
            <button className="bg-ojo-mustard text-ojo-black px-24 py-8 rounded-full font-black tracking-[0.4em] text-xs uppercase hover:bg-ojo-charcoal hover:text-white transition-all shadow-3xl">
              Explore the Full Registry
            </button>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal 
            product={quickViewProduct} 
            onClose={() => setQuickViewProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

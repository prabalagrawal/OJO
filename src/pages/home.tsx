import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api.ts";
import { VerifiedBadge, VerifiedIcon } from "../components/brand.tsx";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Coffee, Leaf, Sparkles, Grid, ShieldCheck, Filter, X, ChevronDown, Search, Globe } from "lucide-react";
import { MotifMandala, MotifLotus, MotifDiamond, MotifOrnamental, MotifPaisley, MotifRangoli, MotifTraditionalMandala, MotifTraditionalRangoli } from "../components/motifs.tsx";

export function QuickViewModal({ product, onClose }: { product: any; onClose: () => void }) {
  if (!product) return null;
  const images = JSON.parse(product.images || "[]");

  return (
    <AnimatePresence>
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
          className="bg-ojo-beige w-full max-w-5xl rounded-[60px] overflow-hidden shadow-3xl relative z-10 flex flex-col lg:flex-row max-h-[90vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-50 p-4 bg-white/20 backdrop-blur-md rounded-full text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all"
          >
            <X size={24} />
          </button>

          {/* Image Side */}
          <div className="lg:w-1/2 relative bg-white">
            <div className="absolute inset-0 pattern-jali opacity-[0.03]" />
            <img 
              src={images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8">
               <VerifiedBadge className="!w-20 !h-20" />
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center space-y-10 relative overflow-hidden">
            <div className="absolute inset-0 pattern-mandala opacity-[0.02] pointer-events-none" />
            
            <div className="space-y-4">
               <div className="ojo-label text-ojo-mustard flex items-center gap-3">
                 <div className="w-6 h-px bg-ojo-mustard/40" />
                 {product.origin} Registry Entry
               </div>
               <div className="flex items-center gap-4">
                 <h2 className="text-4xl lg:text-5xl font-serif tracking-tighter leading-none">{product.name}</h2>
                 <VerifiedIcon className="scale-125" />
               </div>
               <div className="flex items-center gap-2 pt-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 italic">By {product.artisanName || "Master Artisan"}</span>
               </div>
            </div>

            <div className="space-y-6">
              <span className="text-3xl font-serif text-ojo-terracotta">₹{product.price.toLocaleString()}</span>
              <p className="text-sm font-light opacity-60 leading-relaxed italic border-l-2 border-ojo-mustard/20 pl-6">
                {(product.story || product.description).substring(0, 180)}...
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-6">
               <button 
                onClick={() => window.location.href = `/product/${product.id}`}
                className="ojo-btn-primary w-full"
               >
                 View Full Provenance
               </button>
               <div className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20 text-center">
                 Sovereign Ledger Artifact #{product.id.substring(0, 8)}
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
    <div className="space-y-40 maximalist-gradient pb-60">
      {/* Hero / Banner Section - Maximalist Overhaul */}
      <section className="-mx-6 md:-mx-12 px-6 md:px-12 pt-8 relative overflow-hidden">
        <div className="absolute top-10 right-10 opacity-10 animate-spin-slow pointer-events-none">
          <MotifTraditionalMandala size={800} color="#B8860B" />
        </div>
        <div className="absolute top-[20%] -left-20 opacity-[0.04] animate-float pointer-events-none">
          <MotifTraditionalRangoli size={500} color="#A63F1D" />
        </div>
        
        <div className="relative h-[600px] md:h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-white/40 backdrop-blur-sm rounded-[60px] border border-ojo-stone/40">
          <div className="lg:col-span-7 flex flex-col justify-center px-8 md:px-24 space-y-12 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="ojo-label flex items-center gap-4"
            >
              <div className="w-12 h-px bg-ojo-mustard" />
              <span>THE SOVEREIGN PROVENANCE REGISTRY</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-[120px] font-serif leading-[0.85] tracking-tighter text-ojo-charcoal"
            >
              INDIA'S AUTHENTIC <br />
              <span className="italic text-ojo-terracotta relative">
                PRODUCTS
                <div className="absolute -bottom-4 right-0 w-1/2 h-1 bg-ojo-mustard/30 -skew-x-12" />
              </span>. <br />
              VERIFIED.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-lg font-light opacity-60 max-w-lg leading-relaxed border-l-2 border-ojo-mustard pl-8 ml-2"
            >
              Every artifact in the OJO registry passes a rigorous 3-tier provenance check. 
              We bridge the gap between ancient heritage and modern trust.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="ojo-btn-primary px-16 py-6 text-xs group">
                Begin Discovery
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 relative hidden lg:block overflow-hidden">
             <motion.img 
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src="https://images.unsplash.com/photo-1623126868352-794017688fa0?q=80&w=2670&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="Artisan"
             />
             <div className="absolute inset-0 bg-ojo-charcoal/10 mix-blend-overlay" />
             {/* Abstract Overlay Elements */}
             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ojo-mustard/20 rounded-full blur-3xl" />
             <div className="absolute top-1/2 left-0 -translate-y-1/2 h-1/2 w-4 pattern-border-trim opacity-40 rotate-90" />
          </div>
        </div>
      </section>

      {/* Trust Section - How OJO Works (Provenence Architecture) */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 space-y-8">
            <div className="ojo-label flex items-center gap-4">
              <div className="w-12 h-px bg-ojo-mustard" />
              <span>THE TRUST PROTOCOL</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-ojo-charcoal leading-tight">
              A Guarantee <br /><span className="italic text-ojo-terracotta">of Provenance.</span>
            </h2>
            <p className="text-sm font-light opacity-60 leading-relaxed">
              In a world of mass-produced replicas, OJO stands as the definitive barrier. 
              We don't just sell products; we register heritage.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { 
                title: "Verified Source", 
                desc: "Direct cooperatives source. No middlemen.", 
                details: "Every item is tagged at the loom or kiln by OJO field agents.",
                icon: <VerifiedBadge className="text-ojo-mustard" />
              },
              { 
                title: "Quality Checked", 
                desc: "Material purity & structural audit.", 
                details: "We verify thread count, organic dye composition, and artisanal integrity.",
                icon: <ShieldCheck size={32} className="text-ojo-mustard" />
              },
              { 
                title: "Origin Tracked", 
                desc: "Blockchain-backed heritage log.", 
                details: "Scan any product ID to see the full cultural journey from its region of birth.",
                icon: <Globe size={32} className="text-ojo-mustard" />
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="p-8 bg-white border border-ojo-stone/40 rounded-[30px] shadow-lg shadow-ojo-charcoal/5 space-y-6 group cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-ojo-charcoal/5 flex items-center justify-center group-hover:bg-ojo-mustard group-hover:text-white transition-all">
                  {step.icon}
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-ojo-charcoal">{step.title}</h4>
                <p className="text-[11px] font-light leading-relaxed opacity-50">{step.desc}</p>
                <div className="pt-4 overflow-hidden h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="h-px w-8 bg-ojo-mustard mb-4" />
                  <p className="text-[10px] italic text-ojo-mustard/80">{step.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Region - Immersive Visual Selector */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-6">
          <div className="ojo-label flex items-center justify-center gap-4">
             <div className="w-12 h-px bg-ojo-stone/30" />
             <span>REGIONAL ATLAS</span>
             <div className="w-12 h-px bg-ojo-stone/30" />
          </div>
          <h2 className="text-5xl font-serif text-ojo-charcoal">Cultural Epochs. <span className="italic text-ojo-stone">By Region.</span></h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Kashmir", img: "https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670", color: "#E5E1D8" },
            { name: "Jaipur", img: "https://images.unsplash.com/photo-1590050752117-238444bc3fe2?q=80&w=2576", color: "#FDF2F0" },
            { name: "Kanchipuram", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2670", color: "#F0F4ED" },
            { name: "Bankura", img: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2670", color: "#FAF6F1" }
          ].map((region, i) => (
             <motion.div 
              key={i}
              whileHover={{ scale: 0.98 }}
              className="relative aspect-[3/4] rounded-[40px] overflow-hidden group cursor-pointer border border-ojo-stone/30"
              onClick={() => {
                setOriginFilter(region.name);
                document.getElementById('registry-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
             >
                <img src={region.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt={region.name} />
                <div className="absolute inset-0 bg-ojo-charcoal/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/80 to-transparent" />
                <div className="absolute bottom-10 left-0 w-full px-8 text-white space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Artifacts of</span>
                  <h4 className="text-3xl font-serif tracking-tighter">{region.name}</h4>
                </div>
             </motion.div>
          ))}
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
                 THE REGISTRY VIEW
               </div>
               <h2 className="text-6xl md:text-8xl font-serif tracking-tight leading-none text-ojo-charcoal">Verified <span className="italic">Picks</span></h2>
               <p className="text-sm font-light opacity-40 max-w-md">Our collection of authenticated artifacts from verified artisans across the subcontinent.</p>
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
                          className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${ (o === "All" ? originFilter === "" : originFilter === o) ? 'bg-ojo-charcoal text-white border-ojo-charcoal' : 'bg-ojo-beige border-ojo-stone/40 hover:border-ojo-mustard'}`}
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
                      <label className="flex items-center justify-between p-4 rounded-2xl bg-ojo-beige/40 border border-ojo-stone/20 cursor-pointer group hover:border-ojo-mustard transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-6 bg-ojo-stone/40 rounded-full relative transition-colors ${verifiedOnly ? 'bg-ojo-emerald/20' : ''}`}>
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
                        <ShieldCheck size={16} className={verifiedOnly ? 'text-ojo-emerald' : 'text-ojo-charcoal/20'} />
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
                    onClick={() => window.location.href = `/product/${product.id}`}
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
                          className="px-8 py-4 bg-ojo-charcoal text-ojo-beige rounded-full shadow-2xl border border-ojo-mustard/40 text-[10px] font-black uppercase tracking-[0.3em]"
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
                  <span>THE CRAFT ODYSSEY</span>
               </div>
               <h2 className="text-6xl md:text-8xl font-serif text-ojo-charcoal leading-none tracking-tighter">
                  From Origin <br />
                  <span className="italic text-ojo-stone">To You.</span>
               </h2>
               <p className="text-lg font-light text-ojo-charcoal/60 leading-relaxed border-l-4 border-ojo-terracotta pl-12">
                  Authentication is our bloodline. We travel to the most remote corners of the subcontinent to verify materials, interview masters, and secure the chain of custody. 
                  OJO isn't just a shop—it's a digital guardian of human excellence.
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

      {/* Artisan Showcase - Immersive Split Overhaul */}
      <section className="relative py-48 overflow-hidden bg-ojo-charcoal text-ojo-beige">
        <div className="absolute inset-0 pattern-jali opacity-[0.04]" />
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-ojo-charcoal/10 to-transparent" />
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-24 grid grid-cols-1 lg:grid-cols-12 items-center gap-24">
           <div className="lg:col-span-6 space-y-16 relative">
              <div className="absolute -top-32 -left-20 opacity-10 pointer-events-none rotate-12">
                <MotifTraditionalRangoli size={300} color="#F3E9D6" />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="ojo-label text-ojo-mustard flex items-center gap-4">
                  <div className="w-12 h-px bg-ojo-mustard" />
                  AUTHENTICATION PROTOCOL
                </div>
                <h2 className="text-7xl md:text-9xl font-serif tracking-tighter leading-[0.8] mix-blend-difference">
                  THE <br />
                  <span className="italic text-ojo-mustard">SOUL</span> <br />
                  OF CRAFT.
                </h2>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="flex gap-12 border-l border-ojo-mustard/20 pl-10"
              >
                <div className="space-y-4">
                  <div className="text-4xl font-serif text-ojo-mustard">O.1</div>
                  <p className="text-xs font-light opacity-50 leading-relaxed uppercase tracking-widest">Heritage Expert <br /> Evaluation</p>
                </div>
                <div className="space-y-4">
                  <div className="text-4xl font-serif text-ojo-mustard">O.2</div>
                  <p className="text-xs font-light opacity-50 leading-relaxed uppercase tracking-widest">Digital Registry <br /> Fingerprinting</p>
                </div>
                <div className="space-y-4">
                  <div className="text-4xl font-serif text-ojo-mustard">O.3</div>
                  <p className="text-xs font-light opacity-50 leading-relaxed uppercase tracking-widest">Village Guild <br /> Certification</p>
                </div>
              </motion.div>
              
              <button className="ojo-btn-primary bg-white text-ojo-charcoal hover:bg-ojo-mustard hover:text-white px-16">
                Read the Charter
              </button>
           </div>
           
           <div className="lg:col-span-6 relative">
             <motion.div 
                initial={{ rotate: 5, scale: 0.9, opacity: 0 }}
                whileInView={{ rotate: -2, scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative aspect-[3/4] rounded-[80px] overflow-hidden border-8 border-white/5 shadow-3xl shadow-black/80"
             >
                <img 
                  src="https://images.unsplash.com/photo-1590736962234-4537156942c1?q=80&w=2670&auto=format&fit=crop" 
                  className="w-full h-full object-cover"
                  alt="Artisanal Heritage"
                />
                <div className="absolute inset-0 bg-ojo-mustard/10 mix-blend-color" />
             </motion.div>
             
             {/* Decorative Stamp */}
             <motion.div 
              initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
              whileInView={{ opacity: 1, rotate: 12, scale: 1 }}
              className="absolute -bottom-10 -right-10 z-20 pointer-events-none"
             >
                <VerifiedBadge className="!w-48 !h-48 drop-shadow-2xl" />
             </motion.div>
             
             <div className="absolute -top-16 -left-16 animate-spin-slow opacity-30 pointer-events-none">
                <MotifTraditionalMandala size={350} color="#D4AF37" />
             </div>
           </div>
        </div>
      </section>

      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </div>
  );
}

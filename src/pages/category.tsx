import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api.ts";
import { VerifiedBadge } from "../components/brand.tsx";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Filter, X, Search, ShieldCheck } from "lucide-react";
import { MotifTraditionalRangoli } from "../components/motifs.tsx";
import { QuickViewModal } from "./home.tsx";

export function CategoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync filters with URL search params
  const query = searchParams.get("q")?.toLowerCase() || "";
  const originFilter = searchParams.get("origin") || "";
  const priceMax = parseInt(searchParams.get("maxPrice") || "100000");
  const verifiedOnly = searchParams.get("verified") === "true";

  useEffect(() => {
    api.get("/products")
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(p => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.origin.toLowerCase().includes(query);
      const matchesOrigin = !originFilter || p.origin === originFilter;
      const matchesPrice = p.price <= priceMax;
      const matchesVerified = !verifiedOnly || p.verified;
      return matchesQuery && matchesOrigin && matchesPrice && matchesVerified;
    });

    return [...filtered].sort((a, b) => {
      if (a.verified === b.verified) return 0;
      return a.verified ? -1 : 1;
    });
  }, [products, query, originFilter, priceMax, verifiedOnly]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const origins = useMemo(() => Array.from(new Set(products.map(p => p.origin))), [products]);

  const updateFilters = (key: string, value: string | number | boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "" || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-ojo-cream pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-ojo-stone pb-16">
          <div className="space-y-6">
             <div className="ojo-label text-ojo-mustard flex items-center gap-4">
               <div className="w-8 h-px bg-ojo-mustard/30" />
               EXPLORING THE REGISTRY
             </div>
             <h1 className="text-6xl md:text-8xl font-serif tracking-tight leading-none text-ojo-charcoal">
               {originFilter ? originFilter : "All Artifacts"}
             </h1>
             <p className="text-sm font-light opacity-60 max-w-md italic border-l-2 border-ojo-mustard/20 pl-6">
               Curating the sovereign collection of Indian heritage, verified for the modern collector.
             </p>
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
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 p-12 bg-white rounded-[60px] border border-ojo-stone shadow-xl mb-16 relative overflow-hidden">
                <div className="absolute inset-0 pattern-mandala opacity-[0.03] scale-125 pointer-events-none" />
                
                {/* Regional Origin Filter */}
                <div className="space-y-6 relative z-10">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40 italic">Regional Origin</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => updateFilters("origin", "")}
                      className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${originFilter === "" ? 'bg-ojo-charcoal text-white border-ojo-charcoal' : 'bg-ojo-cream border-ojo-stone/40 hover:border-ojo-mustard'}`}
                    >
                      All Regions
                    </button>
                    {origins.map(o => (
                      <button 
                        key={o}
                        onClick={() => updateFilters("origin", o)}
                        className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${originFilter === o ? 'bg-ojo-charcoal text-white border-ojo-charcoal' : 'bg-ojo-cream border-ojo-stone/40 hover:border-ojo-mustard'}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
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
                      onChange={(e) => updateFilters("maxPrice", e.target.value)}
                      className="w-full accent-ojo-mustard h-2 bg-ojo-stone/30 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-4 text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/20">
                      <span>Min</span>
                      <span>Mid</span>
                      <span>Max</span>
                    </div>
                  </div>
                </div>

                {/* Search & Verification */}
                <div className="space-y-8 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40 italic">Search Registry</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ojo-charcoal/20" size={16} />
                      <input 
                        type="text"
                        placeholder="Search Artifacts..."
                        value={query}
                        onChange={(e) => updateFilters("q", e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-ojo-cream/40 border border-ojo-stone/20 rounded-2xl text-xs focus:ring-1 focus:ring-ojo-mustard transition-all"
                      />
                    </div>
                  </div>
                  
                  <label className="flex items-center justify-between p-4 rounded-2xl bg-ojo-cream/40 border border-ojo-stone/20 cursor-pointer group hover:border-ojo-mustard transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-6 bg-ojo-stone/40 rounded-full relative transition-colors ${verifiedOnly ? 'bg-ojo-olive/20' : ''}`}>
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={verifiedOnly}
                          onChange={(e) => updateFilters("verified", e.target.checked)}
                        />
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${verifiedOnly ? 'left-5' : 'left-1'}`} />
                      </div>
                      <span className="text-xs font-bold text-ojo-charcoal/60 uppercase tracking-wider">Verified Only</span>
                    </div>
                    <ShieldCheck size={16} className={verifiedOnly ? 'text-ojo-mustard' : 'text-ojo-charcoal/20'} />
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div>
          {loading ? (
            <div className="h-[600px] flex items-center justify-center relative">
               <div className="absolute inset-0 pattern-mandala opacity-[0.03] animate-spin-slow scale-125" />
               <div className="w-16 h-16 border-2 border-ojo-mustard border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (idx % 4) * 0.1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="flex flex-col gap-6 group bg-white rounded-[44px] p-2 border border-transparent hover:border-ojo-stone/20 transition-all"
                    >
                      <div 
                        onClick={() => setQuickViewProduct(product)}
                        className="relative aspect-[4/5] rounded-[36px] overflow-hidden bg-ojo-stone/10 cursor-pointer"
                      >
                        <img 
                          src={JSON.parse(product.images || "[]")[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-ojo-charcoal/0 group-hover:bg-ojo-charcoal/20 transition-all flex items-center justify-center">
                          <button className="bg-white text-ojo-charcoal px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                            Quick View
                          </button>
                        </div>
                        
                        <div className="absolute top-6 right-6">
                           <VerifiedBadge className="scale-75 shadow-2xl" />
                        </div>
                        
                        <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
                          <span className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal">{product.origin}</span>
                        </div>
                      </div>

                      <div className="space-y-3 px-6 pb-6 relative">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1 flex-grow min-w-0">
                            <h4 className="font-serif text-xl leading-tight group-hover:text-ojo-terracotta transition-colors truncate tracking-tighter">
                              {product.name}
                            </h4>
                            <p className="text-[10px] font-medium text-ojo-charcoal/40 uppercase tracking-widest">{product.artisanName || "Master Artisan"}</p>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-lg font-serif text-ojo-charcoal leading-none">₹{product.price.toLocaleString()}</span>
                            <div className="w-6 h-[2px] bg-ojo-mustard mt-2 group-hover:w-full transition-all duration-700" />
                          </div>
                        </div>
                        <p className="text-[9px] font-light opacity-60 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.product_id || product.id}`);
                          }}
                          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-ojo-terracotta hover:text-ojo-mustard transition-colors pt-2"
                        >
                          View Detail <ArrowRight size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-40 text-center space-y-8 bg-white/40 rounded-[60px] border border-dashed border-ojo-stone">
                    <div className="w-32 h-32 bg-ojo-stone/10 rounded-full flex items-center justify-center mx-auto">
                      <Search size={48} className="text-ojo-mustard/40" />
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-serif text-5xl tracking-tighter">The Ledger is Silent</h4>
                      <p className="text-sm text-ojo-charcoal/40 max-w-sm mx-auto leading-relaxed font-light">
                        No matches found in our authenticated archives for these filters.
                      </p>
                      <button 
                        onClick={() => navigate("/category")}
                        className="mt-8 ojo-btn-primary mx-auto !bg-ojo-terracotta"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 pt-12">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-4 rounded-full border border-ojo-stone/40 bg-white/60 text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all disabled:opacity-30"
                  >
                    <ArrowRight size={20} className="rotate-180" />
                  </button>

                  <div className="flex items-center gap-3">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 rounded-[18px] text-[10px] font-black tracking-widest uppercase transition-all
                          ${currentPage === page ? 'bg-ojo-charcoal text-white shadow-2xl scale-110' : 'bg-white/40 backdrop-blur-md border border-ojo-stone/20 text-ojo-charcoal/40 hover:border-ojo-mustard'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-4 rounded-full border border-ojo-stone/40 bg-white/60 text-ojo-charcoal hover:bg-ojo-charcoal hover:text-white transition-all disabled:opacity-30"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
}

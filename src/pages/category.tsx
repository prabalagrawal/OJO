import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api.ts";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  Loader2,
  X,
  LayoutGrid,
  List,
  Award,
  Zap,
  TrendingUp,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { QuickViewModal } from "../components/quick-view-modal.tsx";
import { MotifSystem } from "../components/motifs.tsx";
import { PRODUCT_DATASET } from "../data/product-dataset";

const MOTIF_MAP: Record<string, any> = {
  "Kashmir": "sozni",
  "Rajasthan": "bagru",
  "Gujarat": "patola",
  "Tamil Nadu": "kolam",
  "Maharashtra": "warli",
  "Assam": "gond"
};

export function CategoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const itemsPerPage = 12;

  // Sync filters with URL search params
  const queryText = searchParams.get("q")?.toLowerCase() || "";
  const categoryFilter = searchParams.get("category") || "";
  const originFilter = searchParams.get("origin") || "";
  const priceMax = parseInt(searchParams.get("maxPrice") || "100000");
  const verifiedOnly = searchParams.get("verified") === "true";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const items = await api.get("/products");
      if (items && items.length > 0) {
        setProducts(items);
      } else {
        // Fallback to rich dataset
        setProducts(PRODUCT_DATASET.map(p => ({
          ...p,
          description: p.short_description,
          images: JSON.stringify([p.image]),
          verificationStatus: "VERIFIED",
          artisanName: "Master Artisan",
          story: "Heritage artifact verified by OJO Geographic nodes."
        })));
      }
    } catch (err) {
      // Fallback on error too
      setProducts(PRODUCT_DATASET.map(p => ({
        ...p,
        description: p.short_description,
        images: JSON.stringify([p.image]),
        verificationStatus: "VERIFIED",
        artisanName: "Master Artisan",
        story: "Heritage artifact verified by OJO Geographic nodes."
      })));
      toast.error("Registry connection lost. Using local archives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = p.name || "";
      const desc = p.description || "";
      const origin = p.origin || "";
      const cat = p.category || "";

      const matchesQuery = !queryText || 
        name.toLowerCase().includes(queryText) || 
        desc.toLowerCase().includes(queryText) || 
        origin.toLowerCase().includes(queryText);
      const matchesCategory = !categoryFilter || cat === categoryFilter;
      const matchesOrigin = !originFilter || origin === originFilter;
      const matchesPrice = (p.price || 0) <= priceMax;
      const matchesVerified = !verifiedOnly || p.verificationStatus === "VERIFIED";
      return matchesQuery && matchesCategory && matchesOrigin && matchesPrice && matchesVerified;
    }).sort((a, b) => {
      if (a.verificationStatus === b.verificationStatus) return 0;
      return a.verificationStatus === "VERIFIED" ? -1 : 1;
    });
  }, [products, queryText, categoryFilter, originFilter, priceMax, verifiedOnly]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const categories = ["Saree", "Handicraft", "Jewelry", "Tea", "Spice", "Art"];
  const origins = ["Kashmir", "Rajasthan", "Gujarat", "Tamil Nadu", "Maharashtra", "West Bengal", "Odisha"];

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
    toast.success(`${product.name} Added to Vault`);
  };

  return (
    <div className="min-h-screen bg-ojo-cream relative selection:bg-ojo-mustard selection:text-white">
      <AnimatePresence mode="wait">
        {originFilter && MOTIF_MAP[originFilter] && (
          <motion.div
            key={originFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 pointer-events-none z-0"
          >
            <MotifSystem type={MOTIF_MAP[originFilter]} opacity={0.05} scale={1.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="pt-40 md:pt-48 pb-20 px-8 md:px-20 bg-white border-b border-ojo-stone/10 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full opacity-10 pointer-events-none">
           <MotifSystem type="jaali" scale={1} opacity={1} />
        </div>
        
        <div className="max-w-[1800px] mx-auto space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="ojo-badge ojo-badge-verified !px-6">Sovereign Registry</div>
                 <div className="h-px w-20 bg-ojo-mustard/20" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Origin Nodes: {origins.length}</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif text-ojo-charcoal leading-none tracking-tighter">
                Geographic <br />
                <span className="text-ojo-mustard italic">Provenances.</span>
              </h1>
            </div>
            
            <div className="flex flex-col gap-8 w-full md:w-auto">
              <div className="relative group shadow-2xl rounded-full overflow-hidden">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-ojo-stone/40 group-focus-within:text-ojo-mustard" size={20} />
                <input 
                  type="text" 
                  placeholder="Search the Archive..."
                  value={queryText}
                  onChange={(e) => updateFilters("q", e.target.value)}
                  className="w-full md:w-[500px] border-none bg-ojo-cream/80 backdrop-blur-xl pl-20 pr-10 py-6 text-base italic outline-none"
                />
              </div>
              <div className="flex items-center gap-6 justify-end">
                <div className="flex p-2 bg-ojo-cream rounded-2xl border border-ojo-stone/10">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? 'bg-ojo-charcoal text-white shadow-xl' : 'text-ojo-charcoal/30'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-xl transition-all ${viewMode === "list" ? 'bg-ojo-charcoal text-white shadow-xl' : 'text-ojo-charcoal/30'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-charcoal/30 hover:text-ojo-charcoal flex items-center gap-2 group"
                >
                  <X size={14} className="group-hover:rotate-90 transition-transform" /> Clear Audit
                </button>
              </div>
            </div>
          </div>

          {/* New Modern Filter Strip */}
          <div className="flex flex-wrap items-center gap-10 pt-16 border-t border-ojo-mustard/10">
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-ojo-mustard/40">Categories</span>
              <div className="flex gap-3">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => updateFilters("category", cat)}
                    className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${categoryFilter === cat ? 'bg-ojo-mustard text-white shadow-premium scale-105' : 'bg-ojo-cream/50 text-ojo-charcoal/40 border border-ojo-stone/10 hover:bg-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-px h-10 bg-ojo-mustard/10 hidden lg:block" />

            <div className="flex items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-ojo-mustard/40">Territories</span>
              <div className="flex gap-3 overflow-x-auto no-scrollbar max-w-[400px]">
                {origins.map(origin => (
                  <button 
                    key={origin}
                    onClick={() => updateFilters("origin", origin)}
                    className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap transition-all ${originFilter === origin ? 'bg-ojo-charcoal text-white shadow-premium scale-105' : 'bg-ojo-cream/50 text-ojo-charcoal/40 border border-ojo-stone/10 hover:bg-white'}`}
                  >
                    {origin}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Product Discovery Grid */}
      <main className="py-24 px-8 md:px-20 max-w-[1800px] mx-auto min-h-[60vh]">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-64 gap-12">
                <div className="relative">
                  <Loader2 className="animate-spin text-ojo-mustard" size={64} strokeWidth={1} />
                  <MotifSystem type="kolam" opacity={0.1} scale={0.5} />
                </div>
                <div className="text-center space-y-4">
                   <p className="text-[12px] font-black uppercase tracking-[0.8em] text-ojo-charcoal/40 animate-pulse">Syncing with Regional Vaults</p>
                   <p className="text-sm italic text-ojo-mustard">Verifying provenance hash...</p>
                </div>
             </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-64 bg-white rounded-[5rem] border border-ojo-mustard/10 space-y-12 shadow-inner">
               <div className="relative w-32 h-32 mx-auto">
                 <Filter size={48} className="text-ojo-mustard/20 absolute inset-0 m-auto" />
                 <MotifSystem type="jaali" scale={0.4} opacity={0.1} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-5xl font-serif text-ojo-charcoal italic tracking-tighter">No Provenance Match.</h3>
                 <p className="text-lg text-ojo-charcoal/40 italic">Try relaxing your audit parameters or browsing all origins.</p>
               </div>
               <button onClick={() => setSearchParams(new URLSearchParams())} className="ojo-btn-primary !px-20 ring-4 ring-ojo-mustard/10">Reset Discovery</button>
            </div>
          ) : (
            <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24" : "flex flex-col gap-12"}`}>
               {paginatedProducts.map((p, idx) => {
                 const images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || "[]");
                 return viewMode === "grid" ? (
                   <motion.div 
                     key={p.id}
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: (idx % 4) * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                     className="group flex flex-col ojo-card-product overflow-hidden cursor-pointer"
                     onClick={() => setQuickViewProduct(p)}
                   >
                     <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-ojo-cream mb-10 group-hover:shadow-deep transition-all duration-700">
                       <div className="absolute inset-0 bg-ojo-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                       <img src={images[0]} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt="" referrerPolicy="no-referrer" />
                       
                       <div className="absolute top-10 left-10 z-20 flex flex-col gap-3">
                          <div className="ojo-badge !bg-white/90 backdrop-blur-3xl shadow-premium !px-6 !py-3">
                             <ShieldCheck size={14} className="inline mr-3 text-ojo-mustard" />
                             <span className="text-[10px] font-bold tracking-widest">{p.origin}</span>
                          </div>
                          {idx % 5 === 0 && (
                            <div className="ojo-badge !bg-ojo-mustard text-white shadow-xl !px-6">
                              <Zap size={12} className="inline mr-2" /> AUDIT PICK
                            </div>
                          )}
                       </div>
                       
                       <div className="absolute bottom-10 right-10 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-ojo-charcoal shadow-deep">
                             <TrendingUp size={24} />
                          </div>
                       </div>
                     </div>

                     <div className="space-y-6 px-6 relative z-10">
                        <div className="space-y-3">
                           <div className="flex justify-between items-baseline">
                              <h3 className="text-3xl font-serif text-ojo-charcoal italic tracking-tight">{p.name}</h3>
                              <div className="text-xl font-mono text-ojo-mustard font-bold italic tracking-tighter">₹{p.price?.toLocaleString()}</div>
                           </div>
                           <p className="text-sm text-ojo-charcoal/40 italic font-light line-clamp-2 leading-relaxed">"{p.story || p.description}"</p>
                        </div>
                        
                        <div className="pt-6 border-t border-ojo-mustard/10 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-ojo-cream border border-ojo-mustard/20 flex items-center justify-center text-ojo-mustard italic font-serif text-xs">
                                 {p.artisanName?.charAt(0) || "H"}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-charcoal/30">{p.artisanName || "Heritage Guild"}</span>
                           </div>
                           <div className="ojo-label-verified border-none bg-ojo-mustard/5 text-ojo-mustard px-4 !py-1 text-[8px]">SIGNED</div>
                        </div>
                     </div>
                   </motion.div>
                 ) : (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="ojo-card flex flex-col md:flex-row gap-16 p-10 items-center group cursor-pointer hover:ojo-texture-heritage transition-all duration-700"
                      onClick={() => setQuickViewProduct(p)}
                    >
                       <div className="w-64 h-80 rounded-[3rem] overflow-hidden bg-ojo-cream shrink-0 shadow-premium group-hover:shadow-deep transition-all">
                          <img src={images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-[1.5s]" alt="" />
                       </div>
                       <div className="flex-1 space-y-10">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                             <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                   <div className="ojo-badge ojo-badge-verified !px-8">{p.origin}</div>
                                   <div className="ojo-badge shadow-none border border-ojo-stone/10">{p.category}</div>
                                </div>
                                <h3 className="text-5xl font-serif text-ojo-charcoal italic tracking-tighter">{p.name}</h3>
                                <p className="text-xl text-ojo-charcoal/50 leading-relaxed font-sans font-light italic max-w-3xl">"{p.description}"</p>
                             </div>
                             <div className="text-right space-y-8 min-w-[200px]">
                                <div className="text-5xl font-mono text-ojo-charcoal tracking-tighter font-black italic">₹{p.price?.toLocaleString()}</div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(p);
                                  }}
                                  className="ojo-btn-primary w-full py-6 group overflow-hidden relative"
                                >
                                   <span className="relative z-10 flex items-center justify-center gap-4">
                                      Acquire Artifact <Award size={18} className="translate-all group-hover:rotate-12" />
                                   </span>
                                   <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2s]" />
                                </button>
                             </div>
                          </div>
                          <div className="flex gap-12 pt-10 border-t border-ojo-mustard/10 items-center">
                             <div className="flex items-center gap-4">
                                <ShieldCheck size={20} className="text-ojo-mustard" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40">Verified Registry Entry</span>
                             </div>
                             <div className="flex items-center gap-4">
                                <Star size={20} className="text-ojo-mustard" fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40">Heritage Score: 9.8</span>
                             </div>
                             <div className="flex items-center gap-4 ml-auto">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/20">Audit Reference: #OJO-{p.id.slice(0,6).toUpperCase()}</span>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 );
               })}
            </div>
          )}

          {/* Precision Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-12 pt-32">
              <button 
                disabled={currentPage === 1}
                onClick={() => updateFilters("page", (currentPage - 1).toString())}
                className="ojo-btn-outline !py-5 !px-10 disabled:opacity-30 group"
              >
                <ChevronRight size={20} className="rotate-180 inline mr-4 group-hover:-translate-x-2 transition-transform" /> 
                <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
              </button>
              
              <div className="flex gap-6">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => updateFilters("page", (i+1).toString())}
                    className={`w-14 h-14 rounded-full text-[12px] font-black transition-all ${currentPage === i + 1 ? 'bg-ojo-charcoal text-white shadow-deep scale-110' : 'bg-white border border-ojo-stone/10 text-ojo-charcoal/30 hover:ojo-texture-heritage hover:text-ojo-charcoal'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => updateFilters("page", (currentPage + 1).toString())}
                className="ojo-btn-outline !py-5 !px-10 disabled:opacity-30 group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Next</span>
                <ChevronRight size={20} className="inline ml-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}
      </main>

      {/* QUICK VIEW Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)} 
        onProductUpdate={(p) => setQuickViewProduct(p)}
        onAddToCart={addToCart}
      />
      
      {/* Decorative Footer Spacer */}
      <div className="h-40 relative overflow-hidden opacity-20">
         <MotifSystem type="kolam" scale={2} />
      </div>
    </div>
  );
}

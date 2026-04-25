import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query as firestoreQuery } from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
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
  List
} from "lucide-react";
import { toast } from "sonner";
import { QuickViewModal } from "../components/quick-view-modal.tsx";
import { MotifSystem } from "../components/motifs.tsx";

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
    const path = "products";
    try {
      const q = firestoreQuery(collection(db, path));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
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

  const categories = ["Tea", "Saree", "Handicraft", "Jewelry", "Spice"];
  const origins = ["Kashmir", "Rajasthan", "Gujarat", "Tamil Nadu", "Maharashtra", "Assam"];

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
    <div className="min-h-screen bg-ojo-cream relative">
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
            <MotifSystem type={MOTIF_MAP[originFilter]} opacity={0.03} scale={1.2} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Filter System */}
      <section className="pt-40 pb-20 px-6 md:px-12 bg-white relative overflow-hidden">
        <MotifSystem type="jaali" opacity={0.05} />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-6">
              <span className="ojo-label ojo-label-verified">The Sovereign Registry</span>
              <h1 className="text-4xl md:text-6xl font-serif text-ojo-charcoal leading-tight tracking-tighter">
                Browse <br />
                <span className="text-ojo-terracotta italic">Artifacts.</span>
              </h1>
            </div>
            
            <div className="flex flex-col gap-6 w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ojo-stone transition-colors group-focus-within:text-ojo-mustard" size={18} />
                <input 
                  type="text" 
                  placeholder="Search Registry..."
                  value={queryText}
                  onChange={(e) => updateFilters("q", e.target.value)}
                  className="w-full md:w-[400px] bg-ojo-cream/50 border border-ojo-stone/20 rounded-full pl-16 pr-8 py-5 text-sm outline-none focus:border-ojo-mustard transition-all shadow-xl"
                />
              </div>
              <div className="flex items-center gap-4 justify-end">
                <div className="flex p-1 bg-ojo-cream rounded-full border border-ojo-stone/10">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-full transition-all ${viewMode === "grid" ? 'bg-white shadow-md text-ojo-mustard' : 'text-ojo-charcoal/30'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full transition-all ${viewMode === "list" ? 'bg-white shadow-md text-ojo-mustard' : 'text-ojo-charcoal/30'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    const newParams = new URLSearchParams();
                    setSearchParams(newParams);
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 hover:text-ojo-charcoal flex items-center gap-2"
                >
                  <X size={14} /> Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4 pt-12 border-t border-ojo-stone/10 font-sans">
            <div className="flex items-center gap-4 border-r border-ojo-stone/10 pr-8 mr-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/30">Categories</span>
              <div className="flex gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => updateFilters("category", cat)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${categoryFilter === cat ? 'bg-ojo-mustard text-white shadow-lg' : 'bg-ojo-cream text-ojo-charcoal/40 hover:bg-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/30">Origins</span>
              <div className="flex gap-2">
                {origins.map(origin => (
                  <button 
                    key={origin}
                    onClick={() => updateFilters("origin", origin)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${originFilter === origin ? 'bg-ojo-terracotta text-white shadow-lg' : 'bg-ojo-cream text-ojo-charcoal/40 hover:bg-white'}`}
                  >
                    {origin}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="py-24 px-6 md:px-12 bg-ojo-cream relative">
        <div className="max-w-7xl mx-auto space-y-24">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-40 gap-6">
                <Loader2 className="animate-spin text-ojo-mustard" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/30">Auditing Artifacts...</p>
             </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-ojo-stone/20 space-y-8">
               <div className="w-20 h-20 bg-ojo-cream rounded-full flex items-center justify-center mx-auto">
                 <Filter size={32} className="text-ojo-stone" />
               </div>
               <h3 className="text-2xl font-serif text-ojo-charcoal italic opacity-30">No provenance match.</h3>
               <button onClick={() => setSearchParams(new URLSearchParams())} className="ojo-btn-primary">Clear Registry</button>
            </div>
          ) : (
            <div className={`${viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-24" : "flex flex-col gap-10"}`}>
               {paginatedProducts.map((p, idx) => {
                 const images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || "[]");
                 return viewMode === "grid" ? (
                   <motion.div 
                     key={p.id}
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ 
                       delay: (idx % 4) * 0.15,
                       duration: 0.8,
                       ease: [0.16, 1, 0.3, 1]
                     }}
                     className="group space-y-10"
                   >
                     <div 
                        className="relative aspect-[3.5/5] rounded-[3.5rem] overflow-hidden shadow-xl hover:shadow-4xl transition-all duration-700 hover:-translate-y-3 bg-white border border-ojo-stone/10 group cursor-pointer"
                        onClick={() => setQuickViewProduct(p)}
                     >
                       <div className="absolute inset-0 bg-ojo-mustard/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                       <img src={images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-110" alt="" referrerPolicy="no-referrer" />
                       <div className="absolute inset-0 bg-ojo-charcoal/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-20">
                          <button className="ojo-btn-primary translate-y-4 group-hover:translate-y-0 transition-all duration-700">Examine Record</button>
                       </div>
                       <div className="absolute top-8 left-8 z-30">
                         <span className="ojo-label-verified ojo-label backdrop-blur-2xl bg-white/90 text-ojo-charcoal border-white shadow-2xl">
                           <ShieldCheck size={10} className="inline mr-2 text-ojo-mustard" /> {p.origin}
                         </span>
                       </div>
                     </div>
                     <div className="text-center space-y-4 px-2">
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-mustard/60">{p.category}</span>
                           <h3 className="text-[15px] font-serif text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-tight italic">{p.name}</h3>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                           <div className="text-xl font-mono text-ojo-charcoal font-medium">₹{p.price?.toLocaleString()}</div>
                           <span className="text-[9px] font-bold uppercase tracking-widest text-ojo-charcoal/30 bg-ojo-cream px-3 py-1 rounded-full border border-ojo-stone/10">{p.artisanName || "Verified Heritage Cluster"}</span>
                        </div>
                     </div>
                   </motion.div>
                 ) : (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="ojo-card flex gap-12 group cursor-pointer hover:bg-white"
                      onClick={() => setQuickViewProduct(p)}
                    >
                       <div className="w-48 h-60 rounded-[2rem] overflow-hidden bg-ojo-cream shrink-0">
                          <img src={images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110 grayscale group-hover:grayscale-0 duration-700" alt="" />
                       </div>
                       <div className="flex-1 flex flex-col justify-center space-y-6">
                          <div className="flex justify-between items-start">
                             <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                  <span className="ojo-label ojo-label-verified bg-ojo-mustard/10 text-ojo-mustard">{p.origin}</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/30">{p.category}</span>
                               </div>
                               <h3 className="text-2xl font-serif text-ojo-charcoal">{p.name}</h3>
                               <p className="text-[14px] text-ojo-charcoal/60 leading-relaxed font-sans font-light italic max-w-xl">{p.description}</p>
                             </div>
                             <div className="text-right space-y-4">
                                <div className="text-xl font-mono text-ojo-charcoal">₹{p.price?.toLocaleString()}</div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(p);
                                  }}
                                  className="ojo-btn-primary"
                                >
                                   Acquire
                                </button>
                             </div>
                          </div>
                          <div className="flex gap-8 pt-6 border-t border-ojo-stone/10">
                             <div className="flex items-center gap-3">
                                <Star size={14} className="text-ojo-mustard" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Master: {p.artisanName || "Verified Guild"}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <ShieldCheck size={14} className="text-ojo-terracotta" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Sovereign Proof Audit Passed</span>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 );
               })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 pt-20 border-t border-ojo-stone/10">
              <button 
                disabled={currentPage === 1}
                onClick={() => updateFilters("page", (currentPage - 1).toString())}
                className="ojo-btn-outline !py-3 !px-6 disabled:opacity-30 flex items-center gap-2"
              >
                <ChevronRight size={14} className="rotate-180" /> Previous
              </button>
              <div className="flex gap-3">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => updateFilters("page", (i+1).toString())}
                    className={`w-10 h-10 rounded-full text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-ojo-charcoal text-white shadow-xl' : 'text-ojo-charcoal/40 hover:bg-white'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => updateFilters("page", (currentPage + 1).toString())}
                className="ojo-btn-outline !py-3 !px-6 disabled:opacity-30 flex items-center gap-2"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* QUICK VIEW Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)} 
        onAddToCart={addToCart}
      />
    </div>
  );
}

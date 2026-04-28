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
import { ProductCard } from "../components/ProductCard.tsx";
import { PRODUCT_DATASET } from "../data/product-dataset";

const MOTIF_MAP: Record<string, any> = {
  "Kashmir": "ajrakh",
  "Rajasthan": "ajrakh",
  "Gujarat": "ajrakh",
  "Tamil Nadu": "mandala",
  "Maharashtra": "mandala",
  "Assam": "kalamkari"
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
          story: "A genuine handcrafted piece, verified for authenticity."
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
        story: "A genuine handcrafted piece, verified for authenticity."
      })));
      toast.error("Failed to load products. Using local data.");
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
    toast.success(`${product.name} Added to Cart`);
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
            <MotifSystem type={MOTIF_MAP[originFilter]} opacity={0.08} scale={1.5} className="text-ojo-mustard" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="pt-32 md:pt-48 pb-12 md:pb-20 px-6 md:px-20 bg-white border-b border-ojo-stone/10 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full opacity-[0.03] pointer-events-none">
           <MotifSystem type="jaali" scale={1} opacity={1} />
        </div>
        
        <div className="max-w-[1800px] mx-auto space-y-10 md:space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 md:gap-4">
                 <div className="ojo-badge ojo-badge-verified !px-4 md:!px-6 text-[8px] md:text-[10px]">OJO Verified</div>
                 <div className="h-px w-12 md:w-20 bg-ojo-mustard/20" />
                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-ojo-mustard">Regions: {origins.length}</span>
              </div>
              <h1 className="text-4xl md:text-8xl font-serif text-ojo-charcoal leading-none tracking-tighter">
                Shop by <br className="hidden md:block" />
                <span className="text-ojo-mustard italic">Region.</span>
              </h1>
            </div>
            
            <div className="flex flex-col gap-6 md:gap-8 w-full md:w-auto">
              <div className="relative group shadow-lg md:shadow-2xl rounded-2xl md:rounded-full overflow-hidden">
                <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-ojo-stone/40 group-focus-within:text-ojo-mustard" size={18} />
                <input 
                  type="text" 
                  placeholder="Search item..."
                  value={queryText}
                  onChange={(e) => updateFilters("q", e.target.value)}
                  className="w-full md:w-[500px] border-none bg-ojo-cream/80 backdrop-blur-xl pl-16 md:pl-20 pr-8 py-5 md:py-6 text-sm md:text-base italic outline-none"
                />
              </div>
              <div className="flex items-center gap-6 justify-between md:justify-end">
                <div className="flex p-1.5 bg-ojo-cream rounded-xl md:rounded-2xl border border-ojo-stone/10">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all ${viewMode === "grid" ? 'bg-ojo-charcoal text-white shadow-lg' : 'text-ojo-charcoal/30'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all ${viewMode === "list" ? 'bg-ojo-charcoal text-white shadow-lg' : 'text-ojo-charcoal/30'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-ojo-charcoal/30 hover:text-ojo-charcoal flex items-center gap-2 group"
                >
                  <X size={12} className="group-hover:rotate-90 transition-transform" /> Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 pt-8 md:pt-16 border-t border-ojo-mustard/10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-ojo-mustard/40">Categories</span>
              <div className="flex gap-2.5 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => updateFilters("category", cat)}
                    className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black tracking-widest transition-all whitespace-nowrap active:scale-95 ${categoryFilter === cat ? 'bg-ojo-mustard text-white shadow-premium' : 'bg-ojo-cream/50 text-ojo-charcoal/40 border border-ojo-stone/10 hover:bg-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-ojo-mustard/40">Regions</span>
              <div className="flex gap-2.5 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                {origins.map(origin => (
                  <button 
                    key={origin}
                    onClick={() => updateFilters("origin", origin)}
                    className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black tracking-widest whitespace-nowrap transition-all active:scale-95 ${originFilter === origin ? 'bg-ojo-charcoal text-white shadow-premium' : 'bg-ojo-cream/50 text-ojo-charcoal/40 border border-ojo-stone/10 hover:bg-white'}`}
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
      <main className="py-24 px-8 md:px-20 max-w-[1800px] mx-auto min-h-[60vh] relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
             <MotifSystem type="jaali" scale={2} />
          </div>
          {loading ? (
             <div className="flex flex-col items-center justify-center py-64 gap-12">
                <div className="relative">
                   <Loader2 className="animate-spin text-ojo-mustard" size={64} strokeWidth={1} />
                   <div className="absolute inset-x-0 -bottom-4 opacity-30 text-ojo-mustard">
                      <MotifSystem type="mandala" scale={0.4} />
                   </div>
                </div>
                <div className="text-center space-y-4">
                   <p className="text-[12px] font-black uppercase tracking-[0.8em] text-ojo-charcoal/40 animate-pulse">Finding the finest products</p>
                   <p className="text-sm italic text-ojo-mustard">Checking authenticity...</p>
                </div>
             </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-64 bg-white rounded-[5rem] border border-ojo-mustard/10 space-y-12 shadow-inner">
               <div className="relative w-32 h-32 mx-auto">
                 <Filter size={48} className="text-ojo-mustard/20 absolute inset-0 m-auto" />
                 <MotifSystem type="jaali" scale={0.4} opacity={0.1} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-5xl font-serif text-ojo-charcoal italic tracking-tighter">No items found.</h3>
                 <p className="text-lg text-ojo-charcoal/40 italic">Try relaxing your filters or browsing all regions.</p>
               </div>
               <button onClick={() => setSearchParams(new URLSearchParams())} className="ojo-btn-primary !px-20 ring-4 ring-ojo-mustard/10">Clear All Filters</button>
            </div>
          ) : (
            <div className={`${viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-8 md:gap-y-24" : "flex flex-col gap-12"}`}>
               {paginatedProducts.map((p) => (
                 <ProductCard 
                   key={p.id} 
                   product={p as any} 
                   onClick={() => setQuickViewProduct(p)}
                 />
               ))}
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

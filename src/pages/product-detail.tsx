import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, limit, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  ShoppingCart,
  Heart,
  CheckCircle,
  Truck,
  RotateCcw,
  Share2,
  Lock,
  History,
  FileText,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { MotifSystem, PatternDivider, MandalaHalo } from "../components/motifs.tsx";
import { ProductCard } from "../components/Product/ProductCard";
import { ProductDetailSkeleton } from "../components/Product/ProductDetailSkeleton";
import { StickyAddToCart } from "../components/StickyAddToCart";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("provenance");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && id) {
        checkWishlist(u.uid, id);
      }
    });
    return () => unsub();
  }, [id]);

  const checkWishlist = async (uid: string, productId: string) => {
    try {
      const wishlistRef = doc(db, `users/${uid}/wishlist`, productId);
      const snap = await getDoc(wishlistRef);
      setIsInWishlist(snap.exists());
    } catch (err) {
      console.error("Error checking wishlist", err);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to save pieces to your wishlist", {
        action: {
          label: "Login",
          onClick: () => navigate("/login")
        }
      });
      return;
    }

    const path = `users/${user.uid}/wishlist/${id}`;
    try {
      const wishlistRef = doc(db, `users/${user.uid}/wishlist`, id!);
      if (isInWishlist) {
        await deleteDoc(wishlistRef);
        setIsInWishlist(false);
        toast.success("Removed from Wishlist");
      } else {
        await setDoc(wishlistRef, {
          productId: id,
          addedAt: new Date().toISOString(),
          name: product.name,
          price: product.price,
          image: images[0]
        });
        setIsInWishlist(true);
        toast.success("Added to Wishlist");
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Try Express Backend first
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const p = await response.json();
          setProduct(p);
          if (p.availableColors?.length > 0) setSelectedColor(p.availableColors[0]);
          if (p.availableSizes?.length > 0) setSelectedSize(p.availableSizes[0]);
          
          // Try to fetch related from backend
          const relRes = await fetch("/api/products");
          if (relRes.ok) {
            const all = await relRes.json();
            setRelatedProducts(all.filter((item: any) => item.id !== id).slice(0, 4));
          }
          return;
        }

        // Fallback to Firebase
        const docRef = doc(db, "products", id!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const p = { id: docSnap.id, ...docSnap.data() } as any;
          setProduct(p);
          if (p.availableColors?.length > 0) setSelectedColor(p.availableColors[0]);
          if (p.availableSizes?.length > 0) setSelectedSize(p.availableSizes[0]);
          
          const qRelated = query(
            collection(db, 'products'), 
            where("category", "==", (p as any).category), 
            limit(5)
          );
          const relatedSnap = await getDocs(qRelated);
          setRelatedProducts(relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(d => d.id !== id)
          );
        } else {
          toast.error("Product not found");
          navigate("/");
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      // Track recently viewed
      localStorage.setItem("ojo_last_viewed", JSON.stringify({ 
        id, 
        timestamp: Date.now() 
      }));
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const addToCart = (silent = false) => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]");
    
    const existing = cart.find((i: any) => 
      i.productId === product.id && 
      JSON.stringify(i.options || {}) === JSON.stringify({ color: selectedColor, size: selectedSize })
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: displayedPrice,
        image: selectedColor?.image || images[0],
        quantity: 1,
        origin: product.origin,
        options: { color: selectedColor, size: selectedSize }
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cartUpdated"));
    if (!silent) toast.success("Added to Cart");
  };

  const buyNow = () => {
    addToCart(true);
    navigate("/checkout");
  };

  if (loading) return <ProductDetailSkeleton />;

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]");

  const AccordionItem = ({ id: accId, title, icon: Icon, children }: any) => (
    <div className="border-b border-ojo-stone/20">
      <button 
        onClick={() => setActiveAccordion(activeAccordion === accId ? null : accId)}
        className="w-full py-8 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl transition-colors ${activeAccordion === accId ? 'bg-ojo-mustard text-white' : 'bg-ojo-stone/10 text-ojo-charcoal/40 group-hover:text-ojo-charcoal'}`}>
            <Icon size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        </div>
        {activeAccordion === accId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {activeAccordion === accId && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-16 text-sm text-ojo-charcoal/60 leading-relaxed font-sans font-light italic">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const displayedPrice = selectedColor?.price || product.price;

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Product Progress Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ojo-stone/10 px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-ojo-charcoal/40 hover:text-ojo-charcoal transition-colors">
          <ArrowLeft size={14} /> Back to Collection
        </button>
        <div className="flex items-center gap-6">
          <button className="p-2 hover:bg-ojo-charcoal/5 rounded-full"><Share2 size={18} /></button>
          <div className="h-6 w-px bg-ojo-stone/20" />
          <div className="text-[9px] font-black uppercase tracking-widest text-ojo-mustard flex items-center gap-2">
            <Lock size={12} /> Secure Checkout
          </div>
        </div>
      </nav>

      {/* LEVEL 1: Visual & Core Info */}
      <div className="max-w-7xl mx-auto px-6 pt-32 grid md:grid-cols-2 gap-20">
        <div className="space-y-8">
          <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-premium group bg-ojo-cream/50">
             <MandalaHalo className="text-ojo-mustard opacity-20 scale-150" scale={1.5} />
             <img 
               src={selectedColor?.image || images[activeImage]} 
               alt={product.name} 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 relative z-10"
               referrerPolicy="no-referrer"
             />
             <div className="absolute top-10 left-10 z-20">
               <span className="ojo-label ojo-label-verified bg-white/90 backdrop-blur-md shadow-2xl">
                 <ShieldCheck size={12} className="inline mr-2" /> Verified Authenticity
               </span>
             </div>
          </div>
          <div className="flex gap-4 scrollbar-hide overflow-x-auto pb-4">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-24 h-24 rounded-3xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-ojo-mustard scale-105' : 'border-ojo-stone/20 grayscale opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-12 relative">
          <div className="absolute -top-10 -right-20 opacity-[0.05] text-ojo-mustard w-64 h-64 pointer-events-none">
             <MotifSystem type="mandala" variant="single" scale={1.2} />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 text-ojo-terracotta">
              <MapPin size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{product.origin} Cluster</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif text-ojo-charcoal leading-[0.9] tracking-tighter">
              {product.name}
            </h1>
            <p className="text-lg text-ojo-charcoal/60 leading-relaxed font-sans font-light italic">
              {product.description}
            </p>

            {/* Customization Options */}
            <div className="space-y-8 pt-4">
              {product.availableColors && product.availableColors.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-charcoal/40">Select Hue</span>
                  <div className="flex gap-4">
                    {product.availableColors.map((color: any) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative w-10 h-10 rounded-full border-2 transition-all p-1 ${
                          selectedColor?.name === color.name ? 'border-ojo-terracotta scale-110 shadow-lg ring-2 ring-ojo-terracotta/20 ring-offset-2' : 'border-transparent hover:border-ojo-charcoal/20'
                        }`}
                      >
                        <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                        <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-widest transition-opacity ${selectedColor?.name === color.name ? 'opacity-100' : 'opacity-0'}`}>
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-charcoal/40">Select Dimension</span>
                  <div className="relative max-w-xs">
                    <select 
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full appearance-none bg-ojo-beige/20 border border-ojo-charcoal/10 rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-ojo-terracotta outline-none transition-all cursor-pointer"
                    >
                      {product.availableSizes.map((size: string) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" size={14} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-end gap-4">
              <span className="text-4xl font-mono font-medium text-ojo-charcoal">₹{displayedPrice?.toLocaleString()}</span>
              <span className="text-[10px] text-ojo-charcoal/30 uppercase font-black tracking-widest mb-2 font-sans">Inclusive of all taxes</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={buyNow}
                className="w-full bg-ojo-charcoal text-white py-6 text-[12px] font-black uppercase tracking-[0.4em] hover:bg-ojo-terracotta transition-all rounded-xl shadow-xl shadow-ojo-charcoal/10"
              >
                Buy Now — ₹{displayedPrice?.toLocaleString()}
              </button>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart()}
                  className="ojo-btn-outline flex-1 flex items-center justify-center gap-3 !py-5"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button className="ojo-btn-outline !py-5 px-10">
                  Inquire
                </button>
              </div>
            </div>

            <button 
              onClick={toggleWishlist}
              className={`w-full py-5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-xl border ${
                isInWishlist 
                  ? 'bg-ojo-terracotta/10 border-ojo-terracotta text-ojo-terracotta' 
                  : 'bg-white border-ojo-charcoal/10 text-ojo-charcoal/60 hover:border-ojo-charcoal hover:text-ojo-charcoal'
              }`}
            >
              <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
              {isInWishlist ? "Saved in Collection" : "Add to Wishlist"}
            </button>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-ojo-stone/10 font-sans">
              <div className="flex gap-4">
                <Truck size={20} className="text-ojo-charcoal/40" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest">Secure Shipping</p>
                  <p className="text-[10px] text-ojo-charcoal/60">Handled with care</p>
                </div>
              </div>
              <div className="flex gap-4">
                <RotateCcw size={20} className="text-ojo-charcoal/40" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest">Easy Returns</p>
                  <p className="text-[10px] text-ojo-charcoal/60">7-day return window</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PatternDivider />

      {/* LEVEL 2: Layered Details */}
      <div className="max-w-4xl mx-auto px-6 mt-40">
        <div className="space-y-4 mb-20 text-center">
          <span className="ojo-label ojo-label-verified">Product Details</span>
          <h2 className="text-4xl font-serif italic">Origin & Story</h2>
        </div>

        <div className="space-y-2">
          <AccordionItem id="provenance" title="Origin & Authenticity" icon={FileText}>
            This product was handcrafted in {product.origin}. We work directly 
            with artisan clusters to ensure every piece is genuine and reflects 
            the true heritage of the region.
          </AccordionItem>
          <AccordionItem id="maker" title="About the Artisan" icon={UserCheck}>
            Created by {product.artisanName || "a Master Artisan"}. They are part of a 
            community that has preserved these traditional techniques for generations. 
          </AccordionItem>
          <AccordionItem id="story" title="The Story" icon={History}>
            {product.story || "A tale of tradition and time. This product represents the rich history of Indian craftsmanship and the soul of the community that created it."}
          </AccordionItem>
          <AccordionItem id="logistics" title="Shipping Information" icon={Truck}>
            Every item is packed with extreme care to ensure it reaches you safely. 
            Delivery usually takes within 12 business days.
          </AccordionItem>
        </div>
      </div>

      <PatternDivider />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-40 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <h2 className="text-4xl font-serif italic text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {relatedProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p as any} 
                  onQuickView={() => navigate(`/product/${p.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <StickyAddToCart product={product} />
    </div>
  );
}

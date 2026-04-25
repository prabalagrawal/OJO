import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  ShoppingCart,
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
import { MotifSystem } from "../components/motifs.tsx";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("provenance");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const path = `products/${id}`;
      try {
        const docRef = doc(db, "products", id!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const p = { id: docSnap.id, ...docSnap.data() };
          setProduct(p);
          
          // Fetch related
          const relatedPath = 'products';
          const qRelated = query(
            collection(db, relatedPath), 
            where("category", "==", (p as any).category), 
            limit(5)
          );
          const relatedSnap = await getDocs(qRelated);
          setRelatedProducts(relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(d => d.id !== id)
          );
        } else {
          toast.error("Artifact not found in registry");
          navigate("/");
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const addToCart = () => {
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
    toast.success("Artifact Added to Collection Vault");
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 border-4 border-ojo-stone/20 border-t-ojo-mustard rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-stone">Auditing Provenance Keys...</p>
      </div>
    </div>
  );

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

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Product Progress Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ojo-stone/10 px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-ojo-charcoal/40 hover:text-ojo-charcoal transition-colors">
          <ArrowLeft size={14} /> Return to Gallery
        </button>
        <div className="flex items-center gap-6">
          <button className="p-2 hover:bg-ojo-charcoal/5 rounded-full"><Share2 size={18} /></button>
          <div className="h-6 w-px bg-ojo-stone/20" />
          <div className="text-[9px] font-black uppercase tracking-widest text-ojo-mustard flex items-center gap-2">
            <Lock size={12} /> Encrypted Purchase
          </div>
        </div>
      </nav>

      {/* LEVEL 1: Visual & Core Info */}
      <div className="max-w-7xl mx-auto px-6 pt-32 grid md:grid-cols-2 gap-20">
        <div className="space-y-8">
          <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-4xl group">
             <img 
               src={images[activeImage]} 
               alt={product.name} 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               referrerPolicy="no-referrer"
             />
             <div className="absolute top-10 left-10">
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

        <div className="flex flex-col justify-center space-y-12">
          <div className="space-y-6">
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
          </div>

          <div className="space-y-10">
            <div className="flex items-end gap-4">
              <span className="text-4xl font-mono font-medium text-ojo-charcoal">₹{product.price?.toLocaleString()}</span>
              <span className="text-[10px] text-ojo-charcoal/30 uppercase font-black tracking-widest mb-2 font-sans">Inc. Heritage Premium</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={addToCart}
                className="ojo-btn-primary flex-1 flex items-center justify-center gap-3 !py-6"
              >
                <ShoppingCart size={18} /> Initiate Acquisition
              </button>
              <button className="ojo-btn-outline !py-6">
                Inquire
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-ojo-stone/10 font-sans">
              <div className="flex gap-4">
                <Truck size={20} className="text-ojo-charcoal/40" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest">Insured Transit</p>
                  <p className="text-[10px] text-ojo-charcoal/60">Museum-grade courier</p>
                </div>
              </div>
              <div className="flex gap-4">
                <RotateCcw size={20} className="text-ojo-charcoal/40" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest">Exchange Trust</p>
                  <p className="text-[10px] text-ojo-charcoal/60">7-day audit period</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 2: Layered Details */}
      <div className="max-w-4xl mx-auto px-6 mt-40">
        <div className="space-y-4 mb-20 text-center">
          <span className="ojo-label ojo-label-verified">Artifact Intelligence</span>
          <h2 className="text-4xl font-serif italic">Provenance & Custody</h2>
        </div>

        <div className="space-y-2">
          <AccordionItem id="provenance" title="Provenance Report" icon={FileText}>
            This artifact's journey began in the {product.origin} region. Our field auditors have verified 
            the raw material purity and established a direct custody link 
            between the artisan cluster and our center. A digital certificate of ownership will be 
            issued upon delivery.
          </AccordionItem>
          <AccordionItem id="maker" title="The Master Hand" icon={UserCheck}>
            Created by {product.artisanName || "a Master Artisan Guild"}. This maker represents the 
            lineage of their craft heritage, specializing in techniques that pre-date modern machinery. 
          </AccordionItem>
          <AccordionItem id="story" title="Cultural Context" icon={History}>
            {product.story || "A tale of tradition and time. This artifact represents a movement in Indian history where craft was considered a form of prayer."}
          </AccordionItem>
          <AccordionItem id="logistics" title="Transit Protocol" icon={Truck}>
            Artifacts of this grade require temperature-controlled handling. 
            Arrival estimated within 12 business days under insured transit.
          </AccordionItem>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-40 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <h2 className="text-4xl font-serif italic text-center">Related Artifacts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {relatedProducts.map((p) => {
                const pImages = Array.isArray(p.images) ? p.images : JSON.parse(p.images || "[]");
                return (
                  <motion.div 
                    key={p.id} 
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="group cursor-pointer space-y-6"
                  >
                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl bg-ojo-cream group-hover:shadow-4xl transition-all duration-700 hover:-translate-y-2">
                       <img src={pImages[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-serif text-ojo-charcoal leading-tight">{p.name}</h3>
                      <div className="text-sm font-mono text-ojo-terracotta">₹{p.price?.toLocaleString()}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

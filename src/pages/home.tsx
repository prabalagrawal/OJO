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
  Zap,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotifSystem, PatternDivider } from "../components/motifs.tsx";
import { OjoLogo } from "../components/brand.tsx";
import { IndiaExplorer, StateDrawer } from "../components/india-map.tsx";
import { QuickViewModal } from "../components/quick-view-modal.tsx";
import { toast } from "sonner";
import { PRODUCT_DATASET, Product } from "../data/product-dataset";

const DECISION_TAGS = ["Most Trusted", "Best for Gifting", "Premium Pick", "Masterpiece"];

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

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
        const items = PRODUCT_DATASET.slice(0, 12).map((p, i) => ({
          ...p,
          description: p.short_description,
          images: JSON.stringify([p.image]),
          artisanName: "Master Artisan",
          decisionTag: DECISION_TAGS[i % DECISION_TAGS.length],
          story: "Each piece is hand-crafted using heritage methods passed down through generations."
        })) as any;
        setProducts(items);
        setRecommendedProducts([...PRODUCT_DATASET].sort(() => 0.5 - Math.random()).slice(0, 6));
      } catch (err) {
        toast.error("Failed to load cultural archives.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-ojo-cream selection:bg-ojo-mustard selection:text-white overflow-x-hidden">
      {/* 1. HERO: EDITORIAL ENTRY POINT */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-ojo-cream p-6 md:p-12">
        <div className="absolute inset-x-0 top-0 h-full opacity-5 pointer-events-none">
           <MotifSystem type="jaali" scale={2} opacity={1} />
        </div>
        
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl aspect-[16/10] md:aspect-[21/9] flex items-center justify-center overflow-hidden shadow-deep rounded-[10rem] md:rounded-[20rem] rounded-b-[2rem] md:rounded-b-[4rem]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" 
               alt="Editorial Heritage" 
               className="w-full h-full object-cover grayscale-[0.2]"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-ojo-charcoal/40 mix-blend-multiply" />
             <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/80 via-ojo-charcoal/20 to-transparent" />
          </div>

          <div className="relative z-20 text-center space-y-12 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-5xl md:text-[64px] font-serif text-ojo-cream leading-tight tracking-tighter max-w-4xl mx-auto">
                India’s Authentic <br />
                <span className="italic">Products. Verified.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-ojo-cream/80 max-w-2xl mx-auto font-light italic leading-relaxed">
                Direct access to India’s master artisans. <br className="hidden md:block" />
                Authored by geography. Verified by OJO.
              </p>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })}
              className="ojo-btn-primary !bg-ojo-mustard !text-ojo-charcoal group"
            >
               Explore India ↓
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* 2. INDIA EXPLORER: CORE INTERACTION */}
      <section id="explorer" className="py-32 px-6 md:px-12 bg-ojo-cream">
        <div className="max-w-[1800px] mx-auto space-y-16">
          <div className="text-center space-y-4">
             <span className="ojo-badge ojo-badge-verified">Provenance Registry</span>
             <h2 className="text-4xl md:text-5xl font-serif italic text-ojo-charcoal tracking-tighter">The Living Map.</h2>
          </div>
          <IndiaExplorer onStateClick={(state) => setSelectedState(state)} />
        </div>
      </section>

      <PatternDivider type="warli" />

      {/* 3. FEATURED CULTURAL STORY: EMOTIONAL ANCHOR */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-ojo-charcoal">
         <div className="absolute inset-0 opacity-20 group">
            <img 
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" 
              alt="Artisan Story"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-ojo-charcoal/60" />
         </div>
         
         <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl space-y-12"
            >
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ojo-mustard">The Human Dossier</span>
               <h2 className="text-6xl md:text-8xl font-serif italic text-white leading-none tracking-tighter">
                  Every stitch <br />
                  is a signature.
               </h2>
               <p className="text-xl md:text-2xl text-white/60 font-light italic leading-snug">
                  "Heritage is not just a legacy preserved in archives; it is lived on the artisan's loom every single dawn."
               </p>
               <button onClick={() => navigate("/category")} className="ojo-btn-primary !px-16 !py-6">Discover The Origin Stories</button>
            </motion.div>
         </div>
      </section>

      <PatternDivider type="ajrakh" />

      {/* 4. PRODUCT DISCOVERY: ASYMMETRICAL GRID */}
      <section className="py-40 px-6 md:px-20 bg-ojo-cream relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto space-y-32 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-ojo-mustard/10 pb-16">
            <div className="space-y-6">
              <span className="ojo-badge ojo-badge-verified">Active Registry</span>
              <h2 className="text-5xl md:text-7xl font-serif text-ojo-charcoal tracking-tighter leading-none italic">Provenance Archive.</h2>
            </div>
            <p className="max-w-md text-[17px] text-ojo-charcoal/50 italic font-light leading-relaxed">
              Curated collectibles verified by regional mastery. Explore artifacts that define centuries of craft command.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8 md:gap-16">
             {products.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 onClick={() => setQuickViewProduct(products[0])}
                 className="col-span-12 lg:col-span-8 group cursor-pointer relative aspect-[16/10] overflow-hidden shadow-premium hover:shadow-deep transition-all duration-1000 rounded-[8rem] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem]"
               >
                  <img 
                    src={JSON.parse(products[0].images)[0]} 
                    className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-105" 
                    alt={products[0].name} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal/90 via-ojo-charcoal/20 to-transparent" />
                  <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                     <div className="space-y-4">
                        <span className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none">PREMIUM MASTERPIECE</span>
                        <h3 className="text-4xl md:text-6xl font-serif text-white italic">{products[0].name}</h3>
                        <p className="text-lg text-white/60 italic font-light max-w-lg">{products[0].story}</p>
                     </div>
                     <div className="text-right space-y-4">
                        <div className="text-4xl font-mono text-ojo-mustard italic font-black">₹{products[0].price.toLocaleString()}</div>
                        <button className="ojo-btn-primary !px-10 !py-4 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-700">Access Record</button>
                     </div>
                  </div>
               </motion.div>
             )}

             {products.slice(1, 7).map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setQuickViewProduct(p)}
                  className={`col-span-12 md:col-span-4 group cursor-pointer space-y-6 ${i % 2 === 0 ? 'md:mt-12' : ''}`}
                >
                   <div className="aspect-[4/5] relative overflow-hidden shadow-premium group-hover:shadow-deep transition-all duration-700 bg-white rounded-[4rem] rounded-tr-[1.2rem] rounded-br-[1.2rem] rounded-bl-[1.2rem]">
                      <img 
                        src={JSON.parse(p.images)[0]} 
                        className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110" 
                        alt={p.name}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <div className="ojo-badge ojo-badge-verified !bg-white/90">GI VERIFIED</div>
                         <div className="ojo-badge !bg-ojo-charcoal !text-white !border-none">{p.origin.toUpperCase()}</div>
                      </div>
                      <div className="absolute inset-0 bg-ojo-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="space-y-2 px-2">
                      <div className="flex justify-between items-baseline">
                         <h4 className="text-xl font-serif italic text-ojo-charcoal group-hover:text-ojo-mustard transition-colors">{p.name}</h4>
                         <span className="text-sm font-mono text-ojo-mustard font-bold italic">₹{p.price.toLocaleString()}</span>
                      </div>
                      <p className="text-[12px] text-ojo-charcoal/40 font-light italic leading-tight">{p.description}</p>
                   </div>
                </motion.div>
             ))}
          </div>

          <div className="text-center pt-20">
             <button onClick={() => navigate("/category")} className="ojo-btn-outline !px-24 !py-10 group">
                Access Complete Registry <ArrowRight size={18} className="ml-4 transition-transform group-hover:translate-x-4" />
             </button>
          </div>
        </div>
      </section>

      {/* 5. TRUST SECTION: HIGH CONTRAST */}
      <section className="py-48 bg-ojo-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
           <MotifSystem type="jaali" scale={2} opacity={1} />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-24">
           <div className="space-y-12 max-w-4xl mx-auto">
              <span className="ojo-badge !bg-white/10 !text-white !border-white/20 px-12">The Sovereign Protocol</span>
              <h2 className="text-7xl md:text-[10rem] font-serif italic text-ojo-mustard leading-[0.8] tracking-tighter">
                 Trust is a <br />
                 <span className="text-white">Physical Act.</span>
              </h2>
              <p className="text-2xl text-white/40 leading-snug font-light italic pt-8">
                 We eliminate the authenticity gap through three layers of sovereign audit and permanent Geographic DNA.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: <Award className="text-ojo-mustard" />, title: "GI Tagged", desc: "Geographical Indication guarantees the precise origin and technique heritage." },
                { icon: <ShieldCheck className="text-ojo-mustard" />, title: "Verified Artisans", desc: "Direct cluster audits ensure master-level command and ethical compensation." },
                { icon: <Globe className="text-ojo-mustard" />, title: "Quality Chain", desc: "Permanent QR logs track every record from the loom to your local vault." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="p-12 bg-white/5 border border-white/10 rounded-[4rem] space-y-8 hover:bg-white/10 transition-all duration-700 group"
                >
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-ojo-mustard group-hover:text-ojo-charcoal transition-all">
                      {item.icon}
                   </div>
                   <div className="space-y-4 text-left">
                      <h4 className="text-3xl font-serif italic text-white">{item.title}</h4>
                      <p className="text-white/40 font-light italic leading-relaxed text-[17px]">{item.desc}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. RECOMMENDATION LAYER: YOU MAY ALSO LIKE */}
      <section className="py-40 px-6 md:px-20 bg-ojo-cream">
        <div className="max-w-[1800px] mx-auto space-y-20">
          <div className="flex justify-between items-baseline border-b border-ojo-mustard/10 pb-8">
             <h3 className="text-4xl md:text-5xl font-serif italic text-ojo-charcoal tracking-tighter">You may also like.</h3>
             <button onClick={() => navigate("/category")} className="text-[11px] font-black uppercase tracking-widest text-ojo-mustard hover:text-ojo-charcoal transition-colors">See Similar Records</button>
          </div>
          
          <div className="flex gap-12 overflow-x-auto pb-12 scrollbar-hide">
             {recommendedProducts.map((p, i) => (
                <motion.div 
                  key={p.id}
                  whileHover={{ y: -10 }}
                  onClick={() => setQuickViewProduct(p)}
                  className="min-w-[300px] md:min-w-[400px] space-y-6 group cursor-pointer"
                >
                   <div className="aspect-[4/5] relative overflow-hidden shadow-premium group-hover:shadow-deep transition-all duration-700 bg-white rounded-[3rem] rounded-tr-[1rem] rounded-br-[1rem] rounded-bl-[1rem]">
                      <img 
                        src={p.image} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000" 
                        alt={p.name}
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="px-2">
                      <h4 className="text-2xl font-serif italic text-ojo-charcoal">{p.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 italic">{p.origin}</span>
                         <span className="text-lg font-mono text-ojo-mustard font-black">₹{p.price.toLocaleString()}</span>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER: REFINED CLOSURE */}
      <footer className="py-48 bg-ojo-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
           <MotifSystem type="kalamkari" scale={2} />
        </div>
        <div className="max-w-[1800px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-24 relative z-10">
           <div className="col-span-2 space-y-12">
              <OjoLogo size="md" />
              <p className="text-3xl text-white/40 font-light italic max-w-md leading-tight">
                 Establishing the definitive <br />
                 Indian cultural exchange.
              </p>
           </div>
           
           <div className="space-y-12">
              <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-ojo-mustard">Registry Nodes</h4>
              <ul className="space-y-6">
                 {["Artisan Directory", "Origin Logs", "GI Certificates", "Trust Protocol"].map(item => (
                   <li key={item}><button className="text-3xl font-serif italic text-white/50 hover:text-white transition-colors">{item}</button></li>
                 ))}
              </ul>
           </div>

           <div className="space-y-12 text-right">
              <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-ojo-mustard">OJO Headquarters</h4>
              <p className="text-xl text-white/40 font-mono italic leading-relaxed">
                 Vault 001, Heritage District <br />
                 IND / 110001
              </p>
              <div className="flex justify-end gap-8 pt-8">
                 <Globe className="text-ojo-mustard opacity-50" size={24} />
                 <Lock className="text-ojo-mustard opacity-50" size={24} />
                 <ShieldCheck className="text-ojo-mustard opacity-50" size={24} />
              </div>
           </div>
        </div>

        <div className="max-w-[1800px] mx-auto px-8 mt-48 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20">© 2026 OJO SOVEREIGN TRUST. ALL RECORDS AUDITED.</p>
           <div className="flex gap-12">
              {["Vault Terms", "Provenance Policy", "Audit Logs"].map(item => (
                <button key={item} className="text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-white transition-colors">{item}</button>
              ))}
           </div>
        </div>
      </footer>

      <StateDrawer 
        state={selectedState} 
        isOpen={!!selectedState} 
        onClose={() => setSelectedState(null)} 
        products={PRODUCT_DATASET.filter(p => p.origin === selectedState?.id).map(p => ({
          ...p,
          images: JSON.stringify([p.image])
        }))}
      />

      <QuickViewModal 
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onProductUpdate={(p) => setQuickViewProduct(p)}
        onAddToCart={(p) => {
          addItem(p);
          toast.success("Record Secured", {
            description: `${p.name} has been added to your vault repository.`
          });
        }}
      />
    </div>
  );
}

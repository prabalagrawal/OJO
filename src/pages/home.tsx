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
      {/* 1. HERO: CINEMATIC ENTRY */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-ojo-cream">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" 
            alt="Editorial Heritage" 
            className="w-full h-full object-cover grayscale-[0.3]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-ojo-charcoal/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-ojo-charcoal/40 via-transparent to-ojo-cream" />
        </motion.div>

        <div className="relative z-10 text-center space-y-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <OjoLogo size="lg" className="mx-auto mb-12 opacity-80" />
            <h1 className="text-6xl md:text-[84px] font-serif text-white leading-[0.9] tracking-tighter max-w-5xl mx-auto italic">
              India’s Authentic <br className="hidden md:block" />
              <span className="text-ojo-mustard">Products. Verified.</span>
            </h1>
            <p className="mt-10 text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light italic">
              Discover India’s authentic products by origin — from crafts and textiles to tea, spices, and more.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-white/50">
               <ShieldCheck size={18} className="text-ojo-mustard" />
               <span className="text-sm font-medium tracking-wide uppercase">Every product is verified at source, ensuring authenticity, quality, and trust.</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-8"
          >
            <button 
              onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })}
              className="ojo-btn-primary !px-20 !py-8 !bg-ojo-mustard !text-ojo-charcoal hover:!bg-white group transition-all"
            >
              Explore the Map ↓
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-ojo-charcoal">Scroll to Begin</span>
          <div className="w-[1px] h-20 bg-ojo-charcoal" />
        </div>
      </section>

      {/* 2. INDIA EXPLORER: SIGNATURE INTERACTION */}
      <section id="explorer" className="min-h-screen py-20 flex flex-col justify-center bg-ojo-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
           <MotifSystem type="jaali" scale={4} opacity={1} />
        </div>
        <div className="w-full px-4 md:px-0 space-y-12 relative z-10">
          <div className="text-center space-y-4">
             <span className="ojo-badge ojo-badge-verified">SIGNATURE EXPERIENCE</span>
             <h3 className="text-4xl md:text-7xl font-serif italic text-ojo-charcoal tracking-tighter">Discover by Origin.</h3>
             <p className="text-ojo-charcoal/40 font-light italic text-lg max-w-xl mx-auto">Click any state to audit its verified cultural records.</p>
          </div>
          <div className="relative w-full max-w-[1920px] mx-auto">
            <IndiaExplorer onStateClick={(state) => setSelectedState(state)} />
          </div>
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
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ojo-mustard">The Sovereign Narrative</span>
               <h2 className="text-6xl md:text-8xl font-serif italic text-white leading-none tracking-tighter">
                  From the deserts <br />
                  of Rajasthan...
               </h2>
               <p className="text-xl md:text-2xl text-white/60 font-light italic leading-snug">
                  "Every artifact is a travelogue of technique. We trace the lineage from the shifting sands to the high mountain looms, ensuring every record is authentic."
               </p>
               <button onClick={() => navigate("/category")} className="ojo-btn-primary !px-16 !py-6 !bg-white !text-ojo-charcoal hover:!bg-ojo-mustard">Explore Collection</button>
            </motion.div>
         </div>
      </section>

      <PatternDivider type="ajrakh" />

      {/* 4. PRODUCT DISCOVERY: ASYMMETRICAL CURATION */}
      <section className="py-60 px-6 md:px-20 bg-ojo-cream relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto space-y-40 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 border-b border-ojo-charcoal/10 pb-20">
            <div className="space-y-8">
              <span className="ojo-badge ojo-badge-verified !border-ojo-mustard/30">Curation Registry</span>
              <h2 className="text-6xl md:text-8xl font-serif text-ojo-charcoal tracking-tighter leading-none italic">Verified Artifacts.</h2>
            </div>
            <p className="max-w-md text-xl text-ojo-charcoal/60 italic font-light leading-relaxed">
              Objects prioritized by rarity and cluster-purity. Selection based on the Autumn 2026 Sovereign Audit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
             {/* Large Feature Card */}
             {products.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 onClick={() => setQuickViewProduct(products[0])}
                 className="md:col-span-8 group cursor-pointer relative aspect-[14/10] overflow-hidden rounded-[4rem] shadow-premium hover:shadow-deep transition-all duration-1000"
               >
                  <img 
                    src={JSON.parse(products[0].images)[0]} 
                    className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-105" 
                    alt={products[0].name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ojo-charcoal via-transparent to-transparent" />
                  <div className="absolute bottom-12 left-12 right-12 space-y-6">
                     <div className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none">MASTERPIECE ARCHIVE</div>
                     <h3 className="text-5xl md:text-7xl font-serif text-white italic">{products[0].name}</h3>
                     <div className="flex justify-between items-end">
                        <div className="space-y-4">
                           <p className="text-xl text-white/50 italic font-light max-w-lg">{products[0].short_description}</p>
                           <div className="flex gap-3">
                              <span className="ojo-badge !border-white/20 !text-white text-[9px]">Verified from {products[0].origin}</span>
                              <span className="ojo-badge !bg-white !text-ojo-charcoal !border-none text-[9px]">GI CERTIFIED</span>
                           </div>
                        </div>
                        <div className="text-4xl font-mono text-ojo-mustard italic font-black">₹{products[0].price.toLocaleString()}</div>
                     </div>
                  </div>
               </motion.div>
             )}

             {/* Small Support Cards */}
             <div className="md:col-span-4 flex flex-col gap-12 md:gap-24">
                {products.slice(1, 3).map((p, i) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    viewport={{ once: true }}
                    onClick={() => setQuickViewProduct(p)}
                    className="group cursor-pointer space-y-8"
                  >
                     <div className="aspect-square relative overflow-hidden rounded-[3rem] shadow-premium group-hover:shadow-deep transition-all duration-700">
                        <img 
                          src={JSON.parse(p.images)[0]} 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                          alt={p.name}
                        />
                        <div className="absolute inset-0 bg-ojo-charcoal/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <div className="ojo-badge !bg-white/90 !text-ojo-charcoal !border-none text-[8px] font-black tracking-widest shadow-lg">GI Tagged</div>
                           <div className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none text-[8px] font-black tracking-widest shadow-lg uppercase">{p.decisionTag || 'PREMIUM'}</div>
                        </div>
                     </div>
                     <div className="space-y-3 px-4">
                        <div className="flex justify-between items-baseline">
                           <h4 className="text-3xl font-serif italic text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-none">{p.name}</h4>
                           <span className="text-xl font-mono text-ojo-mustard font-bold italic">₹{p.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 bg-ojo-charcoal/5 px-4 py-1 rounded-full inline-block">Origin: {p.origin.toUpperCase()}</span>
                           <ShieldCheck size={12} className="text-ojo-mustard" />
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="text-center pt-20">
             <button onClick={() => navigate("/category")} className="ojo-btn-outline !px-24 !py-10 group border-ojo-charcoal/20 hover:border-ojo-mustard">
                Access Complete Registry <ArrowRight size={18} className="ml-4 transition-transform group-hover:translate-x-4" />
             </button>
          </div>
        </div>
      </section>

      {/* 5. TRUST: ECVO-LEVEL CREDIBILITY */}
      <section className="py-60 bg-ojo-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ojo-cream to-transparent opacity-10" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <MotifSystem type="jaali" scale={3} />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-32">
           <div className="space-y-12">
              <span className="text-[11px] font-black uppercase tracking-[1em] text-ojo-mustard">Identity & Trust Registry</span>
              <h2 className="text-7xl md:text-[120px] font-serif italic text-white leading-none tracking-tighter">
                 Verified from <br />
                 <span className="text-ojo-mustard">Origin.</span>
              </h2>
              <p className="max-w-2xl mx-auto text-2xl text-white/50 font-light italic leading-snug">
                Every product on OJO is sourced directly from its place of origin — ensuring authenticity, quality, and transparency.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
              {[
                { title: "GI Tagged Products", detail: "Government certified geographical indications for absolute provenance." },
                { title: "Artisan Verified Sources", detail: "Direct cluster audits ensure master-level command and ethical origins." },
                { title: "Quality Checked & Curated", detail: "Rigorous three-tier sensory audit for every single artifact." }
              ].map((item, i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.2 }}
                   className="space-y-8 text-center p-12 bg-white/5 border border-white/10 rounded-[4rem] hover:bg-white/10 transition-all duration-700"
                >
                   <div className="w-16 h-16 rounded-full bg-ojo-mustard/20 flex items-center justify-center mx-auto mb-8 border border-ojo-mustard/30">
                      <span className="text-ojo-mustard text-2xl">✔</span>
                   </div>
                   <h4 className="text-3xl font-serif italic text-ojo-mustard leading-tight">{item.title}</h4>
                   <p className="text-xl text-white/40 font-light italic leading-snug">{item.detail}</p>
                </motion.div>
              ))}
           </div>

           <div className="pt-20">
              <div className="inline-flex items-center gap-6 px-12 py-6 bg-white/5 border border-white/10 rounded-full">
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-ojo-charcoal bg-ojo-stone p-1">
                         <div className="w-full h-full rounded-full bg-ojo-cream opacity-20" />
                      </div>
                    ))}
                 </div>
                 <span className="text-sm font-medium tracking-wider text-white/40 uppercase">Trusted by thousands of customers across India.</span>
              </div>
           </div>
        </div>
      </section>

      {/* 6. RECOMMENDATIONS: INTELLIGENT CURATION */}
      <section className="py-60 px-6 md:px-20 bg-ojo-cream">
        <div className="max-w-[1800px] mx-auto space-y-24">
          <div className="flex justify-between items-baseline border-b border-ojo-charcoal/10 pb-12">
             <h3 className="text-5xl md:text-6xl font-serif italic text-ojo-charcoal tracking-tighter">You may also like.</h3>
             <button onClick={() => navigate("/category")} className="text-[11px] font-black uppercase tracking-[0.5em] text-ojo-charcoal/40 hover:text-ojo-mustard transition-colors">See Complete Context</button>
          </div>
          
          <div className="flex gap-12 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
             {recommendedProducts.map((p, i) => (
                <motion.div 
                  key={p.id}
                  whileHover={{ y: -15 }}
                  onClick={() => setQuickViewProduct(p)}
                  className="min-w-[320px] md:min-w-[450px] space-y-10 group cursor-pointer snap-start"
                >
                   <div className="aspect-[4/5] relative overflow-hidden rounded-[3.5rem] shadow-premium group-hover:shadow-deep transition-all duration-700 bg-white">
                      <img 
                        src={p.image} 
                        className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                        alt={p.name}
                      />
                      <div className="absolute inset-0 bg-ojo-charcoal/5 group-hover:bg-transparent transition-colors" />
                   </div>
                   <div className="px-4 space-y-2">
                      <h4 className="text-3xl font-serif italic text-ojo-charcoal">{p.name}</h4>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-charcoal/30 italic">{p.origin} NODE</span>
                         <span className="text-2xl font-mono text-ojo-mustard font-black">₹{p.price.toLocaleString()}</span>
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

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
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-ojo-charcoal">
        {/* Background Layering */}
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" 
            alt="Editorial Heritage" 
            className="w-full h-full object-cover grayscale-[0.5] brightness-[0.7]"
            referrerPolicy="no-referrer"
          />
          {/* Motif Texture Layer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.5 }}
            className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
          >
             <MotifSystem type="ajrakh" scale={2} opacity={0.04} />
          </motion.div>
          {/* cinematic overlays */}
          <div className="absolute inset-0 z-20 bg-ojo-charcoal/40" />
          <div className="absolute inset-0 z-30 bg-gradient-to-t from-ojo-charcoal via-ojo-charcoal/20 to-ojo-charcoal/40" />
        </motion.div>

        <div className="relative z-40 text-center space-y-10 px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity: heroOpacity }}
          >
            <OjoLogo size="lg" className="mx-auto mb-10 opacity-90 brightness-[5] filter" />
            <h1 className="text-5xl md:text-[84px] font-serif text-white leading-[0.95] tracking-tighter italic">
              India’s Authentic <br className="hidden md:block" />
              <span className="text-ojo-mustard">Products. Verified.</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light italic leading-relaxed">
              Discover India’s authentic products by origin — from crafts and textiles to tea, spices, and more.
            </p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-10 flex items-center justify-center gap-6 text-white/40"
            >
               <div className="h-px w-12 bg-white/20" />
               <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-ojo-mustard" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]">Every product is verified at source</span>
               </div>
               <div className="h-px w-12 bg-white/20" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="pt-12"
          >
            <button 
              onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })}
              className="ojo-btn-primary !px-24 !py-8 !bg-ojo-mustard !text-ojo-charcoal hover:!bg-white group transition-all duration-500 shadow-2xl relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                 Explore India <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-white/20 translate-x-[-100%]"
                whileHover={{ translateX: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-12 flex items-center gap-4 opacity-40">
          <div className="w-12 h-[1px] bg-white" />
          <span className="text-[9px] font-black uppercase tracking-[1em] text-white">Sovereign Protocol 2026</span>
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
      <section className="py-60 md:py-80 bg-ojo-cream overflow-hidden">
        <div className="max-w-[1800px] mx-auto space-y-32">
          <div className="px-6 md:px-20 flex justify-between items-end border-b border-ojo-charcoal/10 pb-16">
             <div className="space-y-4">
                <span className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none text-[9px]">Sovereign Picks</span>
                <h3 className="text-5xl md:text-7xl font-serif italic text-ojo-charcoal tracking-tighter leading-none">You may also like</h3>
             </div>
             <button onClick={() => navigate("/category")} className="text-[11px] font-black uppercase tracking-[0.5em] text-ojo-charcoal/40 hover:text-ojo-mustard transition-colors hidden md:block">See Complete Context</button>
          </div>
          
          <div className="relative">
            <div className="flex gap-12 md:gap-20 overflow-x-auto px-6 md:px-20 pb-20 scrollbar-hide snap-x snap-mandatory">
               {recommendedProducts.map((p, i) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.8 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -20 }}
                    onClick={() => setQuickViewProduct(p)}
                    className="min-w-[340px] md:min-w-[500px] space-y-10 group cursor-pointer snap-start"
                  >
                     <div className="aspect-[3/4] relative overflow-hidden rounded-[4rem] shadow-premium group-hover:shadow-deep transition-all duration-1000 bg-white">
                        <img 
                          src={p.image} 
                          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[2s] scale-[1.05] group-hover:scale-100" 
                          alt={p.name}
                        />
                        <div className="absolute inset-0 bg-ojo-charcoal/5 group-hover:bg-transparent transition-colors duration-1000" />
                        
                        {/* Premium Status Tags */}
                        <div className="absolute top-10 left-10 flex flex-col gap-3">
                           <div className="ojo-badge !bg-white/95 !text-ojo-charcoal !border-none text-[8px] font-bold tracking-[0.2em] shadow-xl backdrop-blur-sm flex items-center gap-2 px-4 py-2">
                              <ShieldCheck size={12} className="text-ojo-mustard" /> GI CERTIFIED
                           </div>
                           <div className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none text-[8px] font-bold tracking-[0.2em] shadow-xl px-4 py-2 uppercase">
                              {i % 2 === 0 ? 'PREMIUM PICK' : 'PERFECT GIFT'}
                           </div>
                        </div>
                     </div>
                     <div className="px-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                           <h4 className="text-3xl md:text-4xl font-serif italic text-ojo-charcoal group-hover:text-ojo-mustard transition-colors duration-500 leading-tight">{p.name}</h4>
                           <span className="text-2xl font-mono text-ojo-mustard font-black pt-1">₹{p.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-ojo-charcoal/40">
                           <div className="h-px w-8 bg-ojo-mustard/30" />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Origin: {p.origin}</span>
                        </div>
                     </div>
                  </motion.div>
               ))}
               {/* Last spacer for scroll padding */}
               <div className="min-w-[100px] h-1" />
            </div>
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

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  MapPin, 
  Award,
  Truck,
  ArrowRight,
  Globe,
  Zap,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotifSystem, PatternDivider } from "../components/motifs.tsx";
import { ProductCard } from "../components/Product/ProductCard";
import { FeaturedCard, ArtisanCard } from "../components/Product/VariantCards";
import { QuickViewModal } from "../components/quick-view-modal.tsx";
import { PRODUCT_DATASET } from "../data/product-dataset";

// New Sectional Components
import { HeroSection } from "../components/HeroSection";
import { StickyNav } from "../components/StickyNav";
import { HorizontalCollections } from "../components/HorizontalCollections";
import { FestiveSection } from "../components/FestiveSection";
import { TestimonialCarousel } from "../components/TestimonialCarousel";
import { RichFooter } from "../components/RichFooter";
import { FloatingElements } from "../components/FloatingElements";

import { useCart } from "../hooks/useCart";
import { toast } from "sonner";

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>(PRODUCT_DATASET);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const { addToCart } = useCart();

  // Scroll Progress for reveal animations
  const { scrollYProgress } = useScroll();

  return (
    <div className="bg-ojo-beige selection:bg-ojo-mustard selection:text-ojo-charcoal overflow-x-hidden">
      
      {/* GLOBAL UI ELEMENTS */}
      <StickyNav />
      <FloatingElements />

      {/* 1. CINEMATIC HERO */}
      <HeroSection />

      {/* 2. STICKY NAV TARGETS START HERE */}
      
      {/* 500 YEARS OF CRAFT REVEAL */}
      <section id="our-mission" className="py-40 bg-[#F3E9D6] relative overflow-hidden border-y border-ojo-gold/10">
         <div className="absolute inset-x-0 top-0 opacity-10">
            <PatternDivider type="floral" />
         </div>
         
         <div className="max-w-[1440px] mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="flex flex-col"
               >
                  <span className="text-[200px] md:text-[300px] font-serif text-ojo-gold/40 leading-none tracking-tighter italic select-none">
                    500+
                  </span>
                  <span className="text-4xl md:text-6xl font-serif text-ojo-charcoal -mt-20 md:-mt-32 ml-4 italic">
                    Years of Indian <br />
                    <span className="text-ojo-terracotta not-italic">Craft Tradition.</span>
                  </span>
               </motion.div>
               <p className="text-xl text-ojo-stone font-serif italic max-w-xl opacity-60 leading-relaxed md:ml-4">
                  OJO protects the legacy of masters whose families have been the custodians of Indian beauty for half a millennium. Every purchase directly preserves this living history.
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8">
               {[
                 { label: 'Artisan Clusters', value: '600+' },
                 { label: 'Craft Types', value: '50+' },
                 { label: 'States Represented', value: '28' },
                 { label: 'Families Supported', value: '10,000+' },
               ].map((stat, i) => (
                 <motion.div
                   key={stat.label}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 md:p-12 bg-white/50 backdrop-blur rounded-sm border border-ojo-gold/10 hover:border-ojo-gold transition-colors text-center space-y-4"
                 >
                    <div className="text-4xl font-serif italic text-ojo-charcoal">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-gold">{stat.label}</div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* NEW ARRIVALS */}
      <section id="new-arrivals" className="py-32 md:py-48 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
           <MotifSystem type="jaali" scale={3} />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-8 space-y-20">
           <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-ojo-gold" />
                    <span className="text-ojo-gold font-black text-[12px] uppercase tracking-[0.5em]">The Latest Reveal</span>
                 </div>
                 <h2 className="text-5xl md:text-[100px] font-serif text-ojo-charcoal leading-[0.85] italic tracking-tighter">
                   Freshly <span className="text-ojo-mustard not-italic">Acquired.</span>
                 </h2>
              </div>
              <button 
                onClick={() => navigate('/category')}
                className="ojo-btn-outline !px-12 !py-6 !rounded-full hover:!bg-ojo-charcoal hover:!text-white transition-all group"
              >
                 Browse Collection <ArrowRight className="inline ml-4 group-hover:translate-x-2 transition-transform" />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {products.slice(0, 5).map((p, i) => (
                i === 0 ? (
                  <FeaturedCard key={p.id} product={p as any} />
                ) : (
                  <ProductCard key={p.id} product={p as any} onQuickView={() => setQuickViewProduct(p)} />
                )
              ))}
           </div>
        </div>
      </section>

      {/* 3. COLLECTIONS (Horizontal Scroll) */}
      <HorizontalCollections />

      {/* 4. OJO VERIFIED (Trust Deep Dive) */}
      <section id="verified" className="py-40 md:py-64 bg-[#111111] text-white relative overflow-hidden">
         {/* Background Jali */}
         <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <MotifSystem type="jaali" scale={2} />
         </div>

         <div className="max-w-[1440px] mx-auto px-8 relative z-10 flex flex-col items-center text-center space-y-32">
            <div className="space-y-12">
               <motion.div
                 initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                 whileInView={{ rotate: 0, opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-ojo-gold p-4 mx-auto flex items-center justify-center relative shadow-[0_0_100px_rgba(196,175,39,0.1)]"
               >
                  <div className="absolute inset-0 border-2 border-ojo-gold/20 border-dashed rounded-full animate-[spin_30s_linear_infinite]" />
                  <div className="flex flex-col items-center">
                     <span className="text-ojo-gold font-serif text-3xl italic">ojo</span>
                     <div className="w-12 h-px bg-ojo-gold/40 my-4" />
                     <span className="text-ojo-gold font-black text-[12px] uppercase tracking-[0.5em]">Verified</span>
                  </div>
               </motion.div>

               <div className="space-y-6">
                  <h2 className="text-5xl md:text-[120px] font-serif leading-[0.85] tracking-tighter italic">
                    Trust is our <span className="text-ojo-mustard not-italic">Only Craft.</span>
                  </h2>
                  <p className="text-xl md:text-3xl text-ojo-stone font-serif italic max-w-3xl mx-auto opacity-40">
                    We've built the world's most rigorous verification system for Indian handicraft.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 w-full">
               {[
                 { title: "Verified Source", icon: <Globe size={40} />, desc: "Every item is handpicked from its geographic cluster." },
                 { title: "Quality Checked", icon: <ShieldCheck size={40} />, desc: "Certified materials, tested for traditional longevity." },
                 { title: "Origin Tracked", icon: <MapPin size={40} />, desc: "Blockchain-backed journey from loom to living room." },
                 { title: "Authentic Always", icon: <Award size={40} />, desc: "100% money-back provenance guarantee." }
               ].map((pillar, i) => (
                 <motion.div
                   key={pillar.title}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.2, duration: 0.8 }}
                   className="space-y-8 p-12 border border-white/5 bg-white/[0.02] backdrop-blur hover:bg-white/[0.05] transition-all group"
                 >
                    <div className="text-ojo-mustard transform group-hover:scale-110 transition-transform duration-500 flex justify-center">
                       {pillar.icon}
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-ojo-beige">{pillar.title}</h4>
                       <p className="text-ojo-stone/40 text-sm font-serif italic leading-relaxed">{pillar.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. MEET THE ARTISANS */}
      <section id="artisans" className="py-40 bg-white relative overflow-hidden">
         <div className="max-w-[1440px] mx-auto px-8 space-y-24">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
               <span className="text-ojo-terracotta font-black text-[12px] uppercase tracking-[0.5em] block">Sovereign Makers</span>
               <h2 className="text-5xl md:text-[100px] font-serif text-ojo-charcoal leading-[0.85] tracking-tighter italic">
                 Meet the <span className="text-ojo-terracotta not-italic">Masters.</span>
               </h2>
               <p className="text-xl text-ojo-stone font-serif italic opacity-60">
                 Behind every artifact is a story of lineage. Our artisans are the custodians of 1,000-year-old techniques.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { name: "Prabhakar Rao", craft: "Pattachitra", region: "Odisha", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400", count: 24 },
                 { name: "Meera Bai", craft: "Chikan Embroidery", region: "Lucknow", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400", count: 18 },
                 { name: "Sanjay Kumar", craft: "Dhokra Art", region: "Chhattisgarh", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400", count: 12 },
                 { name: "Fatima Sheikh", craft: "Zardozi", region: "Delhi", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400", count: 31 }
               ].map((artisan) => (
                 <ArtisanCard key={artisan.name} {...artisan} />
               ))}
            </div>

            <div className="pt-12 text-center">
               <button className="ojo-btn-outline !px-20 !py-6 hover:!bg-ojo-terracotta hover:text-white transition-all">
                  See All 500+ Artisans →
               </button>
            </div>
         </div>
      </section>

      {/* 6. FESTIVE SECTION */}
      <FestiveSection />

      {/* 7. CUSTOMER STORIES */}
      <TestimonialCarousel />

      {/* 8. PRESS / LOGO MARQUEE */}
      <section className="py-24 bg-white border-t border-ojo-stone/10 overflow-hidden">
         <div className="max-w-[1440px] mx-auto px-8 mb-12 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-ojo-stone opacity-40">Witnessed in the press</span>
         </div>
         <div className="flex overflow-hidden group">
            <div className="flex gap-20 py-4 animate-[marquee_40s_linear_infinite] whitespace-nowrap group-hover:[animation-play-state:paused]">
               {['VOGUE INDIA', 'THE HINDU', 'ARCHITECTURAL DIGEST', 'NDTV', 'FORBES BHARAT', 'THE TIMES', 'BBC WORLD'].map((press) => (
                 <span key={press} className="text-3xl md:text-5xl font-serif italic text-ojo-stone/20 hover:text-ojo-charcoal transition-colors cursor-default select-none">
                    {press}
                 </span>
               ))}
               {/* Duplicate for seamless loop */}
               {['VOGUE INDIA', 'THE HINDU', 'ARCHITECTURAL DIGEST', 'NDTV', 'FORBES BHARAT', 'THE TIMES', 'BBC WORLD'].map((press) => (
                 <span key={press+"_alt"} className="text-3xl md:text-5xl font-serif italic text-ojo-stone/20 hover:text-ojo-charcoal transition-colors cursor-default select-none">
                    {press}
                 </span>
               ))}
            </div>
         </div>
      </section>

      {/* 9. OUR STORY PREVIEW */}
      <section id="our-story" className="py-40 md:py-64 bg-ojo-beige relative overflow-hidden">
         <div className="max-w-[1440px] mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0.7, 0.9], [0, -100]) }}
              className="relative aspect-square md:aspect-[4/5] bg-ojo-charcoal rounded-sm overflow-hidden shadow-deep"
            >
               <img 
                 src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000" 
                 className="w-full h-full object-cover brightness-75" 
                 alt="Artisan Story" 
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-ojo-charcoal to-transparent">
                  <span className="text-ojo-mustard font-black text-[11px] uppercase tracking-[0.5em]">The Vision</span>
                  <h3 className="text-3xl font-serif italic text-white">"Empowering the hands that weave our soul."</h3>
               </div>
            </motion.div>

            <div className="space-y-12">
               <div className="space-y-8">
                  <h2 className="text-6xl md:text-8xl font-serif text-ojo-charcoal leading-[0.85] tracking-tighter">
                    Built to protect <br /> <span className="text-ojo-terracotta italic">Mastery.</span>
                  </h2>
                  <p className="text-2xl text-ojo-charcoal/60 font-serif italic leading-relaxed">
                     OJO was born from a single journey through the Kutch desert—where the sight of vanishing crafts met the potential of global discovery.
                  </p>
                  <p className="text-lg text-ojo-stone font-sans leading-relaxed opacity-80">
                     We don't just sell products; we verify lineage. Our mission is to ensure every artisan can claim their true value while every patron can trust their acquisition.
                  </p>
               </div>
               <button 
                 onClick={() => navigate('/about')}
                 className="ojo-btn-primary !px-16 !py-6"
               >
                  Our Full Narrative
               </button>
            </div>
         </div>
      </section>

      {/* 10. FOOTER */}
      <RichFooter />

      {/* MODALS */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, q, opts) => {
          addToCart(p, q, opts);
          toast.success("Added to Collection");
        }}
      />
    </div>
  );
}

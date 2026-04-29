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
  Info,
  Map as MapIcon,
  Home,
  ShoppingBag,
  User,
  BadgeCheck,
  Diamond,
  Heart,
  Mail,
  Instagram,
  Facebook,
  X,
  Youtube
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotifSystem, PatternDivider } from "../components/motifs.tsx";
import { OjoLogo } from "../components/brand.tsx";
import { IndiaExplorer, StateDrawer } from "../components/india-map.tsx";
import { QuickViewModal } from "../components/quick-view-modal.tsx";
import { BottomSheet } from "../components/bottom-sheet.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { toast } from "sonner";
import { PRODUCT_DATASET, Product } from "../data/product-dataset";

import { UI_COPY } from "../constants/copy.ts";

const DECISION_TAGS = ["Most Trusted", "Best for Gifting", "Premium Pick", "Popular Choice"];

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const addItem = (product: any, quantity: number = 1, options: any = {}) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: any) => 
      i.productId === product.id && 
      JSON.stringify(i.options || {}) === JSON.stringify(options || {})
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: Array.isArray(product.images) ? product.images[0] : (product.images ? JSON.parse(product.images)[0] : product.image),
        origin: product.origin,
        quantity: quantity,
        options: options
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const items = PRODUCT_DATASET.slice(0, 12).map((p, i) => ({
          ...p,
          description: p.short_description,
          artisanName: p.artisanName || "Master Artisan",
          story: p.originStory || "Each piece is handcrafted using traditional methods passed down through generations."
        })) as any;
        setProducts(items);
      } catch (err) {
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const crafts = [
    { name: "Banarasi", image: "https://images.unsplash.com/photo-1610116303244-1235689a813a?q=80&w=2670&auto=format&fit=crop" },
    { name: "Channapatna", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop" },
    { name: "Kalamkari", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" },
    { name: "Hand Block Print", image: "https://images.unsplash.com/photo-1606294022064-0708f5aae0cb?q=80&w=2670&auto=format&fit=crop" },
    { name: "Dhokra", image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=2670&auto=format&fit=crop" },
  ];

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as any }
    }
  };

  return (
    <div className="min-h-screen bg-ojo-cream overflow-x-hidden">
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center overflow-hidden bg-ojo-charcoal">
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1590736962031-2aa23696022e?q=80&w=2670&auto=format&fit=crop" 
            alt="Artisan Weaving" 
            className="w-full h-full object-cover brightness-[0.6] contrast-[1.1]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ojo-charcoal via-ojo-charcoal/60 to-transparent" />
          
          {/* Subtle Mandala Texture */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.60] pointer-events-none">
             <MotifSystem type="mandala" scale={3} opacity={1} className="text-ojo-mustard" />
          </div>
        </motion.div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 w-full pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] as any }}
            className="max-w-4xl space-y-10 md:space-y-12"
          >
            <div className="space-y-6">
              <h1 className="text-6xl md:text-[120px] font-serif text-white leading-[0.95] font-medium tracking-tight">
                {UI_COPY.home.hero.title.split(',')[0]}, <br /> 
                {UI_COPY.home.hero.title.split(',')[1]}. <span className="text-ojo-mustard italic">Verified.</span>
              </h1>
              <p className="text-xl md:text-3xl text-white/80 font-serif max-w-xl leading-relaxed">
                {UI_COPY.home.hero.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-6 pt-4">
              <button 
                onClick={() => navigate("/category")}
                className="ojo-btn-primary !px-16 !py-5 !text-[14px] !tracking-[0.3em] hover:!bg-white hover:!text-ojo-charcoal group"
              >
                {UI_COPY.home.hero.cta}
                <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-24 md:py-40 bg-ojo-cream"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-16">
          <div className="flex items-end justify-between relative">
            <div className="absolute -left-12 -top-12 opacity-10 text-ojo-mustard w-40 h-40 pointer-events-none">
              <MotifSystem type="mandala" variant="single" scale={0.8} />
            </div>
            <div className="space-y-4 relative z-10">
              <span className="text-[12px] font-bold text-ojo-mustard uppercase tracking-[0.4em]">Handpicked Collection</span>
              <h2 className="text-4xl md:text-6xl font-serif leading-tight">{UI_COPY.home.sections.newArrivals}</h2>
            </div>
            <button onClick={() => navigate("/category")} className="text-[11px] font-bold uppercase tracking-[0.25em] border-b border-ojo-charcoal/20 pb-2 hover:text-ojo-mustard hover:border-ojo-mustard transition-all">
              Explore All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:auto-rows-fr">
             {products.slice(0, 5).map((product, i) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isLarge={i === 0}
                  onClick={() => setQuickViewProduct(product)}
                />
             ))}
          </div>
        </div>
      </motion.section>

      <PatternDivider />

      {/* SHOP BY CRAFT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-24 md:py-48 bg-white border-y border-ojo-stone/10"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-20">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
             <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-ojo-mustard block">
               The Heritage of Haste-free Making
             </span>
             <h2 className="text-5xl md:text-7xl font-serif text-ojo-charcoal leading-tight">{UI_COPY.home.sections.categories}</h2>
             <p className="text-lg text-ojo-charcoal/60 font-light leading-relaxed">
               Explore India's rich heritage through timeless crafts, each piece telling a story of mastery and origin.
             </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
             {crafts.map((craft) => (
                <div 
                 key={craft.name}
                 onClick={() => navigate(`/category?craft=${craft.name}`)}
                 className="group cursor-pointer space-y-6"
                >
                   <div className="aspect-[3/4] overflow-hidden rounded-xl bg-ojo-stone/10 relative shadow-sm transition-all duration-500 group-hover:shadow-warm">
                      <img 
                        src={craft.image} 
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                        alt={craft.name} 
                      />
                      <div className="absolute inset-0 bg-ojo-charcoal/5 group-hover:bg-transparent transition-colors" />
                   </div>
                   <div className="text-center space-y-1">
                      <h4 className="font-serif text-2xl font-medium text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-none">{craft.name}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-ojo-charcoal/40 font-bold">Explore Collection</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </motion.section>

      <PatternDivider />

      {/* MOST LOVED PRODUCTS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-24 md:py-40 bg-ojo-cream/30"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative">
             <div className="absolute -right-20 -top-20 opacity-10 text-ojo-mustard w-64 h-64 pointer-events-none">
               <MotifSystem type="mandala" variant="single" scale={1.2} />
             </div>
             <div className="space-y-6 relative z-10">
                <span className="text-[11px] font-bold text-ojo-mustard uppercase tracking-[0.4em]">The Favorites</span>
                <h2 className="text-5xl md:text-7xl font-serif text-ojo-charcoal leading-tight">{UI_COPY.home.sections.mostLoved}</h2>
             </div>
             <button onClick={() => navigate("/category")} className="ojo-btn-outline !px-10 hover:!bg-ojo-mustard">
                View All Items
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {products.slice(5, 8).map((product, i) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isLarge={i === 2}
                  onClick={() => setQuickViewProduct(product)}
                />
             ))}
          </div>
        </div>
      </motion.section>

      <PatternDivider />

      {/* OJO VERIFIED (CORE SECTION) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-32 md:py-56 bg-ojo-charcoal text-white relative overflow-hidden"
      >
        {/* Subtle Ajrakh Texture */}
        <div className="absolute inset-0 opacity-[0.10] pointer-events-none mix-blend-overlay">
           <MotifSystem type="ajrakh" scale={2.5} opacity={1} className="text-ojo-mustard" />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center gap-24 md:gap-40 relative z-10">
          {/* Large Gold Badge */}
          <div className="shrink-0">
             <div className="relative group">
                <div className="absolute -inset-16 bg-ojo-mustard/10 rounded-full blur-[100px] opacity-40" />
                
                <div className="w-64 h-64 md:w-[450px] md:h-[450px] rounded-full border border-ojo-mustard/20 p-4 flex items-center justify-center">
                   <div className="w-full h-full rounded-full border border-ojo-mustard/40 border-dashed animate-[spin_80s_linear_infinite]" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 md:w-80 md:h-80 rounded-full bg-ojo-mustard flex flex-col items-center justify-center text-center p-8 shadow-deep transform transition-transform group-hover:scale-105 duration-700">
                       <span className="text-ojo-charcoal font-serif italic text-3xl font-bold leading-none mb-2">ojo</span>
                       <div className="w-full h-px bg-ojo-charcoal/20 my-4" />
                       <h4 className="text-ojo-charcoal font-black text-2xl md:text-4xl uppercase tracking-[0.2em] leading-tight">Verified</h4>
                       <p className="text-ojo-charcoal/40 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.4em] mt-4">The Gold Standard</p>
                    </div>
                </div>
             </div>
          </div>

          <div className="flex-1 space-y-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-ojo-mustard font-bold uppercase tracking-[0.5em] text-[11px]">{UI_COPY.common.ojoQualityPromise}</span>
                <h2 className="text-5xl md:text-8xl font-serif leading-[1] font-medium">Authenticity by Origin. <br /> <span className="text-ojo-mustard italic">Verified by OJO.</span></h2>
              </div>
              <p className="text-xl md:text-2xl text-white/40 font-light leading-relaxed max-w-2xl">
                We bridge the gap between traditional Indian craftsmanship and modern quality standards. Every item is hand-selected and verified for authenticity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-16">
               {[
                 { title: "Authentic Sourcing", desc: "Direct from traditional artisan clusters.", icon: <ShieldCheck size={24} /> },
                 { title: "Direct Mapping", desc: "Every item's journey is tracked and shared.", icon: <MapPin size={24} /> },
                 { title: "Quality Guarantee", desc: "Certified materials and genuine craft.", icon: <Award size={24} /> },
                 { title: "Safe Shipping", desc: "Secure delivery for your valuable items.", icon: <Truck size={24} /> }
               ].map((point) => (
                 <div key={point.title} className="flex gap-6 group">
                    <div className="w-14 h-14 shrink-0 rounded-full border border-ojo-mustard/30 flex items-center justify-center text-ojo-mustard group-hover:bg-ojo-mustard group-hover:text-ojo-charcoal transition-all duration-500">
                       {point.icon}
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-[13px] font-bold tracking-widest uppercase text-white">{point.title}</h4>
                       <p className="text-sm text-white/40 leading-relaxed font-light">{point.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </motion.section>

      <PatternDivider />

      {/* STORY SECTION */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-24 md:py-48 bg-white overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 items-stretch gap-12 md:gap-24 px-6 md:px-0">
          <div className="relative h-[500px] md:h-[700px] overflow-hidden rounded-r-[4rem] md:rounded-r-[8rem] shadow-deep">
             <img 
               src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" 
               className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110" 
               alt="Cultural Story"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-ojo-charcoal/10" />
          </div>
          <div className="flex flex-col justify-center space-y-12 md:pr-40 relative">
             <div className="absolute -top-20 -right-20 opacity-[0.06] text-ojo-mustard w-64 h-64 pointer-events-none">
                <MotifSystem type="kalamkari" scale={2} opacity={1} />
             </div>
             
             <div className="space-y-8">
                <div className="space-y-4">
                   <p className="text-ojo-mustard font-bold uppercase tracking-[0.5em] text-[11px]">The Ojo Ethos</p>
                   <h2 className="text-5xl md:text-8xl font-serif leading-[1.1] font-medium">Inspired by values <br /> that see truth.</h2>
                </div>
                <p className="text-xl text-ojo-charcoal/60 font-light leading-relaxed max-w-xl">
                   OJO is inspired by the watchful values of India's heritage — a symbol of truth, protection and inclusivity. We verify the journey of every masterpiece.
                </p>
             </div>
             <button onClick={() => navigate("/about")} className="ojo-btn-outline !rounded-none border-ojo-charcoal/20 hover:border-ojo-mustard self-start transition-all duration-700 hover:tracking-[0.4em]">
                Read Our Story <ArrowRight size={18} className="ml-4" />
             </button>
          </div>
        </div>
      </motion.section>

      {/* EMAIL CAPTURE */}
      <section className="py-32 md:py-56 bg-ojo-terracotta relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
           <MotifSystem type="jaali" scale={4} opacity={1} className="text-white" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
           <div className="max-w-4xl mx-auto text-center space-y-16">
              <div className="space-y-6">
                 <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight">Stay Connected.</h2>
                 <p className="text-white/60 text-lg md:text-xl font-light tracking-wide">Be the first to hear about new arrivals and artisan stories.</p>
              </div>

              <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed to the newsletter."); }}>
                 <input 
                   type="email" 
                   placeholder="Your email address" 
                   className="flex-1 bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-6 text-[12px] uppercase tracking-widest focus:outline-none focus:bg-white/20 transition-all font-bold placeholder:text-white/40"
                   required
                 />
                 <button type="submit" className="bg-white text-ojo-charcoal px-12 py-6 text-[12px] font-black uppercase tracking-[0.3em] hover:bg-ojo-mustard hover:text-white transition-all">Subscribe Now</button>
              </form>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 md:py-32 bg-ojo-charcoal text-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24 pb-20 border-b border-white/10">
             <div className="space-y-8">
                <OjoLogo size="sm" dark className="!items-start" />
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                  OJO brings you the most authentic products from India's heritage, verified with trust.
                </p>
                <div className="flex gap-4">
                   {[Instagram, Facebook, X, Youtube].map((Icon, i) => (
                     <button key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-ojo-mustard hover:border-ojo-mustard transition-all">
                       <Icon size={18} />
                     </button>
                   ))}
                </div>
             </div>
             
             <div className="space-y-8">
                <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.3em]">Explore</h4>
                <ul className="space-y-3 text-white/40 text-sm font-light">
                   <li><button onClick={() => navigate("/")} className="hover:text-white transition-colors">Home</button></li>
                   <li><button onClick={() => navigate("/category")} className="hover:text-white transition-colors">New In</button></li>
                   <li><button onClick={() => navigate("/category")} className="hover:text-white transition-colors">Collections</button></li>
                   <li><button onClick={() => navigate("/category")} className="hover:text-white transition-colors">Shop by Craft</button></li>
                   <li><button onClick={() => navigate("/category")} className="hover:text-white transition-colors">Best Sellers</button></li>
                   <li><button onClick={() => navigate("/category")} className="hover:text-white transition-colors">OJO Verified</button></li>
                </ul>
             </div>

             <div className="space-y-8">
                <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.3em]">About</h4>
                <ul className="space-y-3 text-white/40 text-sm font-light">
                   <li><button onClick={() => navigate("/about")} className="hover:text-white transition-colors">Our Story</button></li>
                   <li><button onClick={() => navigate("/about")} className="hover:text-white transition-colors">Founder</button></li>
                   <li><button onClick={() => navigate("/about")} className="hover:text-white transition-colors">Vision & Mission</button></li>
                   <li><button onClick={() => navigate("/about")} className="hover:text-white transition-colors">Blog</button></li>
                </ul>
             </div>

             <div className="space-y-8">
                <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.3em]">Support</h4>
                <ul className="space-y-3 text-white/40 text-sm font-light">
                   <li><button className="hover:text-white transition-colors">Track Order</button></li>
                   <li><button className="hover:text-white transition-colors">Request Return</button></li>
                   <li><button className="hover:text-white transition-colors">Refund Policy</button></li>
                   <li><button className="hover:text-white transition-colors">Shipping Policy</button></li>
                   <li><button className="hover:text-white transition-colors">FAQ</button></li>
                </ul>
             </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
             <p>© 2026 OJO Culture. All rights reserved.</p>
             <div className="flex items-center gap-2">
                <span className="text-ojo-mustard">◈</span>
             </div>
          </div>
        </div>
      </footer>

      {/* QUICK VIEW MODAL */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onProductUpdate={(p) => setQuickViewProduct(p)}
        onAddToCart={(p, q, opts) => {
          addItem(p, q, opts);
          toast.success("Added to cart", {
            description: `${p.name} has been added to your vault.`
          });
        }}
      />
    </div>
  );
}

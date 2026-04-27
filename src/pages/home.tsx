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
import { toast } from "sonner";
import { PRODUCT_DATASET, Product } from "../data/product-dataset";

const DECISION_TAGS = ["Most Trusted", "Best for Gifting", "Premium Pick", "Masterpiece"];

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

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
          story: "Each piece is hand-crafted using heritage methods passed down through generations."
        })) as any;
        setProducts(items);
      } catch (err) {
        toast.error("Failed to load cultural archives.");
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
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <div className="min-h-screen bg-ojo-cream overflow-x-hidden">
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-[85vh] flex items-center overflow-hidden bg-ojo-charcoal">
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1590736962031-2aa23696022e?q=80&w=2670&auto=format&fit=crop" 
            alt="Artisan Weaving" 
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.1] grayscale-[0.2]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ojo-charcoal/80 via-ojo-charcoal/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-2xl space-y-6 md:space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-serif text-white leading-[1.05] font-semibold tracking-tight">
                India’s <br /> 
                Authentic Products. <br />
                <span className="text-ojo-mustard italic">Verified.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-serif italic border-l-2 border-ojo-mustard pl-6">
                Discover India’s authentic products by origin.
              </p>
              <p className="text-sm md:text-base text-white/70 max-w-lg leading-relaxed">
                OJO connects you to India’s authentic heritage through verified products.
              </p>
            </div>
            
            <button 
              onClick={() => navigate("/category")}
              className="ojo-btn-primary !rounded-md !px-12 !py-4 hover:!bg-ojo-white hover:!text-ojo-charcoal group shadow-2xl"
            >
              Explore Collection
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-20 md:py-32"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-12">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-[12px] font-semibold text-ojo-mustard uppercase tracking-widest">Fresh Acquisitions</span>
              <h2 className="text-3xl md:text-5xl font-serif">New Arrivals</h2>
            </div>
            <button onClick={() => navigate("/category")} className="text-sm font-medium border-b border-ojo-charcoal text-ojo-charcoal pb-1 hover:text-ojo-mustard hover:border-ojo-mustard transition-all">
              View All
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x">
             {products.slice(0, 6).map((product) => (
                <div 
                  key={product.id} 
                  className="min-w-[280px] md:min-w-[340px] snap-start group cursor-pointer"
                  onClick={() => setQuickViewProduct(product)}
                >
                   <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ojo-cream mb-4">
                      <img 
                        src={JSON.parse(product.images)[0]} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={product.name} 
                      />
                      <div className="absolute top-4 left-4">
                         <span className="ojo-badge ojo-badge-new">NEW</span>
                      </div>
                   </div>
                   <div className="space-y-2 px-2">
                      <div className="flex justify-between items-start gap-4">
                         <h3 className="text-lg font-medium text-ojo-charcoal group-hover:text-ojo-mustard transition-colors truncate">{product.name}</h3>
                         <span className="font-mono text-ojo-charcoal">₹{product.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <p className="text-sm text-ojo-charcoal/50 font-medium uppercase tracking-wider">{product.origin}</p>
                         <ShieldCheck size={12} className="text-ojo-mustard" />
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </motion.section>

      {/* SHOP BY CRAFT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-20 md:py-32 bg-ojo-white border-y border-ojo-stone/10"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-5xl font-serif text-ojo-charcoal">Shop by Craft</h2>
             <span className="text-[10px] md:text-[12px] font-medium tracking-[0.3em] uppercase text-ojo-mustard block">
               Explore India's rich heritage through its timeless crafts.
             </span>
             <div className="flex items-center justify-center gap-2">
               <div className="h-px w-8 bg-ojo-mustard/20" />
               <span className="text-[10px] text-ojo-mustard">◈</span>
               <div className="h-px w-8 bg-ojo-mustard/20" />
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
             {crafts.map((craft) => (
               <div 
                key={craft.name}
                onClick={() => navigate(`/category?craft=${craft.name}`)}
                className="group cursor-pointer bg-ojo-cream/40 p-1.5 rounded-2xl transition-all duration-500 hover:bg-white hover:shadow-premium border border-transparent hover:border-ojo-stone/20"
               >
                  <div className="aspect-square overflow-hidden rounded-xl bg-ojo-stone/10 relative">
                     <img 
                       src={craft.image} 
                       className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                       alt={craft.name} 
                     />
                     <div className="absolute inset-0 bg-ojo-charcoal/5 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="mt-4 flex items-center justify-between px-2 pb-1.5">
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-lg font-medium text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-none">{craft.name}</h4>
                      <p className="text-[9px] uppercase tracking-widest text-ojo-charcoal/40 font-bold">Handcrafted</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-ojo-mustard/10 flex items-center justify-center text-ojo-mustard group-hover:bg-ojo-mustard group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                      <ArrowRight size={12} />
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </motion.section>

      {/* NEW ARRIVALS (SECONDARY) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-20 md:py-32 bg-ojo-cream/30"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-12">
          <div className="flex justify-between items-end">
             <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-serif text-ojo-charcoal">New Arrivals</h2>
                <div className="flex items-center gap-2">
                  <div className="h-[2px] w-12 bg-ojo-mustard" />
                  <span className="text-ojo-mustard">◈</span>
                </div>
             </div>
             <button onClick={() => navigate("/category")} className="text-[11px] font-bold uppercase tracking-[0.2em] text-ojo-charcoal/40 hover:text-ojo-mustard flex items-center gap-2">
                View All <ArrowRight size={14} />
             </button>
          </div>

          <div className="relative group/scroll">
            <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
               {products.slice(0, 6).map((product, i) => (
                  <div 
                    key={product.id} 
                    className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer"
                    onClick={() => setQuickViewProduct(product)}
                  >
                     <div className="aspect-[4/5] relative overflow-hidden rounded-xl bg-ojo-white mb-6 border border-ojo-stone/10 shadow-sm transition-all duration-500 group-hover:shadow-premium">
                        <img 
                          src={JSON.parse(product.images)[0]} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          alt={product.name} 
                        />
                        <div className="absolute top-4 left-4">
                           <span className="bg-ojo-terracotta text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">NEW</span>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <h3 className="text-xl font-serif text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-tight">{product.name}</h3>
                           <p className="text-xs text-ojo-charcoal/40 font-medium uppercase tracking-widest">{product.origin}</p>
                        </div>
                        <div className="text-xl font-mono text-ojo-mustard font-bold">₹{product.price.toLocaleString()}</div>
                     </div>
                  </div>
               ))}
               <div className="min-w-[40px] md:min-w-[100px] h-1" />
            </div>
            {/* Scroll buttons would go here but native scroll is fine for now */}
          </div>
        </div>
      </motion.section>

      {/* MOST LOVED PRODUCTS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-20 md:py-32 bg-ojo-cream"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-16">
          <div className="flex justify-between items-end">
             <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-serif text-ojo-charcoal">Most Loved Products</h2>
                <div className="flex items-center gap-2">
                  <div className="h-[2px] w-12 bg-ojo-mustard" />
                  <span className="text-ojo-mustard">◈</span>
                </div>
             </div>
             <button onClick={() => navigate("/category")} className="text-[11px] font-bold uppercase tracking-[0.2em] text-ojo-charcoal/40 hover:text-ojo-mustard flex items-center gap-2">
                View All <ArrowRight size={14} />
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
             {products.slice(2, 6).map((product) => (
                <div 
                  key={product.id} 
                  className="group cursor-pointer"
                  onClick={() => setQuickViewProduct(product)}
                >
                   <div className="aspect-[4/5] relative overflow-hidden rounded-xl bg-ojo-white mb-6 border border-ojo-stone/10 transition-all duration-500 group-hover:shadow-premium">
                      <img 
                        src={JSON.parse(product.images)[0]} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={product.name} 
                      />
                      <div className="absolute top-4 left-4">
                         <span className="bg-ojo-white/90 backdrop-blur-sm text-ojo-charcoal text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-sm border border-ojo-stone/20">BEST SELLER</span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-ojo-charcoal/40 hover:text-ojo-terracotta transition-colors shadow-sm">
                           <Heart size={16} />
                        </button>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <h3 className="text-xl font-serif text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-tight font-medium">Banarasi Silk Saree</h3>
                         <p className="text-xs text-ojo-charcoal/40 font-medium tracking-widest uppercase">Varanasi, UP</p>
                      </div>
                      <div className="flex justify-between items-center">
                         <div className="text-xl font-mono text-ojo-mustard font-bold">₹8,499</div>
                         <div className="flex items-center gap-1.5 ">
                            <div className="flex gap-0.5 text-ojo-mustard">
                               {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" stroke="none" />)}
                            </div>
                            <span className="text-[10px] text-ojo-charcoal/40 font-bold tracking-tighter">(120)</span>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </motion.section>

      {/* OJO VERIFIED (CORE SECTION) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-20 md:py-32 bg-ojo-charcoal text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
           <MotifSystem type="jaali" scale={2} />
        </div>
        
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24 relative z-10">
          {/* Large Badge Badge */}
          <div className="shrink-0">
             <div className="relative group">
                {/* Circular glowing effect */}
                <div className="absolute -inset-8 bg-ojo-mustard/20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                
                <div className="w-56 h-56 md:w-80 md:h-80 rounded-full border-2 border-ojo-mustard/30 p-2 flex items-center justify-center animate-[spin_60s_linear_infinite]">
                   <div className="w-full h-full rounded-full border border-dashed border-ojo-mustard/50" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-ojo-mustard flex flex-col items-center justify-center text-center p-6 shadow-[0_0_50px_rgba(176,126,30,0.3)]">
                       <span className="text-ojo-charcoal font-serif italic text-2xl font-bold leading-none mb-1">ojo</span>
                       <div className="w-full h-px bg-ojo-charcoal/20 my-2" />
                       <h4 className="text-ojo-charcoal font-black text-xl md:text-2xl uppercase tracking-[0.2em] leading-tight">Verified</h4>
                       <p className="text-ojo-charcoal/60 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Authentic & Trusted</p>
                    </div>
                </div>
             </div>
          </div>

          <div className="flex-1 space-y-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-ojo-mustard font-bold uppercase tracking-[0.4em] text-xs">Ojo Verified</p>
                <h2 className="text-4xl md:text-6xl font-serif leading-[1.1]">Authentic by Origin. <br /> Trusted by OJO.</h2>
              </div>
              <p className="text-lg text-white/50 font-light leading-relaxed max-w-xl">
                Every product goes through a strict verification process to ensure authenticity, quality and fair practices.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
               {[
                 { title: "Verified Source", icon: <ShieldCheck size={18} /> },
                 { title: "Quality Checked", icon: <BadgeCheck size={18} /> },
                 { title: "Origin Tracked", icon: <MapPin size={18} /> },
                 { title: "Authentic Always", icon: <Diamond size={18} /> },
                 { title: "Safe Delivery", icon: <Truck size={18} /> }
               ].map((point) => (
                 <div key={point.title} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full border border-ojo-mustard/30 flex items-center justify-center text-ojo-mustard group-hover:bg-ojo-mustard group-hover:text-ojo-charcoal transition-all duration-500">
                       {point.icon}
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-white/80">{point.title}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* STORY SECTION */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-20 md:py-32 bg-ojo-white"
      >
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 items-stretch">
          <div className="relative h-[400px] md:h-auto overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop" 
               className="w-full h-full object-cover" 
               alt="Cultural Story"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-ojo-charcoal/20" />
          </div>
          <div className="bg-ojo-cream p-12 md:p-24 flex flex-col justify-center space-y-10 relative">
             <div className="absolute top-12 right-12 opacity-5 text-ojo-charcoal">
                <MotifSystem type="kalamkari" scale={2} />
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <p className="text-ojo-mustard font-bold uppercase tracking-[0.4em] text-[10px]">Our Story</p>
                   <h2 className="text-4xl md:text-5xl font-serif leading-tight">Inspired by the values <br /> that see everything.</h2>
                </div>
                <p className="text-lg text-ojo-charcoal/70 font-light leading-relaxed">
                   OJO is inspired by the watchful values of India's heritage — a symbol of truth, protection and inclusivity.
                </p>
             </div>
             <button onClick={() => navigate("/about")} className="ojo-btn-outline group self-start border-ojo-charcoal/20 hover:border-ojo-mustard">
                Know More About OJO <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </div>
      </motion.section>

      {/* EMAIL CAPTURE */}
      <section className="py-20 md:py-32 bg-ojo-terracotta relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 blur-sm pointer-events-none">
           <MotifSystem type="jaali" scale={3} />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1 flex items-center gap-8 text-white">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                 <Mail size={32} className="text-white/80" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl md:text-4xl font-serif">Stay connected with the world of <br /> authentic Indian crafts.</h2>
                 <p className="text-white/60 text-sm md:text-base font-light">New collections, stories & special offers straight to your inbox.</p>
              </div>
           </div>

           <form className="w-full md:w-auto flex flex-col md:flex-row gap-4 flex-1 max-w-2xl" onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed to the archive."); }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-ojo-cream/95 text-ojo-charcoal border-none rounded-sm px-8 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-ojo-mustard transition-all"
                required
              />
              <button type="submit" className="ojo-btn-primary !bg-ojo-mustard !text-white !rounded-sm !px-12 hover:!bg-ojo-charcoal transition-colors">Subscribe</button>
           </form>
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

      {/* BOTTOM NAVIGATION (MOBILE) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[90] bg-ojo-charcoal rounded-3xl p-4 shadow-deep border border-white/10 flex justify-between items-center px-8">
         <button onClick={() => navigate("/")} className="text-ojo-mustard flex flex-col items-center gap-1">
            <Home size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
         </button>
         <button onClick={() => navigate("/category")} className="text-white/40 flex flex-col items-center gap-1">
            <Search size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Search</span>
         </button>
         <button onClick={() => navigate("/cart")} className="text-white/40 flex flex-col items-center gap-1">
            <ShoppingBag size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Cart</span>
         </button>
         <button onClick={() => navigate("/profile")} className="text-white/40 flex flex-col items-center gap-1">
            <User size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
         </button>
      </nav>

      {/* QUICK VIEW MODAL */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onProductUpdate={(p) => setQuickViewProduct(p)}
        onAddToCart={(p) => {
          addItem(p);
          toast.success("Added to cart", {
            description: `${p.name} has been added to your vault.`
          });
        }}
      />
    </div>
  );
}

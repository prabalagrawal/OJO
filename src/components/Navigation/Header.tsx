import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  ChevronDown, 
  X, 
  Instagram,
  ChevronRight
} from 'lucide-react';
import { 
  GopuramTrim, 
  PietraDuraBorder, 
  TemplePillar, 
  KolamBorder, 
  MughalArchEdge, 
  JaliPattern 
} from './Patterns';
import { OjoLogo } from '../brand';

// --- Icons ---

const EyeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const KolamUnderline = () => (
  <motion.div 
    layoutId="nav-underline"
    className="absolute -bottom-1 left-0 right-0 h-2 flex justify-center items-center pointer-events-none"
  >
    <svg width="100%" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
      <circle cx="10" cy="2" r="1.2" fill="#C4AF27" />
      <circle cx="20" cy="2" r="1.2" fill="#C4AF27" />
      <circle cx="30" cy="2" r="1.2" fill="#C4AF27" />
      <circle cx="40" cy="2" r="1.2" fill="#C4AF27" />
      <circle cx="50" cy="2" r="1.5" fill="#C4AF27" />
      <circle cx="60" cy="2" r="1.2" fill="#C4AF27" />
      <circle cx="70" cy="2" r="1.2" fill="#C4AF27" />
      <circle cx="80" cy="2" r="1.2" fill="#C4AF27" />
      <circle cx="90" cy="2" r="1.2" fill="#C4AF27" />
    </svg>
  </motion.div>
);

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7H20M4 12H20M4 17H20" strokeLinecap="round" />
    <rect x="3" y="6" width="2" height="2" fill="currentColor" opacity="0.3" />
    <rect x="19" y="6" width="2" height="2" fill="currentColor" opacity="0.3" />
    <rect x="3" y="11" width="2" height="2" fill="currentColor" opacity="0.3" />
    <rect x="19" y="11" width="2" height="2" fill="currentColor" opacity="0.3" />
    <rect x="3" y="16" width="2" height="2" fill="currentColor" opacity="0.3" />
    <rect x="19" y="16" width="2" height="2" fill="currentColor" opacity="0.3" />
  </svg>
);

// --- Components ---

const MegaDropdown = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const categories = [
    { name: "Textiles", icon: "🧵", desc: "Hand-loomed heritage" },
    { name: "Jewelry", icon: "💍", desc: "Traditional adornments" },
    { name: "Pottery", icon: "🏺", desc: "Earthen masterpieces" },
    { name: "Paintings", icon: "🎨", desc: "Mughal & Folk styles" },
    { name: "Home Decor", icon: "🏠", desc: "Architectural accents" },
    { name: "Food & Spices", icon: "🌶️", desc: "Sourced with care" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full bg-ojo-beige shadow-2xl z-50 border-b border-ojo-gold/20"
        >
          <KolamBorder height={6} />
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 p-12">
            <div className="col-span-8 grid grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link 
                  key={cat.name}
                  to={`/category?type=${cat.name}`}
                  onClick={onClose}
                  className="group p-6 hover:bg-ojo-terracotta/5 transition-all rounded-xl border border-transparent hover:border-ojo-terracotta/10"
                >
                  <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{cat.icon}</div>
                  <h4 className="text-xl font-serif text-ojo-charcoal mb-1">{cat.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 group-hover:text-ojo-terracotta transition-colors">{cat.desc}</p>
                </Link>
              ))}
            </div>
            
            <div className="col-span-4 space-y-8 border-l border-ojo-stone/10 pl-12">
              <h5 className="text-sm font-black uppercase tracking-widest text-ojo-red">OJO Picks This Week</h5>
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-20 h-20 bg-ojo-stone rounded-lg overflow-hidden flex-shrink-0">
                      <img src={`https://images.unsplash.com/photo-${1600+i}?q=80&w=2670`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div>
                      <h6 className="font-serif italic text-ojo-charcoal group-hover:text-ojo-red transition-colors">Artisan Piece {i}</h6>
                      <p className="text-xs text-ojo-charcoal/50">Limited Edition Heritage</p>
                      <span className="text-sm font-mono font-bold text-ojo-gold">₹4,999</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/category" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ojo-gold hover:text-ojo-red transition-colors group">
                View All Categories <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Header = ({ onCartClick, onAccountClick }: { onCartClick?: () => void, onAccountClick?: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
    updateCount();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const navLinks = [
    { name: "SHOP", path: "/category", hasDropdown: true },
    { name: "COLLECTIONS", path: "/category?featured=true" },
    { name: "ARTISANS", path: "/artisans" },
    { name: "OUR STORY", path: "/about" },
    { name: "JOURNAL", path: "/journal" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] group/header">
      {/* LAYER 0: Gopuram Trim */}
      <GopuramTrim />

      {/* LAYER 1: Announcement Bar */}
      <div className="bg-ojo-charcoal py-2.5 overflow-hidden relative border-b-6 border-transparent">
        <PietraDuraBorder />
        <div className="flex justify-center items-center gap-12 whitespace-nowrap animate-marquee md:animate-none">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-beige flex items-center gap-3">
            <span className="text-ojo-gold">✦</span> Free shipping above ₹999 <span className="text-ojo-gold">✦</span> Authentic & Handmade <span className="text-ojo-gold">✦</span> OJO Verified Products <span className="text-ojo-gold">✦</span> Ships Worldwide
          </span>
        </div>
      </div>

      {/* LAYER 2: Main Header */}
      <div 
        className={`relative transition-all duration-700 bg-ojo-beige border-b border-ojo-charcoal/5 ${
          isScrolled ? 'py-3' : 'py-6'
        }`}
        onMouseLeave={() => setIsShopHovered(false)}
      >
        {/* Subtle Motif Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none text-ojo-terracotta">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#jali-pattern)" />
          </svg>
        </div>
        <JaliPattern />

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between relative z-10">
          {/* LEFT: Logo */}
          <Link to="/" className="flex flex-col items-center group/logo hover:scale-105 transition-transform duration-500">
            <OjoLogo size={isScrolled ? "sm" : "md"} />
            <div className="h-4 flex items-center mt-2">
              <TemplePillar />
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-ojo-charcoal/60 mx-4">SEE. VERIFY. TRUST.</span>
              <TemplePillar />
            </div>
          </Link>

          {/* CENTER: Navigation */}
          <nav className="hidden lg:flex items-center">
            {navLinks.map((link, idx) => (
              <React.Fragment key={link.name}>
                <div 
                  className="relative px-6 py-2 group/nav"
                  onMouseEnter={() => link.hasDropdown && setIsShopHovered(true)}
                >
                  <Link 
                    to={link.path}
                    className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                      location.pathname === link.path ? 'text-ojo-terracotta' : 'text-ojo-charcoal/80 hover:text-ojo-terracotta'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {(location.pathname === link.path || (link.hasDropdown && isShopHovered)) && (
                    <KolamUnderline />
                  )}
                </div>
                <div className="opacity-20">
                  <TemplePillar />
                </div>
              </React.Fragment>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="absolute right-full mr-2 overflow-hidden"
                  >
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Search heritage..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-ojo-charcoal/5 border border-ojo-charcoal/10 rounded-full px-4 py-2 text-[11px] text-ojo-charcoal placeholder:text-ojo-charcoal/30 focus:outline-none focus:border-ojo-terracotta w-full"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-ojo-charcoal hover:text-ojo-terracotta transition-colors p-2 rounded-full hover:bg-ojo-charcoal/5"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={22} />}
              </button>
            </div>
            <Link to="/dashboard" className="hidden sm:block text-ojo-charcoal hover:text-ojo-terracotta transition-colors p-2 rounded-full hover:bg-ojo-charcoal/5">
              <Heart size={20} />
            </Link>
            <button 
              onClick={onCartClick}
              className="relative text-ojo-charcoal hover:text-ojo-terracotta transition-colors p-2 rounded-full hover:bg-ojo-charcoal/5"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-ojo-red text-ojo-beige text-[9px] font-black rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-ojo-charcoal/10">
              <button className="w-10 h-10 rounded-full border border-ojo-terracotta/30 text-ojo-terracotta text-[9px] font-black hover:bg-ojo-terracotta hover:text-ojo-beige transition-all">
                ₹
              </button>
              <button 
                onClick={onAccountClick}
                className="text-ojo-charcoal hover:text-ojo-terracotta transition-colors"
              >
                <User size={20} />
              </button>
            </div>
            
            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-ojo-terracotta p-2 hover:bg-ojo-terracotta/10 rounded-lg transition-colors"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {/* Mega Dropdown */}
        <MegaDropdown 
          isOpen={isShopHovered} 
          onClose={() => setIsShopHovered(false)} 
        />
      </div>

      {/* LAYER 3: Mughal Arch Bottom */}
      <div className="relative z-[90] pointer-events-none -mt-px overflow-hidden h-2">
        <MughalArchEdge />
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="fixed inset-0 bg-ojo-charcoal z-[200] lg:hidden overflow-hidden flex"
          >
            {/* Pietra Dura Side Border */}
            <div className="w-2 h-full relative overflow-hidden bg-ojo-red">
               <div className="absolute inset-0 origin-top rotate-90 w-[100vh] h-2">
                  <PietraDuraBorder />
               </div>
            </div>

            <div className="flex-grow p-12 flex flex-col">
              <div className="flex justify-between items-start mb-20">
                <OjoLogo dark size="md" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-ojo-gold p-4 hover:bg-ojo-gold/10 rounded-2xl transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-12 relative">
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-ojo-gold/40" />
                <input 
                  type="text"
                  placeholder="Search heritage..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-ojo-gold/20 rounded-full py-5 pl-16 pr-8 text-ojo-beige placeholder:text-ojo-beige/30 outline-none focus:border-ojo-gold"
                />
              </form>

              <nav className="flex flex-col gap-10">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <Link 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-4xl font-serif text-ojo-beige hover:text-ojo-gold transition-all block italic"
                    >
                      {link.name}
                    </Link>
                    <div className="mt-4 opacity-20">
                      <KolamBorder height={6} />
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-auto pt-12 space-y-12">
                <div className="grid grid-cols-2 gap-6">
                  <button className="ojo-btn-outline !border-ojo-gold/30 !text-ojo-gold">Instagram</button>
                  <button className="ojo-btn-outline !border-ojo-gold/30 !text-ojo-gold">WhatsApp</button>
                </div>
                <div className="flex items-center justify-between text-ojo-beige/40">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">OJO Sovereign v3.0</span>
                  <div className="flex gap-4">
                    <Instagram size={18} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Package, 
  Heart, 
  MapPin, 
  User, 
  LogOut, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  ShoppingBag,
  Plus,
  Trash2,
  ExternalLink,
  Search
} from "lucide-react";
import { api } from "../lib/api.ts";
import { OjoLogo } from "../components/brand.tsx";

const sidebarItems = [
  { label: "Orders", icon: <Package size={20} />, path: "orders" },
  { label: "Wishlist", icon: <Heart size={20} />, path: "wishlist" },
  { label: "Addresses", icon: <MapPin size={20} />, path: "addresses" },
  { label: "Profile", icon: <User size={20} />, path: "profile" },
];

export function CustomerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const currentPath = location.pathname.split("/").pop();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    else navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-ojo-cream overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-80 bg-ojo-charcoal flex flex-col justify-between py-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 pattern-jali opacity-5 pointer-events-none" />
        
        <div className="px-10 relative z-10 space-y-16">
          <Link to="/" className="block hover:opacity-80 transition-opacity">
            <OjoLogo size="sm" dark />
          </Link>

          <nav className="space-y-4">
            {sidebarItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between group px-6 py-4 rounded-2xl transition-all ${isActive ? 'bg-ojo-terracotta text-ojo-white shadow-xl translate-x-3' : 'text-ojo-soft-cream/40 hover:text-ojo-white hover:bg-ojo-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform ${isActive ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-10 relative z-10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-ojo-soft-cream/40 hover:text-ojo-terracotta transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow overflow-y-auto bg-ojo-cream relative">
        <div className="absolute inset-0 pattern-lotus opacity-[0.02] pointer-events-none" />
        
        <header className="sticky top-0 z-20 px-12 py-8 bg-ojo-cream/80 backdrop-blur-xl border-b border-ojo-stone/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-stone">Welcome back,</span>
              <h2 className="text-2xl font-serif text-ojo-charcoal">{user.name}</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative group hidden sm:block">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ojo-stone group-focus-within:text-ojo-terracotta transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-white/50 border border-ojo-stone/20 rounded-full pl-12 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-ojo-mustard/40 transition-all w-64"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-ojo-mustard flex items-center justify-center p-1 bg-white shadow-xl">
                <div className="w-full h-full rounded-full bg-ojo-charcoal flex items-center justify-center text-ojo-white text-xs font-black">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
        </header>

        <div className="p-12 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="addresses" element={<AddressesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Active Orders", val: "2", icon: <Package />, color: "bg-ojo-terracotta" },
          { label: "Saved Items", val: "14", icon: <Heart />, color: "bg-ojo-mustard" },
          { label: "Shipment Status", val: "On Track", icon: <ShieldCheck />, color: "bg-ojo-charcoal" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[40px] shadow-xl border border-ojo-stone/10 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`} />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className={`${stat.color} text-ojo-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}>
                {stat.icon}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-ojo-stone">{stat.label}</p>
                <h4 className="text-4xl font-serif text-ojo-charcoal">{stat.val}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-3xl font-serif text-ojo-charcoal">Recommended for <span className="italic text-ojo-terracotta">You</span></h3>
           <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-ojo-stone hover:text-ojo-mustard transition-colors flex items-center gap-2">
             Shop All <ChevronRight size={14} />
           </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="group cursor-pointer space-y-4">
                <div className="aspect-[3/4] rounded-[30px] overflow-hidden bg-ojo-stone/10 border border-ojo-stone/20 relative">
                   <img src={`https://images.unsplash.com/photo-${1590 + i}?q=80&w=2670`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1s]" />
                   <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <div className="w-8 h-8 rounded-full bg-ojo-mustard text-ojo-white flex items-center justify-center shadow-lg">
                        <ShoppingBag size={12} />
                      </div>
                   </div>
                </div>
                <div className="px-2 space-y-1">
                   <p className="text-[8px] font-black uppercase tracking-[0.3em] text-ojo-stone">Jaipur Heritage</p>
                   <h5 className="font-serif text-lg text-ojo-charcoal group-hover:text-ojo-terracotta transition-colors">Royal Vase Block {i}</h5>
                   <p className="text-xs font-black tracking-widest text-ojo-terracotta">₹12,400</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-8">
         <div className="flex items-center gap-4">
            <Clock size={20} className="text-ojo-mustard" />
            <h3 className="text-2xl font-serif text-ojo-charcoal">Recently <span className="italic text-ojo-stone">Viewed</span></h3>
         </div>
         <div className="flex gap-8 overflow-x-auto pb-4 custom-scrollbar">
            {[5, 6, 7].map((i) => (
              <div key={i} className="min-w-[280px] bg-white p-6 rounded-[30px] border border-ojo-stone/10 flex gap-6 items-center group cursor-pointer hover:border-ojo-mustard/40 transition-all">
                 <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                    <img src={`https://images.unsplash.com/photo-${1610 + i}?q=80&w=2670`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                 </div>
                 <div className="min-w-0">
                    <h5 className="font-serif text-ojo-charcoal truncate">Product {i}02-B</h5>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Viewed 2h ago</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}

function OrdersPage() {
  const orders = [
    { id: "ORD-8829-1", status: "SHIPPED", date: "April 20, 2026", total: 45200, items: 2, img: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2670" },
    { id: "ORD-8829-2", status: "DELIVERED", date: "March 12, 2026", total: 12400, items: 1, img: "https://images.unsplash.com/photo-1544208062-331bd1954941?q=80&w=2670" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between border-b border-ojo-stone/10 pb-8">
        <h3 className="text-4xl font-serif text-ojo-charcoal">My <span className="italic text-ojo-terracotta">Orders</span></h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-ojo-stone">{orders.length} Orders Found</span>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl border border-ojo-stone/10 group hover:border-ojo-mustard/40 transition-all">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-inner border border-ojo-stone/10 shrink-0">
                <img src={order.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1s]" />
              </div>
              <div className="flex-grow space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-serif text-ojo-charcoal tracking-tighter">Order #{order.id}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-ojo-stone">Purchased on {order.date}</p>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'SHIPPED' ? 'bg-ojo-terracotta/10 text-ojo-terracotta border border-ojo-terracotta/20' : 'bg-ojo-charcoal/10 text-ojo-charcoal opacity-50'}`}>
                    {order.status}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 opacity-40">
                   <div className="flex items-center gap-2">
                     <Clock size={12} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Expected arrival: April 28</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <ShoppingBag size={12} />
                     <span className="text-[10px] font-black uppercase tracking-widest">{order.items} Items</span>
                   </div>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-center md:items-end gap-3">
                <span className="text-2xl font-serif text-ojo-charcoal">₹{order.total.toLocaleString()}</span>
                <button 
                  onClick={() => window.location.href = `/order-tracking/${order.id}`}
                  className="px-6 py-3 bg-ojo-charcoal text-ojo-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-ojo-mustard transition-colors shadow-lg"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WishlistPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between border-b border-ojo-stone/10 pb-8">
        <h3 className="text-4xl font-serif text-ojo-charcoal">My <span className="italic text-ojo-terracotta">Wishlist</span></h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-ojo-terracotta hover:text-ojo-mustard transition-colors flex items-center gap-2 underline">
          Share Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[40px] p-8 shadow-xl border border-ojo-stone/10 space-y-6 relative group overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
               <div className="bg-ojo-mustard text-ojo-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                  <ShieldCheck size={16} />
               </div>
            </div>
            <div className="aspect-[4/5] rounded-[30px] overflow-hidden bg-ojo-stone/10 relative">
               <img src={`https://images.unsplash.com/photo-${1600 + i}?q=80&w=2670`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1s]" />
               <div className="absolute inset-0 bg-ojo-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                  <button className="w-full py-4 bg-ojo-white text-ojo-charcoal rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-ojo-mustard transition-colors">
                    Move to Cart
                  </button>
               </div>
            </div>
            <div className="space-y-2 relative">
               <h4 className="text-xl font-serif text-ojo-charcoal tracking-tighter">Silk Tapestry Block {i}</h4>
               <div className="flex items-center justify-between">
                  <span className="text-lg font-serif">₹28,500</span>
                  <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                     <Trash2 size={16} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AddressesPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between border-b border-ojo-stone/10 pb-8">
        <h3 className="text-4xl font-serif text-ojo-charcoal">Saved <span className="italic text-ojo-terracotta">Addresses</span></h3>
        <button className="ojo-btn-primary !py-3 !px-8">
          <Plus size={16} /> New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: "HOME", address: "88 Haven Road, Indiranagar, Bangalore - 560038", icon: <ShieldCheck className="text-ojo-mustard" /> },
          { label: "OFFICE", address: "12 Creative Plaza, HSR Layout, Bangalore - 560102", icon: <ShoppingBag className="text-ojo-terracotta" /> },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-[40px] p-10 shadow-xl border border-ojo-stone/10 group hover:border-ojo-mustard/40 transition-all space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">{item.label}</span>
               </div>
               <div className="flex gap-4">
                  <button className="text-[10px] font-black uppercase tracking-widest text-ojo-stone hover:text-ojo-terracotta underline">Edit</button>
                  <button className="text-[10px] font-black uppercase tracking-widest text-ojo-stone hover:text-red-500 underline">Delete</button>
               </div>
            </div>
            <p className="text-lg font-serif text-ojo-charcoal opacity-60 leading-relaxed italic">
              "{item.address}"
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-12"
    >
      <div className="border-b border-ojo-stone/10 pb-8">
        <h3 className="text-4xl font-serif text-ojo-charcoal">My <span className="italic text-ojo-terracotta">Profile</span></h3>
        <p className="text-sm text-ojo-stone mt-2">Manage your account details and profile.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">Full Name</label>
            <div className="p-4 bg-white rounded-2xl border border-ojo-stone/10 shadow-inner font-medium text-ojo-charcoal">{user.name}</div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">Username</label>
            <div className="p-4 bg-white rounded-2xl border border-ojo-stone/10 shadow-inner font-medium text-ojo-charcoal">@{user.name.split(' ')[0].toLowerCase()}</div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">Email Address</label>
          <div className="p-4 bg-white rounded-2xl border border-ojo-stone/10 shadow-inner font-medium text-ojo-charcoal">{user.email}</div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">Account Type</label>
          <div className="p-4 bg-ojo-charcoal text-ojo-white rounded-2xl border border-ojo-stone/10 shadow-xl flex items-center justify-between">
             <span className="font-black uppercase tracking-[0.2em] text-[10px]">{user.role}</span>
             <ShieldCheck size={16} className="text-ojo-mustard" />
          </div>
        </div>
      </div>

      <div className="pt-8 flex gap-6">
        <button className="ojo-btn-primary flex-1">Save Profile Updates</button>
        <button className="px-12 py-5 rounded-full border-2 border-ojo-stone/20 text-[10px] font-black uppercase tracking-widest hover:border-ojo-terracotta transition-all">Enable 2FA</button>
      </div>
    </motion.div>
  );
}

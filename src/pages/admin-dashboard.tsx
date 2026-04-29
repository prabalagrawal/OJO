import { useState, useEffect } from "react";
import { api } from "../lib/api.ts";
import { 
  ShieldAlert, UserCheck, Eye, CheckCircle, XCircle, 
  Package, ShoppingBag, Users, Clock, ArrowUpRight,
  TrendingUp, Activity, Search, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

type TabType = 'overview' | 'audit' | 'orders' | 'vendors';

import { DashboardSkeleton } from "../components/DashboardSkeleton";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const data = await api.get("/admin/stats");
        setStats(data);
      } else if (activeTab === 'audit') {
        const data = await api.get("/admin/products/pending");
        setPendingProducts(data);
      } else if (activeTab === 'orders') {
        const data = await api.get("/admin/orders");
        setOrders(data);
      }
    } catch (err) {
      toast.error("Failed to synchronize with registry");
    } finally {
      setLoading(false);
    }
  };

  const verifyProduct = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await api.post(`/admin/products/${id}/verify`, { status, comments: "Standard field audit complete." });
      setPendingProducts(pendingProducts.filter(p => p.id !== id));
      toast.success(`Heritage record ${status.toLowerCase()} successfully.`);
    } catch (err) {
      toast.error("Audit authorization failed.");
    }
  };

  if (loading && !stats && activeTab === 'overview') {
    return <div className="p-16"><DashboardSkeleton /></div>;
  }

  return (
    <div className="min-h-screen bg-ojo-cream/30 p-8 md:p-16 space-y-16">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
           <div className="ojo-badge ojo-badge-verified">Sovereign Admin Access</div>
           <h1 className="text-6xl font-serif italic text-ojo-charcoal tracking-tighter">Command Center.</h1>
           <p className="text-lg text-ojo-charcoal/50 font-light italic">Master control for the OJO Provenance Registry.</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-2xl border border-ojo-stone/10 shadow-sm">
           {(['overview', 'audit', 'orders', 'vendors'] as TabType[]).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeTab === tab 
                 ? 'bg-ojo-charcoal text-white shadow-xl' 
                 : 'text-ojo-charcoal/40 hover:text-ojo-charcoal'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && stats && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {[
                { label: 'Registry Items', value: stats.totalProducts, icon: Package, color: 'ojo-mustard' },
                { label: 'Pending Audits', value: stats.pendingProducts, icon: ShieldAlert, color: 'red-500' },
                { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'ojo-charcoal' },
                { label: 'Vendor Nodes', value: stats.totalVendors, icon: Globe, color: 'ojo-charcoal' }
              ].map((stat, i) => (
                <div key={i} className="ojo-card p-10 flex flex-col justify-between group hover:ojo-texture-heritage transition-all duration-700 h-64">
                   <div className="flex justify-between items-start">
                      <div className={`p-4 bg-${stat.color}/10 text-${stat.color} rounded-2xl`}>
                         <stat.icon size={24} />
                      </div>
                      <ArrowUpRight size={20} className="text-ojo-charcoal/20 group-hover:text-ojo-mustard transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <div className="text-5xl font-mono tracking-tighter text-ojo-charcoal">{stat.value}</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-charcoal/30">{stat.label}</div>
                   </div>
                </div>
              ))}
            </div>

            {/* Visual Charts Placeholder & Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 ojo-card p-12 space-y-10">
                  <div className="flex justify-between items-center">
                     <h3 className="text-3xl font-serif italic">Recent Registry Acquisitions</h3>
                     <TrendingUp size={20} className="text-ojo-mustard" />
                  </div>
                  <div className="h-80 bg-ojo-cream/50 rounded-[3rem] border border-dashed border-ojo-mustard/20 flex items-center justify-center">
                     <div className="text-center space-y-4">
                        <Activity size={40} className="mx-auto text-ojo-mustard/40" />
                        <p className="text-sm italic text-ojo-charcoal/40 font-light">Provenance velocity tracking active.</p>
                     </div>
                  </div>
               </div>

               <div className="ojo-card p-12 space-y-10">
                  <h3 className="text-3xl font-serif italic">Active Orders</h3>
                  <div className="space-y-6">
                     {stats.recentOrders?.map((order: any) => (
                       <div key={order.id} className="flex items-center justify-between p-6 bg-white border border-ojo-stone/10 rounded-2xl group hover:border-ojo-mustard/40 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-ojo-cream flex items-center justify-center text-ojo-mustard italic font-serif">
                                {order.customer.name[0]}
                             </div>
                             <div>
                                <p className="text-xs font-bold text-ojo-charcoal">{order.customer.name}</p>
                                <p className="text-[10px] text-ojo-charcoal/40">₹{order.total.toLocaleString()}</p>
                             </div>
                          </div>
                          <div className="ojo-label bg-ojo-mustard/10 text-ojo-mustard text-[8px]">{order.status}</div>
                       </div>
                     ))}
                     <button className="w-full py-4 border border-ojo-stone/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/40 hover:bg-ojo-cream transition-colors">
                        View All Orders
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex justify-between items-center border-b border-ojo-stone/10 pb-8">
               <h3 className="text-3xl font-serif italic">Pending Submissions</h3>
               <div className="flex items-center gap-4 px-6 py-2 bg-white rounded-full border border-ojo-stone/10">
                  <Search size={14} className="text-ojo-charcoal/30" />
                  <input type="text" placeholder="Search registry..." className="bg-transparent border-none text-[10px] outline-none" />
               </div>
            </div>

            {loading ? (
              <div className="py-24 text-center italic text-ojo-charcoal/40 animate-pulse">Syncing with provenance clusters...</div>
            ) : pendingProducts.length === 0 ? (
              <div className="ojo-card py-32 text-center space-y-6">
                 <ShieldAlert size={48} className="mx-auto text-ojo-mustard/20" />
                 <p className="text-xl italic text-ojo-charcoal/40">The registry is currently balanced. No pending audits.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {pendingProducts.map(p => (
                  <motion.div 
                    key={p.id}
                    layout
                    className="ojo-card flex flex-col md:flex-row gap-12 p-10 items-start md:items-center group hover:border-ojo-mustard/30 transition-all"
                  >
                    <div className="w-32 h-44 bg-ojo-cream rounded-[2rem] overflow-hidden shadow-premium flex-shrink-0 group-hover:shadow-deep transition-all">
                       <img src={JSON.parse(p.images || "[]")[0]} alt="" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                    </div>
                    
                    <div className="flex-grow space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="ojo-badge ojo-badge-verified !px-4">GI Submission</div>
                        <div className="h-px w-12 bg-ojo-mustard/20" />
                        <span className="text-[10px] text-ojo-charcoal/40 italic font-medium uppercase tracking-widest">Node: {p.origin}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-4xl font-serif italic text-ojo-charcoal tracking-tight">{p.name}</h4>
                        <p className="text-sm text-ojo-charcoal/60 line-clamp-2 max-w-3xl italic font-light leading-relaxed">"{p.description}"</p>
                      </div>
                      
                      <div className="flex items-center gap-10">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase text-ojo-charcoal/40 tracking-widest mb-1">Proposed Valve</span>
                            <span className="text-lg font-mono text-ojo-charcoal">₹{p.price.toLocaleString()}</span>
                         </div>
                         <div className="flex flex-col border-l border-ojo-stone/10 pl-10">
                            <span className="text-[8px] font-black uppercase text-ojo-charcoal/40 tracking-widest mb-1">Author / Vendor</span>
                            <span className="text-sm font-bold text-ojo-charcoal uppercase">{p.vendor.name}</span>
                         </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      <button 
                        onClick={() => verifyProduct(p.id, 'VERIFIED')}
                        className="ojo-btn-primary !bg-green-600 !px-10 !py-4 !text-[9px] group"
                      >
                         <CheckCircle size={16} className="inline mr-2" /> Authorize Record
                      </button>
                      <button 
                        onClick={() => verifyProduct(p.id, 'REJECTED')}
                        className="ojo-btn-outline !text-red-500 !border-red-100 hover:!bg-red-50 !px-10 !py-4 !text-[9px]"
                      >
                         <XCircle size={16} className="inline mr-2" /> Reject Entry
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'orders' && (
           <motion.div
             key="orders"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="ojo-card overflow-hidden"
           >
              <table className="w-full">
                 <thead>
                    <tr className="bg-ojo-cream/50 text-left">
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Reference ID</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Timestamp</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Auditor / Client</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Valuation</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">Integrity Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-ojo-stone/5">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-ojo-cream/20 transition-colors group cursor-pointer">
                        <td className="p-8 font-mono text-xs text-ojo-charcoal/60">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="p-8 text-xs text-ojo-charcoal/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-8">
                           <p className="text-xs font-bold text-ojo-charcoal">{order.customer.name}</p>
                           <p className="text-[10px] text-ojo-charcoal/40">{order.customer.email}</p>
                        </td>
                        <td className="p-8 font-mono text-sm font-bold text-ojo-charcoal italic">₹{order.total.toLocaleString()}</td>
                        <td className="p-8">
                           <div className={`ojo-label text-[8px] ${
                             order.status === 'RELEASED' ? 'bg-green-100 text-green-700' : 'bg-ojo-mustard/10 text-ojo-mustard'
                           }`}>
                              {order.status}
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

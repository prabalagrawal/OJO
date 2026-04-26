import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  ShoppingBag, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { collection, query, getDocs, orderBy, limit, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { handleFirestoreError, OperationType } from "../../lib/firestore-errors";
import { MotifSystem } from "../../components/motifs.tsx";

interface Order {
  id: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  createdAt: any;
}

interface ActivityLog {
  id: string;
  event: string;
  userId: string;
  timestamp: any;
  details: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, products: 0, vendors: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'vendors' | 'users'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", origin: "", stock: "10", category: "Tea", story: "", decisionTag: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersSnap, usersSnap, productsSnap] = await Promise.all([
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "products"))
      ]);
      
      let revenue = 0;
      const orders = ordersSnap.docs.map(doc => {
        const data = doc.data();
        revenue += data.total || 0;
        return { id: doc.id, ...data } as Order;
      });

      const allUsers = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const allVendors = allUsers.filter((u: any) => u.role?.toLowerCase() === 'vendor');

      setStats({
        users: usersSnap.size,
        orders: ordersSnap.size,
        revenue,
        products: productsSnap.size,
        vendors: allVendors.length
      });

      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setVendors(allVendors);

      // Recent Orders
      const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
      const recentOrdersSnap = await getDocs(qOrders);
      setRecentOrders(recentOrdersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

      // Activity Logs
      const qLogs = query(collection(db, "activity_logs"), orderBy("timestamp", "desc"), limit(10));
      const logsSnap = await getDocs(qLogs);
      setActivityLogs(logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog)));

    } catch (err) {
      handleFirestoreError(err, OperationType.GET, "admin_data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        status: "verified",
        images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2610&auto=format&fit=crop"],
        addedAt: serverTimestamp()
      });
      setShowAddProduct(false);
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "products");
    }
  };

  const updateProductStatus = async (productId: string, status: string) => {
    try {
      await updateDoc(doc(db, "products", productId), { status });
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, "products");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setRecentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      
      await addDoc(collection(db, "activity_logs"), {
        event: "ORDER_STATUS_UPDATE",
        details: `Order ${orderId} marked as ${newStatus}`,
        timestamp: serverTimestamp(),
        userId: "system_admin"
      });
    } catch (err) {
       handleFirestoreError(err, OperationType.UPDATE, "orders");
    }
  };

  return (
    <div className="min-h-screen bg-ojo-cream p-4 md:p-8 font-sans selection:bg-ojo-mustard selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-16">
        {/* Header - Architectural Jharokha Design */}
        <div className="bg-white/70 backdrop-blur-3xl p-10 md:p-14 border border-ojo-mustard/20 shadow-4xl relative overflow-hidden"
          style={{ borderRadius: '4rem 4rem 1.5rem 1.5rem' }}>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <MotifSystem type="jaali" scale={0.4} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="ojo-label-verified ojo-label !px-6 shadow-sm !bg-ojo-charcoal text-white border-none">Master Registry Access v2.2</span>
                <div className="h-px w-10 bg-ojo-mustard/30" />
              </div>
              <h1 className="text-4xl font-serif italic text-ojo-charcoal tracking-tighter">Registry Command.</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard mt-3">Authorized Sovereign Control Node</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex bg-ojo-cream/60 p-1.5 rounded-[2rem] border border-ojo-stone/10">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'products', label: 'Artifacts' },
                  { id: 'vendors', label: 'Guilds' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-ojo-charcoal text-white shadow-xl' : 'text-ojo-charcoal/40 hover:text-ojo-charcoal'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowAddProduct(true)}
                className="ojo-btn-primary !px-10 !py-4 shadow-2xl shadow-ojo-mustard/20 flex items-center gap-3"
              >
                <Plus size={16} /> <span className="mt-0.5">Add Artifact</span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: "Orders Dispatched", value: stats.orders, icon: <ShoppingBag />, color: "text-ojo-mustard", sub: "Global heritage flow" },
                { label: "Master Artisans", value: stats.vendors, icon: <Users />, color: "text-ojo-terracotta", sub: "Guild members active" },
                { label: "Revenue Archive", value: `₹${stats.revenue.toLocaleString()}`, icon: <TrendingUp />, color: "text-ojo-charcoal", sub: "Secured transactions" },
                { label: "Inventory Registry", value: stats.products, icon: <Activity />, color: "text-green-600", sub: "Verified artifacts" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[3rem] border border-ojo-stone/10 shadow-sm space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl bg-ojo-cream ${stat.color} shadow-inner`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif italic text-ojo-charcoal">{stat.value}</h3>
                    <p className="text-xs text-ojo-charcoal/40 font-black uppercase tracking-widest mt-2">{stat.label}</p>
                    <p className="text-[10px] text-ojo-mustard font-bold mt-4">{stat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Recent Transactions */}
              <div className="bg-white rounded-[4rem] border border-ojo-stone/10 shadow-sm overflow-hidden h-fit">
                <div className="p-10 border-b border-ojo-stone/10 flex justify-between items-center">
                  <h3 className="text-xl font-serif italic text-ojo-charcoal">Registry Movements</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-ojo-cream/50 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">
                      <tr>
                        <th className="px-10 py-6">Identity</th>
                        <th className="px-10 py-6">Value</th>
                        <th className="px-10 py-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ojo-stone/5">
                      {recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-ojo-cream/20 transition-colors">
                           <td className="px-10 py-8">
                            <div className="font-serif italic text-[15px]">{order.customerName || "Member"}</div>
                          </td>
                          <td className="px-10 py-8 font-mono text-base font-bold text-ojo-charcoal">₹{order.total?.toLocaleString()}</td>
                          <td className="px-10 py-8">
                            <span className={`ojo-label px-6 py-2 text-[9px] ${
                              order.status === 'delivered' ? '!bg-green-100 !text-green-700 !border-green-200' :
                              order.status === 'pending' ? '!bg-amber-100 !text-amber-700 !border-amber-200' :
                              '!bg-ojo-cream !text-ojo-charcoal'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Verifications */}
              <div className="bg-white rounded-[4rem] border border-ojo-stone/10 shadow-sm overflow-hidden h-fit">
                <div className="p-10 border-b border-ojo-stone/10 flex justify-between items-center">
                  <h3 className="text-xl font-serif italic text-ojo-charcoal">Authentication Queue</h3>
                </div>
                <div className="p-10 space-y-6">
                  {products.filter(p => p.status === 'pending' || !p.status || p.status === 'PENDING').slice(0, 3).map(prod => (
                    <div key={prod.id} className="flex items-center justify-between p-8 bg-ojo-cream rounded-[2.5rem] border border-ojo-stone/5 group">
                       <div className="flex gap-6 items-center">
                          <div className="w-16 h-16 rounded-2xl bg-white shadow-inner flex items-center justify-center text-ojo-mustard">
                             <ShieldCheck size={24} />
                          </div>
                          <div>
                             <h4 className="text-[15px] font-serif italic text-ojo-charcoal">{prod.name}</h4>
                             <p className="text-[10px] text-ojo-charcoal/40 uppercase tracking-widest mt-1">{prod.origin} • {prod.category}</p>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <button 
                            onClick={() => updateProductStatus(prod.id, 'verified')}
                            className="w-10 h-10 rounded-xl bg-white border border-ojo-stone/10 flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors shadow-sm"
                          >
                             <CheckCircle2 size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
                  {products.filter(p => p.status === 'pending' || !p.status || p.status === 'PENDING').length === 0 && (
                    <div className="text-center py-10 text-ojo-charcoal/40 italic">Registry is unified. No pending artifacts.</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-[4rem] border border-ojo-stone/10 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-ojo-stone/10 flex justify-between items-center">
              <h3 className="text-xl font-serif italic text-ojo-charcoal">Inventory Registry</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ojo-stone" />
                <input placeholder="Search artifacts..." className="bg-ojo-cream/50 rounded-full pl-12 pr-6 py-2 text-xs outline-none focus:ring-1 ring-ojo-mustard transition-all" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-ojo-cream/50 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">
                  <tr>
                    <th className="px-10 py-6">Artifact</th>
                    <th className="px-10 py-6">Provenance</th>
                    <th className="px-10 py-6">Valuation</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ojo-stone/5">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-ojo-cream/20 transition-colors">
                      <td className="px-10 py-8">
                        <div className="font-serif italic text-[15px]">{prod.name}</div>
                        <div className="text-[10px] text-ojo-charcoal/40 uppercase tracking-widest">{prod.category}</div>
                      </td>
                      <td className="px-10 py-8 text-ojo-charcoal/60 text-sm italic">{prod.origin}</td>
                      <td className="px-10 py-8 font-mono text-ojo-charcoal">₹{prod.price?.toLocaleString()}</td>
                      <td className="px-10 py-8">
                        <span className={`ojo-label px-6 py-2 text-[8px] ${prod.status === 'verified' || prod.status === 'live' ? '!bg-ojo-mustard/10 !text-ojo-mustard !border-ojo-mustard/20' : '!bg-ojo-cream !text-ojo-charcoal'}`}>
                          {prod.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex gap-2">
                           <button className="p-2 hover:bg-ojo-cream rounded-lg transition-colors text-ojo-charcoal/40"><Activity size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="bg-white rounded-[4rem] border border-ojo-stone/10 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-ojo-stone/10">
              <h3 className="text-xl font-serif italic text-ojo-charcoal">Guild Members (Artisans)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
              {vendors.map(vendor => (
                <div key={vendor.id} className="p-8 bg-ojo-cream rounded-[3rem] border border-ojo-stone/10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-ojo-charcoal text-white flex items-center justify-center text-4xl shadow-2xl uppercase">
                      {vendor.email[0]}
                    </div>
                    <span className="ojo-label-verified ojo-label">Verified Guild</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-serif italic text-ojo-charcoal">{vendor.email.split('@')[0]}</h4>
                    <p className="text-[10px] text-ojo-charcoal/40 font-black uppercase tracking-widest mt-1">{vendor.email}</p>
                  </div>
                  <div className="pt-6 border-t border-ojo-stone/10 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white border border-ojo-cream shadow-sm" />
                      ))}
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">Access Portfolio</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Logs Section */}
        <div className="bg-ojo-charcoal rounded-[4rem] border border-white/10 shadow-4xl p-16 space-y-12 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 opacity-10 pointer-events-none p-10">
              <Activity size={100} />
           </div>
           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <Activity size={24} className="text-ojo-mustard" />
                <h3 className="text-xl font-serif italic">System Pulse Registry</h3>
              </div>
              <div className="space-y-8">
                 {activityLogs.map((log, i) => (
                   <div key={log.id || i} className="flex gap-6 relative group">
                      <div className="flex flex-col items-center">
                         <div className="w-2 h-2 rounded-full bg-ojo-mustard shadow-[0_0_10px_rgba(212,163,115,1)]" />
                         <div className="w-px flex-1 bg-white/10 my-2" />
                      </div>
                      <div className="pb-8 space-y-2">
                         <div className="text-[9px] font-black uppercase tracking-widest text-ojo-mustard">{log.event}</div>
                         <p className="text-sm text-white/60 font-light italic leading-snug">{log.details}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-ojo-charcoal/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-ojo-cream rounded-[4rem] p-12 max-w-2xl w-full shadow-4xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif italic text-ojo-charcoal">New Legacy Item</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-charcoal/40">Inscribe into the registry</p>
              </div>

              <form onSubmit={handleCreateProduct} className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Artifact Designation</label>
                  <input 
                    required 
                    className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-4 outline-none focus:border-ojo-mustard transition-colors text-sm"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Registry Group</label>
                  <select 
                    className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-4 outline-none focus:border-ojo-mustard transition-colors text-sm"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    {["Tea", "Saree", "Handicraft", "Jewelry", "Spice"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Provenance (Region)</label>
                  <input 
                    required 
                    className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-4 outline-none focus:border-ojo-mustard transition-colors text-sm"
                    value={newProduct.origin}
                    onChange={e => setNewProduct({...newProduct, origin: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Valuation (₹)</label>
                  <input 
                    type="number" required 
                    className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-4 outline-none focus:border-ojo-mustard transition-colors text-sm font-mono"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Reservation (Stock)</label>
                  <input 
                    type="number" required 
                    className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-4 outline-none focus:border-ojo-mustard transition-colors text-sm font-mono"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Chronicle (Description)</label>
                  <textarea 
                    required rows={3}
                    className="w-full bg-white border border-ojo-stone/10 rounded-[2rem] px-8 py-6 outline-none focus:border-ojo-mustard transition-colors text-sm"
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                <div className="col-span-2 flex gap-4 pt-4">
                  <button type="submit" className="ojo-btn-primary flex-1 py-4 !text-[11px]">Authorize Artifact</button>
                  <button type="button" onClick={() => setShowAddProduct(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:text-ojo-mustard">Rescind</button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


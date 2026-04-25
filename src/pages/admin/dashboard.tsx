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
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Stats (Mocked counts for demo, real implementation would use aggregations)
        const ordersSnap = await getDocs(collection(db, "orders"));
        const usersSnap = await getDocs(collection(db, "users"));
        
        let revenue = 0;
        const orders = ordersSnap.docs.map(doc => {
          const data = doc.data();
          revenue += data.total || 0;
          return { id: doc.id, ...data } as Order;
        });

        setStats({
          users: usersSnap.size,
          orders: ordersSnap.size,
          revenue
        });

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
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setRecentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      
      // Log transition
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
    <div className="min-h-screen bg-ojo-cream p-6 md:p-12 font-sans selection:bg-ojo-mustard selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span className="ojo-label-verified ojo-label shadow-sm">Sovereign Admin Panel v1.0</span>
            <h1 className="text-4xl font-serif italic text-ojo-charcoal tracking-tighter mt-4">Registry Control.</h1>
          </div>
          <div className="flex gap-4">
            <button className="ojo-btn-outline !px-8 !py-3 flex items-center gap-3">
              <Search size={18} /> Search Logs
            </button>
            <button className="ojo-btn-primary !px-8 !py-3 flex items-center gap-3 shadow-xl shadow-ojo-mustard/20">
              <Plus size={18} /> New Product
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: "Total Artifacts", value: stats.orders, icon: <ShoppingBag />, color: "text-ojo-mustard", sub: "+12% this month" },
            { label: "Sovereign Users", value: stats.users, icon: <Users />, color: "text-ojo-terracotta", sub: "Active registry members" },
            { label: "Revenue Archive", value: `₹${stats.revenue.toLocaleString()}`, icon: <TrendingUp />, color: "text-ojo-charcoal", sub: "Processed transactions" },
            { label: "System Health", value: "99.9%", icon: <Activity />, color: "text-green-600", sub: "Uptime verified" }
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
                <span className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/30">Live Data</span>
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
          {/* Order Management Table */}
          <div className="bg-white rounded-[4rem] border border-ojo-stone/10 shadow-sm overflow-hidden h-fit">
            <div className="p-10 border-b border-ojo-stone/10 flex justify-between items-center">
              <h3 className="text-xl font-serif italic text-ojo-charcoal">Recent Transactions</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-ojo-cream/50 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40">
                  <tr>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6">Customer</th>
                    <th className="px-10 py-6">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ojo-stone/5">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-ojo-cream/20 transition-colors">
                      <td className="px-10 py-8">
                        <span className={`ojo-label px-6 py-2 text-[9px] ${
                          order.status === 'delivered' ? '!bg-green-100 !text-green-700 !border-green-200' :
                          order.status === 'pending' ? '!bg-amber-100 !text-amber-700 !border-amber-200' :
                          '!bg-ojo-cream !text-ojo-charcoal'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-ojo-charcoal">
                        <div className="font-serif italic text-[15px]">{order.customerName || "Registry Member"}</div>
                      </td>
                      <td className="px-10 py-8 font-mono text-base font-bold text-ojo-charcoal">₹{order.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Verification */}
          <div className="bg-white rounded-[4rem] border border-ojo-stone/10 shadow-sm overflow-hidden h-fit">
            <div className="p-10 border-b border-ojo-stone/10 flex justify-between items-center">
              <h3 className="text-xl font-serif italic text-ojo-charcoal">Registry Verification</h3>
              <span className="ojo-label-verified ojo-label !bg-amber-50 !text-amber-700 !border-amber-200">Pending Artifacts</span>
            </div>
            <div className="p-10 space-y-6">
              {[
                { name: "Vintage Kantha Hand-stitch", origin: "West Bengal", vendor: "Maya Textiles", id: "049" },
                { name: "Blue Pottery Lattice Vase", origin: "Rajasthan", vendor: "Jaipur Arts", id: "102" }
              ].map(prod => (
                <div key={prod.id} className="flex items-center justify-between p-8 bg-ojo-cream rounded-[2.5rem] border border-ojo-stone/5 hover:border-ojo-mustard/20 transition-all group">
                   <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-inner flex items-center justify-center text-ojo-stone/20">
                         <ShieldCheck size={24} />
                      </div>
                      <div>
                         <h4 className="text-[15px] font-serif italic text-ojo-charcoal">{prod.name}</h4>
                         <p className="text-[10px] text-ojo-charcoal/40 uppercase tracking-widest mt-1">{prod.origin} • By {prod.vendor}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-xl bg-white border border-ojo-stone/10 flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors shadow-sm">
                         <CheckCircle2 size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-white border border-ojo-stone/10 flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors shadow-sm">
                         <XCircle size={18} />
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Activity Logs Sidebar (Moved to bottom full width) */}
          <div className="bg-ojo-charcoal rounded-[4rem] border border-white/10 shadow-4xl p-16 space-y-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 opacity-10 pointer-events-none p-10">
                <Activity size={100} />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <Activity size={24} className="text-ojo-mustard" />
                  <h3 className="text-xl font-serif italic">System Pulse</h3>
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
                           <time className="text-[8px] text-white/20 block uppercase tracking-widest">
                             {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : "Just now"}
                           </time>
                        </div>
                     </div>
                   ))}
                   {activityLogs.length === 0 && (
                     <div className="text-white/20 italic text-center py-10">Waiting for system logs...</div>
                   )}
                </div>

                <button className="w-full ojo-btn-outline !bg-white/5 !text-white !border-white/10 !py-4 shadow-2xl">
                   Archive History
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

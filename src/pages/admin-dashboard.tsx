import { useState, useEffect } from "react";
import { api } from "../lib/api.ts";
import { ShieldAlert, UserCheck, Eye, CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";

export function AdminDashboard() {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/products/pending")
      .then(setPendingProducts)
      .finally(() => setLoading(false));
  }, []);

  const verifyProduct = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await api.post(`/admin/products/${id}/verify`, { status, comments: "Admin review passed" });
      setPendingProducts(pendingProducts.filter(p => p.id !== id));
      alert(`Product ${status.toLowerCase()} successfully.`);
    } catch (err) {
      alert("Verification failed.");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif">Verification Engine</h1>
          <p className="text-sm text-charcoal/50">Authorize artisan submissions and maintain authenticity logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="ojo-card flex gap-4 items-center">
          <div className="w-12 h-12 bg-mustard/10 rounded-full flex items-center justify-center text-mustard">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="text-2xl font-mono">{pendingProducts.length}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Awaiting Audit</div>
          </div>
        </div>
        <div className="ojo-card flex gap-4 items-center border-l-4 border-mustard">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="text-2xl font-mono">0</div>
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">New Vendor KYC</div>
          </div>
        </div>
        <div className="ojo-card flex gap-4 items-center">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-charcoal/40">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-2xl font-mono">100%</div>
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Integrity Score</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-serif italic">Pending Verifications</h3>
        
        {loading ? (
          <div className="py-12 text-center text-warm-cream italic">Auditing metadata...</div>
        ) : pendingProducts.length === 0 ? (
          <div className="ojo-card py-24 text-center">
             <p className="text-charcoal/30 italic">No products currently awaiting verification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingProducts.map(p => (
              <motion.div 
                key={p.id}
                layout
                className="ojo-card flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                <div className="w-24 h-32 bg-neutral-50 border border-warm-cream/10 shrink-0"></div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">{p.origin}</span>
                    <span className="text-[10px] text-charcoal/40 italic">Submitted by {p.vendor.name}</span>
                  </div>
                  <h4 className="text-xl font-serif">{p.name}</h4>
                  <p className="text-xs text-charcoal/60 line-clamp-2 max-w-2xl">{p.description}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => verifyProduct(p.id, 'VERIFIED')}
                    className="flex-1 md:flex-none p-3 text-green-600 border border-green-200 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest"
                  >
                    <CheckCircle size={16} /> Authorize
                  </button>
                  <button 
                    onClick={() => verifyProduct(p.id, 'REJECTED')}
                    className="flex-1 md:flex-none p-3 text-red-600 border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

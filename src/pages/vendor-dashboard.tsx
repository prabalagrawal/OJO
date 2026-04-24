import { useState, useEffect } from "react";
import { api } from "../lib/api.ts";
import { Plus, Package, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

export function VendorDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", origin: "", stock: "" });

  useEffect(() => {
    // We'd need an API to list "my" products. 
    // For now we'll just list all and filter by current vendor if we have a way.
    // Or just fetch all and assume the vendor can see theirs.
    api.get("/products").then(setProducts);
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/products", { ...newProduct, images: JSON.stringify([]) });
      setShowAdd(false);
      window.location.reload();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif">Vendor Atelier</h1>
          <p className="text-sm text-charcoal/50">Manage your authentic creations and tracking</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="ojo-btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Creation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="ojo-card flex flex-col items-center justify-center py-10 space-y-2">
          <div className="text-3xl font-mono text-terracotta">{products.length}</div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Active Listings</div>
        </div>
        <div className="ojo-card flex flex-col items-center justify-center py-10 space-y-2">
          <div className="text-3xl font-mono text-mustard">0</div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Pending Verification</div>
        </div>
        <div className="ojo-card flex flex-col items-center justify-center py-10 space-y-2 col-span-2">
          <div className="text-3xl font-mono text-charcoal">₹0</div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Total Escrow Revenue</div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-serif italic flex items-center gap-2">
          <Package size={20} className="text-mustard" /> Your Collection
        </h3>
        <div className="ojo-card !p-0 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-warm-cream/20 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-cream/10">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50/50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[10px] text-charcoal/40 italic">{p.origin}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">{p.stock}</td>
                  <td className="px-6 py-4 font-mono">₹{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 uppercase font-bold tracking-tighter rounded-full ${p.verificationStatus === 'VERIFIED' ? 'bg-mustard/10 text-mustard' : 'bg-neutral-100 text-charcoal/40'}`}>
                      {p.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="ojo-card max-w-xl w-full space-y-8"
          >
            <h2 className="text-3xl font-serif italic">New Submission</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Product Name</label>
                <input 
                  required 
                  className="w-full border-b border-warm-cream py-2 outline-none focus:border-mustard transition-colors text-sm"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Description</label>
                <textarea 
                  required 
                  rows={3}
                  className="w-full border border-warm-cream p-4 outline-none focus:border-mustard transition-colors text-sm"
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Price (₹)</label>
                <input 
                  type="number" 
                  required 
                  className="w-full border-b border-warm-cream py-2 outline-none focus:border-mustard transition-colors text-sm"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Stock</label>
                <input 
                  type="number" 
                  required 
                  className="w-full border-b border-warm-cream py-2 outline-none focus:border-mustard transition-colors text-sm"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Origin (e.g. Darjeeling)</label>
                <input 
                  required 
                  className="w-full border-b border-warm-cream py-2 outline-none focus:border-mustard transition-colors text-sm"
                  value={newProduct.origin}
                  onChange={e => setNewProduct({...newProduct, origin: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex gap-4 pt-6">
                <button type="submit" className="ojo-btn-primary flex-1">Submit for Verification</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-3 text-xs uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import { Plus, Package, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function VendorDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", origin: "", stock: "", category: "Tea" });

  const loadProducts = async () => {
    setLoading(true);
    const path = "products";
    try {
      // In a real app we'd filter by vendorId
      const q = query(collection(db, path));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const path = "products";
    try {
      await addDoc(collection(db, path), { 
        ...newProduct, 
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        images: JSON.stringify([]),
        verificationStatus: "PENDING",
        addedAt: new Date().toISOString()
      });
      setShowAdd(false);
      toast.success("Product submitted for review");
      loadProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-ojo-mustard" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif">Seller Dashboard</h1>
          <p className="text-sm text-charcoal/50">Manage your authentic products and orders</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="ojo-btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="ojo-card flex flex-col items-center justify-center py-10 space-y-2">
          <div className="text-3xl font-mono text-ojo-terracotta">{products.length}</div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Active Listings</div>
        </div>
        <div className="ojo-card flex flex-col items-center justify-center py-10 space-y-2">
          <div className="text-3xl font-mono text-ojo-mustard">
            {products.filter(p => p.verificationStatus === 'PENDING').length}
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Pending Verification</div>
        </div>
        <div className="ojo-card flex flex-col items-center justify-center py-10 space-y-2 col-span-2">
          <div className="text-3xl font-mono text-ojo-charcoal">₹{products.reduce((acc, p) => acc + (p.price || 0), 0).toLocaleString()}</div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Total Inventory Value</div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-serif italic flex items-center gap-2">
          <Package size={20} className="text-ojo-mustard" /> Your Collection
        </h3>
        <div className="ojo-card !p-0 overflow-hidden bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-ojo-stone/10 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ojo-stone/10">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-ojo-charcoal">{p.name}</div>
                    <div className="text-[10px] text-ojo-charcoal/40 italic">{p.origin}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">{p.stock}</td>
                  <td className="px-6 py-4 font-mono">₹{p.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 uppercase font-bold tracking-tighter rounded-full ${p.verificationStatus === 'VERIFIED' ? 'bg-ojo-mustard/10 text-ojo-mustard' : 'bg-neutral-100 text-ojo-charcoal/40'}`}>
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
        <div className="fixed inset-0 bg-ojo-charcoal/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="ojo-card max-w-xl w-full space-y-8 bg-ojo-cream"
          >
            <h2 className="text-3xl font-serif italic">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Product Name</label>
                <input 
                  required 
                  className="w-full bg-transparent border-b border-ojo-stone/30 py-2 outline-none focus:border-ojo-mustard transition-colors text-sm"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Category</label>
                <select 
                  className="w-full bg-transparent border-b border-ojo-stone/30 py-2 outline-none focus:border-ojo-mustard transition-colors text-sm"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  {["Tea", "Saree", "Handicraft", "Jewelry", "Spice"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Description</label>
                <textarea 
                  required 
                  rows={3}
                  className="w-full bg-transparent border border-ojo-stone/30 p-4 outline-none focus:border-ojo-mustard transition-colors text-sm rounded-xl"
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Price (₹)</label>
                <input 
                  type="number" 
                  required 
                  className="w-full bg-transparent border-b border-ojo-stone/30 py-2 outline-none focus:border-ojo-mustard transition-colors text-sm"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Stock</label>
                <input 
                  type="number" 
                  required 
                  className="w-full bg-transparent border-b border-ojo-stone/30 py-2 outline-none focus:border-ojo-mustard transition-colors text-sm"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Origin (e.g. Darjeeling)</label>
                <input 
                  required 
                  className="w-full bg-transparent border-b border-ojo-stone/30 py-2 outline-none focus:border-ojo-mustard transition-colors text-sm"
                  value={newProduct.origin}
                  onChange={e => setNewProduct({...newProduct, origin: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex gap-4 pt-6">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="ojo-btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Submit for Review
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 hover:text-ojo-charcoal transition-colors">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

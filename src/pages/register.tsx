import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { MotifSystem } from "../components/motifs.tsx";
import { OjoLogo } from "../components/brand.tsx";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: name,
        email,
        role: "customer",
        createdAt: serverTimestamp()
      });
      toast.success("Membership Established. Welcome to the Registry.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to establish membership record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      <MotifSystem type="kolam" opacity={0.06} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-ojo-cream border border-ojo-mustard/20 p-12 md:p-20 shadow-4xl relative z-10 space-y-12 overflow-hidden"
        style={{ borderRadius: '6rem 6rem 1.5rem 1.5rem' }}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <MotifSystem type="kolam" scale={0.4} />
        </div>
        
        <div className="text-center space-y-4 relative z-10">
          <div className="flex justify-center mb-8">
            <OjoLogo size="md" />
          </div>
          <h1 className="text-4xl font-serif italic text-ojo-charcoal tracking-tighter">Registry Enrollment</h1>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-ojo-mustard">Initiate Sovereign Membership</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Full Identity Name</label>
              <input 
                type="text" 
                required 
                className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-5 text-sm outline-none focus:border-ojo-mustard transition-all shadow-inner"
                placeholder="Ravi Kumar"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Registry Email</label>
              <input 
                type="email" 
                required 
                className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-5 text-sm outline-none focus:border-ojo-mustard transition-all shadow-inner"
                placeholder="patron@heritage.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Passphrase Key</label>
              <input 
                type="password" 
                required 
                className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-5 text-sm outline-none focus:border-ojo-mustard transition-all shadow-inner"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="ojo-btn-primary w-full flex items-center justify-center gap-3 !py-6 group"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <span>Establish Membership</span> 
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center space-y-6 pt-4">
          <p className="text-[10px] uppercase font-bold tracking-widest text-ojo-charcoal/40">
            Already have a record? <Link to="/login" className="text-ojo-mustard hover:underline underline-offset-4">Sign In to Vault</Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-ojo-terracotta">
            <ShieldCheck size={12} /> Data Protected by Registry Encryption
          </div>
        </div>
      </motion.div>
    </div>
  );
}

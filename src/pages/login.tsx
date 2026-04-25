import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { MotifSystem } from "../components/motifs.tsx";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Identity Verified. Welcome back.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to establish secure session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      <MotifSystem type="jaali" opacity={0.06} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-ojo-cream rounded-[4rem] p-12 md:p-20 shadow-4xl relative z-10 space-y-12"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-ojo-charcoal text-white flex items-center justify-center shadow-xl">
              <Lock size={28} />
            </div>
          </div>
          <h1 className="text-5xl font-serif italic text-ojo-charcoal">Secure Access</h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-ojo-charcoal/40">Enter the Sovereign Registry</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-4">Registry Email</label>
              <input 
                type="email" 
                required 
                className="w-full bg-white/50 border border-ojo-stone/20 rounded-full px-8 py-5 text-sm outline-none focus:border-ojo-mustard transition-all"
                placeholder="patron@heritage.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-4">Credential Key</label>
              <input 
                type="password" 
                required 
                className="w-full bg-white/50 border border-ojo-stone/20 rounded-full px-8 py-5 text-sm outline-none focus:border-ojo-mustard transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="ojo-btn-primary w-full flex items-center justify-center gap-3 !py-6"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>Establish Session <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="text-center space-y-6 pt-4">
          <p className="text-[10px] uppercase font-bold tracking-widest text-ojo-charcoal/40">
            No Registry Access? <Link to="/register" className="text-ojo-mustard hover:underline underline-offset-4">Establish Membership</Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-ojo-terracotta">
            <ShieldCheck size={12} /> Encrypted Origin Protection Active
          </div>
        </div>
      </motion.div>
    </div>
  );
}

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
      const isAdmin = email.toLowerCase() === 'prabalagrawal23@gmail.com';
      toast.success("Identity Verified. Welcome back.");
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
        className="w-full max-w-xl bg-ojo-cream border border-ojo-mustard/20 p-12 md:p-20 shadow-4xl relative z-10 space-y-12 overflow-hidden"
        style={{ borderRadius: '6rem 6rem 1.5rem 1.5rem' }}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <MotifSystem type="jaali" scale={0.4} />
        </div>
        
        <div className="text-center space-y-4 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-ojo-charcoal text-white flex items-center justify-center shadow-2xl transform rotate-45 border border-ojo-mustard/40"
              style={{ borderRadius: '1.5rem 0.2rem 1.5rem 0.2rem' }}>
              <div className="-rotate-45">
                <Lock size={24} />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-serif italic text-ojo-charcoal">Secure Access</h1>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-ojo-mustard">The Sovereign Registry</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60 ml-6">Registry Identity</label>
              <input 
                type="email" 
                required 
                className="w-full bg-white border border-ojo-stone/10 rounded-full px-8 py-5 text-sm outline-none focus:border-ojo-mustard transition-all shadow-inner"
                placeholder="patron@heritage.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center px-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/60">Passcode</label>
                <Link to="/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-ojo-mustard hover:underline underline-offset-4 decoration-ojo-mustard/30 transition-all">Forgot Passphrase?</Link>
              </div>
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
                <span>Establish Identity</span> 
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </>
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

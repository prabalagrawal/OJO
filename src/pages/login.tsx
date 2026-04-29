import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { MotifSystem } from "../components/motifs.tsx";
import { OjoLogo } from "../components/brand.tsx";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Firebase Login (existing)
      await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Express Backend Login (NEW)
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("ojo_user", JSON.stringify(data.user));
        }
      } catch (backendErr) {
        console.error("Backend auth failed", backendErr);
        // We still have firebase login so we can continue, but some features might be degraded
      }

      const isAdmin = email.toLowerCase() === 'prabalagrawal23@gmail.com';
      toast.success("Successfully logged in. Welcome back!");
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      <MotifSystem type="jaali" opacity={0.06} />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white border border-ojo-stone/20 p-12 md:p-24 shadow-premium relative z-10 space-y-16 overflow-hidden"
        style={{ borderRadius: '8rem 1rem 1rem 1rem' }}
      >
        <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none p-10 h-full w-full">
           <MotifSystem type="jaali" scale={0.4} />
        </div>
        
        <div className="text-center space-y-6 relative z-10">
          <div className="flex justify-center mb-10">
            <OjoLogo size="lg" />
          </div>
          <h1 className="text-5xl font-serif italic text-ojo-charcoal">Login</h1>
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-ojo-mustard">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-10 relative z-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/50 ml-8">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full bg-ojo-cream/50 border border-ojo-stone/10 rounded-full px-10 py-6 text-[15px] outline-none focus:border-ojo-mustard transition-all"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center px-8">
                <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/50">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard hover:opacity-70 transition-all">Forgot Password?</Link>
              </div>
              <input 
                type="password" 
                required 
                className="w-full bg-ojo-cream/50 border border-ojo-stone/10 rounded-full px-10 py-6 text-[15px] outline-none focus:border-ojo-mustard transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="ojo-btn-primary w-full flex items-center justify-center gap-4 !py-8 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Sign In</span> 
                <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center space-y-10 pt-6">
          <p className="text-xl text-ojo-charcoal/50 font-light italic">
            New to OJO? <Link to="/register" className="text-ojo-mustard !not-italic font-bold hover:underline">Create Account</Link>
          </p>
          <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-ojo-terracotta opacity-60">
            <ShieldCheck size={14} /> Secure Login Protected
          </div>
        </div>
      </motion.div>
    </div>
  );
}

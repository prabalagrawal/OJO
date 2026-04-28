import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion } from "motion/react";
import { Mail, ChevronLeft, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { MotifSystem } from "../components/motifs.tsx";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent", {
        description: "Check your email for the reset link."
      });
      navigate("/login");
    } catch (error: any) {
      toast.error("Error sending reset link", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ojo-cream flex items-center justify-center p-6 relative overflow-hidden">
      <MotifSystem type="jaali" opacity={0.05} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[4rem] p-12 md:p-16 shadow-4xl relative z-10 border border-ojo-stone/10"
      >
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-ojo-cream rounded-[2rem] flex items-center justify-center text-ojo-mustard shadow-inner">
              <Shield size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-serif italic text-ojo-charcoal tracking-tight">Reset Password</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-charcoal/40">Request a password reset link</p>
        </div>

        <form onSubmit={handleReset} className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 ml-6">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-ojo-stone group-focus-within:text-ojo-mustard transition-colors" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-ojo-cream/50 border border-ojo-stone/20 rounded-full pl-16 pr-8 py-5 text-sm outline-none focus:border-ojo-mustard transition-all"
                required
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="ojo-btn-primary w-full py-6 !text-[11px] shadow-4xl shadow-ojo-mustard/20"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link 
            to="/login" 
            className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/40 hover:text-ojo-mustard transition-colors inline-flex items-center gap-2"
          >
            <ChevronLeft size={14} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

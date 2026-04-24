import { useState, useEffect } from "react";
import { api } from "../lib/api.ts";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ArrowRight, Chrome } from "lucide-react";
import { OjoLogo } from "../components/brand.tsx";

export function Login({ onLogin }: { onLogin: (user: any, token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      const origin = event.origin;
      if (!origin.endsWith(".run.app") && !origin.includes("localhost")) {
        return;
      }
      
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        const { user, token } = event.data.payload;
        onLogin(user, token);
        navigate("/");
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLogin, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const { url } = await api.get("/auth/google/url");
      
      const authWindow = window.open(
        url,
        "ojo_google_auth",
        "width=600,height=700"
      );

      if (!authWindow) {
        setError("Popup blocked. Please enable popups for the registry vault.");
      }
    } catch (err) {
      console.error("Google login initiation failed:", err);
      setError("Failed to initiate Google identity audit.");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email identity is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid heritage ID (email)");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Security key is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Security key must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      const data = await api.post("/auth/login", { email, password });
      onLogin(data.user, data.token);
      navigate("/");
    } catch (err: any) {
      setError("Vault access denied. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-ojo-cream overflow-hidden">
      {/* LEFT: Branding Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-ojo-charcoal relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 pattern-jali opacity-5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-ojo-charcoal via-transparent to-ojo-terracotta/20" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <OjoLogo size="lg" dark />
        </motion.div>

        <div className="relative z-10 space-y-8">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif text-ojo-white leading-none tracking-tighter">
              Verified. <br/>
              Authentic. <br/>
              <span className="text-ojo-mustard italic">Trusted.</span>
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-6 text-ojo-white/40">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Provenance Audit</span>
            </div>
            <div className="w-px h-4 bg-ojo-white/20" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Transit</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
           <img 
            src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2670&auto=format&fit=crop" 
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-[80px] object-cover grayscale opacity-40 rotate-12"
            alt="Artisan Craft"
           />
        </div>
      </div>

      {/* RIGHT: Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <OjoLogo size="sm" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-serif text-ojo-charcoal tracking-tighter">Your gateway to verified authenticity</h2>
            <p className="text-sm text-ojo-charcoal/40 font-light max-w-xs">
              Access curated, verified products from across India through our sovereign registry.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="p-4 bg-ojo-terracotta/10 text-ojo-terracotta text-[10px] font-black uppercase tracking-widest border border-ojo-terracotta/20 rounded-2xl flex items-center gap-3"
              >
                <ShieldCheck size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div className="space-y-8">
              <div className="relative group">
                <label className={`absolute -top-3 left-0 text-[9px] font-black uppercase tracking-widest bg-ojo-cream px-1 z-10 transition-colors ${emailError ? "text-ojo-terracotta" : "text-ojo-mustard"}`}>Email Identity</label>
                <input 
                  type="email" 
                  className={`w-full bg-transparent border-b-2 py-4 outline-none transition-all text-sm font-medium ${emailError ? "border-ojo-terracotta" : "border-ojo-stone/40 focus:border-ojo-mustard focus:shadow-[0_8px_20px_-12px_rgba(176,126,30,0.4)]"}`}
                  placeholder="artisan@ojo.heritage"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                />
                <AnimatePresence>
                  {emailError && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute left-0 -bottom-5 text-[8px] font-black uppercase text-ojo-terracotta tracking-tighter"
                    >
                      {emailError}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative group">
                <label className={`absolute -top-3 left-0 text-[9px] font-black uppercase tracking-widest bg-ojo-cream px-1 z-10 transition-colors ${passwordError ? "text-ojo-terracotta" : "text-ojo-mustard"}`}>Security Key</label>
                <input 
                  type="password" 
                  className={`w-full bg-transparent border-b-2 py-4 outline-none transition-all text-sm font-medium ${passwordError ? "border-ojo-terracotta" : "border-ojo-stone/40 focus:border-ojo-mustard focus:shadow-[0_8px_20px_-12px_rgba(176,126,30,0.4)]"}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                />
                <AnimatePresence>
                  {passwordError && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute left-0 -bottom-5 text-[8px] font-black uppercase text-ojo-terracotta tracking-tighter"
                    >
                      {passwordError}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-ojo-mustard text-ojo-charcoal hover:bg-ojo-charcoal hover:text-ojo-white py-6 rounded-full font-black tracking-[0.4em] text-[10px] uppercase transition-all shadow-3xl flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : (
                <>
                  Enter Vault <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-grow bg-ojo-stone/20" />
              <span className="text-[10px] font-black uppercase text-ojo-stone tracking-widest">Or Secure Login With</span>
              <div className="h-px flex-grow bg-ojo-stone/20" />
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border-2 border-ojo-stone/20 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-ojo-charcoal hover:text-white transition-all text-xs font-black uppercase tracking-widest group disabled:opacity-50"
            >
              <Chrome size={18} className="group-hover:text-ojo-mustard" />
              Google Account
            </button>
          </div>

          <div className="text-center pt-8 border-t border-ojo-stone/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-ojo-charcoal/30">
              New to the registry? 
              <Link to="/register" className="ml-3 text-ojo-terracotta hover:text-ojo-mustard underline transition-colors">Apply for Membership</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

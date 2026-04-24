import { useState } from "react";
import { api } from "../lib/api.ts";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export function Login({ onLogin }: { onLogin: (user: any, token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.post("/auth/login", { email, password });
      onLogin(data.user, data.token);
      navigate("/");
    } catch (err: any) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ojo-card space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-serif">Sign in to OJO</h2>
          <p className="text-sm text-charcoal/50 mt-2">Enter your credentials to access your account</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full border-b border-warm-cream py-2 outline-none focus:border-mustard transition-colors text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold">Password</label>
            <input 
              type="password" 
              required 
              className="w-full border-b border-warm-cream py-2 outline-none focus:border-mustard transition-colors text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="ojo-btn-primary w-full py-4 mt-4">Sign In</button>
        </form>

        <div className="text-center text-xs text-charcoal/50 border-t border-warm-cream/20 pt-8">
          Don't have an account? <a href="/register" className="text-mustard font-bold hover:underline">Register</a>
        </div>
      </motion.div>
    </div>
  );
}

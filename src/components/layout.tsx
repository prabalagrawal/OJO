import { ReactNode } from "react";
import { OjoLogo } from "./brand.tsx";
import { ShoppingCart, User, LogOut, ShieldCheck, Store, CheckCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { MotifOrnamental, MotifRangoli, MotifTraditionalMandala, MotifTraditionalRangoli } from "./motifs.tsx";

interface LayoutProps {
  children: ReactNode;
  user: any;
  onLogout: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-ojo-beige relative antialiased maximalist-gradient">
      {/* Decorative Ornaments - Subtle background layers */}
      <div className="fixed inset-0 pattern-mandala opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 pattern-jali opacity-[0.015] pointer-events-none" />
      
      <header className="px-6 md:px-12 py-4 border-b border-ojo-stone/20 sticky top-0 z-50 bg-ojo-beige/80 backdrop-blur-xl">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] pattern-border-trim opacity-20" />
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <a href="/" className="hover:opacity-60 transition-opacity shrink-0">
              <OjoLogo size="sm" />
            </a>
            <div className="hidden lg:flex items-center gap-4 border-l border-ojo-stone/30 pl-6">
              {["Collections", "Artisans", "Registry", "About"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[9px] font-black uppercase tracking-[0.2em] text-ojo-charcoal/60 hover:text-ojo-terracotta transition-colors whitespace-nowrap">
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          {/* Compact Search Bar */}
          <div className="hidden md:block relative flex-1 max-w-md group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ojo-charcoal/30 group-focus-within:text-ojo-terracotta transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="w-full bg-white/30 backdrop-blur-md border border-ojo-stone/40 px-12 py-2.5 rounded-full text-[10px] font-medium placeholder:text-ojo-charcoal/30 focus:outline-none focus:ring-1 focus:ring-ojo-mustard transition-all"
              onChange={(e) => {
                const q = e.target.value;
                const url = new URL(window.location.href);
                if (q) url.searchParams.set("q", q);
                else url.searchParams.delete("q");
                window.history.replaceState({}, "", url);
                window.dispatchEvent(new Event("popstate"));
              }}
              defaultValue={new URLSearchParams(window.location.search).get("q") || ""}
            />
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden xl:flex items-center gap-2">
               <ShieldCheck size={12} className="text-ojo-mustard animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-[0.1em] text-ojo-charcoal/40">Sovereign Registry</span>
             </div>
             <div className="flex items-center gap-3">
                <button className="p-2 rounded-full border border-ojo-stone/40 hover:bg-white transition-all shadow-sm">
                  <User size={16} className="text-ojo-charcoal/60" />
                </button>
                {user && (
                  <button onClick={onLogout} className="p-2 text-ojo-terracotta hover:bg-ojo-terracotta/5 rounded-full transition-all">
                    <LogOut size={16} />
                  </button>
                )}
             </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1440px] mx-auto px-6 md:px-12 py-12 w-full relative z-10">
        {children}
      </main>

      <footer className="footer-maximalist bg-ojo-charcoal text-ojo-beige py-32 px-6 md:px-12 relative overflow-hidden mt-20">
        <div className="absolute inset-0 pattern-mandala opacity-[0.12] pointer-events-none scale-150 animate-spin-slow" />
        <div className="absolute inset-0 pattern-jali opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-0 pattern-lotus opacity-[0.08] pointer-events-none scale-50" />
        
        {/* Ornate Trims */}
        <div className="absolute top-0 left-0 right-0 h-6 pattern-border-trim opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-6 pattern-border-trim opacity-60 rotate-180" />
        
        {/* Floating Motifs */}
        <div className="absolute -bottom-32 -left-32 opacity-10 animate-spin-slow">
          <MotifTraditionalMandala size={600} color="#D4AF37" />
        </div>
        <div className="absolute top-20 right-20 opacity-[0.06] animate-float">
          <MotifTraditionalRangoli size={400} color="#A63F1D" />
        </div>
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4 space-y-12">
              <OjoLogo size="md" dark />
              <div className="space-y-6">
                <p className="text-sm border-l-2 border-ojo-mustard pl-8 font-serif italic text-ojo-stone/80 leading-relaxed">
                  "Truth is one, but the wise speak of it in many ways."
                </p>
                <p className="text-xs font-light opacity-50 max-w-sm leading-relaxed tracking-wide">
                  OJO is a global hallmark for Indian artifacts. We combine ancestral verification 
                  methods with modern provenance technology to protect the soul of Indian craft.
                </p>
              </div>
              <div className="flex gap-6">
                 {["Instagram", "Twitter", "Registry"].map(link => (
                   <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-mustard hover:text-white transition-colors">{link}</a>
                 ))}
              </div>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12 border-l border-ojo-beige/10 pl-0 lg:pl-20">
              <div className="space-y-8">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-ojo-mustard/60">Registry</h4>
                <ul className="space-y-4 text-[11px] font-medium opacity-60">
                   <li><a href="#" className="hover:text-ojo-mustard transition-colors flex items-center gap-2 underline decoration-ojo-mustard/20 decoration-2 underline-offset-4">Public Ledger</a></li>
                   <li><a href="#" className="hover:text-ojo-mustard transition-colors flex items-center gap-2 underline decoration-ojo-mustard/20 decoration-2 underline-offset-4">Artisan Verification</a></li>
                   <li><a href="#" className="hover:text-ojo-mustard transition-colors flex items-center gap-2 underline decoration-ojo-mustard/20 decoration-2 underline-offset-4">Provenance Lookup</a></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-ojo-mustard/60">Community</h4>
                <ul className="space-y-4 text-[11px] font-medium opacity-60">
                   <li><a href="#" className="hover:text-ojo-mustard transition-colors flex items-center gap-2 underline decoration-ojo-mustard/20 decoration-2 underline-offset-4">Artisan Circles</a></li>
                   <li><a href="#" className="hover:text-ojo-mustard transition-colors flex items-center gap-2 underline decoration-ojo-mustard/20 decoration-2 underline-offset-4">The Craft Story</a></li>
                   <li><a href="#" className="hover:text-ojo-mustard transition-colors flex items-center gap-2 underline decoration-ojo-mustard/20 decoration-2 underline-offset-4">Support Center</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1 p-8 bg-white/5 rounded-[32px] border border-white/10 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-ojo-mustard italic font-serif">Trust Protocol</h4>
                <p className="text-[10px] leading-relaxed opacity-40">
                  Every artifact in our registry is verified through a 3-tier validation process involving heritage experts and digital footprinting.
                </p>
                <ShieldCheck className="text-ojo-mustard/40" size={32} />
              </div>
            </div>
          </div>
          
          <div className="mt-32 pt-12 border-t border-ojo-beige/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] uppercase tracking-[0.5em] font-black opacity-30">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-ojo-mustard shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
              <span>OJO Sovereign Registry 2.0</span>
            </div>
            <div className="flex gap-12">
               <span>Privacy Charter</span>
               <span>Terms of Origin</span>
            </div>
            <span>© 2026 BRIDGING TRADITION & TRUTH</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

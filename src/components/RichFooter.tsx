import React from 'react';
import { motion } from 'motion/react';
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  MapPin, 
  Mail, 
  Phone,
  ShieldCheck,
  Award,
  Globe
} from 'lucide-react';
import { PatternDivider } from './motifs';

export function RichFooter() {
  return (
    <footer className="bg-[#111111] text-ojo-beige pt-2 relative overflow-hidden">
       {/* Pattachitra Border */}
       <div className="absolute top-0 inset-x-0 h-2 opacity-50">
          <PatternDivider type="waves" />
       </div>

       <div className="max-w-[1440px] mx-auto px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 mb-24 border-b border-white/5 pb-24">
             {/* COL 1: Brand */}
             <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-serif tracking-[0.2em] font-light">OJO</h2>
                  <p className="text-ojo-stone/60 text-sm font-serif italic leading-relaxed">
                    Connecting the world to India's most profound handcrafted heritage. 
                    Verified at source, tracked to your doorstep.
                  </p>
                </div>
                <div className="flex gap-6">
                   {[Instagram, Youtube, Twitter].map((Icon, i) => (
                     <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-ojo-gold hover:text-ojo-charcoal transition-all">
                        <Icon size={18} />
                     </a>
                   ))}
                </div>
             </div>

             {/* COL 2: Shop */}
             <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-gold">The Catalog</h4>
                <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-ojo-stone/60">
                   {['All Treasures', 'New Arrivals', 'Bestsellers', 'Ancient Textiles', 'Temple Jewelry', 'Village Pottery'].map(link => (
                     <li key={link}><a href="#" className="hover:text-ojo-mustard transition-colors">{link}</a></li>
                   ))}
                </ul>
             </div>

             {/* COL 3: Care */}
             <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-gold">Patron Support</h4>
                <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-ojo-stone/60">
                   {['Track Narrative', 'Returns & Rebirth', 'Provenance FAQs', 'Artisan Registry', 'Size Cartography'].map(link => (
                     <li key={link}><a href="#" className="hover:text-ojo-mustard transition-colors">{link}</a></li>
                   ))}
                </ul>
             </div>

             {/* COL 4: Community */}
             <div className="space-y-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-gold">Join the Collective</h4>
                <p className="text-sm text-ojo-stone italic">Receive tales of new crafts and exclusive artisan drops. Join 50,000+ patrons.</p>
                <div className="flex gap-2">
                   <input 
                     type="email" 
                     placeholder="CITIZEN@OJO.COM" 
                     className="bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black tracking-widest outline-none focus:border-ojo-gold w-full"
                   />
                   <button className="bg-ojo-gold text-ojo-charcoal px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#A89520] transition-colors">
                      Subscribe
                   </button>
                </div>
                <div className="flex items-center gap-4 text-ojo-mustard/40">
                   <ShieldCheck size={16} />
                   <span className="text-[9px] font-bold uppercase tracking-widest">Sovereign Encryption</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-ojo-stone/40">
             <div className="flex items-center gap-8">
                <span>© 2026 OJO Marketplace</span>
                <span className="hidden md:inline">•</span>
                <span>Crafted with ♥ in Bharat</span>
             </div>

             <div className="flex items-center gap-8 grayscale opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4" alt="UPI" />
                <div className="flex gap-4">
                   <div className="w-8 h-5 bg-white/20 rounded-sm" />
                   <div className="w-8 h-5 bg-white/20 rounded-sm" />
                   <div className="w-8 h-5 bg-white/20 rounded-sm" />
                </div>
             </div>

             <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition-colors">Digital Constitution</a>
                <a href="#" className="hover:text-white transition-colors">Citizen Privacy</a>
             </div>
          </div>
       </div>

       {/* Bottom Jali */}
       <div className="h-20 bg-ojo-gold/5 flex items-center justify-center opacity-30">
          <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-ojo-gold to-transparent" />
       </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, ShieldCheck, Star, X } from 'lucide-react';
import { MotifSystem } from './motifs';

interface StateData {
  id: string;
  name: string;
  path: string;
  description: string;
  famousFor: string[];
  pattern: any;
  img: string;
}

const STATES_DATA: StateData[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    path: "M140,160 L180,140 L220,160 L240,220 L200,260 L140,240 Z", // Simplified paths
    description: "The land of kings, known for its vibrant block prints and heritage jewelry.",
    famousFor: ["Bagru Prints", "Blue Pottery", "Kundan Jewelry"],
    pattern: "bagru",
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    path: "M100,240 L140,240 L160,280 L140,320 L80,300 Z",
    description: "Home to the intricate Ajrakh patterns and world-famous Patola silks.",
    famousFor: ["Ajrakh Prints", "Patola Silk", "Bandhani"],
    pattern: "ajrakh",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    path: "M160,280 L220,260 L260,300 L240,380 L180,400 L140,360 Z",
    description: "A hub of tribal Warli art and Paithani silk traditions.",
    famousFor: ["Warli Art", "Paithani Saree", "Kolhapuri Chappals"],
    pattern: "warli",
    img: "https://images.unsplash.com/photo-1599940859674-a7fef12b94a0?q=80&w=2600&auto=format&fit=crop"
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    path: "M400,220 L440,240 L460,300 L420,340 L380,300 Z",
    description: "Famed for its fine Jamdani weaves and heritage terracotta crafts.",
    famousFor: ["Jamdani Silk", "Kantha Embroidery", "Terracotta Art"],
    pattern: "jaali",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    path: "M180,40 L240,20 L280,60 L240,100 L180,100 Z",
    description: "The crown of India, producing the world's finest Pashmina and Sozni embroidery.",
    famousFor: ["Pashmina Shawls", "Sozni Embroidery", "Paper Mache"],
    pattern: "sozni",
    img: "https://images.unsplash.com/photo-1594191543882-626dfca15494?q=80&w=2574&auto=format&fit=crop"
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    path: "M240,480 L300,480 L320,540 L280,600 L220,560 Z",
    description: "Southern heritage known for Kanchipuram silks and sacred Kolam patterns.",
    famousFor: ["Kanchipuram Silk", "Thanjavur Paintings", "Bronze Idols"],
    pattern: "kolam",
    img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2610&auto=format&fit=crop"
  }
];

export function IndiaExplorer({ onStateClick }: { onStateClick: (state: StateData) => void }) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Since a full SVG map is complex for this demo, we'll use a stylized interactive grid 
  // with a background map silhouette 
  return (
    <div className="relative w-full aspect-square md:aspect-video bg-ojo-cream rounded-[4rem] overflow-hidden border border-ojo-mustard/10 shadow-inner">
       {/* Map Silhouette Placeholder */}
       <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/India_map_blank.svg" className="h-[90%] grayscale" alt="India Map" />
       </div>

       <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
          <div className="space-y-4">
            <span className="ojo-label-verified ojo-label">Interactive Atlas</span>
            <h3 className="text-4xl font-serif italic text-ojo-charcoal">The Geography of Trust</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATES_DATA.map((state) => (
              <motion.button
                key={state.id}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onStateClick(state)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="group p-8 bg-white/60 backdrop-blur-xl border border-ojo-mustard/10 rounded-[2.5rem] text-left transition-all hover:bg-white hover:shadow-4xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowRight size={20} className="text-ojo-mustard" />
                </div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                   <MotifSystem type={state.pattern} scale={0.5} />
                </div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-ojo-mustard/10 flex items-center justify-center text-ojo-mustard">
                      <MapPin size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ojo-mustard">Cluster {state.id.slice(0,3).toUpperCase()}</span>
                  </div>
                  <h4 className="text-2xl font-serif italic text-ojo-charcoal">{state.name}</h4>
                  <p className="text-xs text-ojo-charcoal/50 leading-relaxed line-clamp-2">{state.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
       </div>

       <AnimatePresence>
          {hoveredState && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none border-4 border-ojo-mustard/20 z-20 rounded-[4rem]"
            />
          )}
       </AnimatePresence>
    </div>
  );
}

export function StateDrawer({ state, isOpen, onClose }: { state: StateData | null, isOpen: boolean, onClose: () => void }) {
  if (!state) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ojo-charcoal/40 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-4xl z-[70] overflow-y-auto"
          >
            <div className="relative h-96">
               <img src={state.img} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
               <button 
                 onClick={onClose}
                 className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center shadow-xl hover:bg-white transition-all group"
               >
                 <X size={24} className="text-ojo-charcoal group-hover:rotate-90 transition-transform duration-500" />
               </button>
            </div>

            <div className="p-16 -mt-32 relative z-10 space-y-12">
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                   <div className="p-4 bg-ojo-mustard text-white rounded-2xl shadow-xl shadow-ojo-mustard/20">
                     <MapPin size={24} />
                   </div>
                   <div>
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard">State Cluster Registry</span>
                     <h2 className="text-6xl font-serif italic text-ojo-charcoal tracking-tighter">{state.name}</h2>
                   </div>
                 </div>
                 <p className="text-xl text-ojo-charcoal/60 leading-relaxed font-light italic">
                   {state.description}
                 </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-ojo-cream rounded-[2rem] border border-ojo-mustard/10">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-ojo-mustard mb-4 flex items-center gap-2">
                       <ShieldCheck size={14} /> Heritage Audit
                    </h4>
                    <p className="text-ojo-charcoal font-bold mb-4">Legacy techniques preserved in this cluster:</p>
                    <ul className="space-y-3">
                       {state.famousFor.map(f => (
                         <li key={f} className="flex items-center gap-3 text-sm text-ojo-charcoal/60">
                           <div className="w-1.5 h-1.5 rounded-full bg-ojo-mustard" />
                           {f}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="p-8 bg-ojo-charcoal text-white rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <MotifSystem type={state.pattern} opacity={0.1} />
                    <div className="relative z-10">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-ojo-mustard mb-4 flex items-center gap-2">
                         <Star size={14} fill="currentColor" /> Trust Insight
                      </h4>
                      <p className="text-sm opacity-80 leading-relaxed">
                        Every purchase from {state.name} contributes directly to a community-led artisan welfare fund, verified by our regional field teams.
                      </p>
                    </div>
                 </div>
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-serif italic">Verified Catalog</h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-ojo-mustard hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {[1, 2].map(i => (
                      <div key={i} className="space-y-4 group cursor-pointer">
                        <div className="aspect-[3/4] bg-ojo-cream rounded-3xl overflow-hidden border border-ojo-stone/10 shadow-md transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                          <div className="w-full h-full flex items-center justify-center text-ojo-stone/40">
                             <img src={`https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop`} className="w-full h-full object-cover" alt="" />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ojo-mustard opacity-0 group-hover:opacity-100 transition-opacity">Authenticated</p>
                          <h4 className="text-lg font-serif">Heritage Artifact {i}</h4>
                          <p className="text-sm font-mono text-ojo-charcoal/40">₹4,500</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <button className="ojo-btn-primary w-full py-8 !text-sm">
                  Enter The {state.name} Vault
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

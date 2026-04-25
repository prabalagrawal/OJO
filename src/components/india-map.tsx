import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, ShieldCheck, Star, X, Globe } from 'lucide-react';
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
    path: "M140,160...", 
    description: "The desert kingdom where artisans command the language of block printing and precious stones.",
    famousFor: ["Bagru Block Printing", "Sanganeri Prints", "Thewa Jewelry"],
    pattern: "bagru",
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    path: "M100,240...",
    description: "A maritime gateway preserving the geometric complexity of Ajrakh and double-ikat Patola weaves.",
    famousFor: ["Ajrakh Hand-block", "Patola Silk", "Kutch Embroidery"],
    pattern: "ajrakh",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    path: "M160,280...",
    description: "From the Sahyadri ranges to the Deccan, home to Warli cave traditions and Paithani elegance.",
    famousFor: ["Warli Tribal Art", "Paithani Silks", "Himroo Weaving"],
    pattern: "warli",
    img: "https://images.unsplash.com/photo-1599940859674-a7fef12b94a0?q=80&w=2600&auto=format&fit=crop"
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    path: "M400,220...",
    description: "The soul of craftsmanship where Jamdani looms breathe and terracotta tells ancient stories.",
    famousFor: ["Muslin-Jamdani", "Kantha Heritage", "Bankura Terracotta"],
    pattern: "jaali",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    path: "M180,40...",
    description: "A high-altitude sanctuary for the world's most delicate Pashmina and intricate Sozni needlework.",
    famousFor: ["Pashmina & Kani", "Sozni Needlepoint", "Walnut Wood Carving"],
    pattern: "sozni",
    img: "https://images.unsplash.com/photo-1594191543882-626dfca15494?q=80&w=2574&auto=format&fit=crop"
  }
];

export function IndiaExplorer({ onStateClick }: { onStateClick: (state: StateData) => void }) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[16/8] bg-white rounded-[5rem] overflow-hidden border border-ojo-stone/10 shadow-4xl group">
       <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/India_map_blank.svg" className="w-full h-full object-contain p-10 grayscale scale-90" alt="" />
       </div>

       <div className="absolute inset-0 p-20 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-6">
              <span className="ojo-label-verified ojo-label shadow-xl">Provenance Geography 2.0</span>
              <h3 className="text-7xl font-serif italic text-ojo-charcoal leading-none tracking-tighter">OJO India <br /> Explorer.</h3>
              <p className="text-xl text-ojo-charcoal/50 max-w-sm font-light italic leading-relaxed">
                Interact with the clusters. Every state highlighted holds a sovereign trust certificate in our vault.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-ojo-mustard flex items-center justify-center text-ojo-charcoal shadow-lg">
                <Globe size={24} />
              </div>
            </div>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar">
            {STATES_DATA.map((state) => (
              <motion.button
                key={state.id}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onStateClick(state)}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 w-[400px] group p-10 bg-white/40 backdrop-blur-3xl border border-white/50 rounded-[3.5rem] text-left transition-all hover:bg-white hover:shadow-4xl relative overflow-hidden"
              >
                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                   <ArrowRight size={20} className="text-ojo-mustard" />
                </div>
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none transition-all group-hover:opacity-[0.12] duration-700">
                   <MotifSystem type={state.pattern} scale={0.8} />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-ojo-cream border border-ojo-mustard/20 flex items-center justify-center text-ojo-mustard shadow-inner">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard block">Registry {state.id.slice(0,3).toUpperCase()}</span>
                      <h4 className="text-3xl font-serif italic text-ojo-charcoal leading-none pt-1">{state.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-ojo-charcoal/60 leading-relaxed font-light italic line-clamp-2 pr-6">"{state.description}"</p>
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
              className="absolute inset-0 pointer-events-none border-t border-ojo-mustard/20 z-20"
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

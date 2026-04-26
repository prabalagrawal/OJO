import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, ShieldCheck, Star, X, Globe, Info, Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MotifSystem } from './motifs';
import { INDIA_MAP_PATHS, REGIONS_INFO } from '../constants/india-map-paths';
import { api } from '../lib/api.ts';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export function IndiaExplorer({ onStateClick }: { onStateClick?: (state: any) => void }) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [internalSelectedState, setInternalSelectedState] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.get("/products").then(setProducts).catch(() => {});
  }, []);

  const handleStateClick = (stateId: string) => {
    const state = INDIA_MAP_PATHS.find(s => s.id === stateId);
    if (!state) return;
    const info = REGIONS_INFO[state.id] || { famous: [], pattern: 'jaali', description: '' };
    const completeState = { ...state, ...info };
    
    if (onStateClick) {
      onStateClick(completeState);
    } else {
      setInternalSelectedState(completeState);
    }
  };

  const currentSelectedState = internalSelectedState;

  return (
    <div className="relative w-full min-h-[600px] md:aspect-[16/9] bg-white rounded-[3rem] md:rounded-[5rem] overflow-hidden border border-ojo-stone/10 shadow-premium group flex flex-col md:flex-row shadow-2xl ring-1 ring-ojo-stone/5">
       {/* Desktop: Map Interaction (Hidden on Mobile) */}
       <div className="hidden md:flex w-full md:w-2/3 relative flex-col bg-ojo-cream/30">
          <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
            minScale={0.5}
            maxScale={8}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <React.Fragment>
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                   <button onClick={() => zoomIn()} className="p-3 bg-white rounded-full shadow-md hover:bg-ojo-mustard hover:text-white transition-colors" title="Zoom In"><ZoomIn size={18} /></button>
                   <button onClick={() => zoomOut()} className="p-3 bg-white rounded-full shadow-md hover:bg-ojo-mustard hover:text-white transition-colors" title="Zoom Out"><ZoomOut size={18} /></button>
                   <button onClick={() => resetTransform()} className="p-3 bg-white rounded-full shadow-md hover:bg-ojo-mustard hover:text-white transition-colors" title="Reset"><RotateCcw size={18} /></button>
                </div>
                
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center p-10">
                   <IndiaMap handleStateClick={handleStateClick} hoveredState={hoveredState} setHoveredState={setHoveredState} />
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>

          {/* Hover Tooltip */}
          <AnimatePresence>
            {hoveredState && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-10 right-10 p-8 bg-white/90 backdrop-blur-3xl border border-ojo-mustard/20 rounded-[2rem] shadow-4xl pointer-events-none z-50 max-w-[240px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-ojo-mustard text-white rounded-lg">
                    <MapPin size={14} />
                  </div>
                  <h4 className="text-xl font-serif italic">{INDIA_MAP_PATHS.find(s => s.id === hoveredState)?.name}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                   {(REGIONS_INFO[hoveredState]?.famous || []).map((f: string) => (
                     <span key={f} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-ojo-mustard/10 text-ojo-mustard rounded-full">{f}</span>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
       </div>

       {/* Mobile: Heritage List View (Visible on Mobile) */}
       <div className="md:hidden w-full flex-1 overflow-y-auto bg-ojo-cream/30 p-6 overscroll-none">
          <div className="space-y-6">
             <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Heritage Clusters</span>
                <h3 className="text-3xl font-serif italic text-ojo-charcoal">Browse by Region</h3>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {INDIA_MAP_PATHS.map((state) => {
                  const info = REGIONS_INFO[state.id];
                  if (!info) return null; // Only show states with defined heritage info for mobile clarity

                  return (
                    <motion.button
                      key={state.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStateClick(state.id)}
                      className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-ojo-stone/10 shadow-sm text-left group"
                    >
                       <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-ojo-stone/5">
                          {info.img ? (
                            <img src={info.img} alt={state.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ojo-mustard">
                               <MapPin size={24} />
                            </div>
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-serif italic text-ojo-charcoal truncate">{state.name}</h4>
                          <div className="flex gap-2 mt-1">
                             {info.famous.slice(0, 2).map((f: string) => (
                               <span key={f} className="text-[8px] font-black uppercase tracking-widest text-ojo-mustard">{f}</span>
                             ))}
                          </div>
                       </div>
                       <ArrowRight size={16} className="text-ojo-stone/30 group-hover:text-ojo-mustard transform group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  );
                })}
             </div>
          </div>
       </div>

       {/* Right: Legend & Instruction (Hidden on extremely small screens if needed, or made compact) */}
       <div className="w-full md:w-1/3 p-8 md:p-20 flex flex-col justify-between border-l border-ojo-stone/10 bg-white relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
             <MotifSystem type="jaali" scale={0.5} />
          </div>
          
          <div className="space-y-8 md:space-y-12 relative z-10">
            <div className="space-y-4 md:space-y-6">
              <span className="ojo-badge ojo-badge-verified">Provenance Registry 2.0</span>
              <h3 className="text-4xl md:text-6xl font-serif text-ojo-charcoal leading-none tracking-tighter italic">OJO Registry Explorer.</h3>
              <p className="text-base md:text-lg text-ojo-charcoal/50 font-light italic leading-relaxed">
                Interact with the political map. Use mouse wheel to zoom and drag to pan. Click states to audit heritage.
              </p>
            </div>

            <div className="space-y-8 hidden md:block">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ojo-mustard">Cluster Stats</h4>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-ojo-cream rounded-2xl border border-ojo-mustard/10">
                     <span className="text-3xl font-mono text-ojo-charcoal">36</span>
                     <p className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/40">Verified Nodes</p>
                  </div>
                  <div className="p-6 bg-ojo-cream rounded-2xl border border-ojo-mustard/10">
                     <span className="text-3xl font-mono text-ojo-charcoal">{products.length}+</span>
                     <p className="text-[9px] font-black uppercase tracking-widest text-ojo-charcoal/40">Master Crafters</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="pt-8 md:pt-12 relative z-10">
             <div className="flex items-center gap-4 p-6 md:p-8 bg-ojo-charcoal text-white rounded-[2rem] shadow-deep overflow-hidden relative">
                <MotifSystem type="ajrakh" opacity={0.1} />
                <div className="relative z-10 flex items-center gap-4 md:gap-6">
                   <div className="p-3 bg-ojo-mustard rounded-xl text-ojo-charcoal flex-shrink-0">
                      <ShieldCheck size={20} />
                   </div>
                   <p className="text-[10px] md:text-xs font-light italic leading-tight">Zoom into specific clusters to discover hyper-local techniques and GI certificates.</p>
                </div>
             </div>
          </div>
       </div>
    

       {!onStateClick && (
         <StateDrawer 
            state={currentSelectedState} 
            isOpen={!!currentSelectedState} 
            onClose={() => setInternalSelectedState(null)} 
            products={products.filter(p => p.origin === currentSelectedState?.id).slice(0, 4)}
         />
       )}
    </div>
  );
}

const IndiaMap = ({ handleStateClick, hoveredState, setHoveredState }: { handleStateClick: (id: string) => void, hoveredState: string | null, setHoveredState: (id: string | null) => void }) => {
  return (
    <svg 
      viewBox="0 0 500 600" 
      className="w-full h-full max-h-[80vh] drop-shadow-2xl"
    >
      <style>
        {`
          path, g {
            fill: #F5F2E9;
            stroke: #D6D0C4;
            stroke-width: 0.8;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          path:hover, g:hover path {
            fill: #B07E1E !important;
            stroke: #B07E1E;
          }
        `}
      </style>
      {INDIA_MAP_PATHS.map((state) => {
        const isHovered = hoveredState === state.id;
        
        return (
          <path
            key={state.id}
            id={state.id}
            data-name={state.name}
            d={state.path}
            fill={isHovered ? '#B07E1E' : '#F4F1ED'}
            onClick={() => handleStateClick(state.id)}
            onMouseEnter={() => setHoveredState(state.id)}
            onMouseLeave={() => setHoveredState(null)}
          />
        );
      })}
    </svg>
  );
};

export function StateDrawer({ state, isOpen, onClose, products }: { state: any | null, isOpen: boolean, onClose: () => void, products: any[] }) {
  const navigate = useNavigate();
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
            className="fixed inset-0 bg-ojo-charcoal/80 backdrop-blur-xl z-[150]"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 35, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-5xl bg-ojo-cream shadow-deep z-[160] overflow-y-auto selection:bg-ojo-mustard selection:text-white"
          >
            <div className="relative h-[50vh] overflow-hidden">
               <img 
                 src={state.img || "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2670&auto=format&fit=crop"} 
                 className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" 
                 alt={state.name} 
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-ojo-cream via-transparent to-ojo-charcoal/20" />
               
               <button 
                 onClick={onClose}
                 className="absolute top-12 right-12 w-16 h-16 rounded-full bg-white/10 backdrop-blur-3xl flex items-center justify-center border border-white/20 hover:bg-ojo-mustard hover:text-ojo-charcoal transition-all group z-20 shadow-premium"
               >
                 <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
               </button>
               
               <div className="absolute bottom-12 left-12 space-y-4">
                  <div className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none px-8 font-black uppercase tracking-[0.4em]">Node Verified</div>
                  <h2 className="text-7xl md:text-[120px] font-serif italic text-ojo-charcoal tracking-tighter leading-none select-none">{state.name}</h2>
               </div>
            </div>

            <div className="p-12 md:p-24 space-y-32">
               {/* Cultural Story & Core Dossier */}
               <div className="grid md:grid-cols-12 gap-24">
                  <div className="md:col-span-8 space-y-12">
                     <div className="space-y-6">
                        <span className="text-[11px] font-black uppercase tracking-[0.8em] text-ojo-mustard">The Cultural Dossier</span>
                        <h3 className="text-5xl md:text-7xl font-serif italic text-ojo-charcoal tracking-tighter">A Legacy of Origin.</h3>
                     </div>
                     <div className="prose prose-xl font-light italic text-ojo-charcoal/70 leading-relaxed max-w-4xl">
                        <p>
                          {state.description || "Established through centuries of geographic mastery, this cluster represents the pinnacle of artisanal command. Each technique is a localized signature, verified at source to ensure permanent authenticity."}
                        </p>
                        <p className="mt-8 text-xl">
                          The provenance of {state.name} is anchored in its unique ecosystem, where materials and methods merge to create artifacts of sovereign quality.
                        </p>
                     </div>
                  </div>
                  
                  <div className="md:col-span-4 space-y-16">
                     <div className="space-y-8 p-10 bg-white rounded-[3rem] border border-ojo-charcoal/5 shadow-premium relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                           <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-ojo-mustard border-b border-ojo-mustard/10 pb-4">Specialties</h4>
                           <ul className="space-y-6">
                              {(state.famous || []).map((f: string) => (
                                <li key={f} className="flex items-center gap-4 text-xl text-ojo-charcoal italic font-light">
                                  <div className="w-2 h-2 rounded-full bg-ojo-mustard shadow-[0_0_10px_rgba(176,126,30,0.5)]" />
                                  {f}
                                </li>
                              ))}
                           </ul>
                        </div>
                     </div>

                     <div className="space-y-8 p-10 bg-ojo-charcoal text-white rounded-[3rem] shadow-deep">
                        <div className="flex items-center gap-4 text-ojo-mustard">
                           <ShieldCheck size={24} />
                           <span className="text-[11px] font-black uppercase tracking-widest">Sovereign Audit</span>
                        </div>
                        <p className="text-lg font-light italic opacity-70">
                           All artifacts from this node are 100% GI Tagged and verified by OJO master cluster audits.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Product Grid: High Visibility */}
               <div className="space-y-20">
                  <div className="flex items-baseline justify-between border-b border-ojo-charcoal/10 pb-12">
                     <div className="space-y-4">
                        <span className="ojo-badge ojo-badge-verified">Verification Registry</span>
                        <h3 className="text-5xl font-serif italic text-ojo-charcoal tracking-tighter">Sovereign Artifacts.</h3>
                     </div>
                     <button onClick={() => navigate(`/category?origin=${state.id}`)} className="text-[11px] font-black uppercase tracking-widest text-ojo-mustard hover:text-ojo-charcoal transition-colors">Access Full Node</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {products.length === 0 ? (
                       <div className="py-20 text-center col-span-2 italic text-ojo-charcoal/30">No products found for this region in the registry.</div>
                     ) : (
                       products.map((p, idx) => (
                         <motion.div 
                           key={p.id} 
                           whileHover={{ y: -10 }}
                           className="group cursor-pointer space-y-8"
                           onClick={() => navigate(`/product/${p.id}`)}
                         >
                           <div className="aspect-square bg-white rounded-[3rem] overflow-hidden shadow-premium group-hover:shadow-deep transition-all duration-700 relative">
                              <img 
                               src={JSON.parse(p.images || "[]")[0]} 
                               className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000" 
                               alt={p.name} 
                              />
                              <div className="absolute top-6 left-6 flex flex-col gap-2">
                                 {idx === 0 && <div className="ojo-badge !bg-ojo-mustard !text-ojo-charcoal !border-none text-[8px] font-black tracking-widest shadow-lg">MOST POPULAR</div>}
                                 <div className="ojo-badge !bg-white/90 !text-ojo-charcoal !border-none text-[8px] font-black tracking-widest shadow-lg">GI CERTIFIED</div>
                              </div>
                           </div>
                           <div className="px-4 space-y-2">
                              <h4 className="text-3xl font-serif italic text-ojo-charcoal group-hover:text-ojo-mustard transition-colors leading-tight">{p.name}</h4>
                              <p className="text-2xl font-mono text-ojo-mustard font-black italic">₹{p.price.toLocaleString()}</p>
                           </div>
                         </motion.div>
                       ))
                     )}
                  </div>
               </div>

               <div className="pt-20">
                  <button 
                    onClick={() => navigate(`/category?origin=${state.id}`)}
                    className="ojo-btn-primary w-full py-12 !text-[14px] !bg-ojo-charcoal !text-white group hover:!bg-ojo-mustard hover:!text-ojo-charcoal transition-all"
                  >
                     <span className="flex items-center justify-center gap-6">
                        Explore All Records from {state.name}
                        <ArrowRight size={24} className="group-hover:translate-x-6 transition-transform" />
                     </span>
                  </button>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

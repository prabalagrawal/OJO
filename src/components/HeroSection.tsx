import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, PlayCircle } from 'lucide-react';
import { PatternDivider } from './motifs';

export function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#111111]">
      {/* Background Media */}
      <motion.div 
        style={{ y: y1, scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-ojo-charcoal/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1610631652874-88f5835626da?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Artisan hands weaving"
          referrerPolicy="no-referrer"
        />
        {/* Or if we want to simulate video feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/80 via-transparent to-[#111111] z-20" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-center gap-4">
             <div className="h-px w-8 bg-ojo-gold/50" />
             <span className="text-ojo-gold font-black text-[10px] md:text-[12px] uppercase tracking-[0.5em] font-sans">Rooted in India. Built on Trust.</span>
             <div className="h-px w-8 bg-ojo-gold/50" />
          </div>

          <h1 className="text-6xl md:text-[140px] font-serif text-ojo-beige leading-[0.85] font-medium tracking-tighter">
            Where Every Thread <br /> 
            <span className="text-ojo-mustard italic">Tells a Story</span>
          </h1>

          <p className="text-xl md:text-3xl text-ojo-stone font-serif italic max-w-2xl mx-auto opacity-80 leading-relaxed font-light">
             Handcrafted by 500+ verified artisans across the subcontinent
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
            <button 
              onClick={() => document.getElementById('search-discovery')?.scrollIntoView({ behavior: 'smooth' })}
              className="ojo-btn-primary !px-20 !py-6 !text-[14px] !tracking-[0.4em] shadow-2xl hover:!bg-ojo-mustard transition-all group"
            >
              Acquire Craft
              <ChevronDown className="ml-4 group-hover:translate-y-1 transition-transform" />
            </button>
            <button className="px-12 py-5 border-2 border-ojo-gold text-ojo-gold text-[12px] font-black uppercase tracking-[0.4em] hover:bg-ojo-gold hover:text-ojo-charcoal transition-all flex items-center gap-4 group">
               <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
               Meet Our Artisans
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.6em] text-ojo-gold/60">Explore the collective</span>
        <div className="w-px h-12 bg-gradient-to-b from-ojo-gold to-transparent" />
      </motion.div>

      {/* Pattachitra Strip */}
      <div className="absolute bottom-0 inset-x-0 z-40 opacity-30 pointer-events-none">
         <PatternDivider type="floral" />
      </div>

      {/* Decorative OJO Eye fixed on sides */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 opacity-10 hidden xl:block">
         <div className="w-1 h-32 bg-ojo-gold/20" />
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20 opacity-10 hidden xl:block">
         <div className="w-1 h-32 bg-ojo-gold/20" />
      </div>
    </section>
  );
}

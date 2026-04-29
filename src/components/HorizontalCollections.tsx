import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const collections = [
  { id: 1, name: 'Textiles', image: 'https://images.unsplash.com/photo-1582733947702-86111f185790?q=80&w=2070' },
  { id: 2, name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070' },
  { id: 3, name: 'Pottery', image: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=2070' },
  { id: 4, name: 'Paintings', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2070' },
  { id: 5, name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e15cb?q=80&w=2070' },
  { id: 6, name: 'Spices', image: 'https://images.unsplash.com/photo-1596040033221-72cd49ca9ed0?q=80&w=2070' },
  { id: 7, name: 'Leather', image: 'https://images.unsplash.com/photo-1473187326623-41ea533fe4a9?q=80&w=2070' },
  { id: 8, name: 'Wood Craft', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2070' }
];

export function HorizontalCollections() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="collections" className="py-32 bg-ojo-beige/10">
      <div className="max-w-[1440px] mx-auto px-8 mb-16 flex items-end justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-ojo-mustard" />
            <span className="text-ojo-mustard font-black text-[12px] uppercase tracking-[0.5em]">Curation</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-ojo-charcoal leading-none tracking-tighter italic">
            Explore <span className="text-ojo-mustard not-italic">Collections.</span>
          </h2>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={() => scroll('left')}
             className="w-16 h-16 rounded-full border-2 border-ojo-gold text-ojo-gold hover:bg-ojo-gold hover:text-ojo-charcoal transition-all flex items-center justify-center group"
           >
              <ArrowLeft size={24} className="group-active:-translate-x-1 transition-transform" />
           </button>
           <button 
             onClick={() => scroll('right')}
             className="w-16 h-16 rounded-full border-2 border-ojo-gold text-ojo-gold hover:bg-ojo-gold hover:text-ojo-charcoal transition-all flex items-center justify-center group"
           >
              <ArrowRight size={24} className="group-active:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-8 pb-12 snap-x snap-mandatory scrollbar-hide"
      >
        {collections.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -10 }}
            className="flex-shrink-0 w-[400px] aspect-[4/5] relative group cursor-pointer snap-center shadow-premium"
          >
            <div className="absolute inset-0 bg-ojo-charcoal/30 z-10 group-hover:bg-ojo-charcoal/10 transition-colors duration-500" />
            <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} referrerPolicy="no-referrer" />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-10">
               <div className="relative overflow-hidden">
                 <motion.h3 
                   className="text-4xl font-serif text-white italic tracking-tighter"
                 >
                   {item.name}
                 </motion.h3>
                 <div className="h-px w-0 bg-ojo-gold group-hover:w-full transition-all duration-700 mt-2" />
               </div>
               <div className="mt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-ojo-mustard translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  Shop Collection <ArrowRight size={14} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { PatternDivider } from './motifs';

const festivals = [
  { name: 'Diwali', month: [9, 10], icon: '🪔', title: 'The Festival of Lights', color: 'from-ojo-mustard/20 to-ojo-terracotta/20', cta: 'Shop Diwali Lamps' },
  { name: 'Holi', month: [2], icon: '🎨', title: 'The Festival of Colors', color: 'from-pink-500/20 to-yellow-500/20', cta: 'Shop Holi Silks' },
  { name: 'Onam', month: [7, 8], icon: '🛶', title: 'Kerala Heritage Month', color: 'from-green-800/20 to-ojo-beige/20', cta: 'Shop Kasavu Collection' },
  { name: 'Wedding Season', month: [11, 0, 1], icon: '💍', title: 'The Grand Indian Wedding', color: 'from-ojo-red/20 to-ojo-gold/20', cta: 'Bridal Curation' }
];

export function FestiveSection() {
  const currentMonth = new Date().getMonth();
  const currentFestival = festivals.find(f => f.month.includes(currentMonth)) || festivals[3]; // Default to wedding season if no match

  return (
    <section className={`relative py-32 overflow-hidden bg-gradient-to-br ${currentFestival.color}`}>
      <div className="absolute inset-x-0 top-0 opacity-10">
         <PatternDivider type="floral" />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-6 max-w-2xl">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             className="text-6xl md:text-8xl"
           >
             {currentFestival.icon}
           </motion.div>
           <h3 className="text-4xl md:text-7xl font-serif text-ojo-charcoal leading-none tracking-tighter">
             {currentFestival.name} <br />
             <span className="text-ojo-terracotta italic">{currentFestival.title}</span>
           </h3>
           <p className="text-xl text-ojo-stone font-serif italic max-w-xl opacity-60">
             Explore our specially curated seasonal artifacts, handpicked to celebrate this auspicious time with traditional authenticity.
           </p>
           <button className="ojo-btn-primary !px-12 !py-5 shadow-2xl">
              {currentFestival.cta}
           </button>
        </div>

        <div className="relative w-full md:w-1/3 aspect-square bg-white shadow-premium p-4 md:-rotate-3 hover:rotate-0 transition-transform duration-700">
           <img 
             src="https://images.unsplash.com/photo-1542642832-da677ec2e5c9?q=80&w=1000" 
             className="w-full h-full object-cover" 
             alt="Festive items" 
             referrerPolicy="no-referrer"
           />
           <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-ojo-gold text-ojo-charcoal rounded-full flex items-center justify-center p-4 text-[10px] font-black uppercase tracking-widest text-center shadow-xl rotate-12">
              Limited Edition
           </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 opacity-10 rotate-180">
         <PatternDivider type="floral" />
      </div>
    </section>
  );
}

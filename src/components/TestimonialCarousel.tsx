import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Ananya Sharma",
    city: "Mumbai",
    product: "Indigo Block Print Saree",
    quote: "The quality of the weave is something I've never seen before on a mass marketplace. You can truly feel the artisan's touch in every thread. OJO's verification makes all the difference.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200"
  },
  {
    id: 2,
    name: "Vikram Mehta",
    city: "Bangalore",
    product: "Kutch Bell Metal Art",
    quote: "Finding authentic Kutch bells away from the source is hard. OJO brought the village to my doorstep. The sound of the bells is pure, and the story of the artisan was even better.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    city: "New York",
    product: "Pashmina Shawl",
    quote: "I was skeptical about global shipping for something so delicate, but OJO ensured every step. The shawl is a masterpiece of soft geometry. Beautifully tracked from source.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
  }
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-ojo-red min-h-[600px] flex items-center relative overflow-hidden py-32">
       {/* Background Pattern */}
       <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle,transparent_20%,#FFFFFF_20%,#FFFFFF_40%,transparent_40%)] bg-[length:30px_30px]" />
       </div>

       <div className="max-w-[1440px] mx-auto px-8 w-full relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
             <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-ojo-mustard">
                <Quote size={40} fill="currentColor" />
             </div>

             <div className="relative min-h-[300px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                     <h3 className="text-3xl md:text-5xl font-serif italic text-ojo-beige leading-tight">
                        "{testimonials[current].quote}"
                     </h3>

                     <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full border-2 border-ojo-mustard p-1">
                           <img src={testimonials[current].image} className="w-full h-full object-cover rounded-full" alt="" />
                        </div>
                        <div>
                           <p className="text-white font-black text-[12px] uppercase tracking-[0.4em]">{testimonials[current].name}</p>
                           <p className="text-ojo-mustard font-serif italic text-sm">{testimonials[current].city} • Bought {testimonials[current].product}</p>
                        </div>
                        <div className="flex gap-1 text-ojo-mustard">
                           {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                     </div>
                  </motion.div>
                </AnimatePresence>
             </div>

             <div className="flex gap-4">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-500 border border-ojo-mustard ${current === idx ? 'bg-ojo-mustard w-10' : 'bg-transparent'}`}
                  />
                ))}
             </div>
          </div>
       </div>

       {/* Side Controls */}
       <button 
         onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
         className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/20 text-white/20 hover:text-ojo-mustard hover:border-ojo-mustard transition-all hidden lg:flex items-center justify-center group"
       >
          <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
       </button>
       <button 
         onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
         className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/20 text-white/20 hover:text-ojo-mustard hover:border-ojo-mustard transition-all hidden lg:flex items-center justify-center group"
       >
          <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
       </button>
    </section>
  );
}

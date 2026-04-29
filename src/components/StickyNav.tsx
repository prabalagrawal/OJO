import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const sections = [
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'collections', label: 'Collections' },
  { id: 'artisans', label: 'Artisans' },
  { id: 'our-story', label: 'Our Story' },
  { id: 'verified', label: 'Verified' }
];

export function StickyNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800);

      // Check active section
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 400) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 inset-x-0 z-[100] bg-[#111111]/95 backdrop-blur-md border-b border-ojo-stone/10 hidden lg:block"
        >
          <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between h-14">
            <div className="flex items-center gap-12">
               {sections.map((section) => (
                 <button
                   key={section.id}
                   onClick={() => scrollToSection(section.id)}
                   className={`relative text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-4 ${
                     activeSection === section.id ? 'text-ojo-gold' : 'text-ojo-stone hover:text-white'
                   }`}
                 >
                   {section.label}
                   {activeSection === section.id && (
                     <motion.div 
                       layoutId="activeTab"
                       className="absolute bottom-0 inset-x-0 h-0.5 bg-ojo-gold"
                     />
                   )}
                 </button>
               ))}
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-[9px] font-bold text-ojo-stone uppercase tracking-widest italic opacity-40">OJO / EDITIONS / SPRING 2026</span>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="ojo-btn-primary !py-2 !px-6 !text-[9px]"
              >
                Back to Top
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

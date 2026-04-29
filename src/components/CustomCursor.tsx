import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 6);
      mouseY.set(e.clientY - 6);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (typeof window === 'undefined') return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 bg-ojo-gold rounded-full z-[10000] pointer-events-none mix-blend-difference hidden lg:block"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <motion.div 
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-ojo-gold/30 rounded-full blur-sm"
      />
    </motion.div>
  );
}

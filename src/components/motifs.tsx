import React from "react";
import { motion, AnimatePresence } from "motion/react";

type MotifType = 
  | "ajrakh" 
  | "kalamkari" 
  | "jaali" 
  | "mandala"
  | "paisley"
  | "patola"
  | "sozni"
  | "bagru"
  | "warli"
  | "gond"
  | "kolam"
  | "floral";

interface MotifProps {
  type: MotifType;
  opacity?: number;
  className?: string;
}

export const MotifSystem: React.FC<MotifProps & { scale?: number; variant?: "pattern" | "single" }> = ({ 
  type, 
  opacity = 0.04, 
  className = "", 
  scale = 1,
  variant = "pattern"
}) => {
  const patternId = React.useId().replace(/:/g, "");
  const hasTextColor = className.includes("text-");
  
  const motifElements: Record<string, any> = {
    mandala: (
      <g transform={`scale(${2 * scale}) translate(0, 0)`}>
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity} />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.2" strokeOpacity={opacity} strokeDasharray="2 2" />
        {[...Array(12)].map((_, i) => (
          <path
            key={i}
            d="M100 20 Q110 40 100 60 Q90 40 100 20"
            fill="currentColor"
            fillOpacity={opacity * 0.5}
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="10" fill="currentColor" fillOpacity={opacity} />
      </g>
    ),
    // ... we can add others if needed as single elements
  };

  const patterns: Record<string, any> = {
    jaali: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={120 * scale} height={120 * scale} patternUnits="userSpaceOnUse">
        <path d="M60 0 L120 60 L60 120 L0 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity} />
        <path d="M60 20 L100 60 L60 100 L20 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity * 0.5} />
        <circle cx="60" cy="60" r="4" fill="currentColor" fillOpacity={opacity} />
      </pattern>
    ),
    mandala: (
      <pattern id={`pattern-${patternId}`} x="100" y="100" width={400 * scale} height={400 * scale} patternUnits="userSpaceOnUse">
        {motifElements.mandala}
      </pattern>
    ),
    ajrakh: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={80 * scale} height={80 * scale} patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.2" strokeOpacity={opacity} />
        <path d="M40 10 L70 40 L40 70 L10 40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity} />
        <circle cx="40" cy="40" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity={opacity} />
        <path d="M40 30 L45 38 L50 40 L45 42 L40 50 L35 42 L30 40 L35 38 Z" fill="currentColor" fillOpacity={opacity} />
      </pattern>
    ),
    floral: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={200 * scale} height={60 * scale} patternUnits="userSpaceOnUse">
        <path d="M0 30 Q50 10 100 30 T200 30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity} />
        <circle cx="50" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity} />
        <path d="M45 20 Q50 10 55 20 Q50 30 45 20" fill="currentColor" fillOpacity={opacity * 0.5} />
        <circle cx="150" cy="40" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity} />
        <path d="M145 40 Q150 30 155 40 Q150 50 145 40" fill="currentColor" fillOpacity={opacity * 0.5} />
      </pattern>
    ),
    kalamkari: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={150 * scale} height={150 * scale} patternUnits="userSpaceOnUse">
        <path d="M30 70 C30 40 70 40 70 70 S110 100 110 70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity={opacity} />
        <circle cx="70" cy="70" r="8" fill="currentColor" fillOpacity={opacity * 0.5} />
        <path d="M70 62 L75 70 L70 78 L65 70 Z" fill="currentColor" fillOpacity={opacity} />
      </pattern>
    ),
    patola: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={100 * scale} height={100 * scale} patternUnits="userSpaceOnUse">
        <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="currentColor" fillOpacity={opacity} stroke="currentColor" strokeWidth="2" strokeOpacity={opacity * 0.2} />
        <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="white" fillOpacity={0.2} />
      </pattern>
    ),
    sozni: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={120 * scale} height={120 * scale} patternUnits="userSpaceOnUse">
        <path d="M20 60 Q40 20 60 60 T100 60" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity={opacity} />
        <path d="M20 70 Q40 110 60 70 T100 70" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity={opacity} />
        <circle cx="60" cy="65" r="3" fill="currentColor" fillOpacity={opacity} />
      </pattern>
    ),
    paisley: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={140 * scale} height={140 * scale} patternUnits="userSpaceOnUse">
        <path d="M40 100 C10 100 10 70 40 40 C70 10 110 40 100 70 C90 100 70 100 40 100" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity={opacity} />
        <path d="M45 85 C30 85 30 75 45 60 C60 45 75 60 70 75 C65 85 55 85 45 85" fill="currentColor" fillOpacity={opacity * 0.6} />
      </pattern>
    )
  };

  return (
    <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${!hasTextColor ? "text-ojo-charcoal" : ""} ${className}`}>
      <svg width="100%" height="100%" viewBox={variant === "single" ? "0 0 400 400" : undefined}>
        {variant === "pattern" ? (
          <>
            <defs>
              {patterns[type] || patterns.jaali}
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${patternId})`} />
          </>
        ) : (
          <g transform="translate(100, 100)">
            {motifElements[type] || motifElements.mandala}
          </g>
        )}
      </svg>
    </div>
  );
};

export function MandalaHalo({ className = "", scale = 1, opacity = 0.1 }: { className?: string; scale?: number; opacity?: number }) {
  return (
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
    >
      <MotifSystem type="mandala" variant="single" scale={scale} opacity={opacity} />
    </motion.div>
  );
}

export function PatternDivider({ type = "floral", className = "" }: { type?: MotifType; className?: string }) {
  return (
    <div className={`w-full py-16 relative overflow-hidden flex items-center ${className}`}>
      <div className="absolute inset-x-0 h-10 opacity-[0.15] text-ojo-mustard/40">
        <MotifSystem type={type} scale={0.6} opacity={1} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ojo-cream via-transparent to-ojo-cream z-10" />
      <div className="w-full h-px bg-ojo-mustard/20 relative z-20" />
      <div className="absolute left-1/2 -translate-x-1/2 z-30 bg-ojo-cream px-8">
        <div className="w-1.5 h-1.5 bg-ojo-mustard rotate-45" />
      </div>
    </div>
  );
}

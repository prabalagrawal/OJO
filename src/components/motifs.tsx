import React from "react";
import { motion, AnimatePresence } from "motion/react";

type MotifType = 
  | "bagru" 
  | "ajrakh" 
  | "warli" 
  | "gond" 
  | "kolam" 
  | "kalamkari" 
  | "patola" 
  | "jaali" 
  | "sozni" 
  | "paisley";

interface MotifProps {
  type: MotifType;
  opacity?: number;
  className?: string;
}

export const MotifSystem: React.FC<MotifProps & { scale?: number }> = ({ type, opacity = 0.05, className = "", scale = 1 }) => {
  const patternId = React.useId().replace(/:/g, "");
  
  const patterns: Record<string, any> = {
    jaali: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={120 * scale} height={120 * scale} patternUnits="userSpaceOnUse">
        <path d="M60 0 L120 60 L60 120 L0 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity} />
        <path d="M60 20 L100 60 L60 100 L20 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity * 0.5} />
        <circle cx="60" cy="60" r="4" fill="currentColor" fillOpacity={opacity} />
      </pattern>
    ),
    bagru: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={80 * scale} height={80 * scale} patternUnits="userSpaceOnUse">
        <path d="M40 10 Q50 30 40 50 Q30 30 40 10 M20 40 Q40 50 60 40 Q40 30 20 40" fill="currentColor" fillOpacity={opacity} />
        <circle cx="40" cy="40" r="3" fill="currentColor" fillOpacity={opacity * 0.8} />
        <path d="M0 0 L80 80 M80 0 L0 80" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity * 0.2} />
      </pattern>
    ),
    warli: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={100 * scale} height={100 * scale} patternUnits="userSpaceOnUse">
        <path d="M30 40 L40 55 L20 55 Z M30 70 L40 55 L20 55 Z" fill="currentColor" fillOpacity={opacity} />
        <circle cx="30" cy="35" r="4" fill="currentColor" fillOpacity={opacity} />
        <path d="M70 30 L80 45 L60 45 Z M70 60 L80 45 L60 45 Z" fill="currentColor" fillOpacity={opacity * 0.7} />
        <circle cx="70" cy="25" r="4" fill="currentColor" fillOpacity={opacity * 0.7} />
      </pattern>
    ),
    gond: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={100 * scale} height={100 * scale} patternUnits="userSpaceOnUse">
        <path d="M20 20 Q40 10 60 20 Q80 30 60 50 Q40 70 20 50 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" strokeOpacity={opacity} />
        <circle cx="40" cy="35" r="1.5" fill="currentColor" fillOpacity={opacity} />
        <circle cx="50" cy="35" r="1.5" fill="currentColor" fillOpacity={opacity} />
        <circle cx="45" cy="45" r="1.5" fill="currentColor" fillOpacity={opacity} />
      </pattern>
    ),
    kolam: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={80 * scale} height={80 * scale} patternUnits="userSpaceOnUse">
        <circle cx="40" cy="40" r="2" fill="currentColor" fillOpacity={opacity} />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" fillOpacity={opacity * 0.5} />
        <circle cx="60" cy="60" r="1.5" fill="currentColor" fillOpacity={opacity * 0.5} />
        <path d="M40 10 Q60 10 70 40 Q60 70 40 70 Q20 70 10 40 Q20 10 40 10" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity={opacity} />
      </pattern>
    ),
    ajrakh: (
      <pattern id={`pattern-${patternId}`} x="0" y="0" width={120 * scale} height={120 * scale} patternUnits="userSpaceOnUse">
        <rect x="10" y="10" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity} />
        <path d="M60 10 L110 60 L60 110 L10 60 Z" fill="currentColor" fillOpacity={opacity * 0.3} />
        <circle cx="60" cy="60" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity={opacity} />
        <path d="M60 45 L65 55 L75 60 L65 65 L60 75 L55 65 L45 60 L55 55 Z" fill="currentColor" fillOpacity={opacity} />
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
    <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      <svg width="100%" height="100%" className="text-ojo-charcoal">
        <defs>
          {patterns[type] || patterns.jaali}
        </defs>
        <rect width="100%" height="100%" fill={`url(#pattern-${patternId})`} />
      </svg>
    </div>
  );
};

export function PatternDivider({ type = "jaali", className = "" }: { type?: MotifType; className?: string }) {
  return (
    <div className={`w-full py-32 flex items-center justify-center relative overflow-hidden ${className}`}>
      <div className="pattern-divider" />
      <div className="absolute inset-0 bg-gradient-to-r from-ojo-cream via-transparent to-ojo-cream z-10" />
      <div className="relative z-20 flex items-center gap-12">
        <div className="h-px w-32 md:w-48 bg-ojo-mustard/30" />
        <div className="w-16 h-16 rounded-2xl bg-white border border-ojo-mustard/20 flex items-center justify-center rotate-45 transform shadow-xl">
           <div className="w-8 h-8 border-2 border-ojo-mustard/10 rounded-lg -rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-ojo-mustard/40 rounded-full" />
           </div>
        </div>
        <div className="h-px w-32 md:w-48 bg-ojo-mustard/30" />
      </div>
    </div>
  );
}

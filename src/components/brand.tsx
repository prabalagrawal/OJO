import { motion } from "motion/react";

export function OjoLogo({ size = "md", dark = false, className = "" }: { size?: "sm" | "md" | "lg", dark?: boolean, className?: string }) {
  const heights = {
    sm: 28,
    md: 44,
    lg: 72
  };

  const h = heights[size];
  const charcoal = dark ? "#F5F0E6" : "#0A0A0A"; // Solid black for the text
  const red = "#BA251B"; // Deeper red for the bindu
  const gold = "#E6A519"; // Vibrant golden-yellow for the leaves

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Brand Identity: Symbol + Typography */}
      <div className="flex flex-col items-start gap-1">
        {/* Tilak/Bindi Symbol */}
        <div className="flex flex-col items-center ml-[2.4em]">
          <div className="flex gap-0.5 justify-center">
            <div className="w-[0.25em] h-[0.6em] bg-ojo-mustard rounded-full translate-y-[0.1em]" />
            <div className="w-[0.3em] h-[0.8em] bg-ojo-mustard rounded-full" />
            <div className="w-[0.25em] h-[0.6em] bg-ojo-mustard rounded-full translate-y-[0.1em]" />
          </div>
          <div className="w-[0.5em] h-[0.5em] bg-ojo-terracotta rounded-full -mt-[0.2em]" />
        </div>

        {/* Eye-based Typography */}
        <div className="flex items-center -mt-[0.2em]">
          {/* Eye O */}
          <div className="relative flex items-center justify-center">
            <div className="w-[1.8em] h-[1.8em] rounded-full border-[0.35em] border-ojo-charcoal" />
            <div className="absolute w-[0.8em] h-[0.8em] bg-ojo-charcoal rounded-full" />
            <div className="absolute top-[0.4em] right-[0.4em] w-[0.2em] h-[0.2em] bg-white rounded-full" />
          </div>

          {/* Stylized J */}
          <div className="w-[1.2em] h-[2.2em] -mx-[0.1em] relative overflow-hidden -mt-[1.2em]">
             <div className="absolute top-0 right-0 w-[0.35em] h-[2.2em] bg-ojo-charcoal rounded-full" />
             <div className="absolute bottom-0 right-0 w-[1.2em] h-[0.8em] border-b-[0.35em] border-l-[0.35em] border-ojo-charcoal rounded-bl-full" />
          </div>

          {/* Eye O */}
          <div className="relative flex items-center justify-center">
            <div className="w-[1.8em] h-[1.8em] rounded-full border-[0.35em] border-ojo-charcoal" />
            <div className="absolute w-[0.8em] h-[0.8em] bg-ojo-charcoal rounded-full" />
            <div className="absolute top-[0.4em] right-[0.4em] w-[0.2em] h-[0.2em] bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Brand Subtext */}
      {size !== "sm" && (
        <div 
          className="mt-1 flex items-center gap-2 font-sans font-black tracking-[0.2em] uppercase text-ojo-stone/60"
          style={{ fontSize: h * 0.16 }}
        >
          <span>See</span>
          <span className="text-ojo-mustard opacity-50">.</span>
          <span>Verify</span>
          <span className="text-ojo-mustard opacity-50">.</span>
          <span>Trust</span>
        </div>
      )}
    </div>
  );
}

export function VerifiedIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#B07E1E" fillOpacity="0.1" stroke="#B07E1E" strokeWidth="1" />
        <circle cx="12" cy="12" r="6" stroke="#9C5D3C" strokeWidth="1" />
        <circle cx="12" cy="12" r="3" fill="#382C23" />
        <circle cx="13" cy="11" r="0.8" fill="white" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center w-24 h-24 group origin-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        {/* Scalloped Outer Edge (Mustard Gold) */}
        <path 
          d="M50 2
             Q52 2 54 4 L57 3 Q59 3 61 5 L64 4 Q66 4 67 7 L70 6 Q72 6 74 9 L77 8 Q79 9 80 12 L83 11 Q84 12 85 15 L88 15 Q89 16 90 19 L92 20 Q93 21 93 24 L95 26 Q96 27 96 30 L97 32 Q98 34 97 37 L98 39 Q99 41 98 44 L99 47 Q99 50 98 53 L99 56 Q99 59 97 62 L98 64 Q97 67 96 70 L97 73 Q96 76 94 79 L95 82 Q93 85 91 88 L92 90 Q90 92 87 93 L88 95 Q85 96 82 96 L81 98 Q78 98 75 97 L73 98 Q70 98 67 97 L65 98 Q62 98 59 96 L56 97 Q53 96 50 95 L47 96 Q44 96 41 94 L38 95 Q35 94 33 91 L30 92 Q27 91 24 88 L21 89 Q18 87 16 84 L13 85 Q10 83 9 80 L6 81 Q4 78 4 75 L1 73 Q1 70 1 67 L0 65 Q0 62 1 59 L0 56 Q0 53 1 50 L0 47 Q0 44 1 41 L0 38 Q1 35 2 33 L0 30 Q1 27 3 24 L2 21 Q4 18 6 16 L5 13 Q7 10 10 9 L9 6 Q12 4 15 4 L15 1 Q18 0 21 1 L24 0 Q27 1 30 2 L33 1 Q36 2 39 4 L42 3 Q45 4 48 2 Z" 
          fill="#B07E1E" 
        />
        
        {/* Inner Cream Circle */}
        <circle cx="50" cy="50" r="42" fill="#F5F0E6" />
        
        {/* Inner Gold Border */}
        <circle cx="50" cy="50" r="38" stroke="#B07E1E" strokeWidth="0.8" fill="none" />
        
        {/* Badge Content */}
        <g transform="translate(50, 50)" textAnchor="middle" fontFamily="sans-serif">
          {/* Logo 'ojo' */}
          <g transform="translate(0, -28)">
            <text y="0" fontSize="10" fontWeight="900" fill="#382C23" letterSpacing="-0.5">ojo</text>
            <circle cx="-6.4" cy="-3.2" r="1.2" fill="#382C23" />
            <circle cx="6.4" cy="-3.2" r="1.2" fill="#382C23" />
            <circle cx="-6.4" cy="-3.2" r="0.4" fill="white" />
            <circle cx="6.4" cy="-3.2" r="0.4" fill="white" />
          </g>
          
          {/* Divider 1 */}
          <line x1="-15" y1="-20" x2="15" y2="-20" stroke="#B07E1E" strokeWidth="0.3" opacity="0.5" />
          <path d="M-1.5 -21.5 L1.5 -18.5 M-1.5 -18.5 L1.5 -21.5" stroke="#B07E1E" strokeWidth="0.5" transform="translate(0, 0)" />
          <circle cx="0" cy="-20" r="1.2" fill="#F5F0E6" stroke="#B07E1E" strokeWidth="0.3" />
          <circle cx="0" cy="-20" r="0.4" fill="#B07E1E" />

          {/* VERIFIED Text */}
          <text y="-5" fontSize="11" fontWeight="900" fill="#382C23" letterSpacing="0.5">VERIFIED</text>
          
          {/* Divider 2 */}
          <line x1="-15" y1="5" x2="15" y2="5" stroke="#B07E1E" strokeWidth="0.3" opacity="0.5" />
          <circle cx="0" cy="5" r="1.2" fill="#F5F0E6" stroke="#B07E1E" strokeWidth="0.3" />
          <circle cx="0" cy="5" r="0.4" fill="#B07E1E" />
          
          {/* AUTHENTIC & TRUSTED text */}
          <text y="18" fontSize="5" fontWeight="800" fill="#382C23" letterSpacing="0.8">AUTHENTIC</text>
          <text y="24" fontSize="5" fontWeight="800" fill="#382C23" letterSpacing="0.8">& TRUSTED</text>
          
          {/* Bottom Motif */}
          <path d="M-2 32 Q0 28 2 32 Q0 36 -2 32" fill="#B07E1E" opacity="0.6" transform="translate(0, 0)" />
          <circle cx="0" cy="34" r="0.5" fill="#B07E1E" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}

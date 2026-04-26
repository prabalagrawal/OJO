import { motion } from "motion/react";

export function OjoLogo({ size = "md", dark = false }: { size?: "sm" | "md" | "lg", dark?: boolean }) {
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
    <div className="flex flex-col items-center justify-center">
      {/* Logo Mark - Precise recreation of the uploaded design */}
      <svg 
        height={h} 
        viewBox="0 0 500 250" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Tilak Ornament - strictly above the J */}
        <g transform="translate(250, 65)">
          {/* Three golden leaves */}
          <motion.path 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            d="M0 -22 C-7 -35 -7 -55 0 -68 C7 -55 7 -35 0 -22 Z" 
            fill={gold} 
          />
          <motion.path 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            d="M-12 -15 C-25 -20 -45 -22 -58 -18 C-45 -10 -25 -8 -12 -15 Z" 
            fill={gold} 
            transform="rotate(-25, -12, -15)"
          />
          <motion.path 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            d="M12 -15 C25 -20 45 -22 58 -18 C45 -10 25 -8 12 -15 Z" 
            fill={gold} 
            transform="rotate(25, 12, -15)"
          />
          {/* Red Bindu */}
          <circle cx="0" cy="0" r="14" fill={red} />
        </g>

        {/* Eye Left (O) */}
        <g transform="translate(145, 145)">
          <circle cx="0" cy="0" r="82" stroke={charcoal} strokeWidth="32" />
          {/* Pupil */}
          <circle cx="0" cy="0" r="42" fill={charcoal} />
          {/* Reflection */}
          <circle cx="12" cy="-12" r="9" fill="white" />
          {/* Inner Red ring - visible in some versions but keeping it subtle or matching original */}
          <circle cx="0" cy="0" r="66" stroke={red} strokeWidth="2" opacity="0.4" />
        </g>

        {/* The 'j' character */}
        <g transform="translate(250, 145)">
          <path 
            d="M-5 -45 L-5 45 C-5 75 -25 95 -60 95" 
            stroke={charcoal} 
            strokeWidth="32" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          />
        </g>

        {/* Eye Right (O) */}
        <g transform="translate(355, 145)">
          <circle cx="0" cy="0" r="82" stroke={charcoal} strokeWidth="32" />
          {/* Pupil */}
          <circle cx="0" cy="0" r="42" fill={charcoal} />
          {/* Reflection */}
          <circle cx="12" cy="-12" r="9" fill="white" />
          {/* Inner Red ring */}
          <circle cx="0" cy="0" r="66" stroke={red} strokeWidth="2" opacity="0.4" />
        </g>
      </svg>

      {/* Brand Ethos */}
      {size !== "sm" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-4 font-sans font-black tracking-[0.3em] uppercase text-ojo-stone/40"
          style={{ fontSize: h * 0.2 }}
        >
          <span>See</span>
          <div className="w-1.5 h-1.5 rounded-full bg-ojo-mustard" />
          <span>Verify</span>
          <div className="w-1.5 h-1.5 rounded-full bg-ojo-mustard" />
          <span className="text-ojo-mustard">OJO</span>
        </motion.div>
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

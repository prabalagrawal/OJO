import React from "react";

interface MotifProps {
  className?: string;
  size?: number | string;
  color?: string;
  opacity?: number;
}

export const MotifMandala = ({ className, size = 100, color = "currentColor", opacity = 1 }: MotifProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    {/* Central Core */}
    <circle cx="50" cy="50" r="4" fill={color} />
    <circle cx="50" cy="50" r="6" stroke={color} strokeWidth="0.5" />
    
    {/* Layer 1: Small Petals */}
    {[...Array(12)].map((_, i) => (
      <path 
        key={`l1-${i}`}
        d="M50 42 Q52 38 50 34 Q48 38 50 42" 
        fill={color} 
        transform={`rotate(${i * 30} 50 50)`} 
      />
    ))}

    {/* Layer 2: Swirls / Scrolls */}
    {[...Array(18)].map((_, i) => (
      <path 
        key={`l2-${i}`}
        d="M50 35 C55 30 55 25 50 25 C45 25 45 30 50 35" 
        stroke={color} 
        strokeWidth="0.3"
        fill="none"
        transform={`rotate(${i * 20} 50 50)`} 
      />
    ))}

    {/* Layer 3: Intricate Petals */}
    {[...Array(24)].map((_, i) => (
      <path 
        key={`l3-${i}`}
        d="M50 25 L54 18 L50 12 L46 18 Z" 
        stroke={color} 
        strokeWidth="0.5"
        fill={color}
        fillOpacity="0.1"
        transform={`rotate(${i * 15} 50 50)`} 
      />
    ))}

    {/* Layer 4: Outer Sharp Petals (Large) */}
    {[...Array(16)].map((_, i) => (
      <path 
        key={`l4-${i}`}
        d="M50 15 L58 5 L50 -5 L42 5 Z" 
        stroke={color} 
        strokeWidth="0.8"
        fill="none"
        transform={`rotate(${i * 22.5} 50 50)`} 
        className="opacity-80"
      />
    ))}

    {/* Layer 5: Decorative Border dots */}
    {[...Array(32)].map((_, i) => (
      <circle 
        key={`l5-${i}`}
        cx="50" 
        cy="2" 
        r="0.8" 
        fill={color}
        transform={`rotate(${i * 11.25} 50 50)`} 
      />
    ))}
    
    {/* Concentric Guides */}
    <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="0.2" opacity="0.3" />
    <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="0.1" opacity="0.2" />
  </svg>
);

export const MotifLotus = ({ className, size = 100, color = "currentColor", opacity = 1 }: MotifProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <path d="M50 20c5 0 10 15 10 25s-5 25-10 25-10-15-10-25 5-25 10-25z" fill={color} />
    <path d="M65 35c8 5 12 15 8 25s-15 12-23 5 5-25 15-30z" fill={color} opacity="0.7" />
    <path d="M35 35c-8 5-12 15-8 25s15 12 23 5-5-25-15-30z" fill={color} opacity="0.7" />
    <path d="M75 55c5 10 0 20-10 22s-15 -5-15 -15 20 -12 25 -7z" fill={color} opacity="0.4" />
    <path d="M25 55c-5 10 0 20 10 22s15 -5 15 -15-20 -12-25 -7z" fill={color} opacity="0.4" />
  </svg>
);

export const MotifDiamond = ({ className, size = 100, color = "currentColor", opacity = 1 }: MotifProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke={color} strokeWidth="2" />
    <path d="M50 15 L85 50 L50 85 L15 50 Z" stroke={color} strokeWidth="1" strokeDasharray="4 2" />
    <rect x="45" y="45" width="10" height="10" transform="rotate(45 50 50)" fill={color} />
    <circle cx="50" cy="50" r="15" stroke={color} strokeWidth="0.5" opacity="0.3" />
  </svg>
);

export const MotifPaisley = ({ className, size = 100, color = "currentColor", opacity = 1 }: MotifProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <path d="M50 80 C20 80 10 50 40 20 C50 10 70 20 60 40 C55 45 45 45 40 40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="35" cy="65" r="5" fill={color} />
    <circle cx="45" cy="55" r="3" fill={color} opacity="0.6" />
    <path d="M30 75 Q40 85 50 75" stroke={color} strokeWidth="1" />
  </svg>
);

export const MotifOrnamental = ({ className, size = 100, color = "currentColor", opacity = 1 }: MotifProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" stroke={color} strokeWidth="1.5" />
    <circle cx="50" cy="50" r="10" fill={color} />
    <path d="M50 10 V30 M50 70 V90 M10 50 H30 M70 50 H90" stroke={color} strokeWidth="2" />
    <circle cx="50" cy="10" r="3" fill={color} />
    <circle cx="50" cy="90" r="3" fill={color} />
    <circle cx="10" cy="50" r="3" fill={color} />
    <circle cx="90" cy="50" r="3" fill={color} />
  </svg>
);

export const MotifRangoli = ({ className, size = 100, color = "currentColor", opacity = 1 }: MotifProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    {/* Central Flower */}
    <circle cx="50" cy="50" r="5" fill={color} />
    {[...Array(8)].map((_, i) => (
      <circle key={`p-${i}`} cx={50 + 10 * Math.cos(i * 45 * Math.PI / 180)} cy={50 + 10 * Math.sin(i * 45 * Math.PI / 180)} r="4" fill={color} opacity="0.6" />
    ))}
    {/* Interlocking Curves */}
    {[...Array(12)].map((_, i) => (
      <path 
        key={`c-${i}`}
        d="M50 25 Q65 25 75 50 Q65 75 50 75 Q35 75 25 50 Q35 25 50 25" 
        stroke={color} 
        strokeWidth="0.5"
        fill="none"
        transform={`rotate(${i * 30} 50 50)`} 
      />
    ))}
  </svg>
);

export const MotifTraditionalMandala = ({ className, size = 100, color = "currentColor", opacity = 1 }: MotifProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    {/* Base circle */}
    <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="0.5" />
    
    {/* Layer 1: Inner ring of dots */}
    {[...Array(12)].map((_, i) => (
      <circle key={`dot-${i}`} cx={50 + 10 * Math.cos(i * 30 * Math.PI / 180)} cy={50 + 10 * Math.sin(i * 30 * Math.PI / 180)} r="1" fill={color} />
    ))}

    {/* Layer 2: Swirly petals */}
    {[...Array(16)].map((_, i) => (
      <path 
        key={`swirl-${i}`}
        d="M50 35 Q55 25 50 15 Q45 25 50 35" 
        stroke={color} 
        strokeWidth="0.5"
        fill="none"
        transform={`rotate(${i * 22.5} 50 50)`} 
      />
    ))}

    {/* Layer 3: Outer blooming petals */}
    {[...Array(24)].map((_, i) => (
      <path 
        key={`petal-${i}`}
        d="M50 25 L58 15 L50 5 L42 15 Z" 
        stroke={color} 
        strokeWidth="0.3"
        fill={color}
        fillOpacity="0.05"
        transform={`rotate(${i * 15} 50 50)`} 
      />
    ))}

    {/* Decorative accents */}
    {[...Array(8)].map((_, i) => (
      <circle key={`acc-${i}`} cx="50" cy="5" r="1.5" stroke={color} strokeWidth="0.5" transform={`rotate(${i * 45} 50 50)`} />
    ))}
  </svg>
);

export const MotifTraditionalRangoli = ({ className, size = 100, color = "currentColor", opacity = 1 }: MotifProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    {/* Grid Based Rangoli */}
    <circle cx="50" cy="50" r="2" fill={color} />
    {[20, 35, 50, 65, 80].map(x => [20, 35, 50, 65, 80].map(y => (
      <circle key={`dot-${x}-${y}`} cx={x} cy={y} r="1" fill={color} opacity="0.4" />
    )))}
    <path 
      d="M20 50 Q35 35 50 20 Q65 35 80 50 Q65 65 50 80 Q35 65 20 50 Z" 
      stroke={color} 
      strokeWidth="1" 
      fill="none" 
    />
    <path 
      d="M35 50 Q50 35 65 50 Q50 65 35 50" 
      stroke={color} 
      strokeWidth="0.5" 
      fill={color} 
      fillOpacity="0.1" 
    />
    {[0, 90, 180, 270].map(angle => (
      <path 
        key={`a-${angle}`}
        d="M50 20 L60 10 L50 0 L40 10 Z" 
        fill={color} 
        opacity="0.3" 
        transform={`rotate(${angle} 50 50)`} 
      />
    ))}
  </svg>
);

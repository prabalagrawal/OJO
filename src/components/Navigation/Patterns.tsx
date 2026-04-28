import React from 'react';

export const JaliPattern = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <pattern id="jali-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path 
          d="M30 0 L60 30 L30 60 L0 30 Z" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5" 
        />
        <circle cx="30" cy="30" r="2" fill="currentColor" />
        <path 
          d="M0 0 L15 15 M45 45 L60 60 M60 0 L45 15 M15 45 L0 60" 
          stroke="currentColor" 
          strokeWidth="0.5" 
        />
      </pattern>
    </defs>
  </svg>
);

export const PietraDuraBorder = () => (
  <svg width="100%" height="6" preserveAspectRatio="none" className="block">
    <defs>
      <pattern id="pietra-dura" x="0" y="0" width="40" height="6" patternUnits="userSpaceOnUse">
        <rect width="40" height="6" fill="#8B0F1A" />
        {/* Lotus bud motif */}
        <path 
          d="M20,1 Q20,5 17,5 Q20,6 23,5 Q20,5 20,1" 
          fill="#C4AF27" 
        />
        <path 
          d="M10,3 Q12,1 14,3 Q12,5 10,3" 
          fill="#C4AF27" 
          opacity="0.6"
        />
        <path 
          d="M26,3 Q28,1 30,3 Q28,5 26,3" 
          fill="#C4AF27" 
          opacity="0.6"
        />
      </pattern>
    </defs>
    <rect width="100%" height="6" fill="url(#pietra-dura)" />
  </svg>
);

export const KolamBorder = ({ color = "#C4AF27", height = 10 }) => (
  <svg width="100%" height={height} preserveAspectRatio="none" className="block">
    <defs>
      <pattern id="kolam-pattern" x="0" y="0" width="24" height={height} patternUnits="userSpaceOnUse">
        <circle cx="12" cy={height/2} r="1.5" fill={color} />
        <path 
          d={`M0,${height/2} L12,0 L24,${height/2} L12,${height} Z`} 
          fill="none" 
          stroke={color} 
          strokeWidth="0.5" 
          strokeDasharray="1,2"
        />
      </pattern>
    </defs>
    <rect width="100%" height={height} fill="url(#kolam-pattern)" />
  </svg>
);

export const GopuramTrim = () => (
  <svg width="100%" height="8" preserveAspectRatio="none" className="block">
    <defs>
      <pattern id="gopuram-pattern" x="0" y="0" width="20" height="8" patternUnits="userSpaceOnUse">
        <rect width="20" height="8" fill="#C1441A" />
        <path 
          d="M10,1 L14,7 L6,7 Z" 
          fill="#C4AF27" 
        />
        <circle cx="10" cy="0.5" r="0.5" fill="#C4AF27" />
      </pattern>
    </defs>
    <rect width="100%" height="8" fill="url(#gopuram-pattern)" />
  </svg>
);

export const TemplePillar = () => (
  <svg width="4" height="24" viewBox="0 0 4 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
    <rect x="1" y="0" width="2" height="4" fill="#C4AF27" /> {/* Top bracket */}
    <path d="M0 4L4 4L3 6L1 6L0 4Z" fill="#C4AF27" />
    <rect x="1.5" y="6" width="1" height="14" fill="#C4AF27" /> {/* Shaft */}
    <rect x="0.5" y="20" width="3" height="4" fill="#C4AF27" /> {/* Base */}
  </svg>
);

export const MughalArchEdge = () => {
  const archWidth = 40; 
  const numArches = 50; 
  const h = 8;
  let pathD = `M0,${h} `;
  
  for (let i = 0; i < numArches; i++) {
    const s = i * archWidth;
    const w = archWidth;
    // Rhythmic cusped arch with pronounced foils
    pathD += `L${s},${h} 
              Q${s + w*0.1},${h} ${s + w*0.15},${h*0.5} 
              Q${s + w*0.2},0 ${s + w*0.3},${h*0.4} 
              Q${s + w*0.4},0 ${s + w*0.5},0 
              Q${s + w*0.6},0 ${s + w*0.7},${h*0.4} 
              Q${s + w*0.8},0 ${s + w*0.85},${h*0.5} 
              Q${s + w*0.9},${h} ${s + w},${h} `;
  }
  
  pathD += `L${numArches * archWidth},${h} L0,${h} Z`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${numArches * archWidth} ${h}`} preserveAspectRatio="none" className="block overflow-visible">
      <path d={pathD} fill="#C4AF27" />
      <path d={pathD} fill="none" stroke="#C4AF27" strokeWidth="0.3" transform="translate(0, -0.5)" opacity="0.4" />
    </svg>
  );
};

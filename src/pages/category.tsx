import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  Loader2,
  X,
  LayoutGrid,
  List,
  Award,
  Zap,
  TrendingUp,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { QuickViewModal } from "../components/quick-view-modal.tsx";
import { MiniQuickView } from "../components/MiniQuickView.tsx";
import { MotifSystem } from "../components/motifs.tsx";
import { ProductGrid } from "../components/Product/ProductGrid";
import React from "react";

export function CategoryPage() {
  return (
    <div className="min-h-screen bg-ojo-beige/30 pt-24 md:pt-32">
      {/* Hero Section */}
      <div className="bg-white border-b border-ojo-stone/10 py-16 md:py-24 px-8 md:px-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <MotifSystem type="jaali" scale={2} />
        </div>
        <div className="max-w-[1440px] mx-auto space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-ojo-gold" />
            <span className="text-ojo-gold font-black text-[11px] uppercase tracking-[0.4em]">Heritage Collective</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif text-ojo-charcoal leading-none tracking-tighter italic">
            The Artisan <span className="text-ojo-mustard not-italic">Archive.</span>
          </h1>
          <p className="text-lg md:text-2xl text-ojo-stone font-serif italic max-w-2xl opacity-60">
            A curated selection of India's most profound craftsmanship, verified for authenticity and origin.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <ProductGrid />
      
      {/* Decorative Footer Spacer */}
      <div className="h-40 relative overflow-hidden opacity-20">
         <MotifSystem type="kolam" scale={2} />
      </div>
    </div>
  );
}


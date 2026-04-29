import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  ChevronDown, 
  Search, 
  SlidersHorizontal,
  X 
} from 'lucide-react';
import { Product, PRODUCT_DATASET } from '../../data/product-dataset';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from './SkeletonCard';
import { QuickViewModal } from './QuickViewModal';
import { BottomSheet } from '../bottom-sheet';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest' | 'reviews' | 'bestsellers';

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setProducts(PRODUCT_DATASET);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => Array.from(new Set(PRODUCT_DATASET.map(p => p.category))), []);
  const regions = useMemo(() => Array.from(new Set(PRODUCT_DATASET.map(p => p.origin))), []);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(p.origin);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesRegion && matchesPrice;
    });

    // Sorting
    switch (sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'bestsellers': result.sort((a, b) => b.popularity_score - a.popularity_score); break;
      case 'newest': result.reverse(); break; // Simple reverse for demo
      default: break;
    }

    return result;
  }, [products, searchQuery, selectedCategories, priceRange, selectedRegions, sort]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const FilterContent = () => (
    <div className="space-y-10">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-stone">Ancestral Categories</h4>
        <div className="flex flex-col gap-3">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <div className={`w-4 h-4 border transition-all ${selectedCategories.includes(cat) ? 'bg-ojo-gold border-ojo-gold cursor-check' : 'border-ojo-stone/20 group-hover:border-ojo-gold'}`}>
                {selectedCategories.includes(cat) && <div className="text-white text-[10px] flex items-center justify-center h-full">✓</div>}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${selectedCategories.includes(cat) ? 'text-ojo-charcoal' : 'text-ojo-stone hover:text-ojo-gold'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-stone">Origin Regions</h4>
        <div className="grid grid-cols-2 gap-2">
          {regions.slice(0, 8).map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegions(prev => 
                prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
              )}
              className={`px-3 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all truncate text-left ${
                selectedRegions.includes(region) ? 'border-ojo-gold bg-ojo-gold/5 text-ojo-gold' : 'border-ojo-stone/10 text-ojo-stone hover:border-ojo-stone'
              }`}
            >
              {region.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ojo-stone">Heritage Valuation</h4>
        <div className="space-y-4">
          <input 
            type="range" 
            min="0" 
            max="100000" 
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full accent-ojo-gold h-1 bg-ojo-stone/10 appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-black tracking-widest text-ojo-charcoal font-sans">
            <span>₹0</span>
            <span>Up to ₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => {
          setSelectedCategories([]);
          setSelectedRegions([]);
          setPriceRange([0, 100000]);
        }}
        className="w-full py-4 text-[9px] font-black uppercase tracking-[0.4em] text-ojo-stone border border-ojo-stone/10 hover:border-ojo-red hover:text-ojo-red transition-all"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-fit">
          <div className="flex items-center gap-4 mb-12">
             <Filter size={18} className="text-ojo-gold" />
             <h3 className="text-xl font-serif text-ojo-charcoal italic">Refine Heritage</h3>
          </div>
          <FilterContent />
        </aside>

        <div className="flex-grow space-y-12">
          {/* SORT & SEARCH BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-ojo-stone/10">
            <div className="flex flex-col gap-2 w-full md:w-auto">
               <span className="text-[10px] font-bold uppercase tracking-widest text-ojo-stone/60">
                 Showing {displayedProducts.length} of {filteredProducts.length} masterpieces
               </span>
               <div className="flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-widest">
                  <span className="text-ojo-stone/40">Sort by:</span>
                  {(['relevance', 'price-low', 'price-high', 'newest', 'bestsellers'] as SortOption[]).map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setSort(opt)}
                      className={`transition-colors hover:text-ojo-gold ${sort === opt ? 'text-ojo-gold' : 'text-ojo-charcoal'}`}
                    >
                      {opt.replace('-', ' ')}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ojo-stone/40" size={16} />
                <input 
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-ojo-beige/20 border border-ojo-stone/10 py-3 pl-12 pr-4 text-[12px] font-bold uppercase tracking-widest focus:border-ojo-gold outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden p-3 bg-ojo-gold text-ojo-charcoal hover:bg-[#A89520] transition-all"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              displayedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={handleQuickView} 
                />
              ))
            )}
          </div>

          {/* LOAD MORE */}
          {visibleCount < filteredProducts.length && (
            <div className="pt-20 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="ojo-btn-primary !px-20 !py-6 shadow-2xl hover:scale-105"
              >
                Reveal More Antiquities
              </button>
            </div>
          )}

          {visibleCount >= filteredProducts.length && filteredProducts.length > 0 && (
            <div className="pt-20 flex flex-col items-center gap-4">
              <div className="h-px w-20 bg-ojo-gold/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ojo-stone/40">The End of this Chapter</span>
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-ojo-beige flex items-center justify-center rounded-full">
                <Search size={32} className="text-ojo-stone/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif italic text-ojo-charcoal">No Treasures Found</h3>
                <p className="text-sm text-ojo-stone uppercase tracking-widest font-black max-w-xs">
                  Your current filters did not reveal any artifacts. Try expanding your horizons.
                </p>
              </div>
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedRegions([]);
                  setSearchQuery('');
                  setPriceRange([0, 100000]);
                }}
                className="ojo-btn-outline"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS */}
      <BottomSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        title="Refine Collection"
      >
        <FilterContent />
      </BottomSheet>

      {/* QUICK VIEW MODAL */}
      <QuickViewModal 
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
